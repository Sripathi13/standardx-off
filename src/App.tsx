import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { CreateProjectView } from './views/CreateProjectView';
import { HouseOwnersView } from './views/HouseOwnersView';
import { CartView } from './views/CartView';
import { QuotationView } from './views/QuotationView';
import { BisStandardsView } from './views/BisStandardsView';
import { MarketplaceView } from './views/MarketplaceView';
import { MyProjectsView } from './views/MyProjectsView';
import { AboutView } from './views/AboutView';
import { ProfileView } from './views/ProfileView';
import { DocumentationView } from './views/DocumentationView';
import { ProcurementOfficerPortalView } from './views/ProcurementOfficerPortalView';

import { ProjectRecord, CartItem, QuotationRecord, LogisticsConfig } from './types';
import { INITIAL_SAMPLE_PROJECTS } from './data/sampleProjects';
import { getRecommendedProductsForMaterial } from './data/productsDatabase';
import { sanitizeProduct, sanitizeCartItem } from './utils/qualitySanitizer';

export default function App() {
  // Navigation state
  const [currentView, setCurrentView] = useState<string>('home');

  // Projects state
  const [projects, setProjects] = useState<ProjectRecord[]>(() => {
    try {
      const saved = localStorage.getItem('standardx_projects');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved projects from localStorage', e);
    }
    return INITIAL_SAMPLE_PROJECTS;
  });

  const [activeProject, setActiveProject] = useState<ProjectRecord | null>(projects[0] || null);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('standardx_cart');
      if (saved) {
        const parsed: CartItem[] = JSON.parse(saved);
        return parsed.map(sanitizeCartItem);
      }
    } catch (e) {
      console.warn('Could not read cart from localStorage', e);
    }

    // Default initial cart populated from the first sample project
    if (INITIAL_SAMPLE_PROJECTS.length > 0) {
      const sampleP = INITIAL_SAMPLE_PROJECTS[0];
      return sampleP.requiredMaterials.slice(0, 4).map((m) => {
        const prods = getRecommendedProductsForMaterial(m.category);
        const prod = sanitizeProduct(prods[0]);
        return sanitizeCartItem({
          id: `initial-cart-${m.materialId}`,
          projectId: sampleP.id,
          projectName: sampleP.name,
          materialCategory: m.category,
          materialName: m.name,
          product: prod,
          quantity: m.editableQuantity,
          unit: prod.unit,
          unitPrice: prod.unitPrice,
          totalCost: m.editableQuantity * prod.unitPrice,
          wastageFactorPct: m.wastageFactorPct
        });
      });
    }
    return [];
  });

  // Quotation state
  const [activeQuotation, setActiveQuotation] = useState<QuotationRecord | null>(() => {
    // Generate an initial realistic quotation from the sample project
    if (INITIAL_SAMPLE_PROJECTS.length > 0) {
      const p = INITIAL_SAMPLE_PROJECTS[0];
      const items = p.requiredMaterials.map((m) => {
        const prods = getRecommendedProductsForMaterial(m.category);
        const prod = sanitizeProduct(prods[0]);
        return sanitizeCartItem({
          id: `quot-init-${m.materialId}`,
          projectId: p.id,
          projectName: p.name,
          materialCategory: m.category,
          materialName: m.name,
          product: prod,
          quantity: m.editableQuantity,
          unit: prod.unit,
          unitPrice: prod.unitPrice,
          totalCost: m.editableQuantity * prod.unitPrice,
          wastageFactorPct: m.wastageFactorPct
        });
      });

      const raw = items.reduce((acc, i) => acc + i.totalCost, 0);
      const transport = raw * 0.045;
      const labor = raw * 0.18;
      const contingency = (raw + transport + labor) * 0.05;
      const preTax = raw + transport + labor + contingency;
      const gst = preTax * 0.18;

      return {
        id: 'quot-init-1',
        quotationNumber: 'SX-QUOT-2026-8941',
        projectId: p.id,
        projectName: p.name,
        category: p.category,
        location: `${p.location}, ${p.stateCity}`,
        date: new Date().toISOString().split('T')[0],
        items,
        financials: {
          rawMaterialsTotal: raw,
          transportationCost: transport,
          laborCost: labor,
          contingencyCost: contingency,
          taxGst: gst,
          grandTotal: preTax + gst
        },
        hasIncompleteWarning: false,
        missingMaterials: []
      };
    }
    return null;
  });

  // Persist projects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('standardx_projects', JSON.stringify(projects));
    } catch (e) {
      // storage might be quota full or disabled in sandbox
    }
  }, [projects]);

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('standardx_cart', JSON.stringify(cartItems));
    } catch (e) {
      // fallback
    }
  }, [cartItems]);

  // Navigation handler
  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save new project
  const handleSaveProject = (newProject: ProjectRecord) => {
    setProjects((prev) => [newProject, ...prev.filter((p) => p.id !== newProject.id)]);
    setActiveProject(newProject);
  };

  // Add items to cart
  const handleAddToCart = (newItems: CartItem[]) => {
    const cleanItems = newItems.map(sanitizeCartItem);
    setCartItems((prev) => {
      const updated = [...prev];
      cleanItems.forEach((newItem) => {
        const existingIdx = updated.findIndex(
          (item) => item.product.id === newItem.product.id && item.materialCategory === newItem.materialCategory
        );
        if (existingIdx >= 0) {
          updated[existingIdx].quantity += newItem.quantity;
          updated[existingIdx].totalCost = updated[existingIdx].quantity * updated[existingIdx].unitPrice;
        } else {
          updated.push(newItem);
        }
      });
      return updated;
    });
  };

  // Update Cart Quantity
  const handleUpdateCartQuantity = (id: string, newQty: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, newQty), totalCost: Math.max(1, newQty) * item.unitPrice }
          : item
      )
    );
  };

  // Remove single Cart Item
  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear Cart
  const handleClearCart = () => {
    setCartItems([]);
  };

  // Generate Quotation from Cart
  const handleGenerateQuotation = (config: LogisticsConfig) => {
    const rawTotal = cartItems.reduce((acc, i) => acc + i.totalCost, 0);
    const transport = config.includeTransportation ? rawTotal * (config.transportationCostPct / 100) : 0;
    const labor = config.includeLabor ? rawTotal * (config.laborCostPct / 100) : 0;
    const contingency = config.includeContingency ? (rawTotal + transport + labor) * (config.contingencyPct / 100) : 0;
    const preTax = rawTotal + transport + labor + contingency;
    const gst = config.includeTax ? preTax * (config.taxGstPct / 100) : 0;
    const grandTotal = preTax + gst;

    // Detect if missing materials in active project
    let hasIncomplete = false;
    let missing: string[] = [];
    if (activeProject) {
      const requiredCategories = activeProject.requiredMaterials.map((m) => m.category);
      const cartCategories = new Set(cartItems.map((c) => c.materialCategory));
      missing = requiredCategories.filter((cat) => !cartCategories.has(cat));
      hasIncomplete = missing.length > 0;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newQuot: QuotationRecord = {
      id: `quot-${Date.now()}`,
      quotationNumber: `SX-QUOT-2026-${randomSuffix}`,
      projectId: activeProject ? activeProject.id : 'standalone-procurement',
      projectName: activeProject ? activeProject.name : 'Direct Material Procurement',
      category: activeProject ? activeProject.category : 'building',
      location: activeProject ? `${activeProject.location}, ${activeProject.stateCity}` : 'Site Delivery Depot',
      date: new Date().toISOString().split('T')[0],
      items: cartItems.map(sanitizeCartItem),
      financials: {
        rawMaterialsTotal: rawTotal,
        transportationCost: transport,
        laborCost: labor,
        contingencyCost: contingency,
        taxGst: gst,
        grandTotal
      },
      hasIncompleteWarning: hasIncomplete,
      missingMaterials: missing
    };

    setActiveQuotation(newQuot);
    setCurrentView('quotations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select project from My Projects
  const handleSelectProject = (project: ProjectRecord) => {
    setActiveProject(project);

    // Populate cart with this project's selected materials
    const items = project.requiredMaterials.map((m) => {
      const selId = project.selectedProducts[m.category];
      const prods = getRecommendedProductsForMaterial(m.category);
      const prod = prods.find((p) => p.id === selId) || prods[0];
      return {
        id: `cart-sel-${project.id}-${m.materialId}`,
        projectId: project.id,
        projectName: project.name,
        materialCategory: m.category,
        materialName: m.name,
        product: prod,
        quantity: m.editableQuantity,
        unit: prod.unit,
        unitPrice: prod.unitPrice,
        totalCost: m.editableQuantity * prod.unitPrice,
        wastageFactorPct: m.wastageFactorPct
      };
    });

    setCartItems(items);
    setCurrentView('cart');
  };

  // Delete project
  const handleDeleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    if (activeProject?.id === projectId) {
      setActiveProject(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-amber-400 selection:text-slate-900 overflow-x-hidden w-full max-w-full">
      {/* Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        cartCount={cartItems.length}
        activeProjectName={activeProject?.name}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {currentView === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'create-project' && (
          <CreateProjectView
            onSaveProject={handleSaveProject}
            onAddToCart={handleAddToCart}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'house-owners' && (
          <HouseOwnersView
            onSaveProject={handleSaveProject}
            onAddToCart={handleAddToCart}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'cart' && (
          <CartView
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onClearCart={handleClearCart}
            onGenerateQuotation={handleGenerateQuotation}
            onNavigate={handleNavigate}
            activeProjectName={activeProject?.name}
            hasIncompleteWarning={activeQuotation?.hasIncompleteWarning}
          />
        )}

        {currentView === 'quotations' && (
          <QuotationView
            quotation={activeQuotation}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'bis-standards' && (
          <BisStandardsView />
        )}

        {currentView === 'marketplace' && (
          <MarketplaceView
            onAddToCart={handleAddToCart}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'my-projects' && (
          <MyProjectsView
            projects={projects}
            onSelectProject={handleSelectProject}
            onDeleteProject={handleDeleteProject}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'about' && (
          <AboutView
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'docs' && (
          <DocumentationView
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'procurement-portal' && (
          <ProcurementOfficerPortalView
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'profile' && (
          <ProfileView />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

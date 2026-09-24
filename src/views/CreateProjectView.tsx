import React, { useState } from 'react';
import { 
  Building2, 
  TrendingUp, 
  Layers, 
  HardHat, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  AlertTriangle, 
  Calculator, 
  ShieldCheck, 
  Award, 
  Zap, 
  Sliders, 
  Scale, 
  Edit3, 
  ShoppingCart, 
  FileText,
  Info,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { 
  ProjectCategory, 
  BuildingType, 
  StructuralSystem, 
  RoadType, 
  PavementType,
  MaterialRequirement,
  RecommendedProduct,
  ProjectRecord
} from '../types';
import { 
  estimateBuildingMaterials, 
  estimateRoadMaterials, 
  estimateBridgeMaterials 
} from '../services/estimationEngine';
import { getRecommendedProductsForMaterial } from '../data/productsDatabase';
import { MissingMaterialsModal } from '../components/MissingMaterialsModal';
import { ProductCompareModal } from '../components/ProductCompareModal';
import { BisDetailModal } from '../components/BisDetailModal';
import { BIS_STANDARDS_LIBRARY } from '../data/bisStandards';
import { TenderDocumentUpload } from '../components/TenderDocumentUpload';
import { ExtractedTenderRequirement } from '../services/tenderExtractionService';
import { sanitizeProductName, sanitizeQualitySpec, sanitizeProduct, sanitizeCartItem } from '../utils/qualitySanitizer';

interface CreateProjectViewProps {
  onSaveProject: (project: ProjectRecord) => void;
  onAddToCart: (items: any[]) => void;
  onNavigate: (view: string) => void;
}

export const CreateProjectView: React.FC<CreateProjectViewProps> = ({
  onSaveProject,
  onAddToCart,
  onNavigate
}) => {
  // Wizard steps: 1: General Details, 2: Dimensions & Engineering Inputs, 3: Estimation & Editable Quantities, 4: 3-Product Recommendation & Selection, 5: Review & Confirm
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: General Project Details
  const [extractedTender, setExtractedTender] = useState<ExtractedTenderRequirement | null>(null);
  const [appliedTenderAlert, setAppliedTenderAlert] = useState<{ title: string; category: string } | null>(null);
  const [projectName, setProjectName] = useState('Metro North Business Arcade');
  const [location, setLocation] = useState('Ring Road Phase 2');
  const [stateCity, setStateCity] = useState('Indore, Madhya Pradesh');
  const [description, setDescription] = useState('RCC Framed commercial and retail complex designed for seismic zone II.');
  const [category, setCategory] = useState<ProjectCategory>('building');

  // Step 2: Building Inputs
  const [builtUpArea, setBuiltUpArea] = useState<number>(4500);
  const [areaPerFloor, setAreaPerFloor] = useState<number>(1500);
  const [numFloors, setNumFloors] = useState<number>(3);
  const [floorHeightM, setFloorHeightM] = useState<number>(3.3);
  const [buildingType, setBuildingType] = useState<BuildingType>('Commercial Building');
  const [structuralSystem, setStructuralSystem] = useState<StructuralSystem>('RCC Framed Structure');
  const [roofType, setRoofType] = useState<string>('RCC Flat Slab');
  const [constructionStage, setConstructionStage] = useState<'Foundation' | 'Plinth' | 'Superstructure' | 'Finishing' | 'Full Project'>('Full Project');
  const [additionalDetails, setAdditionalDetails] = useState('');

  // Step 2: Road Inputs
  const [roadName, setRoadName] = useState('Indore Ring Road Bypass Extension');
  const [roadLengthKm, setRoadLengthKm] = useState<number>(2.5);
  const [roadWidthM, setRoadWidthM] = useState<number>(12.0);
  const [roadThicknessMm, setRoadThicknessMm] = useState<number>(115);
  const [roadType, setRoadType] = useState<RoadType>('Highway');
  const [pavementType, setPavementType] = useState<PavementType>('Flexible Pavement');
  const [roadLanes, setRoadLanes] = useState<number>(4);
  const [subgradeCbr, setSubgradeCbr] = useState<number>(8);
  const [soilSubgradeInfo, setSoilSubgradeInfo] = useState('MoRTH approved compacted gravel subgrade with 8% soaked CBR.');

  // Step 2: Bridge Inputs
  const [spanLengthM, setSpanLengthM] = useState<number>(45);
  const [deckWidthM, setDeckWidthM] = useState<number>(11.5);
  const [pierHeightM, setPierHeightM] = useState<number>(6.5);

  const handleApplyTenderRequirements = (tender: ExtractedTenderRequirement) => {
    setExtractedTender(tender);
    if (tender.projectName) setProjectName(tender.projectName);
    if (tender.location) setLocation(tender.location);
    if (tender.stateCity) setStateCity(tender.stateCity);
    if (tender.description) setDescription(tender.description);
    if (tender.category) setCategory(tender.category);

    if (tender.buildingSpecs) {
      if (tender.buildingSpecs.builtUpArea) setBuiltUpArea(tender.buildingSpecs.builtUpArea);
      if (tender.buildingSpecs.numFloors) setNumFloors(tender.buildingSpecs.numFloors);
      if (tender.buildingSpecs.areaPerFloor) setAreaPerFloor(tender.buildingSpecs.areaPerFloor);
      if (tender.buildingSpecs.floorHeightM) setFloorHeightM(tender.buildingSpecs.floorHeightM);
      if (tender.buildingSpecs.buildingType) setBuildingType(tender.buildingSpecs.buildingType as BuildingType);
      if (tender.buildingSpecs.structuralSystem) setStructuralSystem(tender.buildingSpecs.structuralSystem as StructuralSystem);
      if (tender.buildingSpecs.roofType) setRoofType(tender.buildingSpecs.roofType);
    }

    if (tender.roadSpecs) {
      setRoadName(tender.projectName);
      if (tender.roadSpecs.roadLengthKm) setRoadLengthKm(tender.roadSpecs.roadLengthKm);
      if (tender.roadSpecs.roadWidthM) setRoadWidthM(tender.roadSpecs.roadWidthM);
      if (tender.roadSpecs.roadThicknessMm) setRoadThicknessMm(tender.roadSpecs.roadThicknessMm);
      if (tender.roadSpecs.roadType) setRoadType(tender.roadSpecs.roadType as RoadType);
      if (tender.roadSpecs.pavementType) setPavementType(tender.roadSpecs.pavementType as PavementType);
      if (tender.roadSpecs.roadLanes) setRoadLanes(tender.roadSpecs.roadLanes);
      if (tender.roadSpecs.subgradeCbr) setSubgradeCbr(tender.roadSpecs.subgradeCbr);
      if (tender.roadSpecs.soilSubgradeInfo) setSoilSubgradeInfo(tender.roadSpecs.soilSubgradeInfo);
    }

    if (tender.bridgeSpecs) {
      if (tender.bridgeSpecs.spanLengthM) setSpanLengthM(tender.bridgeSpecs.spanLengthM);
      if (tender.bridgeSpecs.deckWidthM) setDeckWidthM(tender.bridgeSpecs.deckWidthM);
      if (tender.bridgeSpecs.pierHeightM) setPierHeightM(tender.bridgeSpecs.pierHeightM);
    }

    setAppliedTenderAlert({
      title: tender.projectName,
      category: tender.category
    });
  };

  // Step 3: Estimated Materials
  const [calculatedMaterials, setCalculatedMaterials] = useState<MaterialRequirement[]>([]);

  // Step 4: Product Selections: materialCategory -> selectedProductId
  const [selectedProducts, setSelectedProducts] = useState<Record<string, string>>({});

  // Modals state
  const [isMissingModalOpen, setIsMissingModalOpen] = useState(false);
  const [missingMaterialsList, setMissingMaterialsList] = useState<string[]>([]);
  const [compareModalData, setCompareModalData] = useState<{
    isOpen: boolean;
    materialName: string;
    quantity: number;
    unit: string;
    products: RecommendedProduct[];
    category: string;
  }>({
    isOpen: false,
    materialName: '',
    quantity: 0,
    unit: '',
    products: [],
    category: ''
  });
  const [bisModalData, setBisModalData] = useState<{
    isOpen: boolean;
    standard: any | null;
  }>({
    isOpen: false,
    standard: null
  });

  // Calculate or recalculate materials
  const runEstimation = () => {
    let mats: MaterialRequirement[] = [];
    if (category === 'building') {
      mats = estimateBuildingMaterials({
        buildingName: projectName,
        location,
        stateCity,
        totalBuiltUpAreaSqFt: builtUpArea,
        areaPerFloorSqFt: areaPerFloor,
        numFloors,
        floorHeightM,
        buildingType,
        structuralSystem,
        roofType,
        constructionStage,
        additionalDetails
      });
    } else if (category === 'road') {
      mats = estimateRoadMaterials({
        roadName: projectName,
        lengthKm: roadLengthKm,
        widthM: roadWidthM,
        thicknessMm: roadThicknessMm,
        roadType,
        pavementType,
        lanes: roadLanes,
        subgradeCbrPct: subgradeCbr,
        trafficMsa: 40,
        soilSubgradeInfo,
        additionalDetails
      });
    } else if (category === 'bridge') {
      mats = estimateBridgeMaterials({
        bridgeName: projectName,
        location,
        spanLengthM,
        deckWidthM,
        pierHeightM,
        bridgeType: 'RCC Girder Bridge',
        designLoad: 'IRC Class 70R',
        additionalDetails
      });
    } else {
      // General building fallback
      mats = estimateBuildingMaterials({
        buildingName: projectName,
        location,
        stateCity,
        totalBuiltUpAreaSqFt: builtUpArea,
        areaPerFloorSqFt: areaPerFloor,
        numFloors,
        floorHeightM,
        buildingType: 'Other',
        structuralSystem: 'RCC Framed Structure',
        roofType: 'RCC Flat Slab',
        constructionStage: 'Full Project'
      });
    }

    setCalculatedMaterials(mats);
    setCurrentStep(3);
  };

  // Handle quantity editing by user
  const handleQuantityChange = (materialId: string, newQty: number) => {
    setCalculatedMaterials((prev) =>
      prev.map((m) =>
        m.materialId === materialId
          ? { ...m, editableQuantity: Math.max(0, newQty), isOverridden: true }
          : m
      )
    );
  };

  // Handle product selection (exactly one per material)
  const handleSelectProduct = (materialCategory: string, productId: string) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [materialCategory]: productId
    }));
  };

  // Check missing materials before moving to review/cart
  const handleProceedToReview = () => {
    const requiredCategories = calculatedMaterials.map((m) => m.category);
    const missing = requiredCategories.filter((cat) => !selectedProducts[cat]);

    if (missing.length > 0) {
      // Map to human readable names
      const missingNames = missing.map((cat) => {
        const found = calculatedMaterials.find((m) => m.category === cat);
        return found ? found.name : cat;
      });
      setMissingMaterialsList(missingNames);
      setIsMissingModalOpen(true);
    } else {
      setCurrentStep(5);
    }
  };

  // User clicked "Continue Anyway" in missing materials modal
  const handleContinueAnyway = () => {
    setIsMissingModalOpen(false);
    setCurrentStep(5);
  };

  // Final project creation and add to cart
  const handleCompleteProject = () => {
    const newProject: ProjectRecord = {
      id: `proj-${Date.now()}`,
      name: projectName || 'Untitled Construction Project',
      category,
      location,
      stateCity,
      description,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Materials Selected',
      requiredMaterials: calculatedMaterials,
      selectedProducts,
      customQuantities: calculatedMaterials.reduce((acc, curr) => {
        acc[curr.category] = curr.editableQuantity;
        return acc;
      }, {} as Record<string, number>),
      logisticsConfig: {
        includeTransportation: true,
        transportationCostPct: 4.5,
        includeLabor: true,
        laborCostPct: 18.0,
        includeTax: true,
        taxGstPct: 18.0,
        includeContingency: true,
        contingencyPct: 5.0
      }
    };

    onSaveProject(newProject);

    // Build Cart Items for selected products
    const cartItems = Object.entries(selectedProducts).map(([cat, prodId]) => {
      const prods = getRecommendedProductsForMaterial(cat);
      const rawProd = prods.find((p) => p.id === prodId) || prods[0];
      const prod = sanitizeProduct(rawProd);
      const matReq = calculatedMaterials.find((m) => m.category === cat);
      const qty = matReq ? matReq.editableQuantity : 100;
      const totalCost = qty * prod.unitPrice;

      return sanitizeCartItem({
        id: `cart-${Date.now()}-${cat}`,
        projectId: newProject.id,
        projectName: newProject.name,
        materialCategory: cat,
        materialName: matReq ? sanitizeProductName(matReq.name, cat) : prod.name,
        product: prod,
        quantity: qty,
        unit: prod.unit,
        unitPrice: prod.unitPrice,
        totalCost,
        wastageFactorPct: matReq ? matReq.wastageFactorPct : 5
      });
    });

    onAddToCart(cartItems);
    onNavigate('cart');
  };

  // Open BIS modal for a code
  const handleOpenBisModal = (code: string) => {
    const found = BIS_STANDARDS_LIBRARY.find((b) => code.includes(b.code.split(':')[0])) || BIS_STANDARDS_LIBRARY[0];
    setBisModalData({ isOpen: true, standard: found });
  };

  // Open Product Compare modal
  const handleOpenCompare = (materialName: string, category: string, qty: number, unit: string) => {
    const prods = getRecommendedProductsForMaterial(category);
    setCompareModalData({
      isOpen: true,
      materialName,
      quantity: qty,
      unit,
      products: prods,
      category
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Wizard Step Navigation Indicator */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Project Creation Wizard
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 font-display">
              Create New Construction Project
            </h1>
          </div>
          <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 w-fit">
            Step {currentStep} of 5: {
              currentStep === 1 ? 'Project Details' :
              currentStep === 2 ? 'Engineering Dimensions' :
              currentStep === 3 ? 'Material Estimation Engine' :
              currentStep === 4 ? 'BIS Recommendations (3 Choices)' :
              'Review & Quotation Generation'
            }
          </div>
        </div>

        {/* Progress Bar */}
        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          {[
            { num: 1, label: 'Details' },
            { num: 2, label: 'Dimensions' },
            { num: 3, label: 'Estimation' },
            { num: 4, label: 'Recommendations' },
            { num: 5, label: 'Summary' }
          ].map((s) => (
            <div key={s.num} className="space-y-1">
              <div
                className={`h-2 rounded-full transition-all ${
                  currentStep >= s.num ? 'bg-amber-500' : 'bg-slate-200'
                }`}
              />
              <span className={`text-[11px] font-bold ${
                currentStep === s.num ? 'text-amber-600' : currentStep > s.num ? 'text-slate-800' : 'text-slate-400'
              }`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: PROJECT DETAILS */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-extrabold text-slate-900 font-display">
              Step 1 — Project Details & Construction Category
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Select the primary civil category to load standard structural formulas and MoRTH/IS specifications.
            </p>
          </div>

          <div className="space-y-6">
            {/* Optional Tender / BOQ Document Upload & Requirement Extraction */}
            <TenderDocumentUpload
              onRequirementsExtracted={(req) => setExtractedTender(req)}
              onApplyToForm={handleApplyTenderRequirements}
              onProceedToStep2={() => setCurrentStep(2)}
            />

            {appliedTenderAlert && (
              <div id="applied-tender-banner" className="p-4 rounded-xl bg-amber-500/10 border-2 border-amber-500/40 text-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <div className="font-extrabold text-sm">
                      Form Auto-Filled from Tender Document: <span className="text-amber-700">{appliedTenderAlert.title}</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Category set to <strong className="capitalize text-slate-900">{appliedTenderAlert.category}</strong>. Project title, location, and structural parameters have been auto-populated into the form.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                >
                  <span>Proceed to Step 2</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Category Selector Buttons */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Construction Category *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { id: 'building', name: 'Building', desc: 'Residential, Commercial & Institutional', icon: Building2 },
                  { id: 'road', name: 'Road', desc: 'Flexible, Rigid & Highway Pavements', icon: TrendingUp },
                  { id: 'bridge', name: 'Bridge', desc: 'Girder Decks, Piers & Culverts', icon: Layers },
                  { id: 'other', name: 'Other Project', desc: 'Industrial Sheds & Compounds', icon: HardHat }
                ].map((c) => (
                  <button
                    key={c.id}
                    id={`cat-btn-${c.id}`}
                    type="button"
                    onClick={() => setCategory(c.id as ProjectCategory)}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between space-y-2 transition-all cursor-pointer ${
                      category === c.id
                        ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30 text-slate-900'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <c.icon className={`w-6 h-6 ${category === c.id ? 'text-amber-600' : 'text-slate-500'}`} />
                      {category === c.id && <Check className="w-4 h-4 text-amber-600 font-bold" />}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">{c.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{c.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label htmlFor="proj-name" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Project Name *
                </label>
                <input
                  id="proj-name"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Metro North Commercial Complex"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 bg-slate-50 focus:bg-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="proj-loc" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Project Location / Address *
                </label>
                <input
                  id="proj-loc"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Sector 62, Cyber City"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 bg-slate-50 focus:bg-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="proj-state-city" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  State / City *
                </label>
                <input
                  id="proj-state-city"
                  type="text"
                  value={stateCity}
                  onChange={(e) => setStateCity(e.target.value)}
                  placeholder="e.g. Noida, Uttar Pradesh"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 bg-slate-50 focus:bg-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="proj-desc" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Project Description
                </label>
                <input
                  id="proj-desc"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. G+3 floor structural frame with ductwork"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 bg-slate-50 focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              id="btn-step1-next"
              type="button"
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-md cursor-pointer"
            >
              <span>Next: Engineering Inputs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: ENGINEERING INPUTS (ROAD OR BUILDING OR BRIDGE) */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Step 2 — Engineering Dimensions
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 font-display">
                {category === 'road' ? 'Road & Pavement Technical Parameters' :
                 category === 'bridge' ? 'Bridge Structural Dimensions' :
                 'Building Architectural & Structural Specifications'}
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase">
              {category} Mode
            </span>
          </div>

          {extractedTender && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Engineering parameters below were populated from <strong>{extractedTender.projectName}</strong> ({extractedTender.sourceFileName}). Review or edit before calculating.
                </span>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                Verified Spec
              </span>
            </div>
          )}

          {/* Conditional Form: ROAD INPUTS */}
          {category === 'road' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Road Length (Kilometres) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={roadLengthKm}
                    onChange={(e) => setRoadLengthKm(parseFloat(e.target.value) || 0.1)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/40 bg-slate-50 focus:bg-white"
                  />
                  <span className="text-[11px] text-slate-500">{(roadLengthKm * 1000).toLocaleString()} meters total length</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Road Width (Metres) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="3.0"
                    value={roadWidthM}
                    onChange={(e) => setRoadWidthM(parseFloat(e.target.value) || 3.5)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/40 bg-slate-50 focus:bg-white"
                  />
                  <span className="text-[11px] text-slate-500">Typical: 3.75m per lane</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Pavement Thickness (mm) *
                  </label>
                  <input
                    type="number"
                    step="5"
                    min="50"
                    value={roadThicknessMm}
                    onChange={(e) => setRoadThicknessMm(parseInt(e.target.value) || 100)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/40 bg-slate-50 focus:bg-white"
                  />
                  <span className="text-[11px] text-slate-500">PQC / Asphalt wearing course</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Road Classification *
                  </label>
                  <select
                    value={roadType}
                    onChange={(e) => setRoadType(e.target.value as RoadType)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/40 bg-slate-50"
                  >
                    <option value="Highway">National / State Highway</option>
                    <option value="Urban Road">Urban Arterial Road</option>
                    <option value="Rural Road">Rural PMGSY Road</option>
                    <option value="Residential Road">Residential Colony Road</option>
                    <option value="Other">Other Corridor</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Pavement Type *
                  </label>
                  <select
                    value={pavementType}
                    onChange={(e) => setPavementType(e.target.value as PavementType)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/40 bg-slate-50 font-bold text-amber-700"
                  >
                    <option value="Flexible Pavement">Flexible Pavement (Bitumen VG-30 / DBM)</option>
                    <option value="Rigid Pavement">Rigid Pavement (M40 Concrete PQC)</option>
                    <option value="Bituminous Road">Bituminous Road</option>
                    <option value="Concrete Road">Concrete Road</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Number of Lanes *
                  </label>
                  <select
                    value={roadLanes}
                    onChange={(e) => setRoadLanes(parseInt(e.target.value) || 2)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/40 bg-slate-50"
                  >
                    <option value={1}>1 Lane (Single 3.75m)</option>
                    <option value={2}>2 Lanes (7.0m - 7.5m)</option>
                    <option value={4}>4 Lanes (14.0m - 15.0m)</option>
                    <option value={6}>6 Lanes (21.0m - 24.0m)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Soil / Subgrade Information & CBR (%)
                </label>
                <input
                  type="text"
                  value={soilSubgradeInfo}
                  onChange={(e) => setSoilSubgradeInfo(e.target.value)}
                  placeholder="e.g. Non-expansive granular subgrade with 8% soaked CBR"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/40 bg-slate-50"
                />
              </div>
            </div>
          )}

          {/* Conditional Form: BUILDING INPUTS */}
          {(category === 'building' || category === 'other') && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Total Built-Up Area (sq.ft) *
                  </label>
                  <input
                    type="number"
                    step="100"
                    min="100"
                    value={builtUpArea}
                    onChange={(e) => {
                      const v = parseInt(e.target.value) || 100;
                      setBuiltUpArea(v);
                      setAreaPerFloor(Math.round(v / numFloors));
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/40 bg-slate-50 focus:bg-white"
                  />
                  <span className="text-[11px] text-slate-500">{(builtUpArea / 10.764).toFixed(1)} m² floor area</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Number of Floors *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={numFloors}
                    onChange={(e) => {
                      const fl = parseInt(e.target.value) || 1;
                      setNumFloors(fl);
                      setAreaPerFloor(Math.round(builtUpArea / fl));
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/40 bg-slate-50 focus:bg-white"
                  />
                  <span className="text-[11px] text-slate-500">Ground + {numFloors - 1} Upper Floors</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Area per Floor (sq.ft)
                  </label>
                  <input
                    type="number"
                    value={areaPerFloor}
                    onChange={(e) => setAreaPerFloor(parseInt(e.target.value) || 500)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/40 bg-slate-50"
                  />
                  <span className="text-[11px] text-slate-500">Footprint dimension</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Floor Height (m)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="2.5"
                    max="6.0"
                    value={floorHeightM}
                    onChange={(e) => setFloorHeightM(parseFloat(e.target.value) || 3.0)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/40 bg-slate-50"
                  />
                  <span className="text-[11px] text-slate-500">Slab to slab clear height</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Building Type *
                  </label>
                  <select
                    value={buildingType}
                    onChange={(e) => setBuildingType(e.target.value as BuildingType)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/40 bg-slate-50"
                  >
                    <option value="Residential Building">Residential Building</option>
                    <option value="Commercial Building">Commercial Building</option>
                    <option value="Apartment">Apartment Complex</option>
                    <option value="School">School / Educational</option>
                    <option value="Hospital">Hospital / Healthcare</option>
                    <option value="Office">Office Tower</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Structural System *
                  </label>
                  <select
                    value={structuralSystem}
                    onChange={(e) => setStructuralSystem(e.target.value as StructuralSystem)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/40 bg-slate-50 font-semibold text-slate-800"
                  >
                    <option value="RCC Framed Structure">RCC Framed Structure (IS 456)</option>
                    <option value="Load-Bearing Structure">Load-Bearing Masonry Structure</option>
                    <option value="Steel Structure">Structural Steel + Deck Slab</option>
                    <option value="Precast Concrete System">Precast Concrete System</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Roof Type *
                  </label>
                  <select
                    value={roofType}
                    onChange={(e) => setRoofType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/40 bg-slate-50"
                  >
                    <option value="RCC Flat Slab">RCC Flat Slab with Screed Waterproofing</option>
                    <option value="Sloped Concrete Roof">Sloped Pitched Concrete Slab</option>
                    <option value="Terrace with Pergola">Open Accessible Terrace with Parapet</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Construction Stage
                  </label>
                  <select
                    value={constructionStage}
                    onChange={(e) => setConstructionStage(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/40 bg-slate-50"
                  >
                    <option value="Full Project">Full Comprehensive Project (Foundation to Roof)</option>
                    <option value="Foundation">Foundation & Substructure</option>
                    <option value="Superstructure">Columns, Beams & Roof Slabs</option>
                    <option value="Finishing">Masonry & Plastering Stage</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Additional Engineering Notes
                  </label>
                  <input
                    type="text"
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                    placeholder="e.g. Earthquake zone IV ductile detailing required"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/40 bg-slate-50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Conditional Form: BRIDGE INPUTS */}
          {category === 'bridge' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Clear Span Length (m) *
                </label>
                <input
                  type="number"
                  step="1"
                  min="5"
                  value={spanLengthM}
                  onChange={(e) => setSpanLengthM(parseFloat(e.target.value) || 10)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-slate-50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Deck Width (m) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="4"
                  value={deckWidthM}
                  onChange={(e) => setDeckWidthM(parseFloat(e.target.value) || 7.5)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-slate-50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Pier Height (m) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="2"
                  value={pierHeightM}
                  onChange={(e) => setPierHeightM(parseFloat(e.target.value) || 4)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-slate-50"
                />
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              id="btn-run-estimation"
              type="button"
              onClick={runEstimation}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition-all shadow-md cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>Execute Civil Estimation Engine</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: MATERIAL ESTIMATION ENGINE & EDITABLE QUANTITIES */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Step 3 — Material Estimation Engine Results
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 font-display">
                Required Material Quantities & Engineering Assumptions
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every calculation reveals its basis and wastage factor. Modify quantities directly if you have specific approved structural drawings.
              </p>
            </div>
            <div className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-medium flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Editable Fields Available</span>
            </div>
          </div>

          {/* Materials Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-y border-slate-200">
                  <th className="py-3 px-4">Material Item</th>
                  <th className="py-3 px-4">Calculation Basis & Standard Code</th>
                  <th className="py-3 px-4">Wastage Factor</th>
                  <th className="py-3 px-4">Estimated Qty</th>
                  <th className="py-3 px-4 text-amber-700">Editable Quantity</th>
                  <th className="py-3 px-4 text-right">Indicative Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {calculatedMaterials.map((mat) => {
                  const estSubtotal = mat.editableQuantity * mat.estimatedUnitPrice;
                  return (
                    <tr key={mat.materialId} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                        {mat.name}
                        <div className="text-[11px] font-normal text-slate-500 capitalize">
                          Category: {mat.category}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-medium text-slate-800 text-xs">
                          {mat.calculationBasis}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                          {mat.formulaExplanation}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-600">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          +{mat.wastageFactorPct}% waste
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        {mat.estimatedQuantity.toLocaleString()} {mat.unit}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            value={mat.editableQuantity}
                            onChange={(e) => handleQuantityChange(mat.materialId, parseFloat(e.target.value) || 0)}
                            className="w-28 px-3 py-1.5 rounded-lg border border-amber-400 bg-amber-50/50 font-bold text-slate-900 text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white"
                          />
                          <span className="font-semibold text-slate-700 text-xs">{mat.unit}</span>
                          {mat.isOverridden && (
                            <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-1 rounded">
                              Edited
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-bold text-slate-900 font-display text-sm">
                        ₹{Math.round(estSubtotal).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                All quantities are approximate planning figures derived from IS 456 / IRC / MoRTH design manuals.
              </span>
            </div>
            <div className="text-right font-extrabold text-slate-900 font-display text-sm">
              Estimated Total Raw Materials: ₹{Math.round(calculatedMaterials.reduce((acc, m) => acc + (m.editableQuantity * m.estimatedUnitPrice), 0)).toLocaleString()}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              id="btn-step3-next-recs"
              type="button"
              onClick={() => setCurrentStep(4)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition-all shadow-md cursor-pointer"
            >
              <span>Next: View 3-Tier BIS Quality Grade Recommendations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: MATERIAL RECOMMENDATION SYSTEM (EXACTLY 3 QUALITY GRADES PER MATERIAL) */}
      {currentStep === 4 && (
        <div className="space-y-8">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-amber-50/80 via-white to-orange-50/60 rounded-2xl p-6 border border-amber-200/80 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Step 4 — BIS Quality Grade Recommendation System
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 font-display mt-0.5">
                  Classify & Select Materials by Quality Grade
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm mt-1">
                  Each material is classified into <strong>three verified engineering quality grades</strong> (e.g. 550 D vs 500 D) based on BIS standards, structural strength, and project suitability — without commercial brand names.
                </p>
              </div>

              {/* Selection summary pill */}
              <div className="p-3 rounded-xl bg-white border border-amber-200/80 text-right shadow-2xs">
                <div className="text-[11px] text-slate-500">Selection Progress:</div>
                <div className="text-sm font-extrabold text-amber-800">
                  {Object.keys(selectedProducts).length} of {calculatedMaterials.length} Quality Grades Selected
                </div>
              </div>
            </div>
          </div>

          {/* Iterate over each required material */}
          <div className="space-y-10">
            {calculatedMaterials.map((mat) => {
              const recProducts = getRecommendedProductsForMaterial(mat.category);
              const currentlySelectedId = selectedProducts[mat.category];

              return (
                <div
                  key={mat.materialId}
                  className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6"
                >
                  {/* Material Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                          Required Material
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-bold text-slate-700">
                          {mat.editableQuantity.toLocaleString()} {mat.unit}
                        </span>
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900 font-display mt-0.5">
                        {mat.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenCompare(mat.name, mat.category, mat.editableQuantity, mat.unit)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Scale className="w-3.5 h-3.5 text-slate-600" />
                        <span>Compare 3 Quality Grades</span>
                      </button>
                    </div>
                  </div>

                  {/* Exactly 3 Product Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recProducts.map((prod) => {
                      const isSelected = currentlySelectedId === prod.id;
                      const batchTotal = mat.editableQuantity * prod.unitPrice;

                      return (
                        <div
                          key={prod.id}
                          className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 transition-all ${
                            isSelected
                              ? 'bg-amber-500/5 border-amber-500 ring-2 ring-amber-500/30 shadow-md'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="space-y-3.5">
                            {/* Rank Badge */}
                            <div className="flex items-center justify-between">
                              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                                prod.recommendationRank === 'highly_recommended'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : prod.recommendationRank === 'averagely_recommended'
                                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}>
                                {prod.recommendationRank === 'highly_recommended' && <Award className="w-3.5 h-3.5 text-emerald-600" />}
                                {prod.recommendationRank === 'averagely_recommended' && <Zap className="w-3.5 h-3.5 text-blue-600" />}
                                {prod.recommendationRank === 'low_level_recommended' && <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />}
                                <span>{prod.rankTitle}</span>
                              </span>

                              {isSelected && (
                                <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Selected
                                </span>
                              )}
                            </div>

                            {/* Quality Classification & Grade Specification */}
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 tracking-wider">
                                  Quality Grade
                                </span>
                              </div>
                              <h4 className="font-extrabold text-slate-900 text-base sm:text-lg font-display leading-snug">
                                {sanitizeProductName(prod.name, prod.materialCategory)}
                              </h4>
                              <p className="text-xs text-slate-600 font-medium bg-slate-50 p-2 rounded-lg border border-slate-200/80">
                                Quality Spec: {sanitizeQualitySpec(prod.brand, prod)}
                              </p>
                            </div>

                            {/* Price details */}
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                              <div className="flex items-baseline justify-between">
                                <span className="text-xs text-slate-500">Unit Price:</span>
                                <span className="text-base font-bold text-slate-900">
                                  ₹{prod.unitPrice.toLocaleString()}{' '}
                                  <span className="text-xs font-normal text-slate-500">/ {prod.unit}</span>
                                </span>
                              </div>
                              <div className="flex items-baseline justify-between mt-1 pt-1 border-t border-slate-200/80">
                                <span className="text-xs text-amber-700 font-semibold">Total Estimated Cost:</span>
                                <span className="text-sm font-extrabold text-amber-700">
                                  ₹{Math.round(batchTotal).toLocaleString()}
                                </span>
                              </div>
                            </div>

                            {/* BIS Standard Tag */}
                            <div className="space-y-1 text-xs">
                              <div className="text-slate-500 text-[11px] font-medium">BIS Quality Code:</div>
                              <button
                                type="button"
                                onClick={() => handleOpenBisModal(prod.bisStandardCode)}
                                className="inline-flex items-center gap-1 text-xs font-bold text-cyan-800 bg-cyan-50 hover:bg-cyan-100 px-2 py-1 rounded border border-cyan-200 transition-colors cursor-pointer text-left"
                              >
                                <ShieldCheck className="w-3.5 h-3.5 text-cyan-700 shrink-0" />
                                <span>{prod.bisStandardCode}</span>
                              </button>
                              <div className="text-[10px] text-slate-500">{prod.certificationReference}</div>
                            </div>

                            {/* Why this Rank */}
                            <div className="space-y-1 text-xs">
                              <div className="text-[11px] font-bold text-slate-700">Quality Assessment & Engineering Justification:</div>
                              <p className="text-slate-600 text-[11px] leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                {prod.rankExplanation}
                              </p>
                            </div>

                            {/* Technical Specs */}
                            <div className="space-y-1 text-[11px] text-slate-600 border-t border-slate-100 pt-2">
                              <div><strong>Strength:</strong> {prod.qualityFeatures.strength}</div>
                              <div><strong>Suitability:</strong> {prod.qualityFeatures.constructionSuitability}</div>
                            </div>
                          </div>

                          {/* Select Button */}
                          <div className="pt-2">
                            <button
                              id={`btn-select-${prod.id}`}
                              type="button"
                              onClick={() => handleSelectProduct(mat.category, prod.id)}
                              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                isSelected
                                  ? 'bg-amber-500 text-slate-950 shadow-md'
                                  : 'bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-800 border border-slate-200'
                              }`}
                            >
                              <Check className="w-4 h-4" />
                              <span>{isSelected ? 'Selected Quality Grade' : 'Select This Quality Grade'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation & Proceed button with Missing Alert validation */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Estimation</span>
            </button>

            <button
              id="btn-proceed-review"
              type="button"
              onClick={handleProceedToReview}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition-all shadow-lg hover:shadow-amber-500/20 cursor-pointer"
            >
              <span>Proceed to Summary & Cart</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: REVIEW & GENERATE FINAL QUOTATION / ADD TO CART */}
      {currentStep === 5 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Step 5 — Summary Review & Cart Dispatch
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 font-display mt-0.5">
              Review Selected Materials for {projectName}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Confirm your certified BIS material selection before adding to cart and generating final quotation.
            </p>
          </div>

          {/* Check if any missing materials */}
          {calculatedMaterials.some((m) => !selectedProducts[m.category]) && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Notice: Some materials were skipped as per your instruction.</span>
              </div>
              <p className="text-amber-800">
                Unselected items will be excluded from the initial material cart total, and an incomplete estimate notice will be appended to the quotation.
              </p>
            </div>
          )}

          {/* Selected Materials List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Selected Quality Grades Breakdown:
            </h3>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {calculatedMaterials.map((mat) => {
                const selId = selectedProducts[mat.category];
                const prods = getRecommendedProductsForMaterial(mat.category);
                const prod = prods.find((p) => p.id === selId);

                if (!prod) {
                  return (
                    <div key={mat.materialId} className="p-4 bg-slate-50 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-500">{mat.name}</span>
                        <span className="ml-2 text-rose-600 font-semibold">(Unselected - Skipped)</span>
                      </div>
                      <span className="text-slate-400">₹0</span>
                    </div>
                  );
                }

                const total = mat.editableQuantity * prod.unitPrice;

                return (
                  <div key={mat.materialId} className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{sanitizeProductName(prod.name, prod.materialCategory)}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {prod.bisStandardCode}
                        </span>
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        Quality Spec: {sanitizeQualitySpec(prod.brand, prod)} • Quantity: {mat.editableQuantity.toLocaleString()} {prod.unit} @ ₹{prod.unitPrice.toLocaleString()}/{prod.unit}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-extrabold text-slate-900 text-base font-display">
                        ₹{Math.round(total).toLocaleString()}
                      </div>
                      <span className="text-[10px] text-emerald-600 font-semibold">{prod.rankTitle}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Selection</span>
            </button>

            <button
              id="btn-add-to-cart-and-view"
              type="button"
              onClick={handleCompleteProject}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition-all shadow-lg hover:shadow-amber-500/20 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add Selected Materials to Cart & Calculate Quotation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <MissingMaterialsModal
        isOpen={isMissingModalOpen}
        missingMaterials={missingMaterialsList}
        onSelectMissing={() => setIsMissingModalOpen(false)}
        onContinueAnyway={handleContinueAnyway}
        onClose={() => setIsMissingModalOpen(false)}
      />

      <ProductCompareModal
        isOpen={compareModalData.isOpen}
        materialName={compareModalData.materialName}
        requiredQuantity={compareModalData.quantity}
        unit={compareModalData.unit}
        products={compareModalData.products}
        selectedProductId={selectedProducts[compareModalData.category]}
        onSelectProduct={(p) => handleSelectProduct(compareModalData.category, p.id)}
        onClose={() => setCompareModalData((prev) => ({ ...prev, isOpen: false }))}
      />

      <BisDetailModal
        standard={bisModalData.standard}
        isOpen={bisModalData.isOpen}
        onClose={() => setBisModalData((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

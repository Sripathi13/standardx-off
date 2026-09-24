import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  Menu, 
  X, 
  ShoppingCart, 
  FileText, 
  ShieldCheck, 
  Home as HomeIcon, 
  FolderKanban, 
  Compass, 
  User, 
  PlusCircle, 
  HardHat, 
  ChevronRight, 
  ChevronDown,
  BookOpen, 
  Award,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  cartCount: number;
  activeProjectName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentView, 
  onNavigate, 
  cartCount,
  activeProjectName 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Primary desktop navigation links (5 items max for clean layout without crowding)
  const primaryNavItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'create-project', label: 'Create Project', icon: PlusCircle },
    { id: 'house-owners', label: 'House Owners', icon: HardHat },
    { id: 'marketplace', label: 'Marketplace', icon: Compass },
    { id: 'bis-standards', label: 'Standards', icon: ShieldCheck },
  ];

  // Secondary items placed under the "More" dropdown to eliminate navbar clustering
  const secondaryNavItems = [
    { 
      id: 'procurement-portal', 
      label: 'Procurement Officer Portal', 
      desc: 'AI Indian Standards tender & spec engine',
      icon: Award, 
      highlight: true 
    },
    { 
      id: 'my-projects', 
      label: 'My Projects', 
      desc: 'View & manage saved estimations',
      icon: FolderKanban 
    },
    { 
      id: 'quotations', 
      label: 'Quotations', 
      desc: 'Financial breakdowns & PDF exports',
      icon: FileText 
    },
    { 
      id: 'docs', 
      label: 'Documentation & Specs', 
      desc: 'System formulas & IS reference matrix',
      icon: BookOpen 
    },
    { 
      id: 'about', 
      label: 'About Platform', 
      desc: 'Civil engineering thumb-rule basis',
      icon: Building2 
    },
  ];

  // Check if active view is one of the secondary items
  const isSecondaryActive = secondaryNavItems.some((item) => item.id === currentView);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
    setIsMoreMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-xs no-print w-full max-w-full overflow-hidden">
      {/* Top utility ticker banner */}
      <div className="bg-slate-50 px-4 py-1.5 text-xs text-slate-600 border-b border-slate-200 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 truncate">
            <span className="shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
              BIS ALIGNED
            </span>
            <span className="hidden sm:inline text-slate-600 text-xs truncate">
              National Building Code & MoRTH Structural Estimation Engine
            </span>
          </div>
          {activeProjectName && (
            <div className="flex items-center gap-1.5 text-slate-600 truncate max-w-[180px] sm:max-w-xs shrink-0 text-xs">
              <span className="text-slate-500 text-[11px] shrink-0">Active Project:</span>
              <span className="font-semibold text-amber-700 truncate">{activeProjectName}</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Zone 1: Brand Wordmark */}
          <button 
            id="nav-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 p-0.5 shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center border border-amber-200">
                <span className="text-base font-black tracking-tighter text-amber-600 font-display">SX</span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold tracking-tight text-slate-900 font-display whitespace-nowrap">
                  STANDARD <span className="text-amber-600">X</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  v3.2
                </span>
              </div>
            </div>
          </button>

          {/* Zone 2: Primary Desktop Navigation Links (Clean, No Clutter, No Overlap) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {primaryNavItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive 
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* "More" Dropdown Menu */}
            <div className="relative" ref={moreMenuRef}>
              <button
                id="nav-more-dropdown-btn"
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer ${
                  isSecondaryActive || isMoreMenuOpen
                    ? 'bg-slate-100 text-amber-800 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                aria-expanded={isMoreMenuOpen}
              >
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${isMoreMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Card */}
              {isMoreMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 rounded-xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="space-y-1">
                    {secondaryNavItems.map((item) => {
                      const isActive = currentView === item.id;
                      return (
                        <button
                          key={item.id}
                          id={`dropdown-nav-${item.id}`}
                          onClick={() => handleNavClick(item.id)}
                          className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-amber-50 text-amber-950 border border-amber-200'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className={`p-1.5 rounded-md shrink-0 mt-0.5 ${
                            item.highlight 
                              ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            <item.icon className="w-4 h-4 shrink-0" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900">{item.label}</span>
                              {item.highlight && (
                                <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">
                                  AI
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {item.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Zone 3: Right Action Buttons (Distinct, Beautiful, Never Overlapping) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Procurement Officer Shortcut Button (Distinctly styled CTA) */}
            <button
              id="nav-procurement-portal-btn"
              onClick={() => handleNavClick('procurement-portal')}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                currentView === 'procurement-portal'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300'
              }`}
              title="Procurement Officer Portal - AI Standards Recommendation Engine"
            >
              <Award className="w-4 h-4 shrink-0 text-amber-700" />
              <span className="whitespace-nowrap">Officer Portal</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-amber-400 text-slate-950 font-black">
                AI
              </span>
            </button>

            {/* Cart Button with Well-Positioned Badge */}
            <button
              id="nav-cart-btn"
              onClick={() => handleNavClick('cart')}
              className={`relative p-2 rounded-lg transition-colors shrink-0 cursor-pointer ${
                currentView === 'cart'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="View Material Cart"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5 shrink-0" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full min-w-5 h-5 px-1 flex items-center justify-center ring-2 ring-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile / Auth Button */}
            <button
              id="nav-profile-btn"
              onClick={() => handleNavClick('profile')}
              className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                currentView === 'profile'
                  ? 'bg-slate-100 text-amber-700 ring-1 ring-amber-400'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-amber-300 text-slate-950 flex items-center justify-center text-xs font-bold shrink-0">
                <User className="w-3.5 h-3.5 shrink-0" />
              </div>
              <span className="hidden md:inline whitespace-nowrap">Profile</span>
            </button>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              id="nav-mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none shrink-0 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 shrink-0" /> : <Menu className="w-6 h-6 shrink-0" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu (Spacious, Categorized, No Overlap, No Horizontal Overflow) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-xl max-h-[85vh] overflow-y-auto">
          {/* Section 1: Core Workflow */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
              Core Workflow
            </div>
            {primaryNavItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 shrink-0 opacity-40" />
                </button>
              );
            })}
          </div>

          {/* Section 2: Standards & Specialized Portals */}
          <div className="space-y-1 border-t border-slate-100 pt-3">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
              Standards & Portals
            </div>
            {secondaryNavItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {item.highlight && (
                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">
                        AI
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 shrink-0 opacity-40" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

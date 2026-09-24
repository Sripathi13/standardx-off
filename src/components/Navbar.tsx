import React, { useState } from 'react';
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
  BookOpen,
  Award
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

  const navItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'create-project', label: 'Create New Project', icon: PlusCircle, highlight: true },
    { id: 'house-owners', label: 'House Owners', icon: HardHat, specialBadge: 'Popular' },
    { id: 'marketplace', label: 'Material Marketplace', icon: Compass },
    { id: 'procurement-portal', label: 'Procurement AI', icon: Award, highlight: true },
    { id: 'bis-standards', label: 'BIS Standards', icon: ShieldCheck },
    { id: 'docs', label: 'Docs', icon: BookOpen },
    { id: 'my-projects', label: 'My Projects', icon: FolderKanban },
    { id: 'quotations', label: 'Quotations', icon: FileText },
    { id: 'about', label: 'About', icon: Building2 },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-xs no-print">
      {/* Top utility ticker banner */}
      <div className="bg-slate-50 px-4 py-1.5 text-xs text-slate-600 border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
              BUREAU OF INDIAN STANDARDS ALIGNED
            </span>
            <span className="hidden sm:inline text-slate-600">
              National Building Code & MoRTH Compliant Structural Estimation Engine
            </span>
          </div>
          {activeProjectName && (
            <div className="flex items-center gap-1.5 text-slate-600 truncate max-w-[200px] sm:max-w-xs">
              <span className="text-slate-500 text-[11px]">Active Project:</span>
              <span className="font-semibold text-amber-700 truncate">{activeProjectName}</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            id="nav-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 p-0.5 shadow-xs group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center border border-amber-200">
                <span className="text-lg font-black tracking-tighter text-amber-600 font-display">SX</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 font-display">
                  STANDARD <span className="text-amber-600">X</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  v3.2
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Material Estimation & BIS Quality Engine
              </p>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive 
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' 
                      : item.highlight
                      ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.specialBadge && !isActive && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 uppercase tracking-tighter">
                      {item.specialBadge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons: Officer Shortcut, Cart, Profile, Mobile Toggle */}
          <div className="flex items-center gap-2">
            {/* Procurement Officer Shortcut Button */}
            <button
              id="nav-procurement-portal-btn"
              onClick={() => handleNavClick('procurement-portal')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentView === 'procurement-portal'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300'
              }`}
              title="Procurement Officer Portal - AI Standards Recommendation Engine"
            >
              <Award className="w-4 h-4 text-amber-600" />
              <span>Officer Portal</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-amber-400 text-slate-950 font-black">
                AI
              </span>
            </button>

            {/* Cart Button with Count Badge */}
            <button
              id="nav-cart-btn"
              onClick={() => handleNavClick('cart')}
              className={`relative p-2 rounded-lg transition-colors cursor-pointer ${
                currentView === 'cart'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="View Material Cart"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-xs animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile / Auth Button */}
            <button
              id="nav-profile-btn"
              onClick={() => handleNavClick('profile')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                currentView === 'profile'
                  ? 'bg-slate-100 text-amber-700 ring-1 ring-amber-400'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-amber-300 text-slate-950 flex items-center justify-center text-xs font-bold">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="hidden md:inline">Profile</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              id="nav-mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-1 shadow-xl">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.specialBadge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                      {item.specialBadge}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

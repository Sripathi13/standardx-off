import React from 'react';
import { ShieldCheck, ArrowUpRight, Scale, HardHat } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-100 text-slate-600 border-t border-slate-200 text-sm no-print">
      {/* Primary Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1: Platform Overview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black font-display text-lg shadow-xs">
                SX
              </div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight font-display">
                STANDARD <span className="text-amber-600">X</span>
              </span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed max-w-md">
              The premier civil engineering intelligence platform for accurate construction material estimation, 
              verified Bureau of Indian Standards (BIS) quality recommendations, transparent market pricing, 
              and automated project quotations.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-white text-amber-800 border border-slate-200 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> BIS Code IS 456 / IS 1786
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-white text-emerald-800 border border-slate-200 shadow-2xs">
                <Scale className="w-3.5 h-3.5 text-emerald-600" /> 3-Tier Verified Ranking
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-white text-blue-800 border border-slate-200 shadow-2xs">
                <HardHat className="w-3.5 h-3.5 text-blue-600" /> MoRTH & CPWD Norms
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Platform Workflow
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate('create-project')}
                  className="hover:text-amber-700 transition-colors cursor-pointer text-slate-600"
                >
                  Create New Project
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('house-owners')}
                  className="hover:text-amber-700 transition-colors cursor-pointer text-slate-600"
                >
                  House Owners Wizard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('my-projects')}
                  className="hover:text-amber-700 transition-colors cursor-pointer text-slate-600"
                >
                  My Projects Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('cart')}
                  className="hover:text-amber-700 transition-colors cursor-pointer text-slate-600"
                >
                  Material Cart & Logistics
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('quotations')}
                  className="hover:text-amber-700 transition-colors cursor-pointer text-slate-600"
                >
                  Estimated Quotations
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: BIS Standards */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Standards & Codes
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate('procurement-portal')}
                  className="hover:text-amber-700 transition-colors cursor-pointer text-amber-700 font-bold flex items-center gap-1"
                >
                  <span>🏛️ Procurement AI Portal</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('bis-standards')}
                  className="hover:text-amber-700 transition-colors cursor-pointer text-slate-600"
                >
                  BIS Standards Library
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('docs')}
                  className="hover:text-amber-700 transition-colors cursor-pointer text-amber-700 font-semibold"
                >
                  Core Documentation & Specs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('marketplace')}
                  className="hover:text-amber-700 transition-colors cursor-pointer text-slate-600"
                >
                  Material Marketplace
                </button>
              </li>
              <li>
                <a 
                  href="https://www.services.bis.gov.in" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-amber-700 transition-colors inline-flex items-center gap-1 text-slate-600"
                >
                  BIS Official Registry <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('about')}
                  className="hover:text-amber-700 transition-colors cursor-pointer text-slate-600"
                >
                  Calculation Methodology
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Project Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>• Residential Buildings (RCC & Load-Bearing)</li>
              <li>• Commercial High-Rise Towers</li>
              <li>• Flexible & Rigid Highway Pavements</li>
              <li>• Rural Roads & PMGSY Infrastructure</li>
              <li>• Individual Villas & Duplex Homes</li>
              <li>• Bridge Decks & Culverts</li>
            </ul>
          </div>
        </div>

        {/* Mandatory Engineering Disclaimer Box */}
        <div className="mt-12 p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-slate-700 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2 text-amber-800 font-bold">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>Important Civil Engineering Advisory & Disclaimer</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            This application provides approximate planning estimates based on established civil engineering coefficients, 
            empirical material thumb-rules, and Bureau of Indian Standards (BIS) specifications. 
            <strong> This is an approximate estimate for planning purposes and is not a binding construction quotation or certified structural design.</strong> Actual 
            site quantities and final procurement costs vary depending on structural engineer-certified reinforcement schedules, site soil bearing capacity (SBC), local quarry market rates, and specific contractor agreements.
          </p>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} STANDARD X Infrastructure Systems. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>IS 456 / IS 1786 Reference Standards</span>
            <span>•</span>
            <button onClick={() => onNavigate('about')} className="hover:underline cursor-pointer text-slate-600">
              About Platform
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

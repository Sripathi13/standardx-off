import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  BookOpen, 
  Calculator, 
  Scale, 
  Award, 
  AlertTriangle,
  Layers,
  ArrowRight
} from 'lucide-react';

interface AboutViewProps {
  onNavigate: (view: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-bold border border-amber-500/20">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>Engineering Integrity & Standards</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 font-display">
          About STANDARD <span className="text-amber-500">X</span>
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          The automated material estimation and Bureau of Indian Standards (BIS) 
          quality recommendation platform bridging structural civil engineering formulas 
          with authentic procurement transparency.
        </p>
      </div>

      {/* Core Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold">
            01
          </div>
          <h3 className="text-base font-bold text-slate-900 font-display">
            Formulaic Transparency
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Eliminate subjective, opaque contractor markups with empirical formulas drawn from IS 456, IRC, and MoRTH design manuals.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-700 flex items-center justify-center font-bold">
            02
          </div>
          <h3 className="text-base font-bold text-slate-900 font-display">
            Explainable 3 Choices
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every material is distilled to exactly three verified options: Highly, Averagely, and Low-Level Recommended, complete with reasons and test criteria.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center font-bold">
            03
          </div>
          <h3 className="text-base font-bold text-slate-900 font-display">
            User-Controlled Scope
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Engineers and homeowners have total control. Any skipped material triggers an honest advisory and remains excluded from cost calculations.
          </p>
        </div>
      </div>

      {/* Engineering References */}
      <div className="rounded-2xl bg-white text-slate-800 p-8 sm:p-10 border border-slate-200 space-y-6 shadow-sm">
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
            Computational Foundations
          </span>
          <h2 className="text-2xl font-bold font-display text-slate-900">
            Referenced Technical Manuals & Codes
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-bold text-amber-800">IS 456:2000 (Plain and Reinforced Concrete)</span>
            <p className="text-slate-600 leading-relaxed">
              Provides the basis for concrete mix proportions, minimum cement content (300–320 kg/m³ for moderate/severe exposure), and nominal maximum aggregate sizing.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-bold text-amber-800">IS 1786:2008 (High Strength Deformed Steel)</span>
            <p className="text-slate-600 leading-relaxed">
              Defines mechanical properties, 0.2% proof stress (500–550 MPa), minimum elongation (14.5%–16% for 'D' grade), and TS/YS ratios for earthquake resistance.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-bold text-sky-800">MoRTH 5th Revision (Roads & Bridges)</span>
            <p className="text-slate-600 leading-relaxed">
              Governs bituminous layers (Dense Bituminous Macadam, Bituminous Concrete) and granular bases (GSB, WMM) with strict compaction and CBR parameters.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-bold text-sky-800">IS 383:2016 (Coarse & Fine Aggregate)</span>
            <p className="text-slate-600 leading-relaxed">
              Standardizes grading zones (Zone I–IV), crushing value, impact value (&lt;30%), and flakiness & elongation indices (&lt;35%).
            </p>
          </div>
        </div>
      </div>

      {/* Prominent Civil Engineering Disclaimer */}
      <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-2">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <span>Formal Civil Engineering Advisory Notice</span>
        </div>
        <p className="text-xs text-amber-900 leading-relaxed">
          <strong>This is an approximate estimate for planning purposes and is not a binding construction quotation.</strong> Structural 
          safety requires site soil testing, geotechnical bearing capacity verification, certified reinforcement schedules produced by 
          licensed structural engineers, and formal contractor contracts adhering to local municipality building bylaws.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <button
          onClick={() => onNavigate('create-project')}
          className="px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
        >
          <span>Begin Estimating with STANDARD X</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

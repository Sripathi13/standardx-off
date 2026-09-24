import React from 'react';
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

interface MissingMaterialsModalProps {
  isOpen: boolean;
  missingMaterials: string[];
  onSelectMissing: () => void;
  onContinueAnyway: () => void;
  onClose: () => void;
}

export const MissingMaterialsModal: React.FC<MissingMaterialsModalProps> = ({
  isOpen,
  missingMaterials,
  onSelectMissing,
  onContinueAnyway,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white border-2 border-amber-400 rounded-2xl max-w-lg w-full p-6 sm:p-8 text-slate-900 shadow-2xl space-y-6 relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="missing-materials-title"
      >
        {/* Warning Icon Badge */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 px-2 py-0.5 rounded bg-amber-100 border border-amber-200">
              Material Selection Notice
            </span>
            <h3 id="missing-materials-title" className="text-xl font-bold font-display text-slate-900 mt-1">
              You have not selected all required materials
            </h3>
          </div>
        </div>

        {/* Message body */}
        <div className="space-y-3 text-sm text-slate-600">
          <p className="leading-relaxed">
            Your project estimation may be <strong>incomplete</strong>. A comprehensive civil engineering estimate requires selecting certified products for all computed structural materials.
          </p>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-900">
              Missing Materials ({missingMaterials.length}):
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium">
              {missingMaterials.map((mat, idx) => (
                <li key={idx} className="flex items-center gap-2 text-amber-900 bg-white px-2.5 py-1.5 rounded-lg border border-amber-200 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span className="capitalize">{mat}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-slate-500 italic">
            Please select all required materials for a more complete project estimate. If you choose to continue anyway, unselected materials will be excluded from your cart and a notice will be recorded on your quotation.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            id="btn-select-missing-materials"
            onClick={onSelectMissing}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-md cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Select Missing Materials</span>
          </button>

          <button
            id="btn-continue-anyway"
            onClick={onContinueAnyway}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-semibold text-sm transition-all cursor-pointer"
          >
            <span>Continue Anyway</span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

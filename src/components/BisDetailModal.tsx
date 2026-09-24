import React from 'react';
import { BisStandardInfo } from '../types';
import { X, ShieldCheck, CheckCircle, FileCheck, BookOpen } from 'lucide-react';

interface BisDetailModalProps {
  standard: BisStandardInfo | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BisDetailModal: React.FC<BisDetailModalProps> = ({
  standard,
  isOpen,
  onClose
}) => {
  if (!isOpen || !standard) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col text-slate-900 shadow-2xl relative my-6">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/80 rounded-t-2xl">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 border border-amber-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  Bureau of Indian Standards Specification
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                  {standard.category}
                </span>
              </div>
              <h2 className="text-xl font-bold font-display text-slate-900 mt-1">
                {standard.code}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                {standard.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          {/* Scope */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-amber-800">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" /> Standard Scope & Objective
            </h4>
            <p className="text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
              {standard.scope}
            </p>
          </div>

          {/* Key Mandatory Requirements */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-blue-800">
              <FileCheck className="w-3.5 h-3.5 text-blue-600" /> Mandatory Technical Requirements
            </h4>
            <ul className="space-y-2">
              {standard.keyRequirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mandatory Laboratory Tests */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Required Laboratory Testing Protocols
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {standard.mandatoryTests.map((test, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                  <span className="font-semibold text-slate-900">• {test}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Practical Field Testing Tips */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Civil Engineer Field Verification Tips
            </h4>
            <div className="space-y-1.5">
              {standard.fieldTestingTips.map((tip, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                  <span className="text-amber-700 font-bold">✓</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Source */}
          <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex flex-col sm:flex-row justify-between gap-2">
            <div>
              <span className="text-slate-600 font-medium">Bureau Authority:</span> {standard.referenceDocument}
            </div>
            <div>
              <span className="text-slate-600 font-medium">Source:</span> {standard.verificationSource}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50/80 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-xs"
          >
            Close Specification
          </button>
        </div>
      </div>
    </div>
  );
};

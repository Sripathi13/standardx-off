import React from 'react';
import { RecommendedProduct } from '../types';
import { X, Check, ShieldCheck, Award, Zap, Building, HelpCircle } from 'lucide-react';
import { sanitizeProductName, sanitizeQualitySpec, sanitizeProduct } from '../utils/qualitySanitizer';

interface ProductCompareModalProps {
  isOpen: boolean;
  materialName: string;
  requiredQuantity: number;
  unit: string;
  products: RecommendedProduct[];
  selectedProductId?: string;
  onSelectProduct: (product: RecommendedProduct) => void;
  onClose: () => void;
}

export const ProductCompareModal: React.FC<ProductCompareModalProps> = ({
  isOpen,
  materialName,
  requiredQuantity,
  unit,
  products,
  selectedProductId,
  onSelectProduct,
  onClose
}) => {
  if (!isOpen) return null;

  const getRankBadge = (rank: string) => {
    switch (rank) {
      case 'highly_recommended':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <Award className="w-3.5 h-3.5 text-emerald-400" /> Highly Recommended
          </span>
        );
      case 'averagely_recommended':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
            <Zap className="w-3.5 h-3.5 text-blue-400" /> Averagely Recommended
          </span>
        );
      case 'low_level_recommended':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Low-Level Recommended
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col text-slate-900 shadow-2xl relative my-8">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 rounded-t-2xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Direct 3-Way Quality Grade Comparison
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500">Required: {requiredQuantity.toLocaleString()} {unit}</span>
            </div>
            <h2 className="text-xl font-extrabold font-display text-slate-900 mt-1">
              Comparing Quality Grades for: {materialName}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Classified strictly by BIS technical standards, structural strength, and engineering performance without commercial brand bias.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Comparison Table / Grid */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {products.map((prod) => {
              const isSelected = selectedProductId === prod.id;
              const totalCost = requiredQuantity * prod.unitPrice;

              return (
                <div
                  key={prod.id}
                  className={`rounded-xl border p-5 flex flex-col justify-between space-y-4 transition-all ${
                    isSelected
                      ? 'bg-amber-50/40 border-amber-500 ring-2 ring-amber-400/30 shadow-md'
                      : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Top Rank Badge */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      {getRankBadge(prod.recommendationRank)}
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                          <Check className="w-3 h-3 text-amber-700" /> Selected
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-slate-900 font-display leading-snug">
                        {sanitizeProductName(prod.name, prod.materialCategory)}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Quality Spec: {sanitizeQualitySpec(prod.brand, prod)}
                      </p>
                    </div>

                    {/* Price Block */}
                    <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-slate-500">Unit Rate:</span>
                        <span className="text-lg font-bold text-slate-900">
                          ₹{prod.unitPrice.toLocaleString()} <span className="text-xs font-normal text-slate-500">/ {prod.unit}</span>
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between mt-1 pt-1 border-t border-slate-100">
                        <span className="text-xs text-amber-800 font-medium">Batch Estimated Cost:</span>
                        <span className="text-sm font-extrabold text-amber-800">
                          ₹{Math.round(totalCost).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* BIS Reference */}
                    <div className="space-y-1 text-xs">
                      <div className="text-slate-500 font-medium">BIS Standard:</div>
                      <div className="font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                        {prod.bisStandardCode}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Ref: {prod.certificationReference}
                      </div>
                    </div>

                    {/* Why this Rank */}
                    <div className="space-y-1 text-xs">
                      <div className="text-amber-800 font-semibold flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-600" /> Why this ranking?
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                        {prod.rankExplanation}
                      </p>
                    </div>

                    {/* Quality Features List */}
                    <div className="space-y-2 text-xs pt-1 border-t border-slate-200">
                      <div className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">
                        Technical Quality Specs:
                      </div>
                      <div className="space-y-1.5 text-slate-600 text-[11px]">
                        <div>
                          <strong className="text-slate-700">Strength:</strong> {prod.qualityFeatures.strength}
                        </div>
                        <div>
                          <strong className="text-slate-700">Durability:</strong> {prod.qualityFeatures.durability}
                        </div>
                        {prod.qualityFeatures.settingProperties && (
                          <div>
                            <strong className="text-slate-700">Setting:</strong> {prod.qualityFeatures.settingProperties}
                          </div>
                        )}
                        {prod.qualityFeatures.elongationOrDuctility && (
                          <div>
                            <strong className="text-slate-700">Ductility:</strong> {prod.qualityFeatures.elongationOrDuctility}
                          </div>
                        )}
                        <div>
                          <strong className="text-slate-700">Suitability:</strong> {prod.qualityFeatures.constructionSuitability}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Select Button */}
                  <div className="pt-3">
                    <button
                      id={`compare-select-${prod.id}`}
                      onClick={() => {
                        onSelectProduct(sanitizeProduct(prod));
                        onClose();
                      }}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-800 border border-slate-200'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>{isSelected ? 'Currently Selected' : 'Choose This Quality Grade'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50/80 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold cursor-pointer"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};

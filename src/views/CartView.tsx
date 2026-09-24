import React, { useState } from 'react';
import { CartItem, LogisticsConfig } from '../types';
import { sanitizeProductName, sanitizeQualitySpec } from '../utils/qualitySanitizer';
import { 
  ShoppingCart, 
  Trash2, 
  FileText, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Users, 
  Receipt, 
  AlertCircle,
  Plus,
  Minus,
  CheckCircle2,
  Building2,
  RefreshCw
} from 'lucide-react';

interface CartViewProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onGenerateQuotation: (config: LogisticsConfig) => void;
  onNavigate: (view: string) => void;
  activeProjectName?: string;
  hasIncompleteWarning?: boolean;
}

export const CartView: React.FC<CartViewProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onGenerateQuotation,
  onNavigate,
  activeProjectName,
  hasIncompleteWarning
}) => {
  // Logistics configuration
  const [logistics, setLogistics] = useState<LogisticsConfig>({
    includeTransportation: true,
    transportationCostPct: 4.5,
    includeLabor: true,
    laborCostPct: 18.0,
    includeTax: true,
    taxGstPct: 18.0,
    includeContingency: true,
    contingencyPct: 5.0
  });

  // Financial calculations
  const rawMaterialTotal = cartItems.reduce((acc, item) => acc + item.totalCost, 0);

  const transportCost = logistics.includeTransportation 
    ? (rawMaterialTotal * (logistics.transportationCostPct / 100)) 
    : 0;

  const laborCost = logistics.includeLabor 
    ? (rawMaterialTotal * (logistics.laborCostPct / 100)) 
    : 0;

  const contingencyCost = logistics.includeContingency 
    ? ((rawMaterialTotal + transportCost + laborCost) * (logistics.contingencyPct / 100)) 
    : 0;

  const preTaxSubtotal = rawMaterialTotal + transportCost + laborCost + contingencyCost;

  const taxGst = logistics.includeTax 
    ? (preTaxSubtotal * (logistics.taxGstPct / 100)) 
    : 0;

  const grandTotal = preTaxSubtotal + taxGst;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-display text-slate-900">
            Your Material Cart is Empty
          </h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Create a construction project or select materials from the marketplace to calculate your certified project estimation.
          </p>
        </div>
        <div className="flex justify-center gap-4 pt-2">
          <button
            onClick={() => onNavigate('create-project')}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            Create New Project
          </button>
          <button
            onClick={() => onNavigate('marketplace')}
            className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-all cursor-pointer"
          >
            Browse Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Procurement & Bill of Quantities
            </span>
            {activeProjectName && (
              <>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-700">{activeProjectName}</span>
              </>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-0.5">
            Material Cart ({cartItems.length} Quality Items)
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClearCart}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
          >
            Clear Cart
          </button>
          <button
            id="btn-generate-quotation-top"
            onClick={() => onGenerateQuotation(logistics)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Quotation</span>
          </button>
        </div>
      </div>

      {/* Warning if incomplete materials */}
      {hasIncompleteWarning && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Incomplete Material Selection Advisory:</span>
            <p>
              Some estimated structural materials were not selected. The cost below only includes the materials currently in your cart. 
              The final quotation document will document this selection state.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Items List & Financial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm">
            {cartItems.map((item) => (
              <div key={item.id} className="p-5 sm:p-6 space-y-4 hover:bg-slate-50/60 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        item.product.recommendationRank === 'highly_recommended'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : item.product.recommendationRank === 'averagely_recommended'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {item.product.rankTitle}
                      </span>
                      <span className="text-[11px] font-semibold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                        {item.product.bisStandardCode}
                      </span>
                      <span className="text-[11px] text-slate-400 capitalize">
                        {item.materialCategory}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base font-display">
                      {sanitizeProductName(item.product.name, item.materialCategory)}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Quality Spec: {sanitizeQualitySpec(item.product.brand, item.product)} • Unit Rate: ₹{item.unitPrice.toLocaleString()} / {item.unit}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-extrabold text-slate-900 font-display">
                      ₹{Math.round(item.totalCost).toLocaleString()}
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-xs text-slate-400 hover:text-rose-600 transition-colors mt-1 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>

                {/* Interactive Quantity Stepper */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-medium">Quantity:</span>
                    <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 10))}
                        className="px-2.5 py-1.5 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                        title="Reduce 10"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => onUpdateQuantity(item.id, parseFloat(e.target.value) || 1)}
                        className="w-24 text-center font-bold text-slate-900 text-xs py-1 focus:outline-none"
                      />
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 10)}
                        className="px-2.5 py-1.5 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                        title="Add 10"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="font-semibold text-slate-700">{item.unit}</span>
                  </div>

                  <div className="text-[11px] text-slate-500">
                    Quality Spec: <strong>{item.product.qualityFeatures.strength}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <span>Want to add more specialized items?</span>
            <button
              onClick={() => onNavigate('marketplace')}
              className="text-amber-700 font-bold hover:underline cursor-pointer"
            >
              Browse Open Material Marketplace →
            </button>
          </div>
        </div>

        {/* Financial & Logistics Summary (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-6">
            <h3 className="text-base font-extrabold text-slate-900 font-display border-b border-slate-100 pb-3">
              Cost & Logistics Calculator
            </h3>

            {/* Configurable Toggles */}
            <div className="space-y-3.5 text-xs">
              {/* Transportation */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={logistics.includeTransportation}
                    onChange={(e) => setLogistics({ ...logistics, includeTransportation: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-slate-500" /> Logistics & Transport
                  </span>
                </label>
                <span className="font-mono text-slate-600">
                  {logistics.includeTransportation ? `₹${Math.round(transportCost).toLocaleString()}` : 'Excluded'}
                </span>
              </div>

              {/* Labor & Installation */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={logistics.includeLabor}
                    onChange={(e) => setLogistics({ ...logistics, includeLabor: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-500" /> Site Labor (~18%)
                  </span>
                </label>
                <span className="font-mono text-slate-600">
                  {logistics.includeLabor ? `₹${Math.round(laborCost).toLocaleString()}` : 'Excluded'}
                </span>
              </div>

              {/* Contingency */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={logistics.includeContingency}
                    onChange={(e) => setLogistics({ ...logistics, includeContingency: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span className="font-semibold text-slate-700">Contingency (5%)</span>
                </label>
                <span className="font-mono text-slate-600">
                  {logistics.includeContingency ? `₹${Math.round(contingencyCost).toLocaleString()}` : 'Excluded'}
                </span>
              </div>

              {/* GST Tax */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={logistics.includeTax}
                    onChange={(e) => setLogistics({ ...logistics, includeTax: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <Receipt className="w-3.5 h-3.5 text-slate-500" /> GST (18%)
                  </span>
                </label>
                <span className="font-mono text-slate-600">
                  {logistics.includeTax ? `₹${Math.round(taxGst).toLocaleString()}` : 'Excluded'}
                </span>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 pt-3 border-t border-slate-200 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Materials Subtotal:</span>
                <span className="font-mono font-medium text-slate-800">
                  ₹{Math.round(rawMaterialTotal).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Transport & Site Handling:</span>
                <span className="font-mono">₹{Math.round(transportCost).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Labor & Masonry:</span>
                <span className="font-mono">₹{Math.round(laborCost).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Applicable GST (18%):</span>
                <span className="font-mono">₹{Math.round(taxGst).toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-200 text-sm font-bold text-slate-900">
                <span>Estimated Grand Total:</span>
                <span className="text-xl font-black text-amber-600 font-display">
                  ₹{Math.round(grandTotal).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Generate Quotation CTA */}
            <button
              id="btn-generate-quotation-main"
              onClick={() => onGenerateQuotation(logistics)}
              className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition-all shadow-lg hover:shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Official Quotation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 text-slate-800 border border-slate-200 text-xs space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-2 text-amber-800 font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>BIS Verification Guarantee</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Every item in your cart traces to its specific Indian Standards specification number for full auditability on site.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

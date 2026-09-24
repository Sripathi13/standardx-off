import React, { useState } from 'react';
import { ALL_PRODUCTS_DATABASE } from '../data/productsDatabase';
import { RecommendedProduct } from '../types';
import { sanitizeProductName, sanitizeQualitySpec, sanitizeProduct } from '../utils/qualitySanitizer';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  ShieldCheck, 
  Award, 
  Zap, 
  Check, 
  Plus, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface MarketplaceViewProps {
  onAddToCart: (items: any[]) => void;
  onNavigate: (view: string) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  onAddToCart,
  onNavigate
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [selectedRank, setSelectedRank] = useState('All');
  const [quantityInputs, setQuantityInputs] = useState<Record<string, number>>({});
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const categories = [
    'All',
    'cement',
    'steel',
    'sand',
    'aggregate',
    'bricks',
    'bitumen',
    'gsb',
    'wmm',
    'binding_wire'
  ];

  const filteredProducts = ALL_PRODUCTS_DATABASE.filter((prod) => {
    const matchesSearch = 
      prod.name.toLowerCase().includes(search.toLowerCase()) ||
      prod.brand.toLowerCase().includes(search.toLowerCase()) ||
      prod.bisStandardCode.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCat === 'All' || prod.materialCategory === selectedCat;
    const matchesRank = selectedRank === 'All' || prod.recommendationRank === selectedRank;

    return matchesSearch && matchesCategory && matchesRank;
  });

  const handleAddProduct = (prod: RecommendedProduct) => {
    const cleanProd = sanitizeProduct(prod);
    const qty = quantityInputs[prod.id] || 100;
    const item = {
      id: `cart-market-${Date.now()}-${prod.id}`,
      projectId: 'direct-marketplace',
      projectName: 'Direct Procurement',
      materialCategory: cleanProd.materialCategory,
      materialName: cleanProd.name,
      product: cleanProd,
      quantity: qty,
      unit: cleanProd.unit,
      unitPrice: cleanProd.unitPrice,
      totalCost: qty * cleanProd.unitPrice,
      wastageFactorPct: 5
    };

    onAddToCart([item]);
    setAddedNotice(`Added ${qty} ${cleanProd.unit} of ${cleanProd.name} to Cart`);
    setTimeout(() => setAddedNotice(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50/80 via-white to-orange-50/60 rounded-2xl p-6 sm:p-8 border border-amber-200/80 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Procurement & Direct Sourcing
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              BIS-Certified Material Marketplace
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm">
              Explore rated construction products meeting Bureau of Indian Standards criteria for structural durability.
            </p>
          </div>

          <button
            onClick={() => onNavigate('cart')}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer w-fit"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Go to Cart</span>
          </button>
        </div>
      </div>

      {/* Added Notification */}
      {addedNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{addedNotice}</span>
          </div>
          <button
            onClick={() => onNavigate('cart')}
            className="underline text-[11px] cursor-pointer"
          >
            View Cart
          </button>
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quality grade, BIS code (IS 269, Fe 550D, M-Sand)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/40 bg-slate-50"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedRank}
              onChange={(e) => setSelectedRank(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-slate-50"
            >
              <option value="All">All Quality Ranks</option>
              <option value="highly_recommended">Highly Recommended Only</option>
              <option value="averagely_recommended">Averagely Recommended Only</option>
              <option value="low_level_recommended">Low-Level Recommended Only</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCat(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all cursor-pointer ${
                selectedCat === c
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {c.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((prod) => {
          const qty = quantityInputs[prod.id] || 100;
          const subtotal = qty * prod.unitPrice;

          return (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between space-y-4 hover:shadow-lg transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    prod.recommendationRank === 'highly_recommended'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : prod.recommendationRank === 'averagely_recommended'
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {prod.rankTitle}
                  </span>
                  <span className="text-xs font-semibold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                    {prod.bisStandardCode}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base font-display">
                    {sanitizeProductName(prod.name, prod.materialCategory)}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Quality Spec: {sanitizeQualitySpec(prod.brand, prod)} • <span className="capitalize">{prod.materialCategory}</span>
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-baseline justify-between">
                  <div>
                    <div className="text-[11px] text-slate-500">Unit Price:</div>
                    <div className="text-lg font-bold text-slate-900 font-display">
                      ₹{prod.unitPrice.toLocaleString()}{' '}
                      <span className="text-xs font-normal text-slate-500">/ {prod.unit}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">Packaging:</div>
                    <div className="text-xs font-semibold text-slate-700">{prod.packageDetails}</div>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-600">
                  <div><strong>Strength:</strong> {prod.qualityFeatures.strength}</div>
                  <div><strong>Suitability:</strong> {prod.qualityFeatures.constructionSuitability}</div>
                </div>

                <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
                  "{prod.rankExplanation}"
                </p>
              </div>

              {/* Quantity selector & Add to Cart */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Order Quantity:</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="1"
                      value={qty}
                      onChange={(e) => setQuantityInputs({
                        ...quantityInputs,
                        [prod.id]: parseFloat(e.target.value) || 1
                      })}
                      className="w-20 px-2 py-1 rounded border border-slate-300 text-center font-bold text-xs"
                    />
                    <span className="font-semibold text-slate-700">{prod.unit}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleAddProduct(prod)}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add {qty} {prod.unit} to Cart (₹{Math.round(subtotal).toLocaleString()})</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

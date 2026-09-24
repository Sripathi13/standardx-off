import React, { useState } from 'react';
import { BIS_STANDARDS_LIBRARY } from '../data/bisStandards';
import { BisStandardInfo } from '../types';
import { BisDetailModal } from '../components/BisDetailModal';
import { 
  ShieldCheck, 
  Search, 
  BookOpen, 
  FileCheck, 
  ArrowUpRight, 
  CheckCircle2, 
  ChevronRight,
  Filter
} from 'lucide-react';

export const BisStandardsView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStandard, setSelectedStandard] = useState<BisStandardInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    'All',
    'Cement',
    'Steel Reinforcement',
    'Aggregates & Sand',
    'Masonry & Blocks',
    'Bitumen & Asphalt',
    'Water & Chemicals'
  ];

  const filteredStandards = BIS_STANDARDS_LIBRARY.filter((std) => {
    const matchesSearch = 
      std.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.scope.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || std.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleOpenStandard = (std: BisStandardInfo) => {
    setSelectedStandard(std);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-50/80 via-white to-orange-50/60 rounded-2xl p-6 sm:p-10 border border-amber-200/80 shadow-sm">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-xs font-bold border border-amber-500/20">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Official Bureau of Indian Standards (BIS) Registry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900">
            Civil Engineering Standards & Quality Codes
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Direct reference library of Indian Standards applicable to structural concrete, reinforcement rebars, 
            fine & coarse aggregates, masonry blocks, and highway pavement construction.
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by IS code (e.g. IS 456, IS 1786), material or parameter..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/40 bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Standards Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStandards.map((std) => (
          <div
            key={std.code}
            className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between space-y-4 hover:shadow-lg transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {std.category}
                </span>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Active BIS Standard
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 font-display">
                  {std.code}
                </h3>
                <h4 className="text-xs font-semibold text-slate-600 mt-1 leading-snug line-clamp-2">
                  {std.title}
                </h4>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                {std.scope}
              </p>

              {/* Sample Requirements */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-700">
                <div className="font-bold text-[11px] uppercase tracking-wider text-slate-400">
                  Mandatory Requirements:
                </div>
                {std.keyRequirements.slice(0, 2).map((req, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleOpenStandard(std)}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>View Full Specifications & Tests</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredStandards.length === 0 && (
        <div className="text-center py-12 text-slate-500 space-y-2">
          <p>No standards found matching your criteria.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="text-xs text-amber-600 font-bold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* BIS Detail Modal */}
      <BisDetailModal
        standard={selectedStandard}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

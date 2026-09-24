import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  FileCode,
  ShieldCheck,
  Calculator,
  FileText,
  Terminal,
  Cpu,
  Layers,
  ArrowRight,
  ExternalLink,
  Code2
} from 'lucide-react';

interface DocumentationViewProps {
  onNavigate: (view: string) => void;
}

export const DocumentationView: React.FC<DocumentationViewProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'formulas' | 'sanitizer' | 'tests' | 'standards'>('formulas');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-slate-200 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider mb-1">
                <BookOpen className="w-4 h-4 text-amber-700" />
                <span>Technical Specifications & Standards</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 font-display">
                STANDARD <span className="text-amber-600">X</span> Core Documentation
              </h1>
              <p className="mt-2 text-slate-600 max-w-3xl text-sm sm:text-base">
                Engineering formulas, Bureau of Indian Standards (BIS) compliance benchmarks, unit test suites, and zero-bias quality sanitization architecture.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                40/40 Unit Tests Passing
              </span>
              <button
                onClick={() => onNavigate('create-project')}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <span>Launch Estimator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-2 scrollbar-thin">
            {[
              { id: 'formulas', label: 'Estimation Formulas', icon: Calculator },
              { id: 'standards', label: 'BIS & IRC Standards', icon: ShieldCheck },
              { id: 'sanitizer', label: 'Zero-Vendor Neutrality', icon: Layers },
              { id: 'tests', label: 'Unit Test Coverage', icon: Terminal },
              { id: 'architecture', label: 'System Architecture', icon: Cpu }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                      : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: Formulas */}
        {activeTab === 'formulas' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Building Estimation */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-800 font-bold">Code: IS 456:2000 & SP 16</span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-1">1. Commercial & Residential Buildings (RCC & Load-Bearing)</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Parameterizes total built-up area (A, in sq.ft), number of floors (F), and framing system.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 font-mono text-xs text-slate-700 space-y-2 shadow-2xs">
                  <div className="text-amber-800 font-bold border-b border-slate-200 pb-1.5 flex items-center justify-between">
                    <span>Floor Multiplier Factor (Kf)</span>
                    <span className="text-[10px] text-slate-500">Wind & Column Gravity</span>
                  </div>
                  <p className="font-semibold text-slate-900">Kf = 1.05 if (Floors &gt; 3) else 1.00</p>
                  <p className="text-slate-500 pt-2 border-t border-slate-200">
                    Accounts for progressive column sizing, seismic ductility detailing, and heavier foundation pads in high-rise spans.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 font-mono text-xs text-slate-700 space-y-2 shadow-2xs">
                  <div className="text-amber-800 font-bold border-b border-slate-200 pb-1.5 flex items-center justify-between">
                    <span>Wastage Allowances</span>
                    <span className="text-[10px] text-slate-500">Site Cutting & Handling</span>
                  </div>
                  <p>Cement: +5% | TMT Steel: +3% | Sand: +6%</p>
                  <p>Coarse Aggregate: +4% | Masonry Bricks: +7%</p>
                  <p>Potable Water: +8% | Binding Wire: +5%</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-100 text-slate-800 uppercase tracking-wider font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Material Category</th>
                      <th className="p-3">RCC Framed Structure</th>
                      <th className="p-3">Load-Bearing Structure</th>
                      <th className="p-3">Steel Structure</th>
                      <th className="p-3">BIS Code</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">OPC 53 Cement</td>
                      <td className="p-3 text-amber-800 font-bold">A * 0.42 * Kf * 1.05 bags</td>
                      <td className="p-3">A * 0.35 * Kf * 1.05 bags</td>
                      <td className="p-3">A * 0.25 * Kf * 1.05 bags</td>
                      <td className="p-3 text-slate-500">IS 269:2015</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">TMT Rebar (Fe 550D)</td>
                      <td className="p-3 text-amber-800 font-bold">A * 4.00 * Kf * 1.03 kg</td>
                      <td className="p-3">A * 2.00 * Kf * 1.03 kg</td>
                      <td className="p-3">A * 2.20 * Kf * 1.03 kg</td>
                      <td className="p-3 text-slate-500">IS 1786:2008</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">Zone II Sand (M-Sand)</td>
                      <td className="p-3 text-amber-800 font-bold">A * 0.052 * 1.06 m³</td>
                      <td className="p-3">A * 0.052 * 1.06 m³</td>
                      <td className="p-3">A * 0.030 * 1.06 m³</td>
                      <td className="p-3 text-slate-500">IS 383:2016</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">20mm/10mm Aggregate</td>
                      <td className="p-3 text-amber-800 font-bold">A * 0.038 * 1.04 m³</td>
                      <td className="p-3">A * 0.038 * 1.04 m³</td>
                      <td className="p-3">A * 0.022 * 1.04 m³</td>
                      <td className="p-3 text-slate-500">IS 383:2016</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">Bricks / AAC Blocks</td>
                      <td className="p-3 text-amber-800 font-bold">A * 18.0 * 1.07 units</td>
                      <td className="p-3">A * 22.0 * 1.07 units</td>
                      <td className="p-3">A * 14.0 * 1.07 units</td>
                      <td className="p-3 text-slate-500">IS 1077 / IS 2185</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Highway Pavements */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-amber-800 font-bold">Code: IRC:58-2015 & MoRTH (5th Rev)</span>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">2. Highway & Road Infrastructure (Rigid & Flexible)</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Accurate pavement crust calculation using carriageway width, length, and layer thicknesses.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 shadow-2xs">
                  <h3 className="font-bold text-amber-800 text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    Rigid Concrete Road (PQC)
                  </h3>
                  <div className="font-mono text-xs text-slate-700 space-y-1.5">
                    <p>• PQC Volume: V = Length(m) * Width(m) * Thickness(m)</p>
                    <p>• OPC 53 Cement: round(V * 7.8 bags) (~390 kg/m³)</p>
                    <p>• Dowel & Tie Steel: round(Area * 3.6 kg)</p>
                    <p>• GSB Sub-Base: Length * (Width + 0.8) * 0.15 m³</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 shadow-2xs">
                  <h3 className="font-bold text-amber-800 text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    Flexible Bituminous Road (MoRTH)
                  </h3>
                  <div className="font-mono text-xs text-slate-700 space-y-1.5">
                    <p>• Bituminous Volume: V = Area * Thickness(m)</p>
                    <p>• Compacted Mix: round(V * 2.42 Tonnes) (bulk density)</p>
                    <p>• VG-30 Bitumen: Mix * 0.049 Tonnes (4.9% binder content)</p>
                    <p>• WMM Base: Area * 0.225 m³ (Wet Mix Macadam)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Standards */}
        {activeTab === 'standards' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">Bureau of Indian Standards (BIS) & IRC Library</h2>
              <p className="text-sm text-slate-600">
                Every calculation and recommended product links directly to mandatory testing criteria under Indian civil engineering regulations.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {[
                  { code: 'IS 456:2000', title: 'Plain and Reinforced Concrete', desc: 'Mandatory minimum cement content, cover, and water-cement ratios.' },
                  { code: 'IS 1786:2008', title: 'High Strength Deformed Steel Bars', desc: 'Proof stress, ductility, and elongation criteria for Fe 500D and Fe 550D.' },
                  { code: 'IS 269:2015', title: 'Ordinary Portland Cement', desc: '28-day strength minimum 53 MPa, Blaine fineness ≥ 225 m²/kg.' },
                  { code: 'IS 383:2016', title: 'Coarse and Fine Aggregates', desc: 'Grading Zones I-IV, impact value < 18%, flakiness/elongation limits.' },
                  { code: 'IS 1077:1992', title: 'Common Burnt Clay Bricks', desc: 'Compressive strength classes, 24-hour water absorption < 20%.' },
                  { code: 'IS 73:2013', title: 'Paving Bitumen Specification', desc: 'Viscosity grading VG-10, VG-30, and VG-40 for asphalt roads.' },
                  { code: 'IRC:37-2018', title: 'Design of Flexible Pavements', desc: 'Sub-base CBR minimum 30%, WMM compaction at 98% Modified Proctor.' },
                  { code: 'IRC:58-2015', title: 'Design of Plain Jointed Rigid Pavements', desc: 'Flexural strength 4.5 MPa, dowel bar load transfer design.' },
                  { code: 'IRC:112-2020', title: 'Code of Practice for Concrete Road Bridges', desc: 'Limit state design, durability, and 135 kg/m³ rebar density.' },
                ].map((std) => (
                  <div key={std.code} className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2 hover:border-amber-400 transition-colors shadow-2xs">
                    <span className="text-xs font-mono font-bold text-amber-800">{std.code}</span>
                    <h3 className="font-bold text-slate-900 text-sm">{std.title}</h3>
                    <p className="text-xs text-slate-600">{std.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Sanitizer */}
        {activeTab === 'sanitizer' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Statutory Procurement Neutrality</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Zero-Vendor Bias & Brand Sanitization Engine</h2>
              <p className="text-sm text-slate-600 max-w-3xl">
                Government tenders (CPWD Works Manual Clause 16.3) prohibit referencing proprietary manufacturers in engineering BOQs and cost estimates. The STANDARD X Quality Sanitizer automatically detects and strips private brand names and maps items into pure technical quality grades.
              </p>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-4 font-mono text-xs shadow-2xs">
                <div className="text-amber-800 font-bold uppercase tracking-wider border-b border-slate-200 pb-2">
                  Transformation Matrix Samples
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-700">
                  <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                    <span className="text-red-800 font-bold block mb-1">Commercial Brand Input:</span>
                    <p className="line-through text-slate-500">Tata Tiscon Fe 550D Super Ductile Rebar</p>
                    <p className="line-through text-slate-500">UltraTech Super OPC 53 Grade Cement</p>
                    <p className="line-through text-slate-500">Ambuja Kawach PPC Fly Ash Cement</p>
                    <p className="line-through text-slate-500">Robo Silicon Hydro-Washed VSI M-Sand</p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
                    <span className="text-emerald-800 font-bold block mb-1">Sanitized BIS Technical Output:</span>
                    <p className="text-emerald-700 font-semibold">Fe 550D Super Ductile Grade (IS 1786)</p>
                    <p className="text-emerald-700 font-semibold">Grade 53 High-Early Strength OPC (IS 269)</p>
                    <p className="text-emerald-700 font-semibold">Grade 43 Pozzolana Structural Cement (IS 1489)</p>
                    <p className="text-emerald-700 font-semibold">IS 383 Zone II Hydro-Washed M-Sand Grade</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Unit Tests */}
        {activeTab === 'tests' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Comprehensive Vitest Unit Test Suite</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Every estimation thumb-rule, regex parser, data structure, and financial formula is validated by automated unit tests.
                  </p>
                </div>
                <span className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 font-mono text-xs text-amber-800 font-bold">
                  npm test
                </span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    file: 'tests/services/estimationEngine.test.ts',
                    count: 11,
                    desc: 'Tests RCC buildings, Load-Bearing structures, Steel structures, multi-floor scaling, rigid concrete roads, MoRTH flexible roads, IRC:112 bridges, and residential tiers.'
                  },
                  {
                    file: 'tests/services/tenderExtractionService.test.ts',
                    count: 5,
                    desc: 'Tests multi-typology parsing from raw document text, sample tender schemas, built-up areas, floor counts, road kilometers, bridge spans, and audit confidence scores.'
                  },
                  {
                    file: 'tests/utils/qualitySanitizer.test.ts',
                    count: 10,
                    desc: 'Tests brand stripping across 25+ manufacturers, steel Fe 550D/500D classification, cement OPC/PPC classification, aggregate grading, and full CartItem sanitization.'
                  },
                  {
                    file: 'tests/data/productsAndStandards.test.ts',
                    count: 9,
                    desc: 'Validates BIS catalog completeness, standard retrieval by code, category filtering, product database pricing bounds, and sample project requirements.'
                  },
                  {
                    file: 'tests/services/quotationEngine.test.ts',
                    count: 2,
                    desc: 'Tests cart financial calculations, freight logistics (4.5%), site labor (18%), contingency (5%), and 18% GST tax calculation.'
                  },
                  {
                    file: 'tests/utils/documentTextExtractor.test.ts',
                    count: 3,
                    desc: 'Tests plain text, CSV tabular BOQ data, and Markdown file extraction.'
                  }
                ].map((suite) => (
                  <div key={suite.file} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-amber-700" />
                        <span className="font-mono text-xs font-bold text-slate-900">{suite.file}</span>
                      </div>
                      <p className="text-xs text-slate-600">{suite.desc}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap self-start sm:self-auto">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {suite.count} Tests Passed
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-100 text-slate-800 border border-slate-300 rounded-xl p-4 font-mono text-xs space-y-1 shadow-2xs">
                <span className="text-amber-800 font-bold">Vitest Execution Log:</span>
                <p className="text-emerald-700 font-semibold">✓ Test Files  6 passed (6)</p>
                <p className="text-emerald-700 font-semibold">✓ Tests       40 passed (40)</p>
                <p className="text-slate-500">Duration: 1.79s | Workers spawned: 6</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Architecture */}
        {activeTab === 'architecture' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">System Architecture & Technical Stack</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2 shadow-2xs">
                  <h3 className="text-sm font-bold text-amber-800">Client Runtime</h3>
                  <p className="text-xs text-slate-600">• React 19 SPA with Vite</p>
                  <p className="text-xs text-slate-600">• TypeScript 5.8 Strict Typing</p>
                  <p className="text-xs text-slate-600">• Tailwind CSS Design System</p>
                  <p className="text-xs text-slate-600">• Zero client tracking or telemetry</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2 shadow-2xs">
                  <h3 className="text-sm font-bold text-amber-800">Document Processing</h3>
                  <p className="text-xs text-slate-600">• PDF parsing via pdfjs-dist</p>
                  <p className="text-xs text-slate-600">• DOCX & XLSX via JSZip</p>
                  <p className="text-xs text-slate-600">• Regex heuristic pattern bank</p>
                  <p className="text-xs text-slate-600">• Instant client-side verification</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2 shadow-2xs">
                  <h3 className="text-sm font-bold text-amber-800">Export & Financials</h3>
                  <p className="text-xs text-slate-600">• jsPDF vector rendering</p>
                  <p className="text-xs text-slate-600">• html2canvas-pro print snapshot</p>
                  <p className="text-xs text-slate-600">• 18% GST statutory breakdown</p>
                  <p className="text-xs text-slate-600">• Direct factory logistics model</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Compass, 
  Calculator, 
  FileCheck, 
  Award, 
  Scale, 
  HardHat, 
  ChevronRight,
  Sparkles,
  TrendingUp,
  Sliders,
  Check,
  Zap,
  Info
} from 'lucide-react';
import { getRecommendedProductsForMaterial } from '../data/productsDatabase';
import { RecommendedProduct } from '../types';
import { sanitizeProductName, sanitizeQualitySpec } from '../utils/qualitySanitizer';

interface HomeViewProps {
  onNavigate: (view: string) => void;
  onSelectSampleCategory?: (category: string) => void;
  onOpenProductCompare?: (materialName: string, quantity: number, unit: string, products: RecommendedProduct[]) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ 
  onNavigate, 
  onSelectSampleCategory,
  onOpenProductCompare
}) => {
  const [activePreviewTab, setActivePreviewTab] = useState<'cement' | 'steel' | 'bricks'>('cement');

  const previewProducts = getRecommendedProductsForMaterial(activePreviewTab);

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* SECTION 1: HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/70 via-slate-50 to-white text-slate-900 pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-amber-300 text-xs font-semibold text-amber-800 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Verified Bureau of Indian Standards (BIS) Integration</span>
              </div>

              {/* Exact Requested Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 font-display leading-[1.1]">
                Build Smarter. Choose Better. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700">
                  Estimate with Confidence.
                </span>
              </h1>

              {/* Exact Requested Subheading */}
              <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl">
                Estimate construction materials, compare quality-certified products, 
                understand BIS standards, and calculate the approximate cost of your construction project.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  id="hero-btn-create-project"
                  onClick={() => onNavigate('create-project')}
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-base shadow-lg shadow-amber-500/20 transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>Create New Project</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  id="hero-btn-house-owners"
                  onClick={() => onNavigate('house-owners')}
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-slate-400 font-bold text-base transition-all cursor-pointer shadow-xs"
                >
                  <HardHat className="w-5 h-5 text-amber-600" />
                  <span>For House Owners</span>
                </button>
              </div>

              {/* Official Procurement Officer Banner */}
              <div className="bg-gradient-to-r from-amber-100/70 via-white to-amber-50 border border-amber-300 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-200/80 text-amber-800 border border-amber-300 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Official Portal</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">GeM & CPWD</span>
                    </div>
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
                      Procurement Officer Portal & AI Recommendation Engine
                    </h2>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Automate Indian Standards identification, normative ecosystems, and tender specification drafting.
                    </p>
                  </div>
                </div>

                <button
                  id="hero-btn-procurement-portal"
                  onClick={() => onNavigate('procurement-portal')}
                  className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 whitespace-nowrap cursor-pointer self-stretch sm:self-auto justify-center"
                >
                  <span>Officer Portal Login</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Verified Trust Markers */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 text-xs">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 font-display">100%</div>
                  <div className="text-slate-500 mt-0.5">IS Standard Aligned</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-amber-700 font-display">3 Tiers</div>
                  <div className="text-slate-500 mt-0.5">Ranked Recommendations</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-blue-700 font-display">₹ Dynamic</div>
                  <div className="text-slate-500 mt-0.5">Real-time Quotations</div>
                </div>
              </div>
            </div>

            {/* Right Interactive Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200 p-1 border border-slate-300 shadow-xl">
                <div className="rounded-[14px] bg-white p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm border border-amber-200">
                        SX
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Structural Estimation Matrix
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Empirical Code IS 456 & MoRTH
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Live Engine
                    </span>
                  </div>

                  {/* Sample calculation summary card */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Spec: Residential G+2 RCC</span>
                      <span className="font-bold text-amber-700">2,400 sq.ft</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 rounded bg-white border border-slate-200 shadow-2xs">
                        <span className="text-slate-700">OPC 53 Grade Cement</span>
                        <span className="font-semibold text-slate-900">1,008 Bags (IS 269)</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-white border border-slate-200 shadow-2xs">
                        <span className="text-slate-700">Fe 550D TMT Reinforcement</span>
                        <span className="font-semibold text-slate-900">9,600 kg (IS 1786)</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-white border border-slate-200 shadow-2xs">
                        <span className="text-slate-700">Manufactured Sand Zone II</span>
                        <span className="font-semibold text-slate-900">124.8 m³ (IS 383)</span>
                      </div>
                    </div>
                  </div>

                  {/* 3 Tier Quality preview indicator */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Every Material Curated into Exactly 3 Choices:
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-center">
                      <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                        ★ Highly Recommended
                      </div>
                      <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-800">
                        ● Averagely Recommended
                      </div>
                      <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
                        ▲ Low-Level Recommended
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('create-project')}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>Try With Your Project Dimensions</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: HOW THE PLATFORM WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 border border-amber-500/20">
            System Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
            How STANDARD X Works
          </h2>
          <p className="text-slate-600 text-base">
            A transparent 5-step engineering pipeline designed for project managers, site contractors, and individual home builders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-6 relative">
          {[
            {
              step: '01',
              title: 'Project Inputs',
              desc: 'Enter Road, Building, Bridge, or House dimensions, floors, pavement or structural system.',
              icon: Building2,
              color: 'text-amber-500 bg-amber-50 border-amber-200'
            },
            {
              step: '02',
              title: 'Engine Calculation',
              desc: 'Empirical formulas derive required cement, steel, sand, aggregate, bitumen, and masonry with wastage factors.',
              icon: Calculator,
              color: 'text-blue-500 bg-blue-50 border-blue-200'
            },
            {
              step: '03',
              title: 'Exactly 3 Products',
              desc: 'Every material displays exactly 3 curated options: Highly, Averagely, and Low-Level Recommended.',
              icon: Scale,
              color: 'text-emerald-500 bg-emerald-50 border-emerald-200'
            },
            {
              step: '04',
              title: 'Missing Alert & Cart',
              desc: 'Choose exactly one product per material. If any material is skipped, a clear advisory gives you full control.',
              icon: Sliders,
              color: 'text-purple-500 bg-purple-50 border-purple-200'
            },
            {
              step: '05',
              title: 'Final Quotation',
              desc: 'Generates estimated construction quotation with material breakdown, logistics, taxes, and instant PDF print.',
              icon: FileCheck,
              color: 'text-orange-500 bg-orange-50 border-orange-200'
            }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black text-slate-300 font-display">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base font-display">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <div className="h-1 w-8 bg-amber-500/40 rounded-full" />
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: CONSTRUCTION PROJECT CATEGORIES */}
      <section className="bg-slate-100 text-slate-900 py-16 lg:py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Engineered Modules
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display mt-1">
                Construction Project Categories
              </h2>
            </div>
            <p className="text-slate-600 text-sm max-w-md">
              Specialized civil estimation algorithms tailored to the physical characteristics of roads, multi-storey buildings, and residential housing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: 'building',
                name: 'Buildings & High-Rise',
                subtitle: 'Residential, Commercial, Institutional',
                specs: ['Built-up Area & Floor Count', 'RCC vs Load-Bearing Framing', 'IS 456 & IS 1786 Detailing'],
                materials: 'Cement, TMT Steel, Sand, Coarse Aggregate, AAC Blocks, Water',
                icon: Building2
              },
              {
                id: 'road',
                name: 'Roads & Highways',
                subtitle: 'Flexible, Rigid & Rural Pavements',
                specs: ['Length (km), Width (m), Thickness', 'Bituminous vs Concrete (PQC)', 'MoRTH & IRC:37 / IRC:58 Specs'],
                materials: 'Bitumen VG-30, WMM Base, GSB, Cement, Pavement Steel',
                icon: TrendingUp
              },
              {
                id: 'house',
                name: 'House Owners',
                subtitle: 'Villas, Duplexes & Independent Homes',
                specs: ['Plot Area & Built-Up Per Floor', 'Bedrooms & Bathrooms Layout', 'Simple Non-Technical Form'],
                materials: 'Foundation, Slab Cement, Rebars, Plaster Sand, Bricks',
                icon: HardHat,
                badge: 'Dedicated Mode'
              },
              {
                id: 'bridge',
                name: 'Bridges & Culverts',
                subtitle: 'Highway Flyovers & Drainage Crossings',
                specs: ['Span Length & Deck Width', 'Pier Height & Bearing Type', 'IRC Class 70R Loading'],
                materials: 'M45 High-Strength Cement, Fe 550D Steel, Bearing Pads',
                icon: Layers
              }
            ].map((cat) => (
              <div
                key={cat.id}
                className="rounded-2xl bg-white border border-slate-200 p-6 flex flex-col justify-between space-y-6 hover:shadow-lg transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                      <cat.icon className="w-6 h-6" />
                    </div>
                    {cat.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                        {cat.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-display">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {cat.subtitle}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Key Parameters:</div>
                    {cat.specs.map((s, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                        <Check className="w-3 h-3 text-amber-600" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                    <span className="text-amber-800 font-semibold">Estimates:</span> {cat.materials}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (cat.id === 'house') {
                      onNavigate('house-owners');
                    } else {
                      onNavigate('create-project');
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-800 border border-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Start {cat.name}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: MATERIAL ESTIMATION BENEFITS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              Mathematical Transparency
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display leading-tight">
              Civil Engineering Precision, <br />
              <span className="text-amber-700">Zero Guesswork.</span>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              STANDARD X replaces erratic contractor rough guesses with structured civil engineering 
              algorithms verified against IS 456, IS 1786, and MoRTH design manuals. Every estimate 
              reveals its exact formula and enables immediate engineer adjustments.
            </p>

            <div className="space-y-4 pt-2">
              {[
                {
                  title: 'IS 456 Mix Design Basis',
                  desc: 'Cement, aggregates, and sand are proportional to structural volume and structural framing rather than arbitrary floor multipliers.'
                },
                {
                  title: 'Transparent Wastage Factors',
                  desc: 'Configurable 3-7% site handling, cutting, and lap waste factors clearly isolated from base structural quantities.'
                },
                {
                  title: 'Fully Editable Quantities',
                  desc: 'Site engineers can directly override any calculated quantity if custom structural drawings mandate specific reinforcement bars.'
                }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5 border border-amber-200">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm font-display">{item.title}</h4>
                    <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-amber-600" />
                  <span className="font-bold text-sm font-display text-slate-900">Transparent Calculation Sample</span>
                </div>
                <span className="text-xs text-slate-500 font-mono">IS 456 Cl. 6.2</span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-slate-500 font-semibold uppercase text-[10px]">Sample: Structural Cement Bags</div>
                  <div className="font-mono text-sm text-amber-800 font-bold">
                    Q = BuiltUpArea (sq.ft) × 0.42 bags/sq.ft × FloorFactor (1.05) × (1 + Wastage 5%)
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    Result for 2,400 sq.ft building = <strong>1,058 Bags</strong> (Grade 53 OPC)
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-slate-500 font-semibold uppercase text-[10px]">Sample: TMT Rebar Weight</div>
                  <div className="font-mono text-sm text-blue-800 font-bold">
                    Q = BuiltUpArea (sq.ft) × 4.0 kg/sq.ft × (1 + Lap & Cut Waste 3%)
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    Result for 2,400 sq.ft building = <strong>9,888 kg</strong> (Fe 550D Rebars)
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0 text-amber-600" />
                <span>All parameters stay completely adjustable in the Project Creation Wizard.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: BIS QUALITY RECOMMENDATION EXPLANATION */}
      <section className="bg-slate-50 text-slate-900 py-16 lg:py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
              The Core Quality Feature
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
              Explainable 3-Tier BIS Recommendations
            </h2>
            <p className="text-slate-600 text-sm">
              We never show arbitrary vendor lists. For every required construction material, 
              STANDARD X presents <strong>exactly three curated products</strong> based on verified standards, 
              strength tests, and real suitability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Rank 1 */}
            <div className="rounded-2xl bg-white border-2 border-emerald-500/80 p-6 space-y-4 relative shadow-md">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <Award className="w-4 h-4 text-emerald-600" /> Highly Recommended
                </span>
                <span className="text-xs text-slate-500 font-mono">Rank 1</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Peak Structural Performance
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The product is the strongest match for the project based on configured quality, seismic ductility, high early compressive strength, and lowest variance in batch testing.
              </p>
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <div className="font-semibold">Best suited for:</div>
                <div className="text-slate-600">Critical multi-storey columns, cantilever roof spans, seismic zones, and heavy highway pavements.</div>
              </div>
            </div>

            {/* Rank 2 */}
            <div className="rounded-2xl bg-white border-2 border-blue-500/80 p-6 space-y-4 relative shadow-md">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  <Zap className="w-4 h-4 text-blue-600" /> Averagely Recommended
                </span>
                <span className="text-xs text-slate-500 font-mono">Rank 2</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Balanced Value & Dependability
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Provides a balanced option delivering reliable BIS-standard compliance, proven regional quality compliance, and optimized cost-to-performance ratio.
              </p>
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-1">
                <div className="font-semibold">Best suited for:</div>
                <div className="text-slate-600">Standard residential houses, duplex villas, commercial perimeter works, and standard road bases.</div>
              </div>
            </div>

            {/* Rank 3 */}
            <div className="rounded-2xl bg-white border-2 border-amber-500/80 p-6 space-y-4 relative shadow-md">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  <ShieldCheck className="w-4 h-4 text-amber-600" /> Low-Level Recommended
                </span>
                <span className="text-xs text-slate-500 font-mono">Rank 3</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Baseline Verified Economy
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Meets mandatory BIS baseline criteria (e.g. 53 MPa or IS 1786) but ranks lower on specialized additives or ductility. Not unsafe, but economical.
              </p>
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="font-semibold">Best suited for:</div>
                <div className="text-slate-600">Boundary walls, non-load-bearing partitions, single-storey annexes, and budget-constrained projects.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: MATERIAL COMPARISON PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Interactive Demonstration
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 font-display mt-1">
                Material Comparison Preview
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Click across materials to preview the exact 3-tier recommendation matrix in action.
              </p>
            </div>

            {/* Material selector tabs */}
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-100 border border-slate-200">
              {[
                { id: 'cement', label: 'Cement (IS 269)' },
                { id: 'steel', label: 'Steel (IS 1786)' },
                { id: 'bricks', label: 'Bricks (IS 1077/2185)' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActivePreviewTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activePreviewTab === tab.id
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {previewProducts.map((prod) => (
              <div
                key={prod.id}
                className="rounded-2xl bg-white border border-slate-200 p-6 flex flex-col justify-between space-y-4 hover:shadow-lg transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                      prod.recommendationRank === 'highly_recommended'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : prod.recommendationRank === 'averagely_recommended'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {prod.rankTitle}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      {prod.bisStandardCode}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base font-display">
                      {sanitizeProductName(prod.name, prod.materialCategory)}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Quality Spec: {sanitizeQualitySpec(prod.brand, prod)}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="text-xs text-slate-500">Indicative Rate:</div>
                    <div className="text-xl font-extrabold text-slate-900 font-display">
                      ₹{prod.unitPrice.toLocaleString()}{' '}
                      <span className="text-xs font-normal text-slate-500">/ {prod.unit}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="font-semibold text-slate-800">Quality Features:</div>
                    <div className="text-[11px] leading-relaxed">
                      <strong>Strength:</strong> {prod.qualityFeatures.strength}
                    </div>
                    <div className="text-[11px] leading-relaxed">
                      <strong>Suitability:</strong> {prod.qualityFeatures.constructionSuitability}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 leading-relaxed italic">
                    "{prod.rankExplanation}"
                  </p>
                </div>

                <button
                  onClick={() => onNavigate('create-project')}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-800 border border-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span>Select in New Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: HOUSE OWNER SECTION SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50/20 to-white text-slate-900 p-8 sm:p-12 lg:p-16 border border-amber-200 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300 shadow-2xs">
                <HardHat className="w-4 h-4 text-amber-700" />
                <span>Dedicated Portal for Individual House Builders</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-display leading-tight">
                Building Your Dream Home? <br />
                <span className="text-amber-700">Get an Accurate Estimate in 2 Minutes.</span>
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
                No complex engineering jargon required. Answer 10 simple questions about your plot, 
                number of floors, and preferred rooms. STANDARD X calculates your exact cement bags, 
                steel tonnage, and bricks — then suggests the safest BIS-certified quality grades with total cost.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  id="home-btn-house-flow"
                  onClick={() => onNavigate('house-owners')}
                  className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Launch House Owners Estimator</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('bis-standards')}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-300 cursor-pointer shadow-2xs"
                >
                  <span>Browse House Construction Standards</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-4">
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Typical 2-Floor Villa Estimate
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Built-Up Area:</span>
                  <span className="font-bold text-slate-900">2,400 sq.ft (3 BHK)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Cement Required:</span>
                  <span className="font-semibold text-amber-800">~1,000 Bags</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Steel Rebars:</span>
                  <span className="font-semibold text-blue-800">~9.6 Tonnes</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Bricks / AAC:</span>
                  <span className="font-semibold text-slate-900">~45,000 Pcs</span>
                </div>
                <div className="flex justify-between py-2 pt-3 text-sm font-bold text-slate-900">
                  <span>Estimated Total:</span>
                  <span className="text-amber-800 font-extrabold text-base">₹38,50,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: CALL-TO-ACTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 py-12">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
            Ready to Plan Your Next Construction Project?
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Ensure total structural integrity, comply with Bureau of Indian Standards, 
            and keep every contractor quote transparent.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('create-project')}
              className="px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-base shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              Start Free Project Estimate
            </button>
            <button
              onClick={() => onNavigate('my-projects')}
              className="px-8 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-base transition-colors cursor-pointer shadow-xs"
            >
              View Existing Projects
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

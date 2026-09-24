import React, { useState } from 'react';
import { 
  HardHat, 
  Home as HomeIcon, 
  Layers, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Award, 
  Zap, 
  ShieldCheck, 
  HelpCircle, 
  ShoppingCart, 
  FileText,
  DollarSign,
  HeartHandshake,
  Sparkles,
  Info,
  Scale
} from 'lucide-react';
import { estimateHouseMaterials } from '../services/estimationEngine';
import { getRecommendedProductsForMaterial } from '../data/productsDatabase';
import { MaterialRequirement, ProjectRecord } from '../types';
import { sanitizeProductName, sanitizeQualitySpec, sanitizeProduct } from '../utils/qualitySanitizer';
import { MissingMaterialsModal } from '../components/MissingMaterialsModal';
import { ProductCompareModal } from '../components/ProductCompareModal';
import { BisDetailModal } from '../components/BisDetailModal';
import { BIS_STANDARDS_LIBRARY } from '../data/bisStandards';

interface HouseOwnersViewProps {
  onSaveProject: (project: ProjectRecord) => void;
  onAddToCart: (items: any[]) => void;
  onNavigate: (view: string) => void;
}

export const HouseOwnersView: React.FC<HouseOwnersViewProps> = ({
  onSaveProject,
  onAddToCart,
  onNavigate
}) => {
  // Wizard steps: 1: Simple Questions, 2: Estimated Needs, 3: 3-Choice Recommendations, 4: Summary & Dispatch
  const [step, setStep] = useState<number>(1);

  // Simplified friendly inputs
  const [houseTitle, setHouseTitle] = useState('My Dream 3-BHK Family Villa');
  const [cityLocation, setCityLocation] = useState('Pune, Maharashtra');
  const [plotAreaSqFt, setPlotAreaSqFt] = useState<number>(1500);
  const [builtUpAreaSqFt, setBuiltUpAreaSqFt] = useState<number>(2200);
  const [floors, setFloors] = useState<number>(2);
  const [qualityGrade, setQualityGrade] = useState<'Economy' | 'Standard' | 'Premium'>('Standard');
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(3);
  const [parkingRequired, setParkingRequired] = useState<'Covered Car Porch' | 'Two-Wheeler Only' | 'Open Yard'>('Covered Car Porch');
  const [soilType, setSoilType] = useState<string>('Normal Hard Murrum Soil');
  const [houseStyle, setHouseStyle] = useState<'Modern Contemporary' | 'Traditional Indian' | 'Simple Economical'>('Modern Contemporary');

  // Calculated materials
  const [houseMaterials, setHouseMaterials] = useState<MaterialRequirement[]>([]);
  // Selected products: category -> productId
  const [selectedProducts, setSelectedProducts] = useState<Record<string, string>>({});

  // Modals state
  const [isMissingModalOpen, setIsMissingModalOpen] = useState(false);
  const [missingList, setMissingList] = useState<string[]>([]);
  const [compareData, setCompareData] = useState<{
    isOpen: boolean;
    materialName: string;
    quantity: number;
    unit: string;
    category: string;
  }>({
    isOpen: false,
    materialName: '',
    quantity: 0,
    unit: '',
    category: ''
  });
  const [bisModalData, setBisModalData] = useState<{
    isOpen: boolean;
    standard: any | null;
  }>({
    isOpen: false,
    standard: null
  });

  const runHouseEstimation = () => {
    const mats = estimateHouseMaterials({
      houseName: houseTitle,
      location: cityLocation,
      numFloors: floors,
      plotAreaSqFt,
      builtUpAreaPerFloorSqFt: Math.round(builtUpAreaSqFt / Math.max(floors, 1)),
      bedrooms,
      bathrooms,
      houseType: 'Independent House',
      roofType: 'RCC Flat Slab',
      qualityTier: qualityGrade,
      approximateBudget: 3500000,
      additionalRequirements: `${houseStyle}, Soil: ${soilType}, Parking: ${parkingRequired}`
    });

    setHouseMaterials(mats);
    setStep(2);
  };

  const handleSelectProduct = (category: string, productId: string) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [category]: productId
    }));
  };

  const handleProceedToSummary = () => {
    const requiredCategories = houseMaterials.map((m) => m.category);
    const missing = requiredCategories.filter((cat) => !selectedProducts[cat]);

    if (missing.length > 0) {
      const missingNames = missing.map((cat) => {
        const found = houseMaterials.find((m) => m.category === cat);
        return found ? found.name : cat;
      });
      setMissingList(missingNames);
      setIsMissingModalOpen(true);
    } else {
      setStep(4);
    }
  };

  const handleCompleteHouseProject = () => {
    const newProject: ProjectRecord = {
      id: `house-proj-${Date.now()}`,
      name: houseTitle || 'Family Residential Home',
      category: 'building',
      location: cityLocation,
      stateCity: cityLocation,
      description: `${houseStyle} residential home, ${builtUpAreaSqFt} sq.ft, ${floors} floors, ${bedrooms} BHK. Quality grade: ${qualityGrade}.`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Materials Selected',
      requiredMaterials: houseMaterials,
      selectedProducts,
      customQuantities: houseMaterials.reduce((acc, curr) => {
        acc[curr.category] = curr.editableQuantity;
        return acc;
      }, {} as Record<string, number>),
      logisticsConfig: {
        includeTransportation: true,
        transportationCostPct: 4.0,
        includeLabor: true,
        laborCostPct: 20.0,
        includeTax: true,
        taxGstPct: 18.0,
        includeContingency: true,
        contingencyPct: 5.0
      }
    };

    onSaveProject(newProject);

    // Build Cart Items
    const cartItems = Object.entries(selectedProducts).map(([cat, prodId]) => {
      const prods = getRecommendedProductsForMaterial(cat);
      const prod = prods.find((p) => p.id === prodId) || prods[0];
      const matReq = houseMaterials.find((m) => m.category === cat);
      const qty = matReq ? matReq.editableQuantity : 100;
      const totalCost = qty * prod.unitPrice;

      return {
        id: `cart-house-${Date.now()}-${cat}`,
        projectId: newProject.id,
        projectName: newProject.name,
        materialCategory: cat,
        materialName: matReq ? matReq.name : cat,
        product: prod,
        quantity: qty,
        unit: prod.unit,
        unitPrice: prod.unitPrice,
        totalCost,
        wastageFactorPct: matReq ? matReq.wastageFactorPct : 5
      };
    });

    onAddToCart(cartItems);
    onNavigate('cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Friendly Banner */}
      <div className="bg-gradient-to-r from-amber-50/80 via-white to-orange-50/60 rounded-2xl p-6 sm:p-8 border border-amber-200/80 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-xs font-bold border border-amber-500/20">
              <HardHat className="w-4 h-4 text-amber-600" />
              <span>For Individual House Builders & Families</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              House Owners Estimation & BIS Guide
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Plan your home construction budget without contractor markup confusion. 
              We calculate your exact cement bags, steel bars, and bricks — then suggest the 
              safest government-certified (BIS) quality specifications.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-amber-200/80 shrink-0 text-center sm:text-right shadow-2xs">
            <div className="text-[11px] text-slate-500">Step {step} of 4:</div>
            <div className="text-sm font-bold text-amber-800">
              {step === 1 ? 'Home Details' : step === 2 ? 'Required Materials' : step === 3 ? 'Choose Quality Grades' : 'Quotation Summary'}
            </div>
          </div>
        </div>
      </div>

      {/* STEP 1: SIMPLE QUESTIONS FOR HOUSE OWNERS */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-extrabold text-slate-900 font-display">
              Tell us about your home
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Answer these basic questions. No civil engineering expertise required!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Home Name / Project Title *
              </label>
              <input
                type="text"
                value={houseTitle}
                onChange={(e) => setHouseTitle(e.target.value)}
                placeholder="e.g. My 3-BHK Dream Home"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/40 bg-slate-50 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                City / Location *
              </label>
              <input
                type="text"
                value={cityLocation}
                onChange={(e) => setCityLocation(e.target.value)}
                placeholder="e.g. Pune, Maharashtra"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/40 bg-slate-50 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Total Plot Area (sq.ft) *
              </label>
              <input
                type="number"
                step="50"
                min="500"
                value={plotAreaSqFt}
                onChange={(e) => setPlotAreaSqFt(parseInt(e.target.value) || 1000)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/40 bg-slate-50 focus:bg-white"
              />
              <span className="text-[11px] text-slate-500">e.g. 30 × 50 ft = 1,500 sq.ft</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Total Built-Up Area (sq.ft) *
              </label>
              <input
                type="number"
                step="100"
                min="500"
                value={builtUpAreaSqFt}
                onChange={(e) => setBuiltUpAreaSqFt(parseInt(e.target.value) || 1200)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/40 bg-slate-50 focus:bg-white"
              />
              <span className="text-[11px] text-slate-500">Combined area of all floors</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Number of Floors *
              </label>
              <select
                value={floors}
                onChange={(e) => setFloors(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/40 bg-slate-50 font-medium"
              >
                <option value={1}>Single Floor (Ground Floor)</option>
                <option value={2}>Ground + 1 Floor (Duplex / 2-Storey)</option>
                <option value={3}>Ground + 2 Floors (Triplex / 3-Storey)</option>
                <option value={4}>Ground + 3 Floors</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Desired Construction Quality *
              </label>
              <select
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/40 bg-slate-50 font-bold text-amber-700"
              >
                <option value="Economy">Economy (Budget-friendly baseline materials)</option>
                <option value="Standard">Standard (High quality engineering grade - Recommended)</option>
                <option value="Premium">Premium (Top tier architectural finishes & highest grade steel)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Bedrooms (BHK)
              </label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(parseInt(e.target.value) || 2)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-slate-50"
              >
                <option value={1}>1 BHK</option>
                <option value={2}>2 BHK</option>
                <option value={3}>3 BHK</option>
                <option value={4}>4 BHK</option>
                <option value={5}>5+ BHK</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Bathrooms
              </label>
              <select
                value={bathrooms}
                onChange={(e) => setBathrooms(parseInt(e.target.value) || 2)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-slate-50"
              >
                <option value={1}>1 Bathroom</option>
                <option value={2}>2 Bathrooms</option>
                <option value={3}>3 Bathrooms</option>
                <option value={4}>4 Bathrooms</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Parking Requirement
              </label>
              <select
                value={parkingRequired}
                onChange={(e) => setParkingRequired(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-slate-50"
              >
                <option value="Covered Car Porch">Covered Car Porch (RCC Roof)</option>
                <option value="Two-Wheeler Only">Two-Wheeler Shed Only</option>
                <option value="Open Yard">Open Yard Parking</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Plot Soil Type
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-slate-50"
              >
                <option value="Normal Hard Murrum Soil">Normal Hard Murrum Soil (Standard Foundation)</option>
                <option value="Black Cotton Soil">Black Cotton Soil (Requires Under-Reamed Piles)</option>
                <option value="Rocky Hard Strata">Rocky Hard Strata (Shallow Footings)</option>
                <option value="Sandy / Silt Soil">Sandy / Riverbank Silt</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Architectural Style
              </label>
              <select
                value={houseStyle}
                onChange={(e) => setHouseStyle(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-slate-50"
              >
                <option value="Modern Contemporary">Modern Contemporary (Clean Flat Slabs & Glass)</option>
                <option value="Traditional Indian">Traditional Indian (Sloped Tiles & Verandah)</option>
                <option value="Simple Economical">Simple Economical (Straightforward Sturdy Layout)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              id="btn-house-estimate"
              type="button"
              onClick={runHouseEstimation}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition-all shadow-md cursor-pointer"
            >
              <span>Calculate Materials Needed for My Home</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: ESTIMATED MATERIALS DISPLAY */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Step 2 — Home Materials Breakdown
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 font-display">
                Estimated Materials for {builtUpAreaSqFt.toLocaleString()} sq.ft Home
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              Grade: {qualityGrade}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {houseMaterials.map((mat) => (
              <div
                key={mat.materialId}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {mat.category}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                      +{mat.wastageFactorPct}% waste
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base font-display mt-1">
                    {mat.name}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {mat.formulaExplanation}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between">
                  <span className="text-xs text-slate-500">Needed:</span>
                  <span className="text-lg font-black text-slate-900 font-display">
                    {mat.editableQuantity.toLocaleString()} {mat.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Friendly Tip for House Builders:</span>
            </div>
            <p>
              Always store cement in a moisture-free raised platform. Buy TMT steel with visible ISI & 550D stampings on the ribs to ensure earthquake protection for your family.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              id="btn-house-to-recommendations"
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition-all shadow-md cursor-pointer"
            >
              <span>Next: Select Verified Quality Grades (3 Choices)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: 3-TIER PRODUCTS TAILORED FOR HOME OWNERS */}
      {step === 3 && (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-amber-50/80 via-white to-orange-50/60 rounded-2xl p-6 border border-amber-200/80 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Step 3 — Certified BIS Quality Grade Recommendations
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 font-display mt-0.5">
              Select One Quality Grade for Each Material
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              For structural safety, every choice below is classified by verified engineering quality grade (e.g. 550 D, 500 D) adhering to Bureau of Indian Standards (BIS) specifications without brand bias.
            </p>
          </div>

          <div className="space-y-8">
            {houseMaterials.map((mat) => {
              const recs = getRecommendedProductsForMaterial(mat.category);
              const selId = selectedProducts[mat.category];

              return (
                <div key={mat.materialId} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                        Material: {mat.name}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 font-display">
                        Need: {mat.editableQuantity.toLocaleString()} {mat.unit}
                      </h3>
                    </div>
                  </div>

                  {/* Exactly 3 cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {recs.map((prod) => {
                      const isSelected = selId === prod.id;
                      const batchCost = mat.editableQuantity * prod.unitPrice;

                      return (
                        <div
                          key={prod.id}
                          className={`rounded-xl border p-5 flex flex-col justify-between space-y-4 transition-all ${
                            isSelected
                              ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
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

                              {isSelected && (
                                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                                  Selected
                                </span>
                              )}
                            </div>

                            <div>
                              <h4 className="font-bold text-slate-900 text-sm font-display">
                                {sanitizeProductName(prod.name, prod.materialCategory)}
                              </h4>
                              <p className="text-xs text-slate-500 font-medium">Quality Spec: {sanitizeQualitySpec(prod.brand, prod)}</p>
                            </div>

                            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                              <div className="text-xs text-slate-500">Rate: ₹{prod.unitPrice.toLocaleString()} / {prod.unit}</div>
                              <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                                Total: ₹{Math.round(batchCost).toLocaleString()}
                              </div>
                            </div>

                            <div className="text-xs text-slate-600 space-y-1">
                              <div><strong className="text-slate-700">BIS Mark:</strong> {prod.bisStandardCode}</div>
                              <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 italic">
                                {prod.rankExplanation}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSelectProduct(mat.category, prod.id)}
                            className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500 text-slate-950 shadow-2xs'
                                : 'bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-800 border border-slate-200'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{isSelected ? 'Selected Quality Grade' : 'Select This Quality Grade'}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex justify-between items-center shadow-sm">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs cursor-pointer"
            >
              Back
            </button>

            <button
              id="btn-house-proceed-summary"
              type="button"
              onClick={handleProceedToSummary}
              className="px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition-all shadow-md cursor-pointer"
            >
              <span>View Final Home Budget & Cart</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: HOME OWNER REVIEW & DISPATCH */}
      {step === 4 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Step 4 — Final House Quotation Dispatch
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 font-display mt-0.5">
              Ready to Dispatch to Material Cart
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Your materials have been configured according to the {builtUpAreaSqFt} sq.ft {qualityGrade} home blueprint.
            </p>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {houseMaterials.map((mat) => {
              const selId = selectedProducts[mat.category];
              const prods = getRecommendedProductsForMaterial(mat.category);
              const prod = prods.find((p) => p.id === selId);

              if (!prod) {
                return (
                  <div key={mat.materialId} className="p-3 bg-slate-50 text-xs flex justify-between text-slate-400">
                    <span>{mat.name} (Skipped)</span>
                    <span>₹0</span>
                  </div>
                );
              }

              const subtotal = mat.editableQuantity * prod.unitPrice;

              return (
                <div key={mat.materialId} className="p-3.5 bg-white text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900">{sanitizeProductName(prod.name, prod.materialCategory)}</span>
                    <span className="ml-2 text-slate-500 text-[11px]">({sanitizeQualitySpec(prod.brand, prod)} • {prod.bisStandardCode})</span>
                    <div className="text-[11px] text-slate-400">{mat.editableQuantity.toLocaleString()} {prod.unit} @ ₹{prod.unitPrice}</div>
                  </div>
                  <div className="font-bold text-slate-900 text-sm">
                    ₹{Math.round(subtotal).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs cursor-pointer"
            >
              Back
            </button>

            <button
              id="btn-house-add-to-cart"
              type="button"
              onClick={handleCompleteHouseProject}
              className="px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition-all shadow-lg hover:shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart & Generate Home Quotation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Missing Materials Alert Modal */}
      <MissingMaterialsModal
        isOpen={isMissingModalOpen}
        missingMaterials={missingList}
        onSelectMissing={() => setIsMissingModalOpen(false)}
        onContinueAnyway={() => {
          setIsMissingModalOpen(false);
          setStep(4);
        }}
        onClose={() => setIsMissingModalOpen(false)}
      />
    </div>
  );
};

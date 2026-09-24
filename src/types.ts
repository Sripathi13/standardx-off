export type ProjectCategory = 'building' | 'road' | 'bridge' | 'other';

export type BuildingType = 
  | 'Residential Building'
  | 'Commercial Building'
  | 'Apartment'
  | 'School'
  | 'Hospital'
  | 'Office'
  | 'Other';

export type StructuralSystem = 
  | 'RCC Framed Structure'
  | 'Load-Bearing Structure'
  | 'Steel Structure'
  | 'Precast Concrete System'
  | 'Other';

export type RoadType = 
  | 'Rural Road'
  | 'Urban Road'
  | 'Highway'
  | 'Residential Road'
  | 'Industrial Corridor'
  | 'Other';

export type PavementType = 
  | 'Flexible Pavement'
  | 'Rigid Pavement'
  | 'Bituminous Road'
  | 'Concrete Road';

export type HouseType = 
  | 'Small House'
  | 'Independent House'
  | 'Villa'
  | 'Duplex'
  | 'Residential Building';

export type HouseQualityTier = 'Economy' | 'Standard' | 'Premium';

export type RecommendationRank = 
  | 'highly_recommended'
  | 'averagely_recommended'
  | 'low_level_recommended';

export interface BisStandardInfo {
  code: string; // e.g. "IS 269:2015"
  title: string; // e.g. "Ordinary Portland Cement - Specification"
  category: string;
  scope: string;
  keyRequirements: string[];
  mandatoryTests: string[];
  fieldTestingTips: string[];
  referenceDocument: string;
  verificationSource: string;
}

export interface QualityFeatures {
  strength: string; // e.g. "53 MPa @ 28 days"
  durability: string; // e.g. "High sulphate and micro-crack resistance"
  settingProperties?: string; // e.g. "Initial > 30 min, Final < 600 min"
  elongationOrDuctility?: string; // e.g. "16% uniform elongation (Earthquake Zone IV/V ready)"
  waterAbsorption?: string; // e.g. "< 15% by dry weight"
  constructionSuitability: string; // e.g. "Heavy structural slabs, beams, columns, bridge decks"
  safetyNotes: string;
}

export interface RecommendedProduct {
  id: string;
  name: string;
  brand: string;
  materialCategory: string; // 'cement' | 'steel' | 'sand' | 'aggregate' | 'bricks' | 'bitumen' | 'water' | 'blocks' | 'gsb' | 'wmm'
  recommendationRank: RecommendationRank;
  rankTitle: string; // 'Highly Recommended' | 'Averagely Recommended' | 'Low-Level Recommended'
  rankExplanation: string; // Why this product received this rank
  bisStandardCode: string;
  bisStandardTitle: string;
  bisVerificationStatus: 'Verified' | 'Bureau Benchmark' | 'Compliance Audited' | 'Pending Verification';
  certificationReference: string; // e.g., "BIS CM/L-7832910"
  qualityFeatures: QualityFeatures;
  unitPrice: number; // in INR (₹)
  unit: string; // 'bag', 'kg', 'ton', 'm³', 'sq.ft', 'piece', 'liter'
  packageDetails: string; // e.g. "50 kg HDPE moisture-proof bag"
  availability: 'Immediate Dispatch' | 'Regional Warehouse' | 'Direct Factory Batch';
  environmentalRating: 'High Eco-Score' | 'Standard' | 'Green Pro Certified';
  userRating: number; // 4.2 - 4.9
}

export interface MaterialRequirement {
  materialId: string;
  name: string;
  category: string;
  estimatedQuantity: number;
  unit: string;
  calculationBasis: string;
  formulaExplanation: string;
  wastageFactorPct: number;
  editableQuantity: number;
  isOverridden?: boolean;
  selectedProductId?: string;
  estimatedUnitPrice: number;
}

export interface RoadProjectDetails {
  roadName: string;
  lengthKm: number;
  widthM: number;
  thicknessMm: number;
  roadType: RoadType;
  pavementType: PavementType;
  lanes: number;
  subgradeCbrPct: number; // California Bearing Ratio %
  trafficMsa: number; // Million Standard Axles
  soilSubgradeInfo: string;
  additionalDetails?: string;
}

export interface BuildingProjectDetails {
  buildingName: string;
  location: string;
  stateCity: string;
  totalBuiltUpAreaSqFt: number;
  areaPerFloorSqFt: number;
  numFloors: number;
  floorHeightM: number;
  buildingType: BuildingType;
  structuralSystem: StructuralSystem;
  roofType: string;
  constructionStage: 'Foundation' | 'Plinth' | 'Superstructure' | 'Finishing' | 'Full Project';
  soilBearingCapacityKPa?: number;
  additionalDetails?: string;
}

export interface BridgeProjectDetails {
  bridgeName: string;
  location: string;
  spanLengthM: number;
  deckWidthM: number;
  pierHeightM: number;
  bridgeType: 'RCC Girder Bridge' | 'Prestressed Concrete' | 'Steel Truss' | 'Box Culvert';
  designLoad: 'IRC Class 70R' | 'IRC Class A';
  additionalDetails?: string;
}

export interface HouseOwnerDetails {
  houseName: string;
  location: string;
  numFloors: number;
  plotAreaSqFt: number;
  builtUpAreaPerFloorSqFt: number;
  bedrooms: number;
  bathrooms: number;
  houseType: HouseType;
  roofType: 'RCC Flat Slab' | 'Sloped Pitched Roof' | 'Terrace with Pergola';
  qualityTier: HouseQualityTier;
  approximateBudget: number;
  additionalRequirements?: string;
}

export interface ProjectRecord {
  id: string;
  name: string;
  category: ProjectCategory;
  location: string;
  stateCity: string;
  description: string;
  createdAt: string;
  status: 'In Progress' | 'Materials Selected' | 'Quotation Generated';
  roadDetails?: RoadProjectDetails;
  buildingDetails?: BuildingProjectDetails;
  bridgeDetails?: BridgeProjectDetails;
  houseDetails?: HouseOwnerDetails;
  requiredMaterials: MaterialRequirement[];
  selectedProducts: Record<string, string>; // materialCategory -> productId
  customQuantities: Record<string, number>; // materialCategory -> quantity
  logisticsConfig: LogisticsConfig;
}

export interface LogisticsConfig {
  includeTransportation: boolean;
  transportationCostPct: number; // e.g. 4%
  includeLabor: boolean;
  laborCostPct: number; // e.g. 18%
  includeTax: boolean;
  taxGstPct: number; // e.g. 18% for construction materials/work
  includeContingency: boolean;
  contingencyPct: number; // e.g. 5%
}

export interface CartItem {
  id: string;
  projectId: string;
  projectName: string;
  materialCategory: string;
  materialName: string;
  product: RecommendedProduct;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalCost: number;
  wastageFactorPct: number;
}

export interface QuotationRecord {
  id: string;
  quotationNumber: string;
  projectId: string;
  projectName: string;
  category: ProjectCategory;
  projectCategory?: ProjectCategory;
  location: string;
  date: string;
  dimensionsSummary?: string;
  structuralSummary?: string;
  items: CartItem[];
  financials: {
    rawMaterialsTotal: number;
    transportationCost: number;
    laborCost: number;
    contingencyCost: number;
    taxGst: number;
    grandTotal: number;
  };
  hasIncompleteWarning?: boolean;
  missingMaterials: string[];
  subtotal?: number;
  transportationCost?: number;
  laborCost?: number;
  taxAmount?: number;
  contingencyAmount?: number;
  finalTotal?: number;
  isHouseProject?: boolean;
  disclaimer?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: 'General Contractor' | 'Civil Engineer' | 'Project Manager' | 'Individual House Builder';
  organization: string;
  phoneNumber: string;
  city: string;
  state: string;
  projectsCount: number;
}

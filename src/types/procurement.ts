export interface ProcurementOfficerProfile {
  id: string;
  name: string;
  designation: string; // e.g. "Senior Executive Engineer & Tender Officer"
  department: string; // e.g. "Central Public Works Department (CPWD)"
  cadre: 'Central Govt' | 'State PWD' | 'PSU / Railway' | 'Defense / MES' | 'Urban Local Body';
  badgeNumber: string; // e.g. "CPWD-DEL-TEN-449"
  clearanceLevel: 'Class I Official' | 'Senior Procurement Specialist' | 'Chief Materials Manager';
  verifiedAt: string;
  organizationEmail: string;
}

export interface StandardReferenceItem {
  code: string;
  title: string;
  category?: string;
  clauseReference?: string;
  note?: string;
}

export interface MandatoryCertificationInfo {
  scheme: 'BIS Product Certification (ISI Mark)' | 'Compulsory Registration Scheme (CRS)' | 'Hallmarking' | 'BEE Star Rating' | 'PESO Approval' | 'Other Statutory';
  isCompulsory: boolean;
  qcoOrderReference: string; // e.g. "Cement (Quality Control) Order, 2023"
  description: string;
  issuingAuthority: string; // e.g. "Bureau of Indian Standards (Ministry of Consumer Affairs)"
}

export interface PrimaryStandardRecord {
  code: string; // e.g. "IS 269:2023"
  title: string; // e.g. "Ordinary Portland Cement — Specification"
  edition: string; // e.g. "Sixth Revision"
  latestAmendment: string; // e.g. "A1:2023"
  yearOfPublication: number;
  scope: string;
  relevanceScore: number; // 0 - 100
  matchExplanation: string; // Contextual explanation
  isMandatoryQco: boolean;
  applicableGrades?: string[]; // e.g. ["33 Grade", "43 Grade", "53 Grade"]
  keyPhysicalRequirements?: string[];
  keyChemicalRequirements?: string[];
}

export interface StandardRecommendationResult {
  query: string;
  detectedDomain: string; // "Civil Construction" | "Piping & Fluid Transmission" | "Electrical & Power" | "Mechanical / Steel" | "Renewable Energy" | "Food Contact / Commercial" | "Roads & Highways";
  detectedLanguage: string; // "English" | "Hindi" | "Multilingual / Mixed";
  semanticAnalysis: string; // 2-3 paragraph deep technical reasoning
  primaryStandards: PrimaryStandardRecord[];
  normativeReferences: StandardReferenceItem[];
  alliedStandards: StandardReferenceItem[];
  testMethodStandards: StandardReferenceItem[];
  safetyAndInstallationStandards: StandardReferenceItem[];
  mandatoryCertifications: MandatoryCertificationInfo[];
  tenderDraftClause: string; // Legally compliant tender specification text
  timestamp: string;
  source: 'gemini-3.8-flash' | 'local-semantic-engine';
}

export interface SavedTenderSpecDraft {
  id: string;
  title: string;
  createdAt: string;
  officerName: string;
  department: string;
  query: string;
  recommendation: StandardRecommendationResult;
  notes?: string;
  status: 'Draft' | 'Approved for GeM Tender' | 'CPWD Schedule Attached' | 'Under Technical Audit';
}

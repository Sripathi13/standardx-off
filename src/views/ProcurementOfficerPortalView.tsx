import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  Building2,
  Search,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Copy,
  Download,
  ExternalLink,
  Layers,
  Cpu,
  BookOpen,
  Scale,
  BadgeCheck,
  ArrowRight,
  RefreshCw,
  Globe2,
  Lock,
  UserCheck,
  Award,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  HelpCircle,
  Clock,
  Send,
  Zap,
  Tag,
  UploadCloud,
  FileUp,
  FileCheck,
  X,
  Eye,
  FileSpreadsheet,
  Check,
  Building,
  Info
} from 'lucide-react';
import {
  ProcurementOfficerProfile,
  StandardRecommendationResult,
  SavedTenderSpecDraft
} from '../types/procurement';
import {
  getStandardRecommendations,
  detectQueryLanguage
} from '../services/procurementStandardsEngine';
import {
  exportTenderAppendixPdf,
  exportTenderMaterialsSchedulePdf
} from '../utils/tenderPdfExporter';
import {
  extractTenderRequiredProducts,
  TenderRequiredProduct,
  ApplicableStandardDetail,
  getBisStandardVerificationUrl,
  getManakonlineSearchUrl
} from '../services/tenderMaterialRequirementsService';
import {
  parseTenderDocument,
  ExtractedTenderRequirement,
  SAMPLE_TENDERS
} from '../services/tenderExtractionService';
import { extractTextFromDocument } from '../utils/documentTextExtractor';

interface ProcurementOfficerPortalViewProps {
  onNavigate: (view: string) => void;
  onCreateProjectFromSpec?: (spec: StandardRecommendationResult) => void;
}

const DEFAULT_OFFICER: ProcurementOfficerProfile = {
  id: 'OFFICER-CPWD-409',
  name: 'Er. Rajesh K. Verma',
  designation: 'Superintending Engineer & Chief Procurement Officer',
  department: 'Central Public Works Department (CPWD) & GeM Technical Directorate',
  cadre: 'Central Govt',
  badgeNumber: 'CPWD-NDLS-QCO-2026-88',
  clearanceLevel: 'Class I Official',
  verifiedAt: '2026-09-23T08:30:00Z',
  organizationEmail: 'rajesh.verma@cpwd.gov.in'
};

const SAMPLE_QUERIES = [
  {
    title: 'Cement Procurement',
    text: 'Ordinary Portland Cement for residential construction',
    badge: 'Civil Works'
  },
  {
    title: 'High-Pressure Steel Pipes',
    text: 'Seamless carbon steel pipes for high-pressure applications',
    badge: 'Mechanical / Piping'
  },
  {
    title: 'Potable Water Distribution',
    text: 'Water supply pipes made of PVC and HDPE',
    badge: 'Plumbing / Jal Jeevan'
  },
  {
    title: 'Food-Grade Catering',
    text: 'Food-grade stainless steel containers for commercial kitchen',
    badge: 'Food Safety'
  },
  {
    title: 'Underground Power Feeders',
    text: 'XLPE insulated power cables for 1.1kV underground distribution',
    badge: 'Electrical / CPWD'
  },
  {
    title: 'Solar PV Systems',
    text: 'Solar photovoltaic modules and inverters for rooftop installation',
    badge: 'Renewable / MNRE'
  },
  {
    title: 'Seismic Rebar Reenforcement',
    text: 'High strength Fe 550D TMT rebar for earthquake zone IV construction',
    badge: 'Structural Steel'
  },
  {
    title: 'Hindi Query (हिंदी)',
    text: 'पेयजल आपूर्ति के लिए एचडीपीई पाइप और कंक्रीट निर्माण हेतु सीमेंट',
    badge: 'Multilingual'
  }
];

export const ProcurementOfficerPortalView: React.FC<ProcurementOfficerPortalViewProps> = ({
  onNavigate,
  onCreateProjectFromSpec
}) => {
  const [officer, setOfficer] = useState<ProcurementOfficerProfile>(DEFAULT_OFFICER);
  const [isOfficerLoggedIn, setIsOfficerLoggedIn] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'engine' | 'how-it-works' | 'drafts'>('engine');

  // Recommendation Engine State
  const [queryInput, setQueryInput] = useState<string>('Ordinary Portland Cement for residential construction');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Auto-detect');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recommendationResult, setRecommendationResult] = useState<StandardRecommendationResult | null>(null);
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  // Tender Document Upload State
  const [uploadedTenderDoc, setUploadedTenderDoc] = useState<{
    fileName: string;
    fileSize: string;
    extractedRequirement: ExtractedTenderRequirement;
    rawTextSnippet: string;
  } | null>(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [showExtractedModal, setShowExtractedModal] = useState<boolean>(false);
  const [inputTab, setInputTab] = useState<'upload' | 'text'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const headerFileInputRef = useRef<HTMLInputElement>(null);

  // Tender Required Materials Filter & State
  const [materialSearchQuery, setMaterialSearchQuery] = useState<string>('');
  const [selectedMaterialCategory, setSelectedMaterialCategory] = useState<string>('All');

  // Applicable Standards Suite & Inspector Modal State
  const [selectedStandardToInspect, setSelectedStandardToInspect] = useState<{
    standard: ApplicableStandardDetail;
    productName: string;
  } | null>(null);
  const [expandedStandardsCards, setExpandedStandardsCards] = useState<Record<string, boolean>>({
    'bldg-rebar': true, // Expanded by default so TMT bar standards suite is immediately visible!
    'brg-rebar': true
  });
  const [selectedStandardRoleFilter, setSelectedStandardRoleFilter] = useState<Record<string, string>>({
    'bldg-rebar': 'All',
    'brg-rebar': 'All'
  });

  const toggleStandardsCard = (cardId: string) => {
    setExpandedStandardsCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const handleAnalyzeSpecificStandard = (std: ApplicableStandardDetail, productName: string) => {
    const q = `${std.code} - ${std.title}. Technical compliance requirement for ${productName}: ${std.purpose} ${std.testParametersOrAcceptance || ''}`;
    setQueryInput(q);
    handleRunAnalysis(q);
    setSelectedStandardToInspect(null);
    setTimeout(() => {
      const el = document.getElementById('recommendation-engine-results');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  };

  // Saved Drafts State
  const [savedDrafts, setSavedDrafts] = useState<SavedTenderSpecDraft[]>(() => {
    try {
      const saved = localStorage.getItem('standardx_procurement_drafts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not load procurement drafts', e);
    }
    return [];
  });

  const handleRunAnalysis = async (customQuery?: string) => {
    const q = customQuery !== undefined ? customQuery : queryInput;
    if (!q || !q.trim()) return;

    setIsLoading(true);
    try {
      const result = await getStandardRecommendations(
        q,
        selectedLanguage === 'Auto-detect' ? undefined : selectedLanguage,
        `${officer.designation}, ${officer.department}`
      );
      setRecommendationResult(result);
    } catch (err) {
      console.error('Failed to get standards recommendation', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessTenderFile = async (file: File) => {
    if (!file) return;
    setIsUploadingDoc(true);
    setUploadError(null);

    try {
      // 1. Extract text using multi-format reader (pdf, docx, txt, xlsx, etc.)
      const { text } = await extractTextFromDocument(file);

      // 2. Parse structural specifications, authorities, and technical clauses
      const extracted = await parseTenderDocument(file, text);

      const sizeStr = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.max(1, Math.round(file.size / 1024))} KB`;

      setUploadedTenderDoc({
        fileName: file.name,
        fileSize: sizeStr,
        extractedRequirement: extracted,
        rawTextSnippet: text.slice(0, 1500)
      });

      // Construct comprehensive technical specification query
      const specSummaryParts = [
        extracted.projectName ? `Project: ${extracted.projectName}` : '',
        extracted.authority ? `Authority: ${extracted.authority}` : '',
        extracted.description ? `Description: ${extracted.description}` : '',
        extracted.qualitySpecifications.concreteGrade ? `Concrete: ${extracted.qualitySpecifications.concreteGrade}` : '',
        extracted.qualitySpecifications.rebarGrade ? `Steel: ${extracted.qualitySpecifications.rebarGrade}` : '',
        extracted.qualitySpecifications.cementType ? `Cement: ${extracted.qualitySpecifications.cementType}` : '',
        extracted.qualitySpecifications.aggregatesSpec ? `Aggregates: ${extracted.qualitySpecifications.aggregatesSpec}` : '',
        extracted.qualitySpecifications.sandSpec ? `Sand: ${extracted.qualitySpecifications.sandSpec}` : '',
        extracted.qualitySpecifications.bitumenGrade ? `Bitumen: ${extracted.qualitySpecifications.bitumenGrade}` : '',
        extracted.qualitySpecifications.masonrySpec ? `Masonry: ${extracted.qualitySpecifications.masonrySpec}` : ''
      ].filter(Boolean);

      const queryToRun = specSummaryParts.join('. ') || text.slice(0, 500) || file.name;
      setQueryInput(queryToRun);

      setCopiedStatus(`Tender document "${file.name}" uploaded and parsed successfully!`);
      setTimeout(() => setCopiedStatus(null), 4000);

      // Trigger standard recommendation analysis immediately
      await handleRunAnalysis(queryToRun);
    } catch (err: any) {
      console.error('Failed to parse tender document', err);
      setUploadError(err?.message || 'Failed to extract text from the tender document. Please ensure the file is a valid PDF, Word (.docx), or Text document.');
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessTenderFile(file);
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessTenderFile(e.dataTransfer.files[0]);
    }
  };

  const handleLoadSampleTender = async (sampleKey: 'commercial_building' | 'highway_corridor' | 'flyover_bridge') => {
    setIsUploadingDoc(true);
    setUploadError(null);
    try {
      const sample = SAMPLE_TENDERS[sampleKey];
      const specSummary = `${sample.authority} — ${sample.projectName}. ${sample.description}. Quality Specs: Concrete ${sample.qualitySpecifications.concreteGrade}, Steel ${sample.qualitySpecifications.rebarGrade}, Cement ${sample.qualitySpecifications.cementType}, Aggregates ${sample.qualitySpecifications.aggregatesSpec}, Sand ${sample.qualitySpecifications.sandSpec}.`;

      setUploadedTenderDoc({
        fileName: sample.sourceFileName,
        fileSize: '1.4 MB',
        extractedRequirement: sample,
        rawTextSnippet: sample.rawExtractedSnippet || sample.description
      });
      setQueryInput(specSummary);
      setCopiedStatus(`Loaded official government sample tender "${sample.projectName}"!`);
      setTimeout(() => setCopiedStatus(null), 3000);
      await handleRunAnalysis(specSummary);
    } catch (err) {
      console.error('Failed to load sample tender', err);
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const handleClearUploadedDoc = () => {
    setUploadedTenderDoc(null);
    setShowExtractedModal(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (headerFileInputRef.current) headerFileInputRef.current.value = '';
  };

  const handleSaveDraft = () => {
    if (!recommendationResult) return;
    const newDraft: SavedTenderSpecDraft = {
      id: `DRAFT-${Date.now()}`,
      title: recommendationResult.primaryStandards[0]?.title || recommendationResult.query.slice(0, 40),
      createdAt: new Date().toISOString(),
      officerName: officer.name,
      department: officer.department,
      query: recommendationResult.query,
      recommendation: recommendationResult,
      status: 'Approved for GeM Tender'
    };
    const updated = [newDraft, ...savedDrafts];
    setSavedDrafts(updated);
    localStorage.setItem('standardx_procurement_drafts', JSON.stringify(updated));
    setCopiedStatus('Draft saved to Procurement Records!');
    setTimeout(() => setCopiedStatus(null), 3000);
  };

  // Derive itemized materials required for this tender along with exact IS standards
  const tenderMaterials = React.useMemo<TenderRequiredProduct[]>(() => {
    if (!uploadedTenderDoc) return [];
    return extractTenderRequiredProducts(
      uploadedTenderDoc.extractedRequirement,
      uploadedTenderDoc.rawTextSnippet
    );
  }, [uploadedTenderDoc]);

  const materialCategories = React.useMemo<string[]>(() => {
    if (!tenderMaterials.length) return [];
    const set = new Set(tenderMaterials.map((m) => m.category));
    return ['All', ...Array.from(set)];
  }, [tenderMaterials]);

  const filteredMaterials = React.useMemo<TenderRequiredProduct[]>(() => {
    return tenderMaterials.filter((mat) => {
      const matchesCategory =
        selectedMaterialCategory === 'All' || mat.category === selectedMaterialCategory;
      const matchesSearch =
        !materialSearchQuery.trim() ||
        mat.productName.toLowerCase().includes(materialSearchQuery.toLowerCase()) ||
        mat.shortName.toLowerCase().includes(materialSearchQuery.toLowerCase()) ||
        mat.standardCode.toLowerCase().includes(materialSearchQuery.toLowerCase()) ||
        mat.requiredGradeOrSpec.toLowerCase().includes(materialSearchQuery.toLowerCase()) ||
        mat.qcoReference.toLowerCase().includes(materialSearchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [tenderMaterials, selectedMaterialCategory, materialSearchQuery]);

  const handleDownloadMaterialsSchedulePdf = () => {
    if (!uploadedTenderDoc) return;
    try {
      exportTenderMaterialsSchedulePdf(
        uploadedTenderDoc.extractedRequirement,
        officer,
        tenderMaterials
      );
      setCopiedStatus('Tender Materials & Standards Schedule PDF downloaded with live certification links!');
      setTimeout(() => setCopiedStatus(null), 3500);
    } catch (err) {
      console.error('Failed to export materials schedule PDF', err);
    }
  };

  const handleCopyClause = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStatus(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedStatus(null), 3000);
  };

  const handleDownloadPdf = (res: StandardRecommendationResult) => {
    try {
      exportTenderAppendixPdf(
        res,
        officer,
        uploadedTenderDoc?.fileName,
        tenderMaterials.length > 0 ? tenderMaterials : undefined,
        uploadedTenderDoc?.extractedRequirement
      );
      setCopiedStatus('Tender Specification PDF downloaded successfully with interactive BIS certification links!');
      setTimeout(() => setCopiedStatus(null), 3500);
    } catch (err) {
      console.error('Failed to generate PDF, falling back to text', err);
      handleDownloadTxt(res);
    }
  };

  const handleDownloadTxt = (res: StandardRecommendationResult) => {
    const content = `===================================================================
GOVERNMENT OF INDIA - TECHNICAL SPECIFICATION CLAUSE
Generated via STANDARD X - AI Procurement Recommendation Engine
Officer: ${officer.name} (${officer.badgeNumber})
Department: ${officer.department}
Date: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}
===================================================================

REQUIREMENT / SCOPE:
${res.query}

PRIMARY INDIAN STANDARDS:
${res.primaryStandards.map((s) => `• ${s.code} - ${s.title} (${s.edition}, Amend: ${s.latestAmendment})`).join('\n')}

MANDATORY CERTIFICATIONS & QUALITY CONTROL ORDERS:
${res.mandatoryCertifications.map((c) => `• [${c.isCompulsory ? 'COMPULSORY' : 'STATUTORY'}] ${c.scheme}\n  QCO: ${c.qcoOrderReference}\n  Details: ${c.description}`).join('\n\n')}

NORMATIVE REFERENCES (CONCURRENT READING):
${res.normativeReferences.map((n) => `• ${n.code}: ${n.title}`).join('\n')}

ALLIED & RELATED PRODUCT STANDARDS:
${res.alliedStandards.map((a) => `• ${a.code}: ${a.title}`).join('\n')}

MANDATORY TEST METHOD STANDARDS:
${res.testMethodStandards.map((t) => `• ${t.code}: ${t.title}`).join('\n')}

SAFETY & INSTALLATION CODES:
${res.safetyAndInstallationStandards.map((s) => `• ${s.code}: ${s.title}`).join('\n')}

-------------------------------------------------------------------
FORMAL TENDER SPECIFICATION CLAUSE (READY TO PASTE IN GeM / CPWD NIT):
-------------------------------------------------------------------
${res.tenderDraftClause}

===================================================================
End of Technical Schedule. Verified against BIS National Standards Database.
===================================================================
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Tender_Spec_${res.primaryStandards[0]?.code.replace(/[\s\:\/]/g, '_') || 'Schedule'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Banner: Official Portal Designation */}
        <div className="bg-gradient-to-r from-amber-50/90 via-white to-orange-50/60 border border-amber-300 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-300 uppercase tracking-wider shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  Official Portal • Bureau of Indian Standards (BIS) Intelligence
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Government e-Marketplace (GeM) & CPWD Aligned
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 font-display">
                Intelligent Standards <span className="text-amber-700">Recommendation Engine</span>
              </h1>
              <p className="text-slate-600 max-w-3xl text-sm sm:text-base leading-relaxed">
                Automating Indian Standards (IS) identification for procurement officials, engineers, and tender committees.
                Understands technical requirements semantically and prescribes complete standard ecosystems with latest amendments and compulsory certifications.
              </p>
            </div>

            {/* Officer Credentials Card */}
            <div className="bg-white border border-amber-200 rounded-xl p-4 sm:p-5 flex flex-col justify-between w-full lg:w-80 lg:shrink-0 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Procurement Officer</h2>
                    <span className="text-[10px] text-emerald-700 font-mono font-semibold">Authenticated Session</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono font-bold border border-amber-300">
                  {officer.badgeNumber}
                </span>
              </div>

              <div className="pt-3 space-y-1 text-xs">
                <p className="font-bold text-slate-900">{officer.name}</p>
                <p className="text-slate-600 text-[11px] truncate" title={officer.designation}>{officer.designation}</p>
                <p className="text-slate-500 text-[10px] truncate" title={officer.department}>{officer.department}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-700" />
                  {officer.clearanceLevel}
                </span>
                <button
                  onClick={() => {
                    const profiles: ProcurementOfficerProfile[] = [
                      DEFAULT_OFFICER,
                      {
                        id: 'OFFICER-RAIL-202',
                        name: 'Smt. Ananya Sen',
                        designation: 'Chief Materials Manager (Procurement)',
                        department: 'Ministry of Railways & Indian Railways Central Depot',
                        cadre: 'PSU / Railway',
                        badgeNumber: 'IR-MM-2026-104',
                        clearanceLevel: 'Chief Materials Manager',
                        verifiedAt: new Date().toISOString(),
                        organizationEmail: 'ananya.sen@railnet.gov.in'
                      },
                      {
                        id: 'OFFICER-NHAI-303',
                        name: 'Shri Vikram Singh',
                        designation: 'General Manager (Technical & Highway Tenders)',
                        department: 'National Highways Authority of India (NHAI)',
                        cadre: 'Central Govt',
                        badgeNumber: 'NHAI-TECH-2026-512',
                        clearanceLevel: 'Class I Official',
                        verifiedAt: new Date().toISOString(),
                        organizationEmail: 'vikram.singh@nhai.org'
                      }
                    ];
                    const next = profiles[(profiles.findIndex((p) => p.id === officer.id) + 1) % profiles.length];
                    setOfficer(next);
                  }}
                  className="text-amber-700 hover:text-amber-800 underline cursor-pointer font-bold"
                >
                  Switch Cadre / Persona
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Bar Tabs */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-amber-200/80 overflow-x-auto">
            <button
              onClick={() => setActiveTab('engine')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'engine'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>AI Recommendation Engine</span>
            </button>

            <button
              onClick={() => setActiveTab('how-it-works')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'how-it-works'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Problem Statement & System Architecture</span>
            </button>

            <button
              onClick={() => setActiveTab('drafts')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'drafts'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Saved Tender Drafts ({savedDrafts.length})</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert Toast */}
        {copiedStatus && (
          <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-lg shadow-xl font-bold text-xs flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>{copiedStatus}</span>
          </div>
        )}

        {/* TAB 1: THE AI RECOMMENDATION ENGINE */}
        {activeTab === 'engine' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Input & Tender Document Space Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                    Tender Technical Specification & Document Analysis
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Upload an official tender document (PDF, Word, BOQ Schedule) or enter technical requirements directly.
                  </p>
                </div>

                {/* Input Mode Switcher */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setInputTab('upload')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      inputTab === 'upload'
                        ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-amber-600" />
                    <span>Upload Tender Document</span>
                    {uploadedTenderDoc && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setInputTab('text')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      inputTab === 'text'
                        ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-600" />
                    <span>Type / Edit Query</span>
                  </button>
                </div>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt,.csv,.xlsx,.tsv,.json"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Upload Tab: Dedicated Tender Document Upload Space */}
              {inputTab === 'upload' && (
                <div className="space-y-4">
                  {/* Upload Error Alert */}
                  {uploadError && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                        <span>{uploadError}</span>
                      </div>
                      <button
                        onClick={() => setUploadError(null)}
                        className="text-red-700 hover:text-red-900 font-bold text-xs cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}

                  {/* Processing in progress */}
                  {isUploadingDoc && (
                    <div className="border-2 border-dashed border-amber-400 bg-amber-50/40 rounded-2xl p-8 text-center space-y-3">
                      <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mx-auto" />
                      <h4 className="text-sm font-bold text-slate-900">
                        Parsing Tender Document & Extracting Engineering Parameters...
                      </h4>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Extracting NIT reference, executing authority, structural scopes, concrete/rebar grades, and cross-referencing Bureau of Indian Standards (IS) catalog.
                      </p>
                    </div>
                  )}

                  {/* Active Document Uploaded */}
                  {!isUploadingDoc && uploadedTenderDoc && (
                    <div className="border border-emerald-200 bg-emerald-50/30 rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xs">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-emerald-100 pb-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 shrink-0">
                            <FileCheck className="w-6 h-6" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm sm:text-base font-bold text-slate-900">
                                {uploadedTenderDoc.fileName}
                              </span>
                              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                                {uploadedTenderDoc.fileSize}
                              </span>
                              <span className="text-[11px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold border border-amber-300">
                                {uploadedTenderDoc.extractedRequirement.extractionConfidence}% Match Confidence
                              </span>
                            </div>
                            <p className="text-xs text-slate-600">
                              <span className="font-semibold text-slate-900">{uploadedTenderDoc.extractedRequirement.authority}</span>
                              {uploadedTenderDoc.extractedRequirement.tenderId && (
                                <span> • {uploadedTenderDoc.extractedRequirement.tenderId}</span>
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start">
                          <button
                            type="button"
                            onClick={() => setShowExtractedModal(true)}
                            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5 text-amber-600" />
                            <span>View Clauses & BOQ</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                          >
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>Replace Document</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleClearUploadedDoc}
                            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                            title="Remove uploaded tender document"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Extracted Specifications Preview Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                        <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-0.5">
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">Project Title</span>
                          <span className="font-semibold text-slate-900 truncate block" title={uploadedTenderDoc.extractedRequirement.projectName}>
                            {uploadedTenderDoc.extractedRequirement.projectName || 'Not specified'}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-0.5">
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">Concrete Grade</span>
                          <span className="font-semibold text-amber-800 truncate block">
                            {uploadedTenderDoc.extractedRequirement.qualitySpecifications.concreteGrade || 'IS Design Mix'}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-0.5">
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">Steel Rebar Grade</span>
                          <span className="font-semibold text-amber-800 truncate block">
                            {uploadedTenderDoc.extractedRequirement.qualitySpecifications.rebarGrade || 'IS 1786 Fe 500D'}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-0.5">
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">Cement Specification</span>
                          <span className="font-semibold text-amber-800 truncate block">
                            {uploadedTenderDoc.extractedRequirement.qualitySpecifications.cementType || 'Grade 53 OPC'}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Technical clauses extracted directly from your document are mapped into the recommendation engine.</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRunAnalysis()}
                          disabled={isLoading}
                          className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-2xs"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                          <span>Re-Analyze Standards</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Itemized Tender Materials & Required Indian Standards Schedule */}
                  {uploadedTenderDoc && tenderMaterials.length > 0 && (
                    <div className="border border-amber-300 bg-amber-50/20 rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-200/80 pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold uppercase tracking-wider">
                              Mandatory Compliance Schedule
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold">
                              {tenderMaterials.length} Required Products Identified
                            </span>
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                            <Layers className="w-5 h-5 text-amber-600" />
                            Tender Materials & Indian Standards Compliance Matrix
                          </h3>
                          <p className="text-xs text-slate-600 mt-0.5">
                            Automated material schedule identifying required engineering products, matching Indian Standards, mandatory QCO orders, and clickable BIS verification links.
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={handleDownloadMaterialsSchedulePdf}
                            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-sm shadow-amber-500/20 transition-all cursor-pointer"
                            title="Download itemized Tender Materials and Standards Compliance Schedule as PDF"
                          >
                            <Download className="w-4 h-4 shrink-0" />
                            <span>Download Materials Schedule (.pdf)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowExtractedModal(true)}
                            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-300 shadow-2xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-amber-600" />
                            <span>View Full BOQ & Clauses</span>
                          </button>
                        </div>
                      </div>

                      {/* Search & Category Filter Controls */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                        <div className="relative flex-1">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={materialSearchQuery}
                            onChange={(e) => setMaterialSearchQuery(e.target.value)}
                            placeholder="Search materials (e.g. Steel Rebars, Cement, Aggregates, IS 1786, IS 269)..."
                            className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                          />
                          {materialSearchQuery && (
                            <button
                              type="button"
                              onClick={() => setMaterialSearchQuery('')}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                          {materialCategories.map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setSelectedMaterialCategory(cat)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                                selectedMaterialCategory === cat
                                  ? 'bg-amber-500 text-slate-950 shadow-2xs'
                                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Material Cards List */}
                      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                        {filteredMaterials.map((mat, idx) => (
                          <div
                            key={mat.id}
                            className="bg-white border border-slate-200 hover:border-amber-400 rounded-xl p-4 sm:p-5 transition-all shadow-2xs space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-xs font-mono font-bold text-slate-500">
                                    #{idx + 1}
                                  </span>
                                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                                    {mat.category}
                                  </span>
                                  <span className="text-xs px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 font-mono font-bold border border-amber-300">
                                    {mat.standardCode}
                                  </span>
                                  {mat.isMandatoryQco && (
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold border border-red-200 uppercase">
                                      Mandatory QCO (ISI Mark)
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-base font-bold text-slate-900">
                                  {mat.productName}
                                </h4>
                                <p className="text-xs text-slate-500 italic">
                                  {mat.standardTitle}
                                </p>
                              </div>

                              {mat.estimatedQuantity && (
                                <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-right shrink-0">
                                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Tender BOQ Qty</span>
                                  <span className="text-xs font-bold text-amber-900 font-mono">{mat.estimatedQuantity}</span>
                                </div>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                                <span className="font-bold text-slate-800 block text-[11px]">Required Project Grade / Spec:</span>
                                <p className="text-slate-700 font-semibold">{mat.requiredGradeOrSpec}</p>
                                <p className="text-[11px] text-red-700 font-medium pt-0.5">{mat.qcoReference}</p>
                              </div>

                              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                                <span className="font-bold text-slate-800 block text-[11px]">Key Acceptance Benchmarks:</span>
                                <p className="text-slate-700 text-[11px]">{mat.acceptanceCriteria}</p>
                                <p className="text-[10px] text-slate-500 pt-0.5">
                                  <span className="font-semibold text-slate-600">Mandatory Tests: </span>
                                  {mat.mandatoryTests.join(' · ')}
                                </p>
                              </div>
                            </div>

                            {/* Applicable Indian Standards Ecosystem (Comprehensive Suite for Analysis) */}
                            {mat.applicableStandards && mat.applicableStandards.length > 0 && (
                              <div className="rounded-xl border border-amber-300/80 bg-gradient-to-br from-amber-50/50 via-white to-slate-50/70 p-3.5 sm:p-4 space-y-3 shadow-2xs">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-amber-200 pb-2.5">
                                  <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                      <span className="p-1 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                                        <Layers className="w-3.5 h-3.5" />
                                      </span>
                                      <h5 className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                                        Applicable Indian Standards Suite for {mat.shortName}
                                        <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white font-mono text-[10px] font-bold">
                                          {mat.applicableStandards.length} Standards Available
                                        </span>
                                      </h5>
                                    </div>
                                    <p className="text-[11px] text-slate-600 pl-6">
                                      Complete suite of Bureau of Indian Standards governing manufacturing, mechanical tensile/bend testing, chemical spectrometry, seismic detailing, couplers, and sampling.
                                    </p>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => toggleStandardsCard(mat.id)}
                                    className="self-start sm:self-center px-3 py-1.5 rounded-lg bg-white hover:bg-amber-100/60 border border-amber-300 text-amber-900 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs shrink-0"
                                  >
                                    <span>{expandedStandardsCards[mat.id] ? 'Hide Standards Suite' : `Inspect All ${mat.applicableStandards.length} Standards`}</span>
                                    {expandedStandardsCards[mat.id] ? (
                                      <ChevronUp className="w-3.5 h-3.5 text-amber-800" />
                                    ) : (
                                      <ChevronDown className="w-3.5 h-3.5 text-amber-800" />
                                    )}
                                  </button>
                                </div>

                                {/* Preview Pills when collapsed */}
                                {!expandedStandardsCards[mat.id] && (
                                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                    <span className="text-[11px] font-semibold text-slate-500 mr-1">Standards Suite:</span>
                                    {mat.applicableStandards.slice(0, 6).map((std) => (
                                      <button
                                        key={std.code}
                                        type="button"
                                        onClick={() => setSelectedStandardToInspect({ standard: std, productName: mat.productName })}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-900 border border-slate-200 hover:border-amber-300 text-[11px] font-mono font-medium transition-colors cursor-pointer"
                                        title={`${std.title} - Click to inspect`}
                                      >
                                        <span>{std.code}</span>
                                        <Eye className="w-2.5 h-2.5 text-slate-400" />
                                      </button>
                                    ))}
                                    {mat.applicableStandards.length > 6 && (
                                      <button
                                        type="button"
                                        onClick={() => toggleStandardsCard(mat.id)}
                                        className="px-2 py-0.5 rounded bg-amber-100/80 hover:bg-amber-200 text-amber-900 text-[11px] font-bold border border-amber-300 cursor-pointer transition-colors"
                                      >
                                        +{mat.applicableStandards.length - 6} more standards...
                                      </button>
                                    )}
                                  </div>
                                )}

                                {/* Full Interactive Grid & Filters when expanded */}
                                {expandedStandardsCards[mat.id] && (
                                  <div className="space-y-3 pt-1">
                                    {/* Role filter pills */}
                                    <div className="flex flex-wrap items-center gap-1.5 pb-1">
                                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">Filter by Function:</span>
                                      {['All', ...Array.from(new Set(mat.applicableStandards.map(s => s.role)))].map((role) => {
                                        const currentFilter = selectedStandardRoleFilter[mat.id] || 'All';
                                        const isSelected = currentFilter === role;
                                        const count = role === 'All'
                                          ? mat.applicableStandards!.length
                                          : mat.applicableStandards!.filter(s => s.role === role).length;
                                        return (
                                          <button
                                            key={role}
                                            type="button"
                                            onClick={() => setSelectedStandardRoleFilter(prev => ({ ...prev, [mat.id]: role }))}
                                            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors cursor-pointer ${
                                              isSelected
                                                ? 'bg-amber-800 text-white border border-amber-900 shadow-2xs'
                                                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                                            }`}
                                          >
                                            {role} ({count})
                                          </button>
                                        );
                                      })}
                                    </div>

                                    {/* Standards Cards Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[500px] overflow-y-auto pr-1">
                                      {mat.applicableStandards
                                        .filter(std => {
                                          const filter = selectedStandardRoleFilter[mat.id] || 'All';
                                          return filter === 'All' || std.role === filter;
                                        })
                                        .map((std) => {
                                          const roleColorClasses: Record<string, string> = {
                                            'Core Specification': 'bg-emerald-50 text-emerald-800 border-emerald-300',
                                            'Mandatory Test': 'bg-amber-50 text-amber-900 border-amber-300',
                                            'Chemical Analysis': 'bg-purple-50 text-purple-900 border-purple-200',
                                            'Structural Design & Detailing': 'bg-sky-50 text-sky-900 border-sky-300',
                                            'Splicing & Couplers': 'bg-orange-50 text-orange-900 border-orange-300',
                                            'Corrosion & Coating': 'bg-teal-50 text-teal-900 border-teal-300',
                                            'Sampling & Quality Inspection': 'bg-slate-100 text-slate-800 border-slate-300'
                                          };
                                          const roleClass = roleColorClasses[std.role] || 'bg-slate-100 text-slate-800 border-slate-200';

                                          return (
                                            <div
                                              key={std.code}
                                              className="p-3 rounded-lg bg-white border border-slate-200 hover:border-amber-400 transition-all shadow-2xs space-y-2 flex flex-col justify-between"
                                            >
                                              <div className="space-y-1.5">
                                                <div className="flex flex-wrap items-center justify-between gap-1.5">
                                                  <span className="text-xs font-mono font-bold text-slate-900 px-2 py-0.5 rounded bg-slate-100 border border-slate-300">
                                                    {std.code}
                                                  </span>
                                                  <div className="flex items-center gap-1">
                                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${roleClass}`}>
                                                      {std.role}
                                                    </span>
                                                    {std.isMandatoryQco && (
                                                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-800 border border-red-200">
                                                        QCO
                                                      </span>
                                                    )}
                                                  </div>
                                                </div>

                                                <h6 className="text-xs font-bold text-slate-800 leading-snug">
                                                  {std.title}
                                                </h6>

                                                <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-3">
                                                  {std.purpose}
                                                </p>

                                                {std.testParametersOrAcceptance && (
                                                  <div className="p-1.5 rounded bg-amber-50/70 border border-amber-200/80 text-[10px] text-amber-950 font-medium">
                                                    <span className="font-bold text-amber-900 block">Benchmark Acceptance:</span>
                                                    <p className="line-clamp-2">{std.testParametersOrAcceptance}</p>
                                                  </div>
                                                )}
                                              </div>

                                              {/* Action Buttons for this specific standard */}
                                              <div className="flex flex-wrap items-center justify-between gap-1.5 pt-2 border-t border-slate-100 text-[11px]">
                                                <div className="flex items-center gap-1">
                                                  <button
                                                    type="button"
                                                    onClick={() => setSelectedStandardToInspect({ standard: std, productName: mat.productName })}
                                                    className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition-colors cursor-pointer flex items-center gap-1"
                                                    title={`Inspect key clauses and test benchmarks of ${std.code}`}
                                                  >
                                                    <Eye className="w-3 h-3 text-slate-600" />
                                                    <span>Inspect Details</span>
                                                  </button>

                                                  {std.bisUrl && (
                                                    <a
                                                      href={std.bisUrl}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="p-1 rounded bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition-colors cursor-pointer"
                                                      title={`Open official BIS Know Your Standards portal for ${std.code}`}
                                                    >
                                                      <ExternalLink className="w-3 h-3 text-sky-600" />
                                                    </a>
                                                  )}
                                                </div>

                                                <button
                                                  type="button"
                                                  onClick={() => handleAnalyzeSpecificStandard(std, mat.productName)}
                                                  className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                                                  title={`Run recommendation engine analysis for ${std.code}`}
                                                >
                                                  <Sparkles className="w-3 h-3 text-amber-700" />
                                                  <span>Analyze in Engine</span>
                                                </button>
                                              </div>
                                            </div>
                                          );
                                        })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Action Row with Direct Verification Links */}
                            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <a
                                  href={mat.certificationVerificationUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 hover:text-sky-900 border border-sky-200 text-xs font-bold transition-colors cursor-pointer"
                                  title={`Verify Official BIS Certification details for ${mat.standardCode}`}
                                >
                                  <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                                  <span>Verify BIS Certification ({mat.standardCode}) ↗</span>
                                </a>

                                <a
                                  href={mat.manakonlineSearchUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-medium transition-colors cursor-pointer"
                                  title={`Search BIS Licensees & Manufacturers on Manakonline for ${mat.standardCode}`}
                                >
                                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Manakonline Maker Search ↗</span>
                                </a>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const q = `${mat.productName} conforming to ${mat.standardCode} ${mat.requiredGradeOrSpec}`;
                                    setQueryInput(q);
                                    handleRunAnalysis(q);
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                                >
                                  <Search className="w-3.5 h-3.5 text-amber-700" />
                                  <span>Analyze Standard in Engine</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleCopyClause(`${mat.productName} shall conform to ${mat.standardCode} (${mat.requiredGradeOrSpec}). Acceptance criteria: ${mat.acceptanceCriteria}. Mandatory testing per ${mat.mandatoryTests.join(', ')}.`, mat.productName)}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
                                  title="Copy technical requirement clause"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                        {filteredMaterials.length === 0 && (
                          <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-xs space-y-1">
                            <p className="font-semibold text-slate-700">No materials matching "{materialSearchQuery}" in {selectedMaterialCategory}</p>
                            <p>Try searching for general terms like "Steel", "Cement", "IS 1786", or select "All".</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Empty Drag & Drop Space */}
                  {!isUploadingDoc && !uploadedTenderDoc && (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragOver(true);
                      }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                        isDragOver
                          ? 'border-amber-500 bg-amber-50/60 scale-[0.99]'
                          : 'border-slate-300 hover:border-amber-400 bg-slate-50/50 hover:bg-amber-50/20'
                      }`}
                    >
                      <div className="max-w-md mx-auto space-y-4">
                        <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center mx-auto shadow-2xs">
                          <UploadCloud className="w-7 h-7" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-slate-900">
                            Upload Exact Tender Document Space
                          </h3>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            Drag and drop your official Tender Document (NIT / RFP / Technical Schedule), or click below to browse from your device.
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                          >
                            <FileUp className="w-4 h-4" />
                            <span>Browse Tender Document</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleLoadSampleTender('commercial_building')}
                            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center gap-2 border border-slate-300 shadow-2xs transition-all cursor-pointer"
                            title="Load pre-verified CPWD Commercial Building Tender with itemized materials & BIS links"
                          >
                            <Sparkles className="w-4 h-4 text-amber-600" />
                            <span>Try Working Model (CPWD Demo)</span>
                          </button>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-2 font-mono">
                          <span>Supported: .PDF</span>
                          <span>•</span>
                          <span>.DOCX</span>
                          <span>•</span>
                          <span>.XLSX / .CSV (BOQ)</span>
                          <span>•</span>
                          <span>.TXT</span>
                        </div>
                      </div>

                      {/* Official Govt Sample NITs */}
                      <div className="mt-6 pt-5 border-t border-slate-200/80">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
                          Or Test with Verified Government Tender NITs:
                        </span>
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleLoadSampleTender('commercial_building')}
                            className="px-3 py-1.5 rounded-lg bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-400 text-xs text-slate-700 font-semibold transition-all cursor-pointer shadow-2xs"
                          >
                            CPWD Commercial Arcade NIT (G+3)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleLoadSampleTender('highway_corridor')}
                            className="px-3 py-1.5 rounded-lg bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-400 text-xs text-slate-700 font-semibold transition-all cursor-pointer shadow-2xs"
                          >
                            MPRDC 4-Lane Highway NIT
                          </button>
                          <button
                            type="button"
                            onClick={() => handleLoadSampleTender('flyover_bridge')}
                            className="px-3 py-1.5 rounded-lg bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-400 text-xs text-slate-700 font-semibold transition-all cursor-pointer shadow-2xs"
                          >
                            State PWD Flyover Bridge NIT
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Text Input & Quick Preset Queries */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-600" />
                    Technical Procurement Specification Query:
                  </span>
                  <div className="flex items-center gap-2">
                    <Globe2 className="w-3.5 h-3.5 text-slate-500" />
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="bg-slate-50 text-[11px] text-slate-700 border border-slate-300 rounded-md px-2 py-1 focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="Auto-detect">Auto-detect Language</option>
                      <option value="English">English</option>
                      <option value="Hindi">Hindi (हिंदी)</option>
                      <option value="Tamil">Tamil (தமிழ்)</option>
                      <option value="Telugu">Telugu (తెలుగు)</option>
                      <option value="Marathi">Marathi (मराठी)</option>
                      <option value="Bengali">Bengali (বাংলা)</option>
                    </select>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    rows={3}
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    placeholder="Technical tender clauses or product requirements will appear here after uploading, or type directly..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 pb-12 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all font-sans shadow-2xs"
                  />
                  <div className="absolute bottom-2.5 right-2.5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQueryInput('')}
                      className="px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 text-[11px] text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRunAnalysis()}
                      disabled={isLoading || !queryInput.trim()}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Analyzing Standards...</span>
                        </>
                      ) : (
                        <>
                          <Search className="w-3.5 h-3.5" />
                          <span>Analyze & Recommend</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Quick Preset Queries */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Quick Procurement Scenarios:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SAMPLE_QUERIES.map((sample) => (
                      <button
                        key={sample.title}
                        type="button"
                        onClick={() => {
                          setQueryInput(sample.text);
                          handleRunAnalysis(sample.text);
                        }}
                        className="px-2.5 py-1 rounded-md bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-400 text-[11px] text-slate-700 hover:text-slate-900 transition-all flex items-center gap-1.5 cursor-pointer group shadow-2xs"
                      >
                        <span className="font-semibold text-slate-800">{sample.title}</span>
                        <span className="text-[9px] px-1 py-0.5 rounded bg-amber-100 text-amber-800 font-mono font-medium border border-amber-200">
                          {sample.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Display */}
            {isLoading && (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-sm">
                <RefreshCw className="w-10 h-10 text-amber-600 animate-spin mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">Performing Semantic Analysis & Standards Relationship Mapping</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Cross-referencing technical requirements against the Bureau of Indian Standards (IS) catalog, identifying normative references, checking Quality Control Orders (QCO), and compiling latest amendments...
                </p>
              </div>
            )}

            {!isLoading && recommendationResult && (
              <div className="space-y-6">
                {/* Result Overview Banner */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-800 font-mono text-xs font-bold border border-amber-200">
                          {recommendationResult.detectedDomain}
                        </span>
                        <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-mono text-xs border border-slate-200">
                          Lang: {recommendationResult.detectedLanguage}
                        </span>
                        <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 font-mono text-xs font-semibold border border-emerald-200">
                          Engine: {recommendationResult.source === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash AI' : 'Deterministic IS Knowledge Graph'}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                        Standard Ecosystem Recommendation
                      </h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        ref={headerFileInputRef}
                        type="file"
                        accept=".pdf,.docx,.doc,.txt,.csv,.xlsx,.tsv,.json"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      {uploadedTenderDoc ? (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-300 text-xs text-amber-900 font-medium shadow-2xs">
                          <FileCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                          <span className="truncate max-w-[150px] sm:max-w-[200px]" title={uploadedTenderDoc.fileName}>
                            {uploadedTenderDoc.fileName}
                          </span>
                          <button
                            onClick={() => headerFileInputRef.current?.click()}
                            className="text-amber-700 hover:text-amber-900 text-[11px] underline font-bold cursor-pointer ml-1"
                            title="Upload a new tender document"
                          >
                            Replace
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => headerFileInputRef.current?.click()}
                          disabled={isUploadingDoc}
                          className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300 shadow-2xs shrink-0"
                          title="Upload exact tender document (PDF, DOCX, TXT, Excel/CSV)"
                        >
                          {isUploadingDoc ? (
                            <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                          ) : (
                            <UploadCloud className="w-3.5 h-3.5 text-amber-600" />
                          )}
                          <span>Upload Tender Doc</span>
                        </button>
                      )}

                      <button
                        onClick={handleSaveDraft}
                        className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300 shadow-2xs"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-700" />
                        <span>Save to Drafts</span>
                      </button>

                      <button
                        id="export-tender-appendix-btn"
                        onClick={() => handleDownloadPdf(recommendationResult)}
                        className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-amber-500/20 shrink-0"
                        title="Export Official Tender Specification Appendix as PDF"
                      >
                        <Download className="w-3.5 h-3.5 shrink-0" />
                        <span>Export Tender Appendix (.pdf)</span>
                      </button>
                    </div>
                  </div>

                  {/* Semantic Reasoning Explanation */}
                  <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-200 space-y-1.5">
                    <span className="text-[10px] font-mono text-amber-800 font-bold uppercase tracking-wider block">
                      Semantic Analysis & Engineering Context:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {recommendationResult.semanticAnalysis}
                    </p>
                  </div>
                </div>

                {/* 1. PRIMARY STANDARDS (RANKED) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-600" />
                      Primary Relevant Indian Standards (Ranked)
                    </h3>
                    <span className="text-xs text-slate-500">
                      {recommendationResult.primaryStandards.length} Standards Identified
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {recommendationResult.primaryStandards.map((std, idx) => (
                      <div
                        key={std.code}
                        className="bg-white border border-slate-200 hover:border-amber-400 rounded-xl p-5 sm:p-6 space-y-4 transition-all shadow-sm"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm sm:text-base font-mono font-black text-amber-800">
                                #{idx + 1} {std.code}
                              </span>
                              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                                {std.relevanceScore}% Match
                              </span>
                              {std.isMandatoryQco && (
                                <span className="text-[10px] px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200 font-bold uppercase">
                                  Mandatory QCO
                                </span>
                              )}
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 mt-1">{std.title}</h4>
                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                              <span>Edition: {std.edition}</span>
                              <span>•</span>
                              <span className="text-amber-800 font-semibold">Latest Amendment: {std.latestAmendment}</span>
                              <span>•</span>
                              <span>Year: {std.yearOfPublication}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 self-start">
                            <a
                              href={getBisStandardVerificationUrl(std.code)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded bg-sky-50 hover:bg-sky-100 text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1.5 transition-colors cursor-pointer border border-sky-200"
                              title={`Verify Official BIS Certification details for ${std.code}`}
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                              <span>Verify BIS Certification ↗</span>
                            </a>
                            <a
                              href={getManakonlineSearchUrl(std.code)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 transition-colors cursor-pointer border border-slate-200"
                              title={`Search certified licensees on Manakonline for ${std.code}`}
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                              <span>Manakonline Search ↗</span>
                            </a>
                            <button
                              onClick={() => handleCopyClause(std.code, std.code)}
                              className="px-2.5 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 transition-colors cursor-pointer border border-slate-200"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Code</span>
                            </button>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                          {std.scope}
                        </p>

                        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-xs text-slate-600 space-y-1">
                          <span className="text-amber-800 font-semibold block text-[11px]">Why This Standard Is Recommended:</span>
                          <p>{std.matchExplanation}</p>
                        </div>

                        {/* Physical / Chemical Parameter Highlights */}
                        {(std.keyPhysicalRequirements || std.keyChemicalRequirements) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                            {std.keyPhysicalRequirements && (
                              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 space-y-1">
                                <span className="font-bold text-slate-800 block text-[11px]">Key Physical & Mechanical Benchmarks:</span>
                                <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                                  {std.keyPhysicalRequirements.map((req, i) => (
                                    <li key={i}>{req}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {std.keyChemicalRequirements && (
                              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 space-y-1">
                                <span className="font-bold text-slate-800 block text-[11px]">Chemical & Purity Thresholds:</span>
                                <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                                  {std.keyChemicalRequirements.map((req, i) => (
                                    <li key={i}>{req}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. MANDATORY CERTIFICATIONS & QUALITY CONTROL ORDERS */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Mandatory Certifications & Quality Control Orders (QCO)
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                      Legal Compliance
                    </span>
                  </div>

                  <div className="space-y-3">
                    {recommendationResult.mandatoryCertifications.map((cert, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            <BadgeCheck className="w-4 h-4 text-amber-600" />
                            {cert.scheme}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200 text-[10px] font-bold">
                            {cert.isCompulsory ? 'COMPULSORY BY LAW' : 'STATUTORY'}
                          </span>
                        </div>
                        <p className="text-amber-800 font-mono text-[11px] font-semibold">
                          Statutory Order: {cert.qcoOrderReference}
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                          {cert.description}
                        </p>
                        <div className="text-[10px] text-slate-500 pt-1">
                          Enforcing Authority: {cert.issuingAuthority}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. COMPLETE STANDARD ECOSYSTEM GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Normative References */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-4 h-4" />
                        Normative References (Read Together)
                      </h4>
                      <span className="text-[11px] text-slate-500">{recommendationResult.normativeReferences.length} Standards</span>
                    </div>
                    <ul className="divide-y divide-slate-100 text-xs">
                      {recommendationResult.normativeReferences.map((item) => (
                        <li key={item.code} className="py-2.5 flex items-start justify-between gap-2">
                          <div>
                            <span className="font-mono font-bold text-slate-900">{item.code}</span>
                            <p className="text-slate-500 text-[11px] mt-0.5">{item.title}</p>
                          </div>
                          <button
                            onClick={() => handleCopyClause(item.code, item.code)}
                            className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                            title="Copy code"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Allied & Related Standards */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Scale className="w-4 h-4" />
                        Allied & Related Product Standards
                      </h4>
                      <span className="text-[11px] text-slate-500">{recommendationResult.alliedStandards.length} Standards</span>
                    </div>
                    <ul className="divide-y divide-slate-100 text-xs">
                      {recommendationResult.alliedStandards.map((item) => (
                        <li key={item.code} className="py-2.5 flex items-start justify-between gap-2">
                          <div>
                            <span className="font-mono font-bold text-slate-900">{item.code}</span>
                            <p className="text-slate-500 text-[11px] mt-0.5">{item.title}</p>
                          </div>
                          <button
                            onClick={() => handleCopyClause(item.code, item.code)}
                            className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                            title="Copy code"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Test Method Standards */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4" />
                        Mandatory Test Method Standards
                      </h4>
                      <span className="text-[11px] text-slate-500">{recommendationResult.testMethodStandards.length} Standards</span>
                    </div>
                    <ul className="divide-y divide-slate-100 text-xs">
                      {recommendationResult.testMethodStandards.map((item) => (
                        <li key={item.code} className="py-2.5 flex items-start justify-between gap-2">
                          <div>
                            <span className="font-mono font-bold text-slate-900">{item.code}</span>
                            <p className="text-slate-500 text-[11px] mt-0.5">{item.title}</p>
                          </div>
                          <button
                            onClick={() => handleCopyClause(item.code, item.code)}
                            className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                            title="Copy code"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Safety & Installation Standards */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4" />
                        Safety, Storage & Installation Standards
                      </h4>
                      <span className="text-[11px] text-slate-500">{recommendationResult.safetyAndInstallationStandards.length} Standards</span>
                    </div>
                    <ul className="divide-y divide-slate-100 text-xs">
                      {recommendationResult.safetyAndInstallationStandards.map((item) => (
                        <li key={item.code} className="py-2.5 flex items-start justify-between gap-2">
                          <div>
                            <span className="font-mono font-bold text-slate-900">{item.code}</span>
                            <p className="text-slate-500 text-[11px] mt-0.5">{item.title}</p>
                          </div>
                          <button
                            onClick={() => handleCopyClause(item.code, item.code)}
                            className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                            title="Copy code"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 4. TENDER SPECIFICATION CLAUSE GENERATOR */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-amber-600" />
                        Official Tender Technical Specification Clause
                      </h3>
                      <p className="text-xs text-slate-500">
                        Synthesized technical clause compliant with CPWD Works Manual, GeM General Contract Conditions (GCC), and BIS Act 2016.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyClause(recommendationResult.tenderDraftClause, 'Tender Specification Clause')}
                        className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-amber-500/20"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Clause</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-300 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed shadow-2xs">
                    {recommendationResult.tenderDraftClause}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                    <span className="text-slate-500">
                      Clauses cross-referenced with Section 16 of the Bureau of Indian Standards Act, 2016.
                    </span>
                    <button
                      onClick={() => {
                        onNavigate('create-project');
                      }}
                      className="text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Proceed to Estimate Quantities in STANDARD X</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROBLEM STATEMENT & SYSTEM ARCHITECTURE (THE USER'S EXACT BRIEF) */}
        {activeTab === 'how-it-works' && (
          <div className="space-y-8 animate-fadeIn">
            {/* The Core Issue */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-amber-800 font-bold">
                  Official Technical Brief
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  Problem Statement Explained: The Core Issue
                </h2>
                <p className="text-sm text-slate-600 mt-2 max-w-4xl leading-relaxed">
                  Procurement officials in government departments (CPWD, State PWDs, NHAI), public sector enterprises, and private organizations need to prepare accurate technical specifications for tenders. These specifications must reference appropriate Indian Standards (IS), but officials face severe systemic hurdles.
                </p>
              </div>

              {/* Challenge vs Impact Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 text-slate-800 uppercase tracking-wider font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5 sm:p-4 text-amber-800">Challenge</th>
                      <th className="p-3.5 sm:p-4">Operational & Legal Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 sm:p-4 font-bold text-slate-900">Large number of standards</td>
                      <td className="p-3.5 sm:p-4">Difficult to identify which standard applies to a product among 22,000+ active Indian Standards.</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 sm:p-4 font-bold text-slate-900">Overlapping scopes</td>
                      <td className="p-3.5 sm:p-4">Multiple standards may cover similar products/services (e.g. various grades of structural steel tubes).</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 sm:p-4 font-bold text-slate-900">Frequent revisions & amendments</td>
                      <td className="p-3.5 sm:p-4">Standards are updated continuously; outdated versions and superseded test methods are mistakenly referenced in tender documents.</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 sm:p-4 font-bold text-slate-900">Related standards omitted</td>
                      <td className="p-3.5 sm:p-4">Officials miss normative references, allied product standards, and mandatory test method standards.</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 sm:p-4 font-bold text-slate-900">Manual, error-prone process</td>
                      <td className="p-3.5 sm:p-4">Time-consuming manual drafting leads to disputes, arbitration, and contractor non-compliance.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Real World Consequences */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-red-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  Real-World Consequences of Inadequate Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-slate-700">
                  <div className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">❌</span>
                    <span>Tender specs omit relevant standards</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">❌</span>
                    <span>Outdated standard versions referenced</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">❌</span>
                    <span>Incomplete technical requirements</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">❌</span>
                    <span>Ambiguity in procurement contracts</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">❌</span>
                    <span>Reduced product quality & safety risks</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">❌</span>
                    <span>Procurement disputes & litigation</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Architecture Overview Diagram */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-amber-800 font-bold">
                  System Architecture
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  How the Recommendation Engine Works
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  End-to-end data pipeline from natural language input to verified standard ecosystems.
                </p>
              </div>

              {/* Visual Flow Stages */}
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-amber-800 uppercase">Stage 1: Input Ingestion</span>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">Product Description / Tender Document</h4>
                    <p className="text-xs text-slate-500">Accepts text in multiple Indian languages (English, Hindi, regional), technical tender clauses, and document uploads.</p>
                  </div>
                  <span className="px-3 py-1 rounded bg-white text-xs text-slate-700 font-mono border border-slate-200 self-start md:self-auto shadow-2xs">
                    Free Text / Multi-Format
                  </span>
                </div>

                <div className="flex justify-center text-slate-400">
                  <ChevronRight className="w-6 h-6 rotate-90" />
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-amber-800 uppercase">Stage 2: NLP & Semantic Layer</span>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">Semantic Understanding & Entity Extraction</h4>
                    <p className="text-xs text-slate-500">Language detection, transliteration normalization, material taxonomy extraction, and semantic contextual reasoning (not just keywords).</p>
                  </div>
                  <span className="px-3 py-1 rounded bg-amber-50 text-xs text-amber-800 font-mono border border-amber-200 self-start md:self-auto font-semibold">
                    Gemini 3.8 Flash + Local NLP
                  </span>
                </div>

                <div className="flex justify-center text-slate-400">
                  <ChevronRight className="w-6 h-6 rotate-90" />
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-amber-800 uppercase">Stage 3: Knowledge Base & Relationship Graph</span>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">Indian Standards (IS) Metadata Repository</h4>
                    <p className="text-xs text-slate-500">Maintains normative cross-references, allied standards, latest editions, active amendments (A1, A2), and mandatory Quality Control Orders (QCO).</p>
                  </div>
                  <span className="px-3 py-1 rounded bg-emerald-50 text-xs text-emerald-800 font-mono border border-emerald-200 self-start md:self-auto font-semibold">
                    22,000+ Standards Graph
                  </span>
                </div>

                <div className="flex justify-center text-slate-400">
                  <ChevronRight className="w-6 h-6 rotate-90" />
                </div>

                <div className="bg-amber-50/70 border border-amber-300 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-amber-800 uppercase">Stage 4: Recommendation & Synthesis</span>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">Comprehensive Standard Recommendations</h4>
                    <p className="text-xs text-slate-600">Ranked primary standards, normative references, test methods, safety codes, mandatory certifications (BIS/CRS), and auto-generated tender clauses.</p>
                  </div>
                  <span className="px-3 py-1 rounded bg-amber-500 text-slate-950 font-bold text-xs self-start md:self-auto shadow-2xs">
                    Export Ready Schedule
                  </span>
                </div>
              </div>
            </div>

            {/* Key Components Breakdown */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900">4 Key Technical Components</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                    <Cpu className="w-4 h-4" />
                    <span>1. Natural Language Processing (NLP)</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    <li>• Understands product descriptions in plain natural language.</li>
                    <li>• Extracts key technical intent without relying on rigid keywords.</li>
                    <li>• Handles multilingual queries in English, Hindi, and Indian regional languages.</li>
                    <li>• <em>Example:</em> "Water supply pipes made of PVC" → recognizes pipes, rigid PVC, drinking water conveyance.</li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>2. Semantic Understanding</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    <li>• Goes beyond surface keyword matching to understand engineering context.</li>
                    <li>• Recognizes that "stainless steel utensils" relates to food-contact safety and toxic heavy metal limits.</li>
                    <li>• Connects product features to relevant statutory standards.</li>
                    <li>• <em>Example:</em> Input "Food-grade stainless steel containers" → maps to IS 7000 (Tableware) and IS 5522 (Utensil Sheets).</li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                    <BookOpen className="w-4 h-4" />
                    <span>3. Knowledge Base / Database</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    <li>• Maintains comprehensive records: Standard ID, Title, Scope, Edition.</li>
                    <li>• Hierarchical relationships: Normative References, Allied Standards, Test Methods.</li>
                    <li>• Safety codes and active amendment tracking (A1, A2).</li>
                    <li>• Mappings for compulsory certifications: BIS ISI, CRS, Hallmarking.</li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                    <Award className="w-4 h-4" />
                    <span>4. Recommendation & Ranking Engine</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    <li>• Ranks candidate standards by semantic relevance score (0-100%).</li>
                    <li>• Prioritizes the latest revision year and active amendments.</li>
                    <li>• Identifies mandatory Quality Control Orders (QCO) issued by Central Ministries.</li>
                    <li>• Automatically formats formal tender clauses ready for GeM or CPWD NIT schedules.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Why This Solution is Needed (Benefit Comparison) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900">Why This Solution is Needed</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 text-slate-800 uppercase tracking-wider font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5 sm:p-4 text-red-700">Current Problem</th>
                      <th className="p-3.5 sm:p-4 text-emerald-700">STANDARD X Solution Benefit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 sm:p-4">Manual, time-consuming standard identification</td>
                      <td className="p-3.5 sm:p-4 font-semibold text-emerald-800">⚡ Automated, instant semantic recommendations in seconds</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 sm:p-4">Missed standards leading to contractual disputes</td>
                      <td className="p-3.5 sm:p-4 font-semibold text-emerald-800">✅ Complete standard ecosystem identified (normative, test, safety)</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 sm:p-4">Outdated versions & withdrawn standards referenced</td>
                      <td className="p-3.5 sm:p-4 font-semibold text-emerald-800">🔄 Always references the latest version and valid amendments</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 sm:p-4">Incomplete technical specifications</td>
                      <td className="p-3.5 sm:p-4 font-semibold text-emerald-800">📋 Comprehensive specification clause generation</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 sm:p-4">Quality issues & adulteration in procured stock</td>
                      <td className="p-3.5 sm:p-4 font-semibold text-emerald-800">🏆 Strict adherence to mandatory BIS QCO certification</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 sm:p-4">Tender preparation delays</td>
                      <td className="p-3.5 sm:p-4 font-semibold text-emerald-800">⏱️ Speeds up tender scheduling by 90%</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 sm:p-4">Knowledge gaps among junior procurement officials</td>
                      <td className="p-3.5 sm:p-4 font-semibold text-emerald-800">🧠 AI ensures national best practices and statutory rigor</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 sm:p-4">Multilingual needs not supported in existing tools</td>
                      <td className="p-3.5 sm:p-4 font-semibold text-emerald-800">🌍 Full support for Hindi and Indian regional languages</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SAVED TENDER SPECIFICATION DRAFTS */}
        {activeTab === 'drafts' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-600" />
                    Official Tender Specification Drafts & Audit Logs
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Timestamped records of generated specification clauses compiled under Officer Badge {officer.badgeNumber}.
                  </p>
                </div>
                <span className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs font-mono font-bold text-amber-800">
                  {savedDrafts.length} Saved Records
                </span>
              </div>

              {savedDrafts.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <FileText className="w-12 h-12 text-slate-400 mx-auto" />
                  <h3 className="text-base font-bold text-slate-700">No Saved Tender Drafts Yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Use the AI Recommendation Engine to analyze a procurement requirement, then click "Save to Drafts" to create an audit record.
                  </p>
                  <button
                    onClick={() => setActiveTab('engine')}
                    className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <span>Go to Recommendation Engine</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedDrafts.map((draft) => (
                    <div
                      key={draft.id}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 hover:border-amber-400 transition-colors shadow-2xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                              {draft.status}
                            </span>
                            <span className="text-[11px] font-mono text-slate-500">
                              {new Date(draft.createdAt).toLocaleString('en-IN')}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-slate-900 mt-1">{draft.title}</h4>
                          <p className="text-xs text-slate-600 mt-0.5">Requirement: "{draft.query}"</p>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <button
                            onClick={() => {
                              setRecommendationResult(draft.recommendation);
                              setActiveTab('engine');
                            }}
                            className="px-3 py-1.5 rounded bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-300 transition-colors cursor-pointer shadow-2xs"
                          >
                            Open in Engine
                          </button>
                          <button
                            onClick={() => handleDownloadPdf(draft.recommendation)}
                            className="p-1.5 rounded bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-300 transition-colors cursor-pointer shadow-2xs"
                            title="Download Tender Appendix PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-3 border border-slate-200 font-mono text-[11px] text-slate-600 truncate">
                        {draft.recommendation.tenderDraftClause}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {/* Extracted Tender Document Specifications Modal */}
        {showExtractedModal && uploadedTenderDoc && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-100 border border-amber-300 text-amber-800">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Extracted Tender Clauses & Parameters
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      {uploadedTenderDoc.fileName} • {uploadedTenderDoc.fileSize}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowExtractedModal(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
                {/* Authority & NIT */}
                <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono font-bold text-amber-800 text-xs">
                      {uploadedTenderDoc.extractedRequirement.tenderId || 'NIT No: Standard GeM / CPWD Reference'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px] border border-amber-300 uppercase">
                      {uploadedTenderDoc.extractedRequirement.category} Work
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {uploadedTenderDoc.extractedRequirement.projectName}
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    {uploadedTenderDoc.extractedRequirement.description}
                  </p>
                  <div className="text-[11px] text-slate-500 pt-1">
                    <span className="font-semibold text-slate-700">Authority: </span>
                    {uploadedTenderDoc.extractedRequirement.authority} • {uploadedTenderDoc.extractedRequirement.stateCity}
                  </div>
                </div>

                {/* Quality Specifications */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <BadgeCheck className="w-4 h-4 text-amber-600" />
                    Quality & Engineering Specifications:
                  </h4>
                  <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 bg-slate-50/50 overflow-hidden">
                    <div className="p-3 flex justify-between gap-4">
                      <span className="font-medium text-slate-500">Structural Concrete:</span>
                      <span className="font-semibold text-slate-900 text-right">
                        {uploadedTenderDoc.extractedRequirement.qualitySpecifications.concreteGrade}
                      </span>
                    </div>
                    <div className="p-3 flex justify-between gap-4">
                      <span className="font-medium text-slate-500">Reinforcement Rebar:</span>
                      <span className="font-semibold text-slate-900 text-right">
                        {uploadedTenderDoc.extractedRequirement.qualitySpecifications.rebarGrade}
                      </span>
                    </div>
                    <div className="p-3 flex justify-between gap-4">
                      <span className="font-medium text-slate-500">Cement Grade:</span>
                      <span className="font-semibold text-slate-900 text-right">
                        {uploadedTenderDoc.extractedRequirement.qualitySpecifications.cementType}
                      </span>
                    </div>
                    <div className="p-3 flex justify-between gap-4">
                      <span className="font-medium text-slate-500">Coarse Aggregates:</span>
                      <span className="font-semibold text-slate-900 text-right">
                        {uploadedTenderDoc.extractedRequirement.qualitySpecifications.aggregatesSpec}
                      </span>
                    </div>
                    <div className="p-3 flex justify-between gap-4">
                      <span className="font-medium text-slate-500">Sand / Fine Aggregates:</span>
                      <span className="font-semibold text-slate-900 text-right">
                        {uploadedTenderDoc.extractedRequirement.qualitySpecifications.sandSpec}
                      </span>
                    </div>
                    {uploadedTenderDoc.extractedRequirement.qualitySpecifications.bitumenGrade && (
                      <div className="p-3 flex justify-between gap-4">
                        <span className="font-medium text-slate-500">Bitumen Grade:</span>
                        <span className="font-semibold text-slate-900 text-right">
                          {uploadedTenderDoc.extractedRequirement.qualitySpecifications.bitumenGrade}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* BOQ Highlights */}
                {uploadedTenderDoc.extractedRequirement.boqHighlights && uploadedTenderDoc.extractedRequirement.boqHighlights.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-amber-600" />
                      Extracted Bill of Quantities (BOQ) Items:
                    </h4>
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                          <tr>
                            <th className="p-2.5">Item</th>
                            <th className="p-2.5">Specification Grade</th>
                            <th className="p-2.5 text-right">Quantity</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {uploadedTenderDoc.extractedRequirement.boqHighlights.map((boq, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="p-2.5 font-semibold text-slate-900">{boq.item}</td>
                              <td className="p-2.5 text-slate-600">{boq.specGrade}</td>
                              <td className="p-2.5 text-right font-mono font-semibold text-amber-800">
                                {boq.approxQuantity} {boq.unit}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Materials & Standards Verification Table */}
                {tenderMaterials.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-amber-600" />
                        Tender Required Materials & Verification Links ({tenderMaterials.length} Items):
                      </h4>
                      <button
                        type="button"
                        onClick={handleDownloadMaterialsSchedulePdf}
                        className="text-amber-800 hover:text-amber-900 font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </button>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                          <tr>
                            <th className="p-2.5">Required Product</th>
                            <th className="p-2.5">Indian Standard</th>
                            <th className="p-2.5">Specification Grade</th>
                            <th className="p-2.5 text-right">Verification Link</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white text-[11px]">
                          {tenderMaterials.map((mat, idx) => (
                            <tr key={mat.id} className="hover:bg-slate-50">
                              <td className="p-2.5 font-semibold text-slate-900">
                                #{idx + 1} {mat.productName}
                              </td>
                              <td className="p-2.5 font-mono font-bold text-amber-800">
                                {mat.standardCode}
                              </td>
                              <td className="p-2.5 text-slate-600">
                                {mat.requiredGradeOrSpec}
                              </td>
                              <td className="p-2.5 text-right">
                                <a
                                  href={mat.certificationVerificationUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-sky-700 hover:text-sky-900 font-bold hover:underline"
                                  title={`Verify Official BIS Certification for ${mat.standardCode}`}
                                >
                                  <span>Verify BIS ({mat.standardCode})</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Raw Document Snippet */}
                {uploadedTenderDoc.rawTextSnippet && (
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      Document Text Snippet:
                    </h4>
                    <pre className="p-3 rounded-lg bg-slate-900 text-slate-300 font-mono text-[11px] whitespace-pre-wrap max-h-40 overflow-y-auto leading-relaxed border border-slate-800">
                      {uploadedTenderDoc.rawTextSnippet}
                    </pre>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-200 flex items-center justify-end gap-2 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setShowExtractedModal(false)}
                  className="px-4 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-300 cursor-pointer shadow-2xs"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowExtractedModal(false);
                    handleRunAnalysis();
                  }}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm shadow-amber-500/20"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Map Indian Standards Now</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Standard Deep-Dive & Clauses Inspector Modal */}
        {selectedStandardToInspect && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
              {/* Modal Header Banner */}
              <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30 shrink-0 mt-0.5">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-mono font-bold px-2.5 py-0.5 rounded bg-amber-400 text-slate-950">
                        {selectedStandardToInspect.standard.code}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded bg-slate-800 text-amber-300 font-semibold border border-amber-400/40">
                        {selectedStandardToInspect.standard.role}
                      </span>
                      {selectedStandardToInspect.standard.isMandatoryQco && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold border border-red-500/30 uppercase tracking-wide">
                          Statutory Mandatory QCO
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white pt-1">
                      {selectedStandardToInspect.standard.title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Material Context: <span className="text-slate-200 font-semibold">{selectedStandardToInspect.productName}</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedStandardToInspect(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0 ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
                {/* Engineering Scope & Purpose */}
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs uppercase tracking-wider">
                    <Info className="w-4 h-4 text-amber-700" />
                    Engineering Scope & Role in Tender Procurement:
                  </div>
                  <p className="text-slate-800 leading-relaxed text-xs font-normal">
                    {selectedStandardToInspect.standard.purpose}
                  </p>
                </div>

                {/* Key Clauses & Tables Breakdown */}
                {selectedStandardToInspect.standard.keyClauses && selectedStandardToInspect.standard.keyClauses.length > 0 && (
                  <div className="space-y-2.5">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-amber-700" />
                      Critical Clauses & Normative Tables to Inspect:
                    </h4>
                    <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white overflow-hidden shadow-2xs">
                      {selectedStandardToInspect.standard.keyClauses.map((clause, cIdx) => (
                        <div key={cIdx} className="p-3 flex items-start gap-2.5 hover:bg-slate-50 transition-colors">
                          <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-amber-300">
                            {cIdx + 1}
                          </span>
                          <p className="text-slate-800 text-xs leading-relaxed font-medium">
                            {clause}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Acceptance Benchmarks & Testing Parameters */}
                {selectedStandardToInspect.standard.testParametersOrAcceptance && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <BadgeCheck className="w-4 h-4 text-emerald-600" />
                      Mandatory Acceptance Thresholds & Test Parameters:
                    </h4>
                    <p className="text-slate-800 font-mono text-[11px] leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                      {selectedStandardToInspect.standard.testParametersOrAcceptance}
                    </p>
                  </div>
                )}

                {/* Official Verification Links Hub */}
                <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Globe2 className="w-4 h-4 text-sky-700" />
                      Direct Bureau of Indian Standards (BIS) Verification:
                    </span>
                    <span className="text-[10px] text-sky-700 font-semibold">Live Government Portals</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedStandardToInspect.standard.bisUrl && (
                      <a
                        href={selectedStandardToInspect.standard.bisUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-lg bg-white hover:bg-sky-100/60 border border-sky-200 text-sky-800 hover:text-sky-950 font-bold text-xs flex items-center justify-between transition-colors shadow-2xs group cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <ExternalLink className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
                          <span>BIS Know Your Standards Portal</span>
                        </div>
                        <span className="text-[10px] font-mono text-sky-600">IS Details ↗</span>
                      </a>
                    )}

                    <a
                      href={getManakonlineSearchUrl(selectedStandardToInspect.standard.code)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-white hover:bg-sky-100/60 border border-sky-200 text-sky-800 hover:text-sky-950 font-bold text-xs flex items-center justify-between transition-colors shadow-2xs group cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Search className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
                        <span>Search Active Licensees</span>
                      </div>
                      <span className="text-[10px] font-mono text-sky-600">Manakonline ↗</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
                <button
                  type="button"
                  onClick={() => {
                    const text = `${selectedStandardToInspect.standard.code}: ${selectedStandardToInspect.standard.title}. Requirement for ${selectedStandardToInspect.productName}: ${selectedStandardToInspect.standard.purpose} Benchmark: ${selectedStandardToInspect.standard.testParametersOrAcceptance || ''}`;
                    handleCopyClause(text, selectedStandardToInspect.standard.code);
                  }}
                  className="px-3 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-300 flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Standard Reference</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedStandardToInspect(null)}
                    className="px-4 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-300 cursor-pointer shadow-2xs"
                  >
                    Close
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAnalyzeSpecificStandard(selectedStandardToInspect.standard, selectedStandardToInspect.productName)}
                    className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm shadow-amber-500/20 transition-all hover:scale-[1.02]"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze This Standard in Engine ↗</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

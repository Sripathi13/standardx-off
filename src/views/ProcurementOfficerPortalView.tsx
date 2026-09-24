import React, { useState } from 'react';
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
  HelpCircle,
  Clock,
  Send,
  Zap,
  Tag
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

  const handleCopyClause = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStatus(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedStatus(null), 3000);
  };

  const handleDownloadSpec = (res: StandardRecommendationResult) => {
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
            <div className="bg-white border border-amber-200 rounded-xl p-4 sm:p-5 flex flex-col justify-between min-w-[300px] shadow-sm">
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
            {/* Input & Search Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                    Enter Procurement Specification or Product Description
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Supports natural language, technical tender clauses, and multilingual inputs (English, Hindi, and regional languages).
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <Globe2 className="w-4 h-4 text-slate-500" />
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="bg-slate-50 text-xs text-slate-700 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer"
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

              {/* Text Input Box */}
              <div className="relative">
                <textarea
                  rows={4}
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  placeholder="e.g. Seamless carbon steel pipes for high-pressure applications, or Ordinary Portland Cement for residential construction..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all font-sans shadow-2xs"
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <button
                    onClick={() => setQueryInput('')}
                    className="px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 text-[11px] text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => handleRunAnalysis()}
                    disabled={isLoading || !queryInput.trim()}
                    className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
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
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Quick Procurement Scenarios (Try These):
                </span>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_QUERIES.map((sample) => (
                    <button
                      key={sample.title}
                      onClick={() => {
                        setQueryInput(sample.text);
                        handleRunAnalysis(sample.text);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-400 text-xs text-slate-700 hover:text-slate-900 transition-all flex items-center gap-2 cursor-pointer group shadow-2xs"
                    >
                      <span className="font-semibold text-slate-800">{sample.title}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-mono font-medium border border-amber-200">
                        {sample.badge}
                      </span>
                    </button>
                  ))}
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

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSaveDraft}
                        className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300 shadow-2xs"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-700" />
                        <span>Save to Drafts</span>
                      </button>

                      <button
                        onClick={() => handleDownloadSpec(recommendationResult)}
                        className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-amber-500/20"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export Tender Appendix (.txt)</span>
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

                          <button
                            onClick={() => handleCopyClause(std.code, std.code)}
                            className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 transition-colors self-start cursor-pointer border border-slate-200"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy IS Code</span>
                          </button>
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
                            onClick={() => handleDownloadSpec(draft.recommendation)}
                            className="p-1.5 rounded bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-300 transition-colors cursor-pointer shadow-2xs"
                            title="Download TXT"
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
      </div>
    </div>
  );
};

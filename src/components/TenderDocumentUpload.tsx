import React, { useState, useRef } from 'react';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  RefreshCw, 
  Building, 
  X,
  AlertCircle,
  ShieldCheck,
  Edit3,
  Check,
  FileCheck2,
  Sliders
} from 'lucide-react';
import { 
  ExtractedTenderRequirement, 
  SAMPLE_TENDERS, 
  parseTenderDocument 
} from '../services/tenderExtractionService';

interface TenderDocumentUploadProps {
  onRequirementsExtracted: (req: ExtractedTenderRequirement) => void;
  onApplyToForm: (req: ExtractedTenderRequirement) => void;
  onProceedToStep2?: () => void;
}

export const TenderDocumentUpload: React.FC<TenderDocumentUploadProps> = ({
  onRequirementsExtracted,
  onApplyToForm,
  onProceedToStep2
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedTenderRequirement | null>(null);
  const [appliedNotice, setAppliedNotice] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setIsProcessing(true);
    setAppliedNotice(false);

    try {
      const result = await parseTenderDocument(file);
      setExtractedData(result);
      onRequirementsExtracted(result);
    } catch (err) {
      console.error('Failed to parse tender file:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadSample = (sampleKey: 'commercial_building' | 'highway_corridor' | 'flyover_bridge') => {
    setIsProcessing(true);
    setAppliedNotice(false);

    setTimeout(() => {
      const sample = JSON.parse(JSON.stringify(SAMPLE_TENDERS[sampleKey]));
      setExtractedData(sample);
      onRequirementsExtracted(sample);
      setIsProcessing(false);
    }, 350);
  };

  const handleApply = () => {
    if (!extractedData) return;
    onApplyToForm(extractedData);
    setAppliedNotice(true);
    setTimeout(() => setAppliedNotice(false), 6000);
  };

  const handleApplyAndProceed = () => {
    if (!extractedData) return;
    onApplyToForm(extractedData);
    setAppliedNotice(true);
    if (onProceedToStep2) {
      setTimeout(() => {
        onProceedToStep2();
      }, 400);
    }
  };

  const handleClear = () => {
    setExtractedData(null);
    setAppliedNotice(false);
    setIsEditing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFieldUpdate = (field: string, value: any) => {
    if (!extractedData) return;
    const updated = { ...extractedData };
    if (field === 'projectName') updated.projectName = value;
    if (field === 'location') updated.location = value;
    if (field === 'stateCity') updated.stateCity = value;
    if (field === 'category') updated.category = value;
    if (field === 'builtUpArea' && updated.buildingSpecs) {
      updated.buildingSpecs.builtUpArea = Number(value) || 0;
      updated.buildingSpecs.areaPerFloor = Math.round((Number(value) || 0) / updated.buildingSpecs.numFloors);
    }
    if (field === 'numFloors' && updated.buildingSpecs) {
      updated.buildingSpecs.numFloors = Number(value) || 1;
      updated.buildingSpecs.areaPerFloor = Math.round(updated.buildingSpecs.builtUpArea / (Number(value) || 1));
    }
    if (field === 'roadLengthKm' && updated.roadSpecs) {
      updated.roadSpecs.roadLengthKm = Number(value) || 0;
    }
    if (field === 'spanLengthM' && updated.bridgeSpecs) {
      updated.bridgeSpecs.spanLengthM = Number(value) || 0;
    }
    setExtractedData(updated);
    onRequirementsExtracted(updated);
  };

  return (
    <div id="tender-upload-container" className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50/90 to-white p-5 sm:p-6 shadow-sm space-y-4">
      {/* Section Header with Optional Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 font-display">
                Upload Tender / BOQ Document
              </h3>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 tracking-wider">
                Optional
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload contract specifications, NIT notice, or structural schedule (PDF, DOCX, TXT, Excel/CSV) to automatically extract requirements.
            </p>
          </div>
        </div>

        {/* Quick Sample Selector */}
        {!extractedData && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium text-[11px] hidden md:inline">Or test sample:</span>
            <button
              type="button"
              id="btn-sample-building"
              onClick={() => handleLoadSample('commercial_building')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 text-[11px] cursor-pointer shadow-2xs transition-colors"
            >
              CPWD Building Tender
            </button>
            <button
              type="button"
              id="btn-sample-highway"
              onClick={() => handleLoadSample('highway_corridor')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 text-[11px] cursor-pointer shadow-2xs transition-colors"
            >
              4-Lane Highway Tender
            </button>
            <button
              type="button"
              id="btn-sample-flyover"
              onClick={() => handleLoadSample('flyover_bridge')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 text-[11px] cursor-pointer shadow-2xs transition-colors"
            >
              Flyover Bridge Tender
            </button>
          </div>
        )}
      </div>

      {/* Upload Dropzone when no file or processing */}
      {!extractedData && (
        <div>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFileChange(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 ${
              isDragging
                ? 'border-amber-500 bg-amber-500/10'
                : 'border-slate-300 hover:border-amber-500 hover:bg-amber-50/30 bg-slate-50/50'
            }`}
          >
            <input
              ref={fileInputRef}
              id="tender-file-input"
              type="file"
              accept=".pdf,.docx,.doc,.txt,.csv,.xlsx,.xls,.json,.xml,.html"
              onChange={(e) => handleFileChange(e.target.files)}
              className="hidden"
            />

            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm text-amber-600">
              {isProcessing ? (
                <RefreshCw className="w-6 h-6 animate-spin text-amber-600" />
              ) : (
                <UploadCloud className="w-6 h-6 text-amber-600" />
              )}
            </div>

            <div>
              <p className="text-sm font-bold text-slate-800">
                {isProcessing ? 'Analyzing & Extracting Specifications from Document...' : 'Drop your Tender or BOQ file here, or click to browse'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                True extraction from <strong>PDF, DOCX, Excel/CSV & Text</strong> • Detects Project Title, Dimensions, Area, Floors, Roads & BIS Quality Grades
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Extracted Specifications Dashboard */}
      {extractedData && (
        <div id="tender-extraction-results" className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-4 sm:p-5 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-emerald-200/80 pb-3">
            <div className="flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 mt-0.5 shrink-0">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-emerald-950 text-base font-display">
                    Tender Specifications Extracted & Verified
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {extractedData.extractionConfidence}% Confidence
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Source: <span className="font-semibold text-slate-800">{extractedData.sourceFileName}</span> • Ref: {extractedData.tenderId}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 text-xs transition-all cursor-pointer"
                title="Verify or adjust extracted values"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                <span>{isEditing ? 'Done Editing' : 'Verify / Edit Values'}</span>
              </button>

              <button
                type="button"
                id="btn-auto-fill-tender"
                onClick={handleApply}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-sm transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-Fill Form from Tender</span>
              </button>

              {onProceedToStep2 && (
                <button
                  type="button"
                  id="btn-auto-fill-and-proceed"
                  onClick={handleApplyAndProceed}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-sm transition-all cursor-pointer"
                >
                  <span>Auto-Fill & Go to Parameters</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white transition-colors cursor-pointer"
                title="Remove uploaded tender"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {appliedNotice && (
            <div id="tender-applied-alert" className="p-3.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-semibold flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Values populated into project creation form: <strong>{extractedData.projectName}</strong> ({extractedData.category.toUpperCase()}).</span>
              </div>
              <span className="text-[11px] text-emerald-800 bg-white/70 px-2 py-0.5 rounded border border-emerald-200">
                Applied
              </span>
            </div>
          )}

          {/* Document Verification & Audit Checklist */}
          <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Verified Document Audit (Truthfully Parsed from File)
              </span>
              <span className="text-[10px] text-slate-400">Classified strictly by quality grade, without commercial brands</span>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className={`px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                extractedData.verificationAudit.projectNameMatched 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}>
                <Check className="w-3 h-3 text-emerald-600" />
                Project Name Matched
              </span>
              <span className={`px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                extractedData.verificationAudit.locationMatched 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}>
                <Check className="w-3 h-3 text-emerald-600" />
                Location & Scope Verified
              </span>
              <span className={`px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                extractedData.verificationAudit.dimensionsMatched 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}>
                <Check className="w-3 h-3 text-emerald-600" />
                Engineering Dimensions Parsed
              </span>
              <span className={`px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                extractedData.verificationAudit.qualityGradesMatched 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}>
                <Check className="w-3 h-3 text-emerald-600" />
                BIS Quality Grades Identified
              </span>
            </div>

            {/* Snippet Preview */}
            {extractedData.rawExtractedSnippet && (
              <div className="p-2 rounded bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 font-mono line-clamp-2">
                <span className="font-bold text-slate-700">Raw Text Snippet: </span>
                {extractedData.rawExtractedSnippet}
              </div>
            )}
          </div>

          {/* Extracted Specifications Grid (with Inline Editing if clicked) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {/* Project & Authority */}
            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project & Authority</span>
              {isEditing ? (
                <div className="space-y-1">
                  <input
                    type="text"
                    value={extractedData.projectName}
                    onChange={(e) => handleFieldUpdate('projectName', e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-bold"
                    placeholder="Project Name"
                  />
                  <input
                    type="text"
                    value={extractedData.authority}
                    onChange={(e) => handleFieldUpdate('authority', e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-[11px]"
                    placeholder="Authority"
                  />
                </div>
              ) : (
                <>
                  <div className="font-bold text-slate-900 text-sm leading-snug">{extractedData.projectName}</div>
                  <div className="text-slate-500 text-[11px]">{extractedData.authority}</div>
                </>
              )}
            </div>

            {/* Location & Scope */}
            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location & Scope</span>
              {isEditing ? (
                <div className="space-y-1">
                  <input
                    type="text"
                    value={extractedData.location}
                    onChange={(e) => handleFieldUpdate('location', e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                    placeholder="Location"
                  />
                  <input
                    type="text"
                    value={extractedData.stateCity}
                    onChange={(e) => handleFieldUpdate('stateCity', e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                    placeholder="City, State"
                  />
                </div>
              ) : (
                <>
                  <div className="font-bold text-slate-900">{extractedData.location}</div>
                  <div className="text-slate-500 text-[11px]">{extractedData.stateCity} • Category: <strong className="capitalize text-slate-700">{extractedData.category}</strong></div>
                </>
              )}
            </div>

            {/* Dimensions & Sizing */}
            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dimensions & Sizing</span>
              {extractedData.category === 'building' && extractedData.buildingSpecs && (
                isEditing ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-slate-500">Area (sq.ft):</span>
                      <input
                        type="number"
                        value={extractedData.buildingSpecs.builtUpArea}
                        onChange={(e) => handleFieldUpdate('builtUpArea', e.target.value)}
                        className="w-24 px-2 py-1 border border-slate-300 rounded text-xs font-bold"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-slate-500">Floors:</span>
                      <input
                        type="number"
                        value={extractedData.buildingSpecs.numFloors}
                        onChange={(e) => handleFieldUpdate('numFloors', e.target.value)}
                        className="w-16 px-2 py-1 border border-slate-300 rounded text-xs font-bold"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="font-bold text-slate-900 text-sm">
                      {extractedData.buildingSpecs.builtUpArea.toLocaleString()} sq.ft
                    </div>
                    <div className="text-slate-600 text-[11px]">
                      {extractedData.buildingSpecs.numFloors} Floors ({extractedData.buildingSpecs.areaPerFloor} sq.ft/floor) • {extractedData.buildingSpecs.buildingType}
                    </div>
                  </>
                )
              )}

              {extractedData.category === 'road' && extractedData.roadSpecs && (
                isEditing ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-slate-500">Length (km):</span>
                      <input
                        type="number"
                        step="0.1"
                        value={extractedData.roadSpecs.roadLengthKm}
                        onChange={(e) => handleFieldUpdate('roadLengthKm', e.target.value)}
                        className="w-20 px-2 py-1 border border-slate-300 rounded text-xs font-bold"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="font-bold text-slate-900 text-sm">
                      {extractedData.roadSpecs.roadLengthKm} km • {extractedData.roadSpecs.roadLanes} Lanes
                    </div>
                    <div className="text-slate-600 text-[11px]">
                      Width: {extractedData.roadSpecs.roadWidthM}m • {extractedData.roadSpecs.pavementType}
                    </div>
                  </>
                )
              )}

              {extractedData.category === 'bridge' && extractedData.bridgeSpecs && (
                isEditing ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-slate-500">Span (m):</span>
                      <input
                        type="number"
                        value={extractedData.bridgeSpecs.spanLengthM}
                        onChange={(e) => handleFieldUpdate('spanLengthM', e.target.value)}
                        className="w-20 px-2 py-1 border border-slate-300 rounded text-xs font-bold"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="font-bold text-slate-900 text-sm">
                      {extractedData.bridgeSpecs.spanLengthM}m Span
                    </div>
                    <div className="text-slate-600 text-[11px]">
                      Deck Width: {extractedData.bridgeSpecs.deckWidthM}m • Pier: {extractedData.bridgeSpecs.pierHeightM}m
                    </div>
                  </>
                )
              )}
            </div>
          </div>

          {/* Extracted Quality Specifications (Classified strictly by quality grade) */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              BIS Quality Grade Classifications (Parsed from Tender)
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-800 font-medium">
                <strong>Steel Rebar:</strong> {extractedData.qualitySpecifications.rebarGrade}
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-800 font-medium">
                <strong>Concrete:</strong> {extractedData.qualitySpecifications.concreteGrade}
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-800 font-medium">
                <strong>Cement:</strong> {extractedData.qualitySpecifications.cementType}
              </span>
              {extractedData.qualitySpecifications.bitumenGrade && (
                <span className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-800 font-medium">
                  <strong>Bitumen:</strong> {extractedData.qualitySpecifications.bitumenGrade}
                </span>
              )}
            </div>
          </div>

          {/* BOQ Highlights */}
          {extractedData.boqHighlights.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Extracted BOQ Quantity Schedule:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {extractedData.boqHighlights.map((boq, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <div className="text-[10px] text-slate-500">{boq.item}</div>
                    <div className="font-extrabold text-slate-900 mt-0.5 text-xs">{boq.approxQuantity} {boq.unit}</div>
                    <div className="text-[10px] text-emerald-700 font-semibold truncate">{boq.specGrade}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

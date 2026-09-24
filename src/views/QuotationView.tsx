import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { 
  Printer, 
  Download, 
  ArrowLeft, 
  ShieldCheck, 
  Share2, 
  AlertTriangle, 
  Building2, 
  Calendar, 
  MapPin, 
  FileText,
  CheckCircle2,
  Phone,
  Mail,
  Scale,
  RefreshCw,
  Check
} from 'lucide-react';
import { QuotationRecord } from '../types';
import { sanitizeProductName, sanitizeQualitySpec } from '../utils/qualitySanitizer';

interface QuotationViewProps {
  quotation: QuotationRecord | null;
  onNavigate: (view: string) => void;
}

export const QuotationView: React.FC<QuotationViewProps> = ({
  quotation,
  onNavigate
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccessNotice, setPdfSuccessNotice] = useState<string | null>(null);

  if (!quotation) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
          <FileText className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-display text-slate-900">
          No Quotation Generated Yet
        </h2>
        <p className="text-slate-500 text-xs max-w-sm mx-auto">
          Add materials to your cart and click "Generate Quotation" to see the formal printable bill of quantities.
        </p>
        <button
          onClick={() => onNavigate('cart')}
          className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
        >
          View Material Cart
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleSaveAsPdf = async () => {
    const element = document.getElementById('printable-quotation-sheet');
    if (!element) return;

    setIsGeneratingPdf(true);
    setPdfSuccessNotice(null);

    try {
      // High-resolution canvas rendering with modern CSS & color support
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1200,
        onclone: (clonedDoc) => {
          const printable = clonedDoc.getElementById('printable-quotation-sheet');
          if (printable) {
            printable.style.backgroundColor = '#ffffff';
            printable.style.color = '#0f172a';
          }
        }
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      // Add subsequent pages if document exceeds single A4 page
      while (heightLeft > 5) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      const fileName = `STANDARD_X_Quotation_${quotation.quotationNumber.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
      pdf.save(fileName);

      setPdfSuccessNotice(`PDF downloaded successfully: ${fileName}`);
      setTimeout(() => setPdfSuccessNotice(null), 5000);
    } catch (error) {
      console.error('Failed to generate PDF via html2canvas:', error);
      // Fallback: trigger system print/save dialog
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    alert(`Quotation #${quotation.quotationNumber} reference link copied to clipboard.`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Action Bar (hidden on print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 text-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('cart')}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
            title="Back to Cart"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-[11px] text-amber-800 font-bold uppercase tracking-wider">
              Formal Document Preview
            </div>
            <div className="text-sm font-bold text-slate-900">
              Quotation Reference: {quotation.quotationNumber}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleShare}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          <button
            id="btn-print-quotation"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Print through system print dialog"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print</span>
          </button>

          <button
            id="btn-save-pdf"
            onClick={handleSaveAsPdf}
            disabled={isGeneratingPdf}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-60"
            title="Generate and download actual PDF file to disk"
          >
            {isGeneratingPdf ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Save as PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {pdfSuccessNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-semibold flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{pdfSuccessNotice}</span>
        </div>
      )}

      {/* PRINTABLE QUOTATION SHEET (PAPER CARD) */}
      <div 
        id="printable-quotation-sheet"
        className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8 text-slate-800 font-sans"
      >
        {/* Quotation Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b-2 border-slate-900 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black font-display text-xl shadow-2xs">
                SX
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-slate-950 font-display">
                  STANDARD <span className="text-amber-500">X</span>
                </span>
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                  Civil Engineering Estimation & BIS Quality Systems
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 max-w-sm pt-1">
              National Building Code (IS 456 / IS 1786) & MoRTH Compliant Structural Estimation
            </p>
          </div>

          <div className="text-right space-y-1">
            <span className="inline-block px-3 py-1 rounded bg-slate-100 text-slate-900 font-mono text-xs font-bold border border-slate-200">
              {quotation.quotationNumber}
            </span>
            <div className="text-xs text-slate-600 flex items-center sm:justify-end gap-1.5 pt-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Date: {quotation.date}</span>
            </div>
            <div className="text-xs text-slate-500">
              Valid for 30 days from issuance
            </div>
          </div>
        </div>

        {/* Project & Client Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Project Information
            </div>
            <div className="font-bold text-slate-900 text-sm font-display">
              {quotation.projectName}
            </div>
            <div className="text-slate-600 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{quotation.location}</span>
            </div>
            <div className="text-slate-500 capitalize">
              Category: <strong>{quotation.category} Construction</strong>
            </div>
          </div>

          <div className="space-y-1.5 sm:text-right">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Issuing Estimation Authority
            </div>
            <div className="font-bold text-slate-900 text-sm font-display">
              STANDARD X Computational Engine
            </div>
            <div className="text-slate-600">
              Civil Estimation Reference ID: {quotation.projectId}
            </div>
            <div className="text-slate-500">
              Standards: BIS IS 456, IS 1786, IS 269, IS 383
            </div>
          </div>
        </div>

        {/* Incomplete Warning Banner if user skipped materials */}
        {quotation.hasIncompleteWarning && (
          <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs space-y-1">
            <div className="font-bold flex items-center gap-2 text-amber-950">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Advisory Notice: Partial / Incomplete Material Estimate</span>
            </div>
            <p className="leading-relaxed">
              Notice: This project quotation does not include selections for all calculated structural materials 
              (Missing: {quotation.missingMaterials.join(', ') || 'Certain foundation/masonry components'}). 
              This estimate reflects solely the chosen materials. Site budget should incorporate auxiliary supplies.
            </p>
          </div>
        )}

        {/* DETAILED MATERIAL QUOTATION TABLE */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Certified Bill of Quantities (BOQ):
          </h3>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <th className="py-2.5 px-3 w-10 text-center">S.No</th>
                  <th className="py-2.5 px-3">Material & BIS Quality Grade</th>
                  <th className="py-2.5 px-3">BIS Code</th>
                  <th className="py-2.5 px-3">Rank Level</th>
                  <th className="py-2.5 px-3 text-right">Estimated Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Rate</th>
                  <th className="py-2.5 px-3 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {quotation.items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-center text-slate-500 font-mono">
                      {idx + 1}
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 text-xs">
                        {sanitizeProductName(item.product.name, item.materialCategory)}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Quality Spec: {sanitizeQualitySpec(item.product.brand, item.product)} • <span className="capitalize">{item.materialCategory}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded font-semibold text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                        {item.product.bisStandardCode}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        item.product.recommendationRank === 'highly_recommended'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : item.product.recommendationRank === 'averagely_recommended'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {item.product.rankTitle}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-medium text-slate-800">
                      {item.quantity.toLocaleString()} {item.unit}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-slate-600">
                      ₹{item.unitPrice.toLocaleString()}
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 text-sm">
                      ₹{Math.round(item.totalCost).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Summary Breakdown Block */}
        <div className="flex flex-col sm:flex-row justify-end pt-2">
          <div className="w-full sm:w-80 space-y-2 text-xs border border-slate-200 rounded-xl p-4 bg-slate-50/80">
            <div className="flex justify-between text-slate-600">
              <span>Materials Subtotal:</span>
              <span className="font-mono font-semibold text-slate-900">
                ₹{Math.round(quotation.financials.rawMaterialsTotal).toLocaleString()}
              </span>
            </div>

            {quotation.financials.transportationCost > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Transportation & Site Freight:</span>
                <span className="font-mono">₹{Math.round(quotation.financials.transportationCost).toLocaleString()}</span>
              </div>
            )}

            {quotation.financials.laborCost > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Contractor Labor Allowance:</span>
                <span className="font-mono">₹{Math.round(quotation.financials.laborCost).toLocaleString()}</span>
              </div>
            )}

            {quotation.financials.contingencyCost > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Site Contingency (5%):</span>
                <span className="font-mono">₹{Math.round(quotation.financials.contingencyCost).toLocaleString()}</span>
              </div>
            )}

            {quotation.financials.taxGst > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Applicable GST (18%):</span>
                <span className="font-mono">₹{Math.round(quotation.financials.taxGst).toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between pt-3 border-t-2 border-slate-900 text-sm font-extrabold text-slate-950">
              <span>Grand Estimated Total:</span>
              <span className="text-lg font-black text-amber-600 font-display">
                ₹{Math.round(quotation.financials.grandTotal).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Quality Assurance & Compliance Endorsement */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Bureau of Indian Standards Quality Endorsement</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            All selected materials cited above hold verifiable certifications under Bureau of Indian Standards specifications. 
            Before dispatching consignments to site, verify holographic ISI stamps, batch test certificates (MTC), 
            and physical testing per IS 456:2000.
          </p>
        </div>

        {/* Mandatory Civil Engineering Legal Disclaimer */}
        <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
          <div className="font-bold text-slate-700">Important Civil Engineering Advisory & Disclaimer:</div>
          <p className="leading-relaxed">
            <strong>This is an approximate estimate for planning purposes and is not a binding construction quotation.</strong> Final 
            actual expenditures will depend on local market fluctuations, dynamic logistics freight, specific structural engineer-certified 
            reinforcement schedules, foundation conditions on site, and negotiated contractor agreements. STANDARD X assumes no financial 
            liability for variance against final site invoices.
          </p>
        </div>

        {/* Signatures Row */}
        <div className="pt-10 grid grid-cols-2 gap-8 text-xs text-slate-600 border-t border-dashed border-slate-200">
          <div>
            <div className="border-b border-slate-300 w-48 mb-1.5"></div>
            <div className="font-bold text-slate-800">Project Architect / Engineer</div>
            <div className="text-[10px] text-slate-500">Seal & Verification Signature</div>
          </div>
          <div className="text-right">
            <div className="border-b border-slate-300 w-48 ml-auto mb-1.5"></div>
            <div className="font-bold text-slate-800">Client / Builder Acceptance</div>
            <div className="text-[10px] text-slate-500">Date & Acknowledgment</div>
          </div>
        </div>
      </div>
    </div>
  );
};

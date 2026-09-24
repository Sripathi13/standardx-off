import jsPDF from 'jspdf';
import { StandardRecommendationResult, ProcurementOfficerProfile } from '../types/procurement';
import {
  TenderRequiredProduct,
  extractTenderRequiredProducts,
  getBisStandardVerificationUrl,
  getManakonlineSearchUrl
} from '../services/tenderMaterialRequirementsService';
import { ExtractedTenderRequirement } from '../services/tenderExtractionService';

/**
 * Helper to render an authentic, clickable link in jsPDF with visual styling.
 */
function drawClickableLink(
  doc: jsPDF,
  text: string,
  url: string,
  x: number,
  yPos: number,
  fontSize: number = 7
): number {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(fontSize);
  doc.setTextColor(2, 132, 199); // sky-600

  // Draw clickable text
  doc.textWithLink(text, x, yPos, { url });

  // Draw link underline
  const textWidth = doc.getTextWidth(text);
  doc.setDrawColor(2, 132, 199);
  doc.setLineWidth(0.18);
  doc.line(x, yPos + 0.6, x + textWidth, yPos + 0.6);

  // Add clickable interactive area
  doc.link(x, yPos - fontSize * 0.35, textWidth, fontSize * 0.55, { url });

  return textWidth;
}

/**
 * Generates an official, publication-grade PDF specification appendix
 * with interactive BIS certification verification links.
 */
export function exportTenderAppendixPdf(
  res: StandardRecommendationResult,
  officer: ProcurementOfficerProfile,
  sourceDocumentName?: string,
  tenderMaterials?: TenderRequiredProduct[],
  tenderRequirement?: ExtractedTenderRequirement
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const usableWidth = pageWidth - 2 * margin;
  const maxY = pageHeight - 16;
  let y = margin;

  const primaryCode = res.primaryStandards[0]?.code || 'IS_STANDARD';
  const cleanCode = primaryCode.replace(/[\s\:\/]/g, '_');
  const filename = `Tender_Specification_${cleanCode}.pdf`;

  const addHeader = (isFirstPage: boolean) => {
    if (isFirstPage) {
      // Top header banner
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(margin, y, usableWidth, 20, 'F');

      // Gold accent bar
      doc.setFillColor(217, 119, 6); // amber-600
      doc.rect(margin, y + 20, usableWidth, 1.5, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text('GOVERNMENT OF INDIA — TECHNICAL TENDER SPECIFICATION CLAUSE', margin + 6, y + 8);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(203, 213, 225); // slate-300
      doc.text('NATIONAL BUILDING CODE & BUREAU OF INDIAN STANDARDS (BIS) MANDATORY NORMS', margin + 6, y + 14);

      y += 26;
    } else {
      // Running header on page 2+
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text(`TENDER SPECIFICATION CLAUSE: ${res.primaryStandards[0]?.code || 'INDIAN STANDARDS'}`, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.text('STANDARD X BIS PROCUREMENT ENGINE', pageWidth - margin, y, { align: 'right' });

      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y + 2, pageWidth - margin, y + 2);
      y += 8;
    }
  };

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > maxY) {
      doc.addPage();
      y = margin;
      addHeader(false);
    }
  };

  // 1. Initial Page Header
  addHeader(true);

  // 2. Metadata / Officer Box
  checkPageBreak(30);
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.roundedRect(margin, y, usableWidth, 26, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('TENDER OFFICER & VERIFICATION DETAILS', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);

  const col1X = margin + 4;
  const col2X = margin + 96;

  doc.text(`Officer: `, col1X, y + 10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${officer.name} (${officer.badgeNumber})`, col1X + 13, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Designation: `, col1X, y + 15);
  doc.text(`${officer.designation}`, col1X + 18, y + 15);

  doc.text(`Department: `, col1X, y + 20);
  doc.text(`${officer.department}`, col1X + 18, y + 20);

  // Right column
  doc.text(`Date of Issue: `, col2X, y + 10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}`, col2X + 20, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Domain: `, col2X, y + 15);
  doc.text(`${res.detectedDomain || 'General Engineering'}`, col2X + 13, y + 15);

  doc.text(`System Reference: `, col2X, y + 20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9); // amber-700
  doc.text(`SX-${cleanCode}-${Date.now().toString().slice(-6)}`, col2X + 27, y + 20);

  y += 31;

  // 3. Procurement Requirement & Semantic Engineering Context
  checkPageBreak(25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('1. PROCUREMENT SCOPE & SEMANTIC ANALYSIS', margin, y);
  y += 4.5;

  doc.setFillColor(254, 243, 199); // amber-100
  doc.setDrawColor(251, 191, 36); // amber-400
  const scopeBoxHeight = sourceDocumentName ? 18 : 14;
  doc.roundedRect(margin, y, usableWidth, scopeBoxHeight, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(146, 64, 14); // amber-900
  doc.text('Procurement Query / Target Material:', margin + 3, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  const queryLines = doc.splitTextToSize(res.query, usableWidth - 8);
  doc.text(queryLines.slice(0, 2), margin + 3, y + 9.5);

  if (sourceDocumentName) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(180, 83, 9);
    doc.text(`Source Tender Document: ${sourceDocumentName}`, margin + 3, y + 14.5);
  }
  y += scopeBoxHeight + 4;

  // Semantic Analysis prose
  if (res.semanticAnalysis) {
    checkPageBreak(20);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    const semanticLines = doc.splitTextToSize(res.semanticAnalysis, usableWidth);
    doc.text(semanticLines, margin, y);
    y += semanticLines.length * 3.6 + 4;
  }

  // 4. Primary Relevant Indian Standards (Ranked) with Interactive BIS Verification Links
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('2. PRIMARY MANDATORY INDIAN STANDARDS (RANKED & CERTIFICATION VERIFIED)', margin, y);
  y += 5;

  res.primaryStandards.forEach((std, idx) => {
    checkPageBreak(42);

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, usableWidth, 34, 1.5, 1.5, 'FD');

    // Title & Code
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`#${idx + 1}.  ${std.code}`, margin + 3, y + 5);

    if (std.isMandatoryQco) {
      doc.setFillColor(254, 226, 226); // red-100
      doc.roundedRect(pageWidth - margin - 35, y + 1.5, 32, 4.5, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(185, 28, 28); // red-700
      doc.text('MANDATORY QCO', pageWidth - margin - 19, y + 4.5, { align: 'center' });
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(std.title, margin + 3, y + 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`Edition: ${std.edition || 'Current'}  |  Latest Amendment: ${std.latestAmendment || 'None'}  |  Year: ${std.yearOfPublication || 2023}`, margin + 3, y + 14);

    doc.setTextColor(51, 65, 85);
    const scopeLines = doc.splitTextToSize(`Scope & Benchmark: ${std.scope || std.matchExplanation}`, usableWidth - 6);
    doc.text(scopeLines.slice(0, 2), margin + 3, y + 18);

    if (std.applicableGrades && std.applicableGrades.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(146, 64, 14);
      doc.text(`Applicable Engineering Grades: ${std.applicableGrades.join(' · ')}`, margin + 3, y + 25);
    }

    // Interactive clickable links to official BIS verification
    const bisVerifyUrl = getBisStandardVerificationUrl(std.code);
    const manakUrl = getManakonlineSearchUrl(std.code);

    const link1Width = drawClickableLink(
      doc,
      `Verify Official BIS Certification (${std.code}) »`,
      bisVerifyUrl,
      margin + 3,
      y + 30,
      6.8
    );

    drawClickableLink(
      doc,
      `Search Certified Makers on Manakonline »`,
      manakUrl,
      margin + 8 + link1Width,
      y + 30,
      6.8
    );

    y += 37;
  });

  // 5. Statutory Quality Control Orders (QCO)
  if (res.mandatoryCertifications && res.mandatoryCertifications.length > 0) {
    checkPageBreak(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text('3. STATUTORY QUALITY CONTROL ORDERS (QCO) & CERTIFICATION SCHEMES', margin, y);
    y += 5;

    res.mandatoryCertifications.forEach((cert) => {
      checkPageBreak(18);
      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(margin, y, usableWidth, 14, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(185, 28, 28);
      doc.text(`[${cert.isCompulsory ? 'COMPULSORY STATUTORY ORDER' : 'QUALITY SCHEME'}] ${cert.scheme}`, margin + 3, y + 4.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(30, 41, 59);
      doc.text(`Order Reference: ${cert.qcoOrderReference} (${cert.issuingAuthority})`, margin + 3, y + 8.5);

      doc.setTextColor(71, 85, 105);
      const descLines = doc.splitTextToSize(cert.description, usableWidth - 6);
      doc.text(descLines.slice(0, 1), margin + 3, y + 12);

      y += 16;
    });
  }

  // 6. Complete Tender Materials & Standards Schedule (if tender materials provided or extracted)
  const materialsToRender =
    tenderMaterials ||
    (tenderRequirement ? extractTenderRequiredProducts(tenderRequirement) : null);

  if (materialsToRender && materialsToRender.length > 0) {
    checkPageBreak(35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text('4. COMPREHENSIVE TENDER MATERIALS & MANDATORY INDIAN STANDARDS SCHEDULE', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    y += 4;
    doc.text('Itemized breakdown of all products needed for this tender with exact IS standard benchmarks and direct BIS certification verification links.', margin, y);
    y += 5;

    materialsToRender.forEach((mat, idx) => {
      checkPageBreak(38);

      doc.setFillColor(250, 250, 250);
      doc.setDrawColor(217, 119, 6);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, usableWidth, 32, 1.5, 1.5, 'FD');

      // Header row
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text(`#${idx + 1}.  ${mat.productName}`, margin + 3, y + 4.5);

      doc.setFillColor(254, 243, 199);
      doc.roundedRect(pageWidth - margin - 45, y + 1.2, 42, 4.5, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(180, 83, 9);
      doc.text(`${mat.standardCode}`, pageWidth - margin - 24, y + 4.2, { align: 'center' });

      // Standard title and grade
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(71, 85, 105);
      doc.text(`Required Spec: ${mat.requiredGradeOrSpec}`, margin + 3, y + 9);

      if (mat.estimatedQuantity) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(`Quantity: ${mat.estimatedQuantity}`, margin + 115, y + 9);
      }

      // QCO & Legal Status
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(185, 28, 28);
      doc.text(`Statutory Mandate: ${mat.qcoReference}`, margin + 3, y + 13.5);

      // Acceptance Criteria
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(51, 65, 85);
      const critLines = doc.splitTextToSize(`Acceptance Criteria: ${mat.acceptanceCriteria}`, usableWidth - 6);
      doc.text(critLines.slice(0, 2), margin + 3, y + 17.5);

      // Testing standards
      doc.setTextColor(100, 116, 139);
      doc.text(`Mandatory Tests: ${mat.mandatoryTests.slice(0, 2).join(' · ')}`, margin + 3, y + 23.5);

      // Clickable direct link to official BIS certification!
      const link1W = drawClickableLink(
        doc,
        `Verify Official BIS Certification (${mat.standardCode}) »`,
        mat.certificationVerificationUrl,
        margin + 3,
        y + 28.5,
        6.8
      );

      drawClickableLink(
        doc,
        `Search Certified Manufacturers (Manakonline) »`,
        mat.manakonlineSearchUrl,
        margin + 8 + link1W,
        y + 28.5,
        6.8
      );

      y += 35;
    });
  }

  // 7. Normative References & Concurrent Standards
  const hasNormative = res.normativeReferences && res.normativeReferences.length > 0;
  const hasTestMethods = res.testMethodStandards && res.testMethodStandards.length > 0;

  if (hasNormative || hasTestMethods) {
    checkPageBreak(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text('5. NORMATIVE REFERENCES & MANDATORY TESTING CODES', margin, y);
    y += 5;

    const allRefs = [
      ...(res.normativeReferences || []).map((r) => ({ ...r, type: 'Normative' })),
      ...(res.testMethodStandards || []).map((r) => ({ ...r, type: 'Test Method' })),
      ...(res.safetyAndInstallationStandards || []).map((r) => ({ ...r, type: 'Safety/Code' }))
    ].slice(0, 6);

    allRefs.forEach((ref) => {
      checkPageBreak(6);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`• ${ref.code}`, margin + 2, y);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      const titleClean = doc.splitTextToSize(`- ${ref.title} [${ref.type}]`, usableWidth - 45);
      doc.text(titleClean[0], margin + 28, y);
      y += 4.5;
    });
    y += 3;
  }

  // 8. Formal Tender Specification Clause (Ready to Paste)
  checkPageBreak(45);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('6. FORMAL TENDER SPECIFICATION CLAUSE (FOR GeM / CPWD NIT)', margin, y);
  y += 5;

  const clauseLines = doc.splitTextToSize(res.tenderDraftClause, usableWidth - 8);
  const clauseHeight = Math.min(clauseLines.length * 3.5 + 8, 90);

  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(217, 119, 6); // amber-600
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, usableWidth, clauseHeight, 2, 2, 'FD');

  doc.setFont('courier', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(15, 23, 42);
  doc.text(clauseLines.slice(0, 24), margin + 4, y + 5);

  y += clauseHeight + 6;

  // 9. Add Running Footers Across All Pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text('STANDARD X Procurement Intelligence Platform — Bureau of Indian Standards (BIS) Aligned Engine', margin, pageHeight - 8);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  }

  // Save the PDF file
  doc.save(filename);
}

/**
 * Dedicated PDF exporter for the complete Tender Required Materials & Standards Schedule.
 */
export function exportTenderMaterialsSchedulePdf(
  tenderReq: ExtractedTenderRequirement,
  officer: ProcurementOfficerProfile,
  materials?: TenderRequiredProduct[]
): void {
  const allMaterials = materials || extractTenderRequiredProducts(tenderReq);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const usableWidth = pageWidth - 2 * margin;
  const maxY = pageHeight - 16;
  let y = margin;

  const filename = `Tender_Materials_Standards_Schedule_${(tenderReq.tenderId || 'NIT').replace(/[\s\:\/]/g, '_')}.pdf`;

  const addHeader = (isFirstPage: boolean) => {
    if (isFirstPage) {
      doc.setFillColor(15, 23, 42);
      doc.rect(margin, y, usableWidth, 22, 'F');

      doc.setFillColor(217, 119, 6);
      doc.rect(margin, y + 22, usableWidth, 1.5, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.text('TENDER MATERIALS & MANDATORY INDIAN STANDARDS SCHEDULE', margin + 6, y + 9);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(203, 213, 225);
      doc.text('BUREAU OF INDIAN STANDARDS (BIS) MANDATORY QUALITY COMPLIANCE & VERIFICATION DIRECTORY', margin + 6, y + 16);

      y += 28;
    } else {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`TENDER MATERIALS & STANDARDS: ${tenderReq.projectName || tenderReq.tenderId}`, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.text('STANDARD X BIS INTELLIGENCE', pageWidth - margin, y, { align: 'right' });

      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y + 2, pageWidth - margin, y + 2);
      y += 8;
    }
  };

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > maxY) {
      doc.addPage();
      y = margin;
      addHeader(false);
    }
  };

  addHeader(true);

  // Project & Authority Header
  checkPageBreak(32);
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, usableWidth, 28, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('PROJECT & TENDER DETAILS', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);

  doc.text(`Tender NIT: `, margin + 4, y + 10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9);
  doc.text(`${tenderReq.tenderId || 'NIT Ref'}`, margin + 22, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Project: `, margin + 4, y + 15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${tenderReq.projectName}`, margin + 17, y + 15);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Authority: `, margin + 4, y + 20);
  doc.text(`${tenderReq.authority} (${tenderReq.stateCity || tenderReq.location})`, margin + 18, y + 20);

  doc.text(`Source Document: `, margin + 4, y + 25);
  doc.setFont('helvetica', 'bold');
  doc.text(`${tenderReq.sourceFileName || 'Uploaded Tender'}`, margin + 29, y + 25);

  // Right side details
  doc.setFont('helvetica', 'normal');
  doc.text(`Officer: ${officer.name} (${officer.badgeNumber})`, margin + 105, y + 10);
  doc.text(`Dept: ${officer.department}`, margin + 105, y + 15);
  doc.text(`Materials Identified: ${allMaterials.length} Items`, margin + 105, y + 20);
  doc.text(`Date of Audit: ${new Date().toLocaleDateString('en-IN')}`, margin + 105, y + 25);

  y += 34;

  // Materials list
  allMaterials.forEach((mat, idx) => {
    const hasSuite = mat.applicableStandards && mat.applicableStandards.length > 0;
    const cardHeight = hasSuite ? 42 : 36;
    checkPageBreak(cardHeight + 4);

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, usableWidth, cardHeight, 1.5, 1.5, 'FD');

    // Title line
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`#${idx + 1}.  ${mat.productName}`, margin + 3, y + 5);

    doc.setFillColor(254, 243, 199);
    doc.roundedRect(pageWidth - margin - 45, y + 1.5, 42, 5, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(180, 83, 9);
    doc.text(`${mat.standardCode}`, pageWidth - margin - 24, y + 4.8, { align: 'center' });

    // Category and spec
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text(`Category: ${mat.category}  |  Required Grade: ${mat.requiredGradeOrSpec}`, margin + 3, y + 9.5);

    if (mat.estimatedQuantity) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`Estimated Tender Quantity: ${mat.estimatedQuantity}`, margin + 3, y + 13.5);
    }

    // Mandatory QCO
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(185, 28, 28);
    doc.text(`Statutory QCO Order: ${mat.qcoReference}`, margin + 3, y + 17.5);

    // Acceptance
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(51, 65, 85);
    const critLines = doc.splitTextToSize(`Acceptance Criteria: ${mat.acceptanceCriteria}`, usableWidth - 6);
    doc.text(critLines.slice(0, 1), margin + 3, y + 21.5);

    // Tests
    doc.setTextColor(100, 116, 139);
    doc.text(`Mandatory Tests: ${mat.mandatoryTests.join(' · ')}`, margin + 3, y + 25.5);

    // Applicable IS Standards Suite list if present
    let linkY = y + 30;
    if (hasSuite) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.2);
      doc.setTextColor(180, 83, 9);
      const suiteStr = `Applicable IS Suite (${mat.applicableStandards!.length} Standards): ${mat.applicableStandards!.map(s => s.code).join(' · ')}`;
      const suiteLines = doc.splitTextToSize(suiteStr, usableWidth - 6);
      doc.text(suiteLines.slice(0, 1), margin + 3, y + 29.5);
      linkY = y + 35;
    }

    // Interactive clickable links to official BIS verification!
    const link1W = drawClickableLink(
      doc,
      `Verify Official BIS Certification (${mat.standardCode}) »`,
      mat.certificationVerificationUrl,
      margin + 3,
      linkY,
      6.8
    );

    drawClickableLink(
      doc,
      `Search Certified Manufacturers on Manakonline »`,
      mat.manakonlineSearchUrl,
      margin + 8 + link1W,
      linkY,
      6.8
    );

    y += cardHeight + 4;
  });

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text('STANDARD X — Mandatory Bureau of Indian Standards (BIS) Tender Certification Verification Schedule', margin, pageHeight - 8);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  }

  doc.save(filename);
}

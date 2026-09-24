import { describe, it, expect } from 'vitest';
import {
  SAMPLE_TENDERS,
  parseTenderDocumentText
} from '../../src/services/tenderExtractionService';

describe('Tender Extraction Service - Predefined Sample Tenders', () => {
  it('contains valid and complete sample tenders', () => {
    const keys = Object.keys(SAMPLE_TENDERS);
    expect(keys).toContain('commercial_building');
    expect(keys).toContain('highway_corridor');
    expect(keys).toContain('flyover_bridge');

    for (const key of keys) {
      const tender = SAMPLE_TENDERS[key];
      expect(tender.tenderId).toBeTruthy();
      expect(tender.authority).toBeTruthy();
      expect(tender.projectName).toBeTruthy();
      expect(tender.category).toMatch(/^(building|road|bridge)$/);
      expect(tender.extractionConfidence).toBeGreaterThanOrEqual(70);
      expect(tender.qualitySpecifications.concreteGrade).toBeTruthy();
      expect(tender.qualitySpecifications.rebarGrade).toBeTruthy();
      expect(tender.boqHighlights.length).toBeGreaterThan(0);
    }
  });
});

describe('Tender Extraction Service - parseTenderDocumentText', () => {
  it('correctly identifies and extracts specifications from a commercial building tender', () => {
    const rawDocumentText = `
      NOTICE INVITING TENDER
      NIT No: CPWD/2026/CIVIL-889
      Employer: Central Public Works Department
      Name of Work: Construction of G+4 Multi-Specialty Hospital Annex Building
      Site Location: Ring Road Campus, Sector 9
      Location: Indore, Madhya Pradesh
      Total Built-Up Area: 12,500 sq.ft
      The building shall be an RCC Framed Structure with M30 grade concrete and Fe 550D TMT reinforcement.
      Ordinary Portland Cement 53 Grade conforming to IS 269 shall be utilized.
      Fine Aggregate: IS 383 Zone II M-Sand.
      Coarse Aggregate: 20mm and 10mm graded machine crushed granite.
      Estimated Cost: Rs 3,45,00,000
    `;

    const extracted = parseTenderDocumentText(rawDocumentText, 'CPWD_Hospital_Tender.pdf');

    expect(extracted.category).toBe('building');
    expect(extracted.tenderId).toBe('NIT No: CPWD/2026/CIVIL-889');
    expect(extracted.authority).toBe('Central Public Works Department');
    expect(extracted.projectName).toContain('Construction of G+4 Multi-Specialty Hospital Annex Building');
    expect(extracted.stateCity).toContain('Indore');

    // Building specs
    expect(extracted.buildingSpecs).toBeDefined();
    expect(extracted.buildingSpecs?.builtUpArea).toBe(12500);
    expect(extracted.buildingSpecs?.numFloors).toBe(5); // G+4 = 5 floors

    // Quality specifications
    expect(extracted.qualitySpecifications.concreteGrade).toContain('M30');
    expect(extracted.qualitySpecifications.rebarGrade).toContain('Fe 550D');
    expect(extracted.qualitySpecifications.cementType).toContain('Grade 53');

    // Audit score and BOQ highlights
    expect(extracted.verificationAudit.projectNameMatched).toBe(true);
    expect(extracted.verificationAudit.dimensionsMatched).toBe(true);
    expect(extracted.verificationAudit.qualityGradesMatched).toBe(true);
    expect(extracted.extractionConfidence).toBeGreaterThanOrEqual(80);
    expect(extracted.boqHighlights.length).toBeGreaterThanOrEqual(4);
  });

  it('correctly identifies and extracts specifications from a highway road tender', () => {
    const rawRoadTender = `
      MADHYA PRADESH ROAD DEVELOPMENT CORPORATION
      Bid ID: MPRDC/R-89/HWY-402
      Title of Work: Widening and strengthening of 4-lane flexible highway carriageway
      Location: Km 45.000 to Km 52.500 Bypass
      City: Bhopal, Madhya Pradesh
      Length of road: 7.5 km. Carriageway width: 14.0 meters. Pavement thickness: 115 mm.
      Flexible pavement conforming to MoRTH and IRC:37.
      Bituminous mix shall use VG-30 viscosity grade paving bitumen.
      Granular sub-base with CBR 8.
      Estimated Budget: Rs. 8,50,00,000.
    `;

    const extracted = parseTenderDocumentText(rawRoadTender, 'Highway_Corridor_Bhopal.pdf');

    expect(extracted.category).toBe('road');
    expect(extracted.tenderId).toBe('NIT No: MPRDC/R-89/HWY-402');
    expect(extracted.authority).toMatch(/MPRDC|Madhya Pradesh Road Development Corporation/i);
    expect(extracted.roadSpecs).toBeDefined();
    expect(extracted.roadSpecs?.roadLengthKm).toBe(7.5);
    expect(extracted.roadSpecs?.roadWidthM).toBe(14);
    expect(extracted.roadSpecs?.roadThicknessMm).toBe(115);
    expect(extracted.roadSpecs?.pavementType).toContain('Flexible Pavement');
    expect(extracted.qualitySpecifications.bitumenGrade).toContain('VG-30');
    expect(extracted.verificationAudit.dimensionsMatched).toBe(true);
  });

  it('correctly identifies and extracts specifications from a bridge flyover tender', () => {
    const rawBridgeTender = `
      STATE PUBLIC WORKS DEPARTMENT - BRIDGES DIVISION
      NIT No: PWD-BRG-2026-554
      Project Title: Construction of 4-Span Prestressed Concrete Girder Bridge
      Location: River Crossing Km 18, Jabalpur, Madhya Pradesh
      Superstructure: Prestressed concrete deck with 35m span length, deck width 11.5 meters, pier height 9.0 meters.
      Substructure: Reinforced concrete pier cap and abutment.
      Concrete Grade: M45 design mix conforming to IRC:112.
      Rebar: Fe 550D high-ductility seismic bars.
    `;

    const extracted = parseTenderDocumentText(rawBridgeTender, 'Bridge_Overpass_Jabalpur.pdf');

    expect(extracted.category).toBe('bridge');
    expect(extracted.tenderId).toBe('NIT No: PWD-BRG-2026-554');
    expect(extracted.bridgeSpecs).toBeDefined();
    expect(extracted.bridgeSpecs?.spanLengthM).toBe(35);
    expect(extracted.bridgeSpecs?.deckWidthM).toBe(11.5);
    expect(extracted.bridgeSpecs?.pierHeightM).toBe(9.0);
    expect(extracted.qualitySpecifications.concreteGrade).toContain('M45');
    expect(extracted.qualitySpecifications.rebarGrade).toContain('Fe 550D');
  });

  it('handles sparse or unformatted tender text gracefully with sensible fallbacks', () => {
    const minimalText = 'Miscellaneous civil works contract tender for general repairs.';
    const extracted = parseTenderDocumentText(minimalText, 'Tender_Document_Draft.pdf');

    expect(extracted).toBeDefined();
    expect(extracted.tenderId).toBeTruthy();
    expect(extracted.authority).toBeTruthy();
    expect(extracted.projectName).toBeTruthy();
    expect(extracted.category).toBe('building');
    expect(extracted.extractionConfidence).toBeGreaterThanOrEqual(70);
    expect(extracted.extractionConfidence).toBeLessThanOrEqual(99);
    expect(extracted.qualitySpecifications).toBeDefined();
  });
});

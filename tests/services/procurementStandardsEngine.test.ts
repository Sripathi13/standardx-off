import { describe, it, expect } from 'vitest';
import {
  matchEcosystemLocally,
  detectQueryLanguage,
  INDIAN_STANDARDS_KNOWLEDGE_BASE
} from '../../src/services/procurementStandardsEngine';

describe('Procurement Standards Engine - Knowledge Base & Ecosystems', () => {
  it('should contain comprehensive Indian Standard ecosystem definitions', () => {
    expect(INDIAN_STANDARDS_KNOWLEDGE_BASE.length).toBeGreaterThanOrEqual(7);
    for (const eco of INDIAN_STANDARDS_KNOWLEDGE_BASE) {
      expect(eco.domain).toBeTruthy();
      expect(eco.primaryStandards.length).toBeGreaterThan(0);
      expect(eco.normativeReferences.length).toBeGreaterThan(0);
      expect(eco.testMethodStandards.length).toBeGreaterThan(0);
      expect(eco.mandatoryCertifications.length).toBeGreaterThan(0);
      expect(typeof eco.tenderClauseTemplate).toBe('function');
    }
  });

  describe('Language Detection', () => {
    it('detects English query strings correctly', () => {
      const lang = detectQueryLanguage('Ordinary Portland Cement for building works');
      expect(lang).toBe('English');
    });

    it('detects Hindi/Devanagari query strings correctly', () => {
      const lang = detectQueryLanguage('पेयजल आपूर्ति के लिए एचडीपीई पाइप');
      expect(lang).toContain('Hindi');
    });

    it('detects mixed English-Hindi query strings', () => {
      const lang = detectQueryLanguage('Cement supply कंक्रीट निर्माण कार्य हेतु');
      expect(lang).toContain('Hindi');
    });
  });

  describe('Use Case 1: Cement Procurement', () => {
    it('accurately resolves cement ecosystem with IS 269:2023 and normative standards', () => {
      const result = matchEcosystemLocally('Ordinary Portland Cement for residential construction');
      expect(result.detectedDomain).toContain('Cement');
      
      const primaryCodes = result.primaryStandards.map((s) => s.code);
      expect(primaryCodes).toContain('IS 269:2023');

      // Verifies normative references
      const normativeCodes = result.normativeReferences.map((n) => n.code);
      expect(normativeCodes.some((code) => code.includes('IS 3812') || code.includes('IS 4032'))).toBe(true);

      // Verifies test methods
      const testCodes = result.testMethodStandards.map((t) => t.code);
      expect(testCodes.some((code) => code.includes('IS 4031'))).toBe(true);

      // Verifies mandatory QCO
      const cert = result.mandatoryCertifications.find((c) => c.scheme.includes('ISI Mark'));
      expect(cert).toBeDefined();
      expect(cert?.isCompulsory).toBe(true);
      expect(cert?.qcoOrderReference).toContain('Cement (Quality Control) Order');

      // Verifies tender clause generation
      expect(result.tenderDraftClause).toContain('IS 269:2023');
      expect(result.tenderDraftClause).toContain('Bureau of Indian Standards');
    });
  });

  describe('Use Case 2: Steel Pipes for High Pressure', () => {
    it('resolves seamless and pressure tube standards with IS 3601 and IS 4763', () => {
      const result = matchEcosystemLocally('Seamless carbon steel pipes for high-pressure applications');
      expect(result.detectedDomain).toContain('Piping');

      const primaryCodes = result.primaryStandards.map((s) => s.code);
      expect(primaryCodes).toContain('IS 3601:2021');
      expect(primaryCodes).toContain('IS 4763:2022');

      // Normative references check
      const normativeCodes = result.normativeReferences.map((n) => n.code);
      expect(normativeCodes.some((code) => code.includes('IS 1367'))).toBe(true);

      // Test methods (tensile, flattening)
      const testCodes = result.testMethodStandards.map((t) => t.code);
      expect(testCodes.some((code) => code.includes('IS 1608'))).toBe(true);
      expect(testCodes.some((code) => code.includes('IS 2328'))).toBe(true);

      // Tender clause verification
      expect(result.tenderDraftClause).toContain('IS 3601:2021');
      expect(result.tenderDraftClause).toContain('hydrostatic pressure testing');
    });
  });

  describe('Use Case 3: PVC & HDPE Water Supply Pipes', () => {
    it('resolves potable water standards IS 4984 and IS 4985 with non-toxic criteria', () => {
      const result = matchEcosystemLocally('Water supply pipes made of PVC and HDPE');
      expect(result.detectedDomain).toContain('Plumbing');

      const primaryCodes = result.primaryStandards.map((s) => s.code);
      expect(primaryCodes).toContain('IS 4984:2016');
      expect(primaryCodes).toContain('IS 4985:2021');

      // Jointing and testing standards
      const normativeCodes = result.normativeReferences.map((n) => n.code);
      expect(normativeCodes.some((code) => code.includes('IS 5382') || code.includes('IS 7634'))).toBe(true);

      expect(result.tenderDraftClause).toContain('virgin resin');
    });
  });

  describe('Use Case 4: Food-Grade Stainless Steel Utensils', () => {
    it('resolves IS 7000:2021 and food-contact migration limits', () => {
      const result = matchEcosystemLocally('Food-grade stainless steel containers for commercial kitchen');
      expect(result.detectedDomain).toContain('Food Safety');

      const primaryCodes = result.primaryStandards.map((s) => s.code);
      expect(primaryCodes).toContain('IS 7000:2021');
      expect(primaryCodes).toContain('IS 5522:2014');

      const primary = result.primaryStandards.find((s) => s.code === 'IS 7000:2021');
      expect(primary?.keyChemicalRequirements).toBeDefined();
      expect(primary?.keyChemicalRequirements?.some((req) => req.includes('Chromium'))).toBe(true);

      expect(result.tenderDraftClause).toContain('AISI 304');
    });
  });

  describe('Use Case 5: Power Cables & Wiring', () => {
    it('resolves IS 7098 and IS 694 for electrical transmission', () => {
      const result = matchEcosystemLocally('XLPE insulated power cables for underground electricity distribution');
      expect(result.detectedDomain).toContain('Electrical');

      const primaryCodes = result.primaryStandards.map((s) => s.code);
      expect(primaryCodes).toContain('IS 7098 (Part 1):2020');

      const normativeCodes = result.normativeReferences.map((n) => n.code);
      expect(normativeCodes.some((code) => code.includes('IS 8130'))).toBe(true);
    });
  });

  describe('Use Case 6: Solar PV Modules & CRS Scheme', () => {
    it('identifies Compulsory Registration Scheme (CRS) and IS 14286', () => {
      const result = matchEcosystemLocally('Solar photovoltaic modules and inverters for rooftop installation');
      expect(result.detectedDomain).toContain('Renewable Energy');

      const primaryCodes = result.primaryStandards.map((s) => s.code);
      expect(primaryCodes.some((c) => c.includes('IS 14286'))).toBe(true);

      const crsCert = result.mandatoryCertifications.find((c) => c.scheme.includes('CRS'));
      expect(crsCert).toBeDefined();
      expect(crsCert?.isCompulsory).toBe(true);
      expect(result.tenderDraftClause).toContain('ALMM');
    });
  });

  describe('Use Case 7: High Strength Fe 550D TMT Rebars', () => {
    it('identifies ductile seismic rebar IS 1786:2021 and cold bend test IS 1599', () => {
      const result = matchEcosystemLocally('High strength Fe 550D TMT rebar for earthquake zone IV construction');
      expect(result.detectedDomain).toContain('Reinforcement Steel');

      const primaryCodes = result.primaryStandards.map((s) => s.code);
      expect(primaryCodes).toContain('IS 1786:2021');

      const testCodes = result.testMethodStandards.map((t) => t.code);
      expect(testCodes.some((c) => c.includes('IS 1599') || c.includes('IS 1608'))).toBe(true);
    });
  });

  describe('Fallback Handling for Generic Queries', () => {
    it('provides sound civil structural benchmark (IS 456 / IS 383) when query has no specific keyword', () => {
      const result = matchEcosystemLocally('General municipal construction works tender 2026');
      expect(result.primaryStandards.length).toBeGreaterThan(0);
      expect(result.normativeReferences.length).toBeGreaterThan(0);
      expect(result.tenderDraftClause).toBeTruthy();
    });
  });
});

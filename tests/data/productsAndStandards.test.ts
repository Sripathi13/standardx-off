import { describe, it, expect } from 'vitest';
import {
  BIS_STANDARDS,
  getBisStandardByCode,
  getBisStandardsByCategory
} from '../../src/data/bisStandards';
import {
  PRODUCTS_DATABASE,
  ALL_PRODUCTS_DATABASE,
  getRecommendedProductsForMaterial,
  getProductById
} from '../../src/data/productsDatabase';
import { INITIAL_SAMPLE_PROJECTS } from '../../src/data/sampleProjects';

describe('Data Integrity - BIS Standards Catalog', () => {
  it('contains critical Indian civil engineering standards', () => {
    expect(BIS_STANDARDS.length).toBeGreaterThanOrEqual(10);

    const codes = BIS_STANDARDS.map((s) => s.code);
    expect(codes.some((c) => c.includes('1786'))).toBe(true);
    expect(codes.some((c) => c.includes('269'))).toBe(true);
    expect(codes.some((c) => c.includes('383'))).toBe(true);
    expect(codes.some((c) => c.includes('1077'))).toBe(true);
    expect(codes.some((c) => c.includes('2185'))).toBe(true);
    expect(codes.some((c) => c.includes('73'))).toBe(true);
  });

  it('validates structure of all BIS standard entries', () => {
    for (const std of BIS_STANDARDS) {
      expect(std.code).toBeTruthy();
      expect(std.title).toBeTruthy();
      expect(std.category).toBeTruthy();
      expect(std.scope.length).toBeGreaterThan(20);
      expect(std.keyRequirements.length).toBeGreaterThan(0);
      expect(std.mandatoryTests.length).toBeGreaterThan(0);
      expect(std.fieldTestingTips.length).toBeGreaterThan(0);
    }
  });

  it('retrieves standards by code correctly', () => {
    const is269 = getBisStandardByCode('IS 269');
    expect(is269).toBeDefined();
    expect(is269?.title).toContain('Ordinary Portland Cement');

    const unknown = getBisStandardByCode('NON_EXISTENT_CODE_XYZ');
    expect(unknown).toBeUndefined();
  });

  it('filters standards by category accurately', () => {
    const cementStandards = getBisStandardsByCategory('cement');
    expect(cementStandards.length).toBeGreaterThan(0);
    expect(cementStandards.some((s) => s.code.includes('269'))).toBe(true);

    const steelStandards = getBisStandardsByCategory('steel');
    expect(steelStandards.length).toBeGreaterThan(0);
    expect(steelStandards.some((s) => s.code.includes('1786'))).toBe(true);
  });
});

describe('Data Integrity - Products Database', () => {
  it('contains products across all major material categories', () => {
    expect(ALL_PRODUCTS_DATABASE.length).toBeGreaterThanOrEqual(15);

    const categories = Array.from(new Set(ALL_PRODUCTS_DATABASE.map((p) => p.materialCategory)));
    expect(categories).toContain('cement');
    expect(categories).toContain('steel');
    expect(categories).toContain('sand');
    expect(categories).toContain('aggregate');
    expect(categories).toContain('bricks');
    expect(categories).toContain('bitumen');
  });

  it('ensures every product has valid unit pricing and quality scores', () => {
    for (const p of ALL_PRODUCTS_DATABASE) {
      expect(p.id).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.unitPrice).toBeGreaterThan(0);
      expect(p.bisStandardCode).toBeTruthy();
      expect(p.qualityFeatures).toBeDefined();
      expect(p.userRating).toBeGreaterThanOrEqual(1);
      expect(p.userRating).toBeLessThanOrEqual(5);
    }
  });

  it('retrieves products sorted by quality rank for a given category', () => {
    const steelProducts = getRecommendedProductsForMaterial('steel');
    expect(steelProducts.length).toBeGreaterThan(0);
    expect(steelProducts[0].materialCategory).toBe('steel');
  });

  it('finds specific product by ID', () => {
    const sample = ALL_PRODUCTS_DATABASE[0];
    const found = getProductById(sample.id);
    expect(found).toBeDefined();
    expect(found?.id).toBe(sample.id);

    const missing = getProductById('non-existent-product-id');
    expect(missing).toBeUndefined();
  });
});

describe('Data Integrity - Sample Projects', () => {
  it('verifies that initial sample projects are populated with valid material requirements', () => {
    expect(INITIAL_SAMPLE_PROJECTS.length).toBeGreaterThan(0);

    for (const proj of INITIAL_SAMPLE_PROJECTS) {
      expect(proj.id).toBeTruthy();
      expect(proj.name).toBeTruthy();
      expect(proj.location).toBeTruthy();
      expect(proj.requiredMaterials.length).toBeGreaterThan(0);

      for (const mat of proj.requiredMaterials) {
        expect(mat.materialId).toBeTruthy();
        expect(mat.estimatedQuantity).toBeGreaterThan(0);
        expect(mat.editableQuantity).toBeGreaterThan(0);
        expect(mat.estimatedUnitPrice).toBeGreaterThan(0);
        expect(mat.calculationBasis).toBeTruthy();
        expect(mat.formulaExplanation).toBeTruthy();
      }
    }
  });
});

import { describe, it, expect } from 'vitest';
import {
  sanitizeProductName,
  sanitizeQualitySpec,
  sanitizeProduct,
  sanitizeCartItem
} from '../../src/utils/qualitySanitizer';
import { RecommendedProduct, CartItem } from '../../src/types';

describe('Quality Sanitizer - sanitizeProductName', () => {
  it('strips major brand names and returns pure engineering steel classification', () => {
    expect(sanitizeProductName('Tata Tiscon Fe 550D TMT Rebar', 'steel')).toBe(
      'Fe 550D Super Ductile Grade'
    );
    expect(sanitizeProductName('JSW NeoSteel 500D Limited', 'steel')).toBe(
      'Fe 500D High Ductility Grade'
    );
    expect(sanitizeProductName('Jindal Panther Fe 500 Rebar', 'steel')).toBe(
      'Fe 500 Standard Commercial Grade'
    );
  });

  it('strips commercial cement brand names and returns pure grade specifications', () => {
    expect(sanitizeProductName('UltraTech Cement OPC 53 Grade', 'cement')).toBe(
      'Grade 53 High-Early Strength OPC'
    );
    expect(sanitizeProductName('Ambuja Kawach PPC Fly Ash Cement', 'cement')).toBe(
      'Grade 43 Pozzolana Structural Cement (PPC / OPC 43)'
    );
    expect(sanitizeProductName('ACC Concrete Commercial 33 Grade', 'cement')).toBe(
      'Grade 33 Standard Commercial Cement'
    );
  });

  it('classifies aggregate and sand into pure technical grades', () => {
    expect(sanitizeProductName('Zone II VSI M-Sand Hydro-Washed', 'sand')).toBe(
      'IS 383 Zone II Hydro-Washed M-Sand Grade'
    );
    expect(sanitizeProductName('Screened Natural River Sand', 'sand')).toBe(
      'IS 383 Zone II Screened Natural River Sand Grade'
    );
    expect(sanitizeProductName('20mm & 10mm Graded Crushed Granite', 'aggregate')).toBe(
      '20mm & 10mm Graded Machine-Crushed Basalt/Granite'
    );
  });

  it('classifies masonry bricks and blocks into technical classes', () => {
    expect(sanitizeProductName('Precision AAC Blocks Autoclaved', 'bricks')).toBe(
      'Class 1 Precision Autoclaved Aerated Concrete (AAC Block)'
    );
    expect(sanitizeProductName('Class 10.0 Machine-Pressed Wire Cut Brick', 'bricks')).toBe(
      'Class 10.0 Machine-Pressed High-Density Brick'
    );
    expect(sanitizeProductName('Standard Kiln-Fired Red Clay Brick', 'bricks')).toBe(
      'Class 5.0 / 7.5 Standard Kiln-Fired Red Brick'
    );
  });

  it('classifies bitumen viscosity grades', () => {
    expect(sanitizeProductName('Industrial VG-30 Paving Bitumen', 'bitumen')).toBe(
      'VG-30 Standard Paving Viscosity Bitumen'
    );
    expect(sanitizeProductName('Heavy Duty VG-40 Bitumen', 'bitumen')).toBe(
      'VG-40 / VG-30 Heavy Duty Viscosity Grade Bitumen'
    );
  });

  it('handles empty or missing names gracefully', () => {
    expect(sanitizeProductName('')).toBe('Standard Quality Specification');
    expect(sanitizeProductName(undefined as unknown as string)).toBe('Standard Quality Specification');
  });
});

describe('Quality Sanitizer - sanitizeQualitySpec', () => {
  it('removes commercial brands and Quality Specification prefixes', () => {
    const rawSpec = 'Quality Specification: Tata Steel Fe 550D compliant with high elongation';
    const cleaned = sanitizeQualitySpec(rawSpec);
    expect(cleaned).not.toContain('Tata');
    expect(cleaned).not.toContain('Quality Specification:');
    expect(cleaned).toContain('Fe 550D');
  });

  it('falls back to BIS standard code when spec is empty', () => {
    const mockProduct: Partial<RecommendedProduct> = {
      bisStandardCode: 'IS 1786:2008'
    };
    expect(sanitizeQualitySpec('', mockProduct)).toBe('IS 1786:2008 Specification');
    expect(sanitizeQualitySpec('')).toBe('BIS Technical Quality Standard');
  });
});

describe('Quality Sanitizer - sanitizeProduct and sanitizeCartItem', () => {
  const sampleProduct: RecommendedProduct = {
    id: 'prod-tmt-1',
    materialCategory: 'steel',
    name: 'Tata Tiscon Fe 550D Super Ductile',
    brand: 'Tata Steel Limited',
    recommendationRank: 'highly_recommended',
    rankTitle: 'Highly Recommended',
    rankExplanation: 'Ranked #1 for seismic resilience by Tata Steel technical engineering lab.',
    bisStandardCode: 'IS 1786:2008',
    bisStandardTitle: 'High Strength Deformed Steel Bars — Specification',
    bisVerificationStatus: 'Verified',
    certificationReference: 'BIS License CM/L-7832910',
    qualityFeatures: {
      strength: '550 N/mm²',
      durability: 'Advanced seismic shock ductility',
      constructionSuitability: 'Heavy RCC structural columns and beams',
      safetyNotes: 'High energy absorption in seismic zones'
    },
    unitPrice: 72,
    unit: 'kg',
    packageDetails: 'Tata Tiscon bundle with hologram seals',
    availability: 'Immediate Dispatch',
    environmentalRating: 'Green Pro Certified',
    userRating: 4.8
  };

  it('completely removes all corporate brand mentions across all product fields', () => {
    const cleanProduct = sanitizeProduct(sampleProduct);

    expect(cleanProduct.name).toBe('Fe 550D Super Ductile Grade');
    expect(cleanProduct.brand).not.toContain('Tata');
    expect(cleanProduct.rankExplanation).not.toContain('Tata');
    expect(cleanProduct.packageDetails).not.toContain('Tata');
  });

  it('sanitizes full CartItem structures consistently', () => {
    const cartItem: CartItem = {
      id: 'cart-1',
      projectId: 'proj-1',
      projectName: 'Metro Arcade',
      materialCategory: 'steel',
      materialName: 'Tata Tiscon Rebar 12mm',
      product: sampleProduct,
      quantity: 5000,
      unit: 'kg',
      unitPrice: 72,
      totalCost: 360000,
      wastageFactorPct: 3
    };

    const cleanCartItem = sanitizeCartItem(cartItem);

    expect(cleanCartItem.materialName).not.toContain('Tata');
    expect(cleanCartItem.product.name).not.toContain('Tata');
    expect(cleanCartItem.product.brand).not.toContain('Tata');
  });
});

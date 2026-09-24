import { describe, it, expect } from 'vitest';
import { CartItem, QuotationRecord } from '../../src/types';
import { sanitizeProduct, sanitizeCartItem } from '../../src/utils/qualitySanitizer';
import { ALL_PRODUCTS_DATABASE } from '../../src/data/productsDatabase';

describe('Quotation & Financial Calculation Logic', () => {
  const cementProd = ALL_PRODUCTS_DATABASE.find((p) => p.materialCategory === 'cement')!;
  const steelProd = ALL_PRODUCTS_DATABASE.find((p) => p.materialCategory === 'steel')!;

  it('correctly calculates cart subtotal, freight, labor, contingency and GST', () => {
    const cleanCement = sanitizeProduct(cementProd);
    const cleanSteel = sanitizeProduct(steelProd);

    const items: CartItem[] = [
      sanitizeCartItem({
        id: 'item-1',
        projectId: 'proj-1',
        projectName: 'Test Arcade',
        materialCategory: 'cement',
        materialName: cleanCement.name,
        product: cleanCement,
        quantity: 1000,
        unit: 'bag',
        unitPrice: 400,
        totalCost: 400000,
        wastageFactorPct: 5
      }),
      sanitizeCartItem({
        id: 'item-2',
        projectId: 'proj-1',
        projectName: 'Test Arcade',
        materialCategory: 'steel',
        materialName: cleanSteel.name,
        product: cleanSteel,
        quantity: 5000,
        unit: 'kg',
        unitPrice: 70,
        totalCost: 350000,
        wastageFactorPct: 3
      })
    ];

    const rawMaterialCost = items.reduce((acc, i) => acc + i.totalCost, 0);
    expect(rawMaterialCost).toBe(750000);

    // Logistics breakdown standard multipliers
    const transportMultiplier = 0.045; // 4.5%
    const laborMultiplier = 0.18;      // 18%
    const contingencyMultiplier = 0.05; // 5%
    const gstRate = 0.18;             // 18% GST

    const transportCost = Math.round(rawMaterialCost * transportMultiplier);
    const laborCost = Math.round(rawMaterialCost * laborMultiplier);
    const contingency = Math.round((rawMaterialCost + transportCost + laborCost) * contingencyMultiplier);
    const preTaxSubtotal = rawMaterialCost + transportCost + laborCost + contingency;
    const gstAmount = Math.round(preTaxSubtotal * gstRate);
    const grandTotal = preTaxSubtotal + gstAmount;

    expect(transportCost).toBe(33750);
    expect(laborCost).toBe(135000);
    expect(contingency).toBe(45938);
    expect(preTaxSubtotal).toBe(964688);
    expect(gstAmount).toBe(173644);
    expect(grandTotal).toBe(1138332);
  });

  it('validates quotation generation data model', () => {
    const quote: QuotationRecord = {
      id: 'QUOT-TEST-001',
      quotationNumber: 'SX-QT-2026-001',
      projectId: 'proj-1',
      projectName: 'Metro North Business Arcade',
      category: 'building',
      location: 'Ring Road Phase 2, Indore',
      date: '2026-09-23',
      items: [],
      financials: {
        rawMaterialsTotal: 500000,
        transportationCost: 22500,
        laborCost: 90000,
        contingencyCost: 30625,
        taxGst: 115763,
        grandTotal: 758888
      },
      missingMaterials: []
    };

    expect(quote.id).toMatch(/^QUOT-/);
    expect(quote.financials.grandTotal).toBeGreaterThan(quote.financials.rawMaterialsTotal);
    expect(quote.category).toBe('building');
  });
});

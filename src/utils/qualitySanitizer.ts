import { RecommendedProduct, CartItem } from '../types';

const COMPANY_PATTERNS = [
  /UltraTech\s*(Cement)?(\s*\(Aditya\s*Birla\s*Group\))?/gi,
  /Aditya\s*Birla(\s*Group)?/gi,
  /Tata\s*(Tiscon|Steel)?(\s*(Limited|Ltd\.?))?/gi,
  /Ambuja\s*(Cements?|Plus|Kawach)?(\s*(Limited|Ltd\.?))?/gi,
  /ACC\s*(Cement|Gold|Concrete)?(\s*(Limited|Ltd\.?))?/gi,
  /JSW\s*(NeoSteel|Steel)?(\s*(Limited|Ltd\.?))?/gi,
  /Jindal\s*(Steel|Panther)?(\s*(Limited|Ltd\.?|Power))?/gi,
  /Kamdhenu\s*(Nxt|Steel)?(\s*(Limited|Ltd\.?))?/gi,
  /SAIL(\s*Steel)?/gi,
  /RINL|Vizag\s*Steel/gi,
  /Shree\s*(Cement|Jung\s*Rodhak)?/gi,
  /Bangur(\s*Cement)?/gi,
  /Dalmia(\s*Cement)?/gi,
  /Birla(\s*(Gold|Samrat|Shakti|A1))?/gi,
  /Lafarge(\s*Cement)?/gi,
  /Prism\s*Johnson|Prism\s*Cement/gi,
  /Wonder\s*Cement/gi,
  /Asian\s*Paints|Berger|Nerolac|Dulux/gi,
  /Pidilite|Dr\.?\s*Fixit|Fevicol/gi,
  /Supreme|Astral|Finolex|Ashirvad/gi,
  /Kajaria|Somany|Nitco/gi,
  /\b(Limited|Ltd\.?|Pvt\.?\s*Ltd\.?|Corporation|Corp\.?|Company|Pvt)\b/gi
];

/**
 * Transforms any raw product or material name to a pure engineering quality grade,
 * strictly stripping any commercial company or brand references.
 */
export function sanitizeProductName(name: string, category?: string): string {
  if (!name) return 'Standard Quality Specification';

  const lower = name.toLowerCase();

  // Steel classification (e.g. Fe 550D, Fe 500D, Fe 500)
  if (lower.includes('550d') || lower.includes('550 d')) {
    return 'Fe 550D Super Ductile Grade';
  }
  if (lower.includes('500d') || lower.includes('500 d')) {
    return 'Fe 500D High Ductility Grade';
  }
  if (lower.includes('500') || (category === 'steel' && lower.includes('standard'))) {
    return 'Fe 500 Standard Commercial Grade';
  }

  // Cement classification (e.g. 53 Grade OPC, 43 Grade, PPC)
  if (lower.includes('53') || lower.includes('grade 53') || lower.includes('opc 53')) {
    return 'Grade 53 High-Early Strength OPC';
  }
  if (lower.includes('43') || lower.includes('ppc') || lower.includes('pozzolana') || lower.includes('fly ash')) {
    return 'Grade 43 Pozzolana Structural Cement (PPC / OPC 43)';
  }
  if (lower.includes('33') || (category === 'cement' && lower.includes('commercial'))) {
    return 'Grade 33 Standard Commercial Cement';
  }

  // Sand classification
  if (lower.includes('m-sand') || lower.includes('msand') || lower.includes('vsi')) {
    return 'IS 383 Zone II Hydro-Washed M-Sand Grade';
  }
  if (lower.includes('river sand') || lower.includes('natural')) {
    return 'IS 383 Zone II Screened Natural River Sand Grade';
  }
  if (lower.includes('zone iii')) {
    return 'IS 383 Zone III Standard Fine Aggregate Grade';
  }

  // Aggregates classification
  if (lower.includes('graded') || (lower.includes('20mm') && lower.includes('10mm'))) {
    return '20mm & 10mm Graded Machine-Crushed Basalt/Granite';
  }
  if (lower.includes('single') || lower.includes('trap')) {
    return '20mm Single-Size Machine-Crushed Trap Stone';
  }
  if (lower.includes('gravel') || lower.includes('semi-crushed')) {
    return '20mm Semi-Crushed Commercial Gravel Stone';
  }

  // Bricks / Blocks
  if (lower.includes('aac') || lower.includes('aerated') || lower.includes('block')) {
    return 'Class 1 Precision Autoclaved Aerated Concrete (AAC Block)';
  }
  if (lower.includes('class 10') || lower.includes('10.0')) {
    return 'Class 10.0 Machine-Pressed High-Density Brick';
  }
  if (lower.includes('class 5') || lower.includes('class 7') || lower.includes('red brick') || lower.includes('clay')) {
    return 'Class 5.0 / 7.5 Standard Kiln-Fired Red Brick';
  }

  // Bitumen
  if (lower.includes('vg-40') || lower.includes('vg40')) {
    return 'VG-40 / VG-30 Heavy Duty Viscosity Grade Bitumen';
  }
  if (lower.includes('vg-30') || lower.includes('vg30')) {
    return 'VG-30 Standard Paving Viscosity Bitumen';
  }
  if (lower.includes('vg-10') || lower.includes('vg10')) {
    return 'VG-10 Low Viscosity Paving Bitumen';
  }

  // Strip known company names with regex
  let cleaned = name;
  for (const pattern of COMPANY_PATTERNS) {
    cleaned = cleaned.replace(pattern, '');
  }
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned || 'BIS Verified Engineering Specification';
}

/**
 * Formats a clean, professional quality specification string
 * with ZERO company or manufacturer names.
 */
export function sanitizeQualitySpec(spec: string, product?: Partial<RecommendedProduct>): string {
  if (!spec && product?.bisStandardCode) {
    return `${product.bisStandardCode} Specification`;
  }
  if (!spec) return 'BIS Technical Quality Standard';

  let cleaned = spec;
  // Remove "Quality Specification:" prefix if it exists to avoid redundancy
  cleaned = cleaned.replace(/^quality\s*spec(ification)?[:\s\-–]+/i, '');

  // Strip all company names
  for (const pattern of COMPANY_PATTERNS) {
    cleaned = cleaned.replace(pattern, '');
  }

  // Clean remaining symbols
  cleaned = cleaned
    .replace(/\(\s*\)/g, '')
    .replace(/•\s*•/g, '•')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned || cleaned.length < 3) {
    return product?.bisStandardCode ? `${product.bisStandardCode} Standard` : 'BIS Quality Specification';
  }

  return cleaned;
}

/**
 * Sanitizes an entire RecommendedProduct object to guarantee no company names exist anywhere.
 */
export function sanitizeProduct(product: RecommendedProduct): RecommendedProduct {
  if (!product) return product;

  const category = product.materialCategory;
  const cleanName = sanitizeProductName(product.name, category);
  const cleanBrand = sanitizeQualitySpec(product.brand, product);

  let cleanRankExplanation = product.rankExplanation || '';
  for (const pattern of COMPANY_PATTERNS) {
    cleanRankExplanation = cleanRankExplanation.replace(pattern, '');
  }
  cleanRankExplanation = cleanRankExplanation.replace(/\s+/g, ' ').trim();

  let cleanPackage = product.packageDetails || '';
  for (const pattern of COMPANY_PATTERNS) {
    cleanPackage = cleanPackage.replace(pattern, '');
  }
  cleanPackage = cleanPackage.replace(/\s+/g, ' ').trim();

  return {
    ...product,
    name: cleanName,
    brand: cleanBrand,
    rankExplanation: cleanRankExplanation,
    packageDetails: cleanPackage
  };
}

/**
 * Sanitizes a CartItem, ensuring its internal product and label contain zero company names.
 */
export function sanitizeCartItem(item: CartItem): CartItem {
  if (!item) return item;
  const cleanProd = sanitizeProduct(item.product);
  const cleanMaterialName = sanitizeProductName(item.materialName || item.product.name, item.materialCategory);

  return {
    ...item,
    materialName: cleanMaterialName,
    product: cleanProd
  };
}

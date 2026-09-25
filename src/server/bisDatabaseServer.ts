export interface BisStandardRecord {
  code: string;
  title: string;
  category: string;
  scope: string;
  edition?: string;
  latestAmendment?: string;
  isMandatoryQco: boolean;
  qcoReference: string;
  issuingMinistry: string;
  keyRequirements: string[];
  mandatoryTests: string[];
  fieldTestingTips: string[];
  referenceDocument: string;
  verificationSource: string;
  bisUrl: string;
  manakonlineUrl: string;
}

export function getBisVerificationUrl(isCode: string): string {
  const baseCode = isCode.split(':')[0].trim();
  return `https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails?is_no=${encodeURIComponent(baseCode)}`;
}

export function getManakonlineUrl(isCode: string): string {
  const baseCode = isCode.split(':')[0].trim();
  return `https://www.manakonline.in/MANAK/searchCertificationProduct.action?standardNo=${encodeURIComponent(baseCode)}`;
}

export const SERVER_BIS_REGISTRY: BisStandardRecord[] = [
  {
    code: 'IS 1786:2008',
    title: 'High Strength Deformed Steel Bars and Wires for Concrete Reinforcement — Specification (Fourth Revision)',
    category: 'Steel Reinforcement',
    scope: 'Defines chemical limits, mechanical properties, rib geometry, and mandatory ISI certification for thermo-mechanically treated (TMT) rebars in grades Fe 415, Fe 500, Fe 500D, Fe 550, Fe 550D, and Fe 600.',
    edition: 'Fourth Revision',
    latestAmendment: 'Amendment A3:2021',
    isMandatoryQco: true,
    qcoReference: 'Steel and Steel Products (Quality Control) Order, 2024 (Ministry of Steel)',
    issuingMinistry: 'Ministry of Steel & BIS',
    keyRequirements: [
      'Minimum Yield / 0.2% Proof Stress: 550 N/mm² (Fe 550D) or 500 N/mm² (Fe 500D)',
      'Minimum percentage elongation: 16.0% (Fe 500D) / 14.5% (Fe 550D)',
      'Tensile Strength to Yield Stress ratio (TS/YS) ≥ 1.10 for high seismic ductility',
      'Total elongation at maximum force (Agt) ≥ 5.0%',
      'Phosphorus + Sulphur cap: Combined max 0.075% for "D" (Ductile) grades'
    ],
    mandatoryTests: [
      'Tensile Strength, 0.2% Proof Stress & % Elongation (IS 1608 Part 1)',
      '180° Cold Bend and Rebend Test (IS 1599)',
      'Chemical Spectrometry for C, S, P and Carbon Equivalent (IS 228)',
      'Relative Rib Area (AR) & Deformation Geometry Measurement'
    ],
    fieldTestingTips: [
      'Check for hot-embossed brand, grade (e.g. Fe 500D), and BIS ISI mark every meter along the bar length',
      'Cross-section etch must show a tempered martensite perimeter ring and soft ferrite-pearlite core',
      'Verify test certificate against heat/cast number stamped on bundle metal tags'
    ],
    referenceDocument: 'Bureau of Indian Standards Sectional Committee MTD 28',
    verificationSource: 'BIS Standards Portal & Central Laboratory Quality Records',
    bisUrl: getBisVerificationUrl('IS 1786'),
    manakonlineUrl: getManakonlineUrl('IS 1786')
  },
  {
    code: 'IS 269:2015',
    title: 'Ordinary Portland Cement (33, 43 and 53 Grades) — Specification (Sixth Revision)',
    category: 'Cement',
    scope: 'Covers mandatory chemical, physical, and strength criteria for Ordinary Portland Cement intended for structural RCC columns, beams, footings, and high-strength concrete elements.',
    edition: 'Sixth Revision',
    latestAmendment: 'Amendment A1:2023',
    isMandatoryQco: true,
    qcoReference: 'Cement (Quality Control) Order, 2023 (DPIIT - Ministry of Commerce and Industry)',
    issuingMinistry: 'DPIIT & Ministry of Commerce and Industry',
    keyRequirements: [
      'Minimum 28-day compressive strength: 53.0 MPa (Grade 53) or 43.0 MPa (Grade 43)',
      'Specific surface area (fineness by Blaine method): Not less than 225 m²/kg',
      'Initial setting time: Not less than 30 minutes; Final setting time: Not more than 600 minutes',
      'Soundness by Le-Chatelier method: Not more than 10 mm expansion',
      'Insoluble residue: Not more than 5.0% by mass; Total loss on ignition: Not more than 4.0%'
    ],
    mandatoryTests: [
      'Compressive Strength Test at 3, 7, and 28 Days (IS 4031 Part 6)',
      'Normal Consistency & Setting Times (IS 4031 Part 4 & 5)',
      'Fineness by Blaine Air Permeability (IS 4031 Part 2)',
      'Soundness Test by Le-Chatelier (IS 4031 Part 3)'
    ],
    fieldTestingTips: [
      'Cement bag must be cool to the touch and completely free from hardened lumps',
      'Check manufacturing date printed on bag; bags older than 90 days must be re-tested before use',
      'Ensure tamper-evident stitched HDPE valve bag bears authentic red BIS ISI mark'
    ],
    referenceDocument: 'Bureau of Indian Standards Sectional Committee CED 2',
    verificationSource: 'BIS Conformity Certification Division & National Council for Cement and Building Materials (NCCBM)',
    bisUrl: getBisVerificationUrl('IS 269'),
    manakonlineUrl: getManakonlineUrl('IS 269')
  },
  {
    code: 'IS 456:2000',
    title: 'Plain and Reinforced Concrete — Code of Practice (Fourth Revision)',
    category: 'Structural Design & Mixes',
    scope: 'The core Indian civil engineering standard governing design and construction of plain and reinforced concrete in buildings, bridges, and infrastructure.',
    edition: 'Fourth Revision',
    latestAmendment: 'Consolidated Amendments 1 to 5',
    isMandatoryQco: true,
    qcoReference: 'National Building Code 2016 & CPWD General Specifications',
    issuingMinistry: 'Bureau of Indian Standards & CPWD',
    keyRequirements: [
      'Minimum grade of concrete for RCC: M20 (M25 or M30 recommended for multi-storey frames)',
      'Minimum cementitious content: 300 kg/m³ (moderate exposure) to 360 kg/m³ (extreme exposure)',
      'Maximum water-cement ratio: 0.50 (moderate) to 0.40 (extreme)',
      'Minimum clear nominal cover: 20mm for slabs, 25mm for beams, 40mm for columns, 50mm for footings'
    ],
    mandatoryTests: [
      'Slump Cone Workability Test at site placement (IS 1199 Part 2)',
      '28-day Concrete Cube Compressive Strength Test (IS 516)',
      'Density and Yield of Fresh Concrete (IS 1199 Part 3)'
    ],
    fieldTestingTips: [
      'Casting cubes in standard 150x150x150 mm steel moulds compacted in 3 equal layers',
      'Curing cubes submerged in clean lime-saturated water at 27 ± 2°C until test date',
      'Never add unauthorized site water to transit mixers upon delivery'
    ],
    referenceDocument: 'Civil Engineering Division Council CED 2',
    verificationSource: 'Central Public Works Department (CPWD) & BIS Guidelines',
    bisUrl: getBisVerificationUrl('IS 456'),
    manakonlineUrl: getManakonlineUrl('IS 456')
  },
  {
    code: 'IS 383:2016',
    title: 'Coarse and Fine Aggregate for Concrete from Natural & Manufactured Sources — Specification (Third Revision)',
    category: 'Aggregates & Sand',
    scope: 'Covers physical and chemical specifications for crushed rock coarse aggregates (20mm, 10mm) and fine aggregate (natural river sand and manufactured sand / M-Sand) in concrete mixes.',
    edition: 'Third Revision',
    latestAmendment: 'Amendment A1:2021',
    isMandatoryQco: true,
    qcoReference: 'CPWD Works Manual & BIS Aggregates Compliance Audits',
    issuingMinistry: 'Bureau of Indian Standards',
    keyRequirements: [
      'Fine aggregate classification into Grading Zones I, II, III, or IV (Zone II preferred for RCC)',
      'Combined Flakiness and Elongation Index: Maximum 35% for coarse aggregate (max 30% for high strength)',
      'Aggregate Impact Value: Maximum 30% for concrete wearing surfaces, 45% for general concrete',
      'Silt and clay content in sand: Not exceeding 3.0% by weight for natural sand, 7.0% for washed M-Sand'
    ],
    mandatoryTests: [
      'Sieve Analysis for Particle Size Distribution (IS 2386 Part 1)',
      'Flakiness and Elongation Index (IS 2386 Part 1)',
      'Aggregate Crushing & Impact Value (IS 2386 Part 4)',
      'Specific Gravity and Water Absorption (IS 2386 Part 3)'
    ],
    fieldTestingTips: [
      'Field silt jar test: Shake sand with 1% saline water in measuring cylinder; silt layer settling on top must be < 6%',
      'Inspect 20mm blue metal stone for cubical angular shape; reject flaky slabby stones',
      'M-Sand must be hydro-washed and certified zero-clay quarry dust'
    ],
    referenceDocument: 'BIS CED 2 Sectional Committee',
    verificationSource: 'NABL Certified Laboratories & BIS Audits',
    bisUrl: getBisVerificationUrl('IS 383'),
    manakonlineUrl: getManakonlineUrl('IS 383')
  },
  {
    code: 'IS 1893 (Part 1):2016',
    title: 'Criteria for Earthquake Resistant Design of Structures — Part 1: General Provisions and Buildings (Sixth Revision)',
    category: 'Seismic & Structural Design',
    scope: 'Specifies seismic design principles, response spectrum curves, seismic zones (II, III, IV, V), importance factors, and ductility reduction factors for earthquake-safe civil structures in India.',
    edition: 'Sixth Revision',
    latestAmendment: 'Amendment A2:2021',
    isMandatoryQco: true,
    qcoReference: 'National Disaster Management Authority (NDMA) & National Building Code 2016',
    issuingMinistry: 'Ministry of Housing and Urban Affairs & BIS',
    keyRequirements: [
      'Classification of building importance: Factor 1.2 to 1.5 for institutional/public buildings',
      'Design horizontal seismic coefficient Ah calculation based on Zone Factor (Z) and Response Reduction (R)',
      'Inter-storey drift limitation under design lateral force (shall not exceed 0.004 times storey height)',
      'Separation between adjacent buildings to prevent pounding'
    ],
    mandatoryTests: [
      'Dynamic Modal Response Spectrum Analysis for buildings exceeding 15m in Zone IV/V',
      'Torsional Irregularity Ratio Check',
      'P-Delta Effect Evaluation'
    ],
    fieldTestingTips: [
      'Ensure foundation ties interconnect all isolated column footings in seismic zones IV and V',
      'Strictly avoid soft-storey ground floors without shear wall bracing or ductile columns'
    ],
    referenceDocument: 'BIS CED 39 Earthquake Engineering Committee',
    verificationSource: 'CPWD Structural Norms & IIT Seismic Engineering Consortium',
    bisUrl: getBisVerificationUrl('IS 1893'),
    manakonlineUrl: getManakonlineUrl('IS 1893')
  },
  {
    code: 'IS 13920:2016',
    title: 'Ductile Design and Detailing of Reinforced Concrete Structures Subjected to Seismic Forces — Code of Practice (First Revision)',
    category: 'Seismic & Structural Design',
    scope: 'Mandatory reinforcement detailing guidelines for beams, columns, beam-column joints, and shear walls to provide ductile energy absorption under intense cyclic seismic shaking.',
    edition: 'First Revision',
    latestAmendment: 'Reaffirmed 2021',
    isMandatoryQco: true,
    qcoReference: 'National Building Code 2016 Part 6 Structural Design',
    issuingMinistry: 'Bureau of Indian Standards',
    keyRequirements: [
      'Mandatory use of ductile steel grades (Fe 500D or Fe 550D) with minimum 14.5% to 16% elongation',
      'Closely spaced transverse hoop confining ties (spacing <= min of d/4 or 100mm) at column ends',
      'Special 135° hook anchorage bends with 10-diameter hook extension on all stirrups and links',
      'Lap splices strictly prohibited within beam plastic hinge zones and beam-column joint cores'
    ],
    mandatoryTests: [
      'Verification of 135° stirrup end hooks and 10d extension in fabrication yard',
      'Joint core stirrup confinement verification before shuttering',
      'Mechanical coupler tensile slip test per IS 16172 where lap splices are replaced'
    ],
    fieldTestingTips: [
      'Measure stirrup spacing near beam and column joints with measuring tape; must not exceed 100mm',
      'Reject rebars bent with sharp 90° hooks where 135° seismic hooks are specified'
    ],
    referenceDocument: 'BIS CED 39 Earthquake Engineering Sectional Committee',
    verificationSource: 'BIS National Building Code Audits',
    bisUrl: getBisVerificationUrl('IS 13920'),
    manakonlineUrl: getManakonlineUrl('IS 13920')
  },
  {
    code: 'IS 2062:2021',
    title: 'Hot Rolled Medium and High Tensile Structural Steel — Specification (Eighth Revision)',
    category: 'Structural Steel',
    scope: 'Prescribes chemical, physical, and impact toughness requirements for hot-rolled structural steel plates, sheets, angles, channels, and beams used in bolted and welded steel structures.',
    edition: 'Eighth Revision',
    latestAmendment: 'Amendment A1:2023',
    isMandatoryQco: true,
    qcoReference: 'Steel and Steel Products (Quality Control) Order, 2024 (Ministry of Steel)',
    issuingMinistry: 'Ministry of Steel & BIS',
    keyRequirements: [
      'Yield strength grades: E250 (≥ 250 MPa), E300 (≥ 300 MPa), E350 (≥ 350 MPa), E410 (≥ 410 MPa)',
      'Sub-qualities: A (untested for impact), B (impact tested at 0°C), C (impact tested at -20°C)',
      'Carbon Equivalent (CE) max 0.42% for guaranteed weldability without preheating',
      'Charpy V-notch impact energy: Minimum 27 Joules at specified design test temperature'
    ],
    mandatoryTests: [
      'Tensile Strength, Yield Strength & Elongation (IS 1608 Part 1)',
      'Charpy V-Notch Impact Test (IS 1757 Part 1)',
      'Bend Test (IS 1599)',
      'Ultrasonic Testing for Internal Laminations (IS 4225 for heavy plates)'
    ],
    fieldTestingTips: [
      'Inspect mill test certificates for ladle analysis matching embossed heat numbers',
      'Check plate edges for laminations, piping, or deep shearing cracks'
    ],
    referenceDocument: 'BIS MTD 4 Metallurgical Engineering Committee',
    verificationSource: 'Steel Authority of India (SAIL) / Tata Steel / JSW Quality Manuals',
    bisUrl: getBisVerificationUrl('IS 2062'),
    manakonlineUrl: getManakonlineUrl('IS 2062')
  },
  {
    code: 'IS 73:2018',
    title: 'Paving Bitumen — Specification (Fifth Revision)',
    category: 'Road & Pavement',
    scope: 'Covers physical and rheological criteria for viscosity-graded paving bitumen (VG-10, VG-20, VG-30, and VG-40) for flexible highway and road pavements across India.',
    edition: 'Fifth Revision',
    latestAmendment: 'Amendment A1:2023',
    isMandatoryQco: true,
    qcoReference: 'Paving Bitumen (Quality Control) Order (Ministry of Petroleum & Natural Gas)',
    issuingMinistry: 'Ministry of Petroleum & Natural Gas / BIS',
    keyRequirements: [
      'Absolute Viscosity at 60°C: 2400 to 3600 Poises (VG-30) / 3200 to 4800 Poises (VG-40)',
      'Kinematic Viscosity at 135°C: Minimum 350 cSt (VG-30) / 400 cSt (VG-40)',
      'Flash Point (Cleveland Open Cup): Minimum 220°C',
      'Ductility at 25°C: Minimum 40 cm after thin film oven test',
      'Solubility in Trichloroethylene: Minimum 99.0% by mass'
    ],
    mandatoryTests: [
      'Absolute Viscosity Test via Vacuum Capillary Viscometer (IS 1206 Part 2)',
      'Penetration Test at 25°C (IS 1203)',
      'Softening Point Ring & Ball Test (IS 1205)',
      'Rolling Thin Film Oven Test (RTFOT)'
    ],
    fieldTestingTips: [
      'Verify refinery batch test report matching bulk tanker security seal number',
      'Check bitumen delivery temperature at asphalt plant: Must be 150°C - 165°C'
    ],
    referenceDocument: 'MoRTH Section 500 & BIS PCD 3 Committee',
    verificationSource: 'Indian Oil / Bharat Petroleum / HPCL Quality Records',
    bisUrl: getBisVerificationUrl('IS 73'),
    manakonlineUrl: getManakonlineUrl('IS 73')
  },
  {
    code: 'IS 14268:2022',
    title: 'Prestressing Steel — Uncoated Stress Relieved Low Relaxation Seven-Ply Strand for Prestressed Concrete — Specification (Third Revision)',
    category: 'Prestressing & Bridges',
    scope: 'Specifies 12.7mm and 15.2mm high-tensile 7-ply low relaxation steel strands used in precast prestressed bridge girders, flyovers, and post-tensioned slabs.',
    edition: 'Third Revision',
    latestAmendment: 'Consolidated Edition 2022',
    isMandatoryQco: true,
    qcoReference: 'Steel and Steel Products (Quality Control) Order, 2024 (Ministry of Steel)',
    issuingMinistry: 'Ministry of Steel & BIS',
    keyRequirements: [
      'Characteristic Breaking Strength: Minimum 1860 MPa (Class 2 Strands)',
      '0.2% Proof Load: Minimum 88% of characteristic breaking strength',
      'Elongation at Maximum Load: Minimum 3.5% on 600mm gauge length',
      '1000-Hour Isothermal Relaxation at 20°C: Maximum 2.5% at 70% UTS initial load'
    ],
    mandatoryTests: [
      'Tensile Breaking Load and 0.2% Proof Load Test',
      'Elongation at Maximum Load Test',
      '1000-hour Stress Relaxation Test',
      'Reverse Bend Test on individual wire plies'
    ],
    fieldTestingTips: [
      'Check for complete absence of red surface rust or pitting on coils',
      'Verify moisture-proof vapor corrosion inhibitor (VCI) wrapping on delivered coils'
    ],
    referenceDocument: 'BIS Metallurgical Committee MTD 28 & IRC:112',
    verificationSource: 'BIS Quality Certification Mark Division',
    bisUrl: getBisVerificationUrl('IS 14268'),
    manakonlineUrl: getManakonlineUrl('IS 14268')
  },
  {
    code: 'IS 2185 (Part 3):1984',
    title: 'Autoclaved Cellular (Aerated) Concrete Blocks — Specification (Part 3)',
    category: 'Masonry & Blocks',
    scope: 'Covers lightweight autoclaved aerated concrete (AAC) blocks used for precision non-load-bearing and load-bearing masonry wall construction in framed structures.',
    edition: 'Reaffirmed 2020',
    latestAmendment: 'Amendment 2:2018',
    isMandatoryQco: true,
    qcoReference: 'BIS Certification Marks Scheme for Masonry Units',
    issuingMinistry: 'Bureau of Indian Standards',
    keyRequirements: [
      'Oven-dry density: 551 to 650 kg/m³ (Grade 1 lightweight precision blocks)',
      'Compressive strength: Minimum 4.0 N/mm² (Grade 1)',
      'Drying shrinkage: Maximum 0.05% to eliminate wall plaster cracking',
      'Thermal conductivity: 0.16 to 0.24 W/m-K (superior thermal insulation)'
    ],
    mandatoryTests: [
      'Compressive Strength Test across dry and saturated states',
      'Block Dry Density and Moisture Content Test',
      'Drying Shrinkage Test'
    ],
    fieldTestingTips: [
      'Inspect block edges: Must have sharp 90° corners without spalling',
      'AAC blocks must be laid with thin-bed polymer adhesive mortar conforming to IS 15477 / ASTM C1660'
    ],
    referenceDocument: 'BIS CED 30 Committee & National Building Code SP 62',
    verificationSource: 'BIS License Verification Registry',
    bisUrl: getBisVerificationUrl('IS 2185'),
    manakonlineUrl: getManakonlineUrl('IS 2185')
  }
];

export function searchBisStandards(query?: string, category?: string): BisStandardRecord[] {
  let results = SERVER_BIS_REGISTRY;

  if (category && category !== 'All') {
    const catLower = category.toLowerCase();
    results = results.filter((s) => s.category.toLowerCase().includes(catLower));
  }

  if (query && query.trim()) {
    const q = query.toLowerCase().trim();
    results = results.filter(
      (s) =>
        s.code.toLowerCase().includes(q) ||
        s.title.toLowerCase().includes(q) ||
        s.scope.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.keyRequirements.some((r) => r.toLowerCase().includes(q))
    );
  }

  return results;
}

export function getBisStandardByCode(code: string): BisStandardRecord | undefined {
  const norm = code.trim().toLowerCase();
  return SERVER_BIS_REGISTRY.find(
    (s) => s.code.toLowerCase().includes(norm) || norm.includes(s.code.toLowerCase().split(':')[0])
  );
}

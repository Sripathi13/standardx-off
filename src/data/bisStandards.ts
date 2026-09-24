import { BisStandardInfo } from '../types';

export const BIS_STANDARDS_LIBRARY: BisStandardInfo[] = [
  {
    code: 'IS 269:2015',
    title: 'Ordinary Portland Cement (33, 43 and 53 Grades) — Specification',
    category: 'Cement',
    scope: 'Covers mandatory chemical, physical, and strength criteria for Ordinary Portland Cement intended for high-stress RCC framed columns, beams, bridge piers, and rigid pavements.',
    keyRequirements: [
      'Minimum 28-day compressive strength: 53 MPa (Grade 53) or 43 MPa (Grade 43)',
      'Specific surface area (fineness by Blaine method): Not less than 225 m²/kg',
      'Initial setting time: Not less than 30 minutes; Final setting time: Not more than 600 minutes',
      'Soundness by Le-Chatelier method: Not more than 10 mm expansion',
      'Total loss on ignition: Not more than 4.0% by mass'
    ],
    mandatoryTests: [
      'Compressive Strength Test (IS 4031 Part 6)',
      'Normal Consistency & Setting Times (IS 4031 Part 4 & 5)',
      'Fineness by Blaine Air Permeability (IS 4031 Part 2)',
      'Soundness Test (IS 4031 Part 3)'
    ],
    fieldTestingTips: [
      'Check for lumps or hard gritty particles by rubbing between thumb and forefinger',
      'Thrust hand into bag; cement must feel cool, not warm',
      'Sink test: Pinch of cement thrown in bucket of water should float briefly before sinking'
    ],
    referenceDocument: 'Bureau of Indian Standards, Manak Bhavan, 9 Bahadur Shah Zafar Marg, New Delhi',
    verificationSource: 'BIS Standards Portal & e-BIS Conformity Certification Division'
  },
  {
    code: 'IS 1489 (Part 1):2015',
    title: 'Portland Pozzolana Cement (Fly Ash Based) — Specification',
    category: 'Cement',
    scope: 'Specifies requirements for fly ash blended cement offering lower heat of hydration, pore refinement, and long-term compressive strength for foundations, masonry, plastering, and mass concreting.',
    keyRequirements: [
      'Fly ash replacement ratio: 15% to 35% by mass conforming to IS 3812',
      'Minimum compressive strength: 33 MPa at 28 days with continuous curing gain',
      'Drying shrinkage: Maximum 0.15%',
      'Sulphate and chloride penetration resistance significantly higher than OPC'
    ],
    mandatoryTests: [
      'Chemical analysis for insoluble residue and fly ash content',
      '28-day and 90-day compressive strength tracking',
      'Autoclave expansion soundness check (< 0.8%)'
    ],
    fieldTestingTips: [
      'PPC has a distinct greyish-green hue compared to darker OPC',
      'Ensures slower initial set which reduces shrinkage crack risk in sunny climates'
    ],
    referenceDocument: 'BIS National Building Code Section on Blended Hydraulic Cements',
    verificationSource: 'BIS Central Laboratory Quality Records'
  },
  {
    code: 'IS 1786:2008',
    title: 'High Strength Deformed Steel Bars and Wires for Concrete Reinforcement — Specification',
    category: 'Steel Reinforcement',
    scope: 'Defines chemical and mechanical parameters for thermo-mechanically treated (TMT) rebars in grades Fe 415, Fe 500, Fe 550, and ductility-enhanced Fe 500D / Fe 550D for seismic design.',
    keyRequirements: [
      'Minimum Yield / 0.2% Proof Stress: 550 N/mm² for Fe 550 / Fe 550D; 500 N/mm² for Fe 500D',
      'Minimum percentage elongation: 14.5% (Fe 550D) or 16.0% (Fe 500D) to absorb cyclic seismic shock',
      'Total Elongation at Maximum Force (Agt): Minimum 5%',
      'Strict phosphorus + sulphur cap: Combined maximum 0.075% for "D" (Ductile) grades',
      'Mandatory hot-stamped ISI mark with quality grade, standard specification, and bar diameter',
    ],
    mandatoryTests: [
      'Tensile & 0.2% Proof Stress Test (IS 1608)',
      'Bend and Re-bend Test over specified mandrel diameters without rupture (IS 1599)',
      'Chemical Spectrometry for Carbon Equivalent (CE <= 0.42)'
    ],
    fieldTestingTips: [
      'Verify embossed specification grade and BIS CM/L license number directly on the rebar every meter',
      'Rebar core must show a tempered martensitic outer ring and soft ferrite-pearlite core in cross-section etch',
      'Inspect for surface pitting or loose rust scale; clean rust-free surface is essential for bond strength'
    ],
    referenceDocument: 'BIS Metallurgical Engineering Sectional Committee MTD 28',
    verificationSource: 'National Accreditation Board for Testing and Calibration Laboratories (NABL) / BIS'
  },
  {
    code: 'IS 383:2016',
    title: 'Coarse and Fine Aggregate for Concrete from Natural & Manufactured Sources — Specification',
    category: 'Aggregates & Sand',
    scope: 'Covers physical and chemical specifications for crushed rock coarse aggregates (20mm, 10mm) and fine aggregate (River Sand and Manufactured Sand / M-Sand) in concrete mixes.',
    keyRequirements: [
      'Fine aggregate classification into Grading Zones I, II, III, or IV (Zone II preferred for RCC structural work)',
      'Flakiness and Elongation Index combined: Not exceeding 35% for coarse aggregate',
      'Aggregate Crushing Value: Maximum 30% for concrete wearing surfaces, 45% for general concrete',
      'Aggregate Impact Value: Maximum 30% for wearing surfaces (highways/pavements)',
      'Silt and clay content in sand: Not exceeding 3.0% by weight for natural sand, 7.0% for M-Sand without clay minerals'
    ],
    mandatoryTests: [
      'Sieve Analysis for Particle Size Distribution (IS 2386 Part 1)',
      'Specific Gravity and Water Absorption (IS 2386 Part 3)',
      'Aggregate Impact & Abrasion Test via Los Angeles Machine (IS 2386 Part 4)',
      'Deleterious Materials and Organic Impurities Test (IS 2386 Part 2)'
    ],
    fieldTestingTips: [
      'Field silt jar test: Shake sand with saline water in glass cylinder; silt layer settling on top must be < 6%',
      'Inspect 20mm blue metal stone for angular shape; avoid flaky needle-like pieces',
      'Check M-Sand for washed zero-clay manufacturing certification'
    ],
    referenceDocument: 'Civil Engineering Division Council CED 2',
    verificationSource: 'BIS Certified Quarry Compliance Audits'
  },
  {
    code: 'IS 1077:1992',
    title: 'Common Burnt Clay Building Bricks — Specification',
    category: 'Bricks & Masonry',
    scope: 'Prescribes dimensions, compressive strength classes, water absorption, and efflorescence tolerance for burnt clay building bricks.',
    keyRequirements: [
      'Standard modular size: 190 mm x 90 mm x 90 mm (or conventional non-modular 230 x 115 x 75 mm)',
      'Compressive strength classes: Class 10 (10 N/mm²), Class 7.5 (7.5 N/mm²), Class 5 (5.0 N/mm²)',
      'Water absorption after 24-hour immersion: Maximum 20% by weight for up to Class 12.5',
      'Efflorescence rating: Nil to slight; must not show heavy salt crystal crust'
    ],
    mandatoryTests: [
      'Compressive Strength Test (IS 3495 Part 1)',
      'Water Absorption Test (IS 3495 Part 2)',
      'Efflorescence Test (IS 3495 Part 3)'
    ],
    fieldTestingTips: [
      'Drop test: Brick should not shatter when dropped flat from 1.0 to 1.2 m height onto hard ground',
      'Sound test: Two bricks struck together should produce a clear metallic ringing sound',
      'Scratch test: Finger nail should not leave an impression on surface'
    ],
    referenceDocument: 'BIS Building Construction and Materials Division',
    verificationSource: 'BIS Regional Testing Center Specifications'
  },
  {
    code: 'IS 2185 (Part 3):1984',
    title: 'Autoclaved Cellular (Aerated) Concrete Blocks — Specification',
    category: 'Bricks & Masonry',
    scope: 'Covers precast autoclaved aerated concrete (AAC) blocks used for load-bearing and non-load-bearing internal and external masonry walls.',
    keyRequirements: [
      'Dry density range: 451 to 1000 kg/m³ (Grade 1 & 2)',
      'Compressive strength: Minimum 3.0 to 4.5 N/mm² for masonry walls',
      'Thermal conductivity (k-value): 0.16 to 0.24 W/m-K (3x better insulation than red bricks)',
      'Fire resistance rating: Up to 4 hours for 200 mm block wall'
    ],
    mandatoryTests: [
      'Density and Moisture Content Test',
      'Block Compressive Strength Test across dry and saturated conditions',
      'Drying Shrinkage Test (< 0.05%)'
    ],
    fieldTestingTips: [
      'Weigh sample block; lightweight uniform cellular aeration prevents building foundation dead load',
      'Check block edges for crisp right angles and absence of deep shipping spalls'
    ],
    referenceDocument: 'Bureau of Indian Standards Special Publication SP 62',
    verificationSource: 'BIS Approved AAC Manufacturing Facilities'
  },
  {
    code: 'IS 73:2013',
    title: 'Paving Bitumen — Specification (Fourth Revision)',
    category: 'Road & Pavement',
    scope: 'Covers physical and rheological requirements for viscosity graded paving bitumen (VG-10, VG-20, VG-30, and VG-40) for flexible road construction under diverse Indian climatic zones.',
    keyRequirements: [
      'Absolute Viscosity at 60°C: 2400 to 3600 Poises for VG-30 (Standard highway paving grade)',
      'Kinematic Viscosity at 135°C: Minimum 350 cSt',
      'Flash Point (Cleveland Open Cup): Minimum 220°C',
      'Ductility at 25°C: Minimum 40 cm after thin film oven rolling test',
      'Solubility in Trichloroethylene: Minimum 99.0% by mass'
    ],
    mandatoryTests: [
      'Absolute Viscosity Test via Vacuum Capillary Viscometer (IS 1206 Part 2)',
      'Penetration Test at 25°C (IS 1203)',
      'Softening Point Ring & Ball Test (IS 1205)',
      'Rolling Thin Film Oven Test (RTFOT)'
    ],
    fieldTestingTips: [
      'Verify refinery test certificate batch number matching tanker seal',
      'Check delivery temperature at site: Must be maintained between 150°C and 165°C during mixing'
    ],
    referenceDocument: 'Ministry of Road Transport and Highways (MoRTH) Section 500 & BIS PCD 3',
    verificationSource: 'Indian Oil / Bharat Petroleum / HPCL Refinery Conformity Audits'
  },
  {
    code: 'IS 456:2000',
    title: 'Plain and Reinforced Concrete — Code of Practice (Fourth Revision)',
    category: 'Structural Design & Mixes',
    scope: 'The foundational Indian civil engineering code dealing with general structural use of plain and reinforced concrete in buildings, bridges, and infrastructure.',
    keyRequirements: [
      'Minimum cementitious content: 300 kg/m³ for RCC under moderate exposure, 320 kg/m³ under severe exposure',
      'Maximum water-cement ratio: 0.50 (moderate exposure) to 0.45 (severe exposure)',
      'Minimum grade of concrete for reinforced structural work: M20 (M25 or M30 recommended for multi-storey frames)',
      'Nominal concrete cover: Minimum 20mm for slabs, 25mm for beams, 40mm for columns, 50mm for footings'
    ],
    mandatoryTests: [
      'Slump Cone Workability Test (IS 1199)',
      '28-day Concrete Cube Compressive Strength Test (IS 516)',
      'Rapid Chloride Permeability Test (RCPT for durability)'
    ],
    fieldTestingTips: [
      'Ensure cubes are cast in standard 150x150x150 mm steel moulds, compacted in 3 layers, and cured submerged in water tank',
      'Never add unauthorized site water to concrete transit mixers after leaving batching plant'
    ],
    referenceDocument: 'BIS Civil Engineering Sectional Committee CED 2',
    verificationSource: 'Central Public Works Department (CPWD) & BIS Guidelines'
  },
  {
    code: 'IS 280:2006',
    title: 'Mild Steel Wire for General Engineering Purposes (Binding Wire)',
    category: 'Reinforcement Accessories',
    scope: 'Specifies soft annealed cold-drawn mild steel binding wire (18 to 20 gauge / 0.90 to 1.25 mm diameter) used to firmly tie TMT reinforcement intersections in beams, columns, and slabs.',
    keyRequirements: [
      'Tensile strength: 300 to 450 N/mm²',
      'Uniform dead-soft annealing to allow smooth twisting around rebar intersections without snap breakage',
      'Minimum elongation: 15% on 200 mm gauge length',
      'Clean surface free from harmful pitting or scale'
    ],
    mandatoryTests: [
      'Wrapping and Reverse Bend Test (IS 1755)',
      'Wire Tensile Strength Test'
    ],
    fieldTestingTips: [
      'Bend wire back and forth with fingers 6 times; it should bend smoothly without brittle cracking',
      'Check gauge thickness with a standard wire gauge (SWG 18 is 1.22mm, SWG 20 is 0.91mm)'
    ],
    referenceDocument: 'BIS Iron and Steel Sectional Committee',
    verificationSource: 'BIS Standard Quality Certification Mark'
  },
  {
    code: 'IRC:37-2018 & MoRTH Section 400',
    title: 'Guidelines for the Design of Flexible Pavements — Granular Sub-Base (GSB) & Wet Mix Macadam (WMM)',
    category: 'Road & Pavement',
    scope: 'Prescribes grading, compaction, dry density, and CBR limits for granular sub-base and wet mix macadam road structural foundations under heavy commercial traffic.',
    keyRequirements: [
      'GSB Grading I or II with minimum 30% California Bearing Ratio (CBR) compacted at 98% Modified Proctor Density',
      'WMM stone aggregate crushed uniformly with Los Angeles abrasion value not exceeding 30%',
      'Optimum Moisture Content (OMC) controlled to within ±0.5% during paver spreading',
      'Plasticity Index (PI) of fraction passing 425-micron sieve: Maximum 6 for durable sub-base drainage'
    ],
    mandatoryTests: [
      'Modified Proctor Compaction Test (IS 2720 Part 8)',
      'Field Dry Density by Sand Replacement or Nuclear Gauge (IS 2720 Part 28)',
      'Aggregate Flakiness & Elongation Tests'
    ],
    fieldTestingTips: [
      'Confirm smooth interlocking of aggregates without segregation during vibratory roller passes',
      'Verify water tank calibration during pugmill batching'
    ],
    referenceDocument: 'Indian Roads Congress (IRC) & MoRTH Fifth Revision Specifications',
    verificationSource: 'National Highways Authority of India (NHAI) Quality Manual'
  }
];

export const BIS_STANDARDS = BIS_STANDARDS_LIBRARY;

export function getBisStandardByCode(code: string): BisStandardInfo | undefined {
  const norm = code.trim().toLowerCase();
  return BIS_STANDARDS_LIBRARY.find((s) => s.code.toLowerCase().includes(norm) || norm.includes(s.code.toLowerCase()));
}

export function getBisStandardsByCategory(category: string): BisStandardInfo[] {
  const norm = category.trim().toLowerCase();
  return BIS_STANDARDS_LIBRARY.filter((s) => s.category.toLowerCase().includes(norm));
}


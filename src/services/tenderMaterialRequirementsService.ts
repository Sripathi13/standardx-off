import { ExtractedTenderRequirement } from './tenderExtractionService';

export interface ApplicableStandardDetail {
  code: string;
  title: string;
  role: 'Core Specification' | 'Mandatory Test' | 'Chemical Analysis' | 'Structural Design & Detailing' | 'Splicing & Couplers' | 'Corrosion & Coating' | 'Sampling & Quality Inspection';
  purpose: string;
  keyClauses?: string[];
  testParametersOrAcceptance?: string;
  isMandatoryQco?: boolean;
  bisUrl?: string;
}

export interface TenderRequiredProduct {
  id: string;
  category: string;
  productName: string;
  shortName: string;
  requiredGradeOrSpec: string;
  estimatedQuantity?: string;
  standardCode: string;
  standardTitle: string;
  editionAmendment: string;
  isMandatoryQco: boolean;
  qcoReference: string;
  issuingMinistry: string;
  mandatoryTests: string[];
  acceptanceCriteria: string;
  certificationType: 'BIS ISI Mark' | 'BIS CRS' | 'MoRTH / IRC Certified';
  certificationVerificationUrl: string;
  manakonlineSearchUrl: string;
  notesForProcurement: string;
  applicableStandards?: ApplicableStandardDetail[];
}

/**
 * Builds the official BIS Know Your Standards direct verification link
 */
export function getBisStandardVerificationUrl(isCode: string): string {
  // Clean standard code, e.g. 'IS 1786:2021' -> 'IS 1786'
  const baseCode = isCode.split(':')[0].trim();
  return `https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails?is_no=${encodeURIComponent(baseCode)}`;
}

/**
 * Builds the official Manakonline certified licensees search URL
 */
export function getManakonlineSearchUrl(isCode: string): string {
  const baseCode = isCode.split(':')[0].trim();
  return `https://www.manakonline.in/MANAK/searchCertificationProduct.action?standardNo=${encodeURIComponent(baseCode)}`;
}

/**
 * Authoritative ecosystem of applicable Indian Standards for TMT Reinforcement Bars
 */
export const TMT_REBAR_APPLICABLE_STANDARDS: ApplicableStandardDetail[] = [
  {
    code: 'IS 1786:2008',
    title: 'High strength deformed steel bars and wires for concrete reinforcement — Specification (Fourth Revision)',
    role: 'Core Specification',
    purpose: 'Governing product standard defining Thermo-Mechanically Treated (TMT) bars, strength grades (Fe 415, Fe 500, Fe 500D, Fe 550, Fe 550D, Fe 600), chemical limits, mechanical properties, rib deformation geometry, mass tolerances, and compulsory ISI marking.',
    keyClauses: [
      'Clause 4.2 & Table 1: Chemical composition thresholds for Carbon, Sulphur, Phosphorus, and Carbon Equivalent',
      'Clause 8.1 & Table 3: 0.2% Proof Stress, Tensile Strength, and percentage elongation requirements',
      'Clause 9 & Table 2: Rib height, transverse rib spacing, rib inclination angle, and Relative Rib Area (AR)',
      'Clause 11: Retest procedures, lot rejection, and batch acceptance criteria'
    ],
    testParametersOrAcceptance: 'Fe 500D: Min 0.2% Proof Stress = 500 MPa, Min UTS = 565 MPa, UTS/YS ratio ≥ 1.10, Min Elongation = 16.0%, Total Elongation at max force ≥ 5.0%. Fe 550D: Min Proof Stress = 550 MPa, UTS = 600 MPa, Elongation = 14.5%, UTS/YS ≥ 1.08.',
    isMandatoryQco: true,
    bisUrl: getBisStandardVerificationUrl('IS 1786')
  },
  {
    code: 'IS 1608 (Part 1):2018',
    title: 'Metallic materials — Tensile testing — Part 1: Method of test at room temperature (Aligned with ISO 6892-1)',
    role: 'Mandatory Test',
    purpose: 'National test method standard for evaluating yield stress, 0.2% non-proportional proof stress (Rp0.2), ultimate tensile strength (Rm), and percentage elongation after fracture (A) on full cross-section rebar samples.',
    keyClauses: [
      'Clause 6: Test piece cross-sectional area calculation based on measured mass and length',
      'Clause 7: Original gauge length calibration (Lo = 5.65 * sqrt(So))',
      'Clause 10.3: 0.2% proof stress determination using extensometer stress-strain curves',
      'Clause 13: Percentage elongation after fracture measurement between gauge punch marks'
    ],
    testParametersOrAcceptance: 'Strain-rate controlled tensile test using calibrated UTM. Specimen must break within the gauge length; slip in serrated wedge grips invalidates test.',
    isMandatoryQco: true,
    bisUrl: getBisStandardVerificationUrl('IS 1608')
  },
  {
    code: 'IS 1599:2019',
    title: 'Metallic materials — Bend test (Cold Mandrel Bend and Rebend Tests, ISO 7438)',
    role: 'Mandatory Test',
    purpose: 'Evaluates the plastic ductility and soundness of TMT rebars without developing surface fissures or brittle core failure. Crucial for verifying that rebars can be bent on-site into stirrups, rings, and cranked bars safely.',
    keyClauses: [
      'Clause 5: Test specimen length and mandrel former diameter specifications',
      'Clause 6: Continuous cold bending through 180° around specified mandrel without shock',
      'IS 1786 Annex A: Rebend test (bent through 135°, aged in boiling water at 100°C for 30 mins, cooled, then reverse bent through 22.5°)'
    ],
    testParametersOrAcceptance: '180° cold bend mandrel diameter per IS 1786 Table 4 (3d for Fe 500D up to 20mm; 4d for > 20mm). Outer convex surface must show zero cracks, splits, or fissures when examined visually.',
    isMandatoryQco: true,
    bisUrl: getBisStandardVerificationUrl('IS 1599')
  },
  {
    code: 'IS 228 (Part 1 to 24)',
    title: 'Methods of chemical analysis of steels and pig irons (Referee wet chemistry & combustion methods)',
    role: 'Chemical Analysis',
    purpose: 'Authoritative referee laboratory methods to determine precise mass percentages of Carbon, Sulphur, Phosphorus, Silicon, Manganese, and micro-alloying elements (V, Nb, Ti, B).',
    keyClauses: [
      'Part 1: Determination of Carbon by volumetric combustion and gravimetric methods',
      'Part 2: Determination of Sulphur by combustion/evolution alkalimetric methods',
      'Part 3: Determination of Phosphorus by alkalimetric/phosphomolybdate precipitation',
      'Part 9: Determination of Manganese by sodium arsenite titrimetric method'
    ],
    testParametersOrAcceptance: 'Statutory Fe 500D thresholds: Carbon max 0.25%, Sulphur max 0.040%, Phosphorus max 0.040%, Combined S+P max 0.075%, Carbon Equivalent (CE) max 0.42%.',
    isMandatoryQco: true,
    bisUrl: getBisStandardVerificationUrl('IS 228')
  },
  {
    code: 'IS 8811:1998',
    title: 'Methods for emission spectrometric analysis of plain carbon and low alloy steel (Optical Emission Spectrometry - OES)',
    role: 'Chemical Analysis',
    purpose: 'Rapid, precise spark optical emission spectrometry used in automated steel mill labs and independent NABL laboratories to quantitatively analyze 20+ elements in TMT rebars simultaneously within 60 seconds.',
    keyClauses: [
      'Clause 5: Spark excitation chamber, electrode gap, and argon gas purging',
      'Clause 7: Certified Reference Material (CRM) calibration and drift standardization',
      'Clause 9: Simultaneous computation of C, Si, Mn, P, S, Cr, Mo, Ni, Cu, V, Al, N, and Carbon Equivalent'
    ],
    testParametersOrAcceptance: 'Referee accuracy within ± 0.002% for Sulphur and Phosphorus; automated calculation of CE = C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15.',
    isMandatoryQco: false,
    bisUrl: getBisStandardVerificationUrl('IS 8811')
  },
  {
    code: 'IS 13920:2016',
    title: 'Ductile design and detailing of reinforced concrete structures subjected to seismic forces — Code of practice',
    role: 'Structural Design & Detailing',
    purpose: 'Statutory code mandating ductile grade rebars (Fe 500D / Fe 550D) for earthquake resistance in Seismic Zones III, IV, and V. Establishes critical beam-column joint anchoring, lap splice forbidden zones, and special confining link spacing.',
    keyClauses: [
      'Clause 5.1: Rebars must have minimum elongation of 16.0% and actual UTS / actual YS ratio ≥ 1.10',
      'Clause 5.2: Steel produced by re-rolling scrap rails or ship-breaking plates is strictly prohibited',
      'Clause 6.3: Lap splices shall not be provided within 2d of beam face or plastic hinge zones',
      'Clause 8: Special confining hoop reinforcement spacing (s ≤ 100 mm or d/4 of column member)'
    ],
    testParametersOrAcceptance: 'Requires super ductile Fe 500D/550D bars capable of absorbing severe earthquake cyclical reversals without sudden brittle rupture.',
    isMandatoryQco: true,
    bisUrl: getBisStandardVerificationUrl('IS 13920')
  },
  {
    code: 'IS 456:2000',
    title: 'Plain and reinforced concrete — Code of practice (Fourth Revision, Amendments 1 to 5)',
    role: 'Structural Design & Detailing',
    purpose: 'The foundational parent standard for all reinforced concrete design in India. Prescribes development length (Ld), tension/compression lap splices, clear cover to reinforcement for environmental exposures, and spacing limits.',
    keyClauses: [
      'Clause 26.2.1: Development length formula Ld = (phi * sigma_s) / (4 * tau_bd)',
      'Clause 26.2.5: Lap lengths in tension and compression, bar bundling rules',
      'Clause 26.4 & Table 16: Clear cover to rebar (20mm slabs, 25mm beams, 40mm columns, 50mm footings)',
      'Clause 26.5: Minimum steel limits (0.8% in columns, 0.12% in slabs, 0.85/fy in beams)'
    ],
    testParametersOrAcceptance: 'Table 21 design bond stress tau_bd: Deformed bars conforming to IS 1786 enjoy a 60% higher bond stress allowance compared to plain round mild steel bars.',
    isMandatoryQco: true,
    bisUrl: getBisStandardVerificationUrl('IS 456')
  },
  {
    code: 'IS 2502:1963',
    title: 'Code of practice for bending and fixing of bars for concrete reinforcement (Bar Bending Schedule - BBS)',
    role: 'Structural Design & Detailing',
    purpose: 'Standardizes the preparation of the Bar Bending Schedule (BBS), standard bar shapes, cutting allowances, bending deductions, hook lengths, and on-site tying tolerances.',
    keyClauses: [
      'Clause 4: Schedule of standard bent shapes, crank dimensions, and hook allowances',
      'Clause 5: Tolerances on cutting and bending (Cut length ± 25 mm, bent dimension ± 12 mm)',
      'Clause 6: Binding wire specifications (16 SWG annealed wire) and spacing chairs/cover blocks'
    ],
    testParametersOrAcceptance: 'Bar bend inner radius minimum 2d for mild steel and 4d for TMT deformed bars to prevent internal micro-fracture at bends.',
    isMandatoryQco: false,
    bisUrl: getBisStandardVerificationUrl('IS 2502')
  },
  {
    code: 'IS 16172:2014',
    title: 'Reinforcement couplers for mechanical splices of bars in concrete — Specification',
    role: 'Splicing & Couplers',
    purpose: 'Governs threaded and friction-welded mechanical couplers used to splice rebar ≥ 20mm diameter, eliminating lap congestion, steel overlap wastage, and concrete honeycombing in high-density RCC elements.',
    keyClauses: [
      'Clause 8.1: Static tensile test of coupler assembly (assembly must achieve > 100% of nominal UTS of bar)',
      'Clause 8.2: Total residual slip test (maximum slip ≤ 0.10 mm under specified tensile load)',
      'Clause 8.3: High-cycle and low-cycle tension-compression fatigue tests for seismic compliance',
      'Clause 9: On-site verification sampling (1 test set per 500 mechanical couplers installed)'
    ],
    testParametersOrAcceptance: 'Failure must occur by tensile rupture of the parent rebar outside the coupler sleeve. Zero thread pull-out or sleeve cracking allowed.',
    isMandatoryQco: true,
    bisUrl: getBisStandardVerificationUrl('IS 16172')
  },
  {
    code: 'IS 2751:1979 / IS 9417',
    title: 'Code of practice for welding of mild steel and cold-worked deformed bars for concrete reinforcement',
    role: 'Splicing & Couplers',
    purpose: 'Specifies welding methods (Flash Butt Welding, Shielded Metal Arc Welding - SMAW, Gas Pressure Welding) for joining reinforcement bars, preheating requirements, and weld inspection.',
    keyClauses: [
      'Clause 4: Carbon Equivalent calculation formula CE = C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15',
      'Clause 5: Welded rebar CE must not exceed 0.53% for unheated field welding',
      'Clause 7: Joint alignments, bevel preparations, and welder qualification records',
      'Clause 9: Welded joint tensile testing and visual inspection for undercut or porosity'
    ],
    testParametersOrAcceptance: 'Welded joint tensile test must yield a breaking strength ≥ 100% of the minimum specified ultimate tensile strength of the base steel grade.',
    isMandatoryQco: false,
    bisUrl: getBisStandardVerificationUrl('IS 2751')
  },
  {
    code: 'IS 13620:1993',
    title: 'Fusion bonded epoxy coated reinforcing bars — Specification',
    role: 'Corrosion & Coating',
    purpose: 'Specifies factory-applied electrostatic fusion bonded epoxy coating (FBEC) on TMT steel bars to resist aggressive chloride attack in coastal structures, marine jetties, basements, and water treatment plants.',
    keyClauses: [
      'Clause 6: Film thickness of epoxy coating (175 to 300 microns measured non-destructively)',
      'Clause 7: Continuity of coating (High-voltage holiday detector test: max 2 pinhole holidays per meter)',
      'Clause 8: Adhesion test by 180° mandrel bending at room temperature'
    ],
    testParametersOrAcceptance: 'Zero coating disbondment, cracking, or flaking around the bend mandrel; zero micro-pinholes under 67.5 V DC wet sponge holiday detector.',
    isMandatoryQco: true,
    bisUrl: getBisStandardVerificationUrl('IS 13620')
  },
  {
    code: 'IS 4905:2015',
    title: 'Random sampling and statistical inspection procedures (Aligned with ISO 2859)',
    role: 'Sampling & Quality Inspection',
    purpose: 'Provides statistical sampling rules for random selection of test pieces from delivered consignment bundles and cast heats, ensuring reliable lot acceptance and legal compliance.',
    keyClauses: [
      'Clause 4: Representative random sampling methods across bundled heats',
      'Clause 6: Acceptance Quality Limit (AQL) and criteria for conformity',
      'IS 1786 Lot Sizing: 1 sample set per 10 MT for bars < 10mm; 1 set per 25 MT for bars 10-16mm; 1 set per 50 MT for bars > 16mm'
    ],
    testParametersOrAcceptance: 'Every incoming truckload consignment must correlate with Manufacturer Mill Test Certificate (MTC) and cast heat numbers embossed on the rebars.',
    isMandatoryQco: false,
    bisUrl: getBisStandardVerificationUrl('IS 4905')
  }
];

/**
 * Comprehensive catalog of verified materials for Building projects
 */
const BUILDING_TENDER_MATERIALS: TenderRequiredProduct[] = [
  {
    id: 'bldg-rebar',
    category: 'Structural Reinforcement',
    productName: 'High Strength Deformed Steel Bars (TMT Rebars)',
    shortName: 'Steel TMT Rebars',
    requiredGradeOrSpec: 'Fe 550D / Fe 500D Super Ductile Grade (High Seismic Resistance)',
    estimatedQuantity: '73.5 Metric Tonnes (MT)',
    standardCode: 'IS 1786:2008',
    standardTitle: 'High strength deformed steel bars and wires for concrete reinforcement — Specification',
    editionAmendment: 'Fourth Revision (Consolidated with Amendments A1, A2, A3)',
    isMandatoryQco: true,
    qcoReference: 'Steel and Steel Products (Quality Control) Order, 2024 (Ministry of Steel)',
    issuingMinistry: 'Ministry of Steel & Bureau of Indian Standards',
    mandatoryTests: [
      'Tensile Strength, Yield Stress & % Elongation (IS 1608 Part 1)',
      '180° Cold Bend and Rebend Test (IS 1599)',
      'Chemical Spectrometry (Carbon, Sulphur, Phosphorus max 0.075%) per IS 228',
      'Relative Rib Area & Deformation Geometry Measurement'
    ],
    acceptanceCriteria: 'Min 0.2% Proof Stress: 500 MPa (Fe 500D) / 550 MPa (Fe 550D); Min Elongation: 16.0%; TS/YS ratio ≥ 1.10 for seismic ductile dissipation.',
    certificationType: 'BIS ISI Mark',
    certificationVerificationUrl: getBisStandardVerificationUrl('IS 1786'),
    manakonlineSearchUrl: getManakonlineSearchUrl('IS 1786'),
    notesForProcurement: 'Every single rebar must bear cast-in manufacturer brand, grade (Fe 500D), and BIS ISI stamp. Substandard scrap-rerolled rebars strictly prohibited.',
    applicableStandards: TMT_REBAR_APPLICABLE_STANDARDS
  },
  {
    id: 'bldg-cement',
    category: 'Cementitious Binders',
    productName: 'Ordinary Portland Cement (OPC 53 Grade)',
    shortName: 'Structural Cement 53 Grade',
    requiredGradeOrSpec: 'Grade 53 High Early Strength Portland Cement (IS 269:2015)',
    estimatedQuantity: '3,825 Bags (50 kg HDPE bags)',
    standardCode: 'IS 269:2015',
    standardTitle: 'Ordinary Portland Cement — Specification (Consolidated 33, 43 and 53 Grades)',
    editionAmendment: 'Sixth Revision (Amendment A1:2023)',
    isMandatoryQco: true,
    qcoReference: 'Cement (Quality Control) Order, 2023 (DPIIT - Ministry of Commerce and Industry)',
    issuingMinistry: 'DPIIT & Ministry of Commerce and Industry',
    mandatoryTests: [
      'Compressive Strength at 3, 7, and 28 Days (IS 4031 Part 6)',
      'Blaine Specific Surface Fineness (IS 4031 Part 2)',
      'Initial & Final Setting Time (IS 4031 Part 5)',
      'Soundness by Le-Chatelier Expansion (IS 4031 Part 3)'
    ],
    acceptanceCriteria: '28-Day Compressive Strength ≥ 53.0 MPa; Fineness ≥ 225 m²/kg; Initial Setting Time ≥ 30 mins; Le-Chatelier Soundness ≤ 10 mm.',
    certificationType: 'BIS ISI Mark',
    certificationVerificationUrl: getBisStandardVerificationUrl('IS 269'),
    manakonlineSearchUrl: getManakonlineSearchUrl('IS 269'),
    notesForProcurement: 'Must be procured in sealed tamper-proof bags with BIS ISI hallmark and batch CM/L number. Bags older than 90 days must be retested before use.',
    applicableStandards: [
      {
        code: 'IS 269:2015',
        title: 'Ordinary Portland Cement — Specification (Consolidated 33, 43 and 53 Grades)',
        role: 'Core Specification',
        purpose: 'Primary specification governing ordinary portland cement manufacturing, physical and chemical composition, fineness, strength grades, and packing.',
        isMandatoryQco: true,
        bisUrl: getBisStandardVerificationUrl('IS 269')
      },
      {
        code: 'IS 4031 (Parts 1 to 15)',
        title: 'Methods of physical tests for hydraulic cement',
        role: 'Mandatory Test',
        purpose: 'Prescribes standardized testing procedures for fineness (Part 2), soundness (Part 3), setting time (Part 5), compressive strength (Part 6), and heat of hydration.',
        isMandatoryQco: true,
        bisUrl: getBisStandardVerificationUrl('IS 4031')
      },
      {
        code: 'IS 4032:1985',
        title: 'Method of chemical analysis of hydraulic cement',
        role: 'Chemical Analysis',
        purpose: 'Chemical determination of insoluble residue, magnesia (MgO), sulfuric anhydride (SO3), loss on ignition (LOI), and alkali content (Na2O + 0.658 K2O).',
        isMandatoryQco: true,
        bisUrl: getBisStandardVerificationUrl('IS 4032')
      },
      {
        code: 'IS 3535:1986',
        title: 'Methods of sampling hydraulic cements',
        role: 'Sampling & Quality Inspection',
        purpose: 'Prescribes procedures for sampling cement from bags, bulk tankers, and storage silos for quality assurance testing.',
        isMandatoryQco: false,
        bisUrl: getBisStandardVerificationUrl('IS 3535')
      }
    ]
  },
  {
    id: 'bldg-aggregates',
    category: 'Aggregates & Mineral Fillers',
    productName: 'Coarse Aggregates (Machine-Crushed Blue Granite / Basalt)',
    shortName: 'Coarse Aggregates (20mm & 10mm)',
    requiredGradeOrSpec: '20mm & 10mm Graded Angular Stone (Flakiness Index < 15%)',
    estimatedQuantity: '450 m³ (Cubic Meters)',
    standardCode: 'IS 383:2016',
    standardTitle: 'Coarse and fine aggregate for concrete — Specification',
    editionAmendment: 'Third Revision (Amendment A1:2021)',
    isMandatoryQco: true,
    qcoReference: 'Aggregates Quality Assurance Protocols & CPWD Technical Specifications',
    issuingMinistry: 'Bureau of Indian Standards & CPWD',
    mandatoryTests: [
      'Sieve Analysis for Particle Size Distribution (IS 2386 Part 1)',
      'Flakiness and Elongation Index (IS 2386 Part 1)',
      'Aggregate Crushing & Impact Value (IS 2386 Part 4)',
      'Specific Gravity and Water Absorption (IS 2386 Part 3)'
    ],
    acceptanceCriteria: 'Aggregate Impact Value < 24%; Aggregate Crushing Value < 30%; Combined Flakiness & Elongation Index < 30%; Water Absorption < 2.0%.',
    certificationType: 'BIS ISI Mark',
    certificationVerificationUrl: getBisStandardVerificationUrl('IS 383'),
    manakonlineSearchUrl: getManakonlineSearchUrl('IS 383'),
    notesForProcurement: 'Must be procured from approved mechanized crushing quarries. All weathered or river gravel stones prohibited.'
  },
  {
    id: 'bldg-sand',
    category: 'Fine Aggregates & Mortars',
    productName: 'Hydro-Washed Manufactured Sand (M-Sand Zone II)',
    shortName: 'Manufactured Sand (M-Sand)',
    requiredGradeOrSpec: 'IS 383 Zone II Hydro-Washed Granular Concrete Sand',
    estimatedQuantity: '315 m³ (Cubic Meters)',
    standardCode: 'IS 383:2016',
    standardTitle: 'Coarse and fine aggregate for concrete — Specification',
    editionAmendment: 'Third Revision (Amendment A1:2021)',
    isMandatoryQco: true,
    qcoReference: 'National Building Code 2016 & IS 383 Manufactured Aggregate Standards',
    issuingMinistry: 'Bureau of Indian Standards',
    mandatoryTests: [
      'Sieve Analysis & Fineness Modulus (Zone II grading)',
      'Silt and Clay Content Test (< 3.0% by mass)',
      'Methylene Blue Absorption Test for microfine control'
    ],
    acceptanceCriteria: 'Fineness Modulus between 2.60 and 2.90; Silt and microfine content < 3.0% by weight; zero organic impurities.',
    certificationType: 'BIS ISI Mark',
    certificationVerificationUrl: getBisStandardVerificationUrl('IS 383'),
    manakonlineSearchUrl: getManakonlineSearchUrl('IS 383'),
    notesForProcurement: 'Eco-friendly alternative to river sand. Triple-washed manufactured sand prevents voids and minimizes cement paste demand.'
  },
  {
    id: 'bldg-concrete',
    category: 'Concrete Systems',
    productName: 'Design Mix Ready-Mix Concrete (M25 / M30 Grade)',
    shortName: 'Structural Concrete Mix',
    requiredGradeOrSpec: 'Controlled Batch Mix Concrete M25 / M30 as per IS 456 Table 5',
    estimatedQuantity: '620 m³ (In-situ Placement)',
    standardCode: 'IS 456:2000',
    standardTitle: 'Plain and reinforced concrete — Code of practice',
    editionAmendment: 'Fourth Revision (Consolidated with Amendments 1 to 5)',
    isMandatoryQco: true,
    qcoReference: 'Ready-Mixed Concrete Quality Control Order & CPWD Section 5',
    issuingMinistry: 'Bureau of Indian Standards',
    mandatoryTests: [
      'Slump Cone Workability Test at Site Placement (IS 1199 Part 2)',
      '7-Day and 28-Day Cube Compressive Strength (IS 516)',
      'Water-Cement Ratio Verification (max 0.45 for Severe exposure)',
      'Minimum Cementitious Content Check (≥ 320 kg/m³)'
    ],
    acceptanceCriteria: '28-Day Characteristic Strength ≥ 25 MPa (M25) / ≥ 30 MPa (M30); Slump: 100-120 mm for pumped concrete; zero honeycomb or cold joints.',
    certificationType: 'BIS ISI Mark',
    certificationVerificationUrl: getBisStandardVerificationUrl('IS 456'),
    manakonlineSearchUrl: getManakonlineSearchUrl('IS 456'),
    notesForProcurement: 'Transit mixers must deliver within 90 minutes of batching. Batch printouts detailing cement, aggregate, water, and admixture weights must be filed.'
  },
  {
    id: 'bldg-aac',
    category: 'Masonry & Wall Systems',
    productName: 'Autoclaved Aerated Concrete (AAC) Blocks Grade 1',
    shortName: 'AAC Wall Blocks',
    requiredGradeOrSpec: 'Grade 1 High Precision Autoclaved Aerated Concrete Blocks (IS 2185 Part 3)',
    estimatedQuantity: '28,350 Pieces (600mm x 200mm x 150mm/100mm)',
    standardCode: 'IS 2185 (Part 3):1984',
    standardTitle: 'Concrete masonry units — Specification (Part 3: Autoclaved cellular concrete blocks)',
    editionAmendment: 'Reaffirmed 2020 with Latest Amendments',
    isMandatoryQco: true,
    qcoReference: 'Bureau of Indian Standards Product Certification for Masonry Units',
    issuingMinistry: 'Bureau of Indian Standards',
    mandatoryTests: [
      'Compressive Strength Test (IS 2185 Part 3)',
      'Dry Density Test (IS 2185 Part 3: 551 to 650 kg/m³)',
      'Drying Shrinkage Test (< 0.05%)',
      'Thermal Conductivity and Fire Resistance'
    ],
    acceptanceCriteria: 'Min Compressive Strength: 4.0 N/mm²; Oven-dry density: 551 to 650 kg/m³; Dimensional tolerance: ± 1.5mm.',
    certificationType: 'BIS ISI Mark',
    certificationVerificationUrl: getBisStandardVerificationUrl('IS 2185'),
    manakonlineSearchUrl: getManakonlineSearchUrl('IS 2185'),
    notesForProcurement: 'Lighter wall dead-load reduces steel requirement by up to 12% in multi-storey RCC frame buildings.'
  },
  {
    id: 'bldg-waterproofing',
    category: 'Chemical Admixtures & Waterproofing',
    productName: 'Integral Liquid Waterproofing Compound & Plasticizer',
    shortName: 'Waterproofing Admixture',
    requiredGradeOrSpec: 'Chloride-free Integral Liquid Waterproofing Compound for Concrete & Mortars',
    estimatedQuantity: '1,200 Litres',
    standardCode: 'IS 2645:2003',
    standardTitle: 'Integral waterproofing compounds for cement mortar and concrete — Specification',
    editionAmendment: 'Second Revision (Reaffirmed 2020)',
    isMandatoryQco: true,
    qcoReference: 'Bureau of Indian Standards Chemical Admixtures Regulations',
    issuingMinistry: 'Bureau of Indian Standards',
    mandatoryTests: [
      'Permeability to Water Under Pressure (IS 2645)',
      'Compressive Strength of Concrete with Admixture vs Control (IS 516)',
      'Setting Time & Chloride Content Test (Zero free chlorides)'
    ],
    acceptanceCriteria: 'Reduction in water permeability by minimum 50% compared to control; no adverse impact on 28-day concrete strength.',
    certificationType: 'BIS ISI Mark',
    certificationVerificationUrl: getBisStandardVerificationUrl('IS 2645'),
    manakonlineSearchUrl: getManakonlineSearchUrl('IS 2645'),
    notesForProcurement: 'Mandatory for basement retaining walls, sunken slabs, roof terrace casting, and wet utility rooms.'
  },
  {
    id: 'bldg-electrical',
    category: 'Electrical & Fire Safety',
    productName: 'Flame Retardant Low Smoke (FRLS) Copper Wires & Conduits',
    shortName: 'Electrical FRLS Wiring & Conduits',
    requiredGradeOrSpec: '1100V Grade Multi-strand Electrolytic Copper FRLS Wires & Rigid PVC Conduits',
    estimatedQuantity: '8,500 Metres (Assorted 1.5 sq.mm to 10 sq.mm)',
    standardCode: 'IS 694:2010',
    standardTitle: 'Polyvinyl chloride insulated unsheathed and sheathed cables/cords with rigid conductors up to 1100 V',
    editionAmendment: 'Fifth Revision (Amendment A1:2024)',
    isMandatoryQco: true,
    qcoReference: 'Electrical Wires and Cables (Quality Control) Order, 2023 (DPIIT)',
    issuingMinistry: 'Ministry of Commerce & Industry / BIS',
    mandatoryTests: [
      'Conductor Resistance Test (IS 8130)',
      'Oxygen Index and Smoke Density Test (IS 10810 Part 53 & 63)',
      'High Voltage Spark Test (IS 10810 Part 44)',
      'Flammability Test for Self-Extinguishing Performance'
    ],
    acceptanceCriteria: 'Electrolytic Copper Purity ≥ 99.97%; Oxygen Index ≥ 29%; Temperature Index ≥ 250°C; Halogen gas emission < 20%.',
    certificationType: 'BIS ISI Mark',
    certificationVerificationUrl: getBisStandardVerificationUrl('IS 694'),
    manakonlineSearchUrl: getManakonlineSearchUrl('IS 694'),
    notesForProcurement: 'Compulsory BIS ISI mark embossed every meter. Off-spec recycled copper strictly prohibited under Central Fire Code.'
  },
  {
    id: 'bldg-plumbing',
    category: 'Plumbing & Drainage',
    productName: 'uPVC & CPVC Pipes for Potable Water & Drainage',
    shortName: 'Plumbing Pipes & Fittings',
    requiredGradeOrSpec: 'Class 3 & Class 4 Lead-free uPVC Pressure Pipes & SWR Drainage Pipes',
    estimatedQuantity: '1,800 Metres (15mm to 110mm NB)',
    standardCode: 'IS 4985:2021',
    standardTitle: 'Unplasticized polyvinyl chloride (uPVC) pipes for potable water supplies — Specification',
    editionAmendment: 'Fourth Revision (Amendment A1:2023)',
    isMandatoryQco: true,
    qcoReference: 'Plastics and PVC Pipes (Quality Control) Order (Department of Chemicals & Petrochemicals)',
    issuingMinistry: 'Department of Chemicals & Petrochemicals / BIS',
    mandatoryTests: [
      'Hydrostatic Pressure Test for 100 Hours (IS 12235 Part 5)',
      'Vicat Softening Temperature Test (≥ 80°C)',
      'Lead & Toxic Heavy Metal Leaching Extraction Test',
      'Impact Resistance at 0°C (IS 12235 Part 9)'
    ],
    acceptanceCriteria: 'Zero lead (100% lead-free formulation); No burst or ballooning under 1.5x design pressure; internal finish smooth and free from pitting.',
    certificationType: 'BIS ISI Mark',
    certificationVerificationUrl: getBisStandardVerificationUrl('IS 4985'),
    manakonlineSearchUrl: getManakonlineSearchUrl('IS 4985'),
    notesForProcurement: 'Must hold valid BIS ISI certification for potable drinking water conveyance. Solvents must conform to IS 14182.'
  },
  {
    id: 'bldg-structural-steel',
    category: 'Structural Steel Sections',
    productName: 'Hot Rolled Medium & High Tensile Structural Steel Sections',
    shortName: 'Structural Steel Sections & Plates',
    requiredGradeOrSpec: 'Grade E250 / E350 Quality A/B/C as per IS 2062',
    estimatedQuantity: '22.0 Metric Tonnes (Angles, Channels, Beams, Gusset Plates)',
    standardCode: 'IS 2062:2011',
    standardTitle: 'Hot rolled medium and high tensile structural steel — Specification',
    editionAmendment: 'Seventh Revision (Amendment A2:2021)',
    isMandatoryQco: true,
    qcoReference: 'Steel and Steel Products (Quality Control) Order, 2024 (Ministry of Steel)',
    issuingMinistry: 'Ministry of Steel',
    mandatoryTests: [
      'Tensile and Yield Strength Test (IS 1608)',
      'Charpy V-notch Impact Energy Test at 0°C / -20°C (IS 1757)',
      'Bend Test (IS 1599)',
      'Chemical Analysis for Carbon Equivalent (CE max 0.42%)'
    ],
    acceptanceCriteria: 'Yield Strength ≥ 250 MPa (E250) / ≥ 350 MPa (E350); Minimum Elongation 23%; Charpy Impact ≥ 27 Joules.',
    certificationType: 'BIS ISI Mark',
    certificationVerificationUrl: getBisStandardVerificationUrl('IS 2062'),
    manakonlineSearchUrl: getManakonlineSearchUrl('IS 2062'),
    notesForProcurement: 'Required for roof trusses, purlins, base plates, and canopy pergolas. Must be sourced from primary integrated steel producers.'
  },
  {
    id: 'bldg-tiles',
    category: 'Architectural Finishes',
    productName: 'Vitrified & Ceramic Glazed Tiles',
    shortName: 'Vitrified Flooring Tiles',
    requiredGradeOrSpec: 'Group B Ia Fully Vitrified Double Charge Polished Tiles (Water Absorption < 0.08%)',
    estimatedQuantity: '3,200 m² (Square Metres)',
    standardCode: 'IS 15622:2017',
    standardTitle: 'Pressed ceramic tiles — Specification',
    editionAmendment: 'Second Revision (Reaffirmed 2022)',
    isMandatoryQco: true,
    qcoReference: 'Ceramic Tiles (Quality Control) Order, 2023 (DPIIT)',
    issuingMinistry: 'DPIIT - Ministry of Commerce and Industry',
    mandatoryTests: [
      'Water Absorption by Boiling Water Method (IS 13630 Part 2)',
      'Modulus of Rupture & Breaking Strength (IS 13630 Part 6)',
      'Deep Abrasion Resistance for High Foot Traffic Floors',
      'Stain and Chemical Resistance Test (IS 13630 Part 8)'
    ],
    acceptanceCriteria: 'Water Absorption ≤ 0.08%; Modulus of Rupture ≥ 35 N/mm²; Mohs Hardness ≥ 6; Zero surface cracking or delamination.',
    certificationType: 'BIS ISI Mark',
    certificationVerificationUrl: getBisStandardVerificationUrl('IS 15622'),
    manakonlineSearchUrl: getManakonlineSearchUrl('IS 15622'),
    notesForProcurement: 'All tiles must bear manufacturer batch marking, shade code, and mandatory BIS ISI stamp on back.'
  },
  {
    id: 'bldg-paint',
    category: 'Architectural Coatings',
    productName: 'Anti-Corrosive Primer & Exterior Weather-Shield Acrylic Emulsion',
    shortName: 'Paints & Protective Coatings',
    requiredGradeOrSpec: 'Zero-VOC Lead-free Exterior Silicon Acrylic Weatherproof Emulsion & Zinc Chromate Primer',
    estimatedQuantity: '2,400 Litres',
    standardCode: 'IS 2074:2015',
    standardTitle: 'Ready mixed paint, air drying, red oxide zinc chrome, priming — Specification',
    editionAmendment: 'Third Revision',
    isMandatoryQco: true,
    qcoReference: 'Paints and Varnishes (Quality Control) Order (DPIIT - Lead Free Norms)',
    issuingMinistry: 'DPIIT - Ministry of Commerce and Industry',
    mandatoryTests: [
      'Lead Content Limit Test (strictly < 90 ppm / Lead-Free certified)',
      'Accelerated Weathering Resistance & UV Stability Test',
      'Dry Film Thickness (DFT) and Cross-Cut Adhesion Test'
    ],
    acceptanceCriteria: 'Lead content < 90 ppm; Scrub resistance > 1000 cycles; Salt spray corrosion resistance > 240 hours without blistering.',
    certificationType: 'BIS ISI Mark',
    certificationVerificationUrl: getBisStandardVerificationUrl('IS 2074'),
    manakonlineSearchUrl: getManakonlineSearchUrl('IS 2074'),
    notesForProcurement: 'Central Pollution Control Board (CPCB) and BIS enforce strict ban on toxic lead in architectural paints.'
  }
];

/**
 * Comprehensive catalog of verified materials for Highway / Road projects
 */
const ROAD_TENDER_MATERIALS: TenderRequiredProduct[] = [
  {
    id: 'road-bitumen',
    category: 'Bituminous Paving Binders',
    productName: 'Paving Bitumen (Viscosity Grade VG-30 / VG-40)',
    shortName: 'Paving Bitumen (VG-30/40)',
    requiredGradeOrSpec: 'Viscosity Grade VG-40 (Heavy Highway Traffic) / VG-30 as per IS 73:2018',
    estimatedQuantity: '420 Metric Tonnes (Bulk Tankers)',
    standardCode: 'IS 73:2018',
    standardTitle: 'Paving bitumen — Specification',
    editionAmendment: 'Fifth Revision (Amendment A1:2023)',
    isMandatoryQco: true,
    qcoReference: 'Paving Bitumen (Quality Control) Order (Ministry of Petroleum and Natural Gas)',
    issuingMinistry: 'Ministry of Petroleum & Natural Gas / BIS',
    mandatoryTests: [
      'Absolute Viscosity at 60°C (IS 1206 Part 2: 3200-4800 Poise for VG-40)',
      'Kinematic Viscosity at 135°C (≥ 350 cSt)',
      'Penetration at 25°C (IS 1203: 45 to 70 in 0.1 mm)',
      'Softening Point by Ring and Ball Apparatus (IS 1205: ≥ 50°C)',
      'Ductility at 25°C after rolling thin film oven test (≥ 40 cm)'
    ],
    acceptanceCriteria: 'Purity > 99.0% soluble in trichloroethylene; Flash point > 220°C; Retained penetration after RTFOT > 50%.',
    certificationType: 'BIS ISI Mark',
    certificationVerificationUrl: getBisStandardVerificationUrl('IS 73'),
    manakonlineSearchUrl: getManakonlineSearchUrl('IS 73'),
    notesForProcurement: 'Must be sourced directly from public sector refinery depots (IOCL, BPCL, HPCL) with computerized refinery test certificates.'
  },
  {
    id: 'road-asphalt-agg',
    category: 'Pavement Aggregates',
    productName: 'Crushed Hard Stone Aggregates for DBM & Bituminous Concrete',
    shortName: 'Bituminous Stone Aggregates',
    requiredGradeOrSpec: 'MoRTH Section 500 Crushed Granite/Basalt (Aggregate Impact Value < 20%)',
    estimatedQuantity: '4,200 m³',
    standardCode: 'IS 383:2016',
    standardTitle: 'Coarse and fine aggregate for concrete and road works — Specification',
    editionAmendment: 'Third Revision',
    isMandatoryQco: true,
    qcoReference: 'MoRTH 5th Revision & IRC:37 Pavement Specifications',
    issuingMinistry: 'MoRTH & Bureau of Indian Standards',
    mandatoryTests: [
      'Aggregate Impact Value (AIV < 24% for DBM, < 18% for BC)',
      'Los Angeles Abrasion Value (< 30%)',
      'Combined Flakiness & Elongation Index (< 30%)',
      'Stripping Value in Water Immersion Test (< 5% with binder)'
    ],
    acceptanceCriteria: 'Zero soft or disintegrated stone; Polished Stone Value (PSV) > 55 for high skid safety.',
    certificationType: 'BIS ISI Mark',
    certificationVerificationUrl: getBisStandardVerificationUrl('IS 383'),
    manakonlineSearchUrl: getManakonlineSearchUrl('IS 383'),
    notesForProcurement: 'Aggregates must be batch-mixed through computerized electronic asphalt drum mix plants.'
  },
  {
    id: 'road-wmm',
    category: 'Road Base & Sub-base',
    productName: 'Wet Mix Macadam (WMM) Mechanized Base Course',
    shortName: 'WMM Base Materials',
    requiredGradeOrSpec: 'Pugmill Mechanically Mixed Crushed Aggregates conforming to MoRTH Table 400-11',
    estimatedQuantity: '5,250 m³',
    standardCode: 'IS 383:2016',
    standardTitle: 'Aggregates for road bases — Specification',
    editionAmendment: 'MoRTH Section 400 Standards',
    isMandatoryQco: true,
    qcoReference: 'MoRTH Specifications for Road and Bridge Works (5th Revision)',
    issuingMinistry: 'Ministry of Road Transport and Highways (MoRTH)',
    mandatoryTests: [
      'Gradation Sieve Analysis on Pugmill discharge',
      'Aggregate Impact Value (< 30%)',
      'Plasticity Index of fraction passing 425 micron (PI strictly < 6)'
    ],
    acceptanceCriteria: 'Field dry density ≥ 98% of Maximum Dry Density (MDD); compacted using 10-tonne vibratory rollers.',
    certificationType: 'MoRTH / IRC Certified',
    certificationVerificationUrl: getBisStandardVerificationUrl('IS 383'),
    manakonlineSearchUrl: getManakonlineSearchUrl('IS 383'),
    notesForProcurement: 'Manual on-road wet mixing strictly prohibited. Mandatory automated pugmill batching plant.'
  },
  {
    id: 'road-gsb',
    category: 'Granular Sub-Base',
    productName: 'Granular Sub-Base (GSB) Grading I Materials',
    shortName: 'GSB Sub-Base Course',
    requiredGradeOrSpec: 'Granular Sub-Base Grading I with soaked CBR > 35% as per MoRTH Table 400-1',
    estimatedQuantity: '7,000 m³',
    standardCode: 'IS 2720 (Part 16)',
    standardTitle: 'Methods of test for soils — Laboratory determination of CBR',
    editionAmendment: 'MoRTH Specifications',
    isMandatoryQco: true,
    qcoReference: 'IRC:37 Guidelines for Design of Flexible Pavements',
    issuingMinistry: 'Indian Roads Congress (IRC) & MoRTH',
    mandatoryTests: [
      '4-Day Soaked California Bearing Ratio (CBR ≥ 35%)',
      'Proctor Modified Compaction MDD & OMC (IS 2720 Part 8)',
      'Liquid Limit & Plasticity Index (< 6)'
    ],
    acceptanceCriteria: 'Compaction ≥ 98% of MDD; drainage coefficient permeability k > 10⁻³ cm/sec to prevent pore-water entrapment.',
    certificationType: 'MoRTH / IRC Certified',
    certificationVerificationUrl: getBisStandardVerificationUrl('IS 2720'),
    manakonlineSearchUrl: getManakonlineSearchUrl('IS 2720'),
    notesForProcurement: 'Provides non-erodible drainage cushion underneath heavy traffic carriageway.'
  },
  {
    id: 'road-dowels',
    category: 'Structural Steel for Joints',
    productName: 'Mild Steel Dowel Bars & Deformed Tie Bars for Concrete Joints',
    shortName: 'Dowel & Tie Bars',
    requiredGradeOrSpec: 'Plain Round Mild Steel Grade 1 (IS 432 Part 1) & Fe 500D Rebar for Tie Bars (IS 1786)',
    estimatedQuantity: '18.5 Metric Tonnes',
    standardCode: 'IS 432 (Part 1):1982',
    standardTitle: 'Specification for mild steel and medium tensile steel bars and hard-drawn steel wire for concrete reinforcement',
    editionAmendment: 'Third Revision (Reaffirmed 2020)',
    isMandatoryQco: true,
    qcoReference: 'Steel and Steel Products (Quality Control) Order, 2024 (Ministry of Steel)',
    issuingMinistry: 'Ministry of Steel',
    mandatoryTests: [
      'Tensile Strength and Yield Stress (IS 1608)',
      'Bend Test (180° around pin of diameter 2t without fracture)',
      'Straightness & Cut-end squareness tolerance (< 1 mm)'
    ],
    acceptanceCriteria: 'Yield stress ≥ 250 MPa; Elongation ≥ 23%; half of bar length coated with rust-preventive bond breaker.',
    certificationType: 'BIS ISI Mark',
    certificationVerificationUrl: getBisStandardVerificationUrl('IS 432'),
    manakonlineSearchUrl: getManakonlineSearchUrl('IS 432'),
    notesForProcurement: 'Essential for load-transfer across transverse expansion and contraction joints in concrete pavements and culverts.'
  },
  {
    id: 'road-marking',
    category: 'Road Safety & Markings',
    productName: 'Hot Applied Thermoplastic Road Marking Paint with Glass Beads',
    shortName: 'Thermoplastic Road Markings',
    requiredGradeOrSpec: '100% Solid Thermoplastic Marking Compound with Drop-on Type II Glass Beads',
    estimatedQuantity: '1,450 m² of Line Marking',
    standardCode: 'IS 164:1981',
    standardTitle: 'Specification for ready mixed paint, brushing, road marking',
    editionAmendment: 'MoRTH Section 803 Specifications',
    isMandatoryQco: true,
    qcoReference: 'MoRTH Specification Clause 803 & IRC:35 Road Markings Code',
    issuingMinistry: 'MoRTH / Indian Roads Congress',
    mandatoryTests: [
      'Luminance Factor & Day/Night Color Coordinates',
      'Skid Resistance (BPT > 45 on wet surface)',
      'Retroreflectivity (Initial RL > 200 mcd/m²/lux for white, > 150 for yellow)',
      'Glass Bead Content (minimum 20% by mass conforming to BS 6088 / IS)'
    ],
    acceptanceCriteria: 'Softening point ≥ 102°C; Drying time < 15 minutes at 25°C ambient temperature.',
    certificationType: 'MoRTH / IRC Certified',
    certificationVerificationUrl: getBisStandardVerificationUrl('IS 164'),
    manakonlineSearchUrl: getManakonlineSearchUrl('IS 164'),
    notesForProcurement: 'Ensures nighttime driving guidance and lane discipline on highway corridors.'
  },
  {
    id: 'road-signage',
    category: 'Traffic Control & Signage',
    productName: 'Retro-Reflective Traffic Signage (Micro-Prismatic High Intensity Grade)',
    shortName: 'Retro-Reflective Signage',
    requiredGradeOrSpec: 'Class C Micro-Prismatic Retro-reflective Sheeting mounted on 3mm Aluminium Composite Panel',
    estimatedQuantity: '64 Signboards',
    standardCode: 'IRC:67-2022',
    standardTitle: 'Code of Practice for Road Signs (Indian Roads Congress)',
    editionAmendment: 'Fourth Revision (Aligned with ASTM D4956 Type XI)',
    isMandatoryQco: true,
    qcoReference: 'MoRTH Circular on Mandatory High-Reflectivity Signage for Expressways',
    issuingMinistry: 'Ministry of Road Transport and Highways',
    mandatoryTests: [
      'Coefficient of Retroreflection (RA) at Observation Angles 0.2° and 0.5°',
      'Outdoor Weathering & UV Color Degradation (minimum 10-year warranty)',
      'Adhesion to Substrate Test without peeling or bubbling'
    ],
    acceptanceCriteria: 'Minimum 10-year field performance warranty with embedded security watermark on sheeting.',
    certificationType: 'MoRTH / IRC Certified',
    certificationVerificationUrl: getBisStandardVerificationUrl('IRC 67'),
    manakonlineSearchUrl: getManakonlineSearchUrl('IRC 67'),
    notesForProcurement: 'Commercial grade or non-prismatic signage is strictly rejected on high-speed bypass corridors.'
  },
  {
    id: 'road-crash-barrier',
    category: 'Highway Restraint Systems',
    productName: 'Metal Beam Crash Barriers (W-Beam Galvanized Steel)',
    shortName: 'Metal W-Beam Crash Barriers',
    requiredGradeOrSpec: 'Cold Rolled Hot-Dip Galvanized Steel W-Beam (Fe 410 / Fe 510) as per MoRTH Section 811',
    estimatedQuantity: '2,500 Metres',
    standardCode: 'IS 5986:2017',
    standardTitle: 'Hot rolled steel sheet, plate and strip for formed tubes and automotive cold-forming — Specification',
    editionAmendment: 'Fourth Revision',
    isMandatoryQco: true,
    qcoReference: 'MoRTH Section 811 & Steel Quality Control Order',
    issuingMinistry: 'Ministry of Steel & MoRTH',
    mandatoryTests: [
      'Tensile & Yield Stress (IS 1608: Yield ≥ 310 N/mm²)',
      'Zinc Coating Mass Test (IS 6745: minimum 550 g/m² combined on both sides)',
      'Pre-drilled mounting tolerance and crash absorption compliance'
    ],
    acceptanceCriteria: 'Base metal thickness 3.0mm; Hot-dip zinc coating minimum 550 g/m²; zero flaking or dross.',
    certificationType: 'BIS ISI Mark',
    certificationVerificationUrl: getBisStandardVerificationUrl('IS 5986'),
    manakonlineSearchUrl: getManakonlineSearchUrl('IS 5986'),
    notesForProcurement: 'Critical roadside barrier to prevent vehicle run-off into embankment slopes or oncoming traffic.'
  }
];

/**
 * Comprehensive catalog of verified materials for Bridge / Flyover projects
 */
const BRIDGE_TENDER_MATERIALS: TenderRequiredProduct[] = [
  {
    id: 'brg-strands',
    category: 'Prestressing Steel Systems',
    productName: 'High Tensile Low Relaxation 7-Ply Prestressing Steel Strands',
    shortName: 'Prestressing HT Strands',
    requiredGradeOrSpec: '12.7mm / 15.2mm Low Relaxation 7-Wire Strands Class 2 (IS 14268)',
    estimatedQuantity: '34.5 Metric Tonnes',
    standardCode: 'IS 14268:2022',
    standardTitle: 'Prestressing steel — Uncoated stress relieved low relaxation seven-ply strand for prestressed concrete — Specification',
    editionAmendment: 'Third Revision',
    isMandatoryQco: true,
    qcoReference: 'Steel and Steel Products (Quality Control) Order, 2024 (Ministry of Steel)',
    issuingMinistry: 'Ministry of Steel & BIS',
    mandatoryTests: [
      'Breaking Load and 0.2% Proof Load (IS 14268 Table 2: Min 1860 MPa UTS)',
      'Elongation at Maximum Load (strictly ≥ 3.5%)',
      '1000-Hour Isothermal Relaxation Test at 20°C (Relaxation ≤ 2.5% at 70% UTS load)',
      'Reverse Bend Test on individual wire plies'
    ],
    acceptanceCriteria: 'Characteristic Breaking Strength ≥ 1860 N/mm²; 0.2% Proof Load ≥ 88% of breaking load; Modulus of Elasticity 195 ± 10 GPa.',
    certificationType: 'BIS ISI Mark',
    certificationVerificationUrl: getBisStandardVerificationUrl('IS 14268'),
    manakonlineSearchUrl: getManakonlineSearchUrl('IS 14268'),
    notesForProcurement: 'Mandatory BIS ISI mark tag on every coil. Coils showing any red surface rust or pitting must be rejected.'
  },
  {
    id: 'brg-rebar',
    category: 'Reinforcement Steel',
    productName: 'High Ductility Fe 550D TMT Reinforcement Steel',
    shortName: 'Fe 550D Rebars',
    requiredGradeOrSpec: 'Fe 550D Super Ductile TMT Rebars for Bridge Substructure & Decks (IS 1786)',
    estimatedQuantity: '98.0 Metric Tonnes',
    standardCode: 'IS 1786:2008',
    standardTitle: 'High strength deformed steel bars and wires for concrete reinforcement — Specification',
    editionAmendment: 'Fourth Revision (Amendment A3:2021)',
    isMandatoryQco: true,
    qcoReference: 'Steel and Steel Products (Quality Control) Order, 2024 (Ministry of Steel)',
    issuingMinistry: 'Ministry of Steel',
    mandatoryTests: [
      'Proof Stress & UTS/YS Ratio Test (IS 1608)',
      '180° Cold Mandrel Rebend Test (IS 1599)',
      'Chemical Analysis (S+P combined max 0.075%)'
    ],
    acceptanceCriteria: 'Yield stress ≥ 550 N/mm²; Elongation ≥ 14.5%; TS/YS ratio ≥ 1.08; high seismic ductility.',
    certificationType: 'BIS ISI Mark',
    certificationVerificationUrl: getBisStandardVerificationUrl('IS 1786'),
    manakonlineSearchUrl: getManakonlineSearchUrl('IS 1786'),
    notesForProcurement: 'Direct rolling mill supply with cast-in branding. Must be stored on timber sleepers elevated above ground.',
    applicableStandards: TMT_REBAR_APPLICABLE_STANDARDS
  },
  {
    id: 'brg-cement',
    category: 'High-Performance Cement',
    productName: 'Grade 53 OPC High Early Strength Low Alkali Cement',
    shortName: 'Grade 53 Low Alkali Cement',
    requiredGradeOrSpec: 'Grade 53 OPC Low Alkali (Na2O equivalent < 0.60%) for Precast Prestressed Girders',
    estimatedQuantity: '5,200 Bags (50 kg bags)',
    standardCode: 'IS 269:2015',
    standardTitle: 'Ordinary Portland Cement — Specification',
    editionAmendment: 'Sixth Revision',
    isMandatoryQco: true,
    qcoReference: 'Cement (Quality Control) Order, 2023 (DPIIT)',
    issuingMinistry: 'DPIIT - Ministry of Commerce and Industry',
    mandatoryTests: [
      'Compressive Strength at 3, 7, and 28 Days (IS 4031 Part 6)',
      'Alkali Content Chemical Spectrometry (IS 4032: Na2O + 0.658 K2O < 0.60%)',
      'Sulphate and Chloride Content'
    ],
    acceptanceCriteria: '28-day strength ≥ 53.0 MPa; 7-day strength ≥ 37.0 MPa; Total alkalis < 0.60% to prevent Alkali-Silica Reaction (ASR).',
    certificationType: 'BIS ISI Mark',
    certificationVerificationUrl: getBisStandardVerificationUrl('IS 269'),
    manakonlineSearchUrl: getManakonlineSearchUrl('IS 269'),
    notesForProcurement: 'Low alkali content is mandatory in IRC:112 to eliminate long-term concrete cancer (ASR gel expansion).'
  },
  {
    id: 'brg-bearings',
    category: 'Bridge Structural Bearings',
    productName: 'Pot-PTFE & Elastomeric Bridge Bearings (Neoprene)',
    shortName: 'Bridge Elastomeric Bearings',
    requiredGradeOrSpec: 'Chloroprene (Neoprene) Laminated Elastomeric Bearings conforming to IRC:83 (Part II)',
    estimatedQuantity: '24 Bearings',
    standardCode: 'IS 3400 / IRC:83 (Part II)',
    standardTitle: 'Standard specifications and code of practice for road bridges (Section IX: Bearings)',
    editionAmendment: 'IRC:83 Part II & Part IV Standards',
    isMandatoryQco: true,
    qcoReference: 'MoRTH Section 2000 & Ministry of Road Transport Guidelines',
    issuingMinistry: 'MoRTH & Indian Roads Congress',
    mandatoryTests: [
      'Short-term Axial Compressive Proof Load (1.5x design vertical load)',
      'Shear Modulus Test (G = 0.9 ± 0.15 MPa)',
      'Adhesion Strength between elastomer and embedded internal steel laminates',
      'Ozone Resistance Test'
    ],
    acceptanceCriteria: 'Elastomer must be 100% virgin chloroprene polymer (natural rubber prohibited for heavy spans); shear strain capacity ≥ 0.7.',
    certificationType: 'MoRTH / IRC Certified',
    certificationVerificationUrl: getBisStandardVerificationUrl('IS 3400'),
    manakonlineSearchUrl: getManakonlineSearchUrl('IS 3400'),
    notesForProcurement: 'Bearings must be proof-tested by independent CIPET or NABL laboratory before girder installation.'
  },
  {
    id: 'brg-expansion-joints',
    category: 'Bridge Expansion Devices',
    productName: 'Strip Seal Bridge Expansion Joints',
    shortName: 'Strip Seal Expansion Joints',
    requiredGradeOrSpec: 'Strip Seal Expansion Joint with Chloroprene Rubber Sealing Insert & Edge Beams as per MoRTH Section 2600',
    estimatedQuantity: '48 Running Metres',
    standardCode: 'IRC:SP:69',
    standardTitle: 'Guidelines and specifications for expansion joints in bridges',
    editionAmendment: 'IRC Guidelines & MoRTH Section 2600',
    isMandatoryQco: true,
    qcoReference: 'MoRTH Section 2600 Specifications for Road & Bridge Works',
    issuingMinistry: 'MoRTH & IRC',
    mandatoryTests: [
      'Watertightness Test under 50mm head of water for 4 hours',
      'Movement Capacity Verification (± 40 mm longitudinal translation)',
      'Pull-out resistance of neoprene insert from steel edge profile (> 200 N/mm)'
    ],
    acceptanceCriteria: '100% watertight; steel edge profiles machined from hot-rolled steel conforming to IS 2062 Grade E250.',
    certificationType: 'MoRTH / IRC Certified',
    certificationVerificationUrl: getBisStandardVerificationUrl('IS 2062'),
    manakonlineSearchUrl: getManakonlineSearchUrl('IS 2062'),
    notesForProcurement: 'Eliminates water seepage through deck slab onto substructure piers and elastomeric bearings.'
  },
  {
    id: 'brg-hpc-concrete',
    category: 'High Performance Concrete',
    productName: 'High Performance Prestressed Concrete Mix (M45 / M50 Grade)',
    shortName: 'M45/M50 Concrete Deck',
    requiredGradeOrSpec: 'Controlled Batch Mix M45/M50 Prestressed Concrete as per IS 1343:2012 and IRC:112',
    estimatedQuantity: '1,840 m³',
    standardCode: 'IS 1343:2012',
    standardTitle: 'Prestressed concrete — Code of practice',
    editionAmendment: 'Third Revision',
    isMandatoryQco: true,
    qcoReference: 'IRC:112 Code of Practice for Concrete Road Bridges',
    issuingMinistry: 'Bureau of Indian Standards & IRC',
    mandatoryTests: [
      'Compressive Strength at Transfer of Prestress (≥ 36 MPa at 3 to 5 days)',
      '28-Day Cube Compressive Strength (≥ 45 MPa / ≥ 50 MPa)',
      'Rapid Chloride Permeability Test (RCPT < 1000 Coulombs at 56 days)',
      'Water Absorption (< 2.0%)'
    ],
    acceptanceCriteria: 'Maximum water-binder ratio 0.35; High resistance to carbonation and chloride-induced rebar corrosion.',
    certificationType: 'BIS ISI Mark',
    certificationVerificationUrl: getBisStandardVerificationUrl('IS 1343'),
    manakonlineSearchUrl: getManakonlineSearchUrl('IS 1343'),
    notesForProcurement: 'Requires computerized continuous pan mixer with micro-silica and polycarboxylate ether superplasticizer (IS 9103).'
  }
];

/**
 * Intelligently determines all required materials and their exact Indian Standards
 * for an uploaded or selected tender requirement.
 */
export function extractTenderRequiredProducts(
  req: ExtractedTenderRequirement,
  rawText?: string
): TenderRequiredProduct[] {
  const category = req.category || 'building';
  const combinedText = `${req.description} ${req.projectName} ${req.qualitySpecifications?.concreteGrade || ''} ${rawText || ''}`.toLowerCase();

  let products: TenderRequiredProduct[] = [];

  if (category === 'road' || combinedText.includes('highway') || combinedText.includes('pavement') || combinedText.includes('bitumen')) {
    products = [...ROAD_TENDER_MATERIALS];
  } else if (category === 'bridge' || combinedText.includes('bridge') || combinedText.includes('flyover') || combinedText.includes('girder') || combinedText.includes('overpass')) {
    products = [...BRIDGE_TENDER_MATERIALS];
  } else {
    // Default building project
    products = [...BUILDING_TENDER_MATERIALS];
  }

  // Update quantities from BOQ if matched
  if (req.boqHighlights && req.boqHighlights.length > 0) {
    req.boqHighlights.forEach((boq) => {
      const boqLower = boq.item.toLowerCase();
      const matchedProd = products.find((p) => {
        const prodLower = p.shortName.toLowerCase();
        return (
          boqLower.includes('steel') && prodLower.includes('steel') ||
          boqLower.includes('cement') && prodLower.includes('cement') ||
          boqLower.includes('sand') && prodLower.includes('sand') ||
          boqLower.includes('aggregate') && prodLower.includes('aggregate') ||
          boqLower.includes('masonry') && prodLower.includes('aac') ||
          boqLower.includes('bitumen') && prodLower.includes('bitumen') ||
          boqLower.includes('prestressed') && prodLower.includes('concrete') ||
          boqLower.includes('strand') && prodLower.includes('strand')
        );
      });

      if (matchedProd && boq.approxQuantity) {
        matchedProd.estimatedQuantity = `${boq.approxQuantity} ${boq.unit}`;
      }
    });
  }

  return products;
}

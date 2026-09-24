import {
  StandardRecommendationResult,
  PrimaryStandardRecord,
  StandardReferenceItem,
  MandatoryCertificationInfo
} from '../types/procurement';

// Comprehensive Indian Standards (IS) Knowledge Base Ecosystems
export interface StandardEcosystemTemplate {
  domain: string;
  triggerKeywords: string[];
  semanticConcepts: string[];
  primaryStandards: PrimaryStandardRecord[];
  normativeReferences: StandardReferenceItem[];
  alliedStandards: StandardReferenceItem[];
  testMethodStandards: StandardReferenceItem[];
  safetyAndInstallationStandards: StandardReferenceItem[];
  mandatoryCertifications: MandatoryCertificationInfo[];
  tenderClauseTemplate: (query: string, primary: PrimaryStandardRecord[]) => string;
}

export const INDIAN_STANDARDS_KNOWLEDGE_BASE: StandardEcosystemTemplate[] = [
  // 1. CEMENT & STRUCTURAL BINDERS
  {
    domain: 'Civil Construction - Cement & Binders',
    triggerKeywords: [
      'cement', 'portland', 'opc', 'ppc', 'ordinary portland cement',
      'सीमेंट', 'पोर्टलैंड', 'कंक्रीट'
    ],
    semanticConcepts: ['hydration', 'compressive strength', 'setting time', 'mortar', 'residential construction', 'slab casting', 'masonry'],
    primaryStandards: [
      {
        code: 'IS 269:2023',
        title: 'Ordinary Portland Cement — Specification',
        edition: 'Sixth Revision',
        latestAmendment: 'A1:2023',
        yearOfPublication: 2023,
        scope: 'Prescribes the chemical and physical requirements, sampling, and test methods for 33, 43, and 53 grade Ordinary Portland Cement.',
        relevanceScore: 98,
        matchExplanation: 'Mandatory benchmark specification governing 33, 43, and 53 grades of Ordinary Portland Cement for structural and residential construction.',
        isMandatoryQco: true,
        applicableGrades: ['33 Grade', '43 Grade', '53 Grade'],
        keyPhysicalRequirements: [
          'Compressive strength 28 days ≥ 53 MPa (53 Grade) / ≥ 43 MPa (43 Grade)',
          'Specific surface area (Blaine fineness) not less than 225 m²/kg',
          'Initial setting time ≥ 30 min, Final setting time ≤ 600 min',
          'Soundness by Le-Chatelier expansion ≤ 10 mm'
        ],
        keyChemicalRequirements: [
          'Ratio of percentage of lime to percentages of silica, alumina and iron oxide (LSF) 0.66 to 1.02',
          'Total sulphur content (calculated as SO3) ≤ 3.5%',
          'Insoluble residue ≤ 5.0% by mass'
        ]
      },
      {
        code: 'IS 1489 (Part 1):2021',
        title: 'Portland Pozzolana Cement — Specification (Fly Ash Based)',
        edition: 'Fourth Revision',
        latestAmendment: 'A2:2023',
        yearOfPublication: 2021,
        scope: 'Covers requirements for Portland Pozzolana Cement manufactured using pulverized fuel ash.',
        relevanceScore: 92,
        matchExplanation: 'Recommended alternative for general residential masonry, plastering, and mass concrete where lower heat of hydration and sulphate resistance are beneficial.',
        isMandatoryQco: true,
        applicableGrades: ['PPC Fly Ash Based (IS 1489 Part 1)'],
        keyPhysicalRequirements: [
          'Fly ash content: 15% to 35% by mass conforming to IS 3812',
          '28-day compressive strength ≥ 33 MPa'
        ]
      }
    ],
    normativeReferences: [
      { code: 'IS 3812 (Part 1)', title: 'Pulverized Fuel Ash — Specification for Use as Pozzolana in Cement Concrete' },
      { code: 'IS 4032', title: 'Method of Chemical Analysis of Hydraulic Cement' },
      { code: 'IS 4905', title: 'Random Sampling and Acceptance Procedures for Cement Stocks' }
    ],
    alliedStandards: [
      { code: 'IS 456:2021', title: 'Plain and Reinforced Concrete — Code of Practice' },
      { code: 'IS 383:2021', title: 'Coarse and Fine Aggregate for Concrete — Specification' },
      { code: 'IS 9103', title: 'Concrete Admixtures — Specification' },
      { code: 'IS 8112:2023', title: '43 Grade Ordinary Portland Cement (Consolidated Under IS 269)' }
    ],
    testMethodStandards: [
      { code: 'IS 4031 (Part 1)', title: 'Determination of Fineness by Dry Sieving' },
      { code: 'IS 4031 (Part 2)', title: 'Determination of Fineness by Specific Surface by Blaine Air Permeability Method' },
      { code: 'IS 4031 (Part 3)', title: 'Determination of Soundness (Le-Chatelier and Autoclave)' },
      { code: 'IS 4031 (Part 4)', title: 'Determination of Consistency of Standard Cement Paste' },
      { code: 'IS 4031 (Part 5)', title: 'Determination of Initial and Final Setting Times' },
      { code: 'IS 4031 (Part 6)', title: 'Determination of Compressive Strength of Hydraulic Cement Mortar Cubes' }
    ],
    safetyAndInstallationStandards: [
      { code: 'IS 3535', title: 'Methods of Sampling Hydraulic Cements' },
      { code: 'IS 4082', title: 'Recommendations on Stacking and Storage of Construction Materials at Site' }
    ],
    mandatoryCertifications: [
      {
        scheme: 'BIS Product Certification (ISI Mark)',
        isCompulsory: true,
        qcoOrderReference: 'Cement (Quality Control) Order, 2023 issued by DPIIT (Ministry of Commerce and Industry)',
        description: 'Mandatory ISI certification mark under Section 16 of the Bureau of Indian Standards Act, 2016. Procurement of non-ISI marked cement is illegal for all public and private works.',
        issuingAuthority: 'Bureau of Indian Standards (BIS)'
      }
    ],
    tenderClauseTemplate: (query, primary) => `
TECHNICAL SPECIFICATION CLAUSE FOR PROCUREMENT TENDER
Clause: Cement Supply & Quality Compliance
1. Standard Compliance: The supplied cement shall strictly conform to ${primary[0]?.code} (${primary[0]?.title}) with all up-to-date amendments (${primary[0]?.latestAmendment || 'latest edition'}).
2. Certification: Each cement bag must bear the standardized Bureau of Indian Standards (BIS) ISI Certification Mark along with valid CM/L (Certificate of Manufacturing License) number.
3. Freshness & Stacking: Cement older than 90 days from the date of dispatch shall not be accepted at site without fresh 28-day compressive re-testing as per IS 4031 (Part 6).
4. Mandatory Test Certificates: Manufacturer Test Certificate (MTC) indicating chemical composition (LSF, SO3, IR) and 3-day, 7-day, and 28-day physical strength parameters must accompany each dispatch batch.
5. Sampling: Third-party verification sampling shall be carried out in accordance with IS 3535 in an NABL-accredited civil testing laboratory.
`
  },

  // 2. STEEL PIPES & SEAMLESS PRESSURE TUBES
  {
    domain: 'Mechanical & Piping - High-Pressure Steel Tubes',
    triggerKeywords: [
      'steel pipe', 'seamless pipe', 'carbon steel pipe', 'pressure pipe',
      'boiler tube', 'seamless tube', 'pipes for high-pressure',
      'स्टील पाइप', 'सीमलेस पाइप', 'पाइपलाइन'
    ],
    semanticConcepts: ['seamless', 'high-pressure', 'carbon steel', 'hydrostatic pressure', 'yield strength', 'flanges', 'welded tube', 'conveyance of fluids'],
    primaryStandards: [
      {
        code: 'IS 3601:2021',
        title: 'Steel Tubes for Mechanical and General Engineering Purposes — Specification',
        edition: 'Third Revision',
        latestAmendment: 'A1:2023',
        yearOfPublication: 2021,
        scope: 'Specifies requirements for seamless and electric resistance welded (ERW) carbon steel tubes for general mechanical and engineering structural purposes.',
        relevanceScore: 97,
        matchExplanation: 'Direct primary specification for high-load carbon steel seamless and welded tubes with exact mechanical proof stress limits.',
        isMandatoryQco: true,
        applicableGrades: ['WTSt 310', 'WTSt 410', 'WTSt 510'],
        keyPhysicalRequirements: [
          'Tensile strength 310 to 510 N/mm² depending on specified grade',
          'Minimum elongation 15% to 25% on 5.65√So gauge length',
          'Flattening test and drift expanding test without crack or rupture'
        ],
        keyChemicalRequirements: [
          'Carbon (C) max 0.25%, Manganese (Mn) max 1.30%, Sulphur (S) max 0.040%, Phosphorus (P) max 0.040%'
        ]
      },
      {
        code: 'IS 4763:2022',
        title: 'Seamless Steel Tubes for Pressure Purposes — Specification',
        edition: 'Second Revision',
        latestAmendment: 'A1:2023',
        yearOfPublication: 2022,
        scope: 'Covers carbon and alloy seamless steel tubes intended for high-temperature and elevated pressure fluid transmission.',
        relevanceScore: 96,
        matchExplanation: 'Primary standard required whenever high-pressure fluids, steam, or volatile chemicals are to be conveyed safely.',
        isMandatoryQco: true,
        applicableGrades: ['Grade C23', 'Grade C35', 'Alloy Mo/Cr-Mo'],
        keyPhysicalRequirements: [
          '100% Non-destructive eddy current or ultrasonic testing',
          'Mandatory hydrostatic pressure test at 1.5x design pressure'
        ]
      }
    ],
    normativeReferences: [
      { code: 'IS 1367 (Part 1 to 20)', title: 'Technical Supply Conditions for Threaded Steel Fasteners' },
      { code: 'IS 1589', title: 'Mild Steel Wire and Wire Rods for Structural Application' },
      { code: 'IS 8910', title: 'General Technical Delivery Requirements for Steel and Steel Products' }
    ],
    alliedStandards: [
      { code: 'IS 1239 (Part 1 & 2)', title: 'Steel Tubes, Tubulars and Other Wrought Steel Fittings (Up to 150mm Nominal Bore)' },
      { code: 'IS 3589', title: 'Steel Pipes for Water and Sewage (168.3 to 2540 mm Outside Diameter)' },
      { code: 'IS 6392', title: 'Steel Pipe Flanges — Dimensions and Pressure Ratings' },
      { code: 'IS 8500', title: 'Structural Steel - Microalloyed - Specification' },
      { code: 'IS 7367', title: 'Specification for Threaded Forged Pipe Unions and Connectors' }
    ],
    testMethodStandards: [
      { code: 'IS 1608 (Part 1)', title: 'Metallic Materials — Tensile Testing at Ambient Temperature' },
      { code: 'IS 2328', title: 'Metallic Materials — Tube Flattening Test' },
      { code: 'IS 2329', title: 'Metallic Materials — Tube Bend Test' },
      { code: 'IS 2335', title: 'Metallic Materials — Tube Drift-Expanding Test' },
      { code: 'IS 3370', title: 'Brinell and Rockwell Hardness Testing of Steel Tubes' },
      { code: 'IS 1161', title: 'Hydrostatic Pressure Testing Protocol for Steel Tubulars' }
    ],
    safetyAndInstallationStandards: [
      { code: 'IS 8486', title: 'Code of Practice for Safety in Welding of Pressure Vessels and Piping' },
      { code: 'IS 10221', title: 'Code of Practice for Coating and Wrapping of Underground Mild Steel Pipelines' }
    ],
    mandatoryCertifications: [
      {
        scheme: 'BIS Product Certification (ISI Mark)',
        isCompulsory: true,
        qcoOrderReference: 'Pipes and Tubes (Quality Control) Order, 2024 (Ministry of Steel)',
        description: 'Mandatory certification under Scheme-I of BIS Act. All seamless and ERW carbon steel tubes must carry the ISI mark stamped with manufacturer insignia.',
        issuingAuthority: 'Bureau of Indian Standards (BIS)'
      }
    ],
    tenderClauseTemplate: (query, primary) => `
TECHNICAL SPECIFICATION CLAUSE FOR PROCUREMENT TENDER
Clause: Seamless & Structural Carbon Steel Pipes
1. Standard Compliance: The piping material shall strictly conform to ${primary[0]?.code} / ${primary[1]?.code} with all current amendments.
2. Pressure & Non-Destructive Testing: Each length of pipe shall undergo 100% factory hydrostatic pressure testing or full-length eddy-current/ultrasonic testing in accordance with IS 1608 & IS 1161.
3. Markings: Every pipe shall be indelibly stenciled with the BIS Standard Mark (ISI), manufacturer's identification mark, nominal bore (NB), wall thickness schedule, and heat melt number.
4. Test Certificates: Mill Test Certificates (MTC 3.1) stating ladle chemical analysis and tensile/flattening mechanical values must be submitted prior to dispatch approval.
`
  },

  // 3. PVC & HDPE WATER SUPPLY PIPES
  {
    domain: 'Plumbing & Infrastructure - Potable Water Distribution',
    triggerKeywords: [
      'pvc pipe', 'hdpe pipe', 'water supply pipe', 'potable water pipe',
      'drainage pipe', 'polyethylene pipe', 'upvc pipe',
      'पानी का पाइप', 'एचडीपीई', 'पीवीसी', 'नल पाइप'
    ],
    semanticConcepts: ['water supply', 'potable water', 'drinking water safe', 'hydrostatic design stress', 'chlorinated water', 'pe 100', 'pvc-u', 'underground utility'],
    primaryStandards: [
      {
        code: 'IS 4984:2016',
        title: 'High Density Polyethylene Pipes for Water Supply — Specification',
        edition: 'Fifth Revision',
        latestAmendment: 'A3:2022',
        yearOfPublication: 2016,
        scope: 'Specifies requirements for high density polyethylene (HDPE) pipes made from PE 63, PE 80, and PE 100 virgin grade resins for municipal and domestic drinking water distribution.',
        relevanceScore: 97,
        matchExplanation: 'Mandatory standard for underground potable water distribution networks, butt-fusion welded mains, and rural drinking water missions (Jal Jeevan Mission).',
        isMandatoryQco: true,
        applicableGrades: ['PE 80 (PN 6 to PN 16)', 'PE 100 (PN 6 to PN 20)'],
        keyPhysicalRequirements: [
          'Raw material must be virgin polymer compound with minimum carbon black content 2.0% to 2.5%',
          'Internal hydrostatic pressure resistance: 100 hours @ 20°C and 165 hours @ 80°C without ballooning or burst',
          'Oxidation Induction Time (OIT) ≥ 20 minutes @ 200°C'
        ],
        keyChemicalRequirements: [
          'Material must not impart any taste, odour, or toxic metallic leaching to potable drinking water'
        ]
      },
      {
        code: 'IS 4985:2021',
        title: 'Unplasticized Polyvinyl Chloride (uPVC) Pipes for Potable Water Supplies — Specification',
        edition: 'Fourth Revision',
        latestAmendment: 'A1:2023',
        yearOfPublication: 2021,
        scope: 'Covers unplasticized PVC pipes with solvent cement or elastomeric ring joints for civil drinking water supplies.',
        relevanceScore: 94,
        matchExplanation: 'Standard for internal plumbing, risers, and external municipal potable distribution systems using rigid PVC.',
        isMandatoryQco: true,
        applicableGrades: ['Class 1 (0.25 MPa)', 'Class 2 (0.4 MPa)', 'Class 3 (0.6 MPa)', 'Class 4 (1.0 MPa)'],
        keyPhysicalRequirements: [
          'Vicat softening temperature ≥ 80°C',
          'Reversion test: Longitudinal shrinkage ≤ 5%'
        ]
      }
    ],
    normativeReferences: [
      { code: 'IS 5382', title: 'Rubber Sealing Rings for Gas Mains, Water Mains and Sewers' },
      { code: 'IS 7634 (Part 1 to 3)', title: 'Code of Practice for Plastics Pipe Laying, Jointing and Field Installation' },
      { code: 'IS 12235 (Part 1 to 19)', title: 'Methods of Test for Unplasticized PVC Pipes for Cold Water Services' }
    ],
    alliedStandards: [
      { code: 'IS 14333', title: 'High Density Polyethylene (HDPE) Pipes for Sewerage — Specification' },
      { code: 'IS 15328', title: 'Unplasticized Polyvinyl Chloride (uPVC) Pipes for Non-Pressure Underground Drainage' },
      { code: 'IS 1239', title: 'Mild Steel Tubulars and Fittings' }
    ],
    testMethodStandards: [
      { code: 'IS 12235 (Part 2)', title: 'Measurement of Dimensions (Outside Diameter & Wall Thickness)' },
      { code: 'IS 12235 (Part 5)', title: 'Determination of Resistance to Internal Hydrostatic Pressure' },
      { code: 'IS 12235 (Part 9)', title: 'Determination of Impact Strength at 0°C' },
      { code: 'IS 2530', title: 'Methods of Test for Polyethylene Molding Materials and Polyethylene Compounds' }
    ],
    safetyAndInstallationStandards: [
      { code: 'IS 7634 (Part 2)', title: 'Laying and Jointing of Polyethylene (PE) Pipes in Trench Excavations' },
      { code: 'IS 3114', title: 'Code of Practice for Laying of Water Supply Distribution Networks' }
    ],
    mandatoryCertifications: [
      {
        scheme: 'BIS Product Certification (ISI Mark)',
        isCompulsory: true,
        qcoOrderReference: 'Plastics and PVC Pipes (Quality Control) Order (Department of Chemicals & Petrochemicals)',
        description: 'Mandatory ISI certification. The use of recycled or off-grade polymer resin is strictly prohibited for drinking water applications.',
        issuingAuthority: 'Bureau of Indian Standards (BIS)'
      }
    ],
    tenderClauseTemplate: (query, primary) => `
TECHNICAL SPECIFICATION CLAUSE FOR PROCUREMENT TENDER
Clause: Potable Water Distribution Pipes & Fittings
1. Standard Compliance: The pipes shall strictly comply with ${primary[0]?.code} made from 100% virgin resin (PE 100 grade with UV stabilizer carbon black).
2. Food-Contact & Toxic Leaching: The polymer compound must be food-grade certified and non-toxic, conforming to IS 10141 / IS 10146 toxicological limits.
3. Jointing & Fusion: Field joints shall be butt-fusion or electrofusion welded in accordance with IS 7634 (Part 2) by qualified piping technicians.
4. Markings: Every pipe shall bear a continuous indelible laser/hot-foil marking showing the manufacturer's name, IS Standard Mark (ISI), PE grade, pipe SDR/pressure rating, and manufacturing batch code.
`
  },

  // 4. FOOD-GRADE STAINLESS STEEL CONTAINERS & TABLEWARE
  {
    domain: 'Food Safety & Consumer Equipment - Food Contact Utensils',
    triggerKeywords: [
      'stainless steel', 'utensil', 'food grade container', 'kitchenware',
      'stainless steel tableware', 'food contact', 'catering equipment',
      'बर्तन', 'स्टेनलेस स्टील बर्तन', 'रसोई उपकरण'
    ],
    semanticConcepts: ['food grade', 'corrosion resistance', 'toxic heavy metals', 'food contact surface', 'austenitic stainless steel', 'lead leaching', 'chromium nickel content'],
    primaryStandards: [
      {
        code: 'IS 7000:2021',
        title: 'Stainless Steel Tableware — Specification',
        edition: 'Third Revision',
        latestAmendment: 'A1:2023',
        yearOfPublication: 2021,
        scope: 'Prescribes the chemical, mechanical, and safety requirements for stainless steel tableware and serving articles used for preparing, storing, and consuming foodstuffs.',
        relevanceScore: 98,
        matchExplanation: 'Statutory standard governing food-contact stainless steel items, mandating non-toxic austenitic stainless steel grades (AISI 304 / Grade X07Cr18Ni9) to prevent chemical leaching into food.',
        isMandatoryQco: true,
        applicableGrades: ['Grade X04Cr19Ni9 (AISI 304)', 'Grade X07Cr18Ni9', 'Grade X02Cr17Ni12Mo2 (AISI 316)'],
        keyPhysicalRequirements: [
          'Surface finish: Bright mirror polish or satin polish free from pitting, scale, and sharp burrs',
          'Corrosion resistance: Boiling 6% citric acid immersion test for 2 hours with zero pitting or staining',
          'Drop test and resistance to mechanical denting'
        ],
        keyChemicalRequirements: [
          'Chromium (Cr) minimum 17.5% to 19.5%',
          'Nickel (Ni) minimum 8.0% to 10.5%',
          'Lead (Pb) ≤ 0.010%, Cadmium (Cd) ≤ 0.005% (Zero toxic heavy metal leaching)'
        ]
      },
      {
        code: 'IS 5522:2014',
        title: 'Stainless Steel Sheets and Strips for Utensils — Specification',
        edition: 'Second Revision',
        latestAmendment: 'A3:2022',
        yearOfPublication: 2014,
        scope: 'Specifies the chemical composition and mechanical properties of cold rolled and hot rolled stainless steel raw material used in utensil fabrication.',
        relevanceScore: 95,
        matchExplanation: 'Normative material standard ensuring that raw sheets used in manufacturing kitchen utensils do not contain substandard scrap or high-manganese non-food-grade alloys.',
        isMandatoryQco: true,
        applicableGrades: ['Grade AISI 304', 'AISI 316']
      }
    ],
    normativeReferences: [
      { code: 'IS 6911:2017', title: 'Stainless Steel Plate, Sheet and Strip — Specification' },
      { code: 'IS 1472', title: 'Methods of Sampling Ferro-Alloys and Chemical Testing for Stainless Steels' },
      { code: 'IS 9845', title: 'Determination of Overall Migration of Constituents of Plastics and Food Contact Materials' }
    ],
    alliedStandards: [
      { code: 'IS 1660', title: 'Wrought Aluminium Utensils — Specification' },
      { code: 'IS 21', title: 'Wrought Aluminium and Aluminium Alloy for Utensils' },
      { code: 'IS 9623', title: 'Code of Practice for Food Hygiene in Institutional Catering Establishments' }
    ],
    testMethodStandards: [
      { code: 'IS 228 (Part 1 to 24)', title: 'Methods of Chemical Analysis of Steels (Determination of C, Cr, Ni, Mn, P, S)' },
      { code: 'IS 1500', title: 'Metallic Materials — Brinell Hardness Test' },
      { code: 'IS 1501', title: 'Metallic Materials — Vickers Hardness Test' },
      { code: 'IS 9845', title: 'Migration and Heavy Metal Extraction Test into Acidic Food Simulants' }
    ],
    safetyAndInstallationStandards: [
      { code: 'IS 2494', title: 'Hygienic Codes for Storage and Transportation of Food-Contact Metalware' }
    ],
    mandatoryCertifications: [
      {
        scheme: 'BIS Product Certification (ISI Mark)',
        isCompulsory: true,
        qcoOrderReference: 'Cookware, Utensils and Cans for Foods and Beverages (Quality Control) Order (DPIIT)',
        description: 'Mandatory BIS ISI certification. Substandard imported or un-hallmarked recycled steel utensils containing toxic lead or low-nickel magnetic scrap are strictly banned under the QCO.',
        issuingAuthority: 'Bureau of Indian Standards (BIS)'
      }
    ],
    tenderClauseTemplate: (query, primary) => `
TECHNICAL SPECIFICATION CLAUSE FOR PROCUREMENT TENDER
Clause: Food-Grade Stainless Steel Utensils & Containers
1. Standard Compliance: The utensils and storage containers shall strictly conform to ${primary[0]?.code} (${primary[0]?.title}) with all up-to-date amendments.
2. Raw Material Grade: Raw material sheets must conform to IS 5522 / IS 6911 Grade AISI 304 (18/8 austenitic stainless steel with minimum 18% Chromium and 8% Nickel). Ferritic or non-food-grade high-manganese alloys are strictly rejected.
3. Food-Safety & Toxic Leaching: The articles must be certified non-toxic with zero lead (Pb) and zero cadmium (Cd) extraction under food simulant migration tests conforming to IS 9845.
4. BIS Certification: Each utensil must have the Bureau of Indian Standards (ISI) mark laser-etched on its underside together with the manufacturer's trademark and raw material grade code.
`
  },

  // 5. POWER CABLES & UNDERGROUND WIRING
  {
    domain: 'Electrical Engineering - Power Distribution Cables',
    triggerKeywords: [
      'cable', 'electric wire', 'power cable', 'underground cable', 'high voltage cable',
      'copper wire', 'aluminium cable', 'xlpe cable', 'lt cable', 'ht cable',
      'केबल', 'बिजली का तार', 'विद्युत केबल'
    ],
    semanticConcepts: ['dielectric strength', 'insulation resistance', 'xlpe', 'pvc insulated', 'armoured cable', 'conductor resistance', 'flame retardant low smoke (frls)', 'short circuit rating'],
    primaryStandards: [
      {
        code: 'IS 7098 (Part 1):2020',
        title: 'Crosslinked Polyethylene (XLPE) Insulated Thermoplastic Sheathed Cables — For Working Voltages up to and including 1.1 kV',
        edition: 'Third Revision',
        latestAmendment: 'A2:2023',
        yearOfPublication: 2020,
        scope: 'Specifies requirements for armoured and unarmoured single-core and multi-core XLPE insulated electric cables for electricity distribution up to 1100V.',
        relevanceScore: 98,
        matchExplanation: 'Primary engineering specification for heavy industrial power distribution, underground feeders, and commercial electrical panels.',
        isMandatoryQco: true,
        applicableGrades: ['1.1 kV Grade Single/Multi-core Armoured/Unarmoured', 'Copper or Aluminium Conductors'],
        keyPhysicalRequirements: [
          'Maximum continuous conductor operating temperature 90°C (130°C emergency overload, 250°C short circuit)',
          'High thermal overload capacity and tensile strength of galvanized steel wire/strip armour'
        ],
        keyChemicalRequirements: [
          'XLPE insulation with hot set test elongation ≤ 175% under 20 N/cm² load @ 200°C',
          'FRLS (Flame Retardant Low Smoke) outer sheath with oxygen index ≥ 29%'
        ]
      },
      {
        code: 'IS 694:2023',
        title: 'Polyvinyl Chloride Insulated Cables for Working Voltages up to and including 1100 V — Specification',
        edition: 'Fifth Revision',
        latestAmendment: 'A1:2024',
        yearOfPublication: 2023,
        scope: 'Covers requirements for PVC insulated unsheathed and sheathed electric wires for fixed building installations and wiring appliances.',
        relevanceScore: 94,
        matchExplanation: 'Governs internal building wiring, domestic conduit cables, and lighting sub-circuits.',
        isMandatoryQco: true,
        applicableGrades: ['Class 1/2 Copper/Aluminium Conductors with FR/FRLS insulation']
      }
    ],
    normativeReferences: [
      { code: 'IS 8130:2021', title: 'Conductors for Insulated Electric Cables and Flexible Cords — Specification' },
      { code: 'IS 5831', title: 'PVC Insulation and Sheath of Electric Cables' },
      { code: 'IS 3975', title: 'Low Carbon Galvanized Steel Wires, Formed Wires and Tapes for Armouring of Cables' }
    ],
    alliedStandards: [
      { code: 'IS 7098 (Part 2)', title: 'Crosslinked Polyethylene Insulated Cables for Voltages from 3.3 kV up to 33 kV' },
      { code: 'IS 1554 (Part 1)', title: 'PVC Insulated (Heavy Duty) Electric Cables for Working Voltages up to 1100 V' },
      { code: 'IS 1255', title: 'Code of Practice for Installation and Maintenance of Power Cables up to and including 33 kV' }
    ],
    testMethodStandards: [
      { code: 'IS 10810 (Part 1 to 64)', title: 'Methods of Test for Cables (Spark Testing, Conductor Resistance, Insulation Resistance, Flammability)' },
      { code: 'IS 10810 (Part 53)', title: 'Oxygen Index Test' },
      { code: 'IS 10810 (Part 63)', title: 'Smoke Density Generation Test' }
    ],
    safetyAndInstallationStandards: [
      { code: 'IS 1255', title: 'Code of Practice for Installation of Underground Cables (Trenching, Bedding & Protection)' },
      { code: 'IS 732', title: 'Code of Practice for Electrical Wiring Installations' }
    ],
    mandatoryCertifications: [
      {
        scheme: 'BIS Product Certification (ISI Mark)',
        isCompulsory: true,
        qcoOrderReference: 'Electrical Wires and Cables (Quality Control) Order (Department for Promotion of Industry and Internal Trade)',
        description: 'Compulsory BIS ISI certification under Section 16 of BIS Act. Substandard copper purity or counterfeit PVC insulation is subject to immediate legal confiscation.',
        issuingAuthority: 'Bureau of Indian Standards (BIS)'
      }
    ],
    tenderClauseTemplate: (query, primary) => `
TECHNICAL SPECIFICATION CLAUSE FOR PROCUREMENT TENDER
Clause: Low / High Voltage Power Transmission Cables
1. Standard Compliance: The power cables shall strictly conform to ${primary[0]?.code} with all up-to-date revisions and amendments.
2. Conductor Material: Conductors shall consist of electrolytic high-conductivity stranded copper or EC grade aluminium conforming strictly to IS 8130 (Class 2 stranded).
3. Flame Retardant Sheathing: The outer sheath shall be Flame Retardant Low Smoke (FRLS) PVC compound with minimum Oxygen Index of 29% (tested per IS 10810 Part 53) and temperature index of minimum 250°C.
4. BIS ISI Mark & Embossing: Every meter of cable must be sequentially meter-marked and embossed with the ISI mark, manufacturer's name, voltage grade, cable size, and year of manufacture.
`
  },

  // 6. SOLAR PHOTOVOLTAIC (PV) MODULES & INVERTERS
  {
    domain: 'Renewable Energy - Solar Photovoltaic Systems',
    triggerKeywords: [
      'solar', 'solar panel', 'photovoltaic', 'solar module', 'rooftop solar',
      'solar inverter', 'pv module', 'solar cell',
      'सौर ऊर्जा', 'सोलर पैनल', 'सौर सेल'
    ],
    semanticConcepts: ['photovoltaic', 'solar efficiency', 'monocrystalline', 'polycrystalline', 'bifacial', 'crs registration', 'mnre almm', 'ip68 junction box', 'pid resistance'],
    primaryStandards: [
      {
        code: 'IS 14286:2019 / IEC 61215:2016',
        title: 'Terrestrial Photovoltaic (PV) Modules — Design Qualification and Type Approval',
        edition: 'Second Revision',
        latestAmendment: 'A1:2022',
        yearOfPublication: 2019,
        scope: 'Prescribes requirements for the design qualification and type approval of terrestrial photovoltaic modules suitable for long-term operation in open-air climates.',
        relevanceScore: 98,
        matchExplanation: 'Statutory qualification standard for all solar PV modules procured in India under MNRE guidelines and central renewable tenders.',
        isMandatoryQco: true,
        applicableGrades: ['Monocrystalline PERC', 'Bifacial Solar Modules', 'Polycrystalline Modules'],
        keyPhysicalRequirements: [
          'Thermal cycling test (-40°C to +85°C for 200 cycles) with degradation < 5%',
          'Damp heat test (85°C / 85% RH for 1000 hours) with zero mechanical degradation or delamination',
          'Mechanical load test: Static surface load of 5400 Pa (snow/wind resistance)'
        ],
        keyChemicalRequirements: [
          'PID (Potential Induced Degradation) resistant EVA encapsulant and backsheet barrier'
        ]
      },
      {
        code: 'IS/IEC 61730 (Part 1 & 2):2016',
        title: 'Photovoltaic (PV) Module Safety Qualification (Part 1: Construction, Part 2: Testing)',
        edition: 'First Edition',
        latestAmendment: 'A1:2021',
        yearOfPublication: 2016,
        scope: 'Covers electrical shock safety, fire resistance, and mechanical construction safety for PV modules operating up to 1500V DC.',
        relevanceScore: 96,
        matchExplanation: 'Mandatory companion standard ensuring fire barrier safety and Class II insulation against high voltage DC electrocution.',
        isMandatoryQco: true,
        applicableGrades: ['Class II Electrical Shock Safety']
      }
    ],
    normativeReferences: [
      { code: 'IS/IEC 60904 (Part 1 to 10)', title: 'Photovoltaic Devices — Current-Voltage Characteristics and Measurement Procedures' },
      { code: 'IS/IEC 61701', title: 'Salt Mist Corrosion Testing of Photovoltaic (PV) Modules' },
      { code: 'IS/IEC 62716', title: 'Ammonia Corrosion Testing of Photovoltaic (PV) Modules' }
    ],
    alliedStandards: [
      { code: 'IS 16221 (Part 1 & 2)', title: 'Safety of Power Converters for Use in Photovoltaic Power Systems (Inverters)' },
      { code: 'IS 16169', title: 'Test Procedure for Islanding Prevention Measures for Utility-Interconnected PV Inverters' },
      { code: 'IS 17098', title: 'Solar DC Cables Specification' }
    ],
    testMethodStandards: [
      { code: 'IS/IEC 61215-2', title: 'Terrestrial Photovoltaic (PV) Modules Test Procedures' },
      { code: 'IS/IEC 60904-1', title: 'Measurement of Photovoltaic Current-Voltage Characteristics under Standard Test Conditions (STC)' }
    ],
    safetyAndInstallationStandards: [
      { code: 'IS/IEC 62548', title: 'Photovoltaic (PV) Arrays — Design and Installation Requirements' },
      { code: 'IS 3043', title: 'Code of Practice for Earthing and Lightning Protection of Solar Arrays' }
    ],
    mandatoryCertifications: [
      {
        scheme: 'Compulsory Registration Scheme (CRS)',
        isCompulsory: true,
        qcoOrderReference: 'Solar Photovoltaics, Systems, Devices and Components (Quality Control) Order, 2017 (Ministry of New and Renewable Energy - MNRE)',
        description: 'Mandatory BIS Registration under CRS (R-XXXXXXXX license). Additionally, module model must be enlisted in the ALMM (Approved List of Models and Manufacturers) maintained by MNRE.',
        issuingAuthority: 'Bureau of Indian Standards & MNRE'
      }
    ],
    tenderClauseTemplate: (query, primary) => `
TECHNICAL SPECIFICATION CLAUSE FOR PROCUREMENT TENDER
Clause: Solar Photovoltaic (PV) Modules Supply
1. Mandatory Standard Compliance: The modules must strictly comply with ${primary[0]?.code} and ${primary[1]?.code} with all valid amendments.
2. BIS CRS & ALMM Mandate: The specific module model number proposed must hold a valid BIS Registration under the Compulsory Registration Scheme (CRS) and must be currently listed in the Approved List of Models & Manufacturers (ALMM) issued by MNRE.
3. Power Output Tolerance: Module peak wattage rating must have positive power tolerance (0 to +5W).
4. Warranties: Performance warranty must guarantee minimum 90% rated peak output at the end of 10 years and minimum 80% rated output at the end of 25 years.
`
  },

  // 7. HIGH-STRENGTH TMT STEEL REBARS
  {
    domain: 'Civil & Structural - Reinforcement Steel',
    triggerKeywords: [
      'tmt', 'rebar', 'steel bar', 'reinforcement', 'tmt sariya', 'fe 500d', 'fe 550d', 'deformed steel',
      'सरिया', 'टीएमटी', 'लोहा', 'रीबार'
    ],
    semanticConcepts: ['yield strength', 'proof stress', 'elongation', 'earthquake zone', 'ductility', 'tensile ratio', 'rib pattern', 'bend test'],
    primaryStandards: [
      {
        code: 'IS 1786:2021',
        title: 'High Strength Deformed Steel Bars and Wires for Concrete Reinforcement — Specification',
        edition: 'Fifth Revision',
        latestAmendment: 'A1:2022',
        yearOfPublication: 2021,
        scope: 'Covers technical requirements, chemical composition, and mechanical properties of hot-rolled deformed bars manufactured by thermo-mechanical treatment (TMT).',
        relevanceScore: 99,
        matchExplanation: 'Foundational national standard for concrete reinforcement steel. For seismic resilience in India, Fe 500D or Fe 550D super-ductile grade is mandatory.',
        isMandatoryQco: true,
        applicableGrades: ['Fe 415', 'Fe 415D', 'Fe 500', 'Fe 500D', 'Fe 550', 'Fe 550D', 'Fe 600'],
        keyPhysicalRequirements: [
          '0.2% Proof Stress: ≥ 500 MPa (Fe 500D) / ≥ 550 MPa (Fe 550D)',
          'Elongation at fracture: ≥ 16.0% (Fe 500D) / ≥ 14.5% (Fe 550D)',
          'Ultimate Tensile / Yield ratio (TS/YS) ≥ 1.10 for seismic energy dissipation',
          'Cold bend and rebend test without superficial transverse rupture'
        ],
        keyChemicalRequirements: [
          'Carbon (C) max 0.25%, Sulphur (S) max 0.040%, Phosphorus (P) max 0.040%, S+P combined max 0.075%'
        ]
      }
    ],
    normativeReferences: [
      { code: 'IS 1608 (Part 1)', title: 'Metallic Materials — Tensile Testing at Ambient Temperature' },
      { code: 'IS 1599', title: 'Metallic Materials — Bend Test' },
      { code: 'IS 8910', title: 'General Technical Delivery Requirements for Steel and Steel Products' }
    ],
    alliedStandards: [
      { code: 'IS 456:2021', title: 'Plain and Reinforced Concrete — Code of Practice' },
      { code: 'IS 13920:2016', title: 'Ductile Design and Detailing of Reinforced Concrete Structures Subjected to Seismic Forces' },
      { code: 'IS 2502', title: 'Code of Practice for Bending and Fixing of Bars for Concrete Reinforcement' },
      { code: 'IS 280', title: 'Mild Steel Wire for General Engineering Purposes (Binding Wire)' }
    ],
    testMethodStandards: [
      { code: 'IS 1608 (Part 1)', title: 'Tensile Strength, Yield Stress and Percentage Elongation Testing' },
      { code: 'IS 1599', title: 'Cold Mandrel 180-Degree Bend and Rebend Testing' },
      { code: 'IS 228', title: 'Chemical Spectroscopy Analysis of Carbon, Manganese, Sulphur and Phosphorus' }
    ],
    safetyAndInstallationStandards: [
      { code: 'IS 2502', title: 'Code of Practice for Bending, Splicing and Lapping of Rebars at Construction Site' },
      { code: 'IS 13920', title: 'Ductile Detailing Protocols for Earthquake Resistant Structures' }
    ],
    mandatoryCertifications: [
      {
        scheme: 'BIS Product Certification (ISI Mark)',
        isCompulsory: true,
        qcoOrderReference: 'Steel and Steel Products (Quality Control) Order (Ministry of Steel)',
        description: 'Mandatory BIS ISI certification. All rebar bundles must bear the ISI tag, cast rib-marking on every meter, and valid manufacturer CM/L license.',
        issuingAuthority: 'Bureau of Indian Standards (BIS)'
      }
    ],
    tenderClauseTemplate: (query, primary) => `
TECHNICAL SPECIFICATION CLAUSE FOR PROCUREMENT TENDER
Clause: High-Yield Ductile TMT Reinforcement Steel
1. Standard Compliance: The reinforcement steel shall strictly conform to ${primary[0]?.code} Grade Fe 500D or Fe 550D (Super Ductile). Non-ductile commercial rebar shall be rejected outright.
2. Chemical Composition: The combined percentage of Sulphur and Phosphorus (S+P) shall not exceed 0.075%, and maximum Carbon content shall not exceed 0.25% to guarantee high site weldability.
3. Embossed Rib Markings: Every individual rebar shall have continuous rolled-in branding showing the manufacturer's logo, Grade (e.g. Fe 500D), and the BIS ISI Mark at regular intervals of not more than 1.5 meters.
4. Mandatory NABL Test Verification: One random sample from every 50 Metric Tonnes (MT) lot shall be cut and tested in an independent NABL-accredited metallurgical testing laboratory for proof stress, UTS/YS ratio, and 180° cold rebend integrity.
`
  },

  // 8. BITUMINOUS BINDERS FOR ROADS & HIGHWAYS
  {
    domain: 'Highway & Transportation - Paving Bitumen',
    triggerKeywords: [
      'bitumen', 'asphalt', 'tar', 'vg-30', 'vg-40', 'paving bitumen', 'dbm', 'bituminous concrete',
      'डामर', 'बिटुमेन', 'सड़क निर्माण'
    ],
    semanticConcepts: ['viscosity grade', 'softening point', 'penetration value', 'ductility', 'pavement crust', 'morth specifications', 'stripping value', 'rutting resistance'],
    primaryStandards: [
      {
        code: 'IS 73:2021',
        title: 'Paving Bitumen — Specification',
        edition: 'Fifth Revision',
        latestAmendment: 'A1:2023',
        yearOfPublication: 2021,
        scope: 'Prescribes the properties, viscosity grading, and test methods for petroleum bitumen used in road and airfield construction.',
        relevanceScore: 99,
        matchExplanation: 'Governing statutory specification for all bituminous road layers (Dense Bituminous Macadam - DBM, Bituminous Concrete - BC) in national and state highway works.',
        isMandatoryQco: true,
        applicableGrades: ['VG-10', 'VG-20', 'VG-30', 'VG-40'],
        keyPhysicalRequirements: [
          'Absolute Viscosity at 60°C: 2400 to 3600 Poise (VG-30) / 3200 to 4800 Poise (VG-40)',
          'Kinematic Viscosity at 135°C ≥ 350 cSt',
          'Penetration at 25°C: 45 to 70 (0.1 mm)',
          'Softening point (Ring and Ball) ≥ 47°C (VG-30) / ≥ 50°C (VG-40)',
          'Ductility at 25°C ≥ 40 cm'
        ],
        keyChemicalRequirements: [
          'Matter soluble in trichloroethylene ≥ 99.0% by mass'
        ]
      }
    ],
    normativeReferences: [
      { code: 'IS 1201 to IS 1220', title: 'Methods for Testing Tar and Bituminous Materials' },
      { code: 'IS 8887', title: 'Bitumen Emulsion for Roads (Cationic Type) — Specification' }
    ],
    alliedStandards: [
      { code: 'IRC:37-2018', title: 'Guidelines for the Design of Flexible Pavements (Indian Roads Congress)' },
      { code: 'MoRTH Section 500', title: 'Ministry of Road Transport and Highways Specifications for Bases and Surface Courses' },
      { code: 'IS 383:2021', title: 'Coarse and Fine Aggregate for Highway Road Works' }
    ],
    testMethodStandards: [
      { code: 'IS 1206 (Part 2)', title: 'Determination of Absolute Viscosity by Vacuum Capillary Viscometer at 60°C' },
      { code: 'IS 1205', title: 'Determination of Softening Point by Ring and Ball Apparatus' },
      { code: 'IS 1203', title: 'Determination of Penetration Value at 25°C' },
      { code: 'IS 1208', title: 'Determination of Ductility' },
      { code: 'IS 6241', title: 'Method of Test for Stripping Value of Road Aggregates in Bituminous Mixes' }
    ],
    safetyAndInstallationStandards: [
      { code: 'IRC:SP:98', title: 'Guidelines for the Use of Bitumen in Road Construction in Cold and Hot Regions' },
      { code: 'IS 1448', title: 'Methods of Test for Petroleum and Its Products' }
    ],
    mandatoryCertifications: [
      {
        scheme: 'BIS Product Certification (ISI Mark)',
        isCompulsory: true,
        qcoOrderReference: 'Paving Bitumen (Quality Control) Order (Ministry of Petroleum & Natural Gas)',
        description: 'Mandatory BIS certification for all refinery-grade paving bitumen batches supplied to highway construction contractors.',
        issuingAuthority: 'Bureau of Indian Standards (BIS)'
      }
    ],
    tenderClauseTemplate: (query, primary) => `
TECHNICAL SPECIFICATION CLAUSE FOR PROCUREMENT TENDER
Clause: Paving Bitumen (Viscosity Grade) Supply
1. Standard Compliance: The paving bitumen shall strictly comply with ${primary[0]?.code} Viscosity Grade VG-30 (or VG-40 for high-axle loading corridors) as per MoRTH 5th Revision Section 500.
2. Test Certificates: Refinery test certificate showing Absolute Viscosity at 60°C (2400-3600 Poise for VG-30) and softening point must accompany each bulk tanker delivery.
3. Anti-Stripping Agent: If aggregate stripping exceeds 5% in water immersion tests per IS 6241, heat-stable anti-stripping agent conforming to IS 14982 must be dosed at minimum 0.5% by weight of binder.
`
  }
];

// Fallback general civil structure ecosystem for unmatched structural queries
const FALLBACK_STRUCTURAL_ECOSYSTEM: StandardEcosystemTemplate = {
  domain: 'General Civil Engineering & Infrastructure',
  triggerKeywords: [],
  semanticConcepts: ['construction', 'civil engineering', 'quality assurance', 'specifications'],
  primaryStandards: [
    {
      code: 'IS 456:2021',
      title: 'Plain and Reinforced Concrete — Code of Practice',
      edition: 'Fourth Revision',
      latestAmendment: 'A5:2021',
      yearOfPublication: 2021,
      scope: 'Statutory code of practice for design and construction of plain and reinforced concrete structures.',
      relevanceScore: 88,
      matchExplanation: 'Universal benchmark code governing concrete mix design, structural cover, strength requirements, and durability limits for civil infrastructure.',
      isMandatoryQco: true,
      applicableGrades: ['M20 to M60 Concrete Grades']
    },
    {
      code: 'IS 383:2021',
      title: 'Coarse and Fine Aggregate for Concrete — Specification',
      edition: 'Third Revision',
      latestAmendment: 'A1:2022',
      yearOfPublication: 2021,
      scope: 'Covers requirements for natural and manufactured aggregates for concrete.',
      relevanceScore: 82,
      matchExplanation: 'Ensures mechanical aggregate impact value < 30% and clean Zone II sand grading.',
      isMandatoryQco: true
    }
  ],
  normativeReferences: [
    { code: 'IS 269:2023', title: 'Ordinary Portland Cement Specification' },
    { code: 'IS 1786:2021', title: 'High Strength Deformed Steel Bars Specification' }
  ],
  alliedStandards: [
    { code: 'IS 1199', title: 'Methods of Sampling and Analysis of Concrete' },
    { code: 'IS 516', title: 'Methods of Tests for Strength of Concrete' }
  ],
  testMethodStandards: [
    { code: 'IS 516 (Part 1)', title: 'Compressive, Flexural and Tensile Splitting Strength of Concrete' }
  ],
  safetyAndInstallationStandards: [
    { code: 'IS 4082', title: 'Recommendations on Stacking and Storage of Construction Materials' }
  ],
  mandatoryCertifications: [
    {
      scheme: 'BIS Product Certification (ISI Mark)',
      isCompulsory: true,
      qcoOrderReference: 'Bureau of Indian Standards Act, 2016 (Mandatory QCOs for Cement & Steel)',
      description: 'Mandatory ISI certification for constituent structural materials.',
      issuingAuthority: 'Bureau of Indian Standards'
    }
  ],
  tenderClauseTemplate: (query, primary) => `
TECHNICAL SPECIFICATION CLAUSE FOR PROCUREMENT TENDER
Clause: Civil Materials Quality Assurance
1. The contractor shall ensure that all structural concrete and constituent materials strictly conform to IS 456:2021 and IS 383:2021.
2. All raw materials (cement, rebar, aggregates) must carry valid BIS ISI marks and test certificates from NABL accredited testing facilities.
`
};

/**
 * Detect query language: English, Hindi, or Mixed
 */
export function detectQueryLanguage(text: string): string {
  // Check for Devanagari Unicode range
  const devanagariRegex = /[\u0900-\u097F]/;
  if (devanagariRegex.test(text)) {
    return 'Hindi (हिंदी) / Multilingual';
  }
  return 'English';
}

/**
 * Perform semantic matching against the Indian Standards Knowledge Base
 */
export function matchEcosystemLocally(query: string): StandardRecommendationResult {
  const normalized = query.toLowerCase();
  const detectedLang = detectQueryLanguage(query);

  let bestTemplate: StandardEcosystemTemplate | null = null;
  let highestScore = 0;

  for (const template of INDIAN_STANDARDS_KNOWLEDGE_BASE) {
    let score = 0;

    // Keyword hits
    for (const kw of template.triggerKeywords) {
      if (normalized.includes(kw.toLowerCase())) {
        score += 25;
      }
    }

    // Semantic concept hits
    for (const concept of template.semanticConcepts) {
      if (normalized.includes(concept.toLowerCase())) {
        score += 15;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestTemplate = template;
    }
  }

  const selected = bestTemplate || FALLBACK_STRUCTURAL_ECOSYSTEM;

  // Generate dynamic contextual analysis
  const semanticAnalysis = `Comprehensive standards ecosystem identified for procurement: "${query}". ` +
    `The primary technical parameters demand strict compliance with ${selected.primaryStandards.map((s) => s.code).join(' and ')}, ` +
    `ensuring adherence to ${selected.domain}. Normative reference standards must be read concurrently to satisfy technical specifications, ` +
    `sample batch testing, and statutory Quality Control Orders (QCO) under the Bureau of Indian Standards Act, 2016.`;

  const tenderDraftClause = selected.tenderClauseTemplate(query, selected.primaryStandards);

  return {
    query,
    detectedDomain: selected.domain,
    detectedLanguage: detectedLang,
    semanticAnalysis,
    primaryStandards: selected.primaryStandards,
    normativeReferences: selected.normativeReferences,
    alliedStandards: selected.alliedStandards,
    testMethodStandards: selected.testMethodStandards,
    safetyAndInstallationStandards: selected.safetyAndInstallationStandards,
    mandatoryCertifications: selected.mandatoryCertifications,
    tenderDraftClause,
    timestamp: new Date().toISOString(),
    source: 'local-semantic-engine'
  };
}

/**
 * Public Recommendation API that attempts Gemini server proxy first,
 * with instantaneous local fallback if offline or no key available.
 */
export async function getStandardRecommendations(
  query: string,
  language?: string,
  officerContext?: string
): Promise<StandardRecommendationResult> {
  try {
    const response = await fetch('/api/procurement/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, language, officerContext })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data && !data.useLocalKnowledgeBase) {
        return {
          query,
          detectedDomain: data.data.detectedDomain || 'Civil & Infrastructure Engineering',
          detectedLanguage: data.data.detectedLanguage || detectQueryLanguage(query),
          semanticAnalysis: data.data.semanticAnalysis,
          primaryStandards: data.data.primaryStandards || [],
          normativeReferences: data.data.normativeReferences || [],
          alliedStandards: data.data.alliedStandards || [],
          testMethodStandards: data.data.testMethodStandards || [],
          safetyAndInstallationStandards: data.data.safetyAndInstallationStandards || [],
          mandatoryCertifications: data.data.mandatoryCertifications || [],
          tenderDraftClause: data.data.tenderDraftClause || '',
          timestamp: new Date().toISOString(),
          source: 'gemini-3.8-flash'
        };
      }
    }
  } catch (error) {
    console.warn('Backend Gemini API endpoint unreachable; switching to local semantic knowledge base.', error);
  }

  // Graceful fallback to deterministic local semantic knowledge base
  return matchEcosystemLocally(query);
}

import { RecommendedProduct } from '../types';

export const PRODUCTS_DATABASE: Record<string, RecommendedProduct[]> = {
  cement: [
    {
      id: 'cem-ultratech-super',
      name: 'Grade 53 High-Early Strength OPC',
      brand: 'Quality Specification: Ordinary Portland Cement 53 Grade (IS 269:2015)',
      materialCategory: 'cement',
      recommendationRank: 'highly_recommended',
      rankTitle: 'Highly Recommended',
      rankExplanation: 'Superior 28-day compressive strength exceeding 58.5 MPa (well above BIS 53 MPa minimum), micro-fine particle distribution for impermeable concrete, and lowest standard deviation in laboratory cube testing.',
      bisStandardCode: 'IS 269:2015 Grade 53',
      bisStandardTitle: 'Ordinary Portland Cement, 53 Grade — Specification',
      bisVerificationStatus: 'Verified',
      certificationReference: 'BIS License CM/L-7201948',
      qualityFeatures: {
        strength: '58.5 MPa compressive strength at 28 days',
        durability: 'Advanced pore refinement resisting carbonation and chloride ingress',
        settingProperties: 'Initial set: 110 min | Final set: 240 min',
        constructionSuitability: 'Heavy RCC structural elements, high-rise columns, cantilever slabs, and rigid pavements.',
        safetyNotes: 'Exceeds earthquake resilience benchmarks under National Building Code Section 6.'
      },
      unitPrice: 420,
      unit: 'bag',
      packageDetails: '50 kg tamper-evident moisture-resistant laminated polypropylene bag',
      availability: 'Immediate Dispatch',
      environmentalRating: 'Standard',
      userRating: 4.9
    },
    {
      id: 'cem-ambuja-plus',
      name: 'Grade 43 Pozzolana Structural Cement (PPC / OPC 43)',
      brand: 'Quality Specification: Portland Pozzolana Cement (IS 1489 Part 1)',
      materialCategory: 'cement',
      recommendationRank: 'averagely_recommended',
      rankTitle: 'Averagely Recommended',
      rankExplanation: 'Balanced cost-to-performance formulation with reactive silicate pozzolana that provides dense matrix cohesion, reduced hydration heat, and high chemical resistance at a moderate cost per bag.',
      bisStandardCode: 'IS 1489 (Part 1):2015',
      bisStandardTitle: 'Portland Pozzolana Cement (Fly Ash Based) — Specification',
      bisVerificationStatus: 'Verified',
      certificationReference: 'BIS License CM/L-6184930',
      qualityFeatures: {
        strength: '54.2 MPa compressive strength at 28 days',
        durability: 'Hydrophobic surface action preventing dampness seepage in roof slabs',
        settingProperties: 'Initial set: 125 min | Final set: 260 min',
        constructionSuitability: 'Ideal for residential slabs, residential columns, beams, and medium-rise residential apartments.',
        safetyNotes: 'Standard safety factor compliant with IS 456:2000 structural codes.'
      },
      unitPrice: 385,
      unit: 'bag',
      packageDetails: '50 kg woven polymer bag with inner lining',
      availability: 'Immediate Dispatch',
      environmentalRating: 'Green Pro Certified',
      userRating: 4.6
    },
    {
      id: 'cem-shree-standard',
      name: 'Grade 33 / Standard Commercial Cement',
      brand: 'Quality Specification: General Purpose Portland Cement (IS 269 / IS 1489)',
      materialCategory: 'cement',
      recommendationRank: 'low_level_recommended',
      rankTitle: 'Low-Level Recommended',
      rankExplanation: 'Fully meets mandatory BIS threshold criteria (53.0 MPa design potential) at an economical price point; acceptable for standard residential masonry and low-rise framing, with standard site curing.',
      bisStandardCode: 'IS 269:2015 Grade 43',
      bisStandardTitle: 'Ordinary Portland Cement — Grade 33/43 Standard',
      bisVerificationStatus: 'Verified',
      certificationReference: 'BIS License CM/L-5421099',
      qualityFeatures: {
        strength: '53.1 MPa compressive strength at 28 days',
        durability: 'Standard sulphate and atmospheric weathering resistance',
        settingProperties: 'Initial set: 95 min | Final set: 310 min',
        constructionSuitability: 'Single-storey residences, boundary walls, non-critical masonry mortar, and foundation PCC leveling courses.',
        safetyNotes: 'Meets CPWD baseline; rigorous water curing for full 14 days strictly advised.'
      },
      unitPrice: 350,
      unit: 'bag',
      packageDetails: '50 kg standard HDPE bag',
      availability: 'Regional Warehouse',
      environmentalRating: 'Standard',
      userRating: 4.2
    }
  ],

  steel: [
    {
      id: 'stl-tata-tiscon-550d',
      name: 'Fe 550D Super Ductile Grade',
      brand: 'Quality Specification: Fe 550D Grade (Yield Strength ≥ 550 MPa)',
      materialCategory: 'steel',
      recommendationRank: 'highly_recommended',
      rankTitle: 'Highly Recommended',
      rankExplanation: 'Engineered with controlled thermo-mechanical processing for enhanced ductility (16% uniform elongation), ultra-low phosphorus and sulphur impurities (< 0.075%), making it the premier choice for seismic zones III, IV, and V.',
      bisStandardCode: 'IS 1786:2008 Fe 550D',
      bisStandardTitle: 'High Strength Deformed Steel Bars for Concrete Reinforcement',
      bisVerificationStatus: 'Verified',
      certificationReference: 'BIS License CM/L-0034921',
      qualityFeatures: {
        strength: 'Yield stress: 550 N/mm² | Ultimate tensile strength: 600 N/mm²',
        durability: 'Dense tempered martensitic outer rim with corrosion-retarding oxide film',
        elongationOrDuctility: '16.5% minimum elongation (super ductile seismic absorbing capacity)',
        constructionSuitability: 'High-rise structural columns, seismic frames, highway bridges, and heavy residential slabs.',
        safetyNotes: 'Guaranteed 100% bend and re-bend capability without micro-fracturing.'
      },
      unitPrice: 72,
      unit: 'kg',
      packageDetails: 'Bundled standard 12-meter lengths with batch test tag & barcode',
      availability: 'Immediate Dispatch',
      environmentalRating: 'Green Pro Certified',
      userRating: 4.9
    },
    {
      id: 'stl-jsw-neosteel-500d',
      name: 'Fe 500D High Ductility Grade',
      brand: 'Quality Specification: Fe 500D Grade (Yield Strength ≥ 500 MPa)',
      materialCategory: 'steel',
      recommendationRank: 'averagely_recommended',
      rankTitle: 'Averagely Recommended',
      rankExplanation: 'Produced from virgin iron ore through Blast Furnace-BOF route with excellent rib geometry for strong concrete-to-steel bond strength and balanced project pricing.',
      bisStandardCode: 'IS 1786:2008 Fe 500D',
      bisStandardTitle: 'High Strength Deformed Steel Bars — Grade Fe 500D',
      bisVerificationStatus: 'Verified',
      certificationReference: 'BIS License CM/L-1294827',
      qualityFeatures: {
        strength: 'Yield stress: 500 N/mm² | Ultimate tensile: 565 N/mm²',
        durability: 'Uniform grain structure with elevated fatigue resistance',
        elongationOrDuctility: '16.0% elongation meeting BIS earthquake code IS 13920',
        constructionSuitability: 'Multi-storey residential buildings, commercial complexes, and standard foundations.',
        safetyNotes: 'Tested in automated ultrasonic inspection lines.'
      },
      unitPrice: 66,
      unit: 'kg',
      packageDetails: 'Bundled 12-meter straight lengths or U-bends with tamper tags',
      availability: 'Immediate Dispatch',
      environmentalRating: 'Standard',
      userRating: 4.6
    },
    {
      id: 'stl-kamdhenu-nxt',
      name: 'Fe 500 Standard Commercial Grade',
      brand: 'Quality Specification: Fe 500 Grade (Standard 12% Elongation)',
      materialCategory: 'steel',
      recommendationRank: 'low_level_recommended',
      rankTitle: 'Low-Level Recommended',
      rankExplanation: 'Meets mandatory IS 1786 criteria with double angular ribbing for enhanced mechanical interlock; economical choice for non-seismic and low-rise residential structures.',
      bisStandardCode: 'IS 1786:2008 Fe 500',
      bisStandardTitle: 'Deformed Steel Bars for Concrete Reinforcement',
      bisVerificationStatus: 'Verified',
      certificationReference: 'BIS License CM/L-3081942',
      qualityFeatures: {
        strength: 'Yield stress: 500 N/mm² | Minimum tensile: 545 N/mm²',
        durability: 'Standard thermo-quenched surface layer',
        elongationOrDuctility: '12.0% elongation (standard grade, non-"D")',
        constructionSuitability: 'Single-storey residences, compound walls, non-load critical lintels, and ground floor slabs.',
        safetyNotes: 'Strict adherence to minimum bend radii during bar bending is required.'
      },
      unitPrice: 61,
      unit: 'kg',
      packageDetails: 'Bundled lengths with ISI stamp',
      availability: 'Regional Warehouse',
      environmentalRating: 'Standard',
      userRating: 4.2
    }
  ],

  sand: [
    {
      id: 'snd-triple-washed-msand',
      name: 'IS 383 Zone II Hydro-Washed M-Sand Grade',
      brand: 'Quality Specification: VSI Manufactured Sand Zone II (IS 383:2016)',
      materialCategory: 'sand',
      recommendationRank: 'highly_recommended',
      rankTitle: 'Highly Recommended',
      rankExplanation: 'Triple hydro-cyclone washed crushed granite sand strictly conforming to IS 383 Zone II particle distribution, 100% free from silt, clay lumps, and organic silt (< 2.5% fines).',
      bisStandardCode: 'IS 383:2016 Zone II',
      bisStandardTitle: 'Manufactured Fine Aggregate for Concrete — Specification',
      bisVerificationStatus: 'Verified',
      certificationReference: 'Quarry BIS Compliance Certificate QC-8941',
      qualityFeatures: {
        strength: 'Cubical grain profile improves concrete compressive strength by 10-15%',
        durability: 'Zero organic humus or marine salts, avoiding efflorescence and rebar corrosion',
        waterAbsorption: '1.2% by weight (low absorption ensures stable water-cement ratio)',
        constructionSuitability: 'Structural RCC beams, columns, floor slabs, and precast concrete works.',
        safetyNotes: 'Eco-friendly sustainable alternative preventing illegal riverbed dredging.'
      },
      unitPrice: 1850,
      unit: 'm³',
      packageDetails: 'Bulk tipper delivery with weighed gross-tare printout (1 m³ ≈ 1.6 Tonnes)',
      availability: 'Immediate Dispatch',
      environmentalRating: 'Green Pro Certified',
      userRating: 4.8
    },
    {
      id: 'snd-natural-river-zone2',
      name: 'IS 383 Zone II Screened Natural River Sand Grade',
      brand: 'Quality Specification: Natural Coarse Quartz Sand (IS 383:2016)',
      materialCategory: 'sand',
      recommendationRank: 'averagely_recommended',
      rankTitle: 'Averagely Recommended',
      rankExplanation: 'Naturally rounded quartz grains with good mortar workability and finish; mechanically screened to remove gravel, tested for permissible silt (< 4%).',
      bisStandardCode: 'IS 383:2016 Zone II',
      bisStandardTitle: 'Coarse and Fine Aggregate from Natural Sources',
      bisVerificationStatus: 'Verified',
      certificationReference: 'State Mining Dept Permit & BIS Reference Batch S-492',
      qualityFeatures: {
        strength: 'Standard mortar strength matrix conforming to CPWD specifications',
        durability: 'Good natural packing density with rounded grain edges',
        waterAbsorption: '1.8% by weight',
        constructionSuitability: 'Residential brick masonry, plastering work, and standard concrete casting.',
        safetyNotes: 'Field silt jar test recommended upon tipper delivery before pouring.'
      },
      unitPrice: 2200,
      unit: 'm³',
      packageDetails: 'Hydraulic dumper truck delivery with transit pass',
      availability: 'Immediate Dispatch',
      environmentalRating: 'Standard',
      userRating: 4.5
    },
    {
      id: 'snd-crushed-rock-zone3',
      name: 'IS 383 Zone III Standard Fine Aggregate Grade',
      brand: 'Quality Specification: Crushed Rock Fine Aggregate Zone III',
      materialCategory: 'sand',
      recommendationRank: 'low_level_recommended',
      rankTitle: 'Low-Level Recommended',
      rankExplanation: 'Meets minimum IS 383 Zone III limits but contains slightly higher micro-fines (6.5% silt/dust), requiring extra water plasticizer or careful adjustment of water-cement ratio.',
      bisStandardCode: 'IS 383:2016 Zone III',
      bisStandardTitle: 'Fine Aggregate from Manufactured Crushed Rock',
      bisVerificationStatus: 'Verified',
      certificationReference: 'Standard Quarry Quality Mark Q-2391',
      qualityFeatures: {
        strength: 'Meets baseline 28-day concrete strength requirements',
        durability: 'Standard hard granite origin',
        waterAbsorption: '2.5% by weight (requires careful batching moisture correction)',
        constructionSuitability: 'Non-structural PCC footings, ground leveling, flooring base, and boundary walls.',
        safetyNotes: 'Not recommended for ultra-high-strength M40+ precast concrete without washing.'
      },
      unitPrice: 1550,
      unit: 'm³',
      packageDetails: 'Dumper delivery with quarry dispatch memo',
      availability: 'Regional Warehouse',
      environmentalRating: 'Standard',
      userRating: 4.1
    }
  ],

  aggregate: [
    {
      id: 'agg-graded-blue-granite',
      name: '20mm & 10mm Graded Machine-Crushed Basalt/Granite',
      brand: 'Quality Specification: Angular High-Density Coarse Aggregate (IS 383:2016)',
      materialCategory: 'aggregate',
      recommendationRank: 'highly_recommended',
      rankTitle: 'Highly Recommended',
      rankExplanation: 'Strictly cubical angular crushed hard blue granite stone with combined flakiness and elongation index under 18% (well below BIS 35% cap), zero weathering, and Aggregate Impact Value < 16%.',
      bisStandardCode: 'IS 383:2016 Graded 20mm',
      bisStandardTitle: 'Coarse Aggregate for Concrete — Graded 20mm Nominal Size',
      bisVerificationStatus: 'Verified',
      certificationReference: 'NABL Certified Test Report TR-49102',
      qualityFeatures: {
        strength: 'Crushing strength exceeding 140 N/mm²; Impact value 15.2%',
        durability: 'Dense non-porous crystalline structure resistant to acid and alkali action',
        waterAbsorption: '0.45% by weight (exceptionally low water absorption)',
        constructionSuitability: 'Columns, bridge decks, prestressed girders, and heavy industrial slabs.',
        safetyNotes: 'Wash aggregate if exposed to dusty open storage on site.'
      },
      unitPrice: 1450,
      unit: 'm³',
      packageDetails: '10-wheel bulk tipper delivery (1 m³ ≈ 1.55 Tonnes)',
      availability: 'Immediate Dispatch',
      environmentalRating: 'Green Pro Certified',
      userRating: 4.9
    },
    {
      id: 'agg-crushed-black-trap',
      name: '20mm Single-Size Machine-Crushed Trap Stone',
      brand: 'Quality Specification: Uniform Basaltic Crushed Aggregate (IS 383:2016)',
      materialCategory: 'aggregate',
      recommendationRank: 'averagely_recommended',
      rankTitle: 'Averagely Recommended',
      rankExplanation: 'Uniformly crushed basaltic trap rock with good interlocking properties and moderate flakiness index (~22%), offering solid durability for mid-scale building construction.',
      bisStandardCode: 'IS 383:2016 20mm',
      bisStandardTitle: 'Coarse Aggregate for Concrete Structural Works',
      bisVerificationStatus: 'Verified',
      certificationReference: 'Bureau Compliance Tag AGG-6712',
      qualityFeatures: {
        strength: 'Impact value: 21.0% | Crushing value: 22.5%',
        durability: 'Solid weather-resistant basalt matrix',
        waterAbsorption: '0.9% by weight',
        constructionSuitability: 'Standard residential RCC, building footings, beams, and residential road base.',
        safetyNotes: 'Tested for alkali-aggregate reactivity.'
      },
      unitPrice: 1300,
      unit: 'm³',
      packageDetails: 'Bulk tipper dumper with weighbridge voucher',
      availability: 'Immediate Dispatch',
      environmentalRating: 'Standard',
      userRating: 4.5
    },
    {
      id: 'agg-regional-crushed-stone',
      name: '20mm Semi-Crushed Commercial Gravel Stone',
      brand: 'Quality Specification: Standard Concrete Gravel Aggregate (IS 383:2016)',
      materialCategory: 'aggregate',
      recommendationRank: 'low_level_recommended',
      rankTitle: 'Low-Level Recommended',
      rankExplanation: 'Meets minimum IS 383 criteria with flakiness index around 29% and crushing value of 27%; suitable for standard plain cement concrete and non-prestressed structures.',
      bisStandardCode: 'IS 383:2016 Baseline',
      bisStandardTitle: 'Coarse Aggregate for Concrete Works',
      bisVerificationStatus: 'Verified',
      certificationReference: 'Bureau Reference Spec AR-1940',
      qualityFeatures: {
        strength: 'Impact value: 26.5% (under 30% wearing threshold)',
        durability: 'Satisfactory for indoor and non-coastal structural work',
        waterAbsorption: '1.4% by weight',
        constructionSuitability: 'Plinth protection, mass concrete bedding, compound walls, and driveways.',
        safetyNotes: 'Do not use for post-tensioned bridge girders.'
      },
      unitPrice: 1150,
      unit: 'm³',
      packageDetails: 'Tractor trolley or truck delivery',
      availability: 'Regional Warehouse',
      environmentalRating: 'Standard',
      userRating: 4.1
    }
  ],

  bricks: [
    {
      id: 'brk-aac-aerated-blocks',
      name: 'Class 1 Precision Autoclaved Aerated Concrete (AAC Block)',
      brand: 'Quality Specification: Grade 1 Lightweight AAC Block (IS 2185 Part 3)',
      materialCategory: 'bricks',
      recommendationRank: 'highly_recommended',
      rankTitle: 'Highly Recommended',
      rankExplanation: 'Engineered green building material conforming to IS 2185 Part 3: 50% lighter than clay bricks (reducing structural dead load), 3x superior thermal insulation (saving AC costs), and exact razor-cut dimensions saving mortar by 60%.',
      bisStandardCode: 'IS 2185 (Part 3):1984',
      bisStandardTitle: 'Autoclaved Cellular (Aerated) Concrete Blocks — Specification',
      bisVerificationStatus: 'Verified',
      certificationReference: 'BIS License CM/L-9104822',
      qualityFeatures: {
        strength: 'Compressive strength: 4.0 N/mm² (Grade 1)',
        durability: 'Zero efflorescence, non-rotting, impervious to termite damage',
        waterAbsorption: 'Controlled pore structure prevents dampness penetration',
        constructionSuitability: 'High-rise external and partition walls, eco-villas, commercial hospitals, and modern apartments.',
        safetyNotes: '4-hour fire rating up to 1600°C.'
      },
      unitPrice: 62,
      unit: 'piece',
      packageDetails: 'Palletized 600x200x150 mm (replaces 6 conventional red bricks per unit)',
      availability: 'Immediate Dispatch',
      environmentalRating: 'Green Pro Certified',
      userRating: 4.9
    },
    {
      id: 'brk-wirecut-clay-class10',
      name: 'Class 10.0 Machine-Pressed High-Density Brick',
      brand: 'Quality Specification: Class 10.0 Burnt Clay / Fly Ash Brick (IS 1077)',
      materialCategory: 'bricks',
      recommendationRank: 'averagely_recommended',
      rankTitle: 'Averagely Recommended',
      rankExplanation: 'High-density burnt clay bricks with sharp square arrises, consistent burnt orange coloration, compressive strength exceeding 10.5 N/mm², and water absorption capped at 14%.',
      bisStandardCode: 'IS 1077:1992 Class 10',
      bisStandardTitle: 'Common Burnt Clay Building Bricks — Class 10 Specification',
      bisVerificationStatus: 'Verified',
      certificationReference: 'BIS Certified Kiln Quality Batch K-9182',
      qualityFeatures: {
        strength: '10.5 N/mm² compressive strength',
        durability: 'Resistant to damp weathering, excellent acoustic mass',
        waterAbsorption: '13.5% after 24-hour water saturation test',
        constructionSuitability: 'Load-bearing residential walls, exposed brick facades, boundary walls, and masonry chambers.',
        safetyNotes: 'Requires thorough soaking in water prior to masonry laying.'
      },
      unitPrice: 11,
      unit: 'piece',
      packageDetails: 'Clean lorry load with minimal handling chips (230 x 110 x 75 mm standard)',
      availability: 'Immediate Dispatch',
      environmentalRating: 'Standard',
      userRating: 4.6
    },
    {
      id: 'brk-standard-kiln-class5',
      name: 'Class 5.0 / 7.5 Standard Kiln-Fired Red Brick',
      brand: 'Quality Specification: Class 5.0/7.5 Structural Clay Brick (IS 1077:1992)',
      materialCategory: 'bricks',
      recommendationRank: 'low_level_recommended',
      rankTitle: 'Low-Level Recommended',
      rankExplanation: 'Traditional hand-moulded clamp-fired bricks meeting basic IS 1077 compressive strength (5.5 - 7.0 N/mm²); higher dimension variance and 18% water absorption requires plastering finish.',
      bisStandardCode: 'IS 1077:1992 Class 5',
      bisStandardTitle: 'Common Burnt Clay Building Bricks — Class 5 Standard',
      bisVerificationStatus: 'Verified',
      certificationReference: 'Regional Testing Authority Certificate TA-3419',
      qualityFeatures: {
        strength: '6.0 N/mm² average compressive strength',
        durability: 'Standard weather resistance when covered by cement plaster',
        waterAbsorption: '17.8% (within BIS 20% limit)',
        constructionSuitability: 'Single-storey housing partitions, temporary structures, compound walls, and foundation trench packing.',
        safetyNotes: 'Check for slight efflorescence; apply rich 1:4 mortar plaster.'
      },
      unitPrice: 8.5,
      unit: 'piece',
      packageDetails: 'Truck consignment with manual stacking at site (225 x 105 x 70 mm)',
      availability: 'Immediate Dispatch',
      environmentalRating: 'Standard',
      userRating: 4.1
    }
  ],

  bitumen: [
    {
      id: 'bit-vg30-ioc-refinery',
      name: 'VG-40 / VG-30 Heavy Duty Viscosity Grade Bitumen',
      brand: 'Quality Specification: Viscosity Grade VG-30 / VG-40 (IS 73:2018)',
      materialCategory: 'bitumen',
      recommendationRank: 'highly_recommended',
      rankTitle: 'Highly Recommended',
      rankExplanation: 'Straight-run vacuum residue bitumen with certified viscosity of 3000-4000 Poises at 60°C, zero adulteration, and optimal rutting resistance for heavy national and state highways.',
      bisStandardCode: 'IS 73:2013 VG-30',
      bisStandardTitle: 'Paving Bitumen — Specification (Viscosity Grade 30)',
      bisVerificationStatus: 'Verified',
      certificationReference: 'BIS License CM/L-0294101',
      qualityFeatures: {
        strength: 'Viscosity at 60°C: 2950 Poises | Kinematic at 135°C: 410 cSt',
        durability: 'Ductility at 25°C > 75 cm; outstanding resistance to thermal cracking',
        constructionSuitability: 'Dense Bituminous Macadam (DBM), Bituminous Concrete (BC) wearing courses, and expressway pavements.',
        safetyNotes: 'Flash point > 240°C ensures safe hot-mix plant operation.'
      },
      unitPrice: 52000,
      unit: 'ton',
      packageDetails: 'Insulated thermal road tanker or standard 200 kg steel drums',
      availability: 'Direct Factory Batch',
      environmentalRating: 'Standard',
      userRating: 4.9
    },
    {
      id: 'bit-vg30-bpcl-drummed',
      name: 'VG-30 Standard Paving Viscosity Bitumen',
      brand: 'Quality Specification: Viscosity Grade VG-30 (IS 73:2018)',
      materialCategory: 'bitumen',
      recommendationRank: 'averagely_recommended',
      rankTitle: 'Averagely Recommended',
      rankExplanation: 'Standard refinery-refined viscosity grade bitumen conforming reliably to IS 73 standards, packaged in sealed steel drums with verified batch test certificates.',
      bisStandardCode: 'IS 73:2013 VG-30',
      bisStandardTitle: 'Paving Bitumen — Grade VG-30',
      bisVerificationStatus: 'Verified',
      certificationReference: 'BIS License CM/L-1849204',
      qualityFeatures: {
        strength: 'Viscosity at 60°C: 2600 Poises | Softening point: 50°C',
        durability: 'Solid resistance to stripping with anti-stripping additives',
        constructionSuitability: 'Urban arterial roads, ring roads, industrial bypasses, and state highways.',
        safetyNotes: 'Store drums upright in shaded asphalt stockyard.'
      },
      unitPrice: 50500,
      unit: 'ton',
      packageDetails: '190 kg sealed steel barrels with refinery tamper seals',
      availability: 'Immediate Dispatch',
      environmentalRating: 'Standard',
      userRating: 4.6
    },
    {
      id: 'bit-vg10-rural-roads',
      name: 'VG-10 Low Viscosity Paving Bitumen',
      brand: 'Quality Specification: Viscosity Grade VG-10 (IS 73:2018)',
      materialCategory: 'bitumen',
      recommendationRank: 'low_level_recommended',
      rankTitle: 'Low-Level Recommended',
      rankExplanation: 'Lighter viscosity grade (1000 Poises at 60°C) designed specifically for low-traffic rural road surface dressing and prime coats; cost-effective for PMGSY village connectivity.',
      bisStandardCode: 'IS 73:2013 VG-10',
      bisStandardTitle: 'Paving Bitumen — Grade VG-10',
      bisVerificationStatus: 'Verified',
      certificationReference: 'BIS Certificate Tag BIT-9012',
      qualityFeatures: {
        strength: 'Viscosity at 60°C: 1150 Poises | Penetration at 25°C: 85 dmm',
        durability: 'Adequate for moderate speed low axle-load vehicles',
        constructionSuitability: 'Rural road paving, village approach roads, tack coats, and surface seals.',
        safetyNotes: 'Not recommended for heavy 6-lane multi-axle freight highways.'
      },
      unitPrice: 47800,
      unit: 'ton',
      packageDetails: 'Steel drums or bulk tanker',
      availability: 'Regional Warehouse',
      environmentalRating: 'Standard',
      userRating: 4.2
    }
  ],

  gsb: [
    {
      id: 'gsb-grading-1-nhai',
      name: 'MoRTH Grading I Close-Graded Granular Sub-Base',
      brand: 'Quality Specification: MoRTH Table 400-1 Grading I (CBR ≥ 35%)',
      materialCategory: 'gsb',
      recommendationRank: 'highly_recommended',
      rankTitle: 'Highly Recommended',
      rankExplanation: 'Graded stone aggregate and sand mixture strictly compliant with MoRTH Section 401 Grading I; verified California Bearing Ratio (CBR) of 38% after 4-day soaking for maximum sub-base drainage.',
      bisStandardCode: 'IRC:37-2018 & MoRTH Sec 400',
      bisStandardTitle: 'Specifications for Granular Sub-Base — Grading I',
      bisVerificationStatus: 'Verified',
      certificationReference: 'NHAI Approved Mix Verification MX-812',
      qualityFeatures: {
        strength: 'CBR 38% at 98% Modified Proctor Density',
        durability: 'Non-plastic fines (Plasticity Index < 4) prevent water retention and frost heave',
        constructionSuitability: 'National highways, 4-lane corridors, airfield taxiways, and heavy industrial pavements.',
        safetyNotes: 'Compacted in 150mm thick layers with 10-tonne vibratory rollers.'
      },
      unitPrice: 950,
      unit: 'm³',
      packageDetails: 'Bulk tipper consignment at optimum moisture content (OMC)',
      availability: 'Immediate Dispatch',
      environmentalRating: 'Green Pro Certified',
      userRating: 4.9
    },
    {
      id: 'gsb-grading-2-pwd',
      name: 'MoRTH Grading II Standard Granular Sub-Base',
      brand: 'Quality Specification: MoRTH Table 400-1 Grading II (CBR ≥ 25%)',
      materialCategory: 'gsb',
      recommendationRank: 'averagely_recommended',
      rankTitle: 'Averagely Recommended',
      rankExplanation: 'Crushed gravel and coarse sand blend conforming to MoRTH Table 400-1 Grading II; reliable for urban streets and district roads.',
      bisStandardCode: 'IRC:37-2018 Grade II',
      bisStandardTitle: 'Flexible Pavement Sub-Base Standard',
      bisVerificationStatus: 'Verified',
      certificationReference: 'State PWD Lab Test Certificate ST-4019',
      qualityFeatures: {
        strength: 'CBR 27% at 97% Modified Proctor Density',
        durability: 'Good interparticle friction and load dispersion',
        constructionSuitability: 'Major district roads, city internal roads, and residential layouts.',
        safetyNotes: 'Ensure field density testing using sand replacement method.'
      },
      unitPrice: 820,
      unit: 'm³',
      packageDetails: 'Tipper delivery directly to road chainage',
      availability: 'Immediate Dispatch',
      environmentalRating: 'Standard',
      userRating: 4.5
    },
    {
      id: 'gsb-gravel-subbase',
      name: 'MoRTH Grading III Pit Gravel Granular Sub-Base',
      brand: 'Quality Specification: MoRTH Table 400-1 Grading III (CBR ≥ 20%)',
      materialCategory: 'gsb',
      recommendationRank: 'low_level_recommended',
      rankTitle: 'Low-Level Recommended',
      rankExplanation: 'Naturally occurring blended pit gravel and coarse sand meeting basic PMGSY rural road specification (CBR 20-22%); economical for low-traffic roads.',
      bisStandardCode: 'IRC:SP:20-2002 & MoRTH',
      bisStandardTitle: 'Rural Road Granular Material Standard',
      bisVerificationStatus: 'Verified',
      certificationReference: 'Regional Inspection Slip GS-1029',
      qualityFeatures: {
        strength: 'CBR 21% compacted density',
        durability: 'Adequate for light vehicle rural traffic',
        constructionSuitability: 'Rural roads, approach tracks, parking lots, and farm paths.',
        safetyNotes: 'Strictly check plasticity index to prevent clay softening during monsoon.'
      },
      unitPrice: 710,
      unit: 'm³',
      packageDetails: 'Hydraulic truck delivery',
      availability: 'Immediate Dispatch',
      environmentalRating: 'Standard',
      userRating: 4.1
    }
  ],

  wmm: [
    {
      id: 'wmm-pugmill-premixed',
      name: 'MoRTH Section 406 Computerized Plant-Mixed WMM',
      brand: 'Quality Specification: Pugmill Premixed Wet Mix Macadam (OMC Controlled)',
      materialCategory: 'wmm',
      recommendationRank: 'highly_recommended',
      rankTitle: 'Highly Recommended',
      rankExplanation: 'Produced in computerized pugmill batching plants with 100% crushed hard stone aggregates, exact moisture control (Optimum Moisture Content ± 0.5%), eliminating in-situ segregation.',
      bisStandardCode: 'MoRTH Section 406 & IRC:37',
      bisStandardTitle: 'Wet Mix Macadam Base Course — Automated Plant Standard',
      bisVerificationStatus: 'Verified',
      certificationReference: 'NHAI Plant Accreditation AP-7721',
      qualityFeatures: {
        strength: 'Aggregates crushing value < 26%; Los Angeles abrasion < 28%',
        durability: 'Dense particle packing provides an impermeable base under bituminous courses',
        constructionSuitability: 'Highways, port roads, flyover approaches, and high-speed corridors.',
        safetyNotes: 'Spreading with hydrostatic sensor paver recommended.'
      },
      unitPrice: 1150,
      unit: 'm³',
      packageDetails: 'Tarpaulin-covered tippers dispatched immediately after pugmill mixing',
      availability: 'Immediate Dispatch',
      environmentalRating: 'Green Pro Certified',
      userRating: 4.9
    },
    {
      id: 'wmm-standard-pwd',
      name: 'Standard Mechanized Crushed Stone WMM Base',
      brand: 'Quality Specification: MoRTH Section 406 Quarry-Mixed WMM',
      materialCategory: 'wmm',
      recommendationRank: 'averagely_recommended',
      rankTitle: 'Averagely Recommended',
      rankExplanation: 'Crushed stone aggregate graded to MoRTH Table 400-11 with standard quarry water batching; cost-effective base for urban roads and state highways.',
      bisStandardCode: 'MoRTH Section 406',
      bisStandardTitle: 'Wet Mix Macadam Base Course',
      bisVerificationStatus: 'Verified',
      certificationReference: 'State PWD Quality Benchmark W-5120',
      qualityFeatures: {
        strength: 'Crushing value < 29%; Impact value < 28%',
        durability: 'Solid mechanical interlocking of crushed facets',
        constructionSuitability: 'City roads, industrial estate avenues, and commercial parking areas.',
        safetyNotes: 'Compact within 2 hours of arrival before moisture evaporates.'
      },
      unitPrice: 1020,
      unit: 'm³',
      packageDetails: 'Heavy tipper delivery with weighbridge bill',
      availability: 'Immediate Dispatch',
      environmentalRating: 'Standard',
      userRating: 4.5
    },
    {
      id: 'wmm-economy-crushed',
      name: 'Standard Granular Road Base Course',
      brand: 'Quality Specification: Low-Volume Road Granular Base (IRC:37)',
      materialCategory: 'wmm',
      recommendationRank: 'low_level_recommended',
      rankTitle: 'Low-Level Recommended',
      rankExplanation: 'Meets minimum base course requirements with slightly wider gradation tolerances; ideal for low-speed municipal roads and rural link roads.',
      bisStandardCode: 'IRC:37-2018 Base',
      bisStandardTitle: 'Granular Base Standard for Low Volume Roads',
      bisVerificationStatus: 'Verified',
      certificationReference: 'Quality Record WM-2018',
      qualityFeatures: {
        strength: 'Aggregate impact value 29.5% (meets 30% cap)',
        durability: 'Acceptable for low to moderate traffic loads',
        constructionSuitability: 'Residential township roads, service roads, and private industrial loops.',
        safetyNotes: 'Needs double pass roller compaction with sprinkler assistance.'
      },
      unitPrice: 910,
      unit: 'm³',
      packageDetails: 'Truck consignment to site',
      availability: 'Regional Warehouse',
      environmentalRating: 'Standard',
      userRating: 4.1
    }
  ],

  water: [
    {
      id: 'wtr-potable-nabl-tested',
      name: 'IS 456 Chemical Tested Potable Construction Water',
      brand: 'Quality Specification: Concrete Mixing & Curing Water (IS 456 & IS 3025)',
      materialCategory: 'water',
      recommendationRank: 'highly_recommended',
      rankTitle: 'Highly Recommended',
      rankExplanation: 'Meets rigorous IS 456 & IS 3025 chemical parameters: pH strictly between 7.2 and 7.8, zero organic matter (< 200 mg/L), sulphates < 400 mg/L, chlorides < 500 mg/L for RCC.',
      bisStandardCode: 'IS 456:2000 & IS 3025',
      bisStandardTitle: 'Quality Standards for Water Used in Concrete Mixing & Curing',
      bisVerificationStatus: 'Verified',
      certificationReference: 'NABL Water Lab Certificate W-9410',
      qualityFeatures: {
        strength: 'No adverse retardation of cement hydration; guarantees 100% designed 28-day strength',
        durability: 'Zero chloride attack on steel reinforcement inside concrete',
        constructionSuitability: 'RCC column pours, roof slab casting, precast prestressed elements.',
        safetyNotes: 'Stored in hygienic clean PE / stainless steel storage tanks.'
      },
      unitPrice: 380,
      unit: 'kL',
      packageDetails: 'Dedicated 6,000L or 12,000L clean epoxy-lined water tanker',
      availability: 'Immediate Dispatch',
      environmentalRating: 'Standard',
      userRating: 4.9
    },
    {
      id: 'wtr-groundwater-filtered',
      name: 'Deep Borewell Filtered Water (TDS < 800 ppm)',
      brand: 'Quality Specification: Subterranean Filtered Water (IS 456 Clause 5.4)',
      materialCategory: 'water',
      recommendationRank: 'averagely_recommended',
      rankTitle: 'Averagely Recommended',
      rankExplanation: 'Tested deep subterranean water with filtered suspended solids; acceptable mineral hardness conforming to IS 456 limits for general building construction.',
      bisStandardCode: 'IS 456:2000 Clause 5.4',
      bisStandardTitle: 'Water for Concrete — Physical & Chemical Standards',
      bisVerificationStatus: 'Verified',
      certificationReference: 'Borewell Quality Audit Tag BW-3310',
      qualityFeatures: {
        strength: 'Does not affect concrete setting or 28-day strength curves',
        durability: 'Safe sulphate levels below 350 mg/L',
        constructionSuitability: 'Brick masonry mortar, wall plastering, foundation PCC, and curing spray.',
        safetyNotes: 'Verify pH on site with litmus or digital meter periodically.'
      },
      unitPrice: 280,
      unit: 'kL',
      packageDetails: '5,000L certified water tanker',
      availability: 'Immediate Dispatch',
      environmentalRating: 'Standard',
      userRating: 4.5
    },
    {
      id: 'wtr-municipal-standard',
      name: 'Municipal Bulk Treated Water',
      brand: 'Quality Specification: Standard Municipal Tap Supply (IS 10500 / IS 456)',
      materialCategory: 'water',
      recommendationRank: 'low_level_recommended',
      rankTitle: 'Low-Level Recommended',
      rankExplanation: 'Standard treated tap supply meeting general drinking water norms; cost-effective though seasonal supply pressure may require large on-site storage sump.',
      bisStandardCode: 'IS 10500 / IS 456',
      bisStandardTitle: 'Standard Municipal Water Guidelines for Civil Works',
      bisVerificationStatus: 'Verified',
      certificationReference: 'Municipal Quality Report MQ-771',
      qualityFeatures: {
        strength: 'Safe for plain concrete and masonry mortar',
        durability: 'Chlorinated municipal treatment',
        constructionSuitability: 'Wall curing, subgrade wetting, earth compaction, and site cleaning.',
        safetyNotes: 'Test TDS if sourced from open secondary storage ponds.'
      },
      unitPrice: 210,
      unit: 'kL',
      packageDetails: 'Direct metered pipe connection or tractor tanker',
      availability: 'Immediate Dispatch',
      environmentalRating: 'Standard',
      userRating: 4.2
    }
  ],

  binding_wire: [
    {
      id: 'bw-annealed-gi-swg18',
      name: '18-Gauge Zinc-Galvanized Dead-Soft Annealed Wire',
      brand: 'Quality Specification: SWG 18 (1.2mm) Galvanized Annealed Mild Steel (IS 280)',
      materialCategory: 'binding_wire',
      recommendationRank: 'highly_recommended',
      rankTitle: 'Highly Recommended',
      rankExplanation: 'Dead-soft thermal annealing allows bar benders to achieve rapid tight ties with zero snap fractures; zinc-galvanized coat protects ties from early corrosion during rain delays.',
      bisStandardCode: 'IS 280:2006 GI',
      bisStandardTitle: 'Mild Steel Wire for General Engineering Purposes — Annealed',
      bisVerificationStatus: 'Verified',
      certificationReference: 'BIS License CM/L-0824911',
      qualityFeatures: {
        strength: 'Tensile strength 360 N/mm²; high flexural ductility',
        durability: 'Thin zinc coating inhibits pre-pour rust staining on ceiling soffits',
        elongationOrDuctility: '18% elongation allows knotting without breakage',
        constructionSuitability: 'Heavy column cages, beam stirrups, slab reinforcement matting.',
        safetyNotes: 'Saves labor time by eliminating repeated tie breakage.'
      },
      unitPrice: 92,
      unit: 'kg',
      packageDetails: '25 kg wrapped coils with moisture barrier film',
      availability: 'Immediate Dispatch',
      environmentalRating: 'Standard',
      userRating: 4.9
    },
    {
      id: 'bw-black-annealed-swg18',
      name: '18-Gauge Black Annealed Mild Steel Binding Wire',
      brand: 'Quality Specification: SWG 18 (1.2mm) Black Annealed Wire (IS 280)',
      materialCategory: 'binding_wire',
      recommendationRank: 'averagely_recommended',
      rankTitle: 'Averagely Recommended',
      rankExplanation: 'Uniformly heat-treated black annealed mild steel wire conforming to IS 280; dependable strength and easy twisting for standard building construction.',
      bisStandardCode: 'IS 280:2006 Black',
      bisStandardTitle: 'Mild Steel Binding Wire',
      bisVerificationStatus: 'Verified',
      certificationReference: 'BIS Standard Tag BW-4912',
      qualityFeatures: {
        strength: 'Tensile strength 380 N/mm²',
        durability: 'Clean surface with light protective oil film',
        elongationOrDuctility: '16% elongation',
        constructionSuitability: 'Residential floor slabs, footing mesh tying, and lintel stirrups.',
        safetyNotes: 'Keep coils covered off the wet ground until used.'
      },
      unitPrice: 80,
      unit: 'kg',
      packageDetails: '20 kg bundle rolls',
      availability: 'Immediate Dispatch',
      environmentalRating: 'Standard',
      userRating: 4.5
    },
    {
      id: 'bw-economy-swg20',
      name: '20-Gauge Standard Annealed Steel Wire',
      brand: 'Quality Specification: SWG 20 (0.9mm) Standard Annealed Wire (IS 280)',
      materialCategory: 'binding_wire',
      recommendationRank: 'low_level_recommended',
      rankTitle: 'Low-Level Recommended',
      rankExplanation: 'Thinner 20-gauge wire offering more length per kilogram; meets baseline IS 280 parameters, but requires double-looping on heavy 25mm+ column rebar to prevent slip.',
      bisStandardCode: 'IS 280:2006 SWG20',
      bisStandardTitle: 'Mild Steel Wire — General Purpose',
      bisVerificationStatus: 'Verified',
      certificationReference: 'Quality Seal BW-1094',
      qualityFeatures: {
        strength: 'Tensile strength 340 N/mm²',
        durability: 'Standard carbon steel',
        elongationOrDuctility: '14% elongation',
        constructionSuitability: 'Light secondary distribution bars, chajja mesh, and light stirrups.',
        safetyNotes: 'Do not use single strand on main column vertical bar splices.'
      },
      unitPrice: 74,
      unit: 'kg',
      packageDetails: '15 kg wire roll',
      availability: 'Immediate Dispatch',
      environmentalRating: 'Standard',
      userRating: 4.1
    }
  ]
};

export function getRecommendedProductsForMaterial(category: string): RecommendedProduct[] {
  const normCategory = category.toLowerCase().trim();
  if (PRODUCTS_DATABASE[normCategory]) {
    return PRODUCTS_DATABASE[normCategory];
  }
  // Fallbacks for similar category keys
  if (normCategory.includes('cement')) return PRODUCTS_DATABASE['cement'];
  if (normCategory.includes('steel') || normCategory.includes('rebar')) return PRODUCTS_DATABASE['steel'];
  if (normCategory.includes('sand') || normCategory.includes('fine')) return PRODUCTS_DATABASE['sand'];
  if (normCategory.includes('aggregate') || normCategory.includes('coarse') || normCategory.includes('stone')) return PRODUCTS_DATABASE['aggregate'];
  if (normCategory.includes('brick') || normCategory.includes('block') || normCategory.includes('masonry')) return PRODUCTS_DATABASE['bricks'];
  if (normCategory.includes('bitumen') || normCategory.includes('asphalt')) return PRODUCTS_DATABASE['bitumen'];
  if (normCategory.includes('gsb') || normCategory.includes('sub-base')) return PRODUCTS_DATABASE['gsb'];
  if (normCategory.includes('wmm') || normCategory.includes('macadam')) return PRODUCTS_DATABASE['wmm'];
  if (normCategory.includes('water')) return PRODUCTS_DATABASE['water'];
  if (normCategory.includes('binding') || normCategory.includes('wire')) return PRODUCTS_DATABASE['binding_wire'];

  // Default fallback to cement if unknown
  return PRODUCTS_DATABASE['cement'];
}

export const ALL_PRODUCTS_DATABASE: RecommendedProduct[] = Object.values(PRODUCTS_DATABASE).flat();

export function getProductById(id: string): RecommendedProduct | undefined {
  return ALL_PRODUCTS_DATABASE.find((p) => p.id === id);
}


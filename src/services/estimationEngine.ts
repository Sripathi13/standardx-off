import { 
  BuildingProjectDetails, 
  RoadProjectDetails, 
  BridgeProjectDetails, 
  HouseOwnerDetails, 
  MaterialRequirement 
} from '../types';

/**
 * Calculates required construction materials for a Building project.
 * Uses engineering thumb-rules grounded in IS 456:2000 structural norms.
 */
export function estimateBuildingMaterials(details: BuildingProjectDetails): MaterialRequirement[] {
  const area = Math.max(details.totalBuiltUpAreaSqFt, 100);
  const floors = Math.max(details.numFloors, 1);
  const structuralSystem = details.structuralSystem;

  // Structural coefficients
  let cementFactor = 0.42; // bags per sq.ft
  let steelFactor = 4.0;   // kg per sq.ft
  let sandFactor = 0.052;  // m³ per sq.ft
  let aggFactor = 0.038;   // m³ per sq.ft
  let brickFactor = 18.0;  // red bricks per sq.ft

  if (structuralSystem === 'Load-Bearing Structure') {
    cementFactor = 0.35;
    steelFactor = 2.0;
    brickFactor = 22.0;
  } else if (structuralSystem === 'Steel Structure') {
    cementFactor = 0.25;
    steelFactor = 2.2; // Foundation rebars + slab decking
    brickFactor = 14.0;
  }

  // Multi-floor height allowance
  const floorFactor = floors > 3 ? 1.05 : 1.0;

  // 1. Cement
  const rawCementBags = Math.round(area * cementFactor * floorFactor);
  const cementWastage = 5;
  const totalCementBags = Math.round(rawCementBags * (1 + cementWastage / 100));

  // 2. Steel
  const rawSteelKg = Math.round(area * steelFactor * floorFactor);
  const steelWastage = 3;
  const totalSteelKg = Math.round(rawSteelKg * (1 + steelWastage / 100));

  // 3. Sand (Fine Aggregate)
  const rawSandM3 = Number((area * sandFactor).toFixed(1));
  const sandWastage = 6;
  const totalSandM3 = Number((rawSandM3 * (1 + sandWastage / 100)).toFixed(1));

  // 4. Coarse Aggregate (Blue Metal 20mm & 10mm)
  const rawAggM3 = Number((area * aggFactor).toFixed(1));
  const aggWastage = 4;
  const totalAggM3 = Number((rawAggM3 * (1 + aggWastage / 100)).toFixed(1));

  // 5. Bricks / AAC Blocks
  const rawBricks = Math.round(area * brickFactor);
  const brickWastage = 7;
  const totalBricks = Math.round(rawBricks * (1 + brickWastage / 100));

  // 6. Construction Water
  const waterKL = Number(((totalCementBags * 165) / 1000).toFixed(1)); // ~165 Liters per bag for batching + 14 days curing

  // 7. Binding Wire
  const bindingWireKg = Math.round(totalSteelKg * 0.011); // 1.1 kg per 100 kg steel

  return [
    {
      materialId: 'mat-cement',
      name: 'Structural Cement (OPC/PPC 53 Grade)',
      category: 'cement',
      estimatedQuantity: totalCementBags,
      unit: 'bag',
      calculationBasis: `${area.toLocaleString()} sq.ft built-up area × ${cementFactor} bags/sq.ft (${structuralSystem})`,
      formulaExplanation: 'Based on standard IS 456 M20/M25 concrete mix design for RCC columns, beams, footings, and slabs with 5% site handling allowance.',
      wastageFactorPct: cementWastage,
      editableQuantity: totalCementBags,
      estimatedUnitPrice: 400
    },
    {
      materialId: 'mat-steel',
      name: 'TMT Steel Reinforcement (Fe 500D / 550D)',
      category: 'steel',
      estimatedQuantity: totalSteelKg,
      unit: 'kg',
      calculationBasis: `${area.toLocaleString()} sq.ft built-up area × ${steelFactor} kg/sq.ft for ${floors} floor(s)`,
      formulaExplanation: 'Derived from structural load requirements under IS 1786 and ductile seismic detailing under IS 13920 with 3% cutting and lap waste.',
      wastageFactorPct: steelWastage,
      editableQuantity: totalSteelKg,
      estimatedUnitPrice: 68
    },
    {
      materialId: 'mat-sand',
      name: 'Fine Aggregate / M-Sand (Zone II)',
      category: 'sand',
      estimatedQuantity: totalSandM3,
      unit: 'm³',
      calculationBasis: `${area.toLocaleString()} sq.ft built-up area × ${sandFactor} m³/sq.ft (approx 1.85 cu.ft/sq.ft)`,
      formulaExplanation: 'IS 383 Zone II grading for structural concrete casting, beam masonry mortar, and internal/external double-coat wall plastering with 6% bulkage allowance.',
      wastageFactorPct: sandWastage,
      editableQuantity: totalSandM3,
      estimatedUnitPrice: 1850
    },
    {
      materialId: 'mat-aggregate',
      name: 'Coarse Aggregate (Graded 20mm & 10mm Blue Metal)',
      category: 'aggregate',
      estimatedQuantity: totalAggM3,
      unit: 'm³',
      calculationBasis: `${area.toLocaleString()} sq.ft built-up area × ${aggFactor} m³/sq.ft (approx 1.35 cu.ft/sq.ft)`,
      formulaExplanation: 'Uniformly graded crushed blue granite aggregate compliant with IS 383 for dense concrete packing and minimal voids.',
      wastageFactorPct: aggWastage,
      editableQuantity: totalAggM3,
      estimatedUnitPrice: 1350
    },
    {
      materialId: 'mat-bricks',
      name: 'Masonry Red Bricks / AAC Blocks',
      category: 'bricks',
      estimatedQuantity: totalBricks,
      unit: 'piece',
      calculationBasis: `${area.toLocaleString()} sq.ft built-up area × ${brickFactor} units/sq.ft for internal and external walls`,
      formulaExplanation: 'Calculated for standard 9-inch exterior and 4.5-inch partition wall layouts according to IS 1077 or IS 2185 Part 3 with 7% breakage allowance.',
      wastageFactorPct: brickWastage,
      editableQuantity: totalBricks,
      estimatedUnitPrice: 11
    },
    {
      materialId: 'mat-water',
      name: 'Construction Batching & Curing Water',
      category: 'water',
      estimatedQuantity: waterKL,
      unit: 'kL',
      calculationBasis: `${totalCementBags} cement bags × 165 Liters/bag (mixing + 14-day ponding/sprinkler curing)`,
      formulaExplanation: 'IS 456 Clause 5.4 potable standard water maintaining water-cement ratio 0.45 and mandatory continuous curing hydration cycle.',
      wastageFactorPct: 8,
      editableQuantity: waterKL,
      estimatedUnitPrice: 280
    },
    {
      materialId: 'mat-binding-wire',
      name: 'Annealed Mild Steel Binding Wire (SWG 18)',
      category: 'binding_wire',
      estimatedQuantity: bindingWireKg,
      unit: 'kg',
      calculationBasis: `1.1% of total steel weight (${totalSteelKg.toLocaleString()} kg)`,
      formulaExplanation: 'IS 280 compliant dead-soft annealed wire for tying beam stirrups, column ties, and slab reinforcement intersections.',
      wastageFactorPct: 5,
      editableQuantity: bindingWireKg,
      estimatedUnitPrice: 82
    }
  ];
}

/**
 * Calculates required construction materials for a Road project.
 * Uses MoRTH & IRC:37/IRC:58 engineering specifications.
 */
export function estimateRoadMaterials(details: RoadProjectDetails): MaterialRequirement[] {
  const lengthM = Math.max(details.lengthKm * 1000, 100);
  const widthM = Math.max(details.widthM, 3.5);
  const thicknessM = details.thicknessMm > 10 ? details.thicknessMm / 1000 : details.thicknessMm;
  const pavementType = details.pavementType;
  const surfaceAreaM2 = lengthM * widthM;

  const isRigid = pavementType === 'Rigid Pavement' || pavementType === 'Concrete Road';

  if (isRigid) {
    // Concrete Pavement Quality Concrete (PQC)
    const pqcVolumeM3 = Number((surfaceAreaM2 * thicknessM).toFixed(1));
    const pqcCementBags = Math.round(pqcVolumeM3 * 7.8); // 390 kg/m³ M40 concrete = 7.8 bags/m³
    const sandM3 = Number((pqcVolumeM3 * 0.44).toFixed(1));
    const aggM3 = Number((pqcVolumeM3 * 0.86).toFixed(1));
    const dowelSteelKg = Math.round(surfaceAreaM2 * 3.6); // Dowel & tie bars along contraction/construction joints
    const gsbVolumeM3 = Number((lengthM * (widthM + 0.8) * 0.15).toFixed(1)); // 150mm Dry Lean Concrete / GSB sub-base
    const waterKL = Number((pqcVolumeM3 * 0.22).toFixed(1));

    return [
      {
        materialId: 'mat-cement',
        name: 'Pavement Quality Cement (OPC 53 Grade)',
        category: 'cement',
        estimatedQuantity: pqcCementBags,
        unit: 'bag',
        calculationBasis: `${pqcVolumeM3.toLocaleString()} m³ PQC volume × 7.8 bags/m³ (M40 Pavement Grade)`,
        formulaExplanation: 'IRC:58 rigid highway pavement specification with minimum flexural strength of 4.5 MPa and 5% compaction variance.',
        wastageFactorPct: 4,
        editableQuantity: pqcCementBags,
        estimatedUnitPrice: 410
      },
      {
        materialId: 'mat-sand',
        name: 'Fine Aggregate / M-Sand Zone II for PQC',
        category: 'sand',
        estimatedQuantity: sandM3,
        unit: 'm³',
        calculationBasis: `${pqcVolumeM3.toLocaleString()} m³ PQC concrete × 0.44 m³ sand per m³ concrete`,
        formulaExplanation: 'IS 383 manufactured sand ensuring high particle density and smooth slip-form paver extrusion.',
        wastageFactorPct: 5,
        editableQuantity: sandM3,
        estimatedUnitPrice: 1850
      },
      {
        materialId: 'mat-aggregate',
        name: 'Graded Coarse Aggregate 31.5mm & 20mm Blue Metal',
        category: 'aggregate',
        estimatedQuantity: aggM3,
        unit: 'm³',
        calculationBasis: `${pqcVolumeM3.toLocaleString()} m³ concrete × 0.86 m³ aggregate per m³`,
        formulaExplanation: 'Heavy duty blue granite aggregate with Aggregate Impact Value < 18% for high vehicular shear resistance.',
        wastageFactorPct: 4,
        editableQuantity: aggM3,
        estimatedUnitPrice: 1400
      },
      {
        materialId: 'mat-steel',
        name: 'High-Tensile Dowel & Tie Steel Bars (IS 1786)',
        category: 'steel',
        estimatedQuantity: dowelSteelKg,
        unit: 'kg',
        calculationBasis: `${surfaceAreaM2.toLocaleString()} m² road surface × 3.6 kg/m² for contraction joints and tie bars`,
        formulaExplanation: 'Dowel bars (32mm dia) and tie bars (12mm dia) designed to transfer wheel axle loads across slab expansion joints under IRC:58.',
        wastageFactorPct: 3,
        editableQuantity: dowelSteelKg,
        estimatedUnitPrice: 70
      },
      {
        materialId: 'mat-gsb',
        name: 'Granular Sub-Base (GSB Grading I)',
        category: 'gsb',
        estimatedQuantity: gsbVolumeM3,
        unit: 'm³',
        calculationBasis: `${lengthM} m length × ${(widthM + 0.8).toFixed(1)} m width × 0.15 m thickness`,
        formulaExplanation: 'MoRTH Section 401 drainage sub-base with California Bearing Ratio (CBR) > 35% compacted at 98% Modified Proctor Density.',
        wastageFactorPct: 6,
        editableQuantity: gsbVolumeM3,
        estimatedUnitPrice: 920
      },
      {
        materialId: 'mat-water',
        name: 'PQC Batching and Pond Curing Water',
        category: 'water',
        estimatedQuantity: waterKL,
        unit: 'kL',
        calculationBasis: `${pqcVolumeM3.toLocaleString()} m³ concrete × 0.22 kL per m³ (batching + continuous pond curing)`,
        formulaExplanation: 'IS 3025 potable quality water to prevent chemical cracking and achieve designed 28-day flexural rigidity.',
        wastageFactorPct: 5,
        editableQuantity: waterKL,
        estimatedUnitPrice: 280
      }
    ];
  } else {
    // Flexible / Bituminous Pavement (MoRTH Fifth Revision)
    // Bituminous layers: 75mm DBM + 40mm BC = 115mm total asphalt
    const asphaltVolumeM3 = surfaceAreaM2 * 0.115;
    const asphaltMixTonnes = Math.round(asphaltVolumeM3 * 2.42); // bulk density of compacted bituminous mix = 2.42 T/m³
    const bitumenTonnes = Number((asphaltMixTonnes * 0.049).toFixed(1)); // 4.9% binder content by weight of mix
    const wmmVolumeM3 = Number((surfaceAreaM2 * 0.225).toFixed(1)); // 225mm Wet Mix Macadam base
    const gsbVolumeM3 = Number((lengthM * (widthM + 0.6) * 0.15).toFixed(1)); // 150mm GSB sub-base
    const waterKL = Number(((wmmVolumeM3 + gsbVolumeM3) * 0.08).toFixed(1)); // Pugmill and sub-base compaction

    return [
      {
        materialId: 'mat-bitumen',
        name: 'Paving Bitumen Viscosity Grade VG-30 (IS 73)',
        category: 'bitumen',
        estimatedQuantity: bitumenTonnes,
        unit: 'ton',
        calculationBasis: `${asphaltMixTonnes.toLocaleString()} Tonnes bituminous mix × 4.9% binder content`,
        formulaExplanation: 'Refinery produced straight-run VG-30 paving bitumen meeting IS 73 specifications for flexible highway surfacing.',
        wastageFactorPct: 3,
        editableQuantity: bitumenTonnes,
        estimatedUnitPrice: 51000
      },
      {
        materialId: 'mat-wmm',
        name: 'Pugmill Wet Mix Macadam (WMM Base Course)',
        category: 'wmm',
        estimatedQuantity: wmmVolumeM3,
        unit: 'm³',
        calculationBasis: `${surfaceAreaM2.toLocaleString()} m² road surface × 0.225 m thickness (MoRTH Table 400-11)`,
        formulaExplanation: '100% crushed hard stone aggregates premixed at Optimum Moisture Content for high interparticle shear friction.',
        wastageFactorPct: 5,
        editableQuantity: wmmVolumeM3,
        estimatedUnitPrice: 1080
      },
      {
        materialId: 'mat-gsb',
        name: 'Granular Sub-Base (GSB Grading II)',
        category: 'gsb',
        estimatedQuantity: gsbVolumeM3,
        unit: 'm³',
        calculationBasis: `${lengthM} m length × ${(widthM + 0.6).toFixed(1)} m width × 0.15 m thickness`,
        formulaExplanation: 'MoRTH Section 401 granular layer for load dispersal and rapid sub-surface drainage.',
        wastageFactorPct: 5,
        editableQuantity: gsbVolumeM3,
        estimatedUnitPrice: 880
      },
      {
        materialId: 'mat-aggregate',
        name: 'Stone Aggregate for Bituminous Macadam (20mm & 10mm)',
        category: 'aggregate',
        estimatedQuantity: Math.round(asphaltMixTonnes * 0.65),
        unit: 'm³',
        calculationBasis: `${asphaltMixTonnes.toLocaleString()} Tonnes asphalt mix × coarse stone fraction`,
        formulaExplanation: 'Cubical blue granite aggregate with Los Angeles abrasion value < 25% for high-speed vehicular tire wear resistance.',
        wastageFactorPct: 4,
        editableQuantity: Math.round(asphaltMixTonnes * 0.65),
        estimatedUnitPrice: 1350
      },
      {
        materialId: 'mat-sand',
        name: 'Stone Dust & Screened Sand Blinder (Zone II/III)',
        category: 'sand',
        estimatedQuantity: Math.round(asphaltMixTonnes * 0.25),
        unit: 'm³',
        calculationBasis: `${asphaltMixTonnes.toLocaleString()} Tonnes asphalt mix × mineral filler / fine fraction`,
        formulaExplanation: 'Clean crushed stone dust conforming to MoRTH Section 500 void-filling grading curve.',
        wastageFactorPct: 5,
        editableQuantity: Math.round(asphaltMixTonnes * 0.25),
        estimatedUnitPrice: 1600
      },
      {
        materialId: 'mat-water',
        name: 'Pugmill Mixing and Rolling Water',
        category: 'water',
        estimatedQuantity: waterKL,
        unit: 'kL',
        calculationBasis: `Water requirement for ${wmmVolumeM3 + gsbVolumeM3} m³ of granular base & sub-base compaction at OMC`,
        formulaExplanation: 'Water tanker supply for soil compaction and vibratory roller passes.',
        wastageFactorPct: 7,
        editableQuantity: waterKL,
        estimatedUnitPrice: 260
      }
    ];
  }
}

/**
 * Calculates required construction materials for a Bridge project.
 */
export function estimateBridgeMaterials(details: BridgeProjectDetails): MaterialRequirement[] {
  const spanM = Math.max(details.spanLengthM, 10);
  const widthM = Math.max(details.deckWidthM, 7.5);
  const pierHeightM = Math.max(details.pierHeightM, 4);
  const deckAreaM2 = spanM * widthM;

  // Structural concrete estimation: Deck slab + girders + piers + abutments
  const concreteVolumeM3 = Math.round(deckAreaM2 * 0.85 + (pierHeightM * widthM * 1.4));
  const cementBags = Math.round(concreteVolumeM3 * 8.2); // High strength M45/M50 grade = 8.2 bags/m³
  const steelKg = Math.round(concreteVolumeM3 * 135); // 135 kg rebar per m³ bridge concrete
  const sandM3 = Number((concreteVolumeM3 * 0.42).toFixed(1));
  const aggM3 = Number((concreteVolumeM3 * 0.84).toFixed(1));
  const waterKL = Number((concreteVolumeM3 * 0.20).toFixed(1));
  const bindingWireKg = Math.round(steelKg * 0.012);

  return [
    {
      materialId: 'mat-cement',
      name: 'High-Performance Cement (OPC 53 Grade IS 269)',
      category: 'cement',
      estimatedQuantity: cementBags,
      unit: 'bag',
      calculationBasis: `${concreteVolumeM3} m³ heavy structural concrete × 8.2 bags/m³ (M45 Grade)`,
      formulaExplanation: 'IRC:112 design criteria for prestressed & reinforced concrete highway bridges with high durability rating.',
      wastageFactorPct: 4,
      editableQuantity: cementBags,
      estimatedUnitPrice: 420
    },
    {
      materialId: 'mat-steel',
      name: 'Super Ductile TMT Rebar (Fe 550D IS 1786)',
      category: 'steel',
      estimatedQuantity: steelKg,
      unit: 'kg',
      calculationBasis: `${concreteVolumeM3} m³ concrete × 135 kg/m³ structural rebar density`,
      formulaExplanation: 'High-ductility steel rebar with guaranteed elongation (16%) for seismic bridge piers and flexural girder cages.',
      wastageFactorPct: 3,
      editableQuantity: steelKg,
      estimatedUnitPrice: 72
    },
    {
      materialId: 'mat-aggregate',
      name: 'Machine Crushed Blue Granite Aggregate 20mm & 10mm',
      category: 'aggregate',
      estimatedQuantity: aggM3,
      unit: 'm³',
      calculationBasis: `${concreteVolumeM3} m³ structural concrete × 0.84 m³ aggregate/m³`,
      formulaExplanation: 'IS 383 blue metal stone with Aggregate Impact Value < 16% and zero flakiness.',
      wastageFactorPct: 4,
      editableQuantity: aggM3,
      estimatedUnitPrice: 1450
    },
    {
      materialId: 'mat-sand',
      name: 'Hydro-Washed M-Sand Zone II (IS 383)',
      category: 'sand',
      estimatedQuantity: sandM3,
      unit: 'm³',
      calculationBasis: `${concreteVolumeM3} m³ structural concrete × 0.42 m³ sand/m³`,
      formulaExplanation: 'Silt-free manufactured sand ensuring low shrinkage and high modulus of elasticity.',
      wastageFactorPct: 5,
      editableQuantity: sandM3,
      estimatedUnitPrice: 1850
    },
    {
      materialId: 'mat-water',
      name: 'NABL Certified Potable Construction Water',
      category: 'water',
      estimatedQuantity: waterKL,
      unit: 'kL',
      calculationBasis: `${concreteVolumeM3} m³ structural concrete × 0.20 kL water/m³`,
      formulaExplanation: 'Zero chloride water conforming to IS 456 to prevent corrosion of bridge rebar.',
      wastageFactorPct: 5,
      editableQuantity: waterKL,
      estimatedUnitPrice: 380
    },
    {
      materialId: 'mat-binding-wire',
      name: 'Galvanized Annealed Binding Wire (SWG 18)',
      category: 'binding_wire',
      estimatedQuantity: bindingWireKg,
      unit: 'kg',
      calculationBasis: `1.2% of bridge rebar weight (${steelKg.toLocaleString()} kg)`,
      formulaExplanation: 'IS 280 soft wire preventing slippage during heavy vibrator needle consolidation.',
      wastageFactorPct: 5,
      editableQuantity: bindingWireKg,
      estimatedUnitPrice: 90
    }
  ];
}

/**
 * Calculates required materials for individual House Owners.
 * Simple, accurate, and tailored for residential home builders.
 */
export function estimateHouseMaterials(details: HouseOwnerDetails): MaterialRequirement[] {
  const floors = Math.max(details.numFloors, 1);
  const builtUpPerFloor = details.builtUpAreaPerFloorSqFt > 0 ? details.builtUpAreaPerFloorSqFt : 1000;
  const totalBuiltUpArea = builtUpPerFloor * floors;

  // Multipliers based on quality tier
  let cementMultiplier = 0.40;
  let steelMultiplier = 3.8;
  let sandMultiplier = 0.050;
  let aggMultiplier = 0.038;
  let brickMultiplier = 18.0;

  if (details.qualityTier === 'Premium') {
    cementMultiplier = 0.44;
    steelMultiplier = 4.2;
    sandMultiplier = 0.054;
    aggMultiplier = 0.040;
  } else if (details.qualityTier === 'Economy') {
    cementMultiplier = 0.38;
    steelMultiplier = 3.4;
  }

  const cementBags = Math.round(totalBuiltUpArea * cementMultiplier);
  const steelKg = Math.round(totalBuiltUpArea * steelMultiplier);
  const sandM3 = Number((totalBuiltUpArea * sandMultiplier).toFixed(1));
  const aggM3 = Number((totalBuiltUpArea * aggMultiplier).toFixed(1));
  const bricksCount = Math.round(totalBuiltUpArea * brickMultiplier);
  const waterKL = Number(((cementBags * 160) / 1000).toFixed(1));
  const wireKg = Math.round(steelKg * 0.01);

  return [
    {
      materialId: 'mat-cement',
      name: 'House Construction Cement (OPC/PPC 53 Grade)',
      category: 'cement',
      estimatedQuantity: cementBags,
      unit: 'bag',
      calculationBasis: `${totalBuiltUpArea.toLocaleString()} sq.ft total area (${floors} floor${floors > 1 ? 's' : ''}) × ${cementMultiplier} bags/sq.ft`,
      formulaExplanation: 'Covers entire house construction: Foundation, RCC roof slabs, columns, beams, brick mortar, and wall plastering.',
      wastageFactorPct: 5,
      editableQuantity: cementBags,
      estimatedUnitPrice: 395
    },
    {
      materialId: 'mat-steel',
      name: 'TMT Steel Rebars (Fe 500D / 550D Grade)',
      category: 'steel',
      estimatedQuantity: steelKg,
      unit: 'kg',
      calculationBasis: `${totalBuiltUpArea.toLocaleString()} sq.ft total built-up area × ${steelMultiplier} kg/sq.ft`,
      formulaExplanation: 'Reinforcement for footing mesh, column cages, beam bars, and roof slab mesh for earthquake resilience.',
      wastageFactorPct: 3,
      editableQuantity: steelKg,
      estimatedUnitPrice: 68
    },
    {
      materialId: 'mat-sand',
      name: 'Washed Fine Sand / M-Sand (Zone II)',
      category: 'sand',
      estimatedQuantity: sandM3,
      unit: 'm³',
      calculationBasis: `${totalBuiltUpArea.toLocaleString()} sq.ft total area × ${sandMultiplier} m³/sq.ft`,
      formulaExplanation: 'Screened sand required for concrete batching, bricklaying mortar (1:6 mix), and smooth wall plastering (1:4 mix).',
      wastageFactorPct: 6,
      editableQuantity: sandM3,
      estimatedUnitPrice: 1850
    },
    {
      materialId: 'mat-aggregate',
      name: 'Crushed Blue Granite Aggregate (20mm & 10mm)',
      category: 'aggregate',
      estimatedQuantity: aggM3,
      unit: 'm³',
      calculationBasis: `${totalBuiltUpArea.toLocaleString()} sq.ft total area × ${aggMultiplier} m³/sq.ft`,
      formulaExplanation: 'Hard blue stone aggregate for RCC column, slab, and lintel casting.',
      wastageFactorPct: 4,
      editableQuantity: aggM3,
      estimatedUnitPrice: 1350
    },
    {
      materialId: 'mat-bricks',
      name: 'Building Bricks / AAC Masonry Blocks',
      category: 'bricks',
      estimatedQuantity: bricksCount,
      unit: 'piece',
      calculationBasis: `${totalBuiltUpArea.toLocaleString()} sq.ft area × ${brickMultiplier} bricks/sq.ft`,
      formulaExplanation: 'External boundary and room partition walls based on standard room and bedroom configuration.',
      wastageFactorPct: 7,
      editableQuantity: bricksCount,
      estimatedUnitPrice: 11
    },
    {
      materialId: 'mat-water',
      name: 'Water for Construction & Curing',
      category: 'water',
      estimatedQuantity: waterKL,
      unit: 'kL',
      calculationBasis: `${cementBags} cement bags × 160 Liters/bag`,
      formulaExplanation: 'Potable water for mixing mortar and continuous 14-day curing of roof slabs and columns to achieve maximum strength.',
      wastageFactorPct: 8,
      editableQuantity: waterKL,
      estimatedUnitPrice: 280
    },
    {
      materialId: 'mat-binding-wire',
      name: 'Annealed Rebar Binding Wire (SWG 18)',
      category: 'binding_wire',
      estimatedQuantity: wireKg,
      unit: 'kg',
      calculationBasis: `1% of rebar steel weight (${steelKg.toLocaleString()} kg)`,
      formulaExplanation: 'Dead-soft wire for tying steel bars securely before pouring concrete.',
      wastageFactorPct: 5,
      editableQuantity: wireKg,
      estimatedUnitPrice: 82
    }
  ];
}

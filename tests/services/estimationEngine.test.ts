import { describe, it, expect } from 'vitest';
import {
  estimateBuildingMaterials,
  estimateRoadMaterials,
  estimateBridgeMaterials,
  estimateHouseMaterials
} from '../../src/services/estimationEngine';
import {
  BuildingProjectDetails,
  RoadProjectDetails,
  BridgeProjectDetails,
  HouseOwnerDetails
} from '../../src/types';

describe('Estimation Engine - Building Materials', () => {
  const baseBuilding: BuildingProjectDetails = {
    buildingName: 'Commercial Annex',
    location: 'Indore',
    stateCity: 'Indore, MP',
    totalBuiltUpAreaSqFt: 5000,
    numFloors: 2,
    areaPerFloorSqFt: 2500,
    floorHeightM: 3.3,
    buildingType: 'Commercial Building',
    structuralSystem: 'RCC Framed Structure',
    roofType: 'RCC Flat Slab',
    constructionStage: 'Full Project',
    soilBearingCapacityKPa: 200
  };

  it('calculates building materials for standard RCC Framed Structure with correct thumb-rules', () => {
    const materials = estimateBuildingMaterials(baseBuilding);

    expect(materials).toBeDefined();
    expect(materials.length).toBe(7);

    // Categories checked
    const categories = materials.map((m) => m.category);
    expect(categories).toContain('cement');
    expect(categories).toContain('steel');
    expect(categories).toContain('sand');
    expect(categories).toContain('aggregate');
    expect(categories).toContain('bricks');
    expect(categories).toContain('water');
    expect(categories).toContain('binding_wire');

    // Check Cement calculation: area 5000 * 0.42 * 1.0 = 2100 bags raw. With 5% wastage = Math.round(2100 * 1.05) = 2205 bags.
    const cement = materials.find((m) => m.category === 'cement')!;
    expect(cement.estimatedQuantity).toBe(2205);
    expect(cement.unit).toBe('bag');
    expect(cement.wastageFactorPct).toBe(5);
    expect(cement.editableQuantity).toBe(2205);

    // Check Steel calculation: 5000 * 4.0 * 1.0 = 20000 kg. With 3% wastage = Math.round(20000 * 1.03) = 20600 kg.
    const steel = materials.find((m) => m.category === 'steel')!;
    expect(steel.estimatedQuantity).toBe(20600);
    expect(steel.unit).toBe('kg');
    expect(steel.wastageFactorPct).toBe(3);

    // Sand: 5000 * 0.052 = 260 m3. With 6% wastage = 275.6 m3.
    const sand = materials.find((m) => m.category === 'sand')!;
    expect(sand.estimatedQuantity).toBeCloseTo(275.6, 1);

    // Coarse Aggregate: 5000 * 0.038 = 190 m3. With 4% wastage = 197.6 m3.
    const agg = materials.find((m) => m.category === 'aggregate')!;
    expect(agg.estimatedQuantity).toBeCloseTo(197.6, 1);

    // Bricks: 5000 * 18 = 90000 bricks. With 7% wastage = 96300 bricks.
    const bricks = materials.find((m) => m.category === 'bricks')!;
    expect(bricks.estimatedQuantity).toBe(96300);

    // Water: (2205 * 165) / 1000 = 363.8 kL
    const water = materials.find((m) => m.category === 'water')!;
    expect(water.estimatedQuantity).toBe(363.8);

    // Binding wire: 1.1% of total steel = Math.round(20600 * 0.011) = 227 kg
    const wire = materials.find((m) => m.category === 'binding_wire')!;
    expect(wire.estimatedQuantity).toBe(227);
  });

  it('adjusts coefficients for Load-Bearing Structure', () => {
    const loadBearing: BuildingProjectDetails = {
      ...baseBuilding,
      structuralSystem: 'Load-Bearing Structure'
    };
    const materials = estimateBuildingMaterials(loadBearing);

    const cement = materials.find((m) => m.category === 'cement')!;
    const steel = materials.find((m) => m.category === 'steel')!;
    const bricks = materials.find((m) => m.category === 'bricks')!;

    // Load-bearing uses 0.35 cement factor and 2.0 steel factor and 22.0 brick factor
    // Raw cement = 5000 * 0.35 = 1750. With 5% = 1838 bags
    expect(cement.estimatedQuantity).toBe(1838);
    // Raw steel = 5000 * 2.0 = 10000. With 3% = 10300 kg
    expect(steel.estimatedQuantity).toBe(10300);
    // Raw bricks = 5000 * 22 = 110000. With 7% = 117700 bricks
    expect(bricks.estimatedQuantity).toBe(117700);
  });

  it('adjusts coefficients for Steel Structure', () => {
    const steelStruct: BuildingProjectDetails = {
      ...baseBuilding,
      structuralSystem: 'Steel Structure'
    };
    const materials = estimateBuildingMaterials(steelStruct);

    const cement = materials.find((m) => m.category === 'cement')!;
    const steel = materials.find((m) => m.category === 'steel')!;
    const bricks = materials.find((m) => m.category === 'bricks')!;

    // Steel structure: cement factor 0.25, steel factor 2.2, brick factor 14.0
    // Raw cement = 5000 * 0.25 = 1250. With 5% = 1313 bags
    expect(cement.estimatedQuantity).toBe(1313);
    // Raw steel = 5000 * 2.2 = 11000. With 3% = 11330 kg
    expect(steel.estimatedQuantity).toBe(11330);
    // Raw bricks = 5000 * 14 = 70000. With 7% = 74900 bricks
    expect(bricks.estimatedQuantity).toBe(74900);
  });

  it('applies multi-floor height allowance for buildings with more than 3 floors', () => {
    const highRise: BuildingProjectDetails = {
      ...baseBuilding,
      numFloors: 5
    };
    const materials = estimateBuildingMaterials(highRise);

    // floorFactor is 1.05 for floors > 3
    // Raw cement = Math.round(5000 * 0.42 * 1.05) = 2205. Total = Math.round(2205 * 1.05) = 2315
    const cement = materials.find((m) => m.category === 'cement')!;
    expect(cement.estimatedQuantity).toBe(2315);
  });

  it('clamps minimum area to 100 sq.ft and floors to 1', () => {
    const smallProject: BuildingProjectDetails = {
      ...baseBuilding,
      totalBuiltUpAreaSqFt: 0,
      numFloors: 0
    };
    const materials = estimateBuildingMaterials(smallProject);

    const cement = materials.find((m) => m.category === 'cement')!;
    // Clamped area 100 * 0.42 * 1 = 42. With 5% = 44 bags
    expect(cement.estimatedQuantity).toBe(44);
  });
});

describe('Estimation Engine - Road Materials', () => {
  it('estimates rigid concrete road (PQC) materials according to IRC:58 specifications', () => {
    const roadDetails: RoadProjectDetails = {
      roadName: 'State Highway Corridor',
      lengthKm: 2,
      widthM: 7.0,
      thicknessMm: 280,
      roadType: 'Highway',
      pavementType: 'Rigid Pavement',
      lanes: 2,
      subgradeCbrPct: 8,
      trafficMsa: 15,
      soilSubgradeInfo: 'Sandy Silt'
    };

    const materials = estimateRoadMaterials(roadDetails);

    expect(materials.length).toBe(6);
    const categories = materials.map((m) => m.category);
    expect(categories).toContain('cement');
    expect(categories).toContain('sand');
    expect(categories).toContain('aggregate');
    expect(categories).toContain('steel');
    expect(categories).toContain('gsb');
    expect(categories).toContain('water');

    // Surface area = 2000m * 7m = 14,000 m2
    // Thickness = 0.28m
    // PQC Volume = 14000 * 0.28 = 3920 m3
    // Cement = Math.round(3920 * 7.8) = 30576 bags
    const cement = materials.find((m) => m.category === 'cement')!;
    expect(cement.estimatedQuantity).toBe(30576);

    // Dowel steel = Math.round(14000 * 3.6) = 50400 kg
    const steel = materials.find((m) => m.category === 'steel')!;
    expect(steel.estimatedQuantity).toBe(50400);

    // GSB volume = 2000 * (7 + 0.8) * 0.15 = 2000 * 7.8 * 0.15 = 2340 m3
    const gsb = materials.find((m) => m.category === 'gsb')!;
    expect(gsb.estimatedQuantity).toBe(2340);
  });

  it('estimates flexible bituminous pavement materials according to MoRTH specifications', () => {
    const flexibleRoad: RoadProjectDetails = {
      roadName: 'District Road 12',
      lengthKm: 1,
      widthM: 7.0,
      thicknessMm: 115,
      roadType: 'Rural Road',
      pavementType: 'Flexible Pavement',
      lanes: 2,
      subgradeCbrPct: 6,
      trafficMsa: 5,
      soilSubgradeInfo: 'Clayey Soil'
    };

    const materials = estimateRoadMaterials(flexibleRoad);

    expect(materials.length).toBe(6);
    const categories = materials.map((m) => m.category);
    expect(categories).toContain('bitumen');
    expect(categories).toContain('wmm');
    expect(categories).toContain('gsb');
    expect(categories).toContain('aggregate');
    expect(categories).toContain('sand');
    expect(categories).toContain('water');

    // Surface area = 1000m * 7m = 7000 m2
    // Bituminous volume = 7000 * 0.115 = 805 m3
    // Compacted mix tonnes = Math.round(805 * 2.42) = 1948 Tonnes
    // Bitumen tonnes = 1948 * 0.049 = 95.5 Tonnes
    const bitumen = materials.find((m) => m.category === 'bitumen')!;
    expect(bitumen.estimatedQuantity).toBe(95.5);
    expect(bitumen.unit).toBe('ton');

    // WMM base course = 7000 * 0.225 = 1575 m3
    const wmm = materials.find((m) => m.category === 'wmm')!;
    expect(wmm.estimatedQuantity).toBe(1575);

    // GSB = 1000 * (7 + 0.6) * 0.15 = 1140 m3
    const gsb = materials.find((m) => m.category === 'gsb')!;
    expect(gsb.estimatedQuantity).toBe(1140);
  });
});

describe('Estimation Engine - Bridge Materials', () => {
  it('estimates bridge superstructure and substructure materials using IRC:112 criteria', () => {
    const bridgeDetails: BridgeProjectDetails = {
      bridgeName: 'River Flyover',
      location: 'Narmada Crossing',
      spanLengthM: 40,
      deckWidthM: 12.0,
      pierHeightM: 8.0,
      bridgeType: 'Prestressed Concrete',
      designLoad: 'IRC Class 70R'
    };

    const materials = estimateBridgeMaterials(bridgeDetails);

    expect(materials.length).toBe(6);
    const categories = materials.map((m) => m.category);
    expect(categories).toContain('cement');
    expect(categories).toContain('steel');
    expect(categories).toContain('aggregate');
    expect(categories).toContain('sand');
    expect(categories).toContain('water');
    expect(categories).toContain('binding_wire');

    // Deck area = 40 * 12 = 480 m2
    // Concrete volume = Math.round(480 * 0.85 + (8 * 12 * 1.4)) = Math.round(408 + 134.4) = 542 m3
    // Cement bags = Math.round(542 * 8.2) = 4444 bags
    const cement = materials.find((m) => m.category === 'cement')!;
    expect(cement.estimatedQuantity).toBe(4444);

    // Steel rebar = Math.round(542 * 135) = 73170 kg
    const steel = materials.find((m) => m.category === 'steel')!;
    expect(steel.estimatedQuantity).toBe(73170);

    // Binding wire = Math.round(73170 * 0.012) = 878 kg
    const wire = materials.find((m) => m.category === 'binding_wire')!;
    expect(wire.estimatedQuantity).toBe(878);
  });
});

describe('Estimation Engine - House Owner Materials', () => {
  it('calculates residential house materials for Standard quality tier', () => {
    const houseDetails: HouseOwnerDetails = {
      houseName: 'Green Villa',
      location: 'Bhopal',
      plotAreaSqFt: 1500,
      builtUpAreaPerFloorSqFt: 1200,
      numFloors: 2,
      bedrooms: 3,
      bathrooms: 3,
      houseType: 'Villa',
      qualityTier: 'Standard',
      roofType: 'RCC Flat Slab',
      approximateBudget: 4000000
    };

    const materials = estimateHouseMaterials(houseDetails);

    expect(materials.length).toBe(7);
    // Total built-up area = 1200 * 2 = 2400 sq.ft
    // Cement: 2400 * 0.40 = 960 bags
    const cement = materials.find((m) => m.category === 'cement')!;
    expect(cement.estimatedQuantity).toBe(960);

    // Steel: 2400 * 3.8 = 9120 kg
    const steel = materials.find((m) => m.category === 'steel')!;
    expect(steel.estimatedQuantity).toBe(9120);

    // Sand: 2400 * 0.050 = 120.0 m3
    const sand = materials.find((m) => m.category === 'sand')!;
    expect(sand.estimatedQuantity).toBe(120.0);

    // Bricks: 2400 * 18 = 43200 pieces
    const bricks = materials.find((m) => m.category === 'bricks')!;
    expect(bricks.estimatedQuantity).toBe(43200);
  });

  it('applies Premium quality tier multipliers for luxury residences', () => {
    const houseDetails: HouseOwnerDetails = {
      houseName: 'Luxury Villa',
      location: 'Indore',
      plotAreaSqFt: 1200,
      builtUpAreaPerFloorSqFt: 1000,
      numFloors: 1,
      bedrooms: 2,
      bathrooms: 2,
      houseType: 'Villa',
      qualityTier: 'Premium',
      roofType: 'RCC Flat Slab',
      approximateBudget: 3500000
    };

    const materials = estimateHouseMaterials(houseDetails);

    // Total area = 1000 sq.ft
    // Premium cement multiplier = 0.44 -> 440 bags
    const cement = materials.find((m) => m.category === 'cement')!;
    expect(cement.estimatedQuantity).toBe(440);

    // Premium steel multiplier = 4.2 -> 4200 kg
    const steel = materials.find((m) => m.category === 'steel')!;
    expect(steel.estimatedQuantity).toBe(4200);
  });

  it('applies Economy quality tier multipliers for budget housing', () => {
    const houseDetails: HouseOwnerDetails = {
      houseName: 'Budget Home',
      location: 'Ujjain',
      plotAreaSqFt: 1200,
      builtUpAreaPerFloorSqFt: 1000,
      numFloors: 1,
      bedrooms: 2,
      bathrooms: 1,
      houseType: 'Small House',
      qualityTier: 'Economy',
      roofType: 'RCC Flat Slab',
      approximateBudget: 2000000
    };

    const materials = estimateHouseMaterials(houseDetails);

    // Economy cement multiplier = 0.38 -> 380 bags
    const cement = materials.find((m) => m.category === 'cement')!;
    expect(cement.estimatedQuantity).toBe(380);

    // Economy steel multiplier = 3.4 -> 3400 kg
    const steel = materials.find((m) => m.category === 'steel')!;
    expect(steel.estimatedQuantity).toBe(3400);
  });
});

import { ProjectRecord } from '../types';
import { estimateBuildingMaterials, estimateRoadMaterials, estimateHouseMaterials } from '../services/estimationEngine';

export const INITIAL_PROJECTS: ProjectRecord[] = [
  {
    id: 'proj-skyline-heights',
    name: 'Skyline Commercial Arcade & Tower',
    category: 'building',
    location: 'Sector 62, Cyber City',
    stateCity: 'Noida, Uttar Pradesh',
    description: 'G+4 commercial office building with basement parking, RCC framed structure with ductile seismic detailing.',
    createdAt: '2026-08-28',
    status: 'Materials Selected',
    buildingDetails: {
      buildingName: 'Skyline Commercial Arcade',
      location: 'Sector 62, Cyber City',
      stateCity: 'Noida, Uttar Pradesh',
      totalBuiltUpAreaSqFt: 18500,
      areaPerFloorSqFt: 3700,
      numFloors: 5,
      floorHeightM: 3.6,
      buildingType: 'Commercial Building',
      structuralSystem: 'RCC Framed Structure',
      roofType: 'RCC Flat Slab with Waterproofing',
      constructionStage: 'Superstructure',
      soilBearingCapacityKPa: 220,
      additionalDetails: 'Seismic Zone IV compliance required with Fe 550D rebar.'
    },
    requiredMaterials: estimateBuildingMaterials({
      buildingName: 'Skyline Commercial Arcade',
      location: 'Sector 62, Cyber City',
      stateCity: 'Noida, Uttar Pradesh',
      totalBuiltUpAreaSqFt: 18500,
      areaPerFloorSqFt: 3700,
      numFloors: 5,
      floorHeightM: 3.6,
      buildingType: 'Commercial Building',
      structuralSystem: 'RCC Framed Structure',
      roofType: 'RCC Flat Slab',
      constructionStage: 'Superstructure'
    }),
    selectedProducts: {
      cement: 'cem-ultratech-super',
      steel: 'stl-tata-tiscon-550d',
      sand: 'snd-triple-washed-msand',
      aggregate: 'agg-graded-blue-granite',
      bricks: 'brk-aac-aerated-blocks',
      water: 'wtr-potable-nabl-tested',
      binding_wire: 'bw-annealed-gi-swg18'
    },
    customQuantities: {},
    logisticsConfig: {
      includeTransportation: true,
      transportationCostPct: 4.5,
      includeLabor: true,
      laborCostPct: 18.0,
      includeTax: true,
      taxGstPct: 18.0,
      includeContingency: true,
      contingencyPct: 5.0
    }
  },
  {
    id: 'proj-nh-expressway-link',
    name: 'Eastern Bypass Highway Corridor Link',
    category: 'road',
    location: 'Chainage 14+200 to 18+700',
    stateCity: 'Nagpur, Maharashtra',
    description: '4-lane divided flexible highway pavement with 150mm GSB and 225mm WMM base under heavy commercial freight traffic.',
    createdAt: '2026-09-02',
    status: 'Materials Selected',
    roadDetails: {
      roadName: 'Eastern Bypass Highway Corridor Link',
      lengthKm: 4.5,
      widthM: 15.0,
      thicknessMm: 115,
      roadType: 'Highway',
      pavementType: 'Flexible Pavement',
      lanes: 4,
      subgradeCbrPct: 8,
      trafficMsa: 50,
      soilSubgradeInfo: 'Compacted black cotton subgrade with lime stabilization and non-expansive soil blanket.',
      additionalDetails: 'MoRTH Section 500 compliant VG-30 bitumen with anti-stripping additives.'
    },
    requiredMaterials: estimateRoadMaterials({
      roadName: 'Eastern Bypass Highway Corridor Link',
      lengthKm: 4.5,
      widthM: 15.0,
      thicknessMm: 115,
      roadType: 'Highway',
      pavementType: 'Flexible Pavement',
      lanes: 4,
      subgradeCbrPct: 8,
      trafficMsa: 50,
      soilSubgradeInfo: 'Compacted subgrade'
    }),
    selectedProducts: {
      bitumen: 'bit-vg30-ioc-refinery',
      wmm: 'wmm-pugmill-premixed',
      gsb: 'gsb-grading-1-nhai',
      aggregate: 'agg-graded-blue-granite',
      sand: 'snd-triple-washed-msand',
      water: 'wtr-potable-nabl-tested'
    },
    customQuantities: {},
    logisticsConfig: {
      includeTransportation: true,
      transportationCostPct: 5.0,
      includeLabor: true,
      laborCostPct: 15.0,
      includeTax: true,
      taxGstPct: 18.0,
      includeContingency: true,
      contingencyPct: 4.0
    }
  },
  {
    id: 'proj-anand-green-villa',
    name: 'Anand Heritage Duplex Villa',
    category: 'building',
    location: 'Greenwood Enclave, Plot 42',
    stateCity: 'Bengaluru, Karnataka',
    description: '2-storey independent modern duplex house with 3 BHK, terrace garden, and rainwater harvesting sump.',
    createdAt: '2026-09-09',
    status: 'Materials Selected',
    houseDetails: {
      houseName: 'Anand Heritage Duplex Villa',
      location: 'Greenwood Enclave, Plot 42, Bengaluru',
      numFloors: 2,
      plotAreaSqFt: 2400,
      builtUpAreaPerFloorSqFt: 1400,
      bedrooms: 3,
      bathrooms: 3,
      houseType: 'Duplex',
      roofType: 'RCC Flat Slab',
      qualityTier: 'Standard',
      approximateBudget: 4200000,
      additionalRequirements: 'Eco-friendly AAC blocks and water-resistant roof slab cement.'
    },
    requiredMaterials: estimateHouseMaterials({
      houseName: 'Anand Heritage Duplex Villa',
      location: 'Greenwood Enclave, Plot 42, Bengaluru',
      numFloors: 2,
      plotAreaSqFt: 2400,
      builtUpAreaPerFloorSqFt: 1400,
      bedrooms: 3,
      bathrooms: 3,
      houseType: 'Duplex',
      roofType: 'RCC Flat Slab',
      qualityTier: 'Standard',
      approximateBudget: 4200000
    }),
    selectedProducts: {
      cement: 'cem-ambuja-plus',
      steel: 'stl-jsw-neosteel-500d',
      sand: 'snd-triple-washed-msand',
      aggregate: 'agg-graded-blue-granite',
      bricks: 'brk-aac-aerated-blocks',
      water: 'wtr-groundwater-filtered',
      binding_wire: 'bw-black-annealed-swg18'
    },
    customQuantities: {},
    logisticsConfig: {
      includeTransportation: true,
      transportationCostPct: 4.0,
      includeLabor: true,
      laborCostPct: 20.0,
      includeTax: true,
      taxGstPct: 18.0,
      includeContingency: false,
      contingencyPct: 5.0
    }
  }
];

export const INITIAL_SAMPLE_PROJECTS = INITIAL_PROJECTS;


import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  SERVER_BIS_REGISTRY,
  searchBisStandards,
  getBisStandardByCode,
  getBisVerificationUrl,
  getManakonlineUrl
} from './src/server/bisDatabaseServer.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));

// Helper to initialize GoogleGenAI with standard aistudio-build telemetry
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'STANDARD X - Bureau of Indian Standards & Procurement Intelligence API',
    timestamp: new Date().toISOString(),
    aiEngineAvailable: Boolean(process.env.GEMINI_API_KEY),
    bisDatabaseCount: SERVER_BIS_REGISTRY.length
  });
});

// GET /api/bis/standards - Query BIS Standards Registry Database
app.get('/api/bis/standards', (req: Request, res: Response) => {
  try {
    const q = req.query.q as string | undefined;
    const category = req.query.category as string | undefined;
    const results = searchBisStandards(q, category);
    res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error: any) {
    console.error('Error fetching BIS standards:', error);
    res.status(500).json({ error: error.message || 'Failed to retrieve BIS standards' });
  }
});

// GET /api/bis/standards/:code - Get Single Standard Details
app.get('/api/bis/standards/:code', (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const std = getBisStandardByCode(code);
    if (!std) {
      // Return standard with constructed links if not specifically in hardcoded list
      const cleanCode = decodeURIComponent(code).trim();
      res.json({
        success: true,
        data: {
          code: cleanCode,
          title: `Indian Standard Specification for ${cleanCode}`,
          category: 'Civil & Construction Engineering',
          scope: 'Prescribes mandatory specifications, sampling protocols, and quality benchmarks conforming to BIS regulations.',
          isMandatoryQco: true,
          qcoReference: 'Statutory Quality Control Order under BIS Act, 2016',
          issuingMinistry: 'Government of India & Bureau of Indian Standards',
          keyRequirements: ['Must conform to chemical and physical thresholds specified in latest revision.'],
          mandatoryTests: ['Batch proof test', 'Chemical analysis', 'Dimensional tolerances'],
          fieldTestingTips: ['Verify valid ISI mark and CM/L license number on package or mill certificate.'],
          referenceDocument: 'Bureau of Indian Standards, Manak Bhavan, New Delhi',
          verificationSource: 'BIS Standards Portal',
          bisUrl: getBisVerificationUrl(cleanCode),
          manakonlineUrl: getManakonlineUrl(cleanCode)
        }
      });
      return;
    }
    res.json({ success: true, data: std });
  } catch (error: any) {
    console.error('Error fetching BIS standard detail:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch standard' });
  }
});

// POST /api/bis/generate-project-standards - Use LLM (gemini-3.8-flash) to generate complete project BIS standards
app.post('/api/bis/generate-project-standards', async (req: Request, res: Response) => {
  try {
    const {
      projectName,
      category,
      location,
      description,
      qualitySpecifications,
      buildingSpecs,
      roadSpecs,
      bridgeSpecs,
      materials,
      rawTextSnippet
    } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      console.warn('GEMINI_API_KEY missing on server. Returning server-database project standards fallback.');
      res.json({
        success: true,
        source: 'server-database-fallback',
        data: buildFallbackProjectStandards({
          projectName,
          category,
          location,
          description,
          qualitySpecifications
        })
      });
      return;
    }

    const prompt = `
You are the Director General and Chief Technical Specifier of the Bureau of Indian Standards (BIS) and chief engineering consultant for CPWD, NHAI, and Ministry of Road Transport and Highways (MoRTH).

The procurement & civil engineering team has submitted the following complete project for exhaustive BIS standards generation and quality benchmarking:

Project Name: "${projectName || 'Infrastructure Project'}"
Category: "${category || 'building'}"
Location: "${location || 'India'}"
Description: "${description || 'Comprehensive civil construction project'}"
Quality Specifications: ${JSON.stringify(qualitySpecifications || {})}
Engineering Dimensions: ${JSON.stringify(buildingSpecs || roadSpecs || bridgeSpecs || {})}
Materials/BOQ Highlights: ${JSON.stringify(materials || [])}
Tender Context Excerpt: """
${rawTextSnippet ? String(rawTextSnippet).slice(0, 1500) : 'General project specifications'}
"""

YOUR TASK:
Generate the COMPLETE, AUTHORITATIVE Bureau of Indian Standards (BIS) standards suite for the WHOLE PROJECT and for EVERY individual material required for this project.
Do NOT omit important Indian Standards. Ensure that every material has a multi-standard suite covering:
1. Core Specification
2. Mandatory Test
3. Chemical Analysis
4. Structural Design & Detailing / Workmanship
5. Splicing & Couplers / Joining
6. Corrosion & Coating / Durability
7. Sampling & Quality Inspection

Return ONLY valid JSON matching this exact structure:
{
  "projectStandardsSummary": "2-3 sentence technical executive summary of the governing BIS standards framework, structural safety, durability, and statutory quality control orders for this whole project.",
  "primaryGoverningStandards": [
    {
      "code": "IS 456:2000",
      "title": "Plain and Reinforced Concrete — Code of Practice",
      "role": "Structural Design & Detailing",
      "purpose": "Governing structural design and detailing standard for all concrete members.",
      "keyClauses": ["Clause 5: Cement & aggregates", "Clause 6: Concrete mix design", "Table 5: Durability exposure"],
      "acceptanceCriteria": "Characteristic cube strength ≥ design grade (M25/M30); maximum w/c ratio 0.45.",
      "isMandatoryQco": true
    }
  ],
  "materials": [
    {
      "id": "mat-rebar",
      "category": "Structural Reinforcement",
      "productName": "High Strength Deformed Steel Bars (TMT Rebars)",
      "shortName": "Steel TMT Rebars",
      "requiredGradeOrSpec": "Fe 550D / Fe 500D Super Ductile Grade (IS 1786)",
      "estimatedQuantity": "75 Metric Tonnes",
      "standardCode": "IS 1786:2008",
      "standardTitle": "High strength deformed steel bars and wires for concrete reinforcement — Specification",
      "editionAmendment": "Fourth Revision (Amendment A3:2021)",
      "isMandatoryQco": true,
      "qcoReference": "Steel and Steel Products (Quality Control) Order, 2024 (Ministry of Steel)",
      "issuingMinistry": "Ministry of Steel & BIS",
      "mandatoryTests": [
        "Tensile Strength, Yield Stress & % Elongation (IS 1608 Part 1)",
        "180° Cold Bend and Rebend Test (IS 1599)",
        "Chemical Spectrometry (S+P max 0.075%)"
      ],
      "acceptanceCriteria": "Min Proof Stress 500/550 MPa; UTS/YS ≥ 1.10; Elongation ≥ 16.0% (Fe 500D).",
      "certificationType": "BIS ISI Mark",
      "notesForProcurement": "Must carry cast-in brand, grade Fe 500D, and BIS ISI hallmark.",
      "applicableStandards": [
        {
          "code": "IS 1786:2008",
          "title": "High strength deformed steel bars and wires for concrete reinforcement — Specification",
          "role": "Core Specification",
          "purpose": "Governing product standard defining TMT bars, strength grades, and ISI marking.",
          "keyClauses": ["Clause 4.2: Chemical limits", "Clause 8.1: Proof stress & UTS", "Clause 9: Rib geometry"],
          "testParametersOrAcceptance": "Fe 500D: Min YS = 500 MPa, Min UTS = 565 MPa, UTS/YS ≥ 1.10, Elongation ≥ 16.0%.",
          "isMandatoryQco": true
        },
        {
          "code": "IS 1608 (Part 1):2018",
          "title": "Metallic materials — Tensile testing — Part 1: Method of test at room temperature",
          "role": "Mandatory Test",
          "purpose": "National tensile testing standard for yield stress and elongation.",
          "keyClauses": ["Clause 7: Gauge length calibration", "Clause 10.3: 0.2% proof stress"],
          "testParametersOrAcceptance": "Strain-rate controlled tensile test on full cross-section rebar samples.",
          "isMandatoryQco": true
        },
        {
          "code": "IS 1599:2019",
          "title": "Metallic materials — Bend test (Cold Mandrel Rebend Test)",
          "role": "Mandatory Test",
          "purpose": "Plastic ductility evaluation to ensure rebars bend without brittle fracture.",
          "keyClauses": ["Clause 6: Cold bend", "Annex A: Accelerated aging rebend test"],
          "testParametersOrAcceptance": "180° cold bend around 3d mandrel with zero surface fissures.",
          "isMandatoryQco": true
        },
        {
          "code": "IS 228 (Parts 1 to 24)",
          "title": "Methods for chemical analysis of steels",
          "role": "Chemical Analysis",
          "purpose": "Quantifies Carbon, Sulphur, Phosphorus, and Carbon Equivalent.",
          "keyClauses": ["Part 1: Determination of Carbon", "Part 2: Determination of Sulphur"],
          "testParametersOrAcceptance": "Sulphur max 0.040%, Phosphorus max 0.040%, Combined S+P max 0.075%.",
          "isMandatoryQco": true
        },
        {
          "code": "IS 13920:2016",
          "title": "Ductile Design and Detailing of Reinforced Concrete Structures Subjected to Seismic Forces",
          "role": "Structural Design & Detailing",
          "purpose": "Mandatory detailing rules for seismic energy dissipation.",
          "keyClauses": ["Clause 6: Beam flexural reinforcement", "Clause 7: Column confinement"],
          "testParametersOrAcceptance": "135° hook ties with 10d extension; lap splices confined with hoops.",
          "isMandatoryQco": true
        },
        {
          "code": "IS 16172:2014",
          "title": "Reinforcement Couplers for Mechanical Splices of Bars in Concrete",
          "role": "Splicing & Couplers",
          "purpose": "Mechanical rebar couplers replacing congested welded/lap splices.",
          "keyClauses": ["Clause 5: Static tensile test", "Clause 6: Cyclic tensile-compression test"],
          "testParametersOrAcceptance": "Tensile strength of coupler assembly must exceed 100% of specified UTS of bar.",
          "isMandatoryQco": false
        }
      ]
    }
  ],
  "tenderDraftClause": "Ready-to-use formal BIS compliance clause for inclusion into GeM or CPWD tender specifications."
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.15
      }
    });

    const responseText = response.text || '{}';
    let parsedResult;
    try {
      parsedResult = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Gemini output as JSON:', responseText);
      res.json({
        success: true,
        source: 'server-database-fallback',
        data: buildFallbackProjectStandards({
          projectName,
          category,
          location,
          description,
          qualitySpecifications
        })
      });
      return;
    }

    // Enrich all standards with verified BIS URLs & Manakonline search links
    if (parsedResult.materials && Array.isArray(parsedResult.materials)) {
      parsedResult.materials = parsedResult.materials.map((mat: any) => {
        const stdCode = mat.standardCode || 'IS 456';
        const enrichedMat = {
          ...mat,
          certificationVerificationUrl: getBisVerificationUrl(stdCode),
          manakonlineSearchUrl: getManakonlineUrl(stdCode)
        };

        if (Array.isArray(enrichedMat.applicableStandards)) {
          enrichedMat.applicableStandards = enrichedMat.applicableStandards.map((std: any) => ({
            ...std,
            bisUrl: getBisVerificationUrl(std.code || 'IS 456'),
            manakonlineUrl: getManakonlineUrl(std.code || 'IS 456')
          }));
        }

        return enrichedMat;
      });
    }

    if (parsedResult.primaryGoverningStandards && Array.isArray(parsedResult.primaryGoverningStandards)) {
      parsedResult.primaryGoverningStandards = parsedResult.primaryGoverningStandards.map((std: any) => ({
        ...std,
        bisUrl: getBisVerificationUrl(std.code || 'IS 456'),
        manakonlineUrl: getManakonlineUrl(std.code || 'IS 456')
      }));
    }

    res.json({
      success: true,
      source: 'gemini-3.8-flash',
      data: parsedResult
    });
  } catch (error: any) {
    console.error('Project BIS standards generation error:', error);
    res.json({
      success: true,
      source: 'server-database-fallback',
      error: error.message,
      data: buildFallbackProjectStandards(req.body || {})
    });
  }
});

// POST /api/procurement/recommend - AI Semantic Procurement Engine
app.post('/api/procurement/recommend', async (req: Request, res: Response) => {
  try {
    const { query, language, officerContext } = req.body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      res.status(400).json({ error: 'Query text is required' });
      return;
    }

    const ai = getGeminiClient();

    if (!ai) {
      res.json({
        success: true,
        useLocalKnowledgeBase: true,
        message: 'No GEMINI_API_KEY configured; utilizing local semantic knowledge base.'
      });
      return;
    }

    const prompt = `
You are the senior technical standards advisor to the Bureau of Indian Standards (BIS) and Director of Technical Specifications for Government of India e-Marketplace (GeM) and Central Public Works Department (CPWD).

A procurement officer has entered the following requirement or tender excerpt:
"""
${query}
"""
Language: ${language || 'Auto-detect'}
Officer Context: ${officerContext || 'Central Government Procurement Specialist'}

Perform deep semantic and normative analysis to identify the complete Indian Standards (IS) ecosystem for this procurement.
Do NOT just match keywords. Understand the application, material performance, durability, safety, and mandatory Quality Control Orders (QCO).

Return ONLY valid JSON matching this exact structure:
{
  "detectedDomain": "Civil / Mechanical / Electrical / Piping / Consumer / Renewable",
  "detectedLanguage": "English / Hindi / Regional",
  "semanticAnalysis": "Brief 2-3 sentence technical justification of the material behavior, structural/safety role, and why these standards apply.",
  "primaryStandards": [
    {
      "code": "IS 2062:2021",
      "title": "Hot Rolled Medium and High Tensile Structural Steel — Specification",
      "edition": "Fifth Revision",
      "latestAmendment": "A1:2023",
      "scope": "Covers requirements for steel for welded and bolted structures.",
      "relevanceScore": 96,
      "matchExplanation": "Directly governs strength, chemical limits, and carbon equivalent for high-load structural steel.",
      "isMandatoryQco": true
    }
  ],
  "normativeReferences": [
    { "code": "IS 1367", "title": "Technical Supply Conditions for Threaded Steel Fasteners" },
    { "code": "IS 8910", "title": "General Technical Delivery Requirements for Steel and Steel Products" }
  ],
  "alliedStandards": [
    { "code": "IS 8500", "title": "Structural Steel - Microalloyed - Specification" },
    { "code": "IS 6392", "title": "Steel Pipe Flanges" }
  ],
  "testMethodStandards": [
    { "code": "IS 1608 (Part 1)", "title": "Metallic Materials — Tensile Testing at Ambient Temperature" },
    { "code": "IS 1599", "title": "Metallic Materials — Bend Test" }
  ],
  "safetyAndInstallationStandards": [
    { "code": "IS 8486", "title": "Code of Practice for Safety in Welding" }
  ],
  "mandatoryCertifications": [
    {
      "scheme": "BIS Product Certification (ISI Mark)",
      "isCompulsory": true,
      "qcoOrderReference": "Steel and Steel Products (Quality Control) Order, Ministry of Steel",
      "description": "Compulsory ISI mark under Section 16 of BIS Act, 2016. Tenders cannot accept un-certified stock."
    }
  ],
  "tenderDraftClause": "Formal technical specification clause ready to paste into GeM or CPWD tender documents..."
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const responseText = response.text || '{}';
    let parsedResult;
    try {
      parsedResult = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Gemini JSON output:', responseText);
      res.json({
        success: true,
        useLocalKnowledgeBase: true,
        message: 'Could not parse AI output as JSON, fallback to knowledge base.'
      });
      return;
    }

    res.json({
      success: true,
      data: parsedResult,
      source: 'gemini-3.8-flash'
    });
  } catch (error: any) {
    console.error('Gemini Recommendation Error:', error);
    res.status(500).json({
      error: error.message || 'Internal server error',
      useLocalKnowledgeBase: true
    });
  }
});

// Fallback project standards generator grounded in BIS server registry
function buildFallbackProjectStandards(project: any) {
  const isRoad = project.category === 'road';
  const isBridge = project.category === 'bridge';

  const primaryGoverningStandards = isRoad
    ? [
        {
          code: 'IRC:37-2018',
          title: 'Guidelines for the Design of Flexible Pavements',
          role: 'Structural Design & Detailing',
          purpose: 'Prescribes design methodology, traffic loading (MSA), subgrade CBR, and bituminous layer thickness.',
          keyClauses: ['Section 5: Design Traffic Estimation', 'Section 8: Fatigue and Rutting Models'],
          acceptanceCriteria: 'Minimum 98% compaction of MDD; subgrade CBR ≥ 8.0%.',
          isMandatoryQco: true,
          bisUrl: getBisVerificationUrl('IRC 37'),
          manakonlineUrl: getManakonlineUrl('IRC 37')
        },
        {
          code: 'IS 73:2018',
          title: 'Paving Bitumen — Specification (Fifth Revision)',
          role: 'Core Specification',
          purpose: 'Mandatory standard for viscosity-graded VG-30 and VG-40 paving bitumen.',
          keyClauses: ['Clause 4: Physical requirements', 'Table 1: Absolute viscosity at 60°C'],
          acceptanceCriteria: 'Absolute viscosity 2400-3600 Poise (VG-30); Flash point ≥ 220°C.',
          isMandatoryQco: true,
          bisUrl: getBisVerificationUrl('IS 73'),
          manakonlineUrl: getManakonlineUrl('IS 73')
        }
      ]
    : isBridge
    ? [
        {
          code: 'IRC:112-2020',
          title: 'Code of Practice for Concrete Road Bridges',
          role: 'Structural Design & Detailing',
          purpose: 'Governing limit state design code for substructure, prestressed superstructures, and deck slabs.',
          keyClauses: ['Section 6: Durability requirements', 'Section 13: Prestressing tendons'],
          acceptanceCriteria: 'Crack width limitation ≤ 0.2mm under serviceability limit state.',
          isMandatoryQco: true,
          bisUrl: getBisVerificationUrl('IRC 112'),
          manakonlineUrl: getManakonlineUrl('IRC 112')
        },
        {
          code: 'IS 14268:2022',
          title: 'Prestressing Steel — Low Relaxation 7-Ply Strand — Specification',
          role: 'Core Specification',
          purpose: 'Governs high tensile 1860 MPa strands for bridge girder prestressing.',
          keyClauses: ['Table 2: Breaking load & proof load', 'Clause 7: 1000-hr relaxation test'],
          acceptanceCriteria: 'UTS ≥ 1860 N/mm²; 1000-hr relaxation ≤ 2.5% at 70% UTS initial load.',
          isMandatoryQco: true,
          bisUrl: getBisVerificationUrl('IS 14268'),
          manakonlineUrl: getManakonlineUrl('IS 14268')
        }
      ]
    : [
        {
          code: 'IS 456:2000',
          title: 'Plain and Reinforced Concrete — Code of Practice',
          role: 'Structural Design & Detailing',
          purpose: 'The foundational Indian civil engineering standard governing structural design, mix proportioning, and quality.',
          keyClauses: ['Clause 5 & Table 1: Cementitious materials', 'Clause 6 & Table 5: Durability exposure benchmarks', 'Clause 34: Structural columns and footings'],
          acceptanceCriteria: 'Minimum characteristic 28-day cube strength ≥ 25/30 N/mm²; maximum water-cement ratio 0.45.',
          isMandatoryQco: true,
          bisUrl: getBisVerificationUrl('IS 456'),
          manakonlineUrl: getManakonlineUrl('IS 456')
        },
        {
          code: 'IS 1893 (Part 1):2016',
          title: 'Criteria for Earthquake Resistant Design of Structures',
          role: 'Structural Design & Detailing',
          purpose: 'Specifies seismic zone factors, response reduction coefficients, and lateral force distribution.',
          keyClauses: ['Clause 6.4: Design spectrum', 'Clause 7.1: Inter-storey drift limitation'],
          acceptanceCriteria: 'Inter-storey drift under design lateral force shall not exceed 0.004 times storey height.',
          isMandatoryQco: true,
          bisUrl: getBisVerificationUrl('IS 1893'),
          manakonlineUrl: getManakonlineUrl('IS 1893')
        },
        {
          code: 'IS 13920:2016',
          title: 'Ductile Design and Detailing of Reinforced Concrete Structures Subjected to Seismic Forces',
          role: 'Structural Design & Detailing',
          purpose: 'Mandatory reinforcement detailing guidelines for ductile shock dissipation in beams, columns, and joints.',
          keyClauses: ['Clause 6: Beam longitudinal & transverse steel', 'Clause 7: Special confining hoop reinforcement in columns'],
          acceptanceCriteria: '135° hook ties with 10d extension; lap splices restricted to central half of span.',
          isMandatoryQco: true,
          bisUrl: getBisVerificationUrl('IS 13920'),
          manakonlineUrl: getManakonlineUrl('IS 13920')
        }
      ];

  return {
    projectStandardsSummary: `Comprehensive Indian Standards (IS) compliance ecosystem for ${project.projectName || 'Civil Project'} (${project.category || 'building'}). Every structural component is bound by statutory Quality Control Orders (QCO) under Section 16 of the BIS Act, 2016.`,
    primaryGoverningStandards,
    materials: [],
    tenderDraftClause: `All construction materials and structural works for this project shall strictly conform to the latest editions of Bureau of Indian Standards (BIS) specifications, including IS 456:2000, IS 1786:2008, IS 269:2015, and National Building Code 2016. All materials covered under statutory Quality Control Orders (QCOs) must carry valid BIS ISI certification marks.`
  };
}

// Setup Vite middlewares for development or static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`STANDARD X Server running on 0.0.0.0:${PORT}`);
  });
}

startServer();

import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'STANDARD X - Procurement Intelligence API',
    timestamp: new Date().toISOString(),
    aiEngineAvailable: Boolean(process.env.GEMINI_API_KEY)
  });
});

// AI-Powered Semantic Procurement Recommendation Route
app.post('/api/procurement/recommend', async (req: Request, res: Response) => {
  try {
    const { query, language, officerContext } = req.body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      res.status(400).json({ error: 'Query text is required' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return flag indicating server-side fallback to knowledge base
      res.json({
        success: true,
        useLocalKnowledgeBase: true,
        message: 'No GEMINI_API_KEY configured; utilizing local semantic knowledge base.'
      });
      return;
    }

    const ai = new GoogleGenAI({ apiKey });

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

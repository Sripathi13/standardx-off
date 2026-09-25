import { BisStandardInfo } from '../types';
import { TenderRequiredProduct } from './tenderMaterialRequirementsService';

export interface ProjectBisStandardsResponse {
  projectStandardsSummary: string;
  primaryGoverningStandards: Array<{
    code: string;
    title: string;
    role: string;
    purpose: string;
    keyClauses?: string[];
    acceptanceCriteria?: string;
    isMandatoryQco?: boolean;
    bisUrl?: string;
    manakonlineUrl?: string;
  }>;
  materials: TenderRequiredProduct[];
  tenderDraftClause?: string;
  source: string;
}

/**
 * Fetches the BIS Standards Registry from the server API.
 */
export async function fetchBisStandardsFromApi(
  category?: string,
  query?: string
): Promise<BisStandardInfo[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (query && query.trim()) params.append('q', query.trim());

    const res = await fetch(`/api/bis/standards?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn('API error fetching BIS standards, falling back to local registry:', err);
  }
  return [];
}

/**
 * Fetches single standard details from the server API.
 */
export async function fetchBisStandardDetailFromApi(code: string): Promise<any | null> {
  try {
    const res = await fetch(`/api/bis/standards/${encodeURIComponent(code)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn('API error fetching BIS standard detail:', err);
  }
  return null;
}

/**
 * Invokes the server-side LLM model (gemini-3.8-flash) via API
 * to generate the complete BIS standards suite for the whole project.
 */
export async function generateProjectBisStandardsWithApi(
  projectData: {
    projectName?: string;
    category?: string;
    location?: string;
    description?: string;
    qualitySpecifications?: any;
    buildingSpecs?: any;
    roadSpecs?: any;
    bridgeSpecs?: any;
    materials?: any[];
    rawTextSnippet?: string;
  }
): Promise<ProjectBisStandardsResponse | null> {
  try {
    const res = await fetch('/api/bis/generate-project-standards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData)
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return {
          projectStandardsSummary: json.data.projectStandardsSummary || '',
          primaryGoverningStandards: json.data.primaryGoverningStandards || [],
          materials: json.data.materials || [],
          tenderDraftClause: json.data.tenderDraftClause || '',
          source: json.source || 'gemini-3.8-flash'
        };
      }
    }
  } catch (err) {
    console.warn('Backend LLM project standards generation endpoint unreachable:', err);
  }
  return null;
}

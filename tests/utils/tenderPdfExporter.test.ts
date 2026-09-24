import { describe, it, expect, vi } from 'vitest';
import { exportTenderAppendixPdf } from '../../src/utils/tenderPdfExporter';
import { StandardRecommendationResult, ProcurementOfficerProfile } from '../../src/types/procurement';

// Mock jsPDF save
vi.mock('jspdf', () => {
  return {
    default: class MockJsPDF {
      setFont = vi.fn();
      setFontSize = vi.fn();
      setTextColor = vi.fn();
      setFillColor = vi.fn();
      setDrawColor = vi.fn();
      setLineWidth = vi.fn();
      rect = vi.fn();
      roundedRect = vi.fn();
      line = vi.fn();
      text = vi.fn();
      addPage = vi.fn();
      setPage = vi.fn();
      getNumberOfPages = vi.fn(() => 2);
      splitTextToSize = vi.fn((str: string) => [str]);
      save = vi.fn();
    }
  };
});

describe('tenderPdfExporter', () => {
  it('should generate and save official PDF for tender recommendations', () => {
    const mockResult: StandardRecommendationResult = {
      query: 'Ordinary Portland Cement for residential construction',
      detectedDomain: 'Civil Construction',
      detectedLanguage: 'English',
      semanticAnalysis: 'Testing semantic reasoning for cement standards.',
      primaryStandards: [
        {
          code: 'IS 269:2023',
          title: 'Ordinary Portland Cement — Specification',
          edition: 'Sixth Revision',
          latestAmendment: 'A1:2023',
          yearOfPublication: 2023,
          scope: 'Prescribes physical and chemical requirements',
          relevanceScore: 98,
          matchExplanation: 'Exact match',
          isMandatoryQco: true,
          applicableGrades: ['33 Grade', '43 Grade', '53 Grade']
        }
      ],
      normativeReferences: [
        { code: 'IS 4031', title: 'Methods of physical tests for hydraulic cement' }
      ],
      alliedStandards: [],
      testMethodStandards: [],
      safetyAndInstallationStandards: [],
      mandatoryCertifications: [
        {
          scheme: 'BIS Product Certification (ISI Mark)',
          isCompulsory: true,
          qcoOrderReference: 'Cement (Quality Control) Order, 2023',
          description: 'Mandatory ISI mark on all cement bags',
          issuingAuthority: 'Ministry of Commerce & Industry'
        }
      ],
      tenderDraftClause: 'All cement supplied shall conform strictly to IS 269:2023...',
      timestamp: new Date().toISOString(),
      source: 'local-semantic-engine'
    };

    const mockOfficer: ProcurementOfficerProfile = {
      id: 'OFF-001',
      name: 'Dr. R. K. Sharma',
      designation: 'Chief Procurement Engineer',
      department: 'Central Public Works Department (CPWD)',
      cadre: 'Central Govt',
      badgeNumber: 'CPWD-NDLS-2026',
      clearanceLevel: 'Chief Materials Manager',
      verifiedAt: '2026-03-24T00:00:00Z',
      organizationEmail: 'rk.sharma@cpwd.gov.in'
    };

    expect(() => exportTenderAppendixPdf(mockResult, mockOfficer)).not.toThrow();
  });

  it('should include source document name in export without errors', () => {
    const mockResult: StandardRecommendationResult = {
      query: 'High strength Fe 550D TMT rebar for earthquake zone IV construction',
      detectedDomain: 'Structural Steel',
      detectedLanguage: 'English',
      primaryStandards: [
        {
          code: 'IS 1786:2008',
          title: 'High strength deformed steel bars and wires for concrete reinforcement',
          edition: 'Fourth Revision',
          latestAmendment: 'A3:2021',
          yearOfPublication: 2008,
          scope: 'Covers requirements of deformed steel bars and wires for use as reinforcement in concrete',
          relevanceScore: 99,
          matchExplanation: 'Exact IS Standard for Fe 550D',
          isMandatoryQco: true,
          applicableGrades: ['Fe 500D', 'Fe 550D']
        }
      ],
      normativeReferences: [],
      alliedStandards: [],
      testMethodStandards: [],
      safetyAndInstallationStandards: [],
      mandatoryCertifications: [],
      semanticAnalysis: 'Rebar specification conforms to IS 1786 and NBC 2016 ductility criteria.',
      tenderDraftClause: 'All reinforcement bars shall be Fe 550D conforming to IS 1786...',
      timestamp: new Date().toISOString(),
      source: 'local-semantic-engine'
    };

    const mockOfficer: ProcurementOfficerProfile = {
      id: 'OFF-001',
      name: 'Er. Rajesh K. Verma',
      designation: 'Superintending Engineer',
      department: 'Central Public Works Department (CPWD)',
      cadre: 'Central Govt',
      badgeNumber: 'CPWD-NDLS-QCO-2026-88',
      clearanceLevel: 'Class I Official',
      verifiedAt: '2026-09-23T08:30:00Z',
      organizationEmail: 'rajesh.verma@cpwd.gov.in'
    };

    expect(() =>
      exportTenderAppendixPdf(mockResult, mockOfficer, 'CPWD_NIT_Commercial_Arcade_842.pdf')
    ).not.toThrow();
  });
});

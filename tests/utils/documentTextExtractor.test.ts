import { describe, it, expect } from 'vitest';
import { extractTextFromDocument } from '../../src/utils/documentTextExtractor';

describe('Document Text Extractor', () => {
  it('extracts plaintext content from .txt files', async () => {
    const textContent = 'Tender Specification: Building project with IS 456 M25 concrete.';
    const mockFile = new File([textContent], 'tender.txt', { type: 'text/plain' });

    const result = await extractTextFromDocument(mockFile);
    expect(result.text).toBe(textContent);
    expect(result.fileType).toBe('txt');
    expect(result.pageOrSectionCount).toBe(1);
  });

  it('extracts CSV tabular content from .csv files', async () => {
    const csvContent = 'Item,Quantity,Unit\nCement,2000,bags\nSteel,15000,kg';
    const mockFile = new File([csvContent], 'boq_schedule.csv', { type: 'text/csv' });

    const result = await extractTextFromDocument(mockFile);
    expect(result.text).toContain('Cement,2000,bags');
    expect(result.fileType).toBe('csv');
  });

  it('extracts Markdown documentation from .md files', async () => {
    const mdContent = '# Technical Specs\n- Grade 53 OPC Cement\n- Fe 550D TMT Rebar';
    const mockFile = new File([mdContent], 'specifications.md', { type: 'text/markdown' });

    const result = await extractTextFromDocument(mockFile);
    expect(result.text).toContain('# Technical Specs');
    expect(result.fileType).toBe('md');
  });
});

import JSZip from 'jszip';

/**
 * Extracts true text content from uploaded tender files:
 * - PDF documents (.pdf)
 * - Microsoft Word documents (.docx)
 * - Spreadsheets & BOQ sheets (.xlsx, .csv, .tsv)
 * - Plaintext, JSON, XML, HTML, Markdown (.txt, .json, .xml, .html, .md)
 */
export async function extractTextFromDocument(file: File): Promise<{
  text: string;
  fileType: string;
  pageOrSectionCount: number;
}> {
  const fileName = file.name.toLowerCase();

  // 1. Plain Text, CSV, JSON, Markdown
  if (
    fileName.endsWith('.txt') ||
    fileName.endsWith('.csv') ||
    fileName.endsWith('.tsv') ||
    fileName.endsWith('.json') ||
    fileName.endsWith('.md')
  ) {
    const text = await file.text();
    return {
      text,
      fileType: fileName.split('.').pop() || 'text',
      pageOrSectionCount: 1
    };
  }

  // 2. Microsoft Word (.docx)
  if (fileName.endsWith('.docx')) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);
      const documentXml = await zip.file('word/document.xml')?.async('text');
      
      if (documentXml) {
        // Parse XML and extract all text inside <w:t> tags
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(documentXml, 'application/xml');
        const textNodes = xmlDoc.getElementsByTagName('w:t');
        const paragraphs = xmlDoc.getElementsByTagName('w:p');
        
        const extractedLines: string[] = [];
        for (let i = 0; i < paragraphs.length; i++) {
          const pTexts = paragraphs[i].getElementsByTagName('w:t');
          let line = '';
          for (let j = 0; j < pTexts.length; j++) {
            line += pTexts[j].textContent || '';
          }
          if (line.trim()) {
            extractedLines.push(line.trim());
          }
        }

        const fullText = extractedLines.join('\n');
        return {
          text: fullText || Array.from(textNodes).map(n => n.textContent).join(' '),
          fileType: 'docx',
          pageOrSectionCount: Math.max(1, paragraphs.length)
        };
      }
    } catch (docxErr) {
      console.warn('Could not parse DOCX with JSZip, falling back to raw buffer scan:', docxErr);
    }
  }

  // 3. Microsoft Excel (.xlsx) - BOQ spreadsheets
  if (fileName.endsWith('.xlsx')) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);
      
      // Check sharedStrings.xml for cell texts
      const sharedStringsXml = await zip.file('xl/sharedStrings.xml')?.async('text');
      if (sharedStringsXml) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(sharedStringsXml, 'application/xml');
        const textNodes = xmlDoc.getElementsByTagName('t');
        const lines: string[] = [];
        for (let i = 0; i < textNodes.length; i++) {
          const val = textNodes[i].textContent?.trim();
          if (val) lines.push(val);
        }
        return {
          text: lines.join('\n'),
          fileType: 'xlsx',
          pageOrSectionCount: lines.length
        };
      }
    } catch (xlsxErr) {
      console.warn('Could not parse XLSX with JSZip:', xlsxErr);
    }
  }

  // 4. PDF Documents (.pdf)
  if (fileName.endsWith('.pdf')) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // Primary: Try Mozilla pdfjs-dist
      try {
        const pdfjsLib = await import('pdfjs-dist');
        // Set worker or disable
        if (pdfjsLib.GlobalWorkerOptions) {
          // Use unpkg or cdnjs as reliable worker URL or local
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
        }
        
        const loadingTask = pdfjsLib.getDocument({ 
          data: new Uint8Array(arrayBuffer),
          useWorkerFetch: false,
          useSystemFonts: true
        });
        
        const pdfDoc = await loadingTask.promise;
        const totalPages = pdfDoc.numPages;
        const pageTexts: string[] = [];

        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
          const page = await pdfDoc.getPage(pageNum);
          const textContent = await page.getTextContent();
          const strings = textContent.items
            .map((item: any) => ('str' in item ? item.str : ''))
            .filter(Boolean);
          pageTexts.push(strings.join(' '));
        }

        const extractedText = pageTexts.join('\n');
        if (extractedText.trim().length > 20) {
          return {
            text: extractedText,
            fileType: 'pdf',
            pageOrSectionCount: totalPages
          };
        }
      } catch (pdfjsErr) {
        console.warn('pdfjs-dist loader notice, trying stream parser fallback:', pdfjsErr);
      }

      // Secondary fallback: Direct binary stream text extractor for PDF
      const fallbackText = extractTextFromPdfBinary(arrayBuffer);
      if (fallbackText.trim().length > 20) {
        return {
          text: fallbackText,
          fileType: 'pdf',
          pageOrSectionCount: 1
        };
      }
    } catch (pdfErr) {
      console.error('Failed to extract PDF text:', pdfErr);
    }
  }

  // 5. HTML / XML files
  if (fileName.endsWith('.html') || fileName.endsWith('.htm') || fileName.endsWith('.xml')) {
    const raw = await file.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(raw, fileName.endsWith('.xml') ? 'application/xml' : 'text/html');
    return {
      text: doc.body ? doc.body.textContent || '' : doc.documentElement.textContent || '',
      fileType: 'html',
      pageOrSectionCount: 1
    };
  }

  // 6. Generic file text fallback
  const genericText = await file.text().catch(() => '');
  return {
    text: genericText,
    fileType: 'unknown',
    pageOrSectionCount: 1
  };
}

/**
 * Fallback binary text extractor for PDF files.
 * Extracts plain-text strings embedded within PDF operators.
 */
function extractTextFromPdfBinary(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binaryString = '';
  
  // Convert in chunks to avoid call stack limits
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binaryString += String.fromCharCode.apply(
      null, 
      Array.from(bytes.subarray(i, i + chunkSize))
    );
  }

  const results: string[] = [];
  
  // Find text inside parentheses in text blocks: (Some Text) Tj or [(Some) -20 (Text)] TJ
  const tjRegex = /\(([^)\\]*(?:\\.[^)\\]*)*)\)\s*T[jJ]/g;
  let match;
  while ((match = tjRegex.exec(binaryString)) !== null) {
    const cleanStr = match[1]
      .replace(/\\([()\\])/g, '$1')
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '')
      .replace(/\\t/g, ' ');
    if (cleanStr.trim()) {
      results.push(cleanStr);
    }
  }

  // Find array of strings in TJ operators: [(String 1) 20 (String 2)] TJ
  const arrayTjRegex = /\[((?:\([^)]*\)|-?\d+)+)\]\s*TJ/g;
  while ((match = arrayTjRegex.exec(binaryString)) !== null) {
    const inner = match[1];
    const subMatch = inner.match(/\(([^)]*)\)/g);
    if (subMatch) {
      const line = subMatch.map(s => s.slice(1, -1)).join('');
      if (line.trim()) {
        results.push(line);
      }
    }
  }

  // Also check plain printable words if text operators were compressed
  if (results.length < 5) {
    const wordMatches = binaryString.match(/[A-Z0-9a-z][A-Z0-9a-z\s,\.\-–\/]{4,}/g);
    if (wordMatches) {
      const meaningful = wordMatches
        .filter(w => w.trim().length > 6 && !w.startsWith('/'))
        .slice(0, 150);
      return meaningful.join('\n');
    }
  }

  return results.join(' ');
}

# STANDARD X - Tender Extraction Engine

## 1. Objective & Ingestion Pipeline
The Tender Extraction Engine automates the ingestion of government tender documents (CPWD, PWD, NHAI, Railways, Municipal Corporations) and contractor bidding packages.

```
+----------------+       +-------------------+       +-----------------------+
| Tender File    | ----> | Format Handler    | ----> | Regex Pattern Bank    |
| (.pdf, .docx,  |       | (PDF text / DOCX  |       | (NIT, dimensions,     |
|  .xlsx, .txt)  |       |  XML / CSV rows)  |       |  material grades)     |
+----------------+       +-------------------+       +-----------------------+
                                                                 |
                                                                 v
+----------------+       +-------------------+       +-----------------------+
| Project Record | <---- | Audit Score Calc  | <---- | Typology Classifier   |
| Ready for BOQ  |       | (70% - 99% Conf.) |       | (Building/Road/Bridge)|
+----------------+       +-------------------+       +-----------------------+
```

---

## 2. Multi-Format Text Extraction

Handled in `src/utils/documentTextExtractor.ts`:
1. **Plain Text & Markdown (`.txt`, `.md`, `.json`)**: Native `file.text()` asynchronous stream.
2. **Microsoft Word (`.docx`)**:
   - Uses `JSZip` to unzip `.docx` archives in browser memory.
   - Reads `word/document.xml`.
   - Iterates through `<w:p>` paragraphs and `<w:t>` text nodes, preserving line structure.
3. **Microsoft Excel (`.xlsx`)**:
   - Parses `xl/sharedStrings.xml` and worksheet data nodes to extract line items from BOQ schedules.
4. **PDF Documents (`.pdf`)**:
   - Reads text buffers and page streams via `pdfjs-dist` worker.

---

## 3. Typology & Entity Recognition Heuristics

The engine evaluates linguistic cues to identify project typology:

### 3.1 Project Typology Detection
- **Road / Highway**: Triggered by keywords `road`, `highway`, `carriageway`, `pavement`, `pqc`, `bitumen`, `dbm`, `lane`, `widening`.
- **Bridge / Flyover**: Triggered by keywords `bridge`, `flyover`, `viaduct`, `girder`, `pier`, `abutment`, `span length`, `deck`.
- **Building**: Default typology; confirmed by `building`, `hospital`, `annex`, `residential`, `built-up`, `sq.ft`, `g+`.

### 3.2 Key Dimension Extractors
- **Built-Up Area**:
  `/(?:built[- ]?up\s+area|plinth\s+area|covered\s+area)[\s\:\-]+(\d+[\d,\,]*\.?\d*)\s*(sq\.?ft|sqm|sq\s*meters?)/i`
- **Floor Count**:
  `/g\s*\+\s*(\d+)|(\d+)\s*(?:story|stories|floors?)/i`
- **Road Length & Width**:
  `/(\d+\.?\d*)\s*(?:km|kms|kilometer)/i` and `/(\d+\.?\d*)\s*(?:m|meter)\s*(?:width|carriageway)/i`
- **Pavement Crust Thickness**:
  `/(?:pavement\s+thickness|thickness|crust\s+thickness)[\:\s\-–]+(\d+\.?\d*)\s*(?:mm)?/i`
- **Bridge Span & Pier Height**:
  `/(\d+\.?\d*)\s*(?:m|meter)\s*span/i` and `/(?:pier\s+height|height\s+of\s+piers?)[\:\s\-–]+(\d+\.?\d*)/i`

### 3.3 Quality Specifications & Technical Standards
- **Concrete Grade**: Detects `M20`, `M25`, `M30`, `M35`, `M40`, `M45`, `M50`.
- **Steel Grade**: Detects `Fe 550D`, `Fe 500D`, `Fe 500`, `Fe 415`.
- **Cement Type**: Detects `OPC 53`, `OPC 43`, `PPC Fly Ash`.
- **Bitumen Grade**: Detects `VG-30`, `VG-40`, `VG-10`.

---

## 4. Verification Audit & Confidence Scoring

Every extracted tender is audited for completeness:
- **Project Name matched**: $+10\%$ confidence
- **Dimensions matched**: $+12\%$ confidence
- **Quality grades identified**: $+10\%$ confidence
- Baseline score: $70\%$; Maximum: $99\%$.

The confidence score and matched audit criteria are presented to the user in a verification banner, enabling one-click adjustments if any dimension needs manual override.

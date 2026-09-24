# STANDARD X - Architecture & System Design

## 1. Overview
STANDARD X is engineered as a deterministic, client-authoritative single-page application (SPA) focused on high-precision civil engineering estimations and BIS compliance. The architecture avoids fragile server round-trips for core mathematical calculations, allowing instant feedback as users tweak building parameters, road lengths, or material quantities.

```
+-------------------------------------------------------------------------------+
|                                  Browser UI                                   |
|  +-------------------------------------------------------------------------+  |
|  | Views: Home | CreateProject | HouseOwners | Marketplace | Quotation     |  |
|  +-------------------------------------------------------------------------+  |
|         |                                    |                      |         |
|         v                                    v                      v         |
|  +---------------+                 +--------------------+     +------------+  |
|  |  Tender Parser|                 |  Estimation Engine |     | Sanitizer  |  |
|  |  (PDF, DOCX)  |                 |  (IS 456, IRC:58)  |     | (Zero Bias)|  |
|  +---------------+                 +--------------------+     +------------+  |
|         |                                    |                      |         |
|         +-------------------+----------------+                      |         |
|                             v                                       v         |
|                 +-----------------------+              +-------------------+  |
|                 | Project State & Cart  |<-------------| Products & BIS DB |  |
|                 +-----------------------+              +-------------------+  |
|                             |                                                 |
|                             v                                                 |
|                 +-----------------------+                                     |
|                 | PDF Quotation Export  |                                     |
|                 +-----------------------+                                     |
+-------------------------------------------------------------------------------+
```

## 2. Component Hierarchy & Data Flow

### 2.1 State Management
Application state is centralized in `src/App.tsx` and synchronized with browser `localStorage`:
- **`projects: ProjectRecord[]`**: List of created or imported civil projects.
- **`activeProject: ProjectRecord | null`**: Currently inspected project whose materials are being edited.
- **`cartItems: CartItem[]`**: Active Bill of Quantities items selected for procurement or quotation.
- **`activeQuotation: QuotationRecord | null`**: Finalized quotation snapshot including taxes, logistics fees, and contact details.

### 2.2 Data Invariants
1. **Sanitization Invariant**: Any product added to the cart or displayed in official quotations must pass through `sanitizeProduct()` or `sanitizeCartItem()`, ensuring no brand bias.
2. **Deterministic Pricing**: Material quantities derived from project parameters always maintain an audit trail via `calculationBasis` and `formulaExplanation`.
3. **Safety Checklist**: When a project is configured, the system checks whether essential structural materials (e.g., binding wire, water, cement, sand) are present. If missing, `MissingMaterialsModal` prompts the engineer before finalizing.

## 3. Module Breakdown

### 3.1 `src/services/estimationEngine.ts`
The computational heart of STANDARD X. Contains pure, stateless calculation functions:
- `estimateBuildingMaterials(details: BuildingProjectDetails): MaterialRequirement[]`
- `estimateRoadMaterials(details: RoadProjectDetails): MaterialRequirement[]`
- `estimateBridgeMaterials(details: BridgeProjectDetails): MaterialRequirement[]`
- `estimateHouseMaterials(details: HouseOwnerDetails): MaterialRequirement[]`

### 3.2 `src/services/tenderExtractionService.ts`
Handles unstructured document ingestion:
- Multi-format extraction via `extractTextFromDocument()`: Reads raw text streams from PDF, DOCX, XLSX, and TXT files.
- Heuristic regex analysis: Identifies tender NIT numbers, issuing authorities, project names, geographic locations, and structural dimensions.
- Quality grade classification: Extracts concrete grades (M20 to M50), rebar standards (Fe 500D, Fe 550D), and bitumen viscosity grades.
- Audit Scoring: Generates a verification confidence score (70% to 99%) based on matched dimensions and quality grades.

### 3.3 `src/utils/qualitySanitizer.ts`
Enforces the Zero-Vendor Neutrality constitutional rule:
- Strips 25+ major commercial company trademarks.
- Maps commercial products into pure BIS technical grades.
- Normalizes unit descriptions and packaging details.

### 3.4 `src/views/QuotationView.tsx`
Renders an official, printable quotation layout with:
- Formal Letterhead & Reference Number
- Itemized Material BOQ with BIS standard codes
- Transportation, unloading labor, and site contingency breakdown
- GST 18% calculation
- Export to high-resolution vector PDF using `jspdf` and `html2canvas-pro`

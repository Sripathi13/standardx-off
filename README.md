# STANDARD X

> **Civil Engineering Material Estimation, BIS Quality Assurance & Procurement Engine**  
> Engineered for structural engineers, contractors, highway authorities, and home builders. Compliant with Bureau of Indian Standards (BIS), Indian Roads Congress (IRC), MoRTH (5th Revision), and National Building Code 2016.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8%2B-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646cff.svg)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-Unit%20Tests%20Passing-green.svg)](https://vitest.dev/)
[![BIS Aligned](https://img.shields.io/badge/BIS%20Aligned-IS%20456%20%7C%20IS%201786%20%7C%20IS%20269-orange.svg)](https://www.bis.gov.in/)
[![Zero Vendor Bias](https://img.shields.io/badge/Quality%20Sanitized-Zero%20Brand%20Bias-emerald.svg)](#zero-vendor-bias--quality-sanitizer)

---

## 1. Executive Summary & Vision

**STANDARD X** transforms civil estimation from imprecise manual approximations into a deterministic, code-grounded engineering workflow. Whether handling public infrastructure tenders (CPWD, NHAI, State PWDs) or residential villa construction, **STANDARD X** automatically calculates accurate material bills of quantities (BOQ), maps them to mandatory BIS/IRC standard specifications, sanitizes all brand references into pure technical quality tiers, and compiles finalized commercial quotations with freight, labor, and GST tax calculations.

### Core Problems Solved
1. **Material Wastage & Inaccurate Estimates**: In typical Indian construction projects, inaccurate manual thumb-rules lead to 12–20% material variance or site stoppages. STANDARD X uses exact IS 456 mix proportions, IRC:58 rigid pavement designs, and MoRTH granular layer formulations with explicit wastage factor allowances (3%–8%).
2. **Tender Document Friction**: Public tenders span 80+ pages of unstructured PDFs, DOCX files, and BOQ schedules. STANDARD X's Document Extraction Engine parses tender text, identifies project typology, extracts structural dimensions, detects specified quality grades (e.g., M25 concrete, Fe 550D rebar), and auto-populates project parameters with audit verification scores.
3. **Vendor Brand Collusion & Lack of Neutrality**: Public tenders and professional estimates require vendor-neutral engineering classifications. STANDARD X's Quality Sanitizer strips corporate brand names (e.g., UltraTech, Tata Tiscon, JSW) and converts them into pure engineering quality classifications (e.g., *Grade 53 High-Early Strength OPC*, *Fe 550D Super Ductile Grade*).
4. **Non-Standard Testing & Adulteration**: Each recommended material includes mandatory on-site testing procedures and field verification tips conforming to BIS standards.

---

## 2. Platform Architecture

The system is built as a reactive, modular TypeScript application using Vite and Tailwind CSS. All mathematical calculations, parsing pipelines, and sanitization routines are executed client-side or on lightweight proxy endpoints with zero external tracking.

```
standard-x/
├── index.html                           # App entry point & Google Fonts typography
├── metadata.json                        # App metadata & capabilities
├── package.json                         # Dependencies & test scripts
├── vitest.config.ts                     # Vitest test runner configuration
├── docs/                                # Core engineering documentation
│   ├── ARCHITECTURE.md                  # Comprehensive system architecture & data flows
│   ├── ESTIMATION_ENGINE.md             # Civil engineering formulas & thumb-rules
│   ├── BIS_STANDARDS_REFERENCE.md       # Indian engineering standards catalog
│   ├── TENDER_EXTRACTION_ENGINE.md      # Multi-format document parser documentation
│   └── TESTING_GUIDE.md                 # Unit testing manual & coverage matrix
├── src/
│   ├── App.tsx                          # Root application component & persistent state
│   ├── main.tsx                         # DOM hydration entry point
│   ├── index.css                        # Tailwind CSS design system
│   ├── types.ts                         # Complete TypeScript interfaces & domain models
│   ├── components/                      # Modular UI components
│   │   ├── Navbar.tsx                   # Sticky responsive header & view switcher
│   │   ├── Footer.tsx                   # Application footer & engineering references
│   │   ├── TenderDocumentUpload.tsx     # Drag-and-drop tender file reader & auditor
│   │   ├── BisDetailModal.tsx           # Interactive modal for BIS standard clauses & tests
│   │   ├── ProductCompareModal.tsx      # Side-by-side technical specification comparator
│   │   └── MissingMaterialsModal.tsx    # Structural safety checklist for BOQ items
│   ├── data/                            # Static databases & engineering libraries
│   │   ├── bisStandards.ts              # IS & IRC standards library & helper lookup
│   │   ├── productsDatabase.ts          # Technical product database, pricing & ranks
│   │   └── sampleProjects.ts            # Pre-configured civil engineering sample projects
│   ├── services/                        # Business logic & estimation algorithms
│   │   ├── estimationEngine.ts          # Multi-typology material calculation engine
│   │   └── tenderExtractionService.ts   # Document parser & structural heuristics
│   ├── utils/                           # Core utilities
│   │   ├── documentTextExtractor.ts     # Multi-format document text extraction (PDF, DOCX, CSV)
│   │   └── qualitySanitizer.ts          # Brand stripping & technical classification sanitizer
│   └── views/                           # High-level screens
│       ├── HomeView.tsx                 # Landing page & feature showcase
│       ├── CreateProjectView.tsx        # Multi-typology project wizard & tender uploader
│       ├── HouseOwnersView.tsx          # Simplified home builder estimation tool
│       ├── MarketplaceView.tsx          # Catalog of BIS-verified construction materials
│       ├── BisStandardsView.tsx         # Digital BIS engineering standards catalog
│       ├── CartView.tsx                 # Project BOQ, wastage editor & financial summary
│       ├── QuotationView.tsx            # Printable/PDF quotation generator
│       ├── MyProjectsView.tsx           # Saved project manager & local persistence
│       ├── DocumentationView.tsx        # Interactive in-app technical documentation
│       ├── AboutView.tsx                # Mission & engineering methodology
│       └── ProfileView.tsx              # User profile & organization preferences
└── tests/                               # Comprehensive Vitest unit test suites
    ├── data/
    │   └── productsAndStandards.test.ts # Data integrity & standard catalog test suite
    ├── services/
    │   ├── estimationEngine.test.ts     # Calculations for Buildings, Roads, Bridges & Houses
    │   ├── tenderExtractionService.test.ts # Document extraction heuristics & confidence scoring
    │   └── quotationEngine.test.ts      # Cart subtotal, logistics, contingency & GST tests
    └── utils/
        ├── documentTextExtractor.test.ts # Multi-format file parsing tests
        └── qualitySanitizer.test.ts     # Commercial brand stripping & sanitization tests
```

---

## 3. Mathematical Formulations & Engineering Equations

### 3.1 Building Project Estimation (IS 456:2000)
Calculations are parameterized by Total Built-Up Area ($A$ in sq.ft), Number of Floors ($F$), and Structural System:

$$\text{Floor Factor } (K_f) = \begin{cases} 1.05 & \text{if } F > 3 \\ 1.00 & \text{if } F \le 3 \end{cases}$$

| Material | Structural System | Formula | Wastage Allowance |
| :--- | :--- | :--- | :--- |
| **Cement** | RCC Framed | $Q_c = \text{round}(A \times 0.42 \times K_f \times 1.05)$ bags | 5% |
| **Cement** | Load-Bearing | $Q_c = \text{round}(A \times 0.35 \times K_f \times 1.05)$ bags | 5% |
| **Cement** | Steel Structure | $Q_c = \text{round}(A \times 0.25 \times K_f \times 1.05)$ bags | 5% |
| **Steel (TMT)**| RCC Framed | $Q_s = \text{round}(A \times 4.00 \times K_f \times 1.03)$ kg | 3% |
| **Steel (TMT)**| Load-Bearing | $Q_s = \text{round}(A \times 2.00 \times K_f \times 1.03)$ kg | 3% |
| **Steel (TMT)**| Steel Structure | $Q_s = \text{round}(A \times 2.20 \times K_f \times 1.03)$ kg | 3% |
| **Fine Aggregate**| All Systems | $Q_{fa} = (A \times 0.052) \times 1.06$ $\text{m}^3$ | 6% |
| **Coarse Aggregate**| All Systems | $Q_{ca} = (A \times 0.038) \times 1.04$ $\text{m}^3$ | 4% |
| **Bricks / AAC** | RCC Framed | $Q_b = \text{round}(A \times 18.0 \times 1.07)$ units | 7% |
| **Water** | All Systems | $Q_w = (Q_c \times 165) / 1000$ kL (Mixing + 14d Curing) | 8% |
| **Binding Wire** | All Systems | $Q_{bw} = \text{round}(Q_s \times 0.011)$ kg (1.1% of rebar) | 5% |

### 3.2 Road Project Estimation (IRC:58 & MoRTH 5th Revision)
Given Length ($L$ in meters), Width ($W$ in meters), and Surface Area $S = L \times W$:

- **Rigid Pavement (Pavement Quality Concrete - PQC)**:
  - PQC Concrete Volume: $V_{\text{pqc}} = S \times T$ $\text{m}^3$ (where $T$ is thickness in meters)
  - PQC Cement (OPC 53 M40): $Q_c = \text{round}(V_{\text{pqc}} \times 7.8)$ bags (7.8 bags/$\text{m}^3 \approx 390\text{ kg/m}^3$)
  - Dowel & Tie Bars: $Q_{\text{dowel}} = \text{round}(S \times 3.6)$ kg
  - Granular Sub-Base (GSB): $V_{\text{gsb}} = L \times (W + 0.8) \times 0.15$ $\text{m}^3$
  - Sand: $V_{\text{sand}} = V_{\text{pqc}} \times 0.44$ $\text{m}^3$
  - Coarse Aggregate: $V_{\text{agg}} = V_{\text{pqc}} \times 0.86$ $\text{m}^3$

- **Flexible Pavement (Bituminous DBM + BC)**:
  - Asphalt Mix Volume: $V_{\text{asphalt}} = S \times 0.115$ $\text{m}^3$ (75mm DBM + 40mm BC)
  - Asphalt Mix Weight: $M_{\text{asphalt}} = \text{round}(V_{\text{asphalt}} \times 2.42)$ Tonnes
  - VG-30 Paving Bitumen (4.9% binder): $M_{\text{bitumen}} = M_{\text{asphalt}} \times 0.049$ Tonnes
  - Wet Mix Macadam (WMM Base): $V_{\text{wmm}} = S \times 0.225$ $\text{m}^3$
  - GSB Sub-base: $V_{\text{gsb}} = L \times (W + 0.6) \times 0.15$ $\text{m}^3$

### 3.3 Bridge Superstructure (IRC:112)
Given Span Length ($L_s$), Deck Width ($W_d$), and Pier Height ($H_p$):
- Concrete Volume: $V_c = \text{round}(L_s \times W_d \times 0.85 + (H_p \times W_d \times 1.4))$ $\text{m}^3$
- High-Performance Cement (OPC 53 M45): $Q_c = \text{round}(V_c \times 8.2)$ bags
- Super Ductile Rebar (Fe 550D): $Q_s = \text{round}(V_c \times 135)$ kg ($135\text{ kg/m}^3$ rebar density)
- Binding Wire: $Q_{bw} = \text{round}(Q_s \times 0.012)$ kg (1.2% of rebar)

### 3.4 House Owner Estimation (Residential Tiers)
Given Total Built-Up Area ($A_{\text{house}} = A_{\text{floor}} \times F$):
- **Economy**: Cement $\times 0.38$, Steel $\times 3.4\text{ kg/sq.ft}$
- **Standard**: Cement $\times 0.40$, Steel $\times 3.8\text{ kg/sq.ft}$, Sand $\times 0.050$, Agg $\times 0.038$, Bricks $\times 18$
- **Premium**: Cement $\times 0.44$, Steel $\times 4.2\text{ kg/sq.ft}$, Sand $\times 0.054$, Agg $\times 0.040$

---

## 4. Zero-Vendor Bias & Quality Sanitizer

Public procurement guidelines mandate that estimates and tender BOQs must remain free from proprietary brand references. The `qualitySanitizer` module enforces this requirement through multi-stage sanitization:

1. **Commercial Entity Stripping**: Removes known manufacturer trademarks (UltraTech, Tata Tiscon, JSW, Jindal, Ambuja, ACC, Shree, Dalmia, Asian Paints, etc.).
2. **Technical Grade Classification**:
   - `Tata Tiscon Fe 550D Rebar` $\rightarrow$ **Fe 550D Super Ductile Grade** (IS 1786)
   - `UltraTech Super OPC 53` $\rightarrow$ **Grade 53 High-Early Strength OPC** (IS 269)
   - `Ambuja Kawach Fly Ash Cement` $\rightarrow$ **Grade 43 Pozzolana Structural Cement (PPC / OPC 43)** (IS 1489)
   - `Crushed VSI M-Sand` $\rightarrow$ **IS 383 Zone II Hydro-Washed M-Sand Grade**
   - `Red clay bricks` $\rightarrow$ **Class 5.0 / 7.5 Standard Kiln-Fired Red Brick** (IS 1077)
   - `AAC Blocks` $\rightarrow$ **Class 1 Precision Autoclaved Aerated Concrete (AAC Block)** (IS 2185)
3. **Specification Cleaning**: Strips redundant commercial packaging words, private company guarantees, and guarantees that quotations display only technical engineering specifications.

---

## 5. BIS Standards Reference Library

The platform embeds complete field testing guides and mandatory parameter tables for core standards:

| Standard Code | Material / Domain | Key Verification Criteria |
| :--- | :--- | :--- |
| **IS 456:2000** | Plain & Reinforced Concrete | Minimum cement content, water-cement ratios (0.45–0.50), characteristic compressive strengths (M20–M50). |
| **IS 1786:2008** | High Strength Deformed Steel Bars | Proof stress (500/550 MPa), minimum elongation (14.5%–16.0%), bend & rebend tests. |
| **IS 269:2015** | Ordinary Portland Cement | 28-day compressive strength ($\ge 53\text{ MPa}$ for 53 Grade), Blaine fineness ($\ge 225\text{ m}^2/\text{kg}$), setting time. |
| **IS 1489:2015** | Portland Pozzolana Cement | 15%–35% fly ash blending, 28-day strength ($\ge 33\text{ MPa}$), autoclave expansion $\le 0.8\%$. |
| **IS 383:2016** | Coarse & Fine Aggregates | Zone I–IV grading sieves, aggregate impact value $< 18\%$, flakiness/elongation index $< 15\%$. |
| **IS 1077:1992** | Common Burnt Clay Bricks | Compressive classes (3.5 to 35.0 N/mm²), water absorption $\le 20\%$, efflorescence tolerance. |
| **IS 2185:2008** | Concrete Masonry & AAC Blocks | Dry density (551–650 kg/m³ for Class 1), thermal conductivity $< 0.24\text{ W/m}\cdot\text{K}$. |
| **IS 73:2013** | Paving Bitumen | Absolute viscosity at 60°C (2400–3600 Poise for VG-30), penetration, ductility $> 40\text{ cm}$. |
| **IRC:37 / MoRTH 400**| Flexible Pavement Sub-Bases | GSB CBR $\ge 30\%$, WMM Los Angeles abrasion $< 30\%$, Modified Proctor compaction at 98%. |
| **IRC:58** | Rigid Highway Pavement | Flexural strength of concrete $\ge 4.5\text{ MPa}$, dowel bar load transfer efficiency across joints. |
| **IRC:112** | Concrete Bridges & Flyovers | Limit state design, high-performance concrete durability, minimum cover for severe exposure. |

---

## 6. Comprehensive Unit Testing Suite

STANDARD X includes a complete test suite powered by **Vitest**, covering calculation accuracy, parser heuristics, edge cases, financial summaries, and data integrity.

### Test Catalog
1. **`tests/services/estimationEngine.test.ts`** (11 tests):
   - RCC Framed structure material calculations against IS 456 thumb-rules
   - Load-bearing structural coefficient shifts
   - Steel structure coefficient shifts
   - Multi-floor height allowance factor ($K_f = 1.05$)
   - Minimum area clamping ($A \ge 100\text{ sq.ft}$)
   - IRC:58 rigid concrete road PQC volume, dowel rebar, GSB sub-base
   - MoRTH flexible road bituminous mix weight, VG-30 binder, WMM base
   - IRC:112 bridge concrete volume, super ductile rebar density, binding wire
   - Residential house calculation across Standard, Premium, and Economy quality tiers
2. **`tests/services/tenderExtractionService.test.ts`** (5 tests):
   - Predefined sample tenders completeness & schema verification
   - Commercial building tender parsing (built-up area, floors, concrete grades, rebar specs)
   - Highway corridor road tender parsing (length, width, thickness, pavement type, bitumen grade)
   - Prestressed girder bridge tender parsing (span, deck width, pier height, M45 concrete)
   - Sparse / corrupted text handling with fallback confidence scoring
3. **`tests/utils/qualitySanitizer.test.ts`** (10 tests):
   - Brand name stripping (Tata, UltraTech, JSW, Ambuja, ACC, Jindal, etc.)
   - Steel classification into Fe 550D, Fe 500D, and Fe 500
   - Cement classification into 53 Grade OPC, 43 Grade PPC, and 33 Grade
   - Aggregates and Sand technical grading
   - Masonry classification (AAC Class 1, Class 10.0, Class 5.0)
   - Bitumen viscosity grading (VG-40, VG-30, VG-10)
   - Full `RecommendedProduct` object sanitization across all fields
   - Full `CartItem` object sanitization
4. **`tests/data/productsAndStandards.test.ts`** (9 tests):
   - BIS Standards library completeness and structure validation
   - `getBisStandardByCode` lookup
   - `getBisStandardsByCategory` filtering
   - Products database category coverage & positive unit pricing
   - Product rating bounds ($1.0 \le \text{rating} \le 5.0$)
   - Quality rank sorting
   - Sample projects non-empty material requirement validation
5. **`tests/services/quotationEngine.test.ts`** (2 tests):
   - Raw material subtotal, transport freight (4.5%), site labor (18%), contingency (5%), and GST (18%)
   - `QuotationRecord` data model validation
6. **`tests/utils/documentTextExtractor.test.ts`** (3 tests):
   - Plain text document extraction
   - CSV tabular BOQ text extraction
   - Markdown specification document extraction

### Running Tests
```bash
# Run all unit tests once
npm test

# Run tests in watch mode
npx vitest

# Run a specific test suite
npx vitest run tests/services/estimationEngine.test.ts
```

---

## 7. Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **bun**

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/Sripathi13/standard-x.git
cd standard-x

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

The application will be live at `http://localhost:3000`.

### Building for Production
```bash
npm run build
npm run preview
```

---

## 8. License

This project is licensed under the Apache License 2.0. Bureau of Indian Standards (BIS) and Indian Roads Congress (IRC) standard names and references are used for academic and technical compliance purposes.

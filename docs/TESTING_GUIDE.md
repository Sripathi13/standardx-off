# STANDARD X - Unit Testing Guide

## 1. Overview
The testing strategy guarantees mathematical reliability, zero-brand-bias compliance, and resilient document extraction. The testing framework uses **Vitest 3+** for execution speed and native ESM TypeScript support.

---

## 2. Test Suites Summary

| Test File | Target Module | Scope | Total Tests |
| :--- | :--- | :--- | :--- |
| `tests/services/estimationEngine.test.ts` | `src/services/estimationEngine.ts` | IS 456 Buildings, IRC:58 Roads, MoRTH Bituminous, IRC:112 Bridges, House Tiers | 11 |
| `tests/services/tenderExtractionService.test.ts` | `src/services/tenderExtractionService.ts` | Sample tenders, Building/Road/Bridge regex, confidence audits, fallbacks | 5 |
| `tests/utils/qualitySanitizer.test.ts` | `src/utils/qualitySanitizer.ts` | Brand stripping, BIS technical classification, product & cart sanitization | 10 |
| `tests/data/productsAndStandards.test.ts` | `src/data/bisStandards.ts`, `productsDatabase.ts` | BIS library integrity, product database schema, sample project validation | 9 |
| `tests/services/quotationEngine.test.ts` | Quotation financial logic | Subtotals, logistics (4.5%), labor (18%), contingency (5%), GST (18%) | 2 |
| `tests/utils/documentTextExtractor.test.ts` | `src/utils/documentTextExtractor.ts` | Plaintext, CSV tabular data, Markdown document extraction | 3 |
| **Total** | | | **40 Tests** |

---

## 3. Running Test Commands

### Run Full Suite Once
```bash
npm test
```

### Run Tests in Interactive Watch Mode
```bash
npx vitest
```

### Run With Test Coverage
```bash
npx vitest run --coverage
```

### Run a Single Target Suite
```bash
# Estimation engine formulas only
npx vitest run tests/services/estimationEngine.test.ts

# Quality sanitizer only
npx vitest run tests/utils/qualitySanitizer.test.ts
```

---

## 4. Continuous Integration Checklist
Before committing new features or submitting Pull Requests:
1. All unit tests must pass (`npm test` exits with code 0).
2. Codebase must pass type-checking (`npx tsc --noEmit`).
3. Build must succeed (`npm run build`).
4. Brand references in product names must not be hardcoded in user-facing components.

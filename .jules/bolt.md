# Performance Journal

## 2025-02-12: Optimizing Word Export in `!DOCTYPE html.html`

**Bottleneck:** The `exportToWord` function used `encodeURIComponent` on the entire report HTML string to construct a Data URI.
- **Impact:** For large reports (e.g., 10MB+), this operation was blocking the main thread (~180ms for 10MB on pure string op, >0.5s in context) and causing large memory allocations (~2x string size).
- **Optimization:** Replaced Data URI generation with `Blob` and `URL.createObjectURL`.
- **Result:**
  - Reduced CPU time for the encoding step by ~50% (178ms -> 81ms for 10MB).
  - Reduced memory usage significantly (Blob is ~11MB vs 22MB for encoded string).
  - Bypassed potential URL length limits in browsers.
- **Anti-pattern:** Using `data:` URIs for large file downloads. Always prefer `Blob` and `URL.createObjectURL`.

## 2025-02-27 - Hoist `isDataEmpty` function to avoid re-compiling and recreation
**Learning:** `isDataEmpty` is defined inside `renderReportPreview`, recreating the function and recompiling the internal tag-stripping regex for each report generation.
**Action:** Move `isDataEmpty` to the helper section and define `TAG_REGEX` globally to optimize rendering performance.

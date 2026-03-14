## 2024-05-18 - [Optimization of `isDataEmpty`]
**Learning:** Recreating a function with a backtracking-heavy regex (`/<(.|\n)*?>/g`) inside a rendering loop (like `renderReportPreview`) creates unnecessary overhead. Using `/<[^>]*>/g` avoids backtracking and is much faster.
**Action:** Always hoist functions that do not depend on closure state out of render loops and precompile/optimize regex patterns, especially for common tasks like stripping HTML tags.

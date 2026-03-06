
## 2024-05-19 - [Optimize HTML tag stripping and prevent function recreation]
**Learning:** In `!DOCTYPE html.html`, `isDataEmpty` was redefined inside the `renderReportPreview` render loop and used an inefficient regular expression `/<(.|\n)*?>/g` for HTML tag stripping, which is prone to catastrophic backtracking.
**Action:** Hoisted `isDataEmpty` to the global `Funzioni Helper` scope and replaced the regex with a precompiled, safer `/<[^>]*>/g`. Always look for functions redefined in loops and evaluate regex complexity when processing potentially large strings (like Rich Text Editor output).

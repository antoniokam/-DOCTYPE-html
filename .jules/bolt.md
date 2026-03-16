## 2024-05-24 - [Optimize isDataEmpty regex and function creation]
**Learning:** In `!DOCTYPE html.html`, `isDataEmpty` function is created inside the `renderReportPreview` loop and re-compiles the heavy `/<(.|\n)*?>/g` regex for every node processed, causing a performance bottleneck.
**Action:** Hoist the function out of the render loop to the global "Funzioni Helper" scope and replace the inefficient regex pattern with a global precompiled constant `TAG_REGEX = /<[^>]*>/g`.

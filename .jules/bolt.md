## 2024-05-24 - [Optimize `isDataEmpty` regex and avoid function recreation]
**Learning:** In React/HTML applications where functions like `isDataEmpty` are called repeatedly (e.g. inside `renderReportPreview` over potentially hundreds of elements), compiling regex `/<(.|\n)*?>/g` multiple times and recreating the function on each render can cause significant performance overhead.
**Action:** Hoist the function globally out of the render cycle and declare a pre-compiled `TAG_REGEX` variable to execute replacing much faster, thus speeding up the overall rendering process.

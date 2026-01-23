# Bolt's Journal

## 2025-02-18 - First Optimization
**Learning:** Single-file HTML apps often load all dependencies in the `<head>` synchronously, blocking the main thread. Deferring non-critical scripts and lazy-loading images are high-impact, low-risk optimizations for this architecture.
**Action:** Always check for synchronous script loading in `index.html` or equivalent entry points.

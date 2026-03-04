## 2024-05-24 - [Avoid catastrophic backtracking in regex]
**Learning:** The regex `/<(.|\n)*?>/g` is extremely slow and can cause catastrophic backtracking on long text inputs. Re-compiling it inside a render loop (like in `renderReportPreview`) adds massive overhead.
**Action:** Use the more efficient regex `/<[^>]*>/g` and declare it globally or as a constant outside of loops. Hoist inner functions that don't depend on local closures to prevent unnecessary recreation.

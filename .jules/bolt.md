
## 2024-05-19 - [Hoisted `isDataEmpty` & Pre-compiled regex in renderReportPreview]
**Learning:** Functions defined within a render function (like `isDataEmpty` in `renderReportPreview`) are recreated on every function call. Furthermore, inline regexes (like `/<(.|\n)*?>/g`) inside those functions recompile and can suffer from backtracking issues.
**Action:** Always hoist static regexes and pure helper functions to the global/module scope to prevent recompilation and recreation overhead during render loops.

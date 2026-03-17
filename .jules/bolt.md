
## 2025-03-01 - [Avoid repetitive regex recreation in loops and render blocks]
**Learning:** Recompiling regular expressions inside render or loop blocks significantly degrades performance. Furthermore, patterns like `/<(.|\n)*?>/g` cause catastrophic backtracking.
**Action:** When a regex is used purely for generic HTML tag removal, `/<[^>]*>/g` should be used as it avoids alternation (`(.|\n)`) and is up to 30-40% faster in execution. Furthermore, such regexes and the associated helper functions should be hoisted to the outermost static scope (e.g. global/module scope) to prevent memory allocation and compilation overhead during rendering.

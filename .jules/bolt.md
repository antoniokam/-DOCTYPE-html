## 2025-02-18 - Regex Performance in Hot Loops
**Learning:** Instantiating complex regular expressions (like `/<(.|\n)*?>/g`) inside a frequently called function (e.g., inside a loop or recursive renderer) significantly degrades performance. Reusing a global constant with an optimized pattern (e.g., `/<[^>]*>/g`) can yield ~20-50% speedup.
**Action:** Always hoist static regex patterns to global scope or module constants, especially in utility functions used in rendering or data processing loops. Prefer negated character classes over lazy dot-matching for simple stripping tasks.

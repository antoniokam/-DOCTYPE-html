
## 2025-05-18 - Regex Recompilation in Render Loops & encodeURIComponent Limits
**Learning:**
1. Defining a regex literal like `/<(.|\n)*?>/g` inside a function that is called repeatedly during a render cycle (e.g., `isDataEmpty` called for every node and section) causes severe performance degradation due to continuous regex recompilation and garbage collection overhead. Furthermore, backtracking issues with `.*?` can severely block the thread on large strings.
2. Generating downloadable files via `data: URI` and `encodeURIComponent` for large strings blocks the main thread and can exceed browser URL length limits.

**Action:**
1. Always hoist frequently used regex expressions to a global constant (e.g., `const TAG_REGEX = /<[^>]*>/g;`) so it is only compiled once.
2. Always hoist frequently used inline functions (like `isDataEmpty`) to the outer scope to prevent recreation in render loops.
3. For large file exports, prefer using the `Blob` API (`new Blob([...])`) combined with `URL.createObjectURL(blob)` instead of `encodeURIComponent`. It uses less memory and prevents main thread blocking, ensuring to `URL.revokeObjectURL(url)` afterwards.

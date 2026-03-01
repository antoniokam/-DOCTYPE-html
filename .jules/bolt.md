
## 2026-03-01 - [Optimize isDataEmpty rendering bottleneck]
**Learning:** Recreating functions within a tight render loop (e.g. `renderNodeData` traversing `esrsStructure`) is a CPU bottleneck. Coupled with an inline inefficient regex (`/<(.|\n)*?>/g`) that performs poorly due to potential catastrophic backtracking, UI responsiveness severely degrades.
**Action:** Always hoist commonly executed utility functions and compile complex Regexes globally (e.g., `const TAG_REGEX = /<[^>]*>/g;`) outside of render execution paths to eliminate repetitive parsing and function allocation overhead.

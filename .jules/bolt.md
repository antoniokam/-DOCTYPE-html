
## 2026-03-25 - Hoisting regex and function out of render loop
**Learning:** Defining regex and helper functions like `isDataEmpty` inside render loops causes severe recompilation and recreation overhead, severely degrading performance during heavy DOM manipulation.
**Action:** Always hoist static regexes and pure helper functions to the global/module scope to ensure they are created and compiled only once.

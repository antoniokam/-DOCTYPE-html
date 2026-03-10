## 2024-10-27 - Optimize regex and hoist isDataEmpty
**Learning:** The regex `/<(.|\n)*?>/g` used in a tight rendering loop caused unnecessary backtracking overhead. Additionally, defining the regex and the function `isDataEmpty` inside the rendering logic led to recompilation and recreation on every render pass.
**Action:** Always hoist functions out of tight render loops when they do not depend on closure state (other than global/app state), and precompile efficient regexes globally to prevent catastrophic backtracking and recompilation overhead.

# Bolt's Performance Journal

## 2024-05-30 - [Hoist isDataEmpty & Pre-compile Regex]
**Learning:** In `!DOCTYPE html.html`, `isDataEmpty` was defined inside `renderReportPreview`, causing it to be recreated continuously on each render cycle. Moreover, its internal regex `/<(.|\n)*?>/g` is highly inefficient due to the capturing group and the `(.|\n)*?` construct. Precompiling a static regex (`/<[^>]*>/g`) and hoisting the function eliminates function recreation and speeds up string replacements for HTML stripping.
**Action:** Hoist helper functions out of render cycles and always pre-compile regex constants outside of loops/functions. Refactor non-greedy `.*?` to greedy negated character classes `[^>]*` to prevent excessive backtracking.

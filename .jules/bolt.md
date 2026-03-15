## 2024-05-24 - [Regex Catastrophic Backtracking and Function Re-creation]
**Learning:** `/<(.|\n)*?>/g` causes catastrophic backtracking. Declaring helper functions inside render loops like `renderReportPreview` forces recreation on every render, severely impacting performance.
**Action:** Use `/<[^>]*>/g` for tag stripping and hoist helper functions out of render loops.

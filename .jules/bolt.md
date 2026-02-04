## 2026-02-04 - Single-File HTML Performance & Tooling
**Learning:** This repository uses a single-file HTML architecture (`!DOCTYPE html.html`) with CRLF line endings. Standard git-diff tools (`replace_with_git_merge_diff`) fail reliably on this file due to line ending mismatches or hidden characters. Python scripts using binary read/write are necessary for robust modifications.
**Action:** For future optimizations in single-file archives, prefer creating temporary Python scripts to perform search-and-replace operations rather than relying on patch-based tools.

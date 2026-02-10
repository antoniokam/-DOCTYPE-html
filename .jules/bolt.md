## 2025-05-27 - Single-file HTML Optimization
**Learning:** Standard diff tools fail on single-file HTML apps with mixed CRLF/LF line endings. Python scripts reading in binary mode or using precise string replacements are necessary.
**Action:** Use custom Python scripts for modification instead of git merge diffs for these files.

## 2025-05-27 - Lazy Loading Race Conditions
**Learning:** Lazy loading libraries like TinyMCE requires checking for global object existence in all dependent functions (save, navigate), not just the initialization block.
**Action:** Always wrap library access in `if (window.lib)` guards when implementing lazy loading.

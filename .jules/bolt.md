## 2024-05-22 - [Lazy Loading in Single-File Apps]
**Learning:** In single-file HTML apps using CRLF, use binary mode Python scripts for replacements to avoid corruption. Lazy loading heavy libs (TinyMCE, jsPDF) via a `loadScript` helper significantly improves TTI, but ensure UI structure is rendered *synchronously* before awaiting scripts to prevent blank screens.
**Action:** Use `loadScript` with promise caching for all non-critical external libs and wrap initialization logic in `async` functions after DOM updates.

## 2026-01-30 - !DOCTYPE html.html Lazy Loading
**Learning:** Large single-file HTML applications with CDN dependencies suffer from massive initial load if all scripts are in `<head>`.
**Action:** Implement a `loadScript` utility with promise caching to load heavy libraries (PDF, Editor, Docx) only when specific user actions (Export, Import, Edit) trigger them. Ensure guards (e.g., `typeof lib !== 'undefined'`) are in place for functions that might run before the script loads, especially when mixed indentation makes automated refactoring brittle.

## 2024-05-23 - Lazy Loading Heavy Dependencies
**Learning:** Single-file HTML apps with CDN dependencies can be significantly optimized by lazy loading libraries that are not critical for the initial render (e.g., PDF generation, file parsing). Using a simple `loadScript` utility with caching prevents redundant requests.
**Action:** Identify occasional-use libraries (Export/Import) and lazy load them to improve TTI and FCP.

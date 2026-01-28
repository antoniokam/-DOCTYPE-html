## 2024-10-26 - Lazy Loading Heavy Dependencies
**Learning:** The application was loading 4 heavy libraries (jspdf, html2canvas, pdf.js, mammoth) synchronously in the head, blocking the main thread. These libraries are only needed for specific user actions (export/import).
**Action:** Implement a `loadScript` utility to lazy-load these dependencies on demand, significantly improving initial load time and TTI.

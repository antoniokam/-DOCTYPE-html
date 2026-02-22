## 2026-02-22 - Lazy Loading Heavy Libraries

**Learning:** Large libraries like `jspdf` and `pdf.js` significantly impact initial load time (LCP, TTI) even if they are only used for specific actions (like export/import). Lazy loading them via a dynamic script loader can save ~1MB of initial JS payload.
**Action:** When working on standalone HTML apps, always audit the `<head>` for unnecessary libraries and move them to dynamic loading in user-triggered actions.

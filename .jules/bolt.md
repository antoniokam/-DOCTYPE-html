## 2024-05-23 - DOM Thrashing in Legacy Single-Page App
**Learning:** In a vanilla JS SPA that relies on `innerHTML` for rendering, re-rendering large navigation trees on every item selection causes significant layout thrashing.
**Action:** Replace full re-renders with targeted DOM updates (e.g., `classList.toggle`) for state changes like "active" items. This reduced navigation cost by ~3.3x in benchmarks.

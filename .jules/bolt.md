## 2024-05-23 - [Lazy Loading Pattern in Single File HTML]
**Learning:** The single-file HTML structure benefits significantly from a custom `loadScript` utility to lazy-load heavy dependencies (PDF export, file import) only on demand, as there is no bundler to handle code splitting.
**Action:** Use `loadScript` with promise caching for any new heavy library integration in `!DOCTYPE html.html`.

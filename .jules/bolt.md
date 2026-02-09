## 2024-05-23 - CRLF Line Endings in Single File Apps
**Learning:** The file `!DOCTYPE html.html` uses Windows (CRLF) line endings. `replace_with_git_merge_diff` and standard `sed` fail to apply patches because they expect LF or handle context strictly.
**Action:** Always check line endings first. For CRLF files, use Python scripts to read content in binary mode or normalize strings before replacement, rather than relying on diff tools.

## 2024-05-23 - Lazy Loading in Single File Architecture
**Learning:** Single-file apps often bundle heavy CDN libraries (TinyMCE, PDF.js, etc.) in `<head>`, causing massive initial load delay. Since there is no bundler (Webpack/Vite), standard code splitting isn't possible.
**Action:** Implement a manual `loadScript(src, attributes)` helper with Promise caching. Replace static tags with dynamic calls at the point of use (e.g., inside `exportToPdf` or `tinymce.init` wrappers). This saved ~5MB of initial bandwidth.

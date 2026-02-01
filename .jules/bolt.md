# Bolt's Journal

## 2024-05-22 - [Initial Setup]
**Learning:** The project relies heavily on single-file HTML applications with embedded React/Babel. This means build-time optimizations (like tree-shaking) are not available, so runtime optimizations (memoization, lazy loading) are critical.
**Action:** Focus on `React.useMemo`, `React.useCallback`, and dynamic script loading.

## 2026-02-01 - [Lazy Loading Implementation]
**Learning:** `replace_with_git_merge_diff` is unreliable on files with CRLF/mixed endings like `!DOCTYPE html.html`. Python string replacement is safer. Also, single-file apps require custom lazy-loading solutions as there is no bundler.
**Action:** Use Python scripts for edits in this repo. Implement `loadScript` pattern for heavy libs.

## 2025-02-20 - CRLF Line Endings in HTML Files
**Learning:** The file `!DOCTYPE html.html` uses CRLF (Windows-style) line endings. Standard string replacement or diff tools might fail if they expect LF, or if they mix line endings.
**Action:** Always check line endings before editing. Use binary mode or explicit newline handling in scripts when modifying such files to avoid corruption or diff failures.

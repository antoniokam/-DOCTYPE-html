## 2026-02-15 - !DOCTYPE html.html Modification
**Learning:** The file `!DOCTYPE html.html` uses mixed line endings (CRLF/LF) and inconsistent indentation, causing standard tools like `replace_with_git_merge_diff` to fail or corrupt the file.
**Action:** Always use Python scripts operating in binary mode (`'rb'`, `'wb'`) with robust regex matching for any modification to this file.

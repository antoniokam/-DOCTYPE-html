## 2026-02-05 - Binary Mode Editing for CRLF Files
**Learning:** The file `!DOCTYPE html.html` uses CRLF line endings and mixed indentation, causing standard text processing tools (sed, git merge diff) to fail or corrupt the file.
**Action:** Always use Python scripts with binary mode (`'rb'`, `'wb'`) to read and write these files to preserve exact byte-for-byte structure.

## 2026-02-05 - Recursive Array Concatenation Anti-Pattern
**Learning:** Found `ids = ids.concat(recursive(child))` in a tree traversal. This is O(N^2) due to repeated array copying.
**Action:** Replace with an accumulator pattern `recursive(child, acc)` to achieve O(N).

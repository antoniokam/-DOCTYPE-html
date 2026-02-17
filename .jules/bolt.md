## 2024-05-22 - [Handling Legacy HTML Files]
**Learning:** `!DOCTYPE html.html` is a legacy file with mixed CRLF line endings and non-standard indentation. Standard tools like `sed` or `replace_with_git_merge_diff` fail to match context or corrupt the file structure.
**Action:** Always use Python scripts with binary mode (`'rb'`, `'wb'`) to read/modify this file. Locate unique context blocks (like `// --- Funzioni Helper ---`) for safe insertion/replacement.

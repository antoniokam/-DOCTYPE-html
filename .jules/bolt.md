## 2026-02-18 - [Optimizing Single-File Legacy HTML]
**Learning:** Large single-file HTML apps with mixed line endings (CRLF) are fragile to standard diff tools. Python scripts with binary read/write and exact string matching are the safest way to modify them.
**Action:** Always inspect line endings and use byte-string matching for replacements in legacy files.

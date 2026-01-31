## 2026-01-31 - [HTML File Modification Instability]
**Learning:** The file `!DOCTYPE html.html` contains mixed indentation and CRLF endings which causes `replace_with_git_merge_diff` to fail repeatedly even when context looks correct.
**Action:** For this specific file, prefer reading the full content, performing modifications via a local Python script (using string replacement or regex), and writing back the full content using `write_file`.

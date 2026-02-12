## 2024-05-23 - Regex Performance Surprise
**Learning:** Contrary to common optimization wisdom, the complex regex `/<(.|\n)*?>/g` was measured to be slightly faster (6ms vs 7.5ms) than the simpler `/<[^>]*>/g` for stripping HTML tags in this Node.js environment.
**Action:** Always benchmark regex optimizations before applying them, as engine heuristics can make complex patterns perform unexpectedly well.

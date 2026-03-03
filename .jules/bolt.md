## 2025-02-28 - HTML Tag Stripping Performance
**Learning:** In the ESRS Report generation loop, stripping HTML tags using `/<(.|\n)*?>/g` is highly inefficient and causes unnecessary recompilation overhead when defined inside the render function.
**Action:** Always hoist regex patterns globally and use optimized patterns like `/<[^>]*>/g` to prevent regex recompilation overhead during intense render loops.

## 2025-05-22 - [Vanilla JS Re-render Bottleneck]
**Learning:** In Single File Vanilla JS apps like this, navigation logic often lazily defaults to full component re-rendering (destroying/recreating DOM) just to change a single class (active state). This causes unnecessary layout thrashing and scrolling issues.
**Action:** When optimizing legacy/simple JS apps, look for `innerHTML` replacements triggered by frequent actions (like navigation) and replace them with `classList.toggle` or targeted DOM updates.

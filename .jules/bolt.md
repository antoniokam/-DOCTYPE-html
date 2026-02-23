## 2024-05-22 - Single File App Lazy Loading
**Learning:** In single-file HTML apps relying on CDNs, `loadScript` utilities must implement promise caching (memoization) to prevent race conditions when multiple actions trigger the same library load simultaneously.
**Action:** Always use a `scriptCache` object in custom lazy loaders to store and return the loading promise.

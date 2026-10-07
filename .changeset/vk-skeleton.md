---
'@vkieu/mui': minor
---

Add `Skeleton` and `SkeletonGroup` to `@vkieu/mui/vk`: placeholders in the shape of loading content (rectangle, circle, or text lines sized to a type-scale role), filled with M3 surface roles and cornered with the shape scale. They are pure CSS server components, so they animate in streamed Suspense fallbacks before hydration, with a `pulse` (default) or `shimmer` animation on the M3 motion tokens that stops under reduced motion and mirrors in right-to-left. `SkeletonGroup` names the loading region once and marks it busy.

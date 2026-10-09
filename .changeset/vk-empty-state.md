---
'@vkieu/mui': minor
---

Add `EmptyState` to `@vkieu/mui/vk`: a designed state for a region with nothing to show (no posts yet, no results, coming soon, or couldn't load with a retry). An icon in a coloured container, a title, an optional description and up to two actions. `variant` is `plain` or a `Card` variant (`filled`, `elevated`, `outlined`); `size` (`sm`, `md`, `lg`) follows the type scale; `tone` picks the icon container's colour roles (`primary`, `secondary`, `tertiary`, `neutral`, `error`); `shape` is a circle or any M3 Expressive shape. `titleAs` makes the title a heading and `announce` a status region. A server component that fades in on the effects spring. The Expressive shape mask `Avatar` uses moves to a shared utility, with no change to `Avatar`.

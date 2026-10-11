---
'@vkieu/mui': minor
---

Add three `@vkieu/mui/vk` components:
- `ShapedIcon`: an icon in a circle or an M3 Expressive shape, in a tone's container colours (`shape`, `size` `sm`/`md`/`lg`/`xl`, `tone`, optional `aria-label`). `EmptyState` now draws its icon with it, with no visible change. `emptyStateStyles` no longer has the `media` and `icon` slots, which moved to `shapedIconStyles`.
- `SkipLink`: "Skip to content" for keyboard users. It's off screen until focused, then moves focus to its `target` (WCAG 2.4.1).
- `FileTrigger` and `useFileTrigger`: make any library button (or a menu item's action) open the system file picker or the phone camera (`accept`, `multiple`, `capture`, `directory`, `onSelect(files)`).

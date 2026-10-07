---
'@vkieu/mui': minor
---

Add `Avatar`, `AvatarGroup` and `getInitials` to `@vkieu/mui/vk`. Avatars render on the server with the photo over an initials or icon fallback (shown when the photo fails), a stable container tone per name, sizes matching M3 avatar slots (24–96px), a circle by default, a rounded square or any of the 35 M3 Expressive shapes, an `icon` fallback, presence and verified badges in the accessible name (their colours are CSS variables apps can override), and an optional link or button form with a state layer, focus ring and 48px touch target. `AvatarGroup` overlaps avatars with a surface ring (mirrored in right-to-left), shows "+N" past `max` (optionally a link or button), and is named once. Initials keep diacritics with their letters and follow the locale's casing.

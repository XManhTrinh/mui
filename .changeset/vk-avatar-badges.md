---
'@vkieu/mui': minor
---

Avatar: `verified` becomes a generic `badge` (any icon or short content) with a required `badgeLabel`, and its colour variables are now `--vk-avatar-badge` / `--vk-avatar-on-badge`. `presencePlacement` and `badgePlacement` put either one in any logical corner. `tone="auto"` hashes names into 12 colour slots (`--vk-avatar-tone-1` … `-12` with `--vk-avatar-on-tone-*`), which apps can set to any colour; `classNames.visual` lets Tailwind classes recolour one avatar.

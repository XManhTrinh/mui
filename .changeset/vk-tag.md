---
'@vkieu/mui': minor
---

Add `Tag` and `TagGroup` to `@vkieu/mui/vk`: a small, static label for a status or a category ("Sold", "Open now", "Featured"). `variant` is `tonal`, `filled` or `outlined`; `tone` is `neutral`, `primary`, `secondary`, `tertiary`, `error`, `success` or `warning`; `size` is `sm` (20px), `md` (24px) or `lg` (32px); `shape` is `full` or `rounded`. It takes a status `dot` or a leading `icon`, a `fullLabel` for short forms ("M3E" reads "Expressive"), and a `maxWidth` that truncates. Component tokens: `tagTokens` (typed sizes and colour roles) and `--vk-tag-*` CSS variables on the tag or any ancestor. Never focusable and with no role; a server component.

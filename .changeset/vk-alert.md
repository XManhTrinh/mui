---
'@vkieu/mui': minor
---

Add `Alert` to `@vkieu/mui/vk`: a message that stays until it's resolved (a form's error, a page's warning, a system notice). `tone` is `error` (default, `role="alert"`), `info`, `success`, `warning` or `neutral` (`role="status"`); `variant` is `tonal` or `outlined`. It takes a `title`, the tone's icon (replaceable), up to two `actions`, `onClose` for a close button, and `focusOnMount` for a blocking form error. Text buttons on a tonal alert take its content colour, which stays at 4.5:1 on every container. Tokens: `--vk-alert-container`, `-content`, `-outline`, `-icon` and `-corner`.

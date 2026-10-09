---
'@vkieu/mui': minor
---

`Dialog` gains the M3 full-screen dialog: `fullScreen="always"` fills the window on `surface` with no corners, or `fullScreen="compact"` does so only below 600px (the M3 recommendation) and stays a basic dialog on larger windows. The new `DialogHeader` part holds the close icon button, the `title-large` headline and the confirming action in full screen, and is a plain title otherwise; `DialogActions` are hidden while full screen. The panel slides up 48px as it fades in. Also exports `DialogFullScreen`, `DialogHeaderProps` and `DialogHeaderClassNames`.

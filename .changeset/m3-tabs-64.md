---
'@vkieu/mui': patch
---

`Tabs`: tabs with the icon above the label are now 64px tall, the M3 token (`IconAndLabelTextContainerHeight`), with the icon, a 2px gap and the label centred. They were 72px, the Material Design 1 value that Compose's `Tab.kt` still hard-codes.

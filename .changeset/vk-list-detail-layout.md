---
'@vkieu/mui': minor
---

Add `ListDetailLayout` to `@vkieu/mui/vk`: M3's list-detail canonical layout. Below 840px one pane shows at a time, chosen by `active` (`"list"` or `"detail"`), with an optional `back` slot on the open item; from 840px a fixed list pane (360px, 412px from 1200px, or `listWidth`) sits beside a flexible detail pane with M3's 24px spacer, and the list is sticky (`stickyTop`). URL-driven and switched with CSS, so server-rendered pages never jump. Each pane is a labelled landmark (`listLabel`, `detailLabel`, `listAs`); a new `detailKey` moves focus to the pane now showing in single-pane mode. The incoming pane enters with the shared axis X transition, never on page load or under reduced motion. `variant` is `plain` or `filled` (`surface-container-low` panes).

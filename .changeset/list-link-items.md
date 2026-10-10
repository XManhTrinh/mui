---
'@vkieu/mui': minor
---

`List` link items are now real anchors. In a list without `onAction` or `selectionMode`, an item with `href` renders as an `<a>` in a plain `ul`. It is its own Tab stop, with the browser's link menu and new-tab clicks, and a plain click is still routed through the `RouterProvider`. New `ListItem` props: `current` (`aria-current="page"` and the selected colours), `target`, `rel` and `download`. `disabledKeys` and `disabled` now apply to plain lists too.

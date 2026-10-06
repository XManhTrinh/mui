---
'@vkieu/mui': patch
---

`Menu`, `Tabs` and interactive `List` now explain, in development, when their items were created in a React Server Component (they arrive as client references React Aria can't read), instead of failing with React Stately's "Unknown element <[object Object]> in collection". Build `MenuItem` / `MenuGroup` / `Tab` / `ListItem` elements in a client component.

---
'@vkieu/mui': patch
---

`Menu` (and `SplitButton` menus): the groups' elevation shadow is no longer cut off at a square edge around the rounded corners. The scrolling list clipped its children's shadows to its box; it now keeps 8px of room around the groups (without moving the menu), and that margin passes clicks through.

`Menu` groups now have 4px padding on every side (the M3 `GroupPadding` token), so the first and last items are as far from the group's edge as from its sides. Item corners nest inside their group's: 12px where an item meets a 16px group corner, 4px elsewhere, so no item is rounder than the group around it. Group labels start 12px from the group's edge, as in Compose.

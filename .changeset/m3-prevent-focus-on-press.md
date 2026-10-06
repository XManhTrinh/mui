---
'@vkieu/mui': patch
---

Fix the React warning "React does not recognize the `preventFocusOnPress` prop on a DOM element" on buttons that open a `Menu` (and `SplitButton` menus). `ButtonBase` now passes React Aria's `preventFocusOnPress` from the menu trigger to its press handling instead of the `<button>` element, so the trigger no longer takes focus back from an opening menu.

---
'@vkieu/mui': minor
---

Add `BottomSheet`, `SideSheet` and `SheetTrigger`. The modal bottom sheet follows Compose: it opens to half the window when its content is taller, expands or closes from its drag handle (press or drag, settling with Compose's thresholds), closes on a press outside, and Escape first returns a fully open sheet to half. Side sheets are modal (over a scrim, docked or detached) or standard (in the layout, opening and closing their width). Standard `List` items are now transparent, so they take the colour of their container.

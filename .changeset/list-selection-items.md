---
'@vkieu/mui': minor
---

List items can now be switches, checkboxes or radio buttons, matching Compose's toggleable and selectable `ListItem`s. `control="switch" | "checkbox"` with `checked` / `defaultChecked` / `onCheckedChange` makes the whole item one control. `value` / `defaultValue` / `onValueChange` on `List` makes a radio list. Items also take `disabled`, `verticalAlignment`, `controlPlacement`, `name`, `value` and `switchIcons`, and `List` takes `disabled`.

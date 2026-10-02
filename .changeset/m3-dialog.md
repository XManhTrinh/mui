---
'@vkieu/mui': minor
---

Add `Dialog` with `DialogTrigger`, `DialogTitle`, `DialogContent` and `DialogActions`: a modal M3 basic dialog with icon, scrim, enter/exit motion, focus containment and restoration, Escape and outside-press dismissal (not for `alertdialog`), scroll lock and scrolling content. Any button-like component can be the trigger through the new `TriggerContext` primitive. `Overlay` now also keeps the text direction of where it is rendered, and gains `usePresence` for exit animations.

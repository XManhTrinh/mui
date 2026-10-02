---
'@vkieu/mui': minor
---

Add `Snackbar`, `SnackbarHost`, `SnackbarHostState` and `useSnackbarHostState`: M3 snackbars matching Compose, with an action, a dismiss button, or the action on a new line. The host queues snackbars and shows them one at a time in a polite live region, with Compose's fade-and-scale and 4s / 10s durations; the timer pauses on hover or focus. `showSnackbar` resolves with how each snackbar ended.

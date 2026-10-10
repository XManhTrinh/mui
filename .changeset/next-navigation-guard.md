---
'@vkieu/mui': minor
---

`@vkieu/mui/next` gains `useNavigationGuard({ when, onAttempt })`: while `when` is true, library links inside `NextRouterProvider` call `onAttempt(proceed)` instead of navigating, so a page can confirm before unsaved changes are lost, and reloading or closing the tab shows the browser's prompt. `useGuardedNavigate()` gives code the same check in place of `router.push`. The most recent active guard decides. `NextRouterProvider`'s props are unchanged.

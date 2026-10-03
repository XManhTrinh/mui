---
'@vkieu/mui': patch
---

Components that follow the DOM direction for their arrow keys (tabs, toolbars, lists, sliders, pickers) now keep the locale's language and region in an RTL or LTR region that differs from the locale: only the script changes (`en-US` → `en-Arab-US`), so dates and numbers keep formatting in the app's language. Previously they switched to Arabic or US English. `localeWithDirection` is exported from `@vkieu/mui/primitives`.

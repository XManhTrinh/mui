---
'@vkieu/mui': patch
---

`NavigationRail` now accepts `classNames.body` for the rail's scrolling column, so its 44px top inset can be changed (e.g. `classNames={{ body: 'pt-2' }}`) without negative margins on the items.

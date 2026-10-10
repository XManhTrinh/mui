---
'@vkieu/mui': patch
---

`List` link items keep buttons in their leading or trailing content out of the link. The anchor sits on the headline, and its overlay covers the item, so the whole item is still the link. Pressing a trailing button no longer follows the link, and HTML no longer nests a button inside an `<a>`.

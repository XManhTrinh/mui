---
'@vkieu/mui': patch
---

Fix the press ripple starting from the previous press's position (or the centre on the first press). Every press now starts a fresh ripple at the press point, including rapid presses while the last ripple is still growing or fading; Checkbox, Radio and Switch restart theirs too.

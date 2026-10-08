---
'@vkieu/mui': minor
---

Add `PinInput` to `@vkieu/mui/vk`: a fixed-length code input with one box per character, for verification and reset codes, two-factor codes, PINs and voucher codes. One invisible input sits over the boxes, so one-time-code autofill, paste (cleaned, so "123 456" becomes `123456`), password managers and screen readers treat it as a single field. Boxes use the M3 text field tokens in `outlined` (default) and `filled` variants, three sizes, any corner of the shape scale, `numeric`, `alphanumeric` or `alphabetic` characters or a custom `pattern`, `mask` for PINs, `groups` with a custom `separator`, and `onComplete` for auto-submit. Characters pop in on the fast spatial spring, an invalid code shakes the row once, and both stop under reduced motion; the code stays left to right in right-to-left layouts and fits a 320px phone up to six characters. Also exports `pinInputStyles` and `sanitizePin`.

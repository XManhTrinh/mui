---
'@vkieu/mui': patch
---

`ImageCropper` and `ImageCropDialog` report the crop at exactly their `aspect` (within one pixel). They used the frame's measured size, which is rounded to whole screen pixels, so a 3:1 crop of an 1800px photo on a phone came back as 1800 × 598. `cropRect` takes the aspect as an optional fourth argument.

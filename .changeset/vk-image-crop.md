---
'@vkieu/mui': minor
---

Add `ImageCropDialog` and `ImageCropper` to `@vkieu/mui/vk` (not M3 components): frame a photo before upload by dragging, pinching, scrolling, or with the keyboard and a zoom slider, behind a fixed frame with an optional round-avatar `guide`. They report the crop in the original photo's pixels (after EXIF orientation), so servers crop the original at full quality. The dialog is full screen on compact windows and a basic dialog on larger ones, with loading, error and `busy` (upload progress) states. Also exports `imageCropStyles` and the pure `clampView`, `coverScale` and `cropRect` helpers.

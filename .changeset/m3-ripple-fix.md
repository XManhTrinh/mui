---
'@vkieu/mui': patch
---

Fix the press ripple stopping short on quick taps. It now follows Compose's `RippleAnimation`: it fades in, grows from 30% of the element's longer side to past its edges over 225ms while its centre moves to the middle, and then fades out. A short press now always completes the growth before fading, and right-clicks no longer start a ripple.

# Plan: ImageCropDialog (`@vkieu/mui/vk`)

Status: **approved by Mike on 2026-10-09** (built ourselves with no dependency; a square frame for avatars)

## Goal

A dialog for framing a photo before upload: the person zooms and drags the photo behind a fixed frame, then confirms. VKIEU's profile photo is the first consumer (VKIEU `docs/features/profile.md`). Post photos, business logos and listing photos need the same thing with other shapes and aspect ratios.

The dialog returns **the crop rectangle in the original image's pixels**, not a re-encoded image. The server (`sharp` in VKIEU) crops the original at full quality, strips metadata and makes the sizes. The browser never has to re-encode, which loses quality and can keep EXIF data.

M3 has no image cropper, so it's a **`vk` component** (architecture decision #22). It's built from the library's `Dialog`, `Slider`, `IconButton` and `Button`, with M3 colour roles, shape, type and motion.

## Name

`ImageCropDialog`, with the crop area also exported as **`ImageCropper`** for apps that want it inline, for example inside a multi-step sheet. (Other libraries call it `Cropper` or `AvatarEditor`; the `Dialog` suffix says what most callers render.)

## When to use which

| Use | When |
|---|---|
| `ImageCropDialog` | A person picks a photo that has to fit a fixed shape: avatar, logo, cover, post or listing photo |
| `ImageCropper` | The same, inline in a page or a step of a flow, without its own dialog |
| Neither | The photo is shown as uploaded (attachments, documents, chat images) |

## Decisions

| # | Decision | Value |
|---|---|---|
| 1 | Where | `packages/ui/src/vk/image-crop/`, exported from `@vkieu/mui/vk` |
| 2 | Dependencies | **None.** Pan, pinch and zoom are built on pointer events and the `Slider` (react-aria), about 300 lines. Crop libraries (`react-easy-crop`, `react-image-crop`) bring their own styling and focus handling, which would have to be overridden to meet the theming and accessibility bar. |
| 3 | Input | `src`: an object URL or a URL. Opening a picked `File` is the app's job (`URL.createObjectURL`), so the component works with any picker. The image is drawn in an `<img>`, so the browser applies EXIF orientation (`image-orientation: from-image`). The rectangle is in **oriented** pixels, and the docs tell servers to auto-rotate before cropping (`sharp().rotate()`). |
| 4 | Output | `onConfirm({ x, y, width, height })` in the oriented image's natural pixels, as integers clamped inside the image. Also `naturalWidth` and `naturalHeight`, so the server can check the rectangle against the file it receives. |
| 5 | Frame | `aspect` (default `1`), a square-cornered frame (Mike, 2026-10-09: avatars are framed and stored as the full square), plus `guide`: `'circle'` draws a thin dashed circle inside the frame, showing what a round avatar displays, or `'none'` (default). Outside the frame, the photo is dimmed with `scrim` at the M3 scrim opacity, so the frame reads clearly in every theme and contrast level. The frame edge is a 2px `outline-variant` ring, and `outline` in high contrast. |
| 6 | Zoom | From "the photo just covers the frame" (minimum) up to 4× that, or `maxZoom`. The photo can never leave a gap inside the frame: panning and zooming clamp to the photo's edges. |
| 7 | Gestures | Drag with a mouse, pen or one finger; pinch with two fingers; the mouse wheel and trackpad pinch zoom around the pointer. `touch-action: none` only on the crop area, so the page still scrolls outside it. |
| 8 | Keyboard | The crop area is one focusable element (`role="group"`, labelled "Photo position"): arrow keys move 10px (Shift for 50px), `+` and `-` zoom, and `0` resets. The zoom `Slider` with `−` and `+` icon buttons sits under it. Every action has a non-drag way to do it (WCAG 2.2 SC 2.5.7, dragging movements). |
| 9 | Dialog | **Full-screen on compact windows** (the M3 full-screen dialog: a top bar with close, the title and the confirm action), and a **basic dialog** on medium and larger windows (about 560px wide, with Cancel and the confirm action at the bottom). One primary action: `confirmLabel`, for example "Save". |
| 10 | Motion | Zoom and pan follow the pointer with no animation. Resetting and "snap back inside the frame" use the M3 **spatial spring** (`useM3Spring`). With reduced motion, they jump. |
| 11 | States | `loading` (a skeleton in the frame while the image decodes), `error` (the image can't be decoded, with `errorMessage`, for example HEIC in Chrome; the confirm button is disabled), and `busy` (the app is uploading after confirm: the confirm button shows the loading indicator and the dialog can't be dismissed). |
| 12 | Text | Every visible and accessible string is a prop with an English default (`title`, `confirmLabel`, `cancelLabel`, `zoomLabel`, `areaLabel`, `resetLabel`), so apps pass translated text. |
| 13 | Right-to-left | The layout mirrors (actions and slider direction), and the photo doesn't. |
| 14 | Forced colours | The frame ring uses `CanvasText`, and the dimmed outside keeps a visible edge. |
| 15 | Server rendering | The dialog renders nothing until it's opened. `ImageCropper` renders its frame and skeleton on the server, with no layout shift. |
| 16 | API conventions | `className`, `classNames` (`root`, `area`, `image`, `frame`, `controls`, `slider`), `data-*` state attributes (`data-loading`, `data-error`, `data-dragging`), and TSDoc that says it isn't an M3 component. |
| 17 | Later, if needed | Rotate by 90°, free aspect ratio, several photos in a row. |

## API

```tsx
import { ImageCropDialog } from '@vkieu/mui/vk';

<ImageCropDialog
  isOpen={file !== null}
  onOpenChange={(open) => !open && setFile(null)}
  src={objectUrl}
  aspect={1}
  guide="circle"
  title={t('photo.cropTitle')}          // "Adjust your photo"
  confirmLabel={t('photo.save')}        // "Save"
  busy={uploading}
  onConfirm={({ crop, naturalWidth, naturalHeight }) => upload(file, crop)}
/>
```

## Files

```
packages/ui/src/vk/image-crop/
  ImageCropper.tsx             the area: image, frame, gestures, keyboard, zoom controls
  ImageCropDialog.tsx          full-screen on compact, basic dialog on medium+
  crop-geometry.ts             pan/zoom clamping and screen-to-image pixels (pure functions)
  image-crop-styles.ts         tailwind-variants slots
  *.test.ts(x)                 unit and interaction tests
apps/docs/stories/ImageCropDialog.stories.tsx, apps/docs/e2e/image-crop.spec.ts
apps/site/                     page, playground, examples, catalog entry (Inputs) with search
                               keywords (crop, avatar, photo, image, upload, profile picture), count
.changeset/                    minor: adds ImageCropDialog and ImageCropper to @vkieu/mui/vk
```

## Tests and checks

- **Unit (geometry):**
  - the minimum zoom covers the frame, for landscape, portrait and square photos;
  - clamping never leaves a gap;
  - the output rectangle is right at several zoom levels and offsets, and keeps the aspect ratio exactly after rounding;
  - very large (8000 px) and very small (100 px) photos.
- **Interaction:**
  - keyboard-only framing (arrows, Shift, `+`, `-`, `0`) and the slider;
  - dragging with the mouse, and pinch with two pointers;
  - confirm returns the rectangle;
  - Escape and Cancel close it, except while `busy`;
  - focus moves into the dialog and returns to the opener.
- **Axe** in every story, light and dark.
- **Visual regression** across the six themes × light/dark × contrast levels: with and without the circle guide, loading, error, busy, full-screen at phone width and basic at desktop width, right-to-left and forced colours.
- **Next.js:** `ImageCropper` server-renders, and the dialog hydrates without errors.
- `pnpm typecheck`, `pnpm lint`, `pnpm test` and the Playwright checks pass.

## Questions for Mike

1. **No dependency** (decision 2): built on the library's own pieces (Mike, 2026-10-09).
2. **Avatar frame:** the full square, with an optional circle guide (Mike, 2026-10-09).

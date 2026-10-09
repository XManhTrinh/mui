import { tv, type VariantProps } from '../../utils/tv';

/*
 * ImageCropper is a `vk` component, NOT an M3 component (architecture decision #22; plan in
 * docs/plans/image-crop-dialog.md). It uses only M3 colour roles, the shape scale and the
 * focus indicator. The area holds the photo with 24px padding around the frame, so the
 * dimmed photo around it stays visible; the frame keeps the crop's aspect ratio, sits in
 * the centre of the area, and dims everything outside itself with a 100vmax `scrim`
 * outline at 56% (the 32% dialog scrim is too faint over a photo to read the frame). The
 * frame edge is a 2px `outline-variant` border, which the contrast levels strengthen. Every
 * class is written out in full so Tailwind can find it.
 */

/** Variant definitions for {@link ImageCropper}. */
export const imageCropStyles = tv({
  slots: {
    root: 'flex w-full flex-col gap-[16px]',
    area: [
      'relative w-full touch-none overflow-hidden p-[24px] select-none',
      'rounded-corner-medium bg-surface-container-highest focus-ring',
      'cursor-grab data-dragging:cursor-grabbing',
      'data-error:cursor-default data-loading:cursor-default',
    ],
    image: [
      'pointer-events-none absolute top-1/2 left-1/2 max-w-none',
      'data-loading:invisible',
      'data-settling:[transition-property:width,height,translate]',
      'data-settling:[transition-duration:var(--md-sys-motion-spring-spatial-default-duration)]',
      'data-settling:[transition-timing-function:var(--md-sys-motion-spring-spatial-default-easing)]',
      'motion-reduce:transition-none',
    ],
    frame: [
      'pointer-events-none relative mx-auto w-full',
      'border-2 border-outline-variant outline-[100vmax] outline-scrim/56 outline-solid',
      'data-error:border-transparent data-error:outline-0 data-loading:outline-0',
      'forced-colors:border-[CanvasText]',
    ],
    guide: [
      'pointer-events-none absolute inset-0 rounded-full',
      'border border-dashed border-outline-variant forced-colors:border-[CanvasText]',
    ],
    skeleton: 'absolute inset-0 h-auto w-auto',
    error: [
      'absolute inset-0 flex items-center justify-center p-[16px] text-center',
      'text-body-medium text-on-surface-variant',
    ],
    controls: 'flex items-center gap-[8px]',
    slider: 'min-w-0 flex-1',
    instructions: 'sr-only',
    // ImageCropDialog's content: 512px wide on medium windows and up (the basic dialog's 560px
    // less its padding), the full width in full screen.
    dialogContent: 'flex flex-col gap-[16px] medium:w-[512px] medium:max-w-full',
  },
});

export type ImageCropStyleProps = VariantProps<typeof imageCropStyles>;

import { tv, type VariantProps } from '../../utils/tv';

/*
 * Skeleton is a `vk` component, NOT an M3 component (architecture decision #22; plan in
 * docs/plans/skeleton.md). It uses only M3 colour roles and the shape scale. The fill and
 * the animation come from the `vk-skeleton` utility (pure CSS, styles/utilities.css); the
 * tone only sets `--vk-skeleton-fill`, so a multi-line wrapper paints nothing itself.
 * Every class is written out in full so Tailwind can find it.
 */

const textLine = [
  'vk-skeleton block w-full bg-clip-content',
  'h-(--vk-skeleton-line-height)',
  'py-[calc((var(--vk-skeleton-line-height)-var(--vk-skeleton-glyph-size))/2)]',
  // The bar is painted inside the padding, which would shrink the corner; add it back so the
  // visible bar has the shape-scale corner.
  'rounded-[calc(var(--vk-skeleton-corner)+(var(--vk-skeleton-line-height)-var(--vk-skeleton-glyph-size))/2)]',
];

/** Variant definitions for {@link Skeleton}. */
export const skeletonStyles = tv({
  slots: {
    root: 'block shrink-0',
    line: textLine,
  },
  variants: {
    shape: {
      rectangle: { root: 'vk-skeleton h-24 w-full rounded-(--vk-skeleton-corner)' },
      circle: { root: 'vk-skeleton size-10 rounded-(--vk-skeleton-corner)' },
      line: { root: textLine },
      lines: { root: 'flex w-full flex-col', line: 'last:w-3/5' },
    },
    // The corner is a variable, so text lines can measure it on their visible bar.
    corner: {
      none: { root: '[--vk-skeleton-corner:var(--md-sys-shape-corner-none)]' },
      'extra-small': { root: '[--vk-skeleton-corner:var(--md-sys-shape-corner-extra-small)]' },
      small: { root: '[--vk-skeleton-corner:var(--md-sys-shape-corner-small)]' },
      medium: { root: '[--vk-skeleton-corner:var(--md-sys-shape-corner-medium)]' },
      large: { root: '[--vk-skeleton-corner:var(--md-sys-shape-corner-large)]' },
      'extra-large': { root: '[--vk-skeleton-corner:var(--md-sys-shape-corner-extra-large)]' },
      full: { root: '[--vk-skeleton-corner:var(--md-sys-shape-corner-full)]' },
    },
    tone: {
      highest: { root: '[--vk-skeleton-fill:var(--md-sys-color-surface-container-highest)]' },
      high: { root: '[--vk-skeleton-fill:var(--md-sys-color-surface-container-high)]' },
    },
  },
  defaultVariants: {
    shape: 'rectangle',
    corner: 'small',
    tone: 'highest',
  },
});

/** Variant definitions for {@link SkeletonGroup}. */
export const skeletonGroupStyles = tv({
  slots: {
    root: '',
    label: 'sr-only',
  },
});

export type SkeletonStyleProps = VariantProps<typeof skeletonStyles>;

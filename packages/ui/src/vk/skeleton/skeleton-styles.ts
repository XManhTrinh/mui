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
];

/** Variant definitions for {@link Skeleton}. */
export const skeletonStyles = tv({
  slots: {
    root: 'block shrink-0',
    line: textLine,
  },
  variants: {
    shape: {
      rectangle: { root: 'vk-skeleton h-24 w-full' },
      circle: { root: 'vk-skeleton size-10' },
      line: { root: textLine },
      lines: { root: 'flex w-full flex-col', line: 'last:w-3/5' },
    },
    corner: {
      none: { root: 'rounded-corner-none', line: 'rounded-corner-none' },
      'extra-small': { root: 'rounded-corner-extra-small', line: 'rounded-corner-extra-small' },
      small: { root: 'rounded-corner-small', line: 'rounded-corner-small' },
      medium: { root: 'rounded-corner-medium', line: 'rounded-corner-medium' },
      large: { root: 'rounded-corner-large', line: 'rounded-corner-large' },
      'extra-large': { root: 'rounded-corner-extra-large', line: 'rounded-corner-extra-large' },
      full: { root: 'rounded-corner-full', line: 'rounded-corner-full' },
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

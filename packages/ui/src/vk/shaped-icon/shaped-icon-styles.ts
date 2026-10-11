import { tv, type VariantProps } from '../../utils/tv';

/*
 * ShapedIcon is a `vk` component, NOT an M3 component (architecture decision #22; plan in
 * docs/plans/shaped-icon-skip-link-file-trigger.md): an icon in a container shaped as a
 * circle or an M3 Expressive shape (a CSS mask from `materialShapeMask`), in a tone's
 * container colour roles. Extracted from EmptyState, which uses it. Every class is written
 * out in full so Tailwind finds it.
 */

/** Variant definitions for {@link ShapedIcon}; extend them to add variants. */
export const shapedIconStyles = tv({
  slots: {
    root: [
      'inline-flex shrink-0 items-center justify-center',
      '[mask-repeat:no-repeat] [mask-size:100%_100%]',
      'forced-colors:text-[CanvasText]',
    ],
    icon: 'flex items-center justify-center [&>svg]:size-full',
  },
  variants: {
    // Container / icon: 40/24, 56/28, 64/32 and 96/48px.
    size: {
      sm: { root: 'size-10', icon: 'size-6' },
      md: { root: 'size-14', icon: 'size-7' },
      lg: { root: 'size-16', icon: 'size-8' },
      xl: { root: 'size-24', icon: 'size-12' },
    },
    tone: {
      primary: { root: 'bg-primary-container text-on-primary-container' },
      secondary: { root: 'bg-secondary-container text-on-secondary-container' },
      tertiary: { root: 'bg-tertiary-container text-on-tertiary-container' },
      neutral: { root: 'bg-surface-container-highest text-on-surface-variant' },
      error: { root: 'bg-error-container text-on-error-container' },
    },
    shape: {
      circle: { root: 'rounded-full' },
      expressive: { root: '' },
    },
  },
  defaultVariants: { size: 'md', tone: 'secondary', shape: 'circle' },
});

export type ShapedIconStyleProps = VariantProps<typeof shapedIconStyles>;
export type ShapedIconSize = NonNullable<ShapedIconStyleProps['size']>;
export type ShapedIconTone = NonNullable<ShapedIconStyleProps['tone']>;

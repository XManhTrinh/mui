import { tv, type VariantProps } from '../../utils/tv';

/*
 * Link is a `vk` component, NOT an M3 component (docs/plans/link.md). Colour is `primary`
 * (or the surrounding text's, with `tone="inherit"`), read through `--vk-link-color`. The
 * underline's thickness and offset come from `--vk-link-underline-thickness` and
 * `--vk-link-underline-offset`; with the default `skip-ink` it clears Vietnamese diacritics
 * below the line (ạ, ặ, ụ). Focus is the M3 indicator. Forced colours use `LinkText` and
 * always underline. Every class is written out in full so Tailwind finds it.
 */

/** Variant definitions for {@link Link}; extend them to add variants. */
export const linkStyles = tv({
  slots: {
    root: [
      'cursor-pointer rounded-corner-extra-small focus-ring',
      'decoration-[length:var(--vk-link-underline-thickness,1px)]',
      'underline-offset-[var(--vk-link-underline-offset,0.2em)]',
      'forced-colors:text-[LinkText] forced-colors:underline',
    ],
    icon: 'ms-[0.15em] inline-block size-[0.9em] align-[-0.1em] [&>svg]:size-full',
  },
  variants: {
    variant: {
      inline: { root: 'underline' },
      standalone: {
        root: 'no-underline data-hovered:underline data-focus-visible:underline data-pressed:underline',
      },
      // A link around non-text content (a logo, a photo tile): no underline and no background
      // in any state, only the focus ring. Its content can react to the link's
      // `data-hovered` / `data-pressed` through `group-data-*` (e.g. underline a name).
      plain: { root: 'group/link no-underline' },
    },
    tone: {
      primary: { root: 'text-[var(--vk-link-color,var(--md-sys-color-primary))]' },
      inherit: { root: 'text-[var(--vk-link-color,inherit)]' },
    },
    size: {
      inherit: {},
      small: { root: 'text-label-small' },
      medium: { root: 'text-label-medium' },
      large: { root: 'text-label-large' },
    },
  },
  defaultVariants: { variant: 'inline', tone: 'primary', size: 'inherit' },
});

export type LinkStyleProps = VariantProps<typeof linkStyles>;
export type LinkVariant = NonNullable<LinkStyleProps['variant']>;
export type LinkTone = NonNullable<LinkStyleProps['tone']>;
export type LinkSize = NonNullable<LinkStyleProps['size']>;

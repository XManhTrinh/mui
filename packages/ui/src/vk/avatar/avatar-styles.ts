import { tv, type VariantProps } from '../../utils/tv';

/*
 * Avatar is a `vk` component, NOT an M3 component (architecture decision #22; plan in
 * docs/plans/avatar.md). Sizes match the avatar slots of M3 components (24 input chip,
 * 40 list item); colours are M3 container roles (overridable CSS variables); corners come
 * from the shape scale; and
 * the photo, the fallback and the badges share one grid cell, so nothing is positioned.
 * Every class is written out in full so Tailwind can find it.
 */

/** Overlays share the avatar's single grid cell. */
const stack = '*:[grid-area:1/1]';

/** Variant definitions for {@link Avatar}. */
export const avatarStyles = tv({
  slots: {
    root: ['group/avatar inline-grid shrink-0 align-middle select-none', stack],
    content: ['relative inline-grid size-full', stack],
    visual: ['inline-grid size-full overflow-hidden', stack],
    image: 'size-full object-cover data-[status=error]:hidden',
    fallback: [
      'flex size-full items-center justify-center font-plain [&>svg]:size-3/5',
      'group-has-[img[data-status=loaded]]/avatar:invisible',
    ],
    stateLayer: [
      'pointer-events-none size-full bg-transparent',
      'group-data-hovered/avatar:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface)_calc(var(--md-sys-state-hover-state-layer-opacity)*100%),transparent)]',
      'group-data-focus-visible/avatar:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface)_calc(var(--md-sys-state-focus-state-layer-opacity)*100%),transparent)]',
      'group-data-pressed/avatar:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface)_calc(var(--md-sys-state-pressed-state-layer-opacity)*100%),transparent)]',
    ],
    presence: [
      'z-1 size-[30%] min-h-2 min-w-2 rounded-corner-full',
      'shadow-[0_0_0_2px_var(--vk-avatar-ring,var(--md-sys-color-surface))]',
    ],
    badge: [
      'z-1 inline-flex size-[38%] min-h-3 min-w-3 items-center justify-center overflow-hidden',
      'rounded-corner-full text-label-small [&>svg]:size-3/4',
      'bg-[var(--vk-avatar-badge,var(--md-sys-color-primary))] text-[var(--vk-avatar-on-badge,var(--md-sys-color-on-primary))]',
      'shadow-[0_0_0_2px_var(--vk-avatar-ring,var(--md-sys-color-surface))]',
    ],
  },
  variants: {
    size: {
      xs: { root: 'size-6', fallback: 'text-label-small' },
      sm: { root: 'size-8', fallback: 'text-label-large' },
      md: { root: 'size-10', fallback: 'text-title-medium' },
      lg: { root: 'size-14', fallback: 'text-title-large' },
      xl: { root: 'size-18', fallback: 'text-headline-small' },
      '2xl': { root: 'size-24', fallback: 'text-headline-medium' },
    },
    shape: {
      circle: {
        root: 'rounded-corner-full',
        visual: 'rounded-corner-full',
        stateLayer: 'rounded-corner-full',
      },
      rounded: {},
      // An M3 Expressive shape, applied as a mask (see Avatar); the focus ring stays round.
      expressive: {
        root: 'rounded-corner-full',
        visual: '[mask-repeat:no-repeat] [mask-size:100%_100%]',
        stateLayer: '[mask-repeat:no-repeat] [mask-size:100%_100%]',
      },
    },
    tone: {
      primary: { visual: 'bg-primary-container text-on-primary-container' },
      secondary: { visual: 'bg-secondary-container text-on-secondary-container' },
      tertiary: { visual: 'bg-tertiary-container text-on-tertiary-container' },
      neutral: { visual: 'bg-surface-container-highest text-on-surface-variant' },
      // `auto` hashes a name into one of 12 slots. Each slot is a CSS variable pair (any colour)
      // whose default cycles through the four tones above, so an app can add up to 12 colours.
      'auto-1': {
        visual:
          'bg-[var(--vk-avatar-tone-1,var(--md-sys-color-primary-container))] text-[var(--vk-avatar-on-tone-1,var(--md-sys-color-on-primary-container))]',
      },
      'auto-2': {
        visual:
          'bg-[var(--vk-avatar-tone-2,var(--md-sys-color-secondary-container))] text-[var(--vk-avatar-on-tone-2,var(--md-sys-color-on-secondary-container))]',
      },
      'auto-3': {
        visual:
          'bg-[var(--vk-avatar-tone-3,var(--md-sys-color-tertiary-container))] text-[var(--vk-avatar-on-tone-3,var(--md-sys-color-on-tertiary-container))]',
      },
      'auto-4': {
        visual:
          'bg-[var(--vk-avatar-tone-4,var(--md-sys-color-surface-container-highest))] text-[var(--vk-avatar-on-tone-4,var(--md-sys-color-on-surface-variant))]',
      },
      'auto-5': {
        visual:
          'bg-[var(--vk-avatar-tone-5,var(--md-sys-color-primary-container))] text-[var(--vk-avatar-on-tone-5,var(--md-sys-color-on-primary-container))]',
      },
      'auto-6': {
        visual:
          'bg-[var(--vk-avatar-tone-6,var(--md-sys-color-secondary-container))] text-[var(--vk-avatar-on-tone-6,var(--md-sys-color-on-secondary-container))]',
      },
      'auto-7': {
        visual:
          'bg-[var(--vk-avatar-tone-7,var(--md-sys-color-tertiary-container))] text-[var(--vk-avatar-on-tone-7,var(--md-sys-color-on-tertiary-container))]',
      },
      'auto-8': {
        visual:
          'bg-[var(--vk-avatar-tone-8,var(--md-sys-color-surface-container-highest))] text-[var(--vk-avatar-on-tone-8,var(--md-sys-color-on-surface-variant))]',
      },
      'auto-9': {
        visual:
          'bg-[var(--vk-avatar-tone-9,var(--md-sys-color-primary-container))] text-[var(--vk-avatar-on-tone-9,var(--md-sys-color-on-primary-container))]',
      },
      'auto-10': {
        visual:
          'bg-[var(--vk-avatar-tone-10,var(--md-sys-color-secondary-container))] text-[var(--vk-avatar-on-tone-10,var(--md-sys-color-on-secondary-container))]',
      },
      'auto-11': {
        visual:
          'bg-[var(--vk-avatar-tone-11,var(--md-sys-color-tertiary-container))] text-[var(--vk-avatar-on-tone-11,var(--md-sys-color-on-tertiary-container))]',
      },
      'auto-12': {
        visual:
          'bg-[var(--vk-avatar-tone-12,var(--md-sys-color-surface-container-highest))] text-[var(--vk-avatar-on-tone-12,var(--md-sys-color-on-surface-variant))]',
      },
    },
    // Each status colour is a CSS variable with an M3 role as its default, so an app can
    // set it once (for example a green "online" from its theme), per section or per avatar.
    presence: {
      online: { presence: 'bg-[var(--vk-avatar-online,var(--md-sys-color-primary))]' },
      away: { presence: 'bg-[var(--vk-avatar-away,var(--md-sys-color-tertiary))]' },
      offline: {
        presence:
          'bg-surface shadow-[inset_0_0_0_2px_var(--vk-avatar-offline,var(--md-sys-color-outline)),0_0_0_2px_var(--vk-avatar-ring,var(--md-sys-color-surface))]',
      },
    },
    /** Corners in logical directions, so they mirror in right-to-left. */
    presencePlacement: {
      'top-start': { presence: 'self-start justify-self-start' },
      'top-end': { presence: 'self-start justify-self-end' },
      'bottom-start': { presence: 'self-end justify-self-start' },
      'bottom-end': { presence: 'self-end justify-self-end' },
    },
    badgePlacement: {
      'top-start': { badge: 'self-start justify-self-start' },
      'top-end': { badge: 'self-start justify-self-end' },
      'bottom-start': { badge: 'self-end justify-self-start' },
      'bottom-end': { badge: 'self-end justify-self-end' },
    },
    interactive: {
      true: { root: 'focus-ring cursor-pointer' },
      false: {},
    },
    /** A surface-coloured ring that separates overlapping avatars (set by AvatarGroup). */
    ring: {
      true: { visual: 'shadow-[0_0_0_2px_var(--vk-avatar-ring,var(--md-sys-color-surface))]' },
      false: {},
    },
  },
  compoundVariants: [
    // Rounded squares scale their corner with the avatar (shape scale).
    {
      shape: 'rounded',
      size: 'xs',
      class: {
        root: 'rounded-corner-extra-small',
        visual: 'rounded-corner-extra-small',
        stateLayer: 'rounded-corner-extra-small',
      },
    },
    {
      shape: 'rounded',
      size: 'sm',
      class: {
        root: 'rounded-corner-small',
        visual: 'rounded-corner-small',
        stateLayer: 'rounded-corner-small',
      },
    },
    {
      shape: 'rounded',
      size: 'md',
      class: {
        root: 'rounded-corner-medium',
        visual: 'rounded-corner-medium',
        stateLayer: 'rounded-corner-medium',
      },
    },
    {
      shape: 'rounded',
      size: 'lg',
      class: {
        root: 'rounded-corner-large',
        visual: 'rounded-corner-large',
        stateLayer: 'rounded-corner-large',
      },
    },
    {
      shape: 'rounded',
      size: ['xl', '2xl'],
      class: {
        root: 'rounded-corner-extra-large',
        visual: 'rounded-corner-extra-large',
        stateLayer: 'rounded-corner-extra-large',
      },
    },
  ],
  defaultVariants: {
    size: 'md',
    shape: 'circle',
    tone: 'neutral',
    presencePlacement: 'bottom-end',
    badgePlacement: 'top-end',
    interactive: false,
    ring: false,
  },
});

/** Variant definitions for {@link AvatarGroup}. */
export const avatarGroupStyles = tv({
  slots: {
    root: 'inline-flex items-center',
    item: '',
    overflow: '',
  },
  variants: {
    spacing: { overlap: {}, spaced: { root: 'gap-1' } },
    size: { xs: {}, sm: {}, md: {}, lg: {}, xl: {}, '2xl': {} },
  },
  compoundVariants: [
    // Each avatar after the first overlaps the previous by a quarter of its size.
    { spacing: 'overlap', size: 'xs', class: { item: 'not-first:-ms-1.5' } },
    { spacing: 'overlap', size: 'sm', class: { item: 'not-first:-ms-2' } },
    { spacing: 'overlap', size: 'md', class: { item: 'not-first:-ms-2.5' } },
    { spacing: 'overlap', size: 'lg', class: { item: 'not-first:-ms-3.5' } },
    { spacing: 'overlap', size: 'xl', class: { item: 'not-first:-ms-4.5' } },
    { spacing: 'overlap', size: '2xl', class: { item: 'not-first:-ms-6' } },
  ],
  defaultVariants: { spacing: 'overlap', size: 'md' },
});

export type AvatarStyleProps = VariantProps<typeof avatarStyles>;

import { tv, type VariantProps } from '../../utils/tv';

/*
 * Tag is a `vk` component, NOT an M3 component (docs/plans/tag.md). Written from
 * `tag-tokens.ts` (a test checks they agree). Every value reads its `--vk-tag-*` variable
 * first, so a consumer can set it on the tag or any ancestor, as with Avatar's variables.
 * A transparent 1px border on tonal and filled tags keeps every variant the same size and
 * becomes visible in forced colours. Colours ease on the default effects spring when the
 * variant or tone changes, and not at all under reduced motion. Every class is written out
 * in full so Tailwind finds it.
 */

/** Variant definitions for {@link Tag}; extend them to add variants. */
export const tagStyles = tv({
  slots: {
    root: [
      'inline-flex max-w-full shrink-0 items-center border border-solid align-middle whitespace-nowrap',
      'transition-colors duration-(--md-sys-motion-spring-effects-default-duration) ease-(--md-sys-motion-spring-effects-default-easing) motion-reduce:transition-none',
      'forced-colors:border-[CanvasText] forced-colors:text-[CanvasText]',
    ],
    dot: 'size-[6px] shrink-0 rounded-full forced-colors:bg-[CanvasText]',
    icon: 'inline-flex shrink-0 items-center justify-center [&>svg]:size-full',
    label: 'min-w-0 truncate',
  },
  variants: {
    variant: { tonal: {}, filled: {}, outlined: {} },
    tone: {
      neutral: {},
      primary: {},
      secondary: {},
      tertiary: {},
      error: {},
      success: {},
      warning: {},
    },
    size: {
      sm: {
        root: 'h-[var(--vk-tag-height,20px)] px-[var(--vk-tag-padding-inline,6px)] gap-[var(--vk-tag-gap,4px)] text-label-small',
        icon: 'size-[var(--vk-tag-icon-size,14px)]',
      },
      md: {
        root: 'h-[var(--vk-tag-height,24px)] px-[var(--vk-tag-padding-inline,8px)] gap-[var(--vk-tag-gap,4px)] text-label-medium',
        icon: 'size-[var(--vk-tag-icon-size,16px)]',
      },
      lg: {
        root: 'h-[var(--vk-tag-height,32px)] px-[var(--vk-tag-padding-inline,12px)] gap-[var(--vk-tag-gap,6px)] text-label-large',
        icon: 'size-[var(--vk-tag-icon-size,18px)]',
      },
    },
    shape: {
      full: { root: 'rounded-[var(--vk-tag-corner,var(--md-sys-shape-corner-full))]' },
      rounded: {},
    },
  },
  compoundVariants: [
    {
      shape: 'rounded',
      size: 'sm',
      class: { root: 'rounded-[var(--vk-tag-corner,var(--md-sys-shape-corner-extra-small))]' },
    },
    {
      shape: 'rounded',
      size: 'md',
      class: { root: 'rounded-[var(--vk-tag-corner,var(--md-sys-shape-corner-small))]' },
    },
    {
      shape: 'rounded',
      size: 'lg',
      class: { root: 'rounded-[var(--vk-tag-corner,var(--md-sys-shape-corner-small))]' },
    },
    {
      variant: 'tonal',
      tone: 'neutral',
      class: {
        root: 'bg-[var(--vk-tag-container,var(--md-sys-color-surface-container-highest))] text-[var(--vk-tag-content,var(--md-sys-color-on-surface-variant))] border-[var(--vk-tag-outline,transparent)]',
        dot: 'bg-[var(--vk-tag-dot,var(--md-sys-color-on-surface-variant))]',
      },
    },
    {
      variant: 'tonal',
      tone: 'primary',
      class: {
        root: 'bg-[var(--vk-tag-container,var(--md-sys-color-primary-container))] text-[var(--vk-tag-content,var(--md-sys-color-on-primary-container))] border-[var(--vk-tag-outline,transparent)]',
        dot: 'bg-[var(--vk-tag-dot,var(--md-sys-color-primary))]',
      },
    },
    {
      variant: 'tonal',
      tone: 'secondary',
      class: {
        root: 'bg-[var(--vk-tag-container,var(--md-sys-color-secondary-container))] text-[var(--vk-tag-content,var(--md-sys-color-on-secondary-container))] border-[var(--vk-tag-outline,transparent)]',
        dot: 'bg-[var(--vk-tag-dot,var(--md-sys-color-secondary))]',
      },
    },
    {
      variant: 'tonal',
      tone: 'tertiary',
      class: {
        root: 'bg-[var(--vk-tag-container,var(--md-sys-color-tertiary-container))] text-[var(--vk-tag-content,var(--md-sys-color-on-tertiary-container))] border-[var(--vk-tag-outline,transparent)]',
        dot: 'bg-[var(--vk-tag-dot,var(--md-sys-color-tertiary))]',
      },
    },
    {
      variant: 'tonal',
      tone: 'error',
      class: {
        root: 'bg-[var(--vk-tag-container,var(--md-sys-color-error-container))] text-[var(--vk-tag-content,var(--md-sys-color-on-error-container))] border-[var(--vk-tag-outline,transparent)]',
        dot: 'bg-[var(--vk-tag-dot,var(--md-sys-color-error))]',
      },
    },
    {
      variant: 'tonal',
      tone: 'success',
      class: {
        root: 'bg-[var(--vk-tag-container,var(--md-sys-color-success-container))] text-[var(--vk-tag-content,var(--md-sys-color-on-success-container))] border-[var(--vk-tag-outline,transparent)]',
        dot: 'bg-[var(--vk-tag-dot,var(--md-sys-color-success))]',
      },
    },
    {
      variant: 'tonal',
      tone: 'warning',
      class: {
        root: 'bg-[var(--vk-tag-container,var(--md-sys-color-warning-container))] text-[var(--vk-tag-content,var(--md-sys-color-on-warning-container))] border-[var(--vk-tag-outline,transparent)]',
        dot: 'bg-[var(--vk-tag-dot,var(--md-sys-color-warning))]',
      },
    },
    {
      variant: 'filled',
      tone: 'neutral',
      class: {
        root: 'bg-[var(--vk-tag-container,var(--md-sys-color-inverse-surface))] text-[var(--vk-tag-content,var(--md-sys-color-inverse-on-surface))] border-[var(--vk-tag-outline,transparent)]',
        dot: 'bg-[var(--vk-tag-dot,var(--md-sys-color-inverse-on-surface))]',
      },
    },
    {
      variant: 'filled',
      tone: 'primary',
      class: {
        root: 'bg-[var(--vk-tag-container,var(--md-sys-color-primary))] text-[var(--vk-tag-content,var(--md-sys-color-on-primary))] border-[var(--vk-tag-outline,transparent)]',
        dot: 'bg-[var(--vk-tag-dot,var(--md-sys-color-on-primary))]',
      },
    },
    {
      variant: 'filled',
      tone: 'secondary',
      class: {
        root: 'bg-[var(--vk-tag-container,var(--md-sys-color-secondary))] text-[var(--vk-tag-content,var(--md-sys-color-on-secondary))] border-[var(--vk-tag-outline,transparent)]',
        dot: 'bg-[var(--vk-tag-dot,var(--md-sys-color-on-secondary))]',
      },
    },
    {
      variant: 'filled',
      tone: 'tertiary',
      class: {
        root: 'bg-[var(--vk-tag-container,var(--md-sys-color-tertiary))] text-[var(--vk-tag-content,var(--md-sys-color-on-tertiary))] border-[var(--vk-tag-outline,transparent)]',
        dot: 'bg-[var(--vk-tag-dot,var(--md-sys-color-on-tertiary))]',
      },
    },
    {
      variant: 'filled',
      tone: 'error',
      class: {
        root: 'bg-[var(--vk-tag-container,var(--md-sys-color-error))] text-[var(--vk-tag-content,var(--md-sys-color-on-error))] border-[var(--vk-tag-outline,transparent)]',
        dot: 'bg-[var(--vk-tag-dot,var(--md-sys-color-on-error))]',
      },
    },
    {
      variant: 'filled',
      tone: 'success',
      class: {
        root: 'bg-[var(--vk-tag-container,var(--md-sys-color-success))] text-[var(--vk-tag-content,var(--md-sys-color-on-success))] border-[var(--vk-tag-outline,transparent)]',
        dot: 'bg-[var(--vk-tag-dot,var(--md-sys-color-on-success))]',
      },
    },
    {
      variant: 'filled',
      tone: 'warning',
      class: {
        root: 'bg-[var(--vk-tag-container,var(--md-sys-color-warning))] text-[var(--vk-tag-content,var(--md-sys-color-on-warning))] border-[var(--vk-tag-outline,transparent)]',
        dot: 'bg-[var(--vk-tag-dot,var(--md-sys-color-on-warning))]',
      },
    },
    {
      variant: 'outlined',
      tone: 'neutral',
      class: {
        root: 'bg-[var(--vk-tag-container,transparent)] text-[var(--vk-tag-content,var(--md-sys-color-on-surface-variant))] border-[var(--vk-tag-outline,var(--md-sys-color-outline))]',
        dot: 'bg-[var(--vk-tag-dot,var(--md-sys-color-outline))]',
      },
    },
    {
      variant: 'outlined',
      tone: 'primary',
      class: {
        root: 'bg-[var(--vk-tag-container,transparent)] text-[var(--vk-tag-content,var(--md-sys-color-primary))] border-[var(--vk-tag-outline,var(--md-sys-color-primary))]',
        dot: 'bg-[var(--vk-tag-dot,var(--md-sys-color-primary))]',
      },
    },
    {
      variant: 'outlined',
      tone: 'secondary',
      class: {
        root: 'bg-[var(--vk-tag-container,transparent)] text-[var(--vk-tag-content,var(--md-sys-color-secondary))] border-[var(--vk-tag-outline,var(--md-sys-color-secondary))]',
        dot: 'bg-[var(--vk-tag-dot,var(--md-sys-color-secondary))]',
      },
    },
    {
      variant: 'outlined',
      tone: 'tertiary',
      class: {
        root: 'bg-[var(--vk-tag-container,transparent)] text-[var(--vk-tag-content,var(--md-sys-color-tertiary))] border-[var(--vk-tag-outline,var(--md-sys-color-tertiary))]',
        dot: 'bg-[var(--vk-tag-dot,var(--md-sys-color-tertiary))]',
      },
    },
    {
      variant: 'outlined',
      tone: 'error',
      class: {
        root: 'bg-[var(--vk-tag-container,transparent)] text-[var(--vk-tag-content,var(--md-sys-color-error))] border-[var(--vk-tag-outline,var(--md-sys-color-error))]',
        dot: 'bg-[var(--vk-tag-dot,var(--md-sys-color-error))]',
      },
    },
    {
      variant: 'outlined',
      tone: 'success',
      class: {
        root: 'bg-[var(--vk-tag-container,transparent)] text-[var(--vk-tag-content,var(--md-sys-color-success))] border-[var(--vk-tag-outline,var(--md-sys-color-success))]',
        dot: 'bg-[var(--vk-tag-dot,var(--md-sys-color-success))]',
      },
    },
    {
      variant: 'outlined',
      tone: 'warning',
      class: {
        root: 'bg-[var(--vk-tag-container,transparent)] text-[var(--vk-tag-content,var(--md-sys-color-warning))] border-[var(--vk-tag-outline,var(--md-sys-color-warning))]',
        dot: 'bg-[var(--vk-tag-dot,var(--md-sys-color-warning))]',
      },
    },
  ],
  defaultVariants: { variant: 'tonal', tone: 'neutral', size: 'md', shape: 'full' },
});

export type TagStyleProps = VariantProps<typeof tagStyles>;

/** The list of tags in a {@link TagGroup}. */
export const tagGroupStyles = tv({
  base: 'm-0 flex list-none flex-wrap items-center gap-[8px] p-0',
});

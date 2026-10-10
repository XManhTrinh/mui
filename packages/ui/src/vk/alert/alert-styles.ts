import { tv, type VariantProps } from '../../utils/tv';

/*
 * Alert is a `vk` component, NOT an M3 component (docs/plans/alert.md). Tonal alerts take
 * the tone's container and on-container roles (neutral: `surface-container-highest` and
 * `on-surface`); outlined ones sit on the surface with a 1px border and icon in the tone's
 * strong role. Every colour reads its `--vk-alert-*` variable first. Corners `medium`
 * (`--vk-alert-corner`). It fades in on the default effects spring through
 * `@starting-style`, not at all under reduced motion. The actions move beside the text when
 * the alert is at least 480px wide (a container query). Every class is written out in full.
 */

/** Variant definitions for {@link Alert}; extend them to add variants. */
export const alertStyles = tv({
  slots: {
    root: [
      '@container relative flex w-full items-start gap-[12px] border border-solid py-[14px] ps-[16px] pe-[16px] text-start',
      'rounded-[var(--vk-alert-corner,var(--md-sys-shape-corner-medium))]',
      'transition-opacity starting:opacity-0 duration-(--md-sys-motion-spring-effects-default-duration) ease-(--md-sys-motion-spring-effects-default-easing) motion-reduce:transition-none',
      'outline-none forced-colors:border-[CanvasText] forced-colors:text-[CanvasText]',
    ],
    icon: 'mt-[2px] inline-flex size-[20px] shrink-0 items-center justify-center [&>svg]:size-full forced-colors:text-[CanvasText]',
    body: 'flex min-w-0 flex-1 flex-col gap-[12px] @[480px]:flex-row @[480px]:items-center',
    text: 'flex min-w-0 flex-1 flex-col gap-[2px]',
    title: 'text-title-small',
    message: 'text-body-medium',
    actions: 'flex flex-wrap items-center gap-[8px] -ms-[12px] @[480px]:ms-0',
    close: '-me-[8px] -mt-[8px] shrink-0',
  },
  variants: {
    variant: {
      // On a tonal container `primary` can fall below 4.5:1 (2.4:1 on light error), so text
      // buttons take the alert's own content colour, which is tested at 4.5:1 everywhere.
      // `.text-primary` is the text Button's colour class (button-styles.ts).
      tonal: { actions: '[&_.text-primary]:text-inherit' },
      outlined: {},
    },
    tone: { error: {}, info: {}, success: {}, warning: {}, neutral: {} },
    dismissible: { true: { root: 'pe-[8px]' }, false: {} },
  },
  compoundVariants: [
    {
      variant: 'tonal',
      tone: 'error',
      class: {
        root: 'bg-[var(--vk-alert-container,var(--md-sys-color-error-container))] text-[var(--vk-alert-content,var(--md-sys-color-on-error-container))] border-[var(--vk-alert-outline,transparent)]',
        icon: 'text-[var(--vk-alert-icon,var(--md-sys-color-on-error-container))]',
      },
    },
    {
      variant: 'outlined',
      tone: 'error',
      class: {
        root: 'bg-[var(--vk-alert-container,transparent)] text-[var(--vk-alert-content,var(--md-sys-color-on-surface))] border-[var(--vk-alert-outline,var(--md-sys-color-error))]',
        icon: 'text-[var(--vk-alert-icon,var(--md-sys-color-error))]',
      },
    },
    {
      variant: 'tonal',
      tone: 'info',
      class: {
        root: 'bg-[var(--vk-alert-container,var(--md-sys-color-secondary-container))] text-[var(--vk-alert-content,var(--md-sys-color-on-secondary-container))] border-[var(--vk-alert-outline,transparent)]',
        icon: 'text-[var(--vk-alert-icon,var(--md-sys-color-on-secondary-container))]',
      },
    },
    {
      variant: 'outlined',
      tone: 'info',
      class: {
        root: 'bg-[var(--vk-alert-container,transparent)] text-[var(--vk-alert-content,var(--md-sys-color-on-surface))] border-[var(--vk-alert-outline,var(--md-sys-color-secondary))]',
        icon: 'text-[var(--vk-alert-icon,var(--md-sys-color-secondary))]',
      },
    },
    {
      variant: 'tonal',
      tone: 'success',
      class: {
        root: 'bg-[var(--vk-alert-container,var(--md-sys-color-success-container))] text-[var(--vk-alert-content,var(--md-sys-color-on-success-container))] border-[var(--vk-alert-outline,transparent)]',
        icon: 'text-[var(--vk-alert-icon,var(--md-sys-color-on-success-container))]',
      },
    },
    {
      variant: 'outlined',
      tone: 'success',
      class: {
        root: 'bg-[var(--vk-alert-container,transparent)] text-[var(--vk-alert-content,var(--md-sys-color-on-surface))] border-[var(--vk-alert-outline,var(--md-sys-color-success))]',
        icon: 'text-[var(--vk-alert-icon,var(--md-sys-color-success))]',
      },
    },
    {
      variant: 'tonal',
      tone: 'warning',
      class: {
        root: 'bg-[var(--vk-alert-container,var(--md-sys-color-warning-container))] text-[var(--vk-alert-content,var(--md-sys-color-on-warning-container))] border-[var(--vk-alert-outline,transparent)]',
        icon: 'text-[var(--vk-alert-icon,var(--md-sys-color-on-warning-container))]',
      },
    },
    {
      variant: 'outlined',
      tone: 'warning',
      class: {
        root: 'bg-[var(--vk-alert-container,transparent)] text-[var(--vk-alert-content,var(--md-sys-color-on-surface))] border-[var(--vk-alert-outline,var(--md-sys-color-warning))]',
        icon: 'text-[var(--vk-alert-icon,var(--md-sys-color-warning))]',
      },
    },
    {
      variant: 'tonal',
      tone: 'neutral',
      class: {
        root: 'bg-[var(--vk-alert-container,var(--md-sys-color-surface-container-highest))] text-[var(--vk-alert-content,var(--md-sys-color-on-surface))] border-[var(--vk-alert-outline,transparent)]',
        icon: 'text-[var(--vk-alert-icon,var(--md-sys-color-on-surface-variant))]',
      },
    },
    {
      variant: 'outlined',
      tone: 'neutral',
      class: {
        root: 'bg-[var(--vk-alert-container,transparent)] text-[var(--vk-alert-content,var(--md-sys-color-on-surface))] border-[var(--vk-alert-outline,var(--md-sys-color-outline))]',
        icon: 'text-[var(--vk-alert-icon,var(--md-sys-color-on-surface-variant))]',
      },
    },
  ],
  defaultVariants: { variant: 'tonal', tone: 'error', dismissible: false },
});

export type AlertStyleProps = VariantProps<typeof alertStyles>;
export type AlertVariant = NonNullable<AlertStyleProps['variant']>;
export type AlertTone = NonNullable<AlertStyleProps['tone']>;

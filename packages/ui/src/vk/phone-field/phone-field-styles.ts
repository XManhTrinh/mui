import { tv, type VariantProps } from '../../utils/tv';

/*
 * PhoneField (`@vkieu/mui/vk`, not an M3 component; docs/plans/phone-field.md). The number
 * is the library's TextField; the country field beside it uses the same text field tokens
 * (56px, outline or filled container, `on-surface`, 2px `primary` when focused, `error`
 * when invalid, 38% / 12% when disabled). The picker's list is `Select` and
 * `Autocomplete`'s option list, in the M3 menu's panel colour (`surface-container-low`) and
 * elevation, so the three can't drift apart.
 */

/** Variant definitions for {@link PhoneField}. */
export const phoneFieldStyles = tv({
  slots: {
    root: 'inline-flex w-[320px] max-w-full items-start gap-[8px] align-top',
    country: [
      'flex h-[56px] shrink-0 cursor-pointer items-center gap-[4px] ps-[12px] pe-[8px]',
      'text-body-large text-on-surface tabular-nums outline-none',
      'transition-[border-color,box-shadow] [transition-duration:var(--md-sys-motion-spring-effects-fast-duration)] [transition-timing-function:var(--md-sys-motion-spring-effects-fast-easing)]',
      'data-disabled:cursor-default data-disabled:text-on-surface/38',
      'forced-colors:border-[CanvasText]',
    ],
    flag: 'inline-flex size-[20px] items-center justify-center [&>*]:max-h-full [&>*]:max-w-full',
    // The dial code reads left to right in every layout.
    dial: '[direction:ltr]',
    arrow: 'size-[24px] text-on-surface-variant group-data-disabled/country:text-on-surface/38',
    number: 'min-w-0 flex-1',
    // Picker panel (popover on medium+ windows, bottom sheet content on compact).
    popover: 'z-(--md-sys-z-menu)',
    panel: [
      'flex w-[320px] max-w-[calc(100vw-32px)] flex-col overflow-hidden',
      'rounded-corner-large bg-surface-container-low shadow-elevation-2',
      'max-h-[min(440px,var(--visual-viewport-height,100vh))]',
      'scale-none opacity-100 [transition-property:opacity,scale]',
      '[transition-duration:var(--md-sys-motion-spring-effects-fast-duration),var(--md-sys-motion-spring-spatial-fast-duration)]',
      '[transition-timing-function:var(--md-sys-motion-spring-effects-fast-easing),var(--md-sys-motion-spring-spatial-fast-easing)]',
      'origin-top-left rtl:origin-top-right starting:scale-90 starting:opacity-0 data-exiting:scale-90 data-exiting:opacity-0',
    ],
    // In the sheet, 8px from the screen's edges in all (4px here + the rows' 4px), as Select's.
    sheetContent: 'flex min-h-0 flex-1 flex-col px-[4px]',
    // The search is the M3 search bar's field (`searchBarStyles`: full corners,
    // `surface-container-high`), 48px (M3's minimum touch target; 56px dominates 44px rows),
    // inset by the menu panel's 4px padding like the list below.
    searchRow: 'flex h-[56px] shrink-0 p-[4px]',
    // The shared option list (Select and Autocomplete's), inside the picker's own panel.
    list: 'min-h-0 flex-1 px-[4px] pb-[8px]',
  },
  variants: {
    variant: {
      outlined: {
        country: [
          'rounded-corner-extra-small border border-solid border-outline',
          'data-hovered:border-on-surface',
          'data-focused:border-primary data-focused:shadow-[inset_0_0_0_1px_var(--md-sys-color-primary)]',
          'data-open:border-primary data-open:shadow-[inset_0_0_0_1px_var(--md-sys-color-primary)]',
          'data-invalid:border-error data-invalid:data-focused:shadow-[inset_0_0_0_1px_var(--md-sys-color-error)]',
          'data-disabled:border-on-surface/12',
        ],
      },
      filled: {
        country: [
          'rounded-t-corner-extra-small border-0 border-b border-solid border-on-surface-variant bg-surface-container-highest',
          'data-hovered:border-on-surface',
          'data-focused:border-primary data-focused:shadow-[inset_0_-1px_0_0_var(--md-sys-color-primary)]',
          'data-open:border-primary data-open:shadow-[inset_0_-1px_0_0_var(--md-sys-color-primary)]',
          'data-invalid:border-error',
          'data-disabled:border-on-surface/38 data-disabled:bg-on-surface/4',
        ],
      },
    },
  },
  defaultVariants: { variant: 'outlined' },
});

export type PhoneFieldStyleProps = VariantProps<typeof phoneFieldStyles>;
export type PhoneFieldVariant = NonNullable<PhoneFieldStyleProps['variant']>;

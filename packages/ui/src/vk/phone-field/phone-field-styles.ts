import { tv, type VariantProps } from '../../utils/tv';

/*
 * PhoneField (`@vkieu/mui/vk`, not an M3 component; docs/plans/phone-field.md). The number
 * is the library's TextField; the country field beside it uses the same text field tokens
 * (56px, outline or filled container, `on-surface`, 2px `primary` when focused, `error`
 * when invalid, 38% / 12% when disabled). The picker's list is the library's M3 menu: its
 * panel colour (`surface-container-low`) and elevation, and its item styles from
 * `menuStyles` (44px items, `tertiary-container` for the chosen country, state layers and
 * the inset focus ring), so the two can't drift apart.
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
    sheetContent: 'flex min-h-0 flex-1 flex-col',
    searchRow: 'flex shrink-0 items-center gap-[8px] px-[12px] pt-[12px] pb-[8px]',
    search: [
      'h-[48px] w-full rounded-corner-full bg-surface-container-highest ps-[44px] pe-[16px]',
      'text-body-large text-on-surface placeholder:text-on-surface-variant outline-none',
      'focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-primary',
    ],
    searchIcon: 'pointer-events-none absolute ms-[12px] size-[24px] text-on-surface-variant',
    list: 'min-h-0 flex-1 overflow-y-auto px-[4px] pb-[8px] outline-none',
    heading: 'px-[12px] pt-[8px] pb-[4px] text-label-medium text-on-surface-variant',
    divider: 'mx-[12px] my-[4px] h-px bg-outline-variant',
    // The dialling code beside each country name, in the menu's trailing slot.
    optionDial: 'tabular-nums [direction:ltr]',
    empty: 'px-[16px] py-[16px] text-body-medium text-on-surface-variant',
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

import { tv, type VariantProps } from '../../utils/tv';

/*
 * Values follow Compose Material 3 (AlertDialog.kt and DialogTokens): 280–560px wide,
 * 24px padding, 28px corners, surface-container-high at elevation 3, a 24px secondary
 * icon and the title 16px apart, the title centred when there is an icon, 24px below the
 * supporting text, 8px between actions, and stacked actions with the confirming action on
 * top. The scrim is `scrim` at 32% (M3). Compose has no dialog motion of its own (the
 * platform animates windows); here the scrim fades and the panel fades and scales from
 * 90% on the default springs entering and the fast springs leaving, on a library-owned
 * wrapper that returns to `scale: none`. Every class is written out in full.
 */

/** Variant definitions for {@link Dialog} and its parts. */
export const dialogStyles = tv({
  slots: {
    scrim: [
      'fixed inset-0 z-(--md-sys-z-scrim) bg-scrim/32 opacity-100',
      '[transition-property:opacity]',
      '[transition-duration:var(--md-sys-motion-spring-effects-default-duration)]',
      '[transition-timing-function:var(--md-sys-motion-spring-effects-default-easing)]',
      'starting:opacity-0',
      'data-exiting:opacity-0',
      'data-exiting:[transition-duration:var(--md-sys-motion-spring-effects-fast-duration)]',
      'data-exiting:[transition-timing-function:var(--md-sys-motion-spring-effects-fast-easing)]',
    ],
    positioner: 'fixed inset-0 z-(--md-sys-z-dialog) flex items-center justify-center p-[24px]',
    motion: [
      'flex max-h-full max-w-full scale-none opacity-100',
      '[transition-property:opacity,scale]',
      '[transition-duration:var(--md-sys-motion-spring-effects-default-duration),var(--md-sys-motion-spring-spatial-default-duration)]',
      '[transition-timing-function:var(--md-sys-motion-spring-effects-default-easing),var(--md-sys-motion-spring-spatial-default-easing)]',
      'starting:scale-90 starting:opacity-0',
      'data-exiting:scale-95 data-exiting:opacity-0',
      'data-exiting:[transition-duration:var(--md-sys-motion-spring-effects-fast-duration),var(--md-sys-motion-spring-spatial-fast-duration)]',
      'data-exiting:[transition-timing-function:var(--md-sys-motion-spring-effects-fast-easing),var(--md-sys-motion-spring-spatial-fast-easing)]',
    ],
    panel: [
      'flex max-h-full min-w-[min(280px,100%)] max-w-[560px] flex-col p-[24px]',
      'rounded-corner-extra-large bg-surface-container-high text-on-surface shadow-elevation-3',
      'outline-none',
    ],
    icon: 'mx-auto inline-flex pb-[16px] text-secondary [&>svg]:size-[24px]',
    title: 'pb-[16px] text-headline-small font-brand text-on-surface',
    content: 'min-h-0 flex-1 overflow-y-auto pb-[24px] text-body-medium text-on-surface-variant',
    actions: 'flex flex-wrap-reverse items-center justify-end gap-[8px]',
  },
  variants: {
    hasIcon: {
      true: { title: 'text-center' },
      false: { title: 'text-start' },
    },
  },
  defaultVariants: { hasIcon: false },
});

export type DialogStyleProps = VariantProps<typeof dialogStyles>;

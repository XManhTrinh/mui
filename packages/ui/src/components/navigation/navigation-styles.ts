import { tv, type VariantProps } from '../../utils/tv';

/*
 * Values follow Compose Material 3 (WideNavigationRail.kt, ShortNavigationBar.kt and the
 * NavigationRail* / NavigationBar* token files).
 *
 * Rail: `surface`, 96px collapsed; expanded it is as wide as its widest item plus the 20px
 * insets, 220–360px, and the width springs on the default spatial spring. Content starts
 * 44px down; a header sits 40px above the items, which are 4px apart collapsed and flush
 * expanded. The modal expanded rail is `surface-container` at level 2 with 16px end
 * corners over a 32% scrim; it grows from the collapsed width (or slides in when the
 * collapsed rail is hidden) on the fast spatial spring.
 *
 * Bar: `surface-container`, 64px, no elevation. Items share the width equally, or, when
 * centred, sit within side padding of (100% − 10% × (items + 3)) / 2 (up to 6 items).
 *
 * The rail's width is the `--m3-rail-width` variable, so a consumer `w-*` class still wins.
 * Every class is written out in full so Tailwind can find it.
 */

const widthMotion = [
  '[transition-property:width]',
  '[transition-duration:var(--md-sys-motion-spring-spatial-default-duration)]',
  '[transition-timing-function:var(--md-sys-motion-spring-spatial-default-easing)]',
];

/** Variant definitions for {@link NavigationRail}; extend them to add variants. */
export const navigationRailStyles = tv({
  slots: {
    root: ['flex w-(--m3-rail-width) shrink-0 flex-col bg-surface text-on-surface', ...widthMotion],
    // Library-owned wrapper: clips labels while the width animates.
    body: 'flex min-h-0 flex-1 flex-col overflow-x-clip overflow-y-auto pt-[44px]',
    header: 'flex flex-col pb-[40px]',
    items: 'flex flex-col',
    scrim: [
      'fixed inset-0 z-(--md-sys-z-scrim) bg-scrim/32 opacity-100',
      '[transition-property:opacity]',
      '[transition-duration:var(--md-sys-motion-spring-effects-default-duration)]',
      '[transition-timing-function:var(--md-sys-motion-spring-effects-default-easing)]',
      'starting:opacity-0 data-exiting:opacity-0',
      'data-exiting:[transition-duration:var(--md-sys-motion-spring-effects-fast-duration)]',
    ],
    sheet: [
      'fixed inset-y-0 start-0 z-(--md-sys-z-sheet) flex w-(--m3-rail-width) flex-col overflow-x-clip overflow-y-auto pt-[44px]',
      'rounded-e-corner-large bg-surface-container text-on-surface shadow-elevation-2 outline-none',
      '[transition-property:width,translate]',
      '[transition-duration:var(--md-sys-motion-spring-spatial-fast-duration)]',
      '[transition-timing-function:var(--md-sys-motion-spring-spatial-fast-easing)]',
    ],
  },
  variants: {
    expanded: {
      true: { header: 'items-start ps-[20px]', items: 'gap-0' },
      false: { header: 'items-center', items: 'gap-[4px]' },
    },
    /** Modal sheet entry: from the collapsed width, or sliding in from the start edge. */
    sheetEntry: {
      grow: { sheet: 'starting:w-[96px] data-exiting:w-[96px]' },
      slide: {
        sheet:
          'starting:-translate-x-full data-exiting:-translate-x-full rtl:starting:translate-x-full rtl:data-exiting:translate-x-full',
      },
    },
  },
  defaultVariants: { expanded: false, sheetEntry: 'grow' },
});

/** Variant definitions for {@link NavigationBar}; extend them to add variants. */
export const navigationBarStyles = tv({
  slots: {
    root: 'flex min-h-[64px] w-full bg-surface-container text-on-surface',
    item: 'min-w-0',
  },
  variants: {
    arrangement: {
      equal: { item: 'flex-1 basis-0' },
      centered: { root: 'justify-center', item: 'flex-1 basis-0' },
    },
  },
  defaultVariants: { arrangement: 'equal' },
});

export type NavigationBarStyleProps = VariantProps<typeof navigationBarStyles>;
export type NavigationBarArrangement = NonNullable<NavigationBarStyleProps['arrangement']>;

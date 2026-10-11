import { tv, type VariantProps } from '../../utils/tv';

/*
 * SkipLink is a `vk` component, NOT an M3 component (architecture decision #22; plan in
 * docs/plans/shaped-icon-skip-link-file-trigger.md). Off screen until it takes focus, then
 * fixed at the top start of the window, drawn as a filled button (primary, label large,
 * full corners, 48px tall) with the M3 focus indicator. It slides in on the fast spatial
 * spring, or appears at once under reduced motion. Every class is written out in full.
 */

/** Variant definitions for {@link SkipLink}. */
export const skipLinkStyles = tv({
  slots: {
    root: [
      'fixed start-[16px] top-[8px] z-(--md-sys-z-tooltip)',
      'inline-flex h-[48px] items-center rounded-full px-[24px]',
      'bg-primary text-label-large text-on-primary no-underline focus-ring',
      '-translate-y-[calc(100%+16px)] focus:translate-y-0',
      'motion-safe:transition-transform',
      'motion-safe:duration-(--md-sys-motion-spring-spatial-fast-duration)',
      'motion-safe:ease-(--md-sys-motion-spring-spatial-fast-easing)',
      'forced-colors:border forced-colors:border-solid forced-colors:border-[LinkText]',
    ],
  },
});

export type SkipLinkStyleProps = VariantProps<typeof skipLinkStyles>;

import { tv, type VariantProps } from '../../utils/tv';

/*
 * ListDetailLayout is a `vk` component, NOT an M3 component (architecture decision #22; plan
 * in docs/plans/list-detail-layout.md). It arranges M3's list-detail canonical layout from the
 * window size classes: one pane below `expanded` (840px), chosen by `active`, and two from
 * there, a fixed list pane (360px, 412px from `large`) beside a flexible detail pane, with
 * M3's 24px spacer. On expanded windows the list is sticky below `--vk-list-detail-sticky-top`
 * and scrolls on its own. In single-pane mode the incoming pane enters with M3's shared axis X
 * transition (opacity and a 30px slide on the spatial spring, through `@starting-style`), but
 * only once the frame has painted (`data-animate`), so a page load never animates, and never
 * under reduced motion. Every class is written out in full so Tailwind finds it.
 */

// Only with motion allowed (`motion-safe:`), so no breakpoint rule can outrank reduced motion.
const sharedAxis = [
  'motion-safe:max-expanded:transition-[opacity,translate]',
  'motion-safe:max-expanded:duration-(--md-sys-motion-spring-spatial-default-duration)',
  'motion-safe:max-expanded:ease-(--md-sys-motion-spring-spatial-default-easing)',
  'group-data-[animate]/list-detail:max-expanded:starting:opacity-0',
];

/** Variant definitions for {@link ListDetailLayout}; extend them to add variants. */
export const listDetailLayoutStyles = tv({
  slots: {
    root: 'group/list-detail flex w-full items-start expanded:gap-6',
    list: [
      'w-full min-w-0 outline-none',
      'expanded:sticky expanded:top-(--vk-list-detail-sticky-top,0px) expanded:shrink-0',
      'expanded:w-(--vk-list-detail-list-width,360px) large:w-(--vk-list-detail-list-width,412px)',
      'expanded:max-h-[calc(100dvh-var(--vk-list-detail-sticky-top,0px))] expanded:overflow-y-auto',
      ...sharedAxis,
      // Back to the list: it enters from the start edge.
      'group-data-[animate]/list-detail:max-expanded:starting:-translate-x-[30px]',
      'rtl:group-data-[animate]/list-detail:max-expanded:starting:translate-x-[30px]',
    ],
    detail: [
      'w-full min-w-0 flex-1 outline-none',
      ...sharedAxis,
      // Forward into the detail: it enters from the end edge.
      'group-data-[animate]/list-detail:max-expanded:starting:translate-x-[30px]',
      'rtl:group-data-[animate]/list-detail:max-expanded:starting:-translate-x-[30px]',
    ],
    back: 'flex items-center expanded:hidden',
  },
  variants: {
    active: {
      list: { detail: 'max-expanded:hidden' },
      detail: { list: 'max-expanded:hidden' },
    },
    variant: {
      plain: {},
      filled: {
        list: [
          'rounded-corner-large bg-surface-container-low',
          'forced-colors:border forced-colors:border-[CanvasText]',
        ],
        detail: [
          'rounded-corner-large bg-surface-container-low',
          'forced-colors:border forced-colors:border-[CanvasText]',
        ],
      },
    },
  },
  defaultVariants: { active: 'list', variant: 'plain' },
});

export type ListDetailLayoutStyleProps = VariantProps<typeof listDetailLayoutStyles>;
export type ListDetailLayoutActive = NonNullable<ListDetailLayoutStyleProps['active']>;
export type ListDetailLayoutVariant = NonNullable<ListDetailLayoutStyleProps['variant']>;

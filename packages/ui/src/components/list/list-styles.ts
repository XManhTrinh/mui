import { tv, type VariantProps } from '../../utils/tv';

/*
 * Values follow Compose Material 3's Expressive list items (ListItem.kt's interactive
 * overloads, SegmentedListItem, ListItemDefaults, ListTokens).
 *
 * Item: 16px start / end and 10px top / bottom padding, 12px between leading content, the
 * text and trailing content. At least 56px tall with one line, 72px with two (overline or
 * supporting text) and 88px with three (both), where content aligns to the top. Headline
 * `body-large` `on-surface`; supporting text `body-medium`, overline `label-small`, leading
 * and trailing content `on-surface-variant` (trailing text `label-small`). Selected items
 * are `secondary-container` with `on-secondary-container` content; disabled content is
 * `on-surface` 38%.
 *
 * Shape (interactive items): 4px at rest, 12px hovered, 16px focused, selected or pressed,
 * morphing on the fast spatial spring; colours change on the default effects spring.
 * Segmented lists put 2px between items and round the outer corners of the first and last
 * items to 16px at rest. Static items in a standard list have no corners.
 *
 * Every class is written out in full so Tailwind can find it.
 */

/** Variant definitions for {@link List}; extend them to add variants. */
export const listStyles = tv({
  slots: {
    root: 'm-0 flex list-none flex-col p-0 outline-none',
    item: [
      'group/list-item flex ps-[16px] pe-[16px] pt-[10px] pb-[10px] text-start outline-none',
      'data-selected:bg-secondary-container',
      '[--m3-transition-property:border-radius,background-color,color]',
      '[--m3-transition-duration:var(--md-sys-motion-spring-spatial-fast-duration),var(--md-sys-motion-spring-effects-default-duration),var(--md-sys-motion-spring-effects-default-duration)]',
      '[--m3-transition-easing:var(--md-sys-motion-spring-spatial-fast-easing),var(--md-sys-motion-spring-effects-default-easing),var(--md-sys-motion-spring-effects-default-easing)]',
      '[--m3-transition-delay:0s,0s,0s]',
    ],
    // The item's content grid (the grid cell of an interactive item).
    cell: 'grid w-full grid-cols-[auto_minmax(0,1fr)_auto] gap-x-[12px]',
    leading: [
      'col-start-1 flex items-center gap-x-[12px] text-title-medium text-on-surface-variant [&>svg]:size-[24px]',
      'group-data-selected/list-item:text-on-secondary-container',
      'group-data-disabled/list-item:text-on-surface/38',
    ],
    text: 'col-start-2 flex min-w-0 flex-col',
    overline: [
      'text-label-small text-on-surface-variant',
      'group-data-selected/list-item:text-on-secondary-container',
      'group-data-disabled/list-item:text-on-surface/38',
    ],
    headline: [
      'text-body-large text-on-surface',
      'group-data-selected/list-item:text-on-secondary-container',
      'group-data-disabled/list-item:text-on-surface/38',
    ],
    supporting: [
      'text-body-medium text-on-surface-variant',
      'group-data-selected/list-item:text-on-secondary-container',
      'group-data-disabled/list-item:text-on-surface/38',
    ],
    trailing: [
      'col-start-3 flex items-center gap-x-[12px] text-label-small text-on-surface-variant [&>svg]:size-[24px]',
      'group-data-selected/list-item:text-on-secondary-container',
      'group-data-disabled/list-item:text-on-surface/38',
    ],
    // The drawn checkbox, radio button or switch of an item that is one. Decorative: the
    // item is the control, so the drawing only follows its state attributes.
    control: 'group/control inline-flex shrink-0 items-center justify-center',
  },
  variants: {
    variant: {
      // Standard items take their container's colour (a sheet, a card); see the doc note.
      standard: { item: 'bg-transparent' },
      segmented: { root: 'gap-[2px]', item: 'bg-surface' },
    },
    interactive: {
      true: {
        item: [
          'cursor-pointer state-layer focus-ring-inset select-none',
          'data-disabled:cursor-default',
          // One shape state at a time (see `data-shape`), so no two rules compete.
          'data-[shape=rest]:rounded-corner-extra-small',
          'data-[shape=hovered]:rounded-corner-medium',
          'data-[shape=active]:rounded-corner-large',
        ],
      },
      false: {},
    },
    lines: {
      1: { item: 'min-h-[56px] items-center', cell: 'items-center' },
      2: { item: 'min-h-[72px] items-center', cell: 'items-center' },
      3: { item: 'min-h-[88px] items-start', cell: 'items-start' },
    },
    // Overrides the alignment that follows from the line count.
    align: {
      center: { item: 'items-center', cell: 'items-center' },
      top: { item: 'items-start', cell: 'items-start' },
    },
  },
  compoundVariants: [
    // Segmented lists round the outer corners of the group at rest (static items too).
    {
      variant: 'segmented',
      class: {
        item: [
          'data-[shape=rest]:rounded-corner-extra-small',
          'data-[shape=rest]:data-[position=first]:rounded-t-corner-large',
          'data-[shape=rest]:data-[position=last]:rounded-b-corner-large',
          'data-[shape=rest]:data-[position=only]:rounded-corner-large',
        ],
      },
    },
  ],
  defaultVariants: { variant: 'standard', interactive: false, lines: 1 },
});

export type ListStyleProps = VariantProps<typeof listStyles>;
export type ListVariant = NonNullable<ListStyleProps['variant']>;

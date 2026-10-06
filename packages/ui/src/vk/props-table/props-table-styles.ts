import { tv } from '../../utils/tv';

/*
 * PropsTable is a docs-support `vk` component, NOT an M3 component (architecture decision
 * #22), and deliberately not a general DataTable. It is a focusable, horizontally
 * scrollable region wrapping a real table, styled only with semantic tokens so it follows
 * every theme, mode and contrast level. Every class is written out in full for Tailwind.
 */

/** Variant definitions for {@link PropsTable}. */
export const propsTableStyles = tv({
  slots: {
    scroll: [
      'w-full overflow-x-auto rounded-corner-medium border border-outline-variant bg-surface',
      'outline-none',
      'focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-secondary focus-visible:outline-solid',
    ],
    table: 'w-full min-w-[32rem] border-collapse text-start text-body-medium text-on-surface',
    caption: 'sr-only',
    thead: 'border-b border-outline-variant',
    row: 'border-b border-outline-variant align-top last:border-b-0',
    th: 'px-4 py-3 text-start text-title-small text-on-surface',
    nameCell: 'px-4 py-3 text-start align-top',
    td: 'px-4 py-3 align-top text-body-medium text-on-surface-variant',
    nameText: 'inline-flex items-center gap-1',
    code: 'rounded-corner-extra-small bg-surface-container px-1.5 py-0.5 font-mono text-body-small text-on-surface',
    required: 'text-error',
    description: 'text-body-medium text-on-surface-variant',
  },
});

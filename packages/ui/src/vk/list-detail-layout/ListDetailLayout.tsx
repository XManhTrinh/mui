import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';
import { ListDetailFrame } from './ListDetailFrame';
import {
  listDetailLayoutStyles,
  type ListDetailLayoutActive,
  type ListDetailLayoutVariant,
} from './list-detail-layout-styles';

export interface ListDetailLayoutClassNames {
  root?: string;
  list?: string;
  detail?: string;
  back?: string;
}

export interface ListDetailLayoutProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The list pane's content, usually a `List` of `href` items with the open one selected. */
  list: ReactNode;
  /** The detail pane's content: the open item. */
  detail: ReactNode;
  /**
   * The pane to show when only one fits (below 840px): `"list"` on the list's route,
   * `"detail"` on an item's route. From 840px both panes show.
   */
  active: ListDetailLayoutActive;
  /** The list pane's accessible name, for example "Settings". */
  listLabel: string;
  /** The detail pane's accessible name, for example the open section's title. */
  detailLabel: string;
  /** `nav` when the list navigates between pages (settings); `section` otherwise (an inbox). @default "nav" */
  listAs?: 'nav' | 'section';
  /**
   * Shown at the top of the detail pane in single-pane mode only, to return to the list:
   * usually an `IconButton` link with a translated label.
   */
  back?: ReactNode;
  /**
   * Identifies the open item, usually the pathname. When it changes in single-pane mode, focus
   * moves to the pane that's now showing. Render the layout in a shared route layout so it
   * persists between items.
   */
  detailKey?: string;
  /** `plain`: panes on the page's surface. `filled`: each pane is a container. @default "plain" */
  variant?: ListDetailLayoutVariant;
  /** The list pane's width on expanded windows (a CSS length). @default 360px, 412px from 1200px */
  listWidth?: string;
  /** Where the sticky list pane stops below a sticky top app bar (a CSS length). @default "0px" */
  stickyTop?: string;
  classNames?: ListDetailLayoutClassNames;
  ref?: Ref<HTMLDivElement>;
}

/**
 * M3's list-detail canonical layout: one pane at a time below 840px (the list, or the open
 * item with a way back) and the list beside the open item from 840px. **Not an M3
 * component** (a `vk` component, see docs/plans/list-detail-layout.md): M3 defines the layout
 * but no component, so this builds it from the window size classes, M3's pane widths and
 * spacer, colour roles, the shape scale and the shared axis transition. URL-driven: the page
 * passes `active` from its route, and the panes switch with CSS, so the server renders the
 * right layout at every width. The panes render on the server; only the root is a client
 * component, for focus and the transition.
 *
 * @example
 * <ListDetailLayout
 *   active="detail"
 *   detailKey={pathname}
 *   listLabel="Settings"
 *   detailLabel="Profile"
 *   back={<IconButton href="/settings" aria-label="Back" icon={<ArrowBackIcon />} />}
 *   list={<List aria-label="Settings" selectedKeys={['profile']}>{items}</List>}
 *   detail={<ProfileSettings />}
 * />
 */
export function ListDetailLayout({
  list,
  detail,
  active,
  listLabel,
  detailLabel,
  listAs: ListPane = 'nav',
  back,
  detailKey,
  variant = 'plain',
  listWidth,
  stickyTop,
  className,
  classNames,
  style,
  ref,
  ...rest
}: ListDetailLayoutProps) {
  const styles = listDetailLayoutStyles({ active, variant });
  const rootStyle = {
    ...(listWidth && { '--vk-list-detail-list-width': listWidth }),
    ...(stickyTop && { '--vk-list-detail-sticky-top': stickyTop }),
    ...style,
  } as CSSProperties;

  return (
    <ListDetailFrame
      {...rest}
      ref={ref}
      active={active}
      focusKey={detailKey}
      data-active={active}
      data-variant={variant}
      className={styles.root({ class: [classNames?.root, className] })}
      style={rootStyle}
    >
      <ListPane
        aria-label={listLabel}
        data-pane="list"
        tabIndex={-1}
        className={styles.list({ class: classNames?.list })}
      >
        {list}
      </ListPane>
      <section
        aria-label={detailLabel}
        data-pane="detail"
        tabIndex={-1}
        className={styles.detail({ class: classNames?.detail })}
      >
        {back != null && <div className={styles.back({ class: classNames?.back })}>{back}</div>}
        {detail}
      </section>
    </ListDetailFrame>
  );
}

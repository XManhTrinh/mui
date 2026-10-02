'use client';

import {
  Children,
  isValidElement,
  useRef,
  type CSSProperties,
  type JSX,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import {
  mergeProps,
  useGridList,
  useGridListItem,
  useHover,
  useObjectRef,
  type AriaGridListProps,
  type Key,
} from 'react-aria';
import { Item, useListState, type ListState, type Node } from 'react-stately';
import { DomDirectionLocale } from '../../primitives/DomDirectionLocale';
import { useM3Interaction } from '../../primitives/use-m3-interaction';
import { cn } from '../../utils/cn';
import { splitDataAttributes } from '../../utils/split-data-attributes';
import { listStyles, type ListVariant } from './list-styles';

/** Props of a {@link ListItem}; the React `key` identifies it for `onAction` and selection. */
export interface ListItemProps {
  /** The headline. */
  children: ReactNode;
  /** A short line above the headline. */
  overline?: ReactNode;
  /** One or two lines below the headline. */
  supportingText?: ReactNode;
  /** Leading content: an icon, avatar, image or selection control. */
  leading?: ReactNode;
  /** Trailing content: an icon, short text or a control (in an interactive list it gets focus with ← / →). */
  trailing?: ReactNode;
  /** Makes the item a link (interactive lists). */
  href?: string;
  /** Plain-text version of the headline, for type-ahead and announcements. */
  textValue?: string;
  'aria-label'?: string;
  className?: string;
}

/**
 * An item of a {@link List}. It is React Stately's collection `Item`, so the list reads its
 * props; identify it with a React `key`.
 */
export const ListItem = Item as unknown as (props: ListItemProps) => JSX.Element;

export interface ListClassNames {
  root?: string;
  item?: string;
  leading?: string;
  text?: string;
  overline?: string;
  headline?: string;
  supporting?: string;
  trailing?: string;
}

type Naming = { 'aria-label': string } | { 'aria-labelledby': string };

interface ListOwnProps {
  /** Flush items, or separate items 2px apart with rounded group corners. @default "standard" */
  variant?: ListVariant;
  /** `ListItem` elements. */
  children: ReactElement<ListItemProps> | ReactElement<ListItemProps>[];
  /** Called when an item is pressed or Enter is pressed on it. Makes the list interactive. */
  onAction?: (key: Key) => void;
  /** @default "none" */
  selectionMode?: 'none' | 'single' | 'multiple';
  selectedKeys?: 'all' | Iterable<Key>;
  defaultSelectedKeys?: 'all' | Iterable<Key>;
  onSelectionChange?: (keys: Set<Key> | 'all') => void;
  disallowEmptySelection?: boolean;
  disabledKeys?: Iterable<Key>;
  ref?: Ref<HTMLElement>;
  className?: string;
  style?: CSSProperties;
  classNames?: ListClassNames;
  /** `data-*` attributes go to the root. */
  [data: `data-${string}`]: string | number | boolean | undefined;
}

export type ListProps = ListOwnProps & Naming;

/**
 * M3 Expressive list: items with a headline, optional overline and supporting text, and
 * leading and trailing content, flush (standard) or segmented into rounded groups.
 *
 * With `onAction`, links or selection it is an interactive grid list: items get state
 * layers and morph their corners on hover, focus, press and selection; ↑ / ↓ move between
 * items and ← / → into their trailing controls. Otherwise it is a plain `ul`.
 *
 * @example
 * <List variant="segmented" aria-label="Settings" onAction={open}>
 *   <ListItem key="wifi" leading={<WifiIcon />} supportingText="Connected">Wi‑Fi</ListItem>
 *   <ListItem key="bluetooth" leading={<BluetoothIcon />}>Bluetooth</ListItem>
 * </List>
 */
export function List(props: ListProps) {
  const items = Children.toArray(props.children).filter(isValidElement<ListItemProps>);
  const interactive =
    props.onAction != null ||
    (props.selectionMode != null && props.selectionMode !== 'none') ||
    items.some((item) => item.props.href != null);
  return interactive ? <InteractiveList {...props} /> : <StaticList {...props} items={items} />;
}

function itemLines(item: ListItemProps): 1 | 2 | 3 {
  const extra = Number(item.overline != null) + Number(item.supportingText != null);
  return extra === 2 ? 3 : extra === 1 ? 2 : 1;
}

function position(index: number, count: number) {
  if (count === 1) return 'only';
  if (index === 0) return 'first';
  return index === count - 1 ? 'last' : 'middle';
}

function ItemContent({
  item,
  styles,
  classNames,
  describedById,
}: {
  item: ListItemProps;
  styles: ReturnType<typeof listStyles>;
  classNames?: ListClassNames;
  describedById?: string;
}) {
  return (
    <>
      {item.leading != null && (
        <span className={styles.leading({ class: classNames?.leading })}>{item.leading}</span>
      )}
      <span className={styles.text({ class: classNames?.text })}>
        {item.overline != null && (
          <span className={styles.overline({ class: classNames?.overline })}>{item.overline}</span>
        )}
        <span className={styles.headline({ class: classNames?.headline })}>{item.children}</span>
        {item.supportingText != null && (
          <span id={describedById} className={styles.supporting({ class: classNames?.supporting })}>
            {item.supportingText}
          </span>
        )}
      </span>
      {item.trailing != null && (
        <span className={styles.trailing({ class: classNames?.trailing })}>{item.trailing}</span>
      )}
    </>
  );
}

function StaticList({
  variant,
  classNames,
  className,
  style,
  ref,
  items,
  ...rest
}: ListProps & { items: ReactElement<ListItemProps>[] }) {
  const { data } = splitDataAttributes(rest);
  const { 'aria-label': label, 'aria-labelledby': labelledBy } = rest as {
    'aria-label'?: string;
    'aria-labelledby'?: string;
  };
  const root = listStyles({ variant }).root({ class: cn(classNames?.root, className) });
  return (
    <ul
      {...data}
      ref={ref as Ref<HTMLUListElement>}
      style={style}
      aria-label={label}
      aria-labelledby={labelledBy}
      className={root}
    >
      {items.map((item, index) => {
        const lines = itemLines(item.props);
        const styles = listStyles({ variant, lines });
        return (
          <li
            key={item.key}
            data-shape="rest"
            data-position={position(index, items.length)}
            className={styles.item({ class: cn(classNames?.item, item.props.className) })}
          >
            <span className={styles.cell()}>
              <ItemContent item={item.props} styles={styles} classNames={classNames} />
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function InteractiveList(props: ListProps) {
  return (
    <DomDirectionLocale>
      {(directionRef) => <GridList {...props} directionRef={directionRef} />}
    </DomDirectionLocale>
  );
}

function GridList({
  variant,
  classNames,
  className,
  style,
  ref,
  directionRef,
  ...rest
}: ListProps & { directionRef: (element: HTMLElement | null) => void }) {
  const { data, rest: ariaProps } = splitDataAttributes(rest);
  const gridProps_ = ariaProps as unknown as AriaGridListProps<object>;
  const state = useListState(gridProps_);
  const rootRef = useObjectRef(ref as Ref<HTMLDivElement>);
  const { gridProps } = useGridList(gridProps_, state, rootRef);
  const nodes = [...state.collection];
  return (
    <div
      {...mergeProps(data, gridProps)}
      ref={(element) => {
        rootRef.current = element;
        directionRef(element);
      }}
      style={style}
      className={listStyles({ variant }).root({ class: cn(classNames?.root, className) })}
    >
      {nodes.map((node, index) => (
        <GridListRow
          key={node.key}
          node={node}
          state={state}
          variant={variant}
          classNames={classNames}
          position={position(index, nodes.length)}
        />
      ))}
    </div>
  );
}

function GridListRow({
  node,
  state,
  variant,
  classNames,
  position: itemPosition,
}: {
  node: Node<object>;
  state: ListState<object>;
  variant?: ListVariant;
  classNames?: ListClassNames;
  position: string;
}) {
  const item = node.props as ListItemProps;
  const ref = useRef<HTMLDivElement>(null);
  const { rowProps, gridCellProps, descriptionProps, isPressed, isSelected, isDisabled } =
    useGridListItem({ node }, state, ref);
  const { hoverProps, isHovered } = useHover({ isDisabled });
  const { interactionProps, dataAttributes } = useM3Interaction({ isDisabled, isPressed }, ref);
  const isFocusVisible = dataAttributes['data-focus-visible'] != null;
  // Compose's shape precedence: pressed, then selected or focused (16px), then hovered (12px).
  const shape =
    isPressed || isSelected || isFocusVisible ? 'active' : isHovered ? 'hovered' : 'rest';
  const styles = listStyles({ variant, interactive: true, lines: itemLines(item) });
  return (
    <div
      {...mergeProps(rowProps, hoverProps, interactionProps)}
      {...dataAttributes}
      ref={ref}
      data-selected={isSelected || undefined}
      data-shape={shape}
      data-position={itemPosition}
      className={styles.item({ class: cn(classNames?.item, item.className) })}
    >
      <div {...gridCellProps} className={styles.cell()}>
        <ItemContent
          item={item}
          styles={styles}
          classNames={classNames}
          describedById={descriptionProps.id}
        />
      </div>
    </div>
  );
}

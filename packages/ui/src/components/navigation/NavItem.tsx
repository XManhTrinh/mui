'use client';

import type { ReactElement, ReactNode } from 'react';
import {
  ButtonBase,
  type ButtonBaseActionProps,
  type ButtonBaseLinkProps,
} from '../../primitives/ButtonBase';
import { cn } from '../../utils/cn';
import { navItemStyles, type NavItemLayout } from './nav-item-styles';

export interface NavItemClassNames {
  root?: string;
  pill?: string;
  indicator?: string;
  icon?: string;
  label?: string;
}

export interface NavItemOwnProps {
  /** The icon. Hidden from assistive tech; the label names the item. */
  icon: ReactElement;
  /** Icon shown while selected, e.g. a filled variant. */
  selectedIcon?: ReactElement;
  /** The label. */
  children: ReactNode;
  /** Marks the current destination (`aria-current="page"`). */
  selected?: boolean;
  classNames?: NavItemClassNames;
}

type OmitItem<T> = Omit<T, keyof NavItemOwnProps | 'toggle'>;

export type NavItemProps = NavItemOwnProps &
  (OmitItem<ButtonBaseActionProps> | OmitItem<ButtonBaseLinkProps>);

/** Shared navigation item: a link (`href`) or button with the M3 pill indicator. */
export function NavItem({
  layout,
  enterLabel,
  icon,
  selectedIcon,
  children,
  selected,
  classNames,
  className,
  ...base
}: NavItemProps & { layout: NavItemLayout; enterLabel?: boolean }) {
  const styles = navItemStyles({ layout, enterLabel });
  const inline = layout === 'rail-start' || layout === 'bar-start';
  const label = (
    <span data-nav-label="" className={styles.label({ class: classNames?.label })}>
      {children}
    </span>
  );
  return (
    <ButtonBase
      {...(base as ButtonBaseActionProps)}
      aria-current={selected ? 'page' : undefined}
      data-current={selected || undefined}
      className={styles.root({ class: cn(classNames?.root, className) })}
    >
      <span className={styles.pill({ class: classNames?.pill })}>
        <span aria-hidden="true" className={styles.indicator({ class: classNames?.indicator })} />
        <span aria-hidden="true" className={styles.stateLayer()} />
        <span className={styles.content()}>
          <span aria-hidden="true" className={styles.icon({ class: classNames?.icon })}>
            {selected && selectedIcon ? selectedIcon : icon}
          </span>
          {inline && label}
        </span>
      </span>
      {!inline && label}
    </ButtonBase>
  );
}

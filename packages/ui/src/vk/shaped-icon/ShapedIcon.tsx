import type { CSSProperties, ReactNode, Ref } from 'react';
import { materialShapeMask } from '../../shapes/mask';
import type { MaterialShapeName } from '../../shapes/material-shapes';
import { cn } from '../../utils/cn';
import { splitDataAttributes } from '../../utils/split-data-attributes';
import { shapedIconStyles, type ShapedIconSize, type ShapedIconTone } from './shaped-icon-styles';

/** `circle`, or an M3 Expressive shape by name (e.g. `Cookie9Sided`). */
export type ShapedIconShape = 'circle' | MaterialShapeName;

export interface ShapedIconClassNames {
  root?: string;
  icon?: string;
}

export interface ShapedIconProps {
  /** The icon: an SVG, drawn at the size's icon size in the tone's content colour. */
  children: ReactNode;
  /** @default "circle" */
  shape?: ShapedIconShape;
  /** Container / icon: `sm` 40/24px, `md` 56/28px, `lg` 64/32px, `xl` 96/48px. @default "md" */
  size?: ShapedIconSize;
  /** The container's colour roles. @default "secondary" */
  tone?: ShapedIconTone;
  /** A name, when the icon means something on its own (`role="img"`). Otherwise it's decorative. */
  'aria-label'?: string;
  className?: string;
  classNames?: ShapedIconClassNames;
  style?: CSSProperties;
  ref?: Ref<HTMLSpanElement>;
  /** `data-*` attributes go to the root. */
  [data: `data-${string}`]: string | number | boolean | undefined;
}

/**
 * An icon in a circle or an M3 Expressive shape, in a tone's container colours: decorative
 * emphasis for steps, features and empty states. **Not an M3 component** (a `vk` component,
 * see docs/plans/shaped-icon-skip-link-file-trigger.md); `EmptyState` uses it. A server
 * component.
 *
 * @example
 * <ShapedIcon shape="Cookie9Sided" tone="primary" size="lg">
 *   <SearchIcon />
 * </ShapedIcon>
 */
export function ShapedIcon({
  children,
  shape = 'circle',
  size,
  tone,
  'aria-label': label,
  className,
  classNames,
  style,
  ref,
  ...rest
}: ShapedIconProps) {
  const { data } = splitDataAttributes(rest);
  const expressive = shape !== 'circle';
  const styles = shapedIconStyles({ size, tone, shape: expressive ? 'expressive' : 'circle' });
  return (
    <span
      {...data}
      ref={ref}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      data-shape={shape}
      style={expressive ? { maskImage: materialShapeMask(shape), ...style } : style}
      className={styles.root({ class: cn(classNames?.root, className) })}
    >
      <span className={styles.icon({ class: classNames?.icon })}>{children}</span>
    </span>
  );
}

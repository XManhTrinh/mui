import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { skeletonGroupStyles, skeletonStyles } from './skeleton-styles';

/** The M3 type-scale roles a text skeleton can match. */
export type SkeletonTypescale =
  | 'display-large'
  | 'display-medium'
  | 'display-small'
  | 'headline-large'
  | 'headline-medium'
  | 'headline-small'
  | 'title-large'
  | 'title-medium'
  | 'title-small'
  | 'body-large'
  | 'body-medium'
  | 'body-small'
  | 'label-large'
  | 'label-medium'
  | 'label-small';

export type SkeletonAnimation = 'pulse' | 'shimmer' | 'none';

export type SkeletonCorner =
  'none' | 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large' | 'full';

export interface SkeletonClassNames {
  root?: string;
  /** Each line of a multi-line text skeleton. */
  line?: string;
}

interface SkeletonBaseProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Corner from the M3 shape scale. @default "small" (`extra-small` for text, `full` for a circle) */
  corner?: SkeletonCorner;
  /**
   * Fill colour role: `highest` (surface-container-highest) reads on every surface up to
   * `surface-container`; `high` is a subtler fill for `surface` and `surface-container-low`.
   * @default "highest"
   */
  tone?: 'highest' | 'high';
  /** Overrides the animation set by the enclosing {@link SkeletonGroup}. */
  animation?: SkeletonAnimation;
  classNames?: SkeletonClassNames;
}

export interface SkeletonShapeProps extends SkeletonBaseProps {
  /** `rectangle` (default, full width and 96px tall) or `circle` (40px). Size with classes. */
  variant?: 'rectangle' | 'circle';
}

export interface SkeletonTextProps extends SkeletonBaseProps {
  /** Lines of text, as tall as the type-scale role's line height. */
  variant: 'text';
  /** The type-scale role of the text it stands in for. @default "body-medium" */
  typescale?: SkeletonTypescale;
  /** Number of lines; the last of several is 60% wide. @default 1 */
  lines?: number;
}

export type SkeletonProps = SkeletonShapeProps | SkeletonTextProps;

/**
 * A placeholder for content that is loading, in the shape of that content, so the layout
 * doesn't shift when it arrives. **Not an M3 component** (a `vk` component, see
 * docs/plans/skeleton.md): use it when the coming layout is known, and the M3
 * `LoadingIndicator` when it isn't. It is pure CSS and works in server components and in
 * streamed Suspense fallbacks. Placeholders are hidden from assistive technology; name the
 * loading region with {@link SkeletonGroup}.
 *
 * @example
 * <Skeleton variant="text" typescale="title-medium" className="w-3/4" />
 */
export function Skeleton(props: SkeletonProps) {
  // Every variant's props, so text-only props can be read without narrowing.
  const all: SkeletonBaseProps & {
    variant?: SkeletonProps['variant'];
    typescale?: SkeletonTypescale;
    lines?: number;
  } = props;
  const {
    variant = 'rectangle',
    typescale = 'body-medium',
    lines: requestedLines = 1,
    corner,
    tone,
    animation,
    classNames,
    className,
    style,
    ...rest
  } = all;
  const lines = Math.max(1, Math.floor(requestedLines));
  const shape = variant === 'text' ? (lines > 1 ? 'lines' : 'line') : variant;
  const styles = skeletonStyles({
    shape,
    tone,
    corner:
      corner ?? (variant === 'text' ? 'extra-small' : variant === 'circle' ? 'full' : 'small'),
  });
  const textStyle =
    variant === 'text'
      ? ({
          '--vk-skeleton-line-height': `var(--md-sys-typescale-${typescale}-line-height)`,
          '--vk-skeleton-glyph-size': `var(--md-sys-typescale-${typescale}-size)`,
        } as CSSProperties)
      : undefined;

  return (
    <span
      aria-hidden="true"
      data-variant={variant}
      data-animation={animation}
      className={styles.root({ class: cn(classNames?.root, className) })}
      style={{ ...textStyle, ...style }}
      {...rest}
    >
      {shape === 'lines'
        ? Array.from({ length: lines }, (_, index) => (
            <span
              key={index}
              data-animation={animation}
              className={styles.line({ class: classNames?.line })}
            />
          ))
        : null}
    </span>
  );
}

export interface SkeletonGroupClassNames {
  root?: string;
  /** The visually hidden loading label. */
  label?: string;
}

export interface SkeletonGroupProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** What is loading, read once by assistive technology, for example "Loading businesses". */
  label: string;
  /** The animation of every skeleton inside. @default "pulse" */
  animation?: SkeletonAnimation;
  /** The element to render. @default "div" */
  as?: 'div' | 'section' | 'ul' | 'li';
  children?: ReactNode;
  classNames?: SkeletonGroupClassNames;
}

/**
 * A loading region of skeletons. **Not an M3 component** (see {@link Skeleton}). It marks
 * the region busy, gives it one accessible label instead of announcing every placeholder,
 * and sets one animation for every skeleton inside so the region moves together.
 *
 * @example
 * <SkeletonGroup label="Loading businesses" animation="shimmer" className="grid grid-cols-4 gap-4">
 *   <Skeleton className="h-28" corner="medium" />
 * </SkeletonGroup>
 */
export function SkeletonGroup({
  label,
  animation = 'pulse',
  as = 'div',
  children,
  classNames,
  className,
  ...rest
}: SkeletonGroupProps) {
  const Element: ElementType = as;
  const styles = skeletonGroupStyles();
  const labelElement = (
    <span role="status" className={styles.label({ class: classNames?.label })}>
      {label}
    </span>
  );
  return (
    <Element
      aria-busy="true"
      data-skeleton-animation={animation}
      className={styles.root({ class: cn(classNames?.root, className) })}
      {...rest}
    >
      {as === 'ul' ? <li className="sr-only">{labelElement}</li> : labelElement}
      {children}
    </Element>
  );
}

import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';
import { Card } from '../../components/card/Card';
import type { CardVariant } from '../../components/card/card-styles';
import { materialShapeMask } from '../../shapes/mask';
import type { MaterialShapeName } from '../../shapes/material-shapes';
import { emptyStateStyles, type EmptyStateSize, type EmptyStateTone } from './empty-state-styles';

/** `plain` has no container; the others wrap it in a `Card` with the same variant. */
export type EmptyStateVariant = 'plain' | CardVariant;

/** `circle`, or an M3 Expressive shape by name (e.g. `Cookie9Sided`). */
export type EmptyStateShape = 'circle' | MaterialShapeName;

export interface EmptyStateClassNames {
  root?: string;
  media?: string;
  icon?: string;
  title?: string;
  description?: string;
  actions?: string;
}

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The icon, drawn at the size's icon size in the tone's content colour. Decorative. */
  icon: ReactNode;
  /** What's missing, in a few words: "No posts yet", "No results". */
  title: ReactNode;
  /** One line about why, or what will appear here. */
  description?: ReactNode;
  /** Up to two `Button`s: at most one `filled` or `tonal`, then a `text` one. */
  actions?: ReactNode;
  /** `plain` (no container) or a card variant. @default "plain" */
  variant?: EmptyStateVariant;
  /** `sm` in a list or small card, `md` in a section, `lg` for a page area. @default "md" */
  size?: EmptyStateSize;
  /** The icon container's colour roles; `error` for "couldn't load". @default "secondary" */
  tone?: EmptyStateTone;
  /** The icon container's shape. @default "circle" */
  shape?: EmptyStateShape;
  /** The title's element: a heading when the empty state is a section's only content. @default "p" */
  titleAs?: 'p' | 'h2' | 'h3' | 'h4';
  /**
   * Announces the title and description to screen readers (`role="status"`), for an empty
   * state that replaces content after a search or filter. @default false
   */
  announce?: boolean;
  classNames?: EmptyStateClassNames;
  ref?: Ref<HTMLDivElement>;
}

/**
 * A designed state for a region with nothing to show: no posts yet, no results, coming
 * soon, or couldn't load (with `tone="error"` and a retry action). **Not an M3 component**
 * (a `vk` component, see docs/plans/empty-state.md): M3 describes empty states as a pattern,
 * and this builds it from the type scale, container colour roles, the shape scale or an
 * Expressive shape, the effects spring and the public `Card`. A server component.
 *
 * @example
 * <EmptyState
 *   variant="filled"
 *   icon={<DynamicFeedIcon />}
 *   title="No posts yet"
 *   description="When Lan posts, you'll see it here."
 * />
 */
export function EmptyState({
  icon,
  title,
  description,
  actions,
  variant = 'plain',
  size = 'md',
  tone = 'secondary',
  shape = 'circle',
  titleAs: Title = 'p',
  announce = false,
  className,
  classNames,
  ...rest
}: EmptyStateProps) {
  const expressive = shape !== 'circle';
  const styles = emptyStateStyles({ size, tone, shape: expressive ? 'expressive' : 'circle' });
  const mediaStyle: CSSProperties | undefined = expressive
    ? { maskImage: materialShapeMask(shape) }
    : undefined;
  const root = styles.root({ class: [classNames?.root, className] });
  const state = {
    'data-variant': variant,
    'data-size': size,
    'data-tone': tone,
    ...(announce && { role: 'status' }),
  };

  const content = (
    <>
      <span
        aria-hidden="true"
        className={styles.media({ class: classNames?.media })}
        style={mediaStyle}
      >
        <span className={styles.icon({ class: classNames?.icon })}>{icon}</span>
      </span>
      <Title className={styles.title({ class: classNames?.title })}>{title}</Title>
      {description != null && (
        <p className={styles.description({ class: classNames?.description })}>{description}</p>
      )}
      {actions != null && (
        <div className={styles.actions({ class: classNames?.actions })}>{actions}</div>
      )}
    </>
  );

  return variant === 'plain' ? (
    <div {...rest} {...state} className={root}>
      {content}
    </div>
  ) : (
    <Card {...rest} {...state} variant={variant} className={root}>
      {content}
    </Card>
  );
}

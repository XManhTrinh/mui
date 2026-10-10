import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';
import { tagStyles } from './tag-styles';
import type { TagShape, TagSize, TagTone, TagVariant } from './tag-tokens';

export interface TagClassNames {
  root?: string;
  dot?: string;
  icon?: string;
  label?: string;
}

interface TagOwnProps {
  /** The label: one or a few words. */
  children: ReactNode;
  /** `tonal` (a container colour), `filled` (strong) or `outlined` (quietest). @default "tonal" */
  variant?: TagVariant;
  /** The colour roles: M3's, plus the theme's success and warning. @default "neutral" */
  tone?: TagTone;
  /** `sm` 20px, `md` 24px, `lg` 32px (a chip's height). @default "md" */
  size?: TagSize;
  /** `full` (a pill) or `rounded` (the shape scale by size). @default "full" */
  shape?: TagShape;
  /**
   * The full name when the label is short ("M3E" for "Expressive"): screen readers hear it
   * instead of the label, and a pointer shows it.
   */
  fullLabel?: string;
  /** Truncates the label with an ellipsis past this width; the full text goes to `title`. */
  maxWidth?: CSSProperties['maxWidth'];
  className?: string;
  classNames?: TagClassNames;
  ref?: Ref<HTMLSpanElement>;
}

/** A tag shows a status dot or a leading icon, not both. */
type TagDecoration =
  | {
      /** A 6px dot in the tone's strong colour, for live status ("Open now"). */
      dot: true;
      icon?: undefined;
    }
  | {
      dot?: false;
      /** A decorative leading icon, sized by `size`. */
      icon?: ReactNode;
    };

export type TagProps = TagOwnProps &
  TagDecoration &
  Omit<HTMLAttributes<HTMLSpanElement>, keyof TagOwnProps | 'children' | 'role'>;

/**
 * A small, static label: a status or a category of the thing beside it ("Draft", "Sold",
 * "Open now"). **Not an M3 component** (a `vk` component, see docs/plans/tag.md): M3's chips
 * are all interactive and its badge is a count on an icon. Use `AssistChip` or
 * `FilterChip` when it should do something when pressed, and `Badge` for a count. Never
 * focusable and with no role: it reads as plain text. A server component.
 *
 * Every part reads a `--vk-tag-*` variable first (`container`, `content`, `outline`, `dot`,
 * `height`, `padding-inline`, `gap`, `icon-size`, `corner`), set on the tag or an ancestor.
 *
 * @example
 * <Tag>Draft</Tag>
 * <Tag tone="error" variant="filled">Sold</Tag>
 * <Tag tone="success" dot>Open now</Tag>
 * <Tag size="sm" tone="tertiary" fullLabel="Expressive">M3E</Tag>
 */
export function Tag({
  children,
  variant = 'tonal',
  tone = 'neutral',
  size = 'md',
  shape = 'full',
  dot = false,
  icon,
  fullLabel,
  maxWidth,
  className,
  classNames,
  style,
  title,
  ...rest
}: TagProps) {
  const styles = tagStyles({ variant, tone, size, shape });
  const label =
    fullLabel === undefined ? (
      children
    ) : (
      <>
        <span aria-hidden="true">{children}</span>
        <span className="sr-only">{fullLabel}</span>
      </>
    );
  const plainText = typeof children === 'string' ? children : undefined;
  const hoverTitle = title ?? fullLabel ?? (maxWidth === undefined ? undefined : plainText);

  return (
    <span
      {...rest}
      {...(hoverTitle !== undefined && { title: hoverTitle })}
      data-variant={variant}
      data-tone={tone}
      data-size={size}
      data-shape={shape}
      className={styles.root({ class: [classNames?.root, className] })}
      style={maxWidth === undefined ? style : { ...style, maxWidth }}
    >
      {dot ? <span aria-hidden="true" className={styles.dot({ class: classNames?.dot })} /> : null}
      {icon != null ? (
        <span aria-hidden="true" className={styles.icon({ class: classNames?.icon })}>
          {icon}
        </span>
      ) : null}
      <span className={styles.label({ class: classNames?.label })}>{label}</span>
    </span>
  );
}

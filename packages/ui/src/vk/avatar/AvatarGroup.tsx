import {
  Children,
  cloneElement,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cn } from '../../utils/cn';
import { Avatar, type AvatarProps, type AvatarSize } from './Avatar';
import { avatarGroupStyles } from './avatar-styles';

export interface AvatarGroupClassNames {
  root?: string;
  /** Each avatar, including the "+N" one. */
  item?: string;
  /** The "+N" avatar. */
  overflow?: string;
}

interface AvatarGroupOwnProps {
  /** Names the whole group, read once, for example "Lan, Minh and 3 others". */
  label: string;
  /** The avatars. */
  children: ReactNode;
  /** Shows the first `max` avatars and a "+N" avatar for the rest. */
  max?: number;
  /** The size of every avatar in the group. @default "md" */
  size?: AvatarSize;
  /** `overlap` stacks the avatars with a separating ring; `spaced` puts a gap between them. */
  spacing?: 'overlap' | 'spaced';
  /** Names the "+N" avatar when it's a link or button. @default count => `${count} more` */
  overflowLabel?: (count: number) => string;
  classNames?: AvatarGroupClassNames;
  className?: string;
}

type OverflowAction =
  | { overflowHref?: undefined; onOverflowPress?: undefined }
  /** Makes "+N" a link to the full list. */
  | { overflowHref: string; onOverflowPress?: undefined }
  /** Makes "+N" a button, for example to open the full list in a dialog. */
  | { onOverflowPress: () => void; overflowHref?: undefined };

export type AvatarGroupProps = AvatarGroupOwnProps &
  OverflowAction &
  Omit<HTMLAttributes<HTMLDivElement>, keyof AvatarGroupOwnProps | 'role'>;

const isAvatar = (child: ReactNode): child is ReactElement<AvatarProps> =>
  isValidElement(child) && child.type === Avatar;

/**
 * Several avatars as one unit. **Not an M3 component** (see {@link Avatar}). They overlap
 * with a surface-coloured ring (mirrored in right-to-left), `max` shows a "+N" avatar for
 * the rest, and the group is named once by `label`, so static avatars inside become
 * decorative. Linked or pressable avatars keep their own names.
 *
 * @example
 * <AvatarGroup label="Lan, Minh and 3 others" max={3}>
 *   {people.map((p) => <Avatar key={p.id} name={p.name} src={p.photo} decorative />)}
 * </AvatarGroup>
 */
export function AvatarGroup({
  label,
  children,
  max,
  size = 'md',
  spacing = 'overlap',
  overflowLabel = (count) => `${count} more`,
  overflowHref,
  onOverflowPress,
  classNames,
  className,
  ...rest
}: AvatarGroupProps) {
  const styles = avatarGroupStyles({ spacing, size });
  const avatars = Children.toArray(children).filter(isAvatar);
  const shown =
    max !== undefined && avatars.length > max ? avatars.slice(0, Math.max(0, max)) : avatars;
  const hidden = avatars.length - shown.length;
  const item = styles.item({ class: classNames?.item });

  return (
    <div
      role="group"
      aria-label={label}
      className={styles.root({ class: cn(classNames?.root, className) })}
      {...rest}
    >
      {shown.map((avatar) => {
        const interactive = avatar.props.href !== undefined || avatar.props.onPress !== undefined;
        return cloneElement(avatar, {
          size,
          ring: spacing === 'overlap',
          className: cn(item, avatar.props.className),
          ...(!interactive && { decorative: true, alt: undefined }),
        } as Partial<AvatarProps>);
      })}
      {hidden > 0 ? (
        <Avatar
          size={size}
          tone="neutral"
          shape="circle"
          initials={`+${hidden}`}
          ring={spacing === 'overlap'}
          className={cn(item, classNames?.overflow)}
          {...(overflowHref !== undefined
            ? { href: overflowHref, alt: overflowLabel(hidden) }
            : onOverflowPress !== undefined
              ? { onPress: onOverflowPress, alt: overflowLabel(hidden) }
              : { decorative: true })}
        />
      ) : null}
    </div>
  );
}

import type { CSSProperties, HTMLAttributes, ReactElement, ReactNode } from 'react';
import { ButtonBase, type ButtonBaseProps } from '../../primitives/ButtonBase';
import { TouchTarget } from '../../primitives/TouchTarget';
import { materialShapeMask } from '../../shapes/mask';
import { materialShapeNames, type MaterialShapeName } from '../../shapes/material-shapes';
import { cn } from '../../utils/cn';
import { AvatarImage, type AvatarImageElementProps } from './avatar-image';
import { avatarStyles } from './avatar-styles';
import { getInitials } from './get-initials';

/** Material Symbols `person` (filled). */
const PersonIcon = () => (
  <svg viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true">
    <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-240v-32q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v32q0 33-23.5 56.5T720-160H240q-33 0-56.5-23.5T160-240Z" />
  </svg>
);

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarTone = 'auto' | 'primary' | 'secondary' | 'tertiary' | 'neutral';
export type AvatarPresence = 'online' | 'away' | 'offline';
/** A corner of the avatar, in logical directions (start and end mirror in right-to-left). */
export type AvatarPlacement = 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';

/** `circle`, a rounded square, or an M3 Expressive shape by name (e.g. `Cookie12Sided`). */
export type AvatarShape = 'circle' | 'rounded' | MaterialShapeName;

/** Every avatar shape: `circle`, `rounded` and the 35 M3 Expressive shapes. */
export const avatarShapes: readonly AvatarShape[] = ['circle', 'rounded', ...materialShapeNames];

/** Presence words in the accessible name; override them for other languages. */
export interface AvatarLabels {
  online: string;
  away: string;
  offline: string;
}

const DEFAULT_LABELS: AvatarLabels = {
  online: 'online',
  away: 'away',
  offline: 'offline',
};

export interface AvatarClassNames {
  root?: string;
  /** The coloured shape behind the photo and fallback, e.g. `bg-green-600 text-white`. */
  visual?: string;
  image?: string;
  fallback?: string;
  presence?: string;
  badge?: string;
}

interface AvatarOwnProps {
  /** The name the initials and the auto tone come from. */
  name?: string;
  /** The fallback when there is no photo and no initials. @default a person icon */
  icon?: ReactNode;
  src?: string;
  srcSet?: string;
  sizes?: string;
  /** A custom image element (for example `next/image`) in place of `src`. */
  image?: ReactElement<AvatarImageElementProps>;
  /** Overrides the initials taken from `name`. */
  initials?: string;
  /** Locale for the initials' casing. */
  locale?: string;
  /** @default "md" (40px) */
  size?: AvatarSize;
  /** `circle`, `rounded` (a shape-scale corner for the size) or an M3 Expressive shape. @default "circle" */
  shape?: AvatarShape;
  /**
   * `auto` hashes `name` into one of 12 colour slots, so a name keeps its colour. Each slot is
   * a CSS variable pair, `--vk-avatar-tone-1` … `--vk-avatar-tone-12` with
   * `--vk-avatar-on-tone-1` … `--vk-avatar-on-tone-12`, which takes any colour; by default the
   * slots cycle through the primary, secondary, tertiary and neutral containers.
   * @default "auto"
   */
  tone?: AvatarTone;
  /**
   * A presence dot. Its colours default to M3 roles (online `primary`, away `tertiary`,
   * offline an `outline` ring) and can be overridden with the CSS variables
   * `--vk-avatar-online`, `--vk-avatar-away` and `--vk-avatar-offline`, on `:root`, a section
   * or one avatar.
   */
  presence?: AvatarPresence;
  /** Where the presence dot sits. @default "bottom-end" */
  presencePlacement?: AvatarPlacement;
  /** Where the badge sits. @default "top-end" */
  badgePlacement?: AvatarPlacement;
  /** Words for the presence states in the accessible name. */
  labels?: Partial<AvatarLabels>;
  /** Separates the avatar from overlapping neighbours (set by AvatarGroup). */
  ring?: boolean;
  classNames?: AvatarClassNames;
  className?: string;
  style?: CSSProperties;
}

/**
 * A badge: any icon or short content (a check for "verified", a count, …), with its meaning
 * in `badgeLabel` for the accessible name. Its colours default to `primary` / `on-primary`
 * and can be overridden with `--vk-avatar-badge` and `--vk-avatar-on-badge`.
 */
type WithBadge = { badge: ReactNode; badgeLabel: string };
type WithoutBadge = { badge?: undefined; badgeLabel?: undefined };

type Named = { alt: string; decorative?: false };
type Decorative = { decorative: true; alt?: undefined };
type Static = { href?: undefined; onPress?: undefined };
type Link = { href: string; onPress?: undefined };
type Action = { onPress: () => void; href?: undefined };

/**
 * A static avatar is named by `alt` or marked `decorative` (when the name is written next to
 * it). A link or button avatar always needs `alt`.
 */
export type AvatarProps = AvatarOwnProps &
  Omit<HTMLAttributes<HTMLElement>, keyof AvatarOwnProps | 'children' | 'onPress'> &
  (WithBadge | WithoutBadge) &
  ((Static & (Named | Decorative)) | ((Link | Action) & Named));

/** The number of colour slots `tone="auto"` hashes names into. */
export const AVATAR_TONE_SLOTS = 12;

/** A stable slot for a name (FNV-1a hash), so a person keeps their colour everywhere. */
function toneSlotFor(name: string) {
  let hash = 0x811c9dc5;
  for (const char of name.normalize('NFC')) {
    hash ^= char.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 0x01000193);
  }
  return `auto-${((hash >>> 0) % AVATAR_TONE_SLOTS) + 1}` as `auto-${
    1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}`;
}

/**
 * A small picture that stands for an account, with initials or an icon when there is no photo.
 * **Not an M3 component** (a `vk` component, see docs/plans/avatar.md): it fits the avatar
 * slots of M3 components (24px in an input chip, 40px in a list item). The photo is
 * server-rendered over the fallback, so it shows as soon as it loads; colours come from
 * M3 container roles, corners from the shape scale, and any of the 35 M3 Expressive
 * shapes can be used. With `href` or `onPress` it becomes a link or button with a state layer, focus ring
 * and 48px touch target.
 *
 * @example
 * <Avatar name="Nguyễn Văn An" src={user.photo} alt="Nguyễn Văn An" presence="online" />
 * <Avatar name="Phở Sài Gòn" alt="Phở Sài Gòn" badge={<VerifiedIcon />} badgeLabel="verified" />
 */
export function Avatar(props: AvatarProps) {
  const {
    name = '',
    icon,
    src,
    srcSet,
    sizes,
    image,
    initials,
    locale,
    size = 'md',
    shape: resolvedShape = 'circle',
    tone = 'auto',
    presence,
    presencePlacement,
    badge,
    badgeLabel,
    badgePlacement,
    labels,
    ring = false,
    classNames,
    className,
    style,
    alt,
    decorative,
    href,
    onPress,
    ...rest
  } = props;

  const expressive = resolvedShape !== 'circle' && resolvedShape !== 'rounded';
  const resolvedTone = tone === 'auto' ? toneSlotFor(name) : tone;
  const interactive = href !== undefined || onPress !== undefined;
  const styles = avatarStyles({
    size,
    shape: expressive ? 'expressive' : resolvedShape,
    tone: resolvedTone,
    interactive,
    ring,
    presencePlacement,
    badgePlacement,
    ...(presence && { presence }),
  });
  const maskStyle: CSSProperties | undefined = expressive
    ? { maskImage: materialShapeMask(resolvedShape as MaterialShapeName) }
    : undefined;

  const words = { ...DEFAULT_LABELS, ...labels };
  const accessibleName = decorative
    ? undefined
    : [alt, presence && words[presence], badge != null && badgeLabel].filter(Boolean).join(', ');
  const letters = initials ?? getInitials(name, locale);

  const layers = (
    <>
      <span
        aria-hidden="true"
        className={styles.visual({ class: classNames?.visual })}
        style={maskStyle}
      >
        <span className={styles.fallback({ class: classNames?.fallback })}>
          {letters || icon || <PersonIcon />}
        </span>
        {src || image ? (
          <AvatarImage
            {...(image ? { element: image } : { src, srcSet, sizes })}
            className={styles.image({ class: classNames?.image })}
          />
        ) : null}
        {interactive ? <span className={styles.stateLayer()} style={maskStyle} /> : null}
      </span>
      {presence ? (
        <span aria-hidden="true" className={styles.presence({ class: classNames?.presence })} />
      ) : null}
      {badge != null ? (
        <span aria-hidden="true" className={styles.badge({ class: classNames?.badge })}>
          {badge}
        </span>
      ) : null}
    </>
  );

  const rootClass = styles.root({ class: cn(classNames?.root, className) });
  const data = {
    'data-vk-avatar': '',
    'data-size': size,
    'data-shape': resolvedShape,
    'data-tone': resolvedTone,
    ...(presence && { 'data-presence': presence }),
  };

  if (interactive) {
    const baseProps = {
      ...rest,
      ...data,
      ...(href !== undefined ? { href } : { onPress }),
      'aria-label': accessibleName,
      className: rootClass,
      style,
    } as ButtonBaseProps;
    return (
      <ButtonBase {...baseProps}>
        <span className={styles.content()}>
          {size === 'xs' || size === 'sm' || size === 'md' ? <TouchTarget /> : null}
          {layers}
        </span>
      </ButtonBase>
    );
  }

  return (
    <span
      {...rest}
      {...data}
      {...(decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': accessibleName })}
      className={rootClass}
      style={style}
    >
      {layers}
    </span>
  );
}

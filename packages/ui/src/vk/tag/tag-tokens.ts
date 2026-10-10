import type { ColorRole } from '../../tokens/color';
import type { CornerName } from '../../tokens/shape';
import type { TypeRole } from '../../tokens/typography';

/*
 * Tag is a `vk` component, NOT an M3 component (docs/plans/tag.md). These are its component
 * tokens, in the spirit of Compose's *Tokens files: every size, corner and colour role it
 * uses. `tag-styles.ts` is written from them (every class literal, so Tailwind finds it),
 * and a test checks the two agree. Each value is also a CSS variable, `--vk-tag-*`, that a
 * consumer can set on a tag or any ancestor.
 */

export const TAG_VARIANTS = ['tonal', 'filled', 'outlined'] as const;
export type TagVariant = (typeof TAG_VARIANTS)[number];

export const TAG_TONES = [
  'neutral',
  'primary',
  'secondary',
  'tertiary',
  'error',
  'success',
  'warning',
] as const;
export type TagTone = (typeof TAG_TONES)[number];

export const TAG_SIZES = ['sm', 'md', 'lg'] as const;
export type TagSize = (typeof TAG_SIZES)[number];

export const TAG_SHAPES = ['full', 'rounded'] as const;
export type TagShape = (typeof TAG_SHAPES)[number];

export interface TagSizeTokens {
  /** Height in px, the 1px border included. */
  height: number;
  paddingInline: number;
  /** Between the dot or icon and the label. */
  gap: number;
  iconSize: number;
  typeRole: TypeRole;
  /** The corner of `shape="rounded"`. */
  roundedCorner: CornerName;
}

export interface TagColorTokens {
  /** Null: no container (outlined). */
  container: ColorRole | null;
  content: ColorRole;
  /** Null: no visible border (tonal and filled keep a transparent one, for forced colours). */
  outline: ColorRole | null;
  dot: ColorRole;
}

const tonal = (role: string, dot: ColorRole): TagColorTokens => ({
  container: `${role}-container` as ColorRole,
  content: `on-${role}-container` as ColorRole,
  outline: null,
  dot,
});

const filled = (role: string): TagColorTokens => ({
  container: role as ColorRole,
  content: `on-${role}` as ColorRole,
  outline: null,
  dot: `on-${role}` as ColorRole,
});

const outlined = (role: ColorRole): TagColorTokens => ({
  container: null,
  content: role,
  outline: role,
  dot: role,
});

export const tagTokens = {
  size: {
    sm: {
      height: 20,
      paddingInline: 6,
      gap: 4,
      iconSize: 14,
      typeRole: 'label-small',
      roundedCorner: 'extra-small',
    },
    md: {
      height: 24,
      paddingInline: 8,
      gap: 4,
      iconSize: 16,
      typeRole: 'label-medium',
      roundedCorner: 'small',
    },
    lg: {
      height: 32,
      paddingInline: 12,
      gap: 6,
      iconSize: 18,
      typeRole: 'label-large',
      roundedCorner: 'small',
    },
  } satisfies Record<TagSize, TagSizeTokens>,
  dotSize: 6,
  borderWidth: 1,
  color: {
    tonal: {
      neutral: {
        container: 'surface-container-highest',
        content: 'on-surface-variant',
        outline: null,
        dot: 'on-surface-variant',
      },
      primary: tonal('primary', 'primary'),
      secondary: tonal('secondary', 'secondary'),
      tertiary: tonal('tertiary', 'tertiary'),
      error: tonal('error', 'error'),
      success: tonal('success', 'success'),
      warning: tonal('warning', 'warning'),
    },
    filled: {
      neutral: {
        container: 'inverse-surface',
        content: 'inverse-on-surface',
        outline: null,
        dot: 'inverse-on-surface',
      },
      primary: filled('primary'),
      secondary: filled('secondary'),
      tertiary: filled('tertiary'),
      error: filled('error'),
      success: filled('success'),
      warning: filled('warning'),
    },
    outlined: {
      neutral: {
        container: null,
        content: 'on-surface-variant',
        outline: 'outline',
        dot: 'outline',
      },
      primary: outlined('primary'),
      secondary: outlined('secondary'),
      tertiary: outlined('tertiary'),
      error: outlined('error'),
      success: outlined('success'),
      warning: outlined('warning'),
    },
  } satisfies Record<TagVariant, Record<TagTone, TagColorTokens>>,
} as const;

/**
 * M3 colour roles, built-in themes and contrast levels.
 *
 * Role names are the kebab-case form of the `MaterialDynamicColors` methods in
 * `@material/material-color-utilities`. They become `--md-sys-color-<role>` CSS
 * variables and `bg-<role>` / `text-<role>` / … Tailwind utilities.
 */

export const COLOR_ROLES = [
  'primary',
  'on-primary',
  'primary-container',
  'on-primary-container',
  'inverse-primary',
  'primary-fixed',
  'primary-fixed-dim',
  'on-primary-fixed',
  'on-primary-fixed-variant',
  'secondary',
  'on-secondary',
  'secondary-container',
  'on-secondary-container',
  'secondary-fixed',
  'secondary-fixed-dim',
  'on-secondary-fixed',
  'on-secondary-fixed-variant',
  'tertiary',
  'on-tertiary',
  'tertiary-container',
  'on-tertiary-container',
  'tertiary-fixed',
  'tertiary-fixed-dim',
  'on-tertiary-fixed',
  'on-tertiary-fixed-variant',
  'error',
  'on-error',
  'error-container',
  'on-error-container',
  'background',
  'on-background',
  'surface',
  'surface-dim',
  'surface-bright',
  'surface-container-lowest',
  'surface-container-low',
  'surface-container',
  'surface-container-high',
  'surface-container-highest',
  'on-surface',
  'surface-variant',
  'on-surface-variant',
  'inverse-surface',
  'inverse-on-surface',
  'outline',
  'outline-variant',
  'shadow',
  'scrim',
  'surface-tint',
] as const;

export type ColorRole = (typeof COLOR_ROLES)[number];

/** Scheme variants supported by the 2025 colour spec. */
export const SCHEME_VARIANTS = ['tonal-spot', 'neutral', 'vibrant', 'expressive'] as const;
export type SchemeVariant = (typeof SCHEME_VARIANTS)[number];

/**
 * The six tonal palettes an M3 scheme is built from: the "core colours" of Material Theme
 * Builder. Every colour role takes its tone from one of them.
 */
export const PALETTE_NAMES = [
  'primary',
  'secondary',
  'tertiary',
  'error',
  'neutral',
  'neutralVariant',
] as const;
export type PaletteName = (typeof PALETTE_NAMES)[number];

/**
 * Where a palette comes from: a scheme variant (that palette from that variant of the same
 * seed) or a hex colour (a palette built from its hue and chroma, as Material Theme Builder
 * does for a core colour).
 */
export type PaletteSource = SchemeVariant | `#${string}`;

/** Per-palette sources; any palette left out comes from the theme's own `variant`. */
export type ThemePalettes = Partial<Record<PaletteName, PaletteSource>>;

export interface ThemeSeed {
  seed: string;
  variant: SchemeVariant;
  /**
   * Takes some palettes from elsewhere, e.g. `{ neutral: 'tonal-spot', neutralVariant:
   * 'tonal-spot' }` for vivid accents on calm surfaces, or `{ tertiary: '#00A07A' }` for a
   * brand's own tertiary colour. Roles still take their tones from the M3 spec, so contrast
   * is unchanged.
   */
  palettes?: ThemePalettes;
}

export const BUILT_IN_THEMES = {
  baseline: { seed: '#6750A4', variant: 'tonal-spot' },
  ocean: { seed: '#0061A4', variant: 'tonal-spot' },
  forest: { seed: '#386A20', variant: 'tonal-spot' },
  sunset: { seed: '#A04100', variant: 'tonal-spot' },
  rose: { seed: '#9C4146', variant: 'tonal-spot' },
  slate: { seed: '#545F71', variant: 'neutral' },
} as const satisfies Record<string, ThemeSeed>;

export type BuiltInThemeName = keyof typeof BUILT_IN_THEMES;
export const BUILT_IN_THEME_NAMES = Object.keys(BUILT_IN_THEMES) as BuiltInThemeName[];
export const DEFAULT_THEME: BuiltInThemeName = 'baseline';

export const COLOR_MODES = ['light', 'dark', 'system'] as const;
export type ColorMode = (typeof COLOR_MODES)[number];
export type ResolvedColorMode = Exclude<ColorMode, 'system'>;

/** Contrast levels and the `contrastLevel` passed to the colour library. */
export const CONTRAST_LEVELS = { standard: 0, medium: 0.5, high: 1 } as const;
export type ContrastLevel = keyof typeof CONTRAST_LEVELS;
export const CONTRAST_LEVEL_NAMES = Object.keys(CONTRAST_LEVELS) as ContrastLevel[];

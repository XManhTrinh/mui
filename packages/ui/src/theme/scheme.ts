import {
  DynamicScheme,
  Hct,
  MaterialDynamicColors,
  SchemeExpressive,
  SchemeNeutral,
  SchemeTonalSpot,
  SchemeVibrant,
  TonalPalette,
  argbFromHex,
  hexFromArgb,
  type DynamicColor,
} from '@material/material-color-utilities';
import {
  COLOR_ROLES,
  CONTRAST_LEVELS,
  PALETTE_NAMES,
  SCHEME_VARIANTS,
  type ColorRole,
  type ContrastLevel,
  type PaletteName,
  type PaletteSource,
  type SchemeVariant,
  type ThemePalettes,
  type ThemeSeed,
} from '../tokens/color';

const SCHEMES = {
  'tonal-spot': SchemeTonalSpot,
  neutral: SchemeNeutral,
  vibrant: SchemeVibrant,
  expressive: SchemeExpressive,
} satisfies Record<SchemeVariant, unknown>;

const HEX_COLOR = /^#(?:[0-9a-f]{3}){1,2}$/i;

const toCamelCase = (role: string) => role.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

const dynamicColors = new MaterialDynamicColors();

function roleColor(role: ColorRole): DynamicColor {
  const method = toCamelCase(role) as keyof MaterialDynamicColors;
  const factory = dynamicColors[method];
  if (typeof factory !== 'function') {
    throw new Error(`[@vkieu/mui] Unknown colour role "${role}".`);
  }
  const color = (factory as () => DynamicColor | undefined).call(dynamicColors);
  if (!color)
    throw new Error(`[@vkieu/mui] Colour role "${role}" is not defined by the 2025 spec.`);
  return color;
}

export function assertHexColor(value: string): void {
  if (!HEX_COLOR.test(value)) {
    throw new Error(`[@vkieu/mui] Expected a hex colour like "#6750A4", received "${value}".`);
  }
}

const isSchemeVariant = (source: string): source is SchemeVariant =>
  (SCHEME_VARIANTS as readonly string[]).includes(source);

/** The `DynamicScheme` field that holds each palette. */
const PALETTE_FIELDS = {
  primary: 'primaryPalette',
  secondary: 'secondaryPalette',
  tertiary: 'tertiaryPalette',
  error: 'errorPalette',
  neutral: 'neutralPalette',
  neutralVariant: 'neutralVariantPalette',
} as const satisfies Record<PaletteName, keyof DynamicScheme>;

function assertPalettes(palettes: ThemePalettes): void {
  for (const [name, source] of Object.entries(palettes)) {
    if (!(PALETTE_NAMES as readonly string[]).includes(name)) {
      throw new Error(
        `[@vkieu/mui] Unknown palette "${name}". Use one of ${PALETTE_NAMES.join(', ')}.`,
      );
    }
    if (typeof source !== 'string' || (!isSchemeVariant(source) && !HEX_COLOR.test(source))) {
      throw new Error(
        `[@vkieu/mui] The ${name} palette needs a scheme variant (${SCHEME_VARIANTS.join(', ')}) or a hex colour like "#00A07A", received "${String(source)}".`,
      );
    }
  }
}

function variantScheme(
  seed: Hct,
  variant: SchemeVariant,
  isDark: boolean,
  contrast: ContrastLevel,
): DynamicScheme {
  return new SCHEMES[variant](seed, isDark, CONTRAST_LEVELS[contrast], '2025');
}

function createScheme(
  { seed, variant, palettes }: ThemeSeed,
  isDark: boolean,
  contrast: ContrastLevel,
): DynamicScheme {
  assertHexColor(seed);
  const sourceColor = Hct.fromInt(argbFromHex(seed));
  const scheme = variantScheme(sourceColor, variant, isDark, contrast);
  const overrides = Object.entries(palettes ?? {}) as [PaletteName, PaletteSource][];
  if (overrides.length === 0) return scheme;
  assertPalettes(palettes ?? {});

  // Every palette starts as the variant's own; each override replaces one. Roles still take
  // their tones from the theme's variant, so the spec's contrast rules hold.
  const paletteFrom = (name: PaletteName, source: PaletteSource): TonalPalette =>
    isSchemeVariant(source)
      ? variantScheme(sourceColor, source, isDark, contrast)[PALETTE_FIELDS[name]]
      : TonalPalette.fromInt(argbFromHex(source));
  const chosen = Object.fromEntries(
    PALETTE_NAMES.map((name) => [PALETTE_FIELDS[name], scheme[PALETTE_FIELDS[name]]]),
  ) as Record<(typeof PALETTE_FIELDS)[PaletteName], TonalPalette>;
  for (const [name, source] of overrides) chosen[PALETTE_FIELDS[name]] = paletteFrom(name, source);

  return new DynamicScheme({
    sourceColorHct: sourceColor,
    variant: scheme.variant,
    isDark,
    contrastLevel: CONTRAST_LEVELS[contrast],
    specVersion: scheme.specVersion,
    platform: scheme.platform,
    ...chosen,
  });
}

/** Resolves every M3 colour role to a hex value using the 2025 colour spec. */
export function generateSchemeColors(
  seed: ThemeSeed,
  isDark: boolean,
  contrast: ContrastLevel,
): Record<ColorRole, string> {
  const scheme = createScheme(seed, isDark, contrast);
  return Object.fromEntries(
    COLOR_ROLES.map((role) => [role, hexFromArgb(roleColor(role).getArgb(scheme))]),
  ) as Record<ColorRole, string>;
}

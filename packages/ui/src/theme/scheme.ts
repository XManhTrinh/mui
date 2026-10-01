import {
  Hct,
  MaterialDynamicColors,
  SchemeExpressive,
  SchemeNeutral,
  SchemeTonalSpot,
  SchemeVibrant,
  argbFromHex,
  hexFromArgb,
  type DynamicColor,
  type DynamicScheme,
} from '@material/material-color-utilities';
import {
  COLOR_ROLES,
  CONTRAST_LEVELS,
  type ColorRole,
  type ContrastLevel,
  type SchemeVariant,
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

function createScheme(
  { seed, variant }: ThemeSeed,
  isDark: boolean,
  contrast: ContrastLevel,
): DynamicScheme {
  assertHexColor(seed);
  const Scheme = SCHEMES[variant];
  return new Scheme(Hct.fromInt(argbFromHex(seed)), isDark, CONTRAST_LEVELS[contrast], '2025');
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

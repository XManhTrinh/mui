import { CONTRAST_LEVEL_NAMES, type ContrastLevel, type SchemeVariant } from '../tokens/color';
import { assertThemeName, generateThemeCss } from './css';

export interface CreateThemeOptions {
  /** Theme name used in `data-theme`. Lowercase kebab-case, e.g. `"acme"`. */
  name: string;
  /** Seed colour as hex, e.g. `"#0B57D0"`. */
  seed: string;
  /** Colour scheme variant. Defaults to `"tonal-spot"`. */
  variant?: SchemeVariant;
  /** Contrast level(s) to generate. Defaults to all three. */
  contrast?: ContrastLevel | readonly ContrastLevel[];
}

/** A generated colour theme, ready to pass to `ThemeProvider`'s `themes` prop. */
export interface ThemeDefinition {
  name: string;
  seed: string;
  variant: SchemeVariant;
  contrast: readonly ContrastLevel[];
  /** Light, dark and system-mode CSS for each contrast level. */
  css: string;
}

/**
 * Generates a custom colour theme from a seed colour with the M3 2025 colour spec.
 * Works at runtime and on the server; for static sites prefer the CLI, which writes
 * the same CSS to a file.
 *
 * @example
 * const acme = createTheme({ name: 'acme', seed: '#0B57D0' });
 * <ThemeProvider themes={['baseline', acme]} defaultTheme="acme">…</ThemeProvider>
 */
export function createTheme({
  name,
  seed,
  variant = 'tonal-spot',
  contrast = CONTRAST_LEVEL_NAMES,
}: CreateThemeOptions): ThemeDefinition {
  assertThemeName(name);
  const contrastLevels: readonly ContrastLevel[] =
    typeof contrast === 'string' ? [contrast] : contrast;
  return {
    name,
    seed,
    variant,
    contrast: contrastLevels,
    css: generateThemeCss(name, { seed, variant }, { contrastLevels }),
  };
}

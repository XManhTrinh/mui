import { PALETTE_NAMES, type PaletteSource, type ThemePalettes } from '../tokens/color';

/** `neutralVariant` → `neutral-variant`, the spelling the CLI shows. */
export function toKebabCase(name: string): string {
  return name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

/**
 * Reads `<name>=<source>` entries (the CLI's `--palette` values) into `ThemePalettes`.
 * Names may be kebab- or camel-case. Sources are checked later by `createTheme`.
 */
export function parsePalettes(entries: readonly string[]): ThemePalettes {
  const palettes: ThemePalettes = {};
  for (const entry of entries) {
    const separator = entry.indexOf('=');
    const rawName = separator === -1 ? entry : entry.slice(0, separator);
    const source = separator === -1 ? '' : entry.slice(separator + 1).trim();
    const name = PALETTE_NAMES.find(
      (candidate) => candidate === rawName.trim() || toKebabCase(candidate) === rawName.trim(),
    );
    if (!name || source === '') {
      throw new Error(
        `--palette expects <name>=<source> with a name from ${PALETTE_NAMES.map(toKebabCase).join(', ')}, received "${entry}".`,
      );
    }
    palettes[name] = source as PaletteSource;
  }
  return palettes;
}

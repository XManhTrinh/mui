---
'@vkieu/mui': minor
---

`createTheme` (and `ThemeSeed`) gain a `palettes` option, and the theme CLI a repeatable `--palette <name>=<source>`: each of the scheme's six palettes (`primary`, `secondary`, `tertiary`, `error`, `neutral`, `neutralVariant`) can come from another variant of the same seed or from a hex colour, as Material Theme Builder's core colours do. For example, `variant: 'vibrant'` with `palettes: { neutral: 'tonal-spot', neutralVariant: 'tonal-spot' }` gives vivid accents on calm surfaces. Roles still take their tones from the theme's variant, so contrast holds; without `palettes`, every theme's CSS is unchanged. Also exports `PALETTE_NAMES` and the `PaletteName`, `PaletteSource` and `ThemePalettes` types.

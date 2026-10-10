import { describe, expect, it } from 'vitest';
import { generateSchemeColors } from '../../theme/scheme';
import {
  BUILT_IN_THEMES,
  BUILT_IN_THEME_NAMES,
  CONTRAST_LEVEL_NAMES,
  type ColorRole,
} from '../../tokens/color';
import { tagStyles } from './tag-styles';
import { TAG_SIZES, TAG_TONES, TAG_VARIANTS, tagTokens } from './tag-tokens';

function luminance(hex: string): number {
  const [r = 0, g = 0, b = 0] = [1, 3, 5].map((index) => {
    const value = parseInt(hex.slice(index, index + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (light + 0.05) / (dark + 0.05);
}

describe('tagTokens and tagStyles', () => {
  it('writes every size from its tokens', () => {
    for (const size of TAG_SIZES) {
      const tokens = tagTokens.size[size];
      const styles = tagStyles({ size, shape: 'rounded' });
      expect(styles.root()).toContain(`h-[var(--vk-tag-height,${tokens.height}px)]`);
      expect(styles.root()).toContain(
        `px-[var(--vk-tag-padding-inline,${tokens.paddingInline}px)]`,
      );
      expect(styles.root()).toContain(`gap-[var(--vk-tag-gap,${tokens.gap}px)]`);
      expect(styles.root()).toContain(`text-${tokens.typeRole}`);
      expect(styles.root()).toContain(`var(--md-sys-shape-corner-${tokens.roundedCorner})`);
      expect(styles.icon()).toContain(`size-[var(--vk-tag-icon-size,${tokens.iconSize}px)]`);
    }
  });

  it('writes every variant and tone from its tokens', () => {
    for (const variant of TAG_VARIANTS) {
      for (const tone of TAG_TONES) {
        const roles = tagTokens.color[variant][tone];
        const styles = tagStyles({ variant, tone });
        const role = (name: string, value: ColorRole | null) =>
          value
            ? `var(--vk-tag-${name},var(--md-sys-color-${value}))`
            : `var(--vk-tag-${name},transparent)`;
        expect(styles.root(), `${variant} ${tone}`).toContain(role('container', roles.container));
        expect(styles.root(), `${variant} ${tone}`).toContain(role('content', roles.content));
        expect(styles.root(), `${variant} ${tone}`).toContain(role('outline', roles.outline));
        expect(styles.dot(), `${variant} ${tone}`).toContain(role('dot', roles.dot));
      }
    }
  });

  it('keeps every label readable: 4.5:1 in every theme, mode and contrast level', () => {
    for (const name of BUILT_IN_THEME_NAMES) {
      for (const isDark of [false, true]) {
        for (const level of CONTRAST_LEVEL_NAMES) {
          const colors = generateSchemeColors(BUILT_IN_THEMES[name], isDark, level);
          for (const variant of TAG_VARIANTS) {
            for (const tone of TAG_TONES) {
              const roles = tagTokens.color[variant][tone];
              const background = colors[roles.container ?? 'surface'];
              expect(
                contrast(colors[roles.content], background),
                `${name} ${isDark ? 'dark' : 'light'} ${level} ${variant} ${tone}`,
              ).toBeGreaterThanOrEqual(4.5);
            }
          }
        }
      }
    }
  });
});

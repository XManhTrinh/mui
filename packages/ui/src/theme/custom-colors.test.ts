import { Hct, argbFromHex } from '@material/material-color-utilities';
import { describe, expect, it } from 'vitest';
import {
  BUILT_IN_THEMES,
  BUILT_IN_THEME_NAMES,
  CONTRAST_LEVEL_NAMES,
  CUSTOM_COLORS,
  CUSTOM_COLOR_ROLES,
} from '../tokens/color';
import { createTheme } from './create-theme';
import { parseCustomColors } from './parse-palettes';
import { generateSchemeColors } from './scheme';

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((index) => {
    const value = parseInt(hex.slice(index, index + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  const [r = 0, g = 0, b = 0] = channels;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (light + 0.05) / (dark + 0.05);
}

const hue = (hex: string) => Hct.fromInt(argbFromHex(hex)).hue;

describe('custom colours (success, warning)', () => {
  it('adds four roles for each', () => {
    expect(CUSTOM_COLOR_ROLES).toEqual([
      'success',
      'on-success',
      'success-container',
      'on-success-container',
      'warning',
      'on-warning',
      'warning-container',
      'on-warning-container',
    ]);
  });

  it('is readable in every built-in theme, mode and contrast level', () => {
    for (const name of BUILT_IN_THEME_NAMES) {
      for (const isDark of [false, true]) {
        for (const level of CONTRAST_LEVEL_NAMES) {
          const colors = generateSchemeColors(BUILT_IN_THEMES[name], isDark, level);
          for (const color of CUSTOM_COLORS) {
            const where = `${name} ${isDark ? 'dark' : 'light'} ${level} ${color}`;
            expect(contrast(colors[`on-${color}`], colors[color]), where).toBeGreaterThanOrEqual(
              4.5,
            );
            expect(
              contrast(colors[`on-${color}-container`], colors[`${color}-container`]),
              where,
            ).toBeGreaterThanOrEqual(4.5);
            expect(contrast(colors[color], colors.surface), where).toBeGreaterThanOrEqual(3);
          }
        }
      }
    }
  });

  it('keeps green and amber, harmonised toward the seed', () => {
    const colors = generateSchemeColors(BUILT_IN_THEMES.baseline, false, 'standard');
    expect(hue(colors.success)).toBeGreaterThan(120);
    expect(hue(colors.success)).toBeLessThan(180);
    expect(hue(colors.warning)).toBeGreaterThan(40);
    expect(hue(colors.warning)).toBeLessThan(100);
  });

  it('takes a brand colour, exactly when harmonising is off', () => {
    const seed = { seed: '#6750A4', variant: 'tonal-spot' as const };
    const brand = { customColors: { success: '#0B8043' as const } };
    const harmonised = generateSchemeColors({ ...seed, ...brand }, false, 'standard');
    const exact = generateSchemeColors({ ...seed, ...brand, harmonize: false }, false, 'standard');
    expect(Math.abs(hue(exact.success) - hue('#0B8043'))).toBeLessThan(3);
    expect(harmonised.success).not.toBe(exact.success);
  });

  it('writes the roles into theme CSS', () => {
    const { css } = createTheme({ name: 'acme', seed: '#0B57D0', contrast: 'standard' });
    for (const role of CUSTOM_COLOR_ROLES) expect(css).toContain(`--md-sys-color-${role}:`);
  });

  it('reads the CLI entries and refuses unknown ones', () => {
    expect(parseCustomColors(['success=#0B8043', 'warning=#E37400'])).toEqual({
      success: '#0B8043',
      warning: '#E37400',
    });
    expect(() => parseCustomColors(['info=#0B8043'])).toThrow(/success, warning/);
    expect(() => parseCustomColors(['success'])).toThrow();
  });
});

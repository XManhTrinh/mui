import { expect, test } from '@playwright/test';
import { MODES, THEMES } from './shots';
import { openStory } from './story';

test.describe('Link visual regression', () => {
  for (const theme of THEMES) {
    for (const mode of MODES) {
      test(`variants · ${theme} · ${mode}`, async ({ page }) => {
        await openStory(page, 'vk-link--variants', { theme, mode });
        await expect(page.getByTestId('variants')).toHaveScreenshot(
          `variants-${theme}-${mode}.png`,
        );
      });
    }
  }

  for (const contrast of ['medium', 'high'] as const) {
    test(`variants · contrast ${contrast}`, async ({ page }) => {
      await openStory(page, 'vk-link--variants', { contrast });
      await expect(page.getByTestId('variants')).toHaveScreenshot(`variants-${contrast}.png`);
    });
  }

  test('variants · right-to-left', async ({ page }) => {
    await openStory(page, 'vk-link--variants', { dir: 'rtl' });
    await expect(page.getByTestId('variants')).toHaveScreenshot('variants-rtl.png');
  });

  test('forced colours use LinkText and always underline', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await openStory(page, 'vk-link--variants');
    const standalone = page.getByRole('link', { name: 'Forgot password?' });
    expect(await standalone.evaluate((el) => getComputedStyle(el).textDecorationLine)).toBe(
      'underline',
    );
  });
});

test.describe('Link interaction', () => {
  test('a keyboard focus shows the M3 focus ring and the underline', async ({ page }) => {
    await openStory(page, 'vk-link--variants');
    const link = page.getByRole('link', { name: 'Forgot password?' });
    await link.focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    await expect(link).toHaveAttribute('data-focus-visible', 'true');
    expect(await link.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe('solid');
    expect(await link.evaluate((el) => getComputedStyle(el).textDecorationLine)).toBe('underline');
  });

  test('presses with any layout class, in both directions', async ({ page }) => {
    for (const override of ['none', 'fixed', 'absolute', 'transform']) {
      for (const dir of ['ltr', 'rtl'] as const) {
        await openStory(page, 'vk-link--layout-override', { dir }, { override });
        await page.getByTestId('target').click();
        await expect(page.getByTestId('count')).toHaveText('Pressed 1');
      }
    }
  });
});

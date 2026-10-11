import { expect, test } from '@playwright/test';
import { MODES, THEMES } from './shots';
import { openStory } from './story';

test.describe('ShapedIcon visual regression', () => {
  for (const theme of THEMES) {
    for (const mode of MODES) {
      test(`variants · ${theme} · ${mode}`, async ({ page }) => {
        await openStory(page, 'vk-shapedicon--variants', { theme, mode });
        await expect(page.getByTestId('variants')).toHaveScreenshot(
          `variants-${theme}-${mode}.png`,
        );
      });
    }
  }

  for (const contrast of ['medium', 'high'] as const) {
    test(`variants · contrast ${contrast}`, async ({ page }) => {
      await openStory(page, 'vk-shapedicon--variants', { contrast });
      await expect(page.getByTestId('variants')).toHaveScreenshot(`variants-${contrast}.png`);
    });
  }

  test('variants · right-to-left', async ({ page }) => {
    await openStory(page, 'vk-shapedicon--variants', { dir: 'rtl' });
    await expect(page.getByTestId('variants')).toHaveScreenshot('variants-rtl.png');
  });

  test('sizes and the shape mask are applied', async ({ page }) => {
    await openStory(page, 'vk-shapedicon--variants');
    const icons = page.getByTestId('variants').locator('[data-shape]');
    const box = await icons.nth(3).boundingBox();
    expect(box?.width).toBe(96);
    const mask = await icons.nth(4).evaluate((el) => getComputedStyle(el).maskImage);
    expect(mask).toMatch(/^url\("data:image\/svg\+xml/);
  });
});

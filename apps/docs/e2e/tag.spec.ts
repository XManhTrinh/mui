import { expect, test } from '@playwright/test';
import { layoutSafetySuite } from './layout-safety';
import { MODES, THEMES } from './shots';
import { openStory } from './story';

test.describe('Tag visual regression', () => {
  for (const theme of THEMES) {
    for (const mode of MODES) {
      test(`grid · ${theme} · ${mode}`, async ({ page }) => {
        await openStory(page, 'vk-tag--grid', { theme, mode });
        await expect(page.getByTestId('grid')).toHaveScreenshot(`grid-${theme}-${mode}.png`);
      });
    }
  }

  for (const contrast of ['medium', 'high'] as const) {
    for (const mode of MODES) {
      test(`grid · contrast ${contrast} · ${mode}`, async ({ page }) => {
        await openStory(page, 'vk-tag--grid', { contrast, mode });
        await expect(page.getByTestId('grid')).toHaveScreenshot(`grid-${contrast}-${mode}.png`);
      });
    }
  }

  test('sizes and shapes', async ({ page }) => {
    await openStory(page, 'vk-tag--sizes');
    await expect(page.getByTestId('sizes')).toHaveScreenshot('sizes.png');
  });

  test('in use · right-to-left', async ({ page }) => {
    await openStory(page, 'vk-tag--in-use', { dir: 'rtl' });
    await expect(page.getByTestId('in-use')).toHaveScreenshot('in-use-rtl.png');
  });

  test('forced colours keep a border', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await openStory(page, 'vk-tag--grid');
    const border = await page
      .getByTestId('grid')
      .locator('[data-variant="filled"]')
      .first()
      .evaluate((el) => getComputedStyle(el).borderTopStyle);
    expect(border).toBe('solid');
    await expect(page.getByTestId('grid')).toHaveScreenshot('grid-forced-colors.png');
  });
});

test.describe('Tag motion', () => {
  test('colours ease, and not under reduced motion', async ({ page }) => {
    await openStory(page, 'vk-tag--grid');
    const tag = page.getByTestId('grid').locator('[data-variant]').first();
    expect(await tag.evaluate((el) => getComputedStyle(el).transitionProperty)).toContain('color');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openStory(page, 'vk-tag--grid');
    expect(await tag.evaluate((el) => getComputedStyle(el).transitionProperty)).toBe('none');
  });
});

test.describe('Tag layout safety', () => {
  layoutSafetySuite('vk-tag--layout-override', {
    height: 24,
    radius: '9999px',
    interactive: false,
  });
});

import { expect, test } from '@playwright/test';
import { layoutSafetySuite } from './layout-safety';
import { MODES, THEMES } from './shots';
import { openStory } from './story';

test.describe('EmptyState visual regression', () => {
  for (const theme of THEMES) {
    for (const mode of MODES) {
      test(`variants · ${theme} · ${mode}`, async ({ page }) => {
        await openStory(page, 'vk-emptystate--variants', { theme, mode });
        await expect(page.getByTestId('variants')).toHaveScreenshot(
          `variants-${theme}-${mode}.png`,
        );
      });
    }
  }

  for (const contrast of ['medium', 'high'] as const) {
    for (const mode of MODES) {
      test(`tones · contrast ${contrast} · ${mode}`, async ({ page }) => {
        await openStory(page, 'vk-emptystate--tones', { contrast, mode });
        await expect(page.getByTestId('tones')).toHaveScreenshot(`tones-${contrast}-${mode}.png`);
      });
    }
  }

  test('sizes', async ({ page }) => {
    await openStory(page, 'vk-emptystate--sizes');
    await expect(page.getByTestId('sizes')).toHaveScreenshot('sizes.png');
  });

  test('actions · right-to-left', async ({ page }) => {
    await openStory(page, 'vk-emptystate--with-actions', { dir: 'rtl' });
    await expect(page.getByTestId('actions')).toHaveScreenshot('actions-rtl.png');
  });

  test('phone width wraps the actions', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await openStory(page, 'vk-emptystate--with-actions');
    await expect(page.getByTestId('actions')).toHaveScreenshot('actions-phone.png');
  });

  test('forced colours keep the icon visible', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await openStory(page, 'vk-emptystate--tones');
    const color = await page
      .getByTestId('tones')
      .locator('[aria-hidden="true"]')
      .first()
      .evaluate((el) => getComputedStyle(el).color);
    expect(color).not.toBe('rgba(0, 0, 0, 0)');
    await expect(page.getByTestId('tones')).toHaveScreenshot('tones-forced-colors.png');
  });
});

test.describe('EmptyState motion', () => {
  test('fades in on the effects spring, and not under reduced motion', async ({ page }) => {
    await openStory(page, 'vk-emptystate--with-actions');
    const root = page.getByTestId('actions').locator('[data-variant]');
    expect(await root.evaluate((el) => getComputedStyle(el).transitionProperty)).toBe('opacity');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openStory(page, 'vk-emptystate--with-actions');
    expect(await root.evaluate((el) => getComputedStyle(el).transitionProperty)).toBe('none');
  });
});

test.describe('EmptyState layout safety', () => {
  layoutSafetySuite('vk-emptystate--layout-override', {
    height: 188,
    radius: '12px',
    interactive: false,
  });
});

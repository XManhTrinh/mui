import { expect, test } from '@playwright/test';
import { layoutSafetySuite } from './layout-safety';
import { MODES, THEMES } from './shots';
import { openStory } from './story';

test.describe('Alert visual regression', () => {
  for (const theme of THEMES) {
    for (const mode of MODES) {
      test(`tones · ${theme} · ${mode}`, async ({ page }) => {
        await openStory(page, 'vk-alert--tones', { theme, mode });
        await expect(page.getByTestId('tones')).toHaveScreenshot(`tones-${theme}-${mode}.png`);
      });
    }
  }

  for (const contrast of ['medium', 'high'] as const) {
    test(`tones · contrast ${contrast}`, async ({ page }) => {
      await openStory(page, 'vk-alert--tones', { contrast });
      await expect(page.getByTestId('tones')).toHaveScreenshot(`tones-${contrast}.png`);
    });
  }

  test('actions beside the text when wide', async ({ page }) => {
    await openStory(page, 'vk-alert--with-actions');
    await expect(page.getByTestId('actions')).toHaveScreenshot('actions-wide.png');
  });

  test('actions under the text on a phone', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await openStory(page, 'vk-alert--with-actions');
    await expect(page.getByTestId('actions')).toHaveScreenshot('actions-phone.png');
  });

  test('right-to-left', async ({ page }) => {
    await openStory(page, 'vk-alert--with-actions', { dir: 'rtl' });
    await expect(page.getByTestId('actions')).toHaveScreenshot('actions-rtl.png');
  });

  test('forced colours keep a border', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await openStory(page, 'vk-alert--tones');
    const border = await page
      .getByTestId('tones')
      .locator('[data-variant="tonal"]')
      .first()
      .evaluate((el) => getComputedStyle(el).borderTopStyle);
    expect(border).toBe('solid');
  });
});

test.describe('Alert actions', () => {
  test('text buttons on a tonal alert take its readable content colour', async ({ page }) => {
    await openStory(page, 'vk-alert--with-actions');
    const content = await page.getByRole('alert').evaluate((el) => getComputedStyle(el).color);
    const action = await page
      .getByRole('button', { name: 'Update card' })
      .evaluate((el) => getComputedStyle(el).color);
    expect(action).toBe(content);
  });
});

test.describe('Alert motion', () => {
  test('fades in, and not under reduced motion', async ({ page }) => {
    await openStory(page, 'vk-alert--tones');
    const alert = page.getByTestId('tones').locator('[data-tone]').first();
    expect(await alert.evaluate((el) => getComputedStyle(el).transitionProperty)).toBe('opacity');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openStory(page, 'vk-alert--tones');
    expect(await alert.evaluate((el) => getComputedStyle(el).transitionProperty)).toBe('none');
  });
});

test.describe('Alert layout safety', () => {
  layoutSafetySuite('vk-alert--layout-override', {
    height: 50,
    radius: '12px',
    interactive: false,
  });
});

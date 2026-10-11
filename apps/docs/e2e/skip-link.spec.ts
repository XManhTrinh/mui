import { expect, test } from '@playwright/test';
import { MODES, THEMES } from './shots';
import { openStory } from './story';

test.describe('SkipLink', () => {
  test('stays off screen until a keyboard user tabs onto it', async ({ page }) => {
    await openStory(page, 'vk-skiplink--page');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    expect((await skip.boundingBox())?.y ?? 0).toBeLessThan(0);
    await page.keyboard.press('Tab');
    await expect(skip).toBeFocused();
    await expect(skip).toHaveAttribute('data-focus-visible', 'true');
    await expect.poll(async () => (await skip.boundingBox())?.y).toBe(8);
    expect(await skip.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe('solid');
  });

  test('moves focus past the navigation, and offers search next', async ({ page }) => {
    await openStory(page, 'vk-skiplink--page');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('main')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Read more' })).toBeFocused();
    expect(new URL(page.url()).hash).toBe('');

    await openStory(page, 'vk-skiplink--page');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const search = page.getByRole('link', { name: 'Skip to search' });
    await expect(search).toBeFocused();
    await expect(page.getByRole('link', { name: 'Skip to content' })).not.toBeInViewport();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('textbox', { name: 'Search' })).toBeFocused();
  });

  for (const theme of THEMES.slice(0, 2)) {
    for (const mode of MODES) {
      test(`focused · ${theme} · ${mode}`, async ({ page }) => {
        await openStory(page, 'vk-skiplink--page', { theme, mode });
        await page.keyboard.press('Tab');
        const skip = page.getByRole('link', { name: 'Skip to content' });
        await expect.poll(async () => (await skip.boundingBox())?.y).toBe(8);
        await expect(page).toHaveScreenshot(`focused-${theme}-${mode}.png`);
      });
    }
  }

  test('focused · right-to-left', async ({ page }) => {
    await openStory(page, 'vk-skiplink--page', { dir: 'rtl' });
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect.poll(async () => (await skip.boundingBox())?.y).toBe(8);
    await expect(page).toHaveScreenshot('focused-rtl.png');
  });
});

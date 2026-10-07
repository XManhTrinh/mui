import { expect, test, type Page } from '@playwright/test';
import { layoutSafetySuite } from './layout-safety';
import { MODES, THEMES } from './shots';
import { openStory } from './story';

const animationName = (page: Page) =>
  page.locator('.vk-skeleton').first().evaluate((el) => getComputedStyle(el).animationName);

test.describe('Skeleton visual regression', () => {
  for (const theme of THEMES) {
    for (const mode of MODES) {
      test(`cards · ${theme} · ${mode}`, async ({ page }) => {
        await openStory(page, 'vk-skeleton--cards', { theme, mode }, { animation: 'none' });
        await expect(page.getByTestId('skeleton')).toHaveScreenshot(`cards-${theme}-${mode}.png`);
      });
    }
  }

  for (const contrast of ['medium', 'high'] as const) {
    for (const mode of MODES) {
      test(`shapes · contrast ${contrast} · ${mode}`, async ({ page }) => {
        await openStory(page, 'vk-skeleton--shapes', { contrast, mode });
        await expect(page.getByTestId('shapes')).toHaveScreenshot(`shapes-${contrast}-${mode}.png`);
      });
    }
  }

  test('shapes · right-to-left', async ({ page }) => {
    await openStory(page, 'vk-skeleton--shapes', { dir: 'rtl' });
    await expect(page.getByTestId('shapes')).toHaveScreenshot('shapes-rtl.png');
  });

  test('shapes · forced colours keep an outline', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await openStory(page, 'vk-skeleton--shapes');
    const outline = await page
      .locator('.vk-skeleton')
      .first()
      .evaluate((el) => getComputedStyle(el).outlineStyle);
    expect(outline).toBe('solid');
    await expect(page.getByTestId('shapes')).toHaveScreenshot('shapes-forced-colors.png');
  });
});

test.describe('Skeleton motion', () => {
  test('pulses by default and shimmers when the group asks', async ({ page }) => {
    await openStory(page, 'vk-skeleton--cards');
    expect(await animationName(page)).toBe('vk-skeleton-pulse');
    await openStory(page, 'vk-skeleton--cards', {}, { animation: 'shimmer' });
    expect(await animationName(page)).toBe('vk-skeleton-shimmer');
    await openStory(page, 'vk-skeleton--cards', {}, { animation: 'none' });
    expect(await animationName(page)).toBe('none');
  });

  test('shimmer runs from the start edge, so it reverses in right-to-left', async ({ page }) => {
    await openStory(page, 'vk-skeleton--cards', { dir: 'rtl' }, { animation: 'shimmer' });
    const direction = await page
      .locator('.vk-skeleton')
      .first()
      .evaluate((el) => getComputedStyle(el).animationDirection);
    expect(direction).toBe('reverse');
  });

  test('stops under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const animation of ['pulse', 'shimmer']) {
      await openStory(page, 'vk-skeleton--cards', {}, { animation });
      expect(await animationName(page)).toBe('none');
    }
  });

  test('keeps animating under the standard motion scheme', async ({ page }) => {
    await openStory(page, 'vk-skeleton--cards', { motion: 'standard' });
    expect(await animationName(page)).toBe('vk-skeleton-pulse');
  });
});

test.describe('Skeleton text', () => {
  test('each line is as tall as the text it stands for', async ({ page }) => {
    await openStory(page, 'vk-skeleton--text-roles');
    for (const role of ['headline-small', 'title-medium', 'body-large', 'body-medium', 'label-small']) {
      const text = await page.getByTestId(`text-${role}`).boundingBox();
      const line = await page.getByTestId(`skeleton-${role}`).boundingBox();
      expect(line?.height, role).toBe(text?.height);
    }
  });

  test('the group is announced once and the placeholders are hidden', async ({ page }) => {
    await openStory(page, 'vk-skeleton--cards');
    await expect(page.getByRole('status')).toHaveText('Loading businesses');
    await expect(page.locator('[aria-busy="true"]')).toHaveCount(1);
    const visibleToAT = await page.locator('.vk-skeleton:not([aria-hidden="true"] *)').evaluateAll(
      (els) => els.filter((el) => el.getAttribute('aria-hidden') !== 'true').length,
    );
    expect(visibleToAT).toBe(0);
  });
});

test.describe('Skeleton layout safety', () => {
  // Full width follows the containing block, which `fixed` / `absolute` change.
  layoutSafetySuite('vk-skeleton--layout-override', {
    height: 96,
    radius: '8px',
    interactive: false,
  });
});

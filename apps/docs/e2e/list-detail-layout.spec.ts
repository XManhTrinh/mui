import { expect, test, type Page } from '@playwright/test';
import { layoutSafetySuite } from './layout-safety';
import { MODES, THEMES } from './shots';
import { openStory } from './story';

const WIDTHS = { compact: 360, medium: 700, expanded: 1000, large: 1280 } as const;

const pane = (page: Page, name: 'list' | 'detail') => page.locator(`[data-pane="${name}"]`);

test.describe('ListDetailLayout visual regression', () => {
  for (const theme of THEMES) {
    for (const mode of MODES) {
      test(`two panes · ${theme} · ${mode}`, async ({ page }) => {
        await page.setViewportSize({ width: WIDTHS.expanded, height: 640 });
        await openStory(page, 'vk-listdetaillayout--detail-open', { theme, mode });
        await expect(page.getByTestId('layout')).toHaveScreenshot(`two-panes-${theme}-${mode}.png`);
      });
    }
  }

  for (const contrast of ['medium', 'high'] as const) {
    test(`filled · contrast ${contrast}`, async ({ page }) => {
      await page.setViewportSize({ width: WIDTHS.expanded, height: 640 });
      await openStory(page, 'vk-listdetaillayout--filled', { contrast });
      await expect(page.getByTestId('layout')).toHaveScreenshot(`filled-${contrast}.png`);
    });
  }

  for (const [name, width] of Object.entries(WIDTHS)) {
    test(`detail open · ${name}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 640 });
      await openStory(page, 'vk-listdetaillayout--detail-open');
      await expect(page.getByTestId('layout')).toHaveScreenshot(`detail-${name}.png`);
    });
  }

  test('right-to-left puts the list on the right', async ({ page }) => {
    await page.setViewportSize({ width: WIDTHS.expanded, height: 640 });
    await openStory(page, 'vk-listdetaillayout--detail-open', { dir: 'rtl' });
    const list = await pane(page, 'list').boundingBox();
    const detail = await pane(page, 'detail').boundingBox();
    expect(list!.x).toBeGreaterThan(detail!.x);
    await expect(page.getByTestId('layout')).toHaveScreenshot('two-panes-rtl.png');
  });

  test('forced colours keep a border on filled panes', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await page.setViewportSize({ width: WIDTHS.expanded, height: 640 });
    await openStory(page, 'vk-listdetaillayout--filled');
    const border = await pane(page, 'list').evaluate((el) => getComputedStyle(el).borderTopStyle);
    expect(border).toBe('solid');
  });
});

test.describe('ListDetailLayout window size classes', () => {
  test('compact and medium show one pane; expanded and large show both', async ({ page }) => {
    for (const [name, width] of Object.entries(WIDTHS)) {
      await page.setViewportSize({ width, height: 640 });
      await openStory(page, 'vk-listdetaillayout--detail-open');
      const two = name === 'expanded' || name === 'large';
      await expect(pane(page, 'detail'), name).toBeVisible();
      await expect(pane(page, 'list'), name).toBeVisible({ visible: two });
      await expect(page.getByRole('button', { name: 'Back to settings' }), name).toBeVisible({
        visible: !two,
      });
    }
  });

  test('the list pane is 360px on expanded and 412px on large, with the 24px spacer', async ({
    page,
  }) => {
    for (const [width, listWidth] of [
      [WIDTHS.expanded, 360],
      [WIDTHS.large, 412],
    ] as const) {
      await page.setViewportSize({ width, height: 640 });
      await openStory(page, 'vk-listdetaillayout--detail-open');
      const list = (await pane(page, 'list').boundingBox())!;
      const detail = (await pane(page, 'detail').boundingBox())!;
      expect(list.width).toBe(listWidth);
      expect(detail.x - (list.x + list.width)).toBe(24);
    }
  });
});

test.describe('ListDetailLayout behaviour', () => {
  test('on a phone, opening an item shows it with focus, and Back returns to the list', async ({
    page,
  }) => {
    await page.setViewportSize({ width: WIDTHS.compact, height: 640 });
    await openStory(page, 'vk-listdetaillayout--settings');
    await expect(pane(page, 'detail')).toBeHidden();
    await page.getByText('Account', { exact: true }).click();
    await expect(pane(page, 'list')).toBeHidden();
    await expect(pane(page, 'detail')).toBeFocused();
    await expect(page.getByRole('heading', { name: 'Account' })).toBeVisible();
    await page.getByRole('button', { name: 'Back to settings' }).click();
    await expect(pane(page, 'list')).toBeVisible();
    await expect(pane(page, 'list')).toBeFocused();
  });

  test('on expanded windows, focus stays on the chosen item', async ({ page }) => {
    await page.setViewportSize({ width: WIDTHS.expanded, height: 640 });
    await openStory(page, 'vk-listdetaillayout--settings');
    await page.getByText('Account', { exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Account' })).toBeVisible();
    await expect(pane(page, 'detail')).not.toBeFocused();
  });

  test('the incoming pane slides in, and appears at once with reduced motion', async ({
    page,
  }) => {
    await page.setViewportSize({ width: WIDTHS.compact, height: 640 });
    await openStory(page, 'vk-listdetaillayout--settings');
    await page.getByText('Account', { exact: true }).click();
    const duration = await pane(page, 'detail').evaluate(
      (el) => getComputedStyle(el).transitionDuration,
    );
    expect(duration).not.toBe('0s');

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openStory(page, 'vk-listdetaillayout--settings');
    await page.getByText('Account', { exact: true }).click();
    const reduced = await pane(page, 'detail').evaluate(
      (el) => getComputedStyle(el).transitionDuration,
    );
    expect(reduced).toBe('0s');
  });

  test('a page load never animates', async ({ page }) => {
    await page.setViewportSize({ width: WIDTHS.compact, height: 640 });
    await openStory(page, 'vk-listdetaillayout--detail-open');
    const opacity = await pane(page, 'detail').evaluate((el) => getComputedStyle(el).opacity);
    expect(opacity).toBe('1');
  });
});

test.describe('ListDetailLayout layout safety', () => {
  layoutSafetySuite('vk-listdetaillayout--layout-override', {
    height: 56,
    radius: '0px',
    interactive: false,
  });
});

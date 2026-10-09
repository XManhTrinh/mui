import { expect, test, type Page } from '@playwright/test';
import { MODES, shotWithMargin, THEMES } from './shots';
import { openStory } from './story';

const settle = (page: Page) => page.waitForTimeout(600);
const area = (page: Page) => page.getByRole('group', { name: 'Photo position' });
const crop = async (page: Page) =>
  JSON.parse((await page.getByTestId('crop').textContent()) ?? 'null') as {
    x: number;
    y: number;
    width: number;
    height: number;
  };

test.describe('ImageCrop visual regression', () => {
  for (const theme of THEMES) {
    for (const mode of MODES) {
      test(`avatar · ${theme} · ${mode}`, async ({ page }) => {
        await openStory(page, 'vk-imagecrop--avatar', { theme, mode });
        await expect(area(page)).not.toHaveAttribute('data-loading');
        await expect(page.getByTestId('cropper')).toHaveScreenshot(`avatar-${theme}-${mode}.png`);
      });
    }
  }

  for (const contrast of ['medium', 'high'] as const) {
    test(`avatar · contrast ${contrast}`, async ({ page }) => {
      await openStory(page, 'vk-imagecrop--avatar', { contrast });
      await expect(area(page)).not.toHaveAttribute('data-loading');
      await expect(page.getByTestId('cropper')).toHaveScreenshot(`avatar-contrast-${contrast}.png`);
    });
  }

  test('portrait · rtl', async ({ page }) => {
    await openStory(page, 'vk-imagecrop--portrait', { dir: 'rtl' });
    await expect(area(page)).not.toHaveAttribute('data-loading');
    await expect(page.getByTestId('cropper')).toHaveScreenshot('portrait-rtl.png');
  });

  test('unreadable photo', async ({ page }) => {
    await openStory(page, 'vk-imagecrop--unreadable');
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByTestId('cropper')).toHaveScreenshot('unreadable.png');
  });

  test('focus ring', async ({ page }) => {
    await openStory(page, 'vk-imagecrop--avatar');
    await expect(area(page)).not.toHaveAttribute('data-loading');
    await page.keyboard.press('Tab');
    await expect(area(page)).toBeFocused();
    await shotWithMargin(page, area(page), 'focus-ring.png');
  });

  test('forced colours', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await openStory(page, 'vk-imagecrop--avatar');
    await expect(area(page)).not.toHaveAttribute('data-loading');
    await expect(page.getByTestId('cropper')).toHaveScreenshot('forced-colors.png');
  });

  for (const mode of MODES) {
    test(`dialog · phone · ${mode}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 760 });
      await openStory(page, 'vk-imagecrop--dialog', { mode });
      await page.getByRole('button', { name: 'Change photo' }).click();
      await expect(area(page)).not.toHaveAttribute('data-loading');
      await settle(page);
      await expect(page).toHaveScreenshot(`dialog-phone-${mode}.png`);
    });

    test(`dialog · desktop · ${mode}`, async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 800 });
      await openStory(page, 'vk-imagecrop--dialog', { mode });
      await page.getByRole('button', { name: 'Change photo' }).click();
      await expect(area(page)).not.toHaveAttribute('data-loading');
      await settle(page);
      await expect(page).toHaveScreenshot(`dialog-desktop-${mode}.png`);
    });
  }

  test('dialog · busy', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await openStory(page, 'vk-imagecrop--dialog-busy');
    await page.getByRole('button', { name: 'Change photo' }).click();
    await expect(area(page)).not.toHaveAttribute('data-loading');
    await settle(page);
    await expect(page).toHaveScreenshot('dialog-busy.png');
  });
});

test.describe('ImageCrop behaviour', () => {
  test('drags with the mouse and stops at the photo edge', async ({ page }) => {
    await openStory(page, 'vk-imagecrop--avatar');
    await expect(area(page)).not.toHaveAttribute('data-loading');
    const start = await crop(page);
    expect(start.width).toBe(start.height);
    const box = (await area(page).boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 20, box.y + box.height / 2, { steps: 4 });
    await page.mouse.up();
    expect((await crop(page)).x).toBeLessThan(start.x);
    // Far past the edge: the photo stops with its left edge at the frame.
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 2000, box.y + box.height / 2, { steps: 4 });
    await page.mouse.up();
    expect((await crop(page)).x).toBe(0);
  });

  test('the wheel zooms the photo, not the page', async ({ page }) => {
    await openStory(page, 'vk-imagecrop--avatar');
    await expect(area(page)).not.toHaveAttribute('data-loading');
    const start = await crop(page);
    const box = (await area(page).boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    const scrollBefore = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, -300);
    await expect.poll(async () => (await crop(page)).width).toBeLessThan(start.width);
    expect(await page.evaluate(() => window.scrollY)).toBe(scrollBefore);
  });

  test('keyboard only: move, zoom, reset', async ({ page }) => {
    await openStory(page, 'vk-imagecrop--avatar');
    await expect(area(page)).not.toHaveAttribute('data-loading');
    const start = await crop(page);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+ArrowRight');
    await page.keyboard.press('+');
    const moved = await crop(page);
    expect(moved.x).toBeLessThan(start.x + (start.width - moved.width) / 2);
    expect(moved.width).toBeLessThan(start.width);
    await page.keyboard.press('0');
    await expect.poll(() => crop(page)).toEqual(start);
  });

  test('the phone dialog fills the screen and keeps 48px targets', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 760 });
    await openStory(page, 'vk-imagecrop--dialog');
    await page.getByRole('button', { name: 'Change photo' }).click();
    const dialog = page.getByRole('dialog', { name: 'Adjust your photo' });
    await settle(page);
    expect(await dialog.boundingBox()).toMatchObject({ x: 0, y: 0, width: 390, height: 760 });
    for (const name of ['Close', 'Zoom out', 'Zoom in']) {
      const target = (await dialog
        .getByRole('button', { name })
        .locator('[data-touch-target]')
        .boundingBox())!;
      expect(target.height).toBeGreaterThanOrEqual(48);
    }
    // The area fits on screen with the zoom controls.
    const controls = (await dialog.getByRole('slider', { name: 'Zoom' }).boundingBox())!;
    expect(controls.y + controls.height).toBeLessThanOrEqual(760);
  });

  test('busy: Escape and the scrim do not close it', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await openStory(page, 'vk-imagecrop--dialog-busy');
    await page.getByRole('button', { name: 'Change photo' }).click();
    await page.keyboard.press('Escape');
    await page.mouse.click(10, 10);
    await settle(page);
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('progressbar', { name: 'Uploading' })).toBeVisible();
  });
});

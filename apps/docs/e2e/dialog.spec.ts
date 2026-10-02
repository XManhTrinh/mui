import { expect, test, type Page } from '@playwright/test';
import { MODES, THEMES } from './shots';
import { openStory } from './story';

const settle = (page: Page) => page.waitForTimeout(600);

test.describe('Dialog visual regression', () => {
  for (const theme of THEMES) {
    for (const mode of MODES) {
      test(`with icon · ${theme} · ${mode}`, async ({ page }) => {
        await openStory(page, 'components-dialog--with-icon', { theme, mode });
        await settle(page);
        await expect(page).toHaveScreenshot(`with-icon-${theme}-${mode}.png`);
      });
    }
  }

  test('long content · rtl', async ({ page }) => {
    await page.setViewportSize({ width: 420, height: 700 });
    await openStory(page, 'components-dialog--long-content', { dir: 'rtl' });
    await settle(page);
    // The dialog is portalled out of the RTL story root but keeps its direction.
    expect(
      await page.getByRole('dialog').evaluate((el) => getComputedStyle(el).direction),
    ).toBe('rtl');
    await expect(page).toHaveScreenshot('long-content-rtl.png');
  });
});

test.describe('Dialog behaviour', () => {
  test('opens with motion that settles to no transform, and is named by its title', async ({
    page,
  }) => {
    await openStory(page, 'components-dialog--basic');
    await page.getByRole('button', { name: 'Open dialog' }).click();
    const dialog = page.getByRole('dialog', { name: 'Discard draft?' });
    await expect(dialog).toBeVisible();
    await settle(page);
    const motion = dialog.locator('xpath=..');
    expect(await motion.evaluate((el) => getComputedStyle(el).scale)).toBe('none');
    expect(await motion.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
    const box = (await dialog.boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(280);
    expect(box.width).toBeLessThanOrEqual(560);
    expect(await dialog.evaluate((el) => getComputedStyle(el).borderTopLeftRadius)).toBe('28px');
  });

  test('traps focus, closes on Escape and returns focus to the trigger', async ({ page }) => {
    await openStory(page, 'components-dialog--basic');
    const trigger = page.getByRole('button', { name: 'Open dialog' });
    await trigger.click();
    const dialog = page.getByRole('dialog');
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true);
    }
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test('closes when pressing the scrim; alert dialogs do not', async ({ page }) => {
    await openStory(page, 'components-dialog--basic');
    await page.getByRole('button', { name: 'Open dialog' }).click();
    await page.mouse.click(10, 10);
    await expect(page.getByRole('dialog')).toHaveCount(0);

    await openStory(page, 'components-dialog--alert');
    await page.getByRole('button', { name: 'Reset settings' }).click();
    await page.mouse.click(10, 10);
    await settle(page);
    await expect(page.getByRole('alertdialog', { name: 'Reset all settings?' })).toBeVisible();
  });

  test('locks page scroll while open', async ({ page }) => {
    await openStory(page, 'components-dialog--basic');
    await page.getByRole('button', { name: 'Open dialog' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe(
      'hidden',
    );
  });

  test('long content scrolls inside; stacked actions put the confirm action on top', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 420, height: 700 });
    await openStory(page, 'components-dialog--long-content');
    await settle(page);
    const dialog = page.getByRole('dialog');
    const content = page.getByTestId('content');
    expect((await dialog.boundingBox())!.height).toBeLessThanOrEqual(700 - 48);
    expect(await content.evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(true);
    const accept = (await page.getByRole('button', { name: /Accept/ }).boundingBox())!;
    const decline = (await page.getByRole('button', { name: /Decline/ }).boundingBox())!;
    expect(accept.y).toBeLessThan(decline.y);
  });
});

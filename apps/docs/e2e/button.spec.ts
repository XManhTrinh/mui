import { expect, test } from '@playwright/test';
import { layoutSafetySuite } from './layout-safety';
import { MODES, THEMES, shotWithMargin } from './shots';
import { openStory } from './story';



test.describe('Button visual regression', () => {
  for (const theme of THEMES) {
    for (const mode of MODES) {
      test(`variants · ${theme} · ${mode}`, async ({ page }) => {
        await openStory(page, 'components-button--variants', { theme, mode });
        await expect(page.getByTestId('variants')).toHaveScreenshot(`variants-${theme}-${mode}.png`);
      });
    }
  }

  for (const contrast of ['medium', 'high'] as const) {
    for (const mode of MODES) {
      test(`variants · baseline · ${mode} · ${contrast} contrast`, async ({ page }) => {
        await openStory(page, 'components-button--variants', { mode, contrast });
        await expect(page.getByTestId('variants')).toHaveScreenshot(
          `variants-baseline-${mode}-${contrast}.png`,
        );
      });
    }
  }

  test('sizes and shapes', async ({ page }) => {
    await openStory(page, 'components-button--sizes-and-shapes');
    await expect(page.getByTestId('sizes')).toHaveScreenshot('sizes-and-shapes.png');
  });

  test('sizes and shapes · rtl', async ({ page }) => {
    await openStory(page, 'components-button--sizes-and-shapes', { dir: 'rtl' });
    await expect(page.getByTestId('sizes')).toHaveScreenshot('sizes-and-shapes-rtl.png');
  });
});

test.describe('Button interaction states', () => {
  test('hover, focus and press', async ({ page }) => {
    await openStory(page, 'components-button--playground', {}, { size: 'md' });
    const button = page.getByRole('button', { name: 'Button' });

    await button.hover();
    await expect(button).toHaveAttribute('data-hovered', 'true');
    await shotWithMargin(page, button, 'state-hover.png');

    await page.mouse.move(0, 0);
    await page.keyboard.press('Tab');
    await expect(button).toHaveAttribute('data-focus-visible', 'true');
    await shotWithMargin(page, button, 'state-focus.png');

    const box = (await button.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await expect(button).toHaveAttribute('data-pressed', 'true');
    // Pressed corners morph from full to medium (12px) on the effects spring.
    await expect
      .poll(() => button.evaluate((el) => getComputedStyle(el).borderTopLeftRadius))
      .toBe('12px');
    await page.mouse.up();
    await expect(button).not.toHaveAttribute('data-pressed');
    await expect
      .poll(() => button.evaluate((el) => getComputedStyle(el).borderTopLeftRadius))
      .toBe('28px');
  });

  test('toggle selection swaps the shape', async ({ page }) => {
    await openStory(page, 'components-button--toggle');
    const toggle = page.getByRole('button', { name: 'Star' });
    await toggle.click();
    const starred = page.getByRole('button', { name: 'Starred' });
    await expect(starred).toHaveAttribute('aria-pressed', 'true');
    await page.mouse.move(0, 0);
    // Round md toggle becomes square (large, 16px) when selected.
    await expect
      .poll(() => starred.evaluate((el) => getComputedStyle(el).borderTopLeftRadius))
      .toBe('16px');
  });

  test('XS buttons keep a 48px touch target without changing layout', async ({ page }) => {
    await openStory(page, 'components-button--playground', {}, { size: 'xs' });
    const button = page.getByRole('button', { name: 'Button' });
    const box = (await button.boundingBox())!;
    expect(box.height).toBe(32);
    // A point 7px above the visual edge still lands on the button.
    const hit = await page.evaluate(
      ({ x, y }) => document.elementFromPoint(x, y)?.closest('button') !== null,
      { x: box.x + box.width / 2, y: box.y - 7 },
    );
    expect(hit).toBe(true);
  });
});

test.describe('Button layout safety', () => {
  layoutSafetySuite('components-button--layout-override', { height: 40, radius: '20px' });
});

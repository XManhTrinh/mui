import { expect, test } from '@playwright/test';
import { layoutSafetySuite } from './layout-safety';
import { MODES, THEMES } from './shots';
import { openStory } from './story';

test.describe('PinInput visual regression', () => {
  for (const theme of THEMES) {
    for (const mode of MODES) {
      test(`variants · ${theme} · ${mode}`, async ({ page }) => {
        await openStory(page, 'vk-pininput--variants', { theme, mode });
        await expect(page.getByTestId('variants')).toHaveScreenshot(`variants-${theme}-${mode}.png`);
      });
    }
  }

  for (const mode of MODES) {
    for (const story of ['sizes', 'corners', 'types'] as const) {
      test(`${story} · ${mode}`, async ({ page }) => {
        await openStory(page, `vk-pininput--${story}`, { mode });
        await expect(page.getByTestId(story)).toHaveScreenshot(`${story}-${mode}.png`);
      });
    }
  }

  for (const contrast of ['medium', 'high'] as const) {
    test(`variants · contrast ${contrast}`, async ({ page }) => {
      await openStory(page, 'vk-pininput--variants', { contrast });
      await expect(page.getByTestId('variants')).toHaveScreenshot(`variants-contrast-${contrast}.png`);
    });
  }

  test('types · right-to-left keeps the code left to right', async ({ page }) => {
    await openStory(page, 'vk-pininput--types', { dir: 'rtl' });
    await expect(page.getByTestId('types')).toHaveScreenshot('types-rtl.png');
  });

  test('variants · forced colours', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await openStory(page, 'vk-pininput--variants');
    await expect(page.getByTestId('variants')).toHaveScreenshot('variants-forced-colors.png');
  });

  test('focused · the active box', async ({ page }) => {
    await openStory(page, 'vk-pininput--interactive');
    await page.getByLabel('6-digit code').pressSequentially('12');
    await expect(page.getByTestId('interactive')).toHaveScreenshot('interactive-focus.png');
  });

  test('phone width · the boxes shrink to fit', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await openStory(page, 'vk-pininput--phone');
    const fits = await page.getByTestId('phone').evaluate((el) => {
      const right = el.getBoundingClientRect().right;
      const boxes = [...el.querySelectorAll('[data-state]')].map((box) => box.getBoundingClientRect());
      const overlap = boxes.some((box, i) => i > 0 && box.top === boxes[i - 1]!.top && box.left < boxes[i - 1]!.right);
      return boxes.every((box) => box.right <= right + 0.5) && !overlap;
    });
    expect(fits).toBe(true);
    await expect(page.getByTestId('phone')).toHaveScreenshot('phone.png');
  });
});

test.describe('PinInput behaviour', () => {
  test('typing fills the boxes and completes the code', async ({ page }) => {
    await openStory(page, 'vk-pininput--interactive');
    const input = page.getByLabel('6-digit code');
    await input.pressSequentially('123456');
    await expect(page.getByTestId('result')).toHaveText('ok');
    await expect(page.getByTestId('interactive').locator('[data-filled]')).toHaveCount(6);
  });

  test('a pasted code is cleaned and submitted', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await openStory(page, 'vk-pininput--interactive');
    const input = page.getByLabel('6-digit code');
    await input.focus();
    await page.evaluate(() => navigator.clipboard.writeText('Your code: 123 456'));
    await page.keyboard.press('ControlOrMeta+V');
    await expect(input).toHaveValue('123456');
    await expect(page.getByTestId('result')).toHaveText('ok');
  });

  test('a wrong code is announced and cleared', async ({ page }) => {
    await openStory(page, 'vk-pininput--interactive');
    const input = page.getByLabel('6-digit code');
    await input.pressSequentially('111111');
    await expect(page.getByTestId('result')).toHaveText('wrong');
    await expect(input).toHaveValue('');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription(/That code didn't work/);
  });

  test('clicking a box puts the caret there', async ({ page }) => {
    await openStory(page, 'vk-pininput--variants');
    const field = page.getByLabel('Complete').first();
    const boxes = page.locator('[data-variant="outlined"]').filter({ has: field }).locator('[data-state]');
    // The invisible input covers the boxes, so the click lands on it at the box's position.
    await boxes.nth(2).click({ force: true });
    await expect(boxes.nth(2)).toHaveAttribute('data-state', 'focus');
    await page.keyboard.type('9');
    await expect(field).toHaveValue('129456');
  });

  test('one-time-code autofill and the number pad are offered', async ({ page }) => {
    await openStory(page, 'vk-pininput--interactive');
    const input = page.getByLabel('6-digit code');
    await expect(input).toHaveAttribute('autocomplete', 'one-time-code');
    await expect(input).toHaveAttribute('inputmode', 'numeric');
    const fontSize = await input.evaluate((el) => getComputedStyle(el).fontSize);
    expect(fontSize).toBe('16px');
  });

  test('the caret stops blinking under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openStory(page, 'vk-pininput--interactive');
    await page.getByLabel('6-digit code').focus();
    const caret = page.locator('.vk-pin-caret');
    await expect(caret).toBeVisible();
    expect(await caret.evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
  });
});

test.describe('PinInput layout safety', () => {
  layoutSafetySuite('vk-pininput--layout-override', {
    height: 56,
    width: 4 * 48 + 3 * 8,
    radius: '0px',
    interactive: false,
    check: async (_page, target) => {
      // The input still covers the boxes, whatever the consumer's layout classes.
      const covers = await target.evaluate((el) => {
        const input = el.querySelector('input')!.getBoundingClientRect();
        const boxes = el.querySelector('[aria-hidden="true"]')!.getBoundingClientRect();
        return Math.abs(input.width - boxes.width) < 1 && Math.abs(input.height - boxes.height) < 1;
      });
      expect(covers).toBe(true);
    },
  });
});

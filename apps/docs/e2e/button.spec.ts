import { expect, test, type Locator, type Page } from '@playwright/test';
import { openStory } from './story';

/** Screenshot of an element plus a margin, so the outline focus ring is included. */
async function shotWithMargin(page: Page, locator: Locator, name: string, margin = 8) {
  const box = (await locator.boundingBox())!;
  await expect(page).toHaveScreenshot(name, {
    clip: {
      x: box.x - margin,
      y: box.y - margin,
      width: box.width + margin * 2,
      height: box.height + margin * 2,
    },
  });
}

const THEMES = ['baseline', 'ocean', 'forest', 'sunset', 'rose', 'slate'];
const MODES = ['light', 'dark'] as const;

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

/** Architecture §10: consumer layout classes must never break the component. */
test.describe('Button layout safety', () => {
  const overrides = [
    'none',
    'fixed',
    'absolute',
    'sticky',
    'static',
    'overflowHidden',
    'overflowVisible',
    'fullWidth',
    'transform',
  ];

  for (const override of overrides) {
    for (const transformedAncestor of [false, true]) {
      for (const dir of ['ltr', 'rtl'] as const) {
        const name = `${override}${transformedAncestor ? ' · transformed ancestor' : ''} · ${dir}`;
        test(name, async ({ page }) => {
          await openStory(
            page,
            'components-button--layout-override',
            { dir },
            { override, transformedAncestor },
          );
          const button = page.getByTestId('target');
          // Layout size (not the on-screen box, which a rotate transform enlarges).
          const size = await button.evaluate((el) => ({
            height: (el as HTMLElement).offsetHeight,
            width: (el as HTMLElement).offsetWidth,
          }));
          expect(size.height).toBe(40);
          if (override !== 'fullWidth') expect(size.width).toBeLessThan(200);

          const style = await button.evaluate((el) => {
            const s = getComputedStyle(el);
            return {
              backgroundImage: s.backgroundImage,
              radius: s.borderTopLeftRadius,
              positionedDescendants: [...el.querySelectorAll('*')].filter(
                (child) =>
                  child.closest('[data-touch-target]') === null &&
                  ['absolute', 'fixed'].includes(getComputedStyle(child).position),
              ).length,
            };
          });
          expect(style.backgroundImage).toContain('linear-gradient');
          expect(style.radius).toBe('20px');
          expect(style.positionedDescendants).toBe(0);

          await button.click();
          await expect(page.getByTestId('count')).toHaveText('Pressed 1');
          await page.keyboard.press('Shift+Tab');
          await page.keyboard.press('Tab');
          await expect(button).toHaveAttribute('data-focus-visible', 'true');
          expect(await button.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe('solid');
        });
      }
    }
  }
});

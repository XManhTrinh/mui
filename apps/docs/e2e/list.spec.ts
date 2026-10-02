import { expect, test, type Locator } from '@playwright/test';
import { layoutSafetySuite } from './layout-safety';
import { MODES, THEMES, shotWithMargin } from './shots';
import { openStory } from './story';

const rect = (locator: Locator) =>
  locator.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return {
      x: Math.round(r.x),
      y: Math.round(r.y),
      width: Math.round(r.width),
      height: Math.round(r.height),
    };
  });
const radius = (locator: Locator) =>
  locator.evaluate((el) => {
    const s = getComputedStyle(el);
    return [s.borderTopLeftRadius, s.borderBottomLeftRadius];
  });

test.describe('List visual regression', () => {
  for (const theme of THEMES) {
    for (const mode of MODES) {
      test(`segmented · ${theme} · ${mode}`, async ({ page }) => {
        await openStory(page, 'components-list--static', { theme, mode });
        await expect(page.getByTestId('static')).toHaveScreenshot(`segmented-${theme}-${mode}.png`);
      });
    }
  }

  test('standard', async ({ page }) => {
    await openStory(page, 'components-list--static', {}, { variant: 'standard' });
    await expect(page.getByTestId('static')).toHaveScreenshot('standard.png');
  });

  test('selection · rtl', async ({ page }) => {
    await openStory(page, 'components-list--selection', { dir: 'rtl' });
    await expect(page.getByTestId('selection')).toHaveScreenshot('selection-rtl.png');
  });
});

test.describe('List geometry and interaction', () => {
  test('items follow Compose padding, spacing and heights', async ({ page }) => {
    await openStory(page, 'components-list--static');
    const items = page.getByRole('listitem');
    const heights = await Promise.all(
      [0, 1, 2, 3].map(async (i) => (await rect(items.nth(i))).height),
    );
    expect(heights).toEqual([56, 72, 88, 56]);
    const first = await rect(items.nth(0));
    const icon = await rect(items.nth(0).locator('svg').first());
    expect(icon.x - first.x).toBe(16);
    const text = await rect(items.nth(0).getByText('One line'));
    expect(text.x - first.x).toBe(16 + 24 + 12);
    // Segmented: 2px apart, outer corners 16px, inner 4px.
    expect((await rect(items.nth(1))).y - (first.y + first.height)).toBe(2);
    expect(await radius(items.nth(0))).toEqual(['16px', '4px']);
    expect(await radius(items.nth(1))).toEqual(['4px', '4px']);
    expect(await radius(items.nth(3))).toEqual(['4px', '16px']);
  });

  test('hover, focus and press morph the corners', async ({ page }) => {
    await openStory(page, 'components-list--interactive');
    const starred = page.getByRole('row', { name: /Starred/ });
    await starred.hover();
    await expect(starred).toHaveAttribute('data-shape', 'hovered');
    await expect.poll(() => radius(starred)).toEqual(['12px', '12px']);
    await shotWithMargin(page, starred, 'state-hover.png', 4);
    await page.mouse.move(0, 0);
    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowDown');
    await expect(starred).toBeFocused();
    await expect(starred).toHaveAttribute('data-shape', 'active');
    await expect.poll(() => radius(starred)).toEqual(['16px', '16px']);
    await shotWithMargin(page, starred, 'state-focus.png', 4);
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('last')).toHaveText('Opened starred');
  });

  test('← / → reach the trailing switch', async ({ page }) => {
    await openStory(page, 'components-list--interactive');
    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('row', { name: /Sent/ })).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('switch', { name: 'Notify for sent mail' })).toBeFocused();
  });

  test('selection toggles the selected colours', async ({ page }) => {
    await openStory(page, 'components-list--selection');
    const home = page.getByRole('row', { name: /Home/ });
    await home.click();
    await expect(home).toHaveAttribute('aria-selected', 'true');
    await expect.poll(() => radius(home)).toEqual(['16px', '16px']);
  });
});

test.describe('List layout safety', () => {
  layoutSafetySuite('components-list--layout-override', {
    height: 114,
    width: 360,
    radius: '0px',
    interactive: false,
    async check(page, target) {
      await target.getByRole('row', { name: 'Search' }).click();
      await expect(page.getByTestId('count')).toHaveText('Pressed 1');
    },
  });
});

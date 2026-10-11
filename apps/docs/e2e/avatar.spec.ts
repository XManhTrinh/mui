import { expect, test } from '@playwright/test';
import { layoutSafetySuite } from './layout-safety';
import { MODES, THEMES } from './shots';
import { openStory } from './story';

test.describe('Avatar visual regression', () => {
  for (const theme of THEMES) {
    for (const mode of MODES) {
      test(`variants · ${theme} · ${mode}`, async ({ page }) => {
        await openStory(page, 'vk-avatar--variants', { theme, mode });
        await expect(page.getByTestId('variants')).toHaveScreenshot(
          `variants-${theme}-${mode}.png`,
        );
      });
    }
  }

  for (const mode of MODES) {
    test(`tones · ${mode}`, async ({ page }) => {
      await openStory(page, 'vk-avatar--tones', { mode });
      await expect(page.getByTestId('tones')).toHaveScreenshot(`tones-${mode}.png`);
    });
    test(`sizes · ${mode}`, async ({ page }) => {
      await openStory(page, 'vk-avatar--sizes', { mode });
      await expect(page.getByTestId('sizes')).toHaveScreenshot(`sizes-${mode}.png`);
    });
    test(`groups · ${mode}`, async ({ page }) => {
      await openStory(page, 'vk-avatar--groups', { mode });
      await expect(page.getByTestId('groups')).toHaveScreenshot(`groups-${mode}.png`);
    });
  }

  for (const contrast of ['medium', 'high'] as const) {
    test(`variants · contrast ${contrast}`, async ({ page }) => {
      await openStory(page, 'vk-avatar--variants', { contrast });
      await expect(page.getByTestId('variants')).toHaveScreenshot(
        `variants-contrast-${contrast}.png`,
      );
    });
  }

  test('groups · right-to-left', async ({ page }) => {
    await openStory(page, 'vk-avatar--groups', { dir: 'rtl' });
    await expect(page.getByTestId('groups')).toHaveScreenshot('groups-rtl.png');
  });

  test('variants · forced colours', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await openStory(page, 'vk-avatar--variants');
    await expect(page.getByTestId('variants')).toHaveScreenshot('variants-forced-colors.png');
  });

  test('interactive · focus ring', async ({ page }) => {
    await openStory(page, 'vk-avatar--interactive');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: "Minh's profile" })).toBeFocused();
    await expect(page.getByTestId('interactive')).toHaveScreenshot('interactive-focus.png');
  });
});

test.describe('Avatar behaviour', () => {
  test('a broken photo shows the initials', async ({ page }) => {
    await openStory(page, 'vk-avatar--broken-image');
    const img = page.getByTestId('broken').locator('img');
    await expect(img).toHaveAttribute('data-status', 'error');
    await expect(img).toBeHidden();
    await expect(page.getByTestId('broken').getByText('OH')).toBeVisible();
  });

  test('a loaded photo hides the initials beneath it', async ({ page }) => {
    await openStory(page, 'vk-avatar--sizes');
    const photo = page.getByRole('img', { name: 'Omar' }).first();
    await expect(photo.locator('img')).toHaveAttribute('data-status', 'loaded');
    await expect(photo.getByText('OH')).toBeHidden();
  });

  test('small interactive avatars keep a 48px touch target', async ({ page }) => {
    await openStory(page, 'vk-avatar--interactive');
    const target = page.getByTestId('xs').locator('[data-touch-target]');
    const box = await target.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(48);
    expect(box?.height).toBeGreaterThanOrEqual(48);
    await page.getByTestId('xs').click();
    await expect(page.getByTestId('count')).toHaveText('Pressed 1');
  });

  test('the state layer shows on hover', async ({ page }) => {
    await openStory(page, 'vk-avatar--interactive');
    const link = page.getByRole('link', { name: "Minh's profile" });
    await link.hover();
    await expect(link).toHaveAttribute('data-hovered', 'true');
    const layer = await link
      .locator('span span span')
      .last()
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(layer).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('a group overlaps toward the end edge, mirrored in right-to-left', async ({ page }) => {
    for (const dir of ['ltr', 'rtl'] as const) {
      await openStory(page, 'vk-avatar--groups', { dir });
      const items = page.getByTestId('group-overlap').locator(':scope > *');
      const first = await items.nth(0).boundingBox();
      const second = await items.nth(1).boundingBox();
      if (!first || !second) throw new Error('missing avatars');
      if (dir === 'ltr') expect(second.x).toBeLessThan(first.x + first.width);
      else expect(second.x + second.width).toBeGreaterThan(first.x);
      await expect(page.getByRole('group', { name: 'An, Lan and 4 others' })).toBeVisible();
    }
  });

  test('apps can override the status colours with CSS variables', async ({ page }) => {
    await openStory(page, 'vk-avatar--variants');
    const online = page.locator('[data-presence="online"]').first().locator(':scope > span').nth(1);
    const before = await online.evaluate((el) => getComputedStyle(el).backgroundColor);
    await page.addStyleTag({ content: ':root { --vk-avatar-online: rgb(0, 128, 0); }' });
    await expect
      .poll(() => online.evaluate((el) => getComputedStyle(el).backgroundColor))
      .toBe('rgb(0, 128, 0)');
    expect(before).not.toBe('rgb(0, 128, 0)');
  });

  test('apps can recolour an auto slot with any colour, or override with classes', async ({
    page,
  }) => {
    await openStory(page, 'vk-avatar--tones');
    const slotColour = await page
      .getByTestId('slot-override')
      .locator(':scope > span')
      .first()
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(slotColour).toBe('rgb(22, 163, 74)');
    const classOverride = await page
      .getByTestId('class-override')
      .locator(':scope > span')
      .first()
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(classOverride).toBe('rgb(14, 165, 233)');
  });

  test('badge and presence placements mirror in right-to-left', async ({ page }) => {
    for (const dir of ['ltr', 'rtl'] as const) {
      await openStory(page, 'vk-avatar--variants', { dir });
      const avatar = page.getByTestId('placed');
      const box = await avatar.boundingBox();
      const presence = await avatar.locator(':scope > span').nth(1).boundingBox();
      if (!box || !presence) throw new Error('missing avatar');
      const atStart =
        dir === 'ltr'
          ? presence.x <= box.x + 1
          : presence.x + presence.width >= box.x + box.width - 1;
      expect(atStart, dir).toBe(true);
      expect(presence.y).toBeLessThanOrEqual(box.y + 1);
    }
  });

  test('every auto slot is used across names', async ({ page }) => {
    await openStory(page, 'vk-avatar--tones');
    const tones = await page
      .getByTestId('tones')
      .locator('[data-tone]')
      .evaluateAll((els) => els.map((el) => el.getAttribute('data-tone')));
    expect(new Set(tones).size).toBeGreaterThan(6);
  });

  test('+N opens the full list', async ({ page }) => {
    await openStory(page, 'vk-avatar--groups');
    await page.getByRole('button', { name: '4 more' }).click();
    await expect(page.getByTestId('opened')).toHaveText('Opened 1');
  });
});

test.describe('Avatar layout safety', () => {
  layoutSafetySuite('vk-avatar--layout-override', {
    height: 40,
    width: 40,
    radius: '9999px',
    interactive: false,
  });
});

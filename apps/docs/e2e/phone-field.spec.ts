import { expect, test } from '@playwright/test';
import { MODES, THEMES } from './shots';
import { openStory } from './story';

test.describe('PhoneField visual regression', () => {
  for (const theme of THEMES) {
    for (const mode of MODES) {
      test(`variants · ${theme} · ${mode}`, async ({ page }) => {
        await openStory(page, 'vk-phonefield--variants', { theme, mode });
        await expect(page.getByTestId('variants')).toHaveScreenshot(`variants-${theme}-${mode}.png`);
      });
    }
  }

  for (const contrast of ['medium', 'high'] as const) {
    test(`variants · contrast ${contrast}`, async ({ page }) => {
      await openStory(page, 'vk-phonefield--variants', { contrast });
      await expect(page.getByTestId('variants')).toHaveScreenshot(`variants-contrast-${contrast}.png`);
    });
  }

  for (const mode of MODES) {
    test(`open picker · ${mode}`, async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 700 });
      await openStory(page, 'vk-phonefield--interactive', { mode });
      await page.getByRole('button', { name: /Country$/ }).click();
      await expect(page.getByRole('listbox')).toBeVisible();
      await expect(page).toHaveScreenshot(`picker-popover-${mode}.png`);
    });
  }

  test('open picker · phone bottom sheet', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openStory(page, 'vk-phonefield--interactive');
    await page.getByRole('button', { name: /Country$/ }).click();
    await expect(page.getByRole('listbox')).toBeVisible();
    await page.waitForTimeout(600);
    await expect(page).toHaveScreenshot('picker-sheet.png');
  });

  test('vietnamese', async ({ page }) => {
    await openStory(page, 'vk-phonefield--vietnamese');
    await expect(page.getByTestId('vietnamese')).toHaveScreenshot('vietnamese.png');
  });

  test('flags', async ({ page }) => {
    await openStory(page, 'vk-phonefield--flags');
    await expect(page.getByTestId('flags')).toHaveScreenshot('flags.png');
  });

  test('variants · right-to-left keeps the number left to right', async ({ page }) => {
    await openStory(page, 'vk-phonefield--variants', { dir: 'rtl' });
    await expect(page.getByTestId('variants')).toHaveScreenshot('variants-rtl.png');
  });

  test('variants · forced colours', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await openStory(page, 'vk-phonefield--variants');
    await expect(page.getByTestId('variants')).toHaveScreenshot('variants-forced-colors.png');
  });
});

test.describe('PhoneField behaviour', () => {
  test('typing formats the number and reports E.164', async ({ page }) => {
    await openStory(page, 'vk-phonefield--interactive');
    const input = page.getByLabel('Phone (optional)');
    await input.pressSequentially('07400123456');
    await expect(input).toHaveValue('07400 123456');
    await expect(page.getByTestId('value')).toHaveText('+447400123456');
  });

  test('a pasted international number picks its country', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await openStory(page, 'vk-phonefield--interactive');
    const input = page.getByLabel('Phone (optional)');
    await input.focus();
    await page.evaluate(() => navigator.clipboard.writeText('+61 412 345 678'));
    await page.keyboard.press('ControlOrMeta+V');
    await expect(page.getByTestId('country')).toHaveText('AU');
    await expect(page.getByTestId('value')).toHaveText('+61412345678');
    await expect(input).toHaveValue('0412 345 678');
  });

  test('the picker searches and picks with the keyboard, then returns focus to its button', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 800, height: 700 });
    await openStory(page, 'vk-phonefield--interactive');
    await page.getByRole('button', { name: /Country$/ }).click();
    const search = page.getByRole('searchbox', { name: 'Search countries' });
    await expect(search).toBeFocused();
    await search.fill('viet');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('listbox')).toBeHidden();
    await expect(page.getByTestId('country')).toHaveText('VN');
    await expect(page.getByRole('button', { name: /Country$/ })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByLabel('Phone (optional)')).toBeFocused();
  });

  test('Escape closes the picker without changing the country', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 700 });
    await openStory(page, 'vk-phonefield--interactive');
    await page.getByRole('button', { name: /Country$/ }).click();
    await expect(page.getByRole('listbox')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('listbox')).toBeHidden();
    await expect(page.getByTestId('country')).toHaveText('GB');
  });

  test('phone keypad and telephone autofill', async ({ page }) => {
    await openStory(page, 'vk-phonefield--interactive');
    const input = page.getByLabel('Phone (optional)');
    await expect(input).toHaveAttribute('inputmode', 'tel');
    await expect(input).toHaveAttribute('autocomplete', 'tel');
  });
});

test.describe('PhoneField layout safety', () => {
  const overrides = ['none', 'fixed', 'absolute', 'sticky', 'static', 'overflowHidden', 'fullWidth', 'transform'];
  for (const override of overrides) {
    for (const transformedAncestor of [false, true]) {
      for (const dir of ['ltr', 'rtl'] as const) {
        test(`${override}${transformedAncestor ? ' · transformed ancestor' : ''} · ${dir}`, async ({
          page,
        }) => {
          await openStory(page, 'vk-phonefield--layout-override', { dir }, { override, transformedAncestor });
          const field = page.getByTestId('target');
          const country = field.getByRole('button', { name: /Country$/ });
          // The country field (a Select): its 56px container, laid out in the flow.
          const container = country.locator('xpath=ancestor::div[@data-field-state][1]/div[1]');
          expect(await container.evaluate((el) => (el as HTMLElement).offsetHeight)).toBe(56);
          expect(await container.evaluate((el) => getComputedStyle(el).position)).toBe('relative');
          const input = page.getByLabel('Phone');
          await input.fill('07400123456');
          await expect(input).toHaveValue('07400 123456');
          await country.click();
          await expect(page.getByRole('listbox')).toBeVisible();
        });
      }
    }
  }
});

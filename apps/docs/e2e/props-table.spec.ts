import { expect, test } from '@playwright/test';
import { MODES, THEMES } from './shots';
import { openStory } from './story';

test.describe('PropsTable visual regression', () => {
  for (const theme of THEMES) {
    for (const mode of MODES) {
      test(`props · ${theme} · ${mode}`, async ({ page }) => {
        await openStory(page, 'vk-propstable--playground', { theme, mode });
        await expect(page.getByTestId('props-table')).toHaveScreenshot(`props-${theme}-${mode}.png`);
      });
    }
  }

  test('empty state renders head without rows', async ({ page }) => {
    await openStory(page, 'vk-propstable--empty');
    await expect(page.getByTestId('props-table')).toHaveScreenshot('empty.png');
  });
});

test.describe('PropsTable interaction', () => {
  test('the scroll region is keyboard focusable', async ({ page }) => {
    await openStory(page, 'vk-propstable--long-type');
    const region = page.getByRole('region', { name: 'Overflow' });
    await expect(region).toHaveAttribute('tabindex', '0');
    await region.focus();
    await expect(region).toBeFocused();
  });
});

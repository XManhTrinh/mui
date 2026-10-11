import { expect, test } from '@playwright/test';
import { openStory } from './story';

const png = { name: 'photo.png', mimeType: 'image/png', buffer: Buffer.from('png') };

test.describe('FileTrigger', () => {
  test('a button opens the picker and reports the file, twice for the same one', async ({
    page,
  }) => {
    await openStory(page, 'vk-filetrigger--triggers');
    for (const attempt of [1, 2]) {
      const chooser = page.waitForEvent('filechooser');
      await page.getByRole('button', { name: 'Upload photo' }).click();
      await (await chooser).setFiles(png);
      await expect(page.getByTestId('chosen')).toHaveText(`${attempt} · photo.png`);
    }
  });

  test('the keyboard opens it from an icon button whose tooltip still shows', async ({ page }) => {
    await openStory(page, 'vk-filetrigger--triggers');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Add photos' })).toBeFocused();
    await expect(page.getByRole('tooltip')).toHaveText('Add photos');
    const chooser = page.waitForEvent('filechooser');
    await page.keyboard.press('Enter');
    const picked = await chooser;
    expect(picked.isMultiple()).toBe(true);
    await picked.setFiles([png, { ...png, name: 'second.png' }]);
    await expect(page.getByTestId('chosen')).toHaveText('1 · photo.png, second.png');
  });

  test('a menu item opens it through useFileTrigger', async ({ page }) => {
    await openStory(page, 'vk-filetrigger--triggers');
    await page.getByRole('button', { name: 'Cover photo' }).click();
    const chooser = page.waitForEvent('filechooser');
    await page.getByRole('menuitem', { name: 'Upload photo' }).click();
    await (await chooser).setFiles(png);
    await expect(page.getByTestId('chosen')).toHaveText('1 · photo.png');
  });
});

import { expect, test } from '@playwright/test';
import { MODES, THEMES } from './shots';
import { openStory } from './story';

test.describe('CodeBlock visual regression', () => {
  // Across every theme and both modes the syntax colours must resolve from the
  // `--shiki-*` custom properties bound to the `--md-sys-color-*` roles.
  for (const theme of THEMES) {
    for (const mode of MODES) {
      test(`token colours · ${theme} · ${mode}`, async ({ page }) => {
        await openStory(page, 'vk-codeblock--token-colours', { theme, mode });
        await expect(page.getByTestId('code-block')).toHaveScreenshot(
          `token-colours-${theme}-${mode}.png`,
        );
      });
    }
  }

  test('line numbers', async ({ page }) => {
    await openStory(page, 'vk-codeblock--line-numbers');
    await expect(page.getByTestId('code-block')).toHaveScreenshot('line-numbers.png');
  });
});

test.describe('CodeBlock interaction', () => {
  test('copying the source flips data-copied and swaps the label', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await openStory(page, 'vk-codeblock--with-title');
    const block = page.getByTestId('code-block').locator('> div');
    const copy = page.getByRole('button', { name: 'Copy' });
    await copy.click();
    await expect(block).toHaveAttribute('data-copied', 'true');
    await expect(page.getByRole('button', { name: 'Copied' })).toBeVisible();
  });
});

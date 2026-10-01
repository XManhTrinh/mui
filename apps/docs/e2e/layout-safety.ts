import { expect, test } from '@playwright/test';
import { openStory } from './story';

const OVERRIDES = [
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

export interface LayoutSafetyExpectations {
  /** Layout height in px. */
  height: number;
  /** Layout width in px, checked for every override except `fullWidth`. */
  width?: number;
  /** Computed top-left corner radius at rest. */
  radius: string;
}

/**
 * Architecture §10 override matrix for a story that renders `data-testid="target"` with a
 * `override` arg and counts presses in `data-testid="count"`. Every consumer layout class,
 * with and without a transformed ancestor, in both directions, must keep the component's
 * size, corners, background state layer, press handling and outline focus ring.
 */
export function layoutSafetySuite(storyId: string, expected: LayoutSafetyExpectations) {
  for (const override of OVERRIDES) {
    for (const transformedAncestor of [false, true]) {
      for (const dir of ['ltr', 'rtl'] as const) {
        const name = `${override}${transformedAncestor ? ' · transformed ancestor' : ''} · ${dir}`;
        test(name, async ({ page }) => {
          await openStory(page, storyId, { dir }, { override, transformedAncestor });
          const target = page.getByTestId('target');
          // Layout size, not the on-screen box (which a rotate transform enlarges).
          const layout = await target.evaluate((el) => {
            const s = getComputedStyle(el);
            return {
              height: (el as HTMLElement).offsetHeight,
              width: (el as HTMLElement).offsetWidth,
              backgroundImage: s.backgroundImage,
              radius: s.borderTopLeftRadius,
              positionedDescendants: [...el.querySelectorAll('*')].filter(
                (child) =>
                  child.closest('[data-touch-target]') === null &&
                  ['absolute', 'fixed'].includes(getComputedStyle(child).position),
              ).length,
            };
          });
          expect(layout.height).toBe(expected.height);
          if (expected.width !== undefined && override !== 'fullWidth') {
            expect(layout.width).toBe(expected.width);
          }
          expect(layout.backgroundImage).toContain('linear-gradient');
          expect(layout.radius).toBe(expected.radius);
          expect(layout.positionedDescendants).toBe(0);

          await target.click();
          await expect(page.getByTestId('count')).toHaveText('Pressed 1');
          await page.keyboard.press('Shift+Tab');
          await page.keyboard.press('Tab');
          await expect(target).toHaveAttribute('data-focus-visible', 'true');
          expect(await target.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe('solid');
        });
      }
    }
  }
}

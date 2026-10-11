// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  collectClasses,
  nonLiteralClasses,
  uncompiledClasses,
} from '../../../test/tailwind-classes';
import { shapedIconStyles } from './shaped-icon-styles';

function* outputs() {
  for (const size of ['sm', 'md', 'lg', 'xl'] as const)
    for (const tone of ['primary', 'secondary', 'tertiary', 'neutral', 'error'] as const)
      for (const shape of ['circle', 'expressive'] as const) {
        const slots = shapedIconStyles({ size, tone, shape });
        for (const slot of Object.values(slots)) yield slot();
      }
}

describe('shapedIconStyles', () => {
  const classes = collectClasses(outputs());

  it('writes every class literally so Tailwind can find it', async () => {
    expect(
      await nonLiteralClasses(new URL('./shaped-icon-styles.ts', import.meta.url), classes),
    ).toEqual([]);
  });

  it('only uses classes that Tailwind and the M3 stylesheet generate', async () => {
    expect(await uncompiledClasses(classes)).toEqual([]);
  });
});

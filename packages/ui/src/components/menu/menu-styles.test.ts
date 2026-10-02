// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  collectClasses,
  nonLiteralClasses,
  uncompiledClasses,
} from '../../../test/tailwind-classes';
import { menuStyles } from './menu-styles';

const POSITIONS = ['only', 'first', 'middle', 'last'] as const;

function* outputs() {
  for (const variant of ['standard', 'vibrant'] as const)
    for (const groupPosition of POSITIONS)
      for (const itemPosition of POSITIONS)
        for (const hasDescription of [false, true])
          yield* Object.values(
            menuStyles({ variant, groupPosition, itemPosition, hasDescription }),
          ).map((slot) => slot());
}

describe('menuStyles', () => {
  const classes = collectClasses(outputs());

  it('writes every class literally so Tailwind can find it', async () => {
    expect(await nonLiteralClasses(new URL('./menu-styles.ts', import.meta.url), classes)).toEqual(
      [],
    );
  });

  it('only uses classes that Tailwind and the M3 stylesheet generate', async () => {
    expect(await uncompiledClasses(classes)).toEqual([]);
  });
});

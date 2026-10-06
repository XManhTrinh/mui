// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  collectClasses,
  nonLiteralClasses,
  uncompiledClasses,
} from '../../../test/tailwind-classes';
import { propsTableStyles } from './props-table-styles';

function* outputs() {
  const slots = propsTableStyles();
  yield* [
    slots.scroll(),
    slots.table(),
    slots.caption(),
    slots.thead(),
    slots.row(),
    slots.th(),
    slots.nameCell(),
    slots.td(),
    slots.nameText(),
    slots.code(),
    slots.required(),
    slots.description(),
  ];
}

describe('propsTableStyles', () => {
  const classes = collectClasses(outputs());

  it('writes every class literally so Tailwind can find it', async () => {
    expect(
      await nonLiteralClasses(new URL('./props-table-styles.ts', import.meta.url), classes),
    ).toEqual([]);
  });

  it('only uses classes that Tailwind and the M3 stylesheet generate', async () => {
    expect(await uncompiledClasses(classes)).toEqual([]);
  });
});

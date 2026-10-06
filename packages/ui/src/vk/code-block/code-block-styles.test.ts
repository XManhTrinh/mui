// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  collectClasses,
  nonLiteralClasses,
  uncompiledClasses,
} from '../../../test/tailwind-classes';
import { codeBlockStyles } from './code-block-styles';

function* outputs(showLineNumbers: boolean) {
  const slots = codeBlockStyles({ showLineNumbers });
  yield* [slots.root(), slots.header(), slots.title(), slots.pre(), slots.code()];
}

describe('codeBlockStyles', () => {
  const allClasses = collectClasses([...outputs(false), ...outputs(true)]);
  // The line-number variant uses pseudo-element counter utilities; the semantic-token
  // contract that drives theming lives in the default variant, checked for generation below.
  const defaultClasses = collectClasses(outputs(false));

  it('writes every class literally so Tailwind can find it', async () => {
    expect(
      await nonLiteralClasses(new URL('./code-block-styles.ts', import.meta.url), allClasses),
    ).toEqual([]);
  });

  it('only uses classes that Tailwind and the M3 stylesheet generate', async () => {
    expect(await uncompiledClasses(defaultClasses)).toEqual([]);
  });

  it('binds the Shiki token custom properties to semantic colour roles', () => {
    const root = codeBlockStyles().root();
    expect(root).toContain('[--shiki-token-keyword:var(--md-sys-color-primary)]');
    expect(root).toContain('[--shiki-token-string:var(--md-sys-color-tertiary)]');
    expect(root).toContain('[--shiki-token-comment:var(--md-sys-color-on-surface-variant)]');
    expect(root).toContain('[--shiki-foreground:var(--md-sys-color-on-surface)]');
  });
});

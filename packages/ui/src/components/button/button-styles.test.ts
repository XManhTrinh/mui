// @vitest-environment node
import { compile } from '@tailwindcss/node';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { buttonStyles } from './button-styles';

const VARIANTS = ['filled', 'elevated', 'tonal', 'outlined', 'text'] as const;
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
const SHAPES = ['round', 'square'] as const;

/** Every class the recipe can emit, across all variant combinations and slots. */
function allClasses(): string[] {
  const classes = new Set<string>();
  for (const variant of VARIANTS)
    for (const size of SIZES)
      for (const shape of SHAPES)
        for (const toggle of [false, true])
          for (const hasLeadingIcon of [false, true]) {
            const slots = buttonStyles({ variant, size, shape, toggle, hasLeadingIcon });
            for (const slot of [slots.root, slots.content, slots.label, slots.icon]) {
              for (const c of slot().split(/\s+/)) if (c) classes.add(c);
            }
          }
  return [...classes];
}

describe('buttonStyles', () => {
  const classes = allClasses();

  it('writes every class literally so Tailwind can find it', async () => {
    const source = await readFile(
      fileURLToPath(new URL('./button-styles.ts', import.meta.url)),
      'utf8',
    );
    const missing = classes.filter((c) => !source.includes(c));
    expect(missing).toEqual([]);
  });

  it('only uses classes that Tailwind and the M3 stylesheet generate', async () => {
    const base = fileURLToPath(new URL('../../styles/', import.meta.url));
    const compiler = await compile(`@import 'tailwindcss';\n@import './styles.css';`, {
      base,
      onDependency: () => {},
    });
    const css = compiler.build(classes);
    const escape = (c: string) => c.replace(/[^a-zA-Z0-9_-]/g, (ch) => `\\${ch}`);
    const unknown = classes.filter((c) => !css.includes(`.${escape(c)}`));
    expect(unknown).toEqual([]);
  });
});

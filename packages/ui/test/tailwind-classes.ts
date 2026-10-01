import { compile } from '@tailwindcss/node';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const stylesDir = fileURLToPath(new URL('../src/styles/', import.meta.url));

/** Splits slot outputs into individual classes. */
export function collectClasses(outputs: Iterable<string>): string[] {
  const classes = new Set<string>();
  for (const output of outputs) for (const c of output.split(/\s+/)) if (c) classes.add(c);
  return [...classes];
}

/** Classes that do not appear literally in the source file (Tailwind would never see them). */
export async function nonLiteralClasses(sourceUrl: URL, classes: string[]): Promise<string[]> {
  const source = await readFile(fileURLToPath(sourceUrl), 'utf8');
  return classes.filter((c) => !source.includes(c));
}

/** Classes that Tailwind plus the M3 stylesheet do not generate a rule for. */
export async function uncompiledClasses(classes: string[]): Promise<string[]> {
  const compiler = await compile(`@import 'tailwindcss';\n@import './styles.css';`, {
    base: stylesDir,
    onDependency: () => {},
  });
  const css = compiler.build(classes);
  const escape = (c: string) => c.replace(/[^a-zA-Z0-9_-]/g, (ch) => `\\${ch}`);
  return classes.filter((c) => !css.includes(`.${escape(c)}`));
}

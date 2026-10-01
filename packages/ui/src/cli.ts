#!/usr/bin/env node
import { writeFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { createTheme } from './theme/create-theme';
import {
  CONTRAST_LEVEL_NAMES,
  SCHEME_VARIANTS,
  type ContrastLevel,
  type SchemeVariant,
} from './tokens/color';

const USAGE = `Usage: npx @vkieu/mui theme --seed <hex> --name <name> [options]

Generates a static CSS colour theme (light, dark and system modes for each
contrast level) using the Material 3 2025 colour spec.

Options:
  --seed <hex>          Seed colour, e.g. "#0B57D0" (required)
  --name <name>         Theme name for data-theme, lowercase kebab-case (required)
  --variant <variant>   ${SCHEME_VARIANTS.join(' | ')} (default: tonal-spot)
  --contrast <levels>   Comma-separated: ${CONTRAST_LEVEL_NAMES.join(',')} (default: all)
  --out <file>          Write to a file instead of stdout
  -h, --help            Show this message
`;

function fail(message: string): never {
  process.stderr.write(`Error: ${message}\n\n${USAGE}`);
  process.exit(1);
}

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    seed: { type: 'string' },
    name: { type: 'string' },
    variant: { type: 'string', default: 'tonal-spot' },
    contrast: { type: 'string', default: CONTRAST_LEVEL_NAMES.join(',') },
    out: { type: 'string' },
    help: { type: 'boolean', short: 'h' },
  },
});

if (values.help) {
  process.stdout.write(USAGE);
  process.exit(0);
}
if (positionals[0] !== 'theme') fail('unknown command. Only "theme" is supported.');
if (!values.seed) fail('--seed is required.');
if (!values.name) fail('--name is required.');
if (!(SCHEME_VARIANTS as readonly string[]).includes(values.variant)) {
  fail(`--variant must be one of ${SCHEME_VARIANTS.join(', ')}.`);
}
const contrast = values.contrast.split(',').map((level) => level.trim());
for (const level of contrast) {
  if (!(CONTRAST_LEVEL_NAMES as readonly string[]).includes(level)) {
    fail(`unknown contrast level "${level}".`);
  }
}

let css: string;
try {
  css = createTheme({
    name: values.name,
    seed: values.seed,
    variant: values.variant as SchemeVariant,
    contrast: contrast as ContrastLevel[],
  }).css;
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}

const output = `/* @vkieu/mui theme "${values.name}" from ${values.seed} (${values.variant}). */\n\n${css}\n`;
if (values.out) {
  await writeFile(values.out, output);
  process.stderr.write(`Wrote ${values.out}\n`);
} else {
  process.stdout.write(output);
}

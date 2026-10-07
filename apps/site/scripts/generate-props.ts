/**
 * Generates one props JSON per public component for `PropsTable`, from the library's
 * TypeScript public API, using `react-docgen-typescript`. Run before `build`/`dev`
 * (see package.json), writing to the gitignored `apps/site/.generated/props/` directory,
 * so the tables can never drift from the code.
 *
 * The output shape matches `PropsTableRow` (name/type/required/defaultValue?/description?),
 * so a component page can later do `rows={json.props}` straight into `PropsTable`.
 */
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { argv } from 'node:process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { withCustomConfig } from 'react-docgen-typescript';

const here = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(here, '..');
const uiRoot = resolve(siteRoot, '../../packages/ui');
const tsconfigPath = join(uiRoot, 'tsconfig.json');
const indexPath = join(uiRoot, 'src/index.ts');
const sourceRoots = [join(uiRoot, 'src/components'), join(uiRoot, 'src/composites')];
const outDir = join(siteRoot, '.generated/props');

type Parser = ReturnType<typeof withCustomConfig>;

export interface PropsRecord {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description?: string;
  /** For enum (string-literal union) props: the member values, used by the Playground. */
  options?: string[];
}

export interface ComponentPropsFile {
  displayName: string;
  description: string;
  props: PropsRecord[];
}

/** Reads `index.ts` and collects the capitalised value exports from components/composites. */
async function resolveAllowlist(): Promise<Set<string>> {
  const source = await readFile(indexPath, 'utf8');
  const allow = new Set<string>();
  const block = /export\s*\{([^}]*)\}\s*from\s*['"]\.\/(?:components|composites)\/[^'"]+['"]/g;
  for (const match of source.matchAll(block)) {
    for (const raw of match[1]!.split(',')) {
      const part = raw.trim();
      if (!part || part.startsWith('type ')) continue;
      const name = part
        .split(/\s+as\s+/)
        .pop()!
        .trim();
      if (/^[A-Z]/.test(name)) allow.add(name);
    }
  }
  return allow;
}

async function collectSources(dirs: string[]): Promise<string[]> {
  const files: string[] = [];
  for (const dir of dirs) {
    const entries = await readdir(dir, { recursive: true, withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith('.tsx')) continue;
      if (/\.test\.tsx$/.test(entry.name)) continue;
      if (/Context\.tsx$/.test(entry.name)) continue;
      files.push(join(entry.parentPath, entry.name));
    }
  }
  return files;
}

/** A react-docgen prop `type` as far as we read it (name + optional enum member values). */
export interface DocgenPropType {
  name?: string;
  value?: unknown;
}

/**
 * Pure core: extracts the enum member list from a docgen prop `type`. Returns the string
 * members (surrounding quotes stripped, `undefined` dropped) for a string-literal union, or
 * `undefined` for a non-enum type or an empty list. Testable in isolation.
 */
export function enumOptionsFromType(type: DocgenPropType | undefined): string[] | undefined {
  if (!type || type.name !== 'enum' || !Array.isArray(type.value)) return undefined;
  const options = (type.value as { value?: unknown }[])
    .map((member) => String(member.value).replace(/^"|"$/g, ''))
    .filter((value) => value !== 'undefined');
  return options.length > 0 ? options : undefined;
}

/** Pure core: parse each file and keep the docgen entries in the allowlist. Testable. */
export function extractProps(
  files: string[],
  parser: Parser,
  allow: Set<string>,
): ComponentPropsFile[] {
  const records: ComponentPropsFile[] = [];
  for (const file of files) {
    try {
      for (const doc of parser.parse(file)) {
        if (!allow.has(doc.displayName)) continue;
        const props: PropsRecord[] = Object.values(doc.props).map((prop) => {
          // Enum (string-literal union) props carry their members in `type.value`; emit them
          // as `options` (quotes stripped) so the Playground can build a segmented control.
          const options = enumOptionsFromType(prop.type);
          return {
            name: prop.name,
            type: prop.type?.name ?? 'unknown',
            required: prop.required,
            ...(prop.defaultValue?.value != null
              ? { defaultValue: String(prop.defaultValue.value) }
              : {}),
            ...(prop.description ? { description: prop.description } : {}),
            ...(options && options.length > 0 ? { options } : {}),
          };
        });
        records.push({ displayName: doc.displayName, description: doc.description ?? '', props });
      }
    } catch (error) {
      console.warn(`[generate-props] skipped ${file}: ${(error as Error).message}`);
    }
  }
  return records;
}

async function main(): Promise<void> {
  let allow: Set<string>;
  try {
    allow = await resolveAllowlist();
    if (allow.size === 0) throw new Error('no public components found in index.ts');
  } catch (error) {
    console.error(
      `[generate-props] cannot resolve the public component allowlist: ${(error as Error).message}`,
    );
    process.exit(1);
  }

  const parser = withCustomConfig(tsconfigPath, {
    savePropValueAsString: true,
    shouldExtractLiteralValuesFromEnum: true,
    shouldRemoveUndefinedFromOptional: true,
    propFilter: (prop) => !prop.parent || !/node_modules/.test(prop.parent.fileName),
  });

  const files = await collectSources(sourceRoots);
  const records = extractProps(files, parser, allow);

  try {
    await rm(outDir, { recursive: true, force: true });
    await mkdir(outDir, { recursive: true });
    await Promise.all(
      records.map((record) =>
        writeFile(
          join(outDir, `${record.displayName}.json`),
          `${JSON.stringify(record, null, 2)}\n`,
        ),
      ),
    );
  } catch (error) {
    console.error(`[generate-props] cannot write ${outDir}: ${(error as Error).message}`);
    process.exit(1);
  }

  console.log(`[generate-props] wrote ${records.length} files to ${outDir}`);
}

// Run only when invoked directly as a script, not when imported (e.g. by a unit test).
if (argv[1] && import.meta.url === pathToFileURL(argv[1]).href) {
  await main();
}

import { readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

/**
 * One data-driven smoke suite covering EVERY page of the static export: the home page, the six
 * guide pages, the component gallery, and all component slugs under `/components/<slug>`.
 *
 * The slug list is ENUMERATED from the static export output (`out/components`), which is produced
 * by the `[slug]` route's `generateStaticParams()` (i.e. the component registry) — never a stale
 * hardcoded list. The suite builds first via the `test:e2e` turbo task (`dependsOn: ["build"]`),
 * so `out/` exists at collection time.
 *
 * For each page it asserts: it renders (a `main` landmark + a visible level-1 heading), it emits
 * NO console errors / page errors, it passes an axe accessibility scan, and it works in RTL and
 * in dark mode. Tabs-based ExampleViewer panels (date-/time-picker) hydrate client-side and are
 * empty at SSR; Playwright always queries the hydrated DOM, so these pass legitimately.
 */
const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, '../out');
const componentsOut = join(outDir, 'components');

/** Matches the port in `playwright.config.ts`; only used if the baseURL fixture is unset. */
const DEFAULT_BASE_URL = 'http://localhost:4317';

/** The six fixed guide routes (from `app/(docs)/sections.tsx`), plus home and the gallery. */
const GUIDE_ROUTES = [
  '/getting-started',
  '/theming',
  '/motion',
  '/customisation',
  '/accessibility',
  '/nextjs',
] as const;

/** Enumerate component slugs from the export output (the real `generateStaticParams` result). */
function enumerateSlugs(): string[] {
  if (!existsSync(outDir)) {
    throw new Error(
      `[smoke] no static export at ${outDir}. Build the site first ` +
        `(the \`test:e2e\` turbo task depends on \`build\`).`,
    );
  }
  const slugs = new Set<string>();
  for (const entry of readdirSync(componentsOut, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.html')) {
      slugs.add(entry.name.slice(0, -'.html'.length));
    } else if (entry.isDirectory() && existsSync(join(componentsOut, entry.name, 'index.html'))) {
      slugs.add(entry.name);
    }
  }
  return [...slugs].sort();
}

const SLUGS = enumerateSlugs();
const COMPONENT_ROUTES = SLUGS.map((slug) => `/components/${slug}`);
const ALL_ROUTES = ['/', ...GUIDE_ROUTES, '/components', ...COMPONENT_ROUTES] as const;

interface Variant {
  dir?: 'rtl';
  dark?: boolean;
}

/**
 * Navigates to `url` under the given variant and asserts the page is healthy: it renders a
 * `main` landmark and a visible H1, emits no console/page errors, passes an axe scan, and — for
 * the RTL/dark variants — carries the expected `dir` / `data-mode` on `<html>`.
 */
async function assertPageHealthy(
  page: Page,
  baseURL: string,
  url: string,
  variant: Variant,
): Promise<void> {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  if (variant.dir === 'rtl') {
    // Flip the whole tree to RTL before any page script runs; `<html>` has
    // suppressHydrationWarning and React does not manage `dir`, so it sticks after hydration.
    await page.addInitScript(() => document.documentElement.setAttribute('dir', 'rtl'));
  }
  if (variant.dark) {
    // ThemeScript (pre-paint) and ThemeProvider (hydration) both read this cookie (storage
    // defaults to 'cookie', key 'vkieu-mui-theme') and resolve dark, writing data-mode="dark".
    await page.context().addCookies([
      {
        name: 'vkieu-mui-theme',
        value: encodeURIComponent('mode=dark'),
        url: baseURL,
      },
    ]);
  }

  await page.goto(url);

  await expect(page.locator('main')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();

  if (variant.dir === 'rtl') {
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  }
  if (variant.dark) {
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'dark');
  }

  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations,
    `axe violations on ${url}: ${results.violations.map((v) => v.id).join(', ')}`,
  ).toEqual([]);

  await page.waitForLoadState('load');
  expect(errors, `console/page errors on ${url}:\n${errors.join('\n')}`).toEqual([]);
}

for (const url of ALL_ROUTES) {
  test.describe(url, () => {
    test('renders (LTR / default mode)', async ({ page, baseURL }) => {
      await assertPageHealthy(page, baseURL ?? DEFAULT_BASE_URL, url, {});
    });
    test('renders in dark mode', async ({ page, baseURL }) => {
      await assertPageHealthy(page, baseURL ?? DEFAULT_BASE_URL, url, { dark: true });
    });
    test('renders in RTL', async ({ page, baseURL }) => {
      await assertPageHealthy(page, baseURL ?? DEFAULT_BASE_URL, url, { dir: 'rtl' });
    });
  });
}

test('component gallery lists exactly the generated slugs', async ({ page }) => {
  await page.goto('/components');
  await expect(page.getByRole('heading', { level: 1, name: 'Components' })).toBeVisible();

  const hrefs = await page.locator('a[href^="/components/"]').evaluateAll((anchors) =>
    anchors.map((a) => (a as HTMLAnchorElement).getAttribute('href') ?? ''),
  );
  const linkedSlugs = new Set(
    hrefs
      .map((href) => href.replace(/[?#].*$/, '').replace(/\/$/, ''))
      .filter((href) => href.startsWith('/components/'))
      .map((href) => href.slice('/components/'.length))
      .filter((slug) => slug !== '' && !slug.includes('/')),
  );
  expect([...linkedSlugs].sort()).toEqual(SLUGS);
});

test('theming page has a live theme switcher', async ({ page }) => {
  await page.goto('/theming');
  // The live demo (ThemeSwitcherDemo) renders inside the page article; scope to it so the
  // app-bar's own ThemeControls (also a "Theme: baseline" button) doesn't match.
  const demo = page.getByRole('article');
  await expect(demo.getByRole('button', { name: /Theme: baseline/ })).toBeVisible();
});

test('motion page has a live spring demo', async ({ page }) => {
  await page.goto('/motion');
  await expect(page.getByRole('button', { name: /Animate spatial \/ fast/ })).toBeVisible();
});

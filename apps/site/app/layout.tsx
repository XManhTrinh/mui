import { DEFAULT_THEME_STATE, ThemeProvider, getThemeScriptSource } from '@vkieu/mui';
import { NextRouterProvider } from '@vkieu/mui/next';
import type { Metadata } from 'next';
import { Roboto_Flex } from 'next/font/google';
import type { ReactNode } from 'react';
import { InlineScript } from '../components/inline-script';
import { DocsShell } from './(docs)/docs-shell';
import { GUIDE_ENTRIES, type SearchEntry } from './(docs)/search-index';
import { COMPONENT_PAGES } from '../content/components/registry';
import { DIRECTION_SCRIPT } from './direction';
import './globals.css';

const robotoFlex = Roboto_Flex({
  subsets: ['latin'],
  axes: ['wdth', 'opsz', 'GRAD'],
  variable: '--md-ref-typeface-brand',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '@vkieu/mui',
  description: 'Documentation for @vkieu/mui — Material Design 3 Expressive for React.',
};

/**
 * The search index is built here, on the server, because the component registry imports
 * page bodies that read example source from disk. Building it in the root layout lets the
 * one shell (top bar + rail) wrap every route, the homepage included.
 */
const SEARCH_ENTRIES: SearchEntry[] = [
  ...GUIDE_ENTRIES,
  ...COMPONENT_PAGES.map((page) => ({
    title: page.title,
    summary: page.summary,
    href: `/components/${page.slug}`,
    ...(page.keywords && { keywords: page.keywords }),
  })),
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={robotoFlex.variable}>
      <head>
        {/*
         * Pre-paint theme + direction init. `InlineScript` runs synchronously in <head>
         * before first paint (server renders it as executable `text/javascript`), so the
         * stored theme/mode/contrast/direction are applied with no flash on the static export
         * — home and component pages alike — while rendering inert on the client so React 19
         * doesn't warn about a script tag. The theme source is the library's
         * `getThemeScriptSource`; the core `ThemeScript` is left untouched.
         */}
        <InlineScript html={getThemeScriptSource({ defaults: DEFAULT_THEME_STATE })} />
        <InlineScript html={DIRECTION_SCRIPT} />
      </head>
      <body
        className="bg-surface text-on-surface font-plain"
        style={{ ['--md-ref-typeface-plain' as string]: 'var(--md-ref-typeface-brand)' }}
      >
        <NextRouterProvider>
          <ThemeProvider
            defaultTheme={DEFAULT_THEME_STATE.theme}
            defaultMode={DEFAULT_THEME_STATE.mode}
            defaultContrast={DEFAULT_THEME_STATE.contrast}
            defaultMotion={DEFAULT_THEME_STATE.motion}
          >
            <DocsShell searchEntries={SEARCH_ENTRIES}>{children}</DocsShell>
          </ThemeProvider>
        </NextRouterProvider>
      </body>
    </html>
  );
}

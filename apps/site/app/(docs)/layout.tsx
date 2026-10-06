import type { ReactNode } from 'react';
import { COMPONENT_PAGES } from '../../content/components/registry';
import { DocsShell } from './docs-shell';
import { GUIDE_ENTRIES, type SearchEntry } from './search-index';

/**
 * The search index is built here, on the server, because the component registry imports
 * page bodies that read example source from disk.
 */
const SEARCH_ENTRIES: SearchEntry[] = [
  ...GUIDE_ENTRIES,
  ...COMPONENT_PAGES.map((page) => ({
    title: page.title,
    summary: page.summary,
    href: `/components/${page.slug}`,
  })),
];

export default function DocsLayout({ children }: { children: ReactNode }) {
  return <DocsShell searchEntries={SEARCH_ENTRIES}>{children}</DocsShell>;
}

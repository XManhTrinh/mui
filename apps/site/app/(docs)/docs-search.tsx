'use client';

import { List, ListItem, SearchBar } from '@vkieu/mui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SearchIcon } from '../../components/icons';
import { searchPages, type SearchEntry } from './search-index';

/**
 * Searches the documentation pages by title and summary: a library `SearchBar` whose
 * expanded view lists the matches as a library `List`. Choosing one navigates to it.
 */
export function DocsSearch({
  entries,
  view,
  className,
}: {
  entries: SearchEntry[];
  view: 'docked' | 'full-screen';
  className?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  const results = searchPages(entries, query);

  const open = (href: string) => {
    setExpanded(false);
    setQuery('');
    router.push(href);
  };

  return (
    <SearchBar
      aria-label="Search documentation"
      placeholder="Search"
      leadingIcon={<SearchIcon />}
      view={view}
      value={query}
      onChange={setQuery}
      expanded={expanded}
      onExpandedChange={setExpanded}
      onSubmit={() => {
        if (results[0]) open(results[0].href);
      }}
      className={className}
    >
      {results.length > 0 ? (
        <List aria-label="Matching pages" onAction={(key) => open(String(key))}>
          {results.map((entry) => (
            <ListItem key={entry.href} textValue={entry.title} supportingText={entry.summary}>
              {entry.title}
            </ListItem>
          ))}
        </List>
      ) : (
        <p className="ps-4 pe-4 pt-4 pb-4 text-body-medium text-on-surface-variant">
          No pages match “{query}”.
        </p>
      )}
    </SearchBar>
  );
}

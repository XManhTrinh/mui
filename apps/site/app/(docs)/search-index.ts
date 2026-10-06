/** A page the documentation search can find. */
export interface SearchEntry {
  title: string;
  summary: string;
  href: string;
}

/** The guide pages, with the summaries the search shows. */
export const GUIDE_ENTRIES: SearchEntry[] = [
  {
    title: 'Getting started',
    summary: 'Install the library with or without Tailwind, load the font, add icons and routing.',
    href: '/getting-started',
  },
  {
    title: 'Theming',
    summary: 'Themes, light and dark mode, contrast levels, custom themes and no theme flash.',
    href: '/theming',
  },
  {
    title: 'Motion',
    summary: 'The expressive and standard motion schemes, springs and reduced motion.',
    href: '/motion',
  },
  {
    title: 'Customisation',
    summary: 'Override tokens, themes and classes; extend variants; layout safety.',
    href: '/customisation',
  },
  {
    title: 'Accessibility',
    summary: 'WCAG 2.2 AA, required names, keyboard behaviour and right-to-left.',
    href: '/accessibility',
  },
  {
    title: 'Next.js',
    summary: 'App Router and Pages Router setup, client boundaries and the Next.js helpers.',
    href: '/nextjs',
  },
];

/** Pages matching a query on their title (first) or summary, at most `limit` of them. */
export function searchPages(entries: SearchEntry[], query: string, limit = 8): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return entries.slice(0, limit);
  const byTitle = entries.filter((entry) => entry.title.toLowerCase().includes(q));
  const bySummary = entries.filter(
    (entry) => !byTitle.includes(entry) && entry.summary.toLowerCase().includes(q),
  );
  return [...byTitle, ...bySummary].slice(0, limit);
}

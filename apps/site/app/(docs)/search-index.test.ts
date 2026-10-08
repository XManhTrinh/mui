import { describe, expect, it } from 'vitest';
import { COMPONENT_META } from '../../content/components/catalog';
import { searchPages, type SearchEntry } from './search-index';

const entries: SearchEntry[] = COMPONENT_META.map((meta) => ({
  title: meta.title,
  summary: meta.summary,
  href: `/components/${meta.slug}`,
  ...(meta.keywords && { keywords: meta.keywords }),
}));

describe('searchPages', () => {
  it('finds a component by title', () => {
    expect(searchPages(entries, 'pin')[0]?.href).toBe('/components/pin-input');
  });

  it('finds a component by a keyword that is in neither title nor summary', () => {
    expect(searchPages(entries, '2fa').map((entry) => entry.href)).toContain(
      '/components/pin-input',
    );
    expect(searchPages(entries, 'otp').map((entry) => entry.href)).toContain(
      '/components/pin-input',
    );
  });

  it('finds the phone field by the words people use for it', () => {
    for (const query of ['telephone', 'country code', 'mobile']) {
      expect(
        searchPages(entries, query).map((entry) => entry.href),
        query,
      ).toContain('/components/phone-field');
    }
  });

  it('ranks title matches before summary and keyword matches', () => {
    const results = searchPages(entries, 'text field');
    expect(results[0]?.href).toBe('/components/text-field');
  });
});

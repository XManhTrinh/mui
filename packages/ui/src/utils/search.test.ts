import { describe, expect, it } from 'vitest';
import { matchesSearch, normalizeSearch } from './search';

describe('search', () => {
  it('ignores case and accents, and folds đ to d', () => {
    expect(normalizeSearch('  Việt Nam ')).toBe('viet nam');
    expect(normalizeSearch('Đà Nẵng')).toBe('da nang');
    expect(matchesSearch("Côte d'Ivoire", 'cote')).toBe(true);
    expect(matchesSearch('Hà Nội', 'noi')).toBe(true);
    expect(matchesSearch('London', 'paris')).toBe(false);
    expect(matchesSearch('London', '')).toBe(true);
  });
});

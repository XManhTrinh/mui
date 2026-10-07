import { describe, expect, it } from 'vitest';
import { getInitials } from './get-initials';

describe('getInitials', () => {
  it('takes the first letters of the first and last words', () => {
    expect(getInitials('Nguyễn Văn An')).toBe('NA');
    expect(getInitials('Lan Pham')).toBe('LP');
  });

  it('keeps Vietnamese diacritics with their letters', () => {
    expect(getInitials('Đỗ Ứng')).toBe('ĐỨ');
    expect(getInitials('ức ệ')).toBe('ỨỆ');
  });

  it('treats decomposed input like composed input', () => {
    expect(getInitials('Ứng Đỗ')).toBe('ỨĐ');
  });

  it('uses one letter for one word and ignores extra spaces', () => {
    expect(getInitials('  Minh  ')).toBe('M');
    expect(getInitials('Phở   Sài    Gòn')).toBe('PG');
  });

  it('skips punctuation-only words and leading punctuation', () => {
    expect(getInitials('(Lan) - Pham')).toBe('LP');
  });

  it('keeps an emoji as one grapheme', () => {
    expect(getInitials('👩‍🍳 Chef')).toBe('👩‍🍳C');
  });

  it('upper-cases for the locale', () => {
    expect(getInitials('ilker', 'tr')).toBe('İ');
    expect(getInitials('ilker', 'en')).toBe('I');
  });

  it('returns an empty string without letters', () => {
    expect(getInitials('')).toBe('');
    expect(getInitials('  - ')).toBe('');
  });
});

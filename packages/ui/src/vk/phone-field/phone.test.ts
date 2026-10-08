import { describe, expect, it } from 'vitest';
import { countryOptions, matchesCountry } from './countries';
import { dialCode, formatPhone, phoneCountry, phoneProblem, readPhone } from './phone';

describe('readPhone', () => {
  it('reads national numbers in the chosen country as E.164', () => {
    expect(readPhone('07400 123456', 'GB')).toMatchObject({
      value: '+447400123456',
      country: 'GB',
      formatted: '07400 123456',
      complete: true,
    });
    expect(readPhone('4155552671', 'US').value).toBe('+14155552671');
    expect(readPhone('0912345678', 'VN')).toMatchObject({ value: '+84912345678', complete: true });
    expect(readPhone('0412345678', 'AU').value).toBe('+61412345678');
  });

  it('switches country for a pasted or autofilled international number', () => {
    expect(readPhone('+61 412 345 678', 'GB')).toMatchObject({
      value: '+61412345678',
      country: 'AU',
    });
    expect(readPhone('0084912345678', 'GB')).toMatchObject({
      value: '+84912345678',
      country: 'VN',
    });
    expect(readPhone('+44 7400 123456', 'US').country).toBe('GB');
    expect(readPhone('+1 416 555 0123', 'US').country).toBe('US');
  });

  it('is empty without digits and incomplete while typing', () => {
    expect(readPhone('', 'GB').value).toBe('');
    expect(readPhone('  ', 'GB').value).toBe('');
    expect(readPhone('0791', 'GB').complete).toBe(false);
  });
});

describe('phone helpers', () => {
  it('formats stored numbers nationally in their own country', () => {
    expect(formatPhone('+447400123456', 'GB')).toBe('07400 123456');
    expect(formatPhone('+447400123456', 'US')).toBe('+44 7400 123456');
    expect(formatPhone('', 'GB')).toBe('');
    expect(formatPhone('+44740012', 'GB')).toBe('+44 7400 12');
  });

  it('knows a number’s country, dialling codes and validity', () => {
    expect(phoneCountry('+84912345678')).toBe('VN');
    expect(phoneCountry('+447400123456')).toBe('GB');
    // +44 is shared: 07911 numbers are Guernsey's, but a chosen UK stays the UK.
    expect(phoneCountry('+447911123456')).toBe('GG');
    expect(phoneCountry('+447911123456', 'GB')).toBe('GB');
    // Too short to parse: the dialling code's main country, or the chosen one sharing it.
    expect(phoneCountry('+44740012')).toBe('GB');
    expect(phoneCountry('+1415')).toBe('US');
    expect(phoneCountry('+1416', 'CA')).toBe('CA');
    expect(dialCode('GB')).toBe('+44');
    expect(phoneProblem('')).toBeNull();
    expect(phoneProblem('+447400123456')).toBeNull();
    expect(phoneProblem('+44791')).toBe('invalid');
  });
});

describe('countryOptions', () => {
  it('names countries in the page language and lists priority countries first', () => {
    const vi = countryOptions('vi', ['GB', 'US', 'AU', 'VN']);
    expect(vi.priority.map((option) => option.country)).toEqual(['GB', 'US', 'AU', 'VN']);
    expect(vi.priority[0]?.name).toBe('Vương quốc Anh');
    expect(vi.all).toHaveLength(245);
    expect(countryOptions('en').all.find((option) => option.country === 'GB')?.name).toBe(
      'United Kingdom',
    );
  });

  it('searches by name without accents, by code and by dialling code', () => {
    const { all } = countryOptions('vi');
    const vn = all.find((option) => option.country === 'VN')!;
    expect(matchesCountry(vn, 'viet')).toBe(true);
    expect(matchesCountry(vn, 'VN')).toBe(true);
    expect(matchesCountry(vn, '+84')).toBe(true);
    expect(matchesCountry(vn, '44')).toBe(false);
  });
});

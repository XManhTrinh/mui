import { describe, expect, it } from 'vitest';
import { sanitizePin } from './sanitize-pin';

describe('sanitizePin', () => {
  const numeric = { type: 'numeric', length: 6 } as const;

  it('drops spaces, dashes and labels from a pasted code', () => {
    expect(sanitizePin('123 456', numeric)).toBe('123456');
    expect(sanitizePin('123-456', numeric)).toBe('123456');
    expect(sanitizePin('Code: 123456', numeric)).toBe('123456');
  });

  it('keeps at most `length` characters', () => {
    expect(sanitizePin('12345678', numeric)).toBe('123456');
  });

  it('turns full-width digits into ASCII', () => {
    expect(sanitizePin('１２３４５６', numeric)).toBe('123456');
  });

  it('upper-cases letter codes and filters by type', () => {
    expect(sanitizePin('ab-12 cd', { type: 'alphanumeric', length: 8 })).toBe('AB12CD');
    expect(sanitizePin('ab12cd', { type: 'alphabetic', length: 8 })).toBe('ABCD');
  });

  it('uses a custom pattern instead of the type, even a global one', () => {
    const noLookalikes = /[2-9A-HJ-NP-Z]/g;
    expect(
      sanitizePin('A0O1I2B3', { type: 'alphanumeric', pattern: noLookalikes, length: 8 }),
    ).toBe('A2B3');
    expect(
      sanitizePin('A0O1I2B3', { type: 'alphanumeric', pattern: noLookalikes, length: 8 }),
    ).toBe('A2B3');
  });
});

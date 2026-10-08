/** Which characters a {@link PinInput} accepts. */
export type PinInputType = 'numeric' | 'alphanumeric' | 'alphabetic';

const CHARACTERS: Record<PinInputType, RegExp> = {
  numeric: /^\d$/,
  alphanumeric: /^[A-Z0-9]$/,
  alphabetic: /^[A-Z]$/,
};

export interface SanitizePinOptions {
  type: PinInputType;
  /** One-character test that replaces the type's own. */
  pattern?: RegExp | undefined;
  length: number;
}

/**
 * Keeps only the characters a code accepts, at most `length` of them. Full-width digits
 * and letters (from East Asian keyboards) become ASCII, letter codes are upper-cased, and
 * spaces, dashes and labels are dropped, so "123 456", "123-456" and "Code: 123456" all
 * become `123456`.
 */
export function sanitizePin(text: string, { type, pattern, length }: SanitizePinOptions): string {
  const normalized = text.normalize('NFKC');
  const characters = [...(type === 'numeric' ? normalized : normalized.toUpperCase())];
  const accepts = (character: string) => {
    if (!pattern) return CHARACTERS[type].test(character);
    pattern.lastIndex = 0;
    return pattern.test(character);
  };
  return characters.filter(accepts).slice(0, length).join('');
}

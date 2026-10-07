/** A grapheme that can start initials: a letter, a digit or an emoji (not punctuation). */
const INITIAL = /[\p{L}\p{N}\p{Extended_Pictographic}]/u;

function firstGrapheme(word: string, segmenter: Intl.Segmenter): string {
  for (const { segment } of segmenter.segment(word)) {
    if (INITIAL.test(segment)) return segment;
  }
  return '';
}

/**
 * The initials for a name: the first letters of its first and last words ("Nguyễn Văn An"
 * → "NA"), or one letter for one word. Letters are whole graphemes, so diacritics stay
 * attached ("Đỗ Ứng" → "ĐỨ"), and are upper-cased for the locale. Returns `""` when the
 * name has no letters.
 */
export function getInitials(name: string, locale?: string): string {
  const words = name
    .normalize('NFC')
    .trim()
    .split(/\s+/)
    .filter((word) => INITIAL.test(word));
  const first = words.at(0);
  if (first === undefined) return '';
  const last = words.length > 1 ? words.at(-1) : undefined;
  const segmenter = new Intl.Segmenter(locale, { granularity: 'grapheme' });
  const letters = firstGrapheme(first, segmenter) + (last ? firstGrapheme(last, segmenter) : '');
  return letters.toLocaleUpperCase(locale);
}

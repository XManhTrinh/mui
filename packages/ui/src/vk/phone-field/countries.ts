import { dialCode, PHONE_COUNTRIES, type PhoneCountry } from './phone';

export interface CountryOption {
  country: PhoneCountry;
  /** The country's name in the page's language. */
  name: string;
  /** `+44` */
  dial: string;
}

/** Lower case without accents, so "viet" finds "Việt Nam" and "cote" "Côte d'Ivoire". */
export const normalizeSearch = (text: string): string =>
  text.normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/gi, 'd').toLowerCase().trim();

/**
 * Every country with its name in `locale` (from `Intl.DisplayNames`, so no names ship with
 * the library) and dialling code, sorted by name in that locale; `priority` countries are
 * also returned first, in the order given.
 */
export function countryOptions(
  locale: string,
  priority: readonly PhoneCountry[] = [],
): { priority: CountryOption[]; all: CountryOption[] } {
  const names = new Intl.DisplayNames([locale, 'en'], { type: 'region' });
  const collator = new Intl.Collator(locale);
  const option = (country: PhoneCountry): CountryOption => ({
    country,
    name: names.of(country) ?? country,
    dial: dialCode(country),
  });
  const all = PHONE_COUNTRIES.map(option).sort((a, b) => collator.compare(a.name, b.name));
  return {
    priority: priority.filter((country) => PHONE_COUNTRIES.includes(country)).map(option),
    all,
  };
}

/** Matches a country by name (any accents), ISO code or dialling code ("viet", "VN", "84"). */
export function matchesCountry(option: CountryOption, query: string): boolean {
  const search = normalizeSearch(query);
  if (!search) return true;
  const digits = search.replace(/^\+/, '');
  if (/^\d+$/.test(digits)) return option.dial.slice(1).startsWith(digits);
  return normalizeSearch(option.name).includes(search) || option.country.toLowerCase() === search;
}

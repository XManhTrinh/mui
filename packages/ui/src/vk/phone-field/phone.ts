import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
  type CountryCode,
  type PhoneNumber,
} from 'libphonenumber-js/min';
// The same metadata the `/min` entry uses: it lists each dialling code's countries, main first.
import metadata from 'libphonenumber-js/metadata.min';

/** A country as ISO 3166-1 alpha-2, e.g. `GB`. */
export type PhoneCountry = CountryCode;

/** Every country with a dialling code (245). */
export const PHONE_COUNTRIES: readonly PhoneCountry[] = getCountries();

export const isPhoneCountry = (value: unknown): value is PhoneCountry =>
  typeof value === 'string' && (PHONE_COUNTRIES as readonly string[]).includes(value);

/** The dialling code with its plus, e.g. `+44`. */
export const dialCode = (country: PhoneCountry): string => `+${getCountryCallingCode(country)}`;

/**
 * The country for a dialling code. Some codes are shared (+44 is the UK, Guernsey, Jersey and
 * the Isle of Man; +1 is the US, Canada and others), so the chosen country stays when it has
 * the code; otherwise the code's main country (the US for +1, the UK for +44).
 */
function countryForCode(code: string, current: PhoneCountry | undefined): PhoneCountry | undefined {
  if (current && getCountryCallingCode(current) === code) return current;
  return metadata.country_calling_codes[code]?.[0];
}

/** A complete number's country: the chosen one when it shares the code, else its own. */
function countryOf(
  number: PhoneNumber,
  current: PhoneCountry | undefined,
): PhoneCountry | undefined {
  if (current && getCountryCallingCode(current) === number.countryCallingCode) return current;
  return number.country ?? countryForCode(number.countryCallingCode, undefined);
}

/** Typed or pasted with an international prefix: `+44 …` or `0044 …`. */
const isInternational = (text: string): boolean => /^\s*(\+|00)/.test(text);

export interface ReadPhone {
  /** E.164 (`+447911123456`), possibly incomplete while typing, or `''` with no digits. */
  value: string;
  /** The number's country when it can be told, else the one it was read in. */
  country: PhoneCountry | undefined;
  /** The text formatted as typed, e.g. `07911 123456` or `+61 412 345 678`. */
  formatted: string;
  /** Whether the number is long enough to be complete for its country. */
  complete: boolean;
}

/** Reads what was typed or pasted, in `country`'s format unless it starts with `+` or `00`. */
export function readPhone(text: string, country: PhoneCountry | undefined): ReadPhone {
  if (!/\d/.test(text)) {
    return { value: '', country, formatted: text.trim() === '+' ? '+' : '', complete: false };
  }
  const international = isInternational(text);
  const typing = new AsYouType(international ? undefined : country);
  const formatted = typing.input(international ? text.trim().replace(/^00/, '+') : text);
  const number = typing.getNumber();
  const code = typing.getCallingCode();
  return {
    value: typing.getNumberValue() ?? '',
    country: number
      ? countryOf(number, country)
      : code
        ? countryForCode(code, country)
        : international
          ? undefined
          : country,
    formatted,
    complete: number?.isPossible() ?? false,
  };
}

/** How to show a stored E.164 number: nationally in its own country, else internationally. */
export function formatPhone(value: string, country: PhoneCountry | undefined): string {
  if (!value) return '';
  const parsed = parsePhoneNumberFromString(value);
  // An incomplete or invalid number: format it as typed, internationally.
  if (!parsed?.isValid()) return new AsYouType().input(value);
  return !country || countryOf(parsed, country) === country
    ? parsed.formatNational()
    : parsed.formatInternational();
}

/** The country an E.164 number belongs to, preferring `current` when the code is shared. */
export function phoneCountry(value: string, current?: PhoneCountry): PhoneCountry | undefined {
  if (!value) return undefined;
  const parsed = parsePhoneNumberFromString(value);
  if (parsed) return countryOf(parsed, current);
  // Too short to parse: the dialling code still says the country, e.g. +44740012.
  const typing = new AsYouType();
  typing.input(value);
  const code = typing.getCallingCode();
  return code ? countryForCode(code, current) : undefined;
}

/**
 * Whether an E.164 number is valid for its country (Google's phone data). An empty value
 * has no problem, so optional fields stay optional; servers can use this to check input.
 */
export function phoneProblem(value: string): 'invalid' | null {
  if (!value) return null;
  return isValidPhoneNumber(value) ? null : 'invalid';
}

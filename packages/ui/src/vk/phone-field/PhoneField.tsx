'use client';

import { useMemo, useState, type CSSProperties, type ReactNode, type Ref } from 'react';
import { useLocale, useObjectRef } from 'react-aria';
import { useControlledState } from 'react-stately/useControlledState';
import { SelectItem, SelectSection } from '../../components/select/option-list';
import { Select } from '../../components/select/Select';
import { TextField } from '../../components/text-field/TextField';
import { cn } from '../../utils/cn';
import { splitDataAttributes } from '../../utils/split-data-attributes';
import { countryOptions, matchesCountry, type CountryOption } from './countries';
import {
  dialCode,
  formatPhone,
  phoneCountry,
  phoneProblem,
  readPhone,
  type PhoneCountry,
} from './phone';
import { phoneFieldStyles, type PhoneFieldVariant } from './phone-field-styles';

/** Words the field shows or announces; override them for other languages. */
export interface PhoneFieldLabels {
  /** The country field's name, e.g. "Country". */
  country: string;
  /** The search field in the country list. */
  search: string;
  /** Shown when no country matches the search. */
  noResults: string;
  /** The priority countries' group in the list. */
  suggested: string;
  /** The full list's group. */
  allCountries: string;
  /** The error for a number that isn't valid for its country. */
  invalid: string;
}

const DEFAULT_LABELS: PhoneFieldLabels = {
  country: 'Country',
  search: 'Search countries',
  noResults: 'No countries found',
  suggested: 'Suggested countries',
  allCountries: 'All countries',
  invalid: 'Enter a valid phone number',
};

export interface PhoneFieldClassNames {
  root?: string;
  /** The country field (a searchable `Select`). */
  country?: string;
  /** The number's TextField root. */
  input?: string;
  /** The country list's surface. */
  picker?: string;
  supportingText?: string;
  errorText?: string;
}

interface PhoneFieldOwnProps {
  /** @default "outlined" */
  variant?: PhoneFieldVariant;
  /** The number in E.164 (`+447911123456`), or `''`. */
  value?: string;
  defaultValue?: string;
  /** Called with the number in E.164, possibly incomplete while typing, or `''`. */
  onChange?: (value: string) => void;
  /** The chosen country (ISO 3166-1 alpha-2); one dialling code can cover several. */
  country?: PhoneCountry;
  /** The country to start on, e.g. the visitor's. Else the first priority country. */
  defaultCountry?: PhoneCountry;
  onCountryChange?: (country: PhoneCountry) => void;
  /** Listed first, in this order, e.g. an app's main markets. */
  priorityCountries?: readonly PhoneCountry[];
  /** A flag (or any icon) for a country, shown in the country field and the list. None by default. */
  renderFlag?: (country: PhoneCountry) => ReactNode;
  /** Locale for country names. @default the React Aria locale */
  locale?: string;
  labels?: Partial<PhoneFieldLabels>;
  /** Helper text below the number. Replaced visually by the error when invalid. */
  supportingText?: ReactNode;
  /**
   * Marks the number invalid. Without it, the field checks the number itself when it loses
   * focus and shows `errorMessage` (or `labels.invalid`) for one that isn't valid.
   */
  invalid?: boolean;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  /** Submits the E.164 value under this name. */
  name?: string;
  autoFocus?: boolean;
  className?: string;
  classNames?: PhoneFieldClassNames;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
  /** Ref to the number's input. */
  inputRef?: Ref<HTMLInputElement>;
}

/** A visible label, or an accessible name for the number without one. */
type PhoneFieldLabel = { label: string } | { label?: undefined; 'aria-label': string };

export type PhoneFieldProps = PhoneFieldOwnProps & PhoneFieldLabel;

/**
 * A phone number field with a country picker: people choose their country (or a pasted or
 * autofilled `+…` number picks it), type the number in their country's usual format, and
 * the field reports one E.164 value (`+447911123456`).
 *
 * **Not an M3 component** (a `vk` component, see docs/plans/phone-field.md). The number is
 * the library's `TextField`; the country field beside it is a searchable `Select`
 * (`presentation="auto"`: the M3 menu on medium and larger windows, a bottom sheet on
 * compact ones) showing the dialling code. Country names come from `Intl.DisplayNames` in the page's language, and the
 * phone rules from `libphonenumber-js` (Google's phone data).
 *
 * @example
 * <PhoneField label="Phone" defaultCountry="GB" priorityCountries={['GB', 'US', 'VN']}
 *   value={phone} onChange={setPhone} />
 */
export function PhoneField(props: PhoneFieldProps) {
  const {
    variant = 'outlined',
    label,
    value: valueProp,
    defaultValue,
    onChange,
    country: countryProp,
    defaultCountry,
    onCountryChange,
    priorityCountries = [],
    renderFlag,
    locale: localeProp,
    labels: labelsProp,
    supportingText,
    invalid,
    errorMessage,
    required,
    disabled = false,
    readOnly,
    name,
    autoFocus,
    className,
    classNames,
    style,
    ref,
    inputRef,
    ...otherProps
  } = props;
  const { data: rootData, rest } = splitDataAttributes(otherProps);
  const ariaLabel = (rest as { 'aria-label'?: string })['aria-label'];
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const { locale: ariaLocale } = useLocale();
  const locale = localeProp ?? ariaLocale;

  const [value, setValue] = useControlledState(valueProp, defaultValue ?? '', onChange);
  const [ownCountry, setOwnCountry] = useState<PhoneCountry | undefined>(
    () =>
      phoneCountry(defaultValue ?? valueProp ?? '', defaultCountry) ??
      defaultCountry ??
      priorityCountries[0],
  );
  const country = countryProp ?? ownCountry;
  const setCountry = (next: PhoneCountry) => {
    setOwnCountry(next);
    onCountryChange?.(next);
  };
  const [text, setText] = useState(() => formatPhone(value, country));
  // The value last shown, so a value set from outside is formatted again.
  const [shown, setShown] = useState(value);
  if (value !== shown) {
    setShown(value);
    setText(formatPhone(value, country));
  }
  const [checkedInvalid, setCheckedInvalid] = useState(false);

  const numberRef = useObjectRef(inputRef);

  // A key for the priority countries, so an inline array doesn't rebuild the list.
  const priorityKey = priorityCountries.join(',');
  const options = useMemo(
    () => countryOptions(locale, priorityKey ? (priorityKey.split(',') as PhoneCountry[]) : []),
    [locale, priorityKey],
  );
  // Each country once, keyed by its ISO code: the priority countries first, then the rest by
  // name. While searching, a match shows in whichever group holds it.
  const sections = useMemo(() => {
    const priority = new Set(options.priority.map((option) => option.country));
    const rest = options.all.filter((option) => !priority.has(option.country));
    return [
      { key: 'priority', label: labels.suggested, options: options.priority },
      { key: 'all', label: labels.allCountries, options: rest },
    ].filter((section) => section.options.length > 0);
  }, [options, labels.suggested, labels.allCountries]);
  const byCountry = useMemo(
    () => new Map<string, CountryOption>(options.all.map((option) => [option.country, option])),
    [options],
  );

  const update = (nextValue: string) => {
    setShown(nextValue);
    setValue(nextValue);
    if (checkedInvalid && phoneProblem(nextValue) === null) setCheckedInvalid(false);
  };

  const onText = (next: string) => {
    const read = readPhone(next, country);
    // Format only while typing forward, so deleting a space or bracket isn't undone.
    let display = next.length > text.length ? read.formatted : next;
    if (read.country && read.country !== country) {
      setCountry(read.country);
      if (read.complete) display = formatPhone(read.value, read.country);
    }
    setText(display);
    update(read.value);
  };

  const chooseCountry = (next: PhoneCountry) => {
    setCountry(next);
    const read = readPhone(text, next);
    setText(read.formatted);
    update(read.value);
  };

  const isInvalid = invalid ?? checkedInvalid;
  const styles = phoneFieldStyles({ variant });

  return (
    <div
      {...rootData}
      ref={ref}
      style={style}
      className={styles.root({ class: cn(classNames?.root, className) })}
      data-variant={variant}
      data-invalid={isInvalid || undefined}
      data-disabled={disabled || undefined}
      data-country={country}
    >
      {/* The country field is a searchable Select: a menu on larger windows, a sheet on
          phones. Focus returns to it after a choice; the number is next. */}
      <Select
        aria-label={labels.country}
        variant={variant}
        searchable
        presentation="auto"
        value={country ?? null}
        onChange={(key) => {
          if (key !== null) chooseCountry(key as PhoneCountry);
        }}
        // By name (any accents), ISO code or dialling code ("viet", "VN", "84").
        filter={(_text, search, key) => {
          const option = byCountry.get(String(key));
          return option !== undefined && matchesCountry(option, search);
        }}
        renderValue={([chosen]) =>
          chosen ? (
            <span className="inline-flex items-center gap-[8px]">
              {renderFlag ? (
                <span className={styles.flag()}>{renderFlag(chosen.key as PhoneCountry)}</span>
              ) : null}
              <span className={styles.dial()}>{dialCode(chosen.key as PhoneCountry)}</span>
            </span>
          ) : null
        }
        placeholder="+"
        disabled={disabled || Boolean(readOnly)}
        invalid={isInvalid}
        labels={{ search: labels.search, noResults: labels.noResults }}
        className={styles.country({ class: classNames?.country })}
        classNames={{
          value: styles.countryValue(),
          ...(classNames?.picker && { list: classNames.picker }),
        }}
      >
        {sections.map((section) => (
          <SelectSection key={section.key} aria-label={section.label}>
            {section.options.map((option) => (
              <SelectItem
                key={option.country}
                // The dialling code is part of its text, so the field's name and typeahead
                // include it ("United Kingdom (+44)").
                textValue={`${option.name} (${option.dial})`}
                leadingIcon={
                  renderFlag ? (
                    <span className={styles.flag()}>{renderFlag(option.country)}</span>
                  ) : undefined
                }
                trailing={<span className={styles.dial()}>{option.dial}</span>}
              >
                {option.name}
              </SelectItem>
            ))}
          </SelectSection>
        ))}
      </Select>
      <TextField
        variant={variant}
        {...(label !== undefined ? { label } : { 'aria-label': ariaLabel ?? labels.country })}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        value={text}
        onChange={onText}
        onBlur={() => setCheckedInvalid(phoneProblem(value) === 'invalid')}
        supportingText={supportingText}
        errorMessage={errorMessage ?? labels.invalid}
        invalid={isInvalid}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        autoFocus={autoFocus}
        inputRef={numberRef}
        className={styles.number()}
        classNames={{
          root: cn('w-auto', classNames?.input),
          input: '[direction:ltr] rtl:text-right',
          ...(classNames?.supportingText && { supportingText: classNames.supportingText }),
          ...(classNames?.errorText && { errorText: classNames.errorText }),
        }}
      />
      {name ? <input type="hidden" name={name} value={value} /> : null}
    </div>
  );
}

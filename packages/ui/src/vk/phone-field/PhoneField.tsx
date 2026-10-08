'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react';
import {
  DismissButton,
  mergeProps,
  useButton,
  useComboBox,
  useFocusRing,
  useHover,
  useListBox,
  useListBoxSection,
  useLocale,
  useObjectRef,
  useOption,
  usePopover,
} from 'react-aria';
import {
  Item,
  Section,
  useComboBoxState,
  useOverlayTriggerState,
  type ComboBoxState,
  type Node,
  type OverlayTriggerState,
} from 'react-stately';
import { useControlledState } from 'react-stately/useControlledState';
import { TextField } from '../../components/text-field/TextField';
import { menuStyles } from '../../components/menu/menu-styles';
import { BottomSheet } from '../../components/sheet/BottomSheet';
import { Overlay } from '../../primitives/Overlay';
import { usePresence } from '../../primitives/use-presence';
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
  /** The country button's name, e.g. "Country". */
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
  /** The country button. */
  country?: string;
  /** The number's TextField root. */
  input?: string;
  /** The country list's panel (popover) or sheet content. */
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
  /** A flag (or any icon) for a country, shown in the button and the list. None by default. */
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

const MEDIUM_WINDOW = '(min-width: 600px)';

function subscribeToWindow(onChange: () => void) {
  const query = window.matchMedia(MEDIUM_WINDOW);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

/** Material Symbols `arrow_drop_down`. */
const ArrowIcon = ({ className }: { className: string }) => (
  <svg viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M480-360 280-560h400L480-360Z" />
  </svg>
);

/** Material Symbols `search`. */
const SearchIcon = ({ className }: { className: string }) => (
  <svg viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
  </svg>
);

/**
 * A phone number field with a country picker: people choose their country (or a pasted or
 * autofilled `+…` number picks it), type the number in their country's usual format, and
 * the field reports one E.164 value (`+447911123456`).
 *
 * **Not an M3 component** (a `vk` component, see docs/plans/phone-field.md). The number is
 * the library's `TextField`; the country field beside it uses the same tokens, and opens a
 * searchable list (an M3-style popover on medium and larger windows, a bottom sheet on
 * compact ones). Country names come from `Intl.DisplayNames` in the page's language, and the
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
  const countryRef = useRef<HTMLButtonElement>(null);
  const picker = useOverlayTriggerState({});

  // A key for the priority countries, so an inline array doesn't rebuild the list.
  const priorityKey = priorityCountries.join(',');
  const options = useMemo(
    () => countryOptions(locale, priorityKey ? (priorityKey.split(',') as PhoneCountry[]) : []),
    [locale, priorityKey],
  );
  const current = country ? options.all.find((option) => option.country === country) : undefined;

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
    // Focus returns to the country button, as for any dialog (WAI-ARIA); the number is next.
    picker.close();
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
      <CountryButton
        buttonRef={countryRef}
        picker={picker}
        option={current}
        country={country}
        label={labels.country}
        renderFlag={renderFlag}
        isInvalid={isInvalid}
        isDisabled={disabled || Boolean(readOnly)}
        className={styles.country({ class: classNames?.country })}
        styles={styles}
      />
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
      <CountryPicker
        picker={picker}
        triggerRef={countryRef}
        options={options}
        country={country}
        onChoose={chooseCountry}
        labels={labels}
        renderFlag={renderFlag}
        className={classNames?.picker}
        styles={styles}
      />
    </div>
  );
}

type Styles = ReturnType<typeof phoneFieldStyles>;

function CountryButton({
  buttonRef,
  picker,
  option,
  country,
  label,
  renderFlag,
  isInvalid,
  isDisabled,
  className,
  styles,
}: {
  buttonRef: RefObject<HTMLButtonElement | null>;
  picker: OverlayTriggerState;
  option: CountryOption | undefined;
  country: PhoneCountry | undefined;
  label: string;
  renderFlag: ((country: PhoneCountry) => ReactNode) | undefined;
  isInvalid: boolean;
  isDisabled: boolean;
  className: string;
  styles: Styles;
}) {
  const { buttonProps } = useButton({ onPress: picker.toggle, isDisabled }, buttonRef);
  const { focusProps, isFocusVisible } = useFocusRing();
  const { hoverProps, isHovered } = useHover({ isDisabled });
  const name = option ? `${label}: ${option.name} (${option.dial})` : label;
  return (
    <button
      {...mergeProps(buttonProps, focusProps, hoverProps)}
      ref={buttonRef}
      type="button"
      aria-label={name}
      aria-haspopup="dialog"
      aria-expanded={picker.isOpen}
      className={cn('group/country', className)}
      data-focused={isFocusVisible || undefined}
      data-hovered={(isHovered && !isDisabled) || undefined}
      data-open={picker.isOpen || undefined}
      data-invalid={isInvalid || undefined}
      data-disabled={isDisabled || undefined}
    >
      {country && renderFlag ? (
        <span aria-hidden="true" className={styles.flag()}>
          {renderFlag(country)}
        </span>
      ) : null}
      <span aria-hidden="true" className={styles.dial()}>
        {country ? dialCode(country) : '+'}
      </span>
      <ArrowIcon className={styles.arrow()} />
    </button>
  );
}

function CountryPicker({
  picker,
  triggerRef,
  ...listProps
}: {
  picker: OverlayTriggerState;
  triggerRef: RefObject<HTMLButtonElement | null>;
} & Omit<CountryListProps, 'onClose'>) {
  const isMediumWindow = useSyncExternalStore(
    subscribeToWindow,
    () => window.matchMedia(MEDIUM_WINDOW).matches,
    () => true,
  );
  const { isPresent, isExiting, exitProps } = usePresence(picker.isOpen);
  if (!isMediumWindow) {
    return (
      <BottomSheet
        open={picker.isOpen}
        onOpenChange={(open) => (open ? picker.open() : picker.close())}
        aria-label={listProps.labels.country}
        skipPartiallyExpanded
      >
        <div className={listProps.styles.sheetContent({ class: listProps.className })}>
          <CountryList {...listProps} onClose={picker.close} />
        </div>
      </BottomSheet>
    );
  }
  if (!isPresent) return null;
  return (
    <Overlay isExiting={isExiting}>
      <CountryPopover
        picker={picker}
        triggerRef={triggerRef}
        isExiting={isExiting}
        exitProps={exitProps}
        listProps={listProps}
      />
    </Overlay>
  );
}

function CountryPopover({
  picker,
  triggerRef,
  isExiting,
  exitProps,
  listProps,
}: {
  picker: OverlayTriggerState;
  triggerRef: RefObject<HTMLButtonElement | null>;
  isExiting: boolean;
  exitProps: ReturnType<typeof usePresence>['exitProps'];
  listProps: Omit<CountryListProps, 'onClose'>;
}) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const { popoverProps, underlayProps } = usePopover(
    { triggerRef, popoverRef, placement: 'bottom start', offset: 4 },
    picker,
  );
  const styles = listProps.styles;
  return (
    <>
      <div {...underlayProps} className="fixed inset-0" />
      <div {...popoverProps} ref={popoverRef} className={styles.popover()}>
        <DismissButton onDismiss={picker.close} />
        <div
          {...exitProps}
          role="dialog"
          aria-label={listProps.labels.country}
          data-exiting={isExiting || undefined}
          className={styles.panel({ class: listProps.className })}
        >
          <CountryList {...listProps} onClose={picker.close} />
        </div>
        <DismissButton onDismiss={picker.close} />
      </div>
    </>
  );
}

interface CountryListProps {
  options: { priority: CountryOption[]; all: CountryOption[] };
  country: PhoneCountry | undefined;
  onChoose: (country: PhoneCountry) => void;
  onClose: () => void;
  labels: PhoneFieldLabels;
  renderFlag: ((country: PhoneCountry) => ReactNode) | undefined;
  className: string | undefined;
  styles: Styles;
}

interface CountrySection {
  key: 'priority' | 'all';
  options: CountryOption[];
}

/** Item keys are `<section>:<country>`, since priority countries are also in the full list. */
const countryFromKey = (key: string | number) => String(key).split(':')[1] as PhoneCountry;

/**
 * The search field and the country list, as a combobox: the search keeps focus while the
 * arrow keys move through the list, Enter chooses, and Escape closes.
 */
function CountryList({
  options,
  country,
  onChoose,
  onClose,
  labels,
  renderFlag,
  styles,
}: CountryListProps) {
  const [query, setQuery] = useState('');
  const sections = useMemo<CountrySection[]>(() => {
    const all = options.all.filter((option) => matchesCountry(option, query));
    // While searching, the full list alone, so no country shows twice.
    return query.trim() || options.priority.length === 0
      ? [{ key: 'all', options: all }]
      : [
          { key: 'priority', options: options.priority },
          { key: 'all', options: all },
        ];
  }, [options, query]);

  const state = useComboBoxState<CountrySection>({
    items: sections,
    children: (section) => (
      <Section
        key={section.key}
        items={section.options}
        aria-label={section.key === 'priority' ? labels.suggested : labels.allCountries}
      >
        {(option) => (
          <Item key={`${section.key}:${option.country}`} textValue={option.name}>
            {option.name}
          </Item>
        )}
      </Section>
    ),
    inputValue: query,
    onInputChange: setQuery,
    selectedKey: null,
    onSelectionChange: (key) => {
      if (key !== null) onChoose(countryFromKey(key));
    },
    defaultFilter: () => true,
    allowsEmptyCollection: true,
    menuTrigger: 'focus',
    shouldCloseOnBlur: false,
    onOpenChange: (isOpen) => {
      if (!isOpen) onClose();
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const listBoxRef = useRef<HTMLUListElement>(null);
  // The combobox hides everything outside its input and popup from assistive technology,
  // so the popup is this wrapper (search and list), in the popover and the bottom sheet.
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { inputProps, listBoxProps } = useComboBox(
    {
      'aria-label': labels.search,
      inputRef,
      listBoxRef,
      popoverRef: wrapperRef,
      inputValue: query,
    },
    state,
  );

  // The list is the picker's whole content, so it opens with the picker.
  useEffect(() => {
    inputRef.current?.focus();
    state.open(null, 'manual');
    // Opening once on mount; the picker closes the list.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run on mount only.
  }, []);

  const isEmpty = sections.every((section) => section.options.length === 0);
  return (
    <div ref={wrapperRef} className="flex min-h-0 flex-1 flex-col">
      <div className={styles.searchRow()}>
        <div className="relative flex w-full items-center">
          <SearchIcon className={styles.searchIcon()} />
          <input
            {...inputProps}
            ref={inputRef}
            className={styles.search()}
            placeholder={labels.search}
          />
        </div>
      </div>
      {isEmpty ? (
        <p role="status" className={styles.empty()}>
          {labels.noResults}
        </p>
      ) : null}
      <CountryListBox
        listBoxProps={listBoxProps}
        listBoxRef={listBoxRef}
        state={state}
        country={country}
        renderFlag={renderFlag}
        styles={styles}
        hidden={isEmpty}
      />
    </div>
  );
}

function CountryListBox({
  listBoxProps,
  listBoxRef,
  state,
  country,
  renderFlag,
  styles,
  hidden,
}: {
  listBoxProps: ReturnType<typeof useComboBox>['listBoxProps'];
  listBoxRef: RefObject<HTMLUListElement | null>;
  state: ComboBoxState<CountrySection>;
  country: PhoneCountry | undefined;
  renderFlag: ((country: PhoneCountry) => ReactNode) | undefined;
  styles: Styles;
  hidden: boolean;
}) {
  const { listBoxProps: props } = useListBox(listBoxProps, state, listBoxRef);
  const sections = [...state.collection];
  return (
    <ul {...props} ref={listBoxRef} hidden={hidden} className={styles.list()}>
      {sections.map((section, index) => (
        <CountrySectionGroup
          key={section.key}
          section={section}
          state={state}
          country={country}
          renderFlag={renderFlag}
          styles={styles}
          divided={index > 0}
        />
      ))}
    </ul>
  );
}

function CountrySectionGroup({
  section,
  state,
  country,
  renderFlag,
  styles,
  divided,
}: {
  section: Node<CountrySection>;
  state: ComboBoxState<CountrySection>;
  country: PhoneCountry | undefined;
  renderFlag: ((country: PhoneCountry) => ReactNode) | undefined;
  styles: Styles;
  divided: boolean;
}) {
  const { itemProps, groupProps } = useListBoxSection({
    'aria-label': section['aria-label'],
  });
  return (
    <li {...itemProps}>
      {divided ? <div role="presentation" className={styles.divider()} /> : null}
      <ul {...groupProps}>
        {[...state.collection.getChildren!(section.key)].map((item) => (
          <CountryItem
            key={item.key}
            item={item}
            state={state}
            isChosen={countryFromKey(item.key) === country}
            renderFlag={renderFlag}
            styles={styles}
          />
        ))}
      </ul>
    </li>
  );
}

function CountryItem({
  item,
  state,
  isChosen,
  renderFlag,
  styles,
}: {
  item: Node<CountrySection>;
  state: ComboBoxState<CountrySection>;
  isChosen: boolean;
  renderFlag: ((country: PhoneCountry) => ReactNode) | undefined;
  styles: Styles;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const { optionProps, isFocused } = useOption({ key: item.key }, state, ref);
  const { hoverProps, isHovered } = useHover({});
  const country = countryFromKey(item.key);
  // The library's M3 menu item: same height, colours, selected shape and focus ring.
  const menu = menuStyles({ variant: 'standard' });
  return (
    <li
      {...mergeProps(optionProps, hoverProps)}
      ref={ref}
      aria-selected={isChosen}
      className={menu.item()}
      data-focus-visible={isFocused || undefined}
      data-hovered={isHovered || undefined}
      data-selected={isChosen || undefined}
    >
      {renderFlag ? (
        <span aria-hidden="true" className={menu.icon({ class: styles.flag() })}>
          {renderFlag(country)}
        </span>
      ) : null}
      <span className={menu.text()}>
        <span className="truncate">{item.rendered}</span>
      </span>
      <span aria-hidden="true" className={menu.trailing({ class: styles.optionDial() })}>
        {dialCode(country)}
      </span>
    </li>
  );
}

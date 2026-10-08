'use client';

import { useRef, useSyncExternalStore, type CSSProperties, type ReactNode, type Ref } from 'react';
import {
  HiddenSelect,
  mergeProps,
  useButton,
  useFocusRing,
  useHover,
  useObjectRef,
  useSelect,
  type AriaSelectOptions,
} from 'react-aria';
import {
  useSelectState,
  type SelectionMode,
  type SelectProps as StatelySelectProps,
} from 'react-stately/useSelectState';
import { assertCollectionChildren } from '../../utils/assert-collection-children';
import { cn } from '../../utils/cn';
import { splitDataAttributes } from '../../utils/split-data-attributes';
import { BottomSheet } from '../sheet/BottomSheet';
import type { TextFieldVariant } from '../text-field/text-field-styles';
import { DropdownArrow, FieldShell, fieldState, type FieldShellClassNames } from './field-shell';
import { OptionList, OptionPopover, type OptionListClassNames } from './option-list';
import { useSelectionCap } from './selection-cap';

/** How the options open: a menu under the field (M3), a bottom sheet, or a sheet on phones. */
export type SelectPresentation = 'menu' | 'sheet' | 'auto';

/** Words the Select shows or announces; override them for other languages. */
export interface SelectLabels {
  /** Shown in an empty list. */
  empty: string;
  /** The loading indicator's name. */
  loading: string;
  /** For more chosen options than fit: `+{count}`. */
  more: (count: number) => string;
}

const DEFAULT_LABELS: SelectLabels = {
  empty: 'No options',
  loading: 'Loading options',
  more: (count) => `+${count}`,
};

export interface SelectClassNames extends FieldShellClassNames, OptionListClassNames {
  /** The text showing the chosen option(s) or the placeholder. */
  value?: string;
}

/** React Aria props this API names the library's way (`disabled`, `open`…), or leaves out. */
type RenamedProps =
  | 'isDisabled'
  | 'isRequired'
  | 'isInvalid'
  | 'isOpen'
  | 'label'
  | 'description'
  | 'validationState';

export type SelectProps<T extends object, M extends SelectionMode = 'single'> = Omit<
  StatelySelectProps<T, M>,
  RenamedProps
> &
  Pick<AriaSelectOptions<T, M>, 'name' | 'autoComplete' | 'form'> & {
    /** @default "filled" (as TextField) */
    variant?: TextFieldVariant;
    /** The field's label. Give `aria-label` instead when there's no visible label. */
    label?: ReactNode;
    'aria-label'?: string;
    /** Shown in the field when nothing is chosen. */
    placeholder?: string;
    /** Helper text below the field. Replaced visually by the error when invalid. */
    supportingText?: ReactNode;
    invalid?: boolean;
    required?: boolean;
    disabled?: boolean;
    leadingIcon?: ReactNode;
    /** Whether the menu is open (controlled); with `defaultOpen` and `onOpenChange`. */
    open?: boolean;
    /**
     * With `selectionMode="multiple"`, the most options that can be chosen; the rest show as
     * disabled until one is removed.
     */
    maxSelections?: number;
    /**
     * `menu` (default) opens an M3 menu under the field on every window, as Compose's exposed
     * dropdown menu does; `sheet` always opens a bottom sheet; `auto` opens a sheet on
     * compact windows and a menu on larger ones, for long lists.
     * @default "menu"
     */
    presentation?: SelectPresentation;
    /** Shows a loading indicator in the list, e.g. while options are fetched. */
    loading?: boolean;
    labels?: Partial<SelectLabels>;
    className?: string;
    classNames?: SelectClassNames;
    style?: CSSProperties;
    ref?: Ref<HTMLDivElement>;
    /** Ref to the field's button. */
    triggerRef?: Ref<HTMLButtonElement>;
  };

const COMPACT_WINDOW = '(max-width: 599.98px)';

function subscribeToWindow(onChange: () => void) {
  const query = window.matchMedia(COMPACT_WINDOW);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

/**
 * M3 exposed dropdown menu, read-only (Compose's `ExposedDropdownMenuBox` with a
 * `PrimaryNotEditable` anchor): a text-field-styled button that opens a menu of options.
 * Single or multiple selection, sections, descriptions and icons, typeahead, a hidden
 * native `<select>` for forms, and validation as in `TextField` (React Aria `useSelect`).
 *
 * @example
 * <Select label="Sort by" defaultValue="newest">
 *   <SelectItem key="newest">Newest first</SelectItem>
 *   <SelectItem key="price">Price, low to high</SelectItem>
 * </Select>
 */
export function Select<T extends object, M extends SelectionMode = 'single'>(
  props: SelectProps<T, M>,
) {
  const {
    variant = 'filled',
    label,
    placeholder,
    supportingText,
    invalid,
    required,
    disabled = false,
    leadingIcon,
    open,
    maxSelections,
    presentation = 'menu',
    loading = false,
    labels: labelsProp,
    className,
    classNames,
    style,
    ref,
    triggerRef: triggerRefProp,
    name,
    autoComplete,
    form,
    errorMessage,
    ...otherProps
  } = props;
  // Items given as elements (not `items` with a render function) must come from a client.
  if (typeof props.children !== 'function') {
    assertCollectionChildren(props.children, 'Select', 'SelectItem and SelectSection elements');
  }
  const { data: rootData, rest } = splitDataAttributes(otherProps);
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const stately = rest as Omit<StatelySelectProps<T, M>, RenamedProps>;
  const cap = useSelectionCap({
    multiple: stately.selectionMode === 'multiple',
    maxSelections,
    value: stately.value,
    defaultValue: stately.defaultValue,
    onChange: stately.onChange,
  });
  const ariaProps = {
    ...stately,
    ...cap.valueProps,
    label,
    description: supportingText,
    errorMessage,
    isInvalid: invalid,
    isRequired: required,
    isDisabled: disabled,
    ...(open !== undefined && { isOpen: open }),
    placeholder,
    name,
    autoComplete,
    form,
  } as AriaSelectOptions<T, M>;

  const state = useSelectState<T, M>(ariaProps);
  const triggerRef = useObjectRef(triggerRefProp);
  const containerRef = useRef<HTMLDivElement>(null);
  // Set by a press outside the menu and the field: the focus the menu hands back to the
  // field on closing (WAI-ARIA, right after Escape or a choice) is let go, so one press
  // outside leaves the field, as it does any other field.
  const releaseFocusRef = useRef(false);
  const listBoxRef = useRef<HTMLUListElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const {
    labelProps,
    triggerProps,
    valueProps,
    menuProps,
    descriptionProps,
    errorMessageProps,
    isInvalid,
    validationErrors,
    validationDetails,
  } = useSelect<T, M>(ariaProps, state, triggerRef);
  // `useSelect`'s trigger props are React Aria button props; `useButton` makes them DOM props.
  const { buttonProps } = useButton(triggerProps, triggerRef);
  const { focusProps, isFocusVisible, isFocused } = useFocusRing();
  const fieldButtonProps = mergeProps(buttonProps, focusProps);
  const { hoverProps, isHovered } = useHover({ isDisabled: disabled });

  const isCompact = useSyncExternalStore(
    subscribeToWindow,
    () => window.matchMedia(COMPACT_WINDOW).matches,
    () => false,
  );
  const asSheet = presentation === 'sheet' || (presentation === 'auto' && isCompact);

  // In the list's order, not the order they were picked, so the field reads like the list.
  const chosen = [...state.collection.getKeys()]
    .filter((key) => state.selectionManager.isSelected(key))
    .map((key) => state.collection.getItem(key)?.textValue ?? '');
  const valueText =
    chosen.length > 2
      ? `${chosen.slice(0, 2).join(', ')} ${labels.more(chosen.length - 2)}`
      : chosen.join(', ');
  const hasValue = chosen.length > 0;
  const focused = isFocused || state.isOpen;
  const resolvedError =
    typeof errorMessage === 'function'
      ? errorMessage({ isInvalid, validationErrors, validationDetails })
      : (errorMessage ?? validationErrors.join(' '));

  const list = (
    <OptionList
      embedded={asSheet}
      listBoxProps={menuProps}
      state={state}
      listBoxRef={listBoxRef}
      emptyLabel={labels.empty}
      loading={loading}
      loadingLabel={labels.loading}
      isBlocked={cap.isBlocked}
      classNames={classNames}
    />
  );

  return (
    <>
      <FieldShell
        variant={variant}
        label={label}
        labelProps={labelProps}
        required={required}
        state={fieldState({ disabled, invalid: isInvalid, focused, hovered: isHovered })}
        floated={hasValue || focused || Boolean(placeholder)}
        open={state.isOpen}
        leadingIcon={leadingIcon}
        trailing={<DropdownArrow open={state.isOpen} />}
        supportingText={supportingText}
        descriptionProps={descriptionProps}
        errorText={resolvedError}
        errorMessageProps={errorMessageProps}
        showError={isInvalid && Boolean(resolvedError)}
        containerRef={containerRef}
        containerProps={hoverProps}
        onContainerPointerDown={(event) => {
          // A press anywhere on the field (not only its text) opens it, like Compose.
          if (disabled || triggerRef.current?.contains(event.target as Node)) return;
          event.preventDefault();
          releaseFocusRef.current = false;
          triggerRef.current?.focus();
          state.toggle();
        }}
        rootProps={{ ...rootData, 'data-focus-visible': isFocusVisible || undefined }}
        rootRef={ref}
        className={className}
        classNames={classNames}
        style={style}
      >
        <HiddenSelect
          state={state}
          triggerRef={triggerRef}
          label={label}
          name={name}
          isDisabled={disabled}
          {...(autoComplete && { autoComplete })}
          {...(form && { form })}
        />
        <button
          {...fieldButtonProps}
          onFocus={(event) => {
            fieldButtonProps.onFocus?.(event);
            if (!releaseFocusRef.current) return;
            releaseFocusRef.current = false;
            triggerRef.current?.blur();
          }}
          // Using the field again means it's wanted, whatever came before.
          onPointerDown={(event) => {
            releaseFocusRef.current = false;
            fieldButtonProps.onPointerDown?.(event);
          }}
          onKeyDown={(event) => {
            releaseFocusRef.current = false;
            fieldButtonProps.onKeyDown?.(event);
          }}
          ref={triggerRef}
          type="button"
          className={cn(
            'flex min-w-0 flex-1 cursor-pointer items-center self-stretch bg-transparent p-0 text-start outline-none',
            'disabled:cursor-default',
          )}
        >
          <span
            {...valueProps}
            className={cn(
              'min-w-0 flex-1 truncate text-body-large',
              hasValue ? 'text-on-surface' : 'text-on-surface-variant',
              'group-data-[field-state=disabled]/field:text-on-surface/38',
              classNames?.value,
            )}
          >
            {hasValue ? valueText : (placeholder ?? ' ')}
          </span>
        </button>
      </FieldShell>
      {asSheet ? (
        <BottomSheet
          open={state.isOpen}
          onOpenChange={(open) => (open ? state.open() : state.close())}
          {...(typeof label === 'string'
            ? { 'aria-label': label }
            : { 'aria-label': (rest as { 'aria-label'?: string })['aria-label'] ?? '' })}
        >
          <div className="flex min-h-0 flex-1 flex-col px-[8px] pb-[16px]">{list}</div>
        </BottomSheet>
      ) : (
        <OptionPopover
          state={state}
          triggerRef={containerRef}
          popoverRef={popoverRef}
          onPressOutside={() => {
            releaseFocusRef.current = true;
          }}
        >
          {list}
        </OptionPopover>
      )}
    </>
  );
}

export type { Key as SelectKey } from 'react-stately';

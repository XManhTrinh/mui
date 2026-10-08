'use client';

import { animate, useReducedMotion } from 'motion/react';
import {
  Fragment,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react';
import {
  mergeProps,
  useFocusRing,
  useHover,
  useObjectRef,
  useTextField,
  type AriaTextFieldOptions,
  type AriaTextFieldProps,
} from 'react-aria';
import { useControlledState } from 'react-stately/useControlledState';
import { useM3Spring } from '../../motion/use-m3-spring';
import { ErrorText, FieldLabel, SupportingText } from '../../primitives/Field';
import { cn } from '../../utils/cn';
import { splitDataAttributes } from '../../utils/split-data-attributes';
import {
  pinInputStyles,
  type PinInputCorner,
  type PinInputSize,
  type PinInputVariant,
} from './pin-input-styles';
import { sanitizePin, type PinInputType } from './sanitize-pin';

/** A box's state: the TextField `data-field-state` values, for that box. */
type BoxState = 'disabled' | 'error-focus' | 'error-hover' | 'error' | 'focus' | 'hover' | 'rest';

export interface PinInputClassNames {
  root?: string;
  label?: string;
  /** The row of boxes (and separators). */
  boxes?: string;
  box?: string;
  separator?: string;
  supportingText?: string;
  errorText?: string;
}

/** Props React Aria names differently, or that a fixed-length code sets itself. */
type ReplacedAriaProps =
  | 'isDisabled'
  | 'isReadOnly'
  | 'isRequired'
  | 'isInvalid'
  | 'label'
  | 'description'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'type'
  | 'pattern'
  | 'inputMode'
  | 'maxLength'
  | 'minLength'
  | 'placeholder';

interface PinInputOwnProps extends Omit<AriaTextFieldProps<HTMLInputElement>, ReplacedAriaProps> {
  /** The number of boxes, 3–12. @default 6 */
  length?: number;
  /** The characters it accepts. Letter types are upper-cased. @default "numeric" */
  type?: PinInputType;
  /**
   * A one-character test that replaces `type`'s own, e.g. `/[2-9A-HJ-NP-Z]/` for codes
   * without the easily confused 0, O, 1 and I.
   */
  pattern?: RegExp;
  /** Shows a dot instead of each character, for PINs. */
  mask?: boolean;
  /**
   * Lets the phone offer the code from an SMS or email (`autocomplete="one-time-code"`).
   * Turn it off for PINs and other codes. @default true
   */
  otp?: boolean;
  /** Splits the boxes into groups, e.g. `[3, 3]` for `123–456`. They must add up to `length`. */
  groups?: readonly number[];
  /** What goes between groups. @default an en dash */
  separator?: ReactNode;
  /** @default "outlined" */
  variant?: PinInputVariant;
  /** @default "medium" */
  size?: PinInputSize;
  /** A corner from the M3 shape scale. @default "extra-small" (the text field's) */
  corner?: PinInputCorner;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Called once when the last box is filled, by typing, paste or autofill. */
  onComplete?: (value: string) => void;
  /** Helper text below the boxes. Replaced visually by the error message when invalid. */
  supportingText?: ReactNode;
  /** Marks the code invalid: the boxes turn `error` and the row shakes once. */
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  classNames?: PinInputClassNames;
  style?: CSSProperties;
  /** Ref to the root element. */
  ref?: Ref<HTMLDivElement>;
  /** Ref to the input that holds the code. */
  inputRef?: Ref<HTMLInputElement>;
}

/** A visible label, or an accessible name for inputs without one. */
type PinInputLabel =
  | { label: ReactNode }
  | { label?: undefined; 'aria-label': string }
  | { label?: undefined; 'aria-labelledby': string };

export type PinInputProps = PinInputOwnProps & PinInputLabel;

/** The group sizes, or one group when `groups` doesn't add up to `length`. */
function resolveGroups(length: number, groups: readonly number[] | undefined): number[] {
  if (!groups) return [length];
  const valid =
    groups.every((size) => Number.isInteger(size) && size > 0) &&
    groups.reduce((total, size) => total + size, 0) === length;
  if (valid) return [...groups];
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      `PinInput: groups [${groups.join(', ')}] must be positive and add up to length ${length}.`,
    );
  }
  return [length];
}

/**
 * An input for a short, fixed-length code, with one box per character: verification and
 * reset codes, two-factor codes, PINs, and invite or voucher codes.
 *
 * **Not an M3 component** (a `vk` component, see docs/plans/pin-input.md). Each box is drawn
 * with the M3 text field tokens, in the `outlined` or `filled` variant. One real input sits
 * invisibly over the boxes, so one-time-code autofill, paste, password managers and screen
 * readers treat it as a single field. Pasted text is cleaned (`"123 456"` → `123456`).
 *
 * @example
 * <PinInput label="6-digit code" groups={[3, 3]} onComplete={verify} />
 * <PinInput label="PIN" length={4} mask otp={false} corner="full" />
 */
export function PinInput(props: PinInputProps) {
  const {
    length: lengthProp = 6,
    type = 'numeric',
    pattern,
    mask = false,
    otp = true,
    groups,
    separator = '–',
    variant = 'outlined',
    size = 'medium',
    corner = 'extra-small',
    label,
    value: valueProp,
    defaultValue,
    onChange,
    onComplete,
    supportingText,
    errorMessage,
    invalid,
    required,
    disabled = false,
    readOnly,
    className,
    classNames,
    style,
    ref,
    inputRef,
    ...otherProps
  } = props;

  const length = Math.min(12, Math.max(3, Math.round(lengthProp)));
  const { data: rootData, rest: ariaProps } = splitDataAttributes(otherProps);
  const clean = (text: string) => sanitizePin(text, { type, pattern, length });

  const [value, setValue] = useControlledState(valueProp, defaultValue ?? '', onChange);
  const code = clean(value);
  const domInputRef = useObjectRef(inputRef);
  const boxRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const entered = useRef<number[]>([]);
  const [selection, setSelection] = useState(code.length);

  const update = (next: string) => {
    const cleaned = clean(next);
    if (cleaned === code) return;
    entered.current = [...cleaned].flatMap((character, index) =>
      character !== code[index] ? [index] : [],
    );
    setValue(cleaned);
    if (cleaned.length === length) onComplete?.(cleaned);
  };

  const {
    labelProps,
    inputProps,
    descriptionProps,
    errorMessageProps,
    isInvalid,
    validationErrors,
    validationDetails,
  } = useTextField(
    {
      ...ariaProps,
      label,
      description: supportingText,
      errorMessage,
      value: code,
      onChange: update,
      isInvalid: invalid,
      isRequired: required,
      isDisabled: disabled,
      isReadOnly: readOnly,
      type: mask ? 'password' : 'text',
      inputMode: type === 'numeric' ? 'numeric' : 'text',
      autoComplete: ariaProps.autoComplete ?? (otp ? 'one-time-code' : 'off'),
      autoCapitalize: type === 'numeric' ? 'off' : 'characters',
      autoCorrect: 'off',
      spellCheck: 'false',
      enterKeyHint: 'done',
    } as AriaTextFieldOptions<'input'>,
    domInputRef,
  );
  const { focusProps, isFocused } = useFocusRing({ isTextInput: true });
  const ariaInputProps = mergeProps(inputProps, focusProps);
  const { hoverProps, isHovered } = useHover({ isDisabled: disabled });

  // New characters pop into their boxes on the fast spatial spring.
  const spring = useM3Spring('spatial', 'fast');
  const reducedMotion = useReducedMotion();
  useLayoutEffect(() => {
    const indices = entered.current;
    entered.current = [];
    if (reducedMotion) return;
    for (const index of indices) {
      const character = boxRefs.current[index]?.firstElementChild;
      if (character) animate(character, { scale: [0.6, 1], opacity: [0, 1] }, spring);
    }
  }, [code, reducedMotion, spring]);

  /**
   * Keeps the caret in step with the boxes: inside the code, the character in the active
   * box is selected, so typing replaces it; after the code, the caret waits in the next box.
   */
  const syncSelection = () => {
    const input = domInputRef.current;
    if (!input) return;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? start;
    const all = input.value.length;
    // Browsers select the whole value on keyboard focus; start in the next empty box instead.
    if (all > 1 && start === 0 && end === all) {
      input.setSelectionRange(all, all);
      return;
    }
    if (start === end && start < all) {
      input.setSelectionRange(start, start + 1);
      return;
    }
    setSelection(start);
  };

  const moveTo = (index: number) => {
    const input = domInputRef.current;
    if (!input) return;
    const target = Math.max(0, Math.min(index, input.value.length));
    if (target < input.value.length) input.setSelectionRange(target, target + 1);
    else input.setSelectionRange(target, target);
    setSelection(target);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) return;
    const keys: Record<string, number> = {
      ArrowLeft: selection - 1,
      ArrowRight: selection + 1,
      Home: 0,
      End: code.length,
    };
    const target = keys[event.key];
    if (target === undefined) return;
    event.preventDefault();
    moveTo(target);
  };

  // A pasted code replaces the whole value; a shorter paste goes in at the caret.
  const onPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (readOnly || disabled) return;
    const pasted = clean(event.clipboardData.getData('text'));
    if (!pasted) return;
    const input = event.currentTarget;
    const start = input.selectionStart ?? code.length;
    const end = input.selectionEnd ?? start;
    const next = pasted.length >= length ? pasted : code.slice(0, start) + pasted + code.slice(end);
    update(next);
    const caret = Math.min(start + pasted.length, clean(next).length);
    requestAnimationFrame(() => moveTo(caret));
  };

  // A tap or click on a box puts the caret in that box.
  const onClick = (event: MouseEvent<HTMLInputElement>) => {
    const index = boxRefs.current.findIndex((box) => {
      if (!box) return false;
      const rect = box.getBoundingClientRect();
      return event.clientX >= rect.left && event.clientX <= rect.right;
    });
    if (index >= 0) moveTo(index);
  };

  const activeIndex = isFocused && !readOnly ? Math.min(selection, length - 1) : -1;
  const boxState = (index: number): BoxState => {
    if (disabled) return 'disabled';
    const active = index === activeIndex;
    if (isInvalid) return active ? 'error-focus' : isHovered ? 'error-hover' : 'error';
    return active ? 'focus' : isHovered ? 'hover' : 'rest';
  };

  const resolvedError =
    typeof errorMessage === 'function'
      ? errorMessage({ isInvalid, validationErrors, validationDetails })
      : (errorMessage ?? validationErrors.join(' '));
  const showError = isInvalid && Boolean(resolvedError);
  const styles = pinInputStyles({ variant, size, corner });
  const requiredMark = required ? <span aria-hidden="true"> *</span> : null;

  const groupKey = groups?.join(',');
  // eslint-disable-next-line react-hooks/exhaustive-deps -- `groupKey` stands for `groups`, so an inline array doesn't re-warn every render.
  const sizes = useMemo(() => resolveGroups(length, groups), [length, groupKey]);
  const starts = sizes.map((_, group) => sizes.slice(0, group).reduce((a, b) => a + b, 0));

  const renderBox = (index: number) => {
    const character = code[index];
    const showCaret = index === activeIndex && character === undefined;
    return (
      <span
        key={index}
        ref={(element) => {
          boxRefs.current[index] = element;
        }}
        data-state={boxState(index)}
        data-filled={character !== undefined || undefined}
        className={styles.box({ class: classNames?.box })}
      >
        {character === undefined ? (
          showCaret ? (
            <span className={styles.caret()} />
          ) : null
        ) : mask ? (
          <span className={styles.mask()} />
        ) : (
          <span className={styles.character()}>{character}</span>
        )}
      </span>
    );
  };

  return (
    <div
      {...rootData}
      ref={ref}
      style={style}
      className={styles.root({ class: cn(classNames?.root, className) })}
      data-variant={variant}
      data-size={size}
      data-focused={isFocused || undefined}
      data-hovered={(isHovered && !disabled) || undefined}
      data-invalid={isInvalid || undefined}
      data-disabled={disabled || undefined}
      data-complete={code.length === length || undefined}
    >
      {label !== undefined && label !== null && (
        <FieldLabel {...labelProps} className={styles.label({ class: classNames?.label })}>
          {label}
          {requiredMark}
        </FieldLabel>
      )}
      <div {...hoverProps} dir="ltr" className={styles.field()}>
        <div aria-hidden="true" className={styles.boxes({ class: classNames?.boxes })}>
          {sizes.map((groupSize, group) => (
            <Fragment key={group}>
              {group > 0 && (
                <span className={styles.separator({ class: classNames?.separator })}>
                  {separator}
                </span>
              )}
              {Array.from({ length: groupSize }, (_, offset) => renderBox(starts[group]! + offset))}
            </Fragment>
          ))}
        </div>
        <input
          {...ariaInputProps}
          onKeyDown={(event) => {
            ariaInputProps.onKeyDown?.(event);
            onKeyDown(event);
          }}
          onPaste={(event) => {
            ariaInputProps.onPaste?.(event);
            onPaste(event);
          }}
          onClick={(event) => {
            ariaInputProps.onClick?.(event);
            onClick(event);
          }}
          onSelect={(event) => {
            ariaInputProps.onSelect?.(event);
            syncSelection();
          }}
          ref={domInputRef}
          className={styles.input()}
        />
      </div>
      {(supportingText || showError) && (
        <div className="flex flex-col">
          {supportingText && (
            <SupportingText
              {...descriptionProps}
              className={cn(
                styles.supportingText({ class: classNames?.supportingText }),
                showError && 'sr-only',
              )}
            >
              {supportingText}
            </SupportingText>
          )}
          {showError && (
            <ErrorText
              {...errorMessageProps}
              className={styles.supportingText({ class: classNames?.errorText })}
            >
              {resolvedError}
            </ErrorText>
          )}
        </div>
      )}
    </div>
  );
}

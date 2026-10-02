'use client';

import type {
  CSSProperties,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  Ref,
} from 'react';
import { VisuallyHidden } from 'react-aria';
import { cn } from '../utils/cn';
import { selectionControlStyles } from './selection-control-styles';
import { TouchTarget } from './TouchTarget';

export interface SelectionControlClassNames {
  root?: string;
  control?: string;
  label?: string;
}

export interface SelectionControlProps {
  /** Props from the React Aria hook (`labelProps`, merged with hover handling). */
  rootProps: LabelHTMLAttributes<HTMLLabelElement>;
  /** Props from the React Aria hook (`inputProps`, merged with focus handling). */
  inputProps: InputHTMLAttributes<HTMLInputElement>;
  inputRef: Ref<HTMLInputElement>;
  /** State attributes, set on both the root and the control. */
  state: Record<`data-${string}`, true | undefined>;
  /** Consumer `data-*` attributes for the root. */
  rootData?: Record<`data-${string}`, unknown>;
  /** The drawn indicator (box, ring, track), hidden from assistive tech. */
  indicator: ReactNode;
  children?: ReactNode;
  ref?: Ref<HTMLLabelElement>;
  className?: string;
  /** The recipe's slots, so its classes and the base classes merge in one place. */
  styles?: {
    root: (props?: { class?: string }) => string;
    control: (props?: { class?: string }) => string;
    label: (props?: { class?: string }) => string;
  };
  classNames?: SelectionControlClassNames;
  style?: CSSProperties;
  /** Inline style for the control (e.g. CSS variables that position a switch thumb). */
  controlStyle?: CSSProperties;
}

/**
 * Shared structure of checkboxes, radio buttons and switches: a root `<label>` holding a
 * visually hidden native input, the 40px state-layer control with a 48px touch target,
 * the indicator and the label text.
 */
export function SelectionControl({
  rootProps,
  inputProps,
  inputRef,
  state,
  rootData,
  indicator,
  children,
  ref,
  className,
  styles = selectionControlStyles(),
  classNames,
  style,
  controlStyle,
}: SelectionControlProps) {
  return (
    <label
      {...rootData}
      {...rootProps}
      {...state}
      ref={ref}
      style={style}
      className={styles.root({ class: cn(classNames?.root, className) })}
    >
      <span
        {...state}
        style={controlStyle}
        className={styles.control({ class: classNames?.control })}
      >
        <VisuallyHidden>
          <input {...inputProps} ref={inputRef} />
        </VisuallyHidden>
        <TouchTarget />
        {indicator}
      </span>
      {children !== undefined && children !== null && (
        <span className={styles.label({ class: classNames?.label })}>{children}</span>
      )}
    </label>
  );
}

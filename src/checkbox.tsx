"use client";

import * as React from "react";

import { cn } from "./lib/utils";

/**
 * Material Design 3 Checkbox
 *
 * M3 Specs (m3.material.io/components/checkbox/specs):
 * - Container: 18dp × 18dp, 2dp corner radius
 * - Icon: 18dp (checkmark/dash), center-aligned
 * - State layer: 40dp circular
 * - Target size: 48dp minimum
 * - Colors:
 *   - Unchecked: on-surface-variant border, transparent fill
 *   - Checked: primary fill, on-primary checkmark
 *   - Indeterminate: primary fill, on-primary dash
 *   - Disabled unchecked: on-surface border at 38%
 *   - Disabled checked: on-surface bg at 38%
 *   - State layer: primary (checked), on-surface (unchecked)
 * - Animation: 100ms, cubic-bezier(0.2, 0, 0, 1)
 */

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean | "indeterminate") => void;
  indeterminate?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  value?: string;
  className?: string;
  "aria-label"?: string;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      indeterminate = false,
      disabled = false,
      id,
      name,
      value,
      className,
      "aria-label": ariaLabel,
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
    const isControlled = controlledChecked !== undefined;
    const isChecked = isControlled ? controlledChecked : internalChecked;

    const active = indeterminate || isChecked;

    const handleClick = () => {
      if (disabled) return;

      if (indeterminate) {
        if (!isControlled) setInternalChecked(true);
        onCheckedChange?.(true);
      } else {
        const next = !isChecked;
        if (!isControlled) setInternalChecked(next);
        onCheckedChange?.(next);
      }
    };

    const ariaCheckedValue: "true" | "false" | "mixed" = indeterminate
      ? "mixed"
      : isChecked
        ? "true"
        : "false";

    return (
      <button
        ref={ref}
        type="button"
        role="checkbox"
        aria-checked={ariaCheckedValue}
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        id={id}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          "group relative inline-flex items-center justify-center w-12 h-12 select-none",
          "focus-visible:outline-none",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
          className
        )}
      >
        {/* Hidden native input for form submission */}
        {name && (
          <input
            type="checkbox"
            name={name}
            value={value}
            checked={isChecked}
            readOnly
            hidden
            aria-hidden="true"
            tabIndex={-1}
          />
        )}

        {/* State layer — 40dp circle */}
        <span
          className={cn(
            "absolute w-10 h-10 rounded-full transition-colors duration-200 pointer-events-none",
            !disabled &&
              !active &&
              "group-hover:bg-[hsl(var(--on-surface)/0.08)]",
            !disabled && active && "group-hover:bg-[hsl(var(--primary)/0.08)]"
          )}
        />

        {/* Visual container — 18×18dp, 2dp border radius */}
        <span
          className={cn(
            "relative z-10 flex items-center justify-center w-[18px] h-[18px] rounded-[2px]",
            "transition-all duration-100 ease-[cubic-bezier(0.2,0,0,1)]",
            // Unchecked
            !active && !disabled && "border-2 border-[hsl(var(--on-surface-variant))] bg-transparent",
            // Checked / Indeterminate
            active && !disabled && "border-0 bg-primary",
            // Disabled unchecked
            !active && disabled && "border-2 border-[hsl(var(--on-surface)/0.38)] bg-transparent",
            // Disabled checked
            active && disabled && "border-0 bg-[hsl(var(--on-surface)/0.38)]"
          )}
        >
          {/* Checkmark / Indeterminate dash */}
          {active && (
            <svg
              className={cn(
                "w-3 h-3 transition-all duration-100 ease-[cubic-bezier(0.2,0,0,1)]",
                !disabled ? "text-primary-foreground" : "text-surface"
              )}
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {indeterminate ? (
                <line x1="2" y1="6" x2="10" y2="6" />
              ) : (
                <polyline points="2 6.5 4.5 9 10 3" />
              )}
            </svg>
          )}
        </span>
      </button>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };

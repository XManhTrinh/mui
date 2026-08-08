"use client";

import * as React from "react";

import { cn } from "./lib/utils";

/**
 * Material Design 3 Text Field
 *
 * @see https://m3.material.io/components/text-fields/specs
 *
 * Variants: Filled and Outlined.
 *
 * Filled:
 * - Container: surface-container-highest bg, 56dp height
 * - Rounded top corners (4dp), flat bottom
 * - Active indicator: bottom line, 1dp → 2dp on focus
 * - Active indicator color: on-surface → primary on focus
 *
 * Outlined:
 * - Container: transparent bg, 56dp height
 * - Border: 1dp outline → 2dp primary on focus, 4dp radius all corners
 * - Label notch: floating label creates gap in top border
 *
 * Typography:
 * - Label: Body Large (16px/400/24px/0.5px) resting, Body Small (12px/400/16px/0.4px) floating
 * - Input: Body Large (16px/400/24px/0.5px)
 * - Supporting text: Body Small (12px/400/16px/0.4px)
 *
 * States: Enabled, Focused, Hovered, Disabled, Error
 * - Hover: 8% state layer on container (filled only)
 * - Focus: primary on indicator/border + label
 * - Disabled: 38% text, 12% container/border opacity
 *
 * Animation: label float 200ms M3 standard easing
 */

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: "filled" | "outlined";
  label?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  supportingText?: string;
  error?: boolean;
  errorText?: string;
  prefix?: string;
  suffix?: string;
  multiline?: boolean;
  rows?: number;
  characterCount?: { current: number; max: number };
  className?: string;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      className,
      variant = "outlined",
      label,
      leadingIcon,
      trailingIcon,
      supportingText,
      error = false,
      errorText,
      prefix,
      suffix,
      multiline = false,
      rows = 3,
      characterCount,
      disabled,
      value,
      defaultValue,
      onFocus,
      onBlur,
      onChange,
      id,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(
      Boolean(value || defaultValue)
    );
    const generatedId = React.useId();
    const fieldId = id ?? generatedId;
    const supportingId = `${fieldId}-supporting`;

    const isFloating = isFocused || hasValue;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      onChange?.(e);
    };

    React.useEffect(() => {
      setHasValue(Boolean(value));
    }, [value]);

    const helperText = error && errorText ? errorText : supportingText;

    // Label color
    const labelColor = disabled
      ? "text-[hsl(var(--on-surface)/0.38)]"
      : error
        ? "text-error"
        : isFocused
          ? "text-primary"
          : "text-surface-variant-foreground";

    // Icon color
    const iconColor = error
      ? "text-error"
      : "text-surface-variant-foreground";

    const isFilled = variant === "filled";
    const isOutlined = variant === "outlined";

    return (
      <div className={cn("w-full", className)}>
        {/* Field container */}
        <div
          className={cn(
            "group relative flex items-center h-14",
            // Filled variant
            isFilled && [
              "rounded-t-sm rounded-b-none",
              disabled
                ? "bg-[hsl(var(--on-surface)/0.04)]"
                : "bg-surface-container-highest",
              !disabled && "hover:bg-[hsl(var(--on-surface)/0.08)]",
            ],
            // Outlined variant
            isOutlined && [
              "rounded-sm bg-transparent",
              // Border
              disabled
                ? "border border-[hsl(var(--on-surface)/0.12)]"
                : error
                  ? isFocused
                    ? "border-2 border-error"
                    : "border border-error"
                  : isFocused
                    ? "border-2 border-primary"
                    : "border border-outline hover:border-[hsl(var(--on-surface))]",
            ],
            // Disabled state
            disabled && "pointer-events-none"
          )}
        >
          {/* Filled variant: active indicator (bottom line) */}
          {isFilled && (
            <span
              className={cn(
                "absolute bottom-0 left-0 right-0 transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
                disabled
                  ? "h-px bg-[hsl(var(--on-surface)/0.38)]"
                  : error
                    ? isFocused
                      ? "h-0.5 bg-error"
                      : "h-px bg-error"
                    : isFocused
                      ? "h-0.5 bg-primary"
                      : "h-px bg-[hsl(var(--on-surface-variant))]"
              )}
            />
          )}

          {/* Leading icon */}
          {leadingIcon && (
            <div
              className={cn(
                "flex items-center justify-center w-12 h-12 shrink-0 ml-0",
                "pl-3",
                iconColor
              )}
            >
              {leadingIcon}
            </div>
          )}

          {/* Input area */}
          <div
            className={cn(
              "relative flex-1 flex items-center h-full",
              leadingIcon ? "pl-4" : "pl-4",
              trailingIcon ? "pr-0" : "pr-4"
            )}
          >
            {/* Floating label */}
            {label && (
              <label
                htmlFor={fieldId}
                className={cn(
                  "absolute pointer-events-none origin-top-left",
                  "transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
                  labelColor,
                  // Floating position
                  isFloating && [
                    "text-[12px] leading-4 tracking-[0.4px]",
                    isOutlined
                      ? "-top-2 left-3 px-1 bg-surface"
                      : "top-2 left-4",
                  ],
                  // Resting position
                  !isFloating && [
                    "top-1/2 -translate-y-1/2 left-4",
                    "text-[16px] leading-6 tracking-[0.5px]",
                  ],
                  // Adjust label left position for leading icon
                  leadingIcon && !isFloating && "left-0",
                  leadingIcon && isFloating && isOutlined && "left-3"
                )}
              >
                {label}
              </label>
            )}

            {/* Prefix */}
            {prefix && isFloating && (
              <span className="text-[16px] leading-6 tracking-[0.5px] text-surface-variant-foreground mr-0.5 shrink-0">
                {prefix}
              </span>
            )}

            {/* Input / Textarea */}
            {multiline ? (
              <textarea
                ref={ref as React.Ref<HTMLTextAreaElement>}
                id={fieldId}
                value={value}
                defaultValue={defaultValue}
                onFocus={handleFocus as unknown as React.FocusEventHandler<HTMLTextAreaElement>}
                onBlur={handleBlur as unknown as React.FocusEventHandler<HTMLTextAreaElement>}
                onChange={handleChange as unknown as React.ChangeEventHandler<HTMLTextAreaElement>}
                disabled={disabled}
                rows={rows}
                aria-invalid={error || undefined}
                aria-describedby={helperText ? supportingId : undefined}
                className={cn(
                  "w-full bg-transparent resize-none outline-none",
                  "text-[16px] leading-6 tracking-[0.5px] text-surface-foreground",
                  "caret-primary placeholder:text-surface-variant-foreground",
                  // Autofill: override browser forced background
                  "[&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:[-webkit-text-fill-color:hsl(var(--on-surface))] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]",
                  disabled && "text-[hsl(var(--on-surface)/0.38)]",
                  label && isFloating && "pt-5",
                  label && !isFloating && "placeholder:text-transparent"
                )}
                {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
              />
            ) : (
              <input
                ref={ref}
                id={fieldId}
                type={props.type ?? "text"}
                value={value}
                defaultValue={defaultValue}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
                disabled={disabled}
                aria-invalid={error || undefined}
                aria-describedby={helperText ? supportingId : undefined}
                className={cn(
                  "w-full h-full bg-transparent outline-none",
                  "text-[16px] leading-6 tracking-[0.5px] text-surface-foreground",
                  "caret-primary placeholder:text-surface-variant-foreground",
                  // Autofill: override browser forced background
                  "[&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:[-webkit-text-fill-color:hsl(var(--on-surface))] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]",
                  disabled && "text-[hsl(var(--on-surface)/0.38)]",
                  label && isFloating && "pt-4",
                  label && !isFloating && "placeholder:text-transparent"
                )}
                {...props}
              />
            )}

            {/* Suffix */}
            {suffix && isFloating && (
              <span className="text-[16px] leading-6 tracking-[0.5px] text-surface-variant-foreground ml-0.5 shrink-0">
                {suffix}
              </span>
            )}
          </div>

          {/* Trailing icon */}
          {trailingIcon && (
            <div
              className={cn(
                "flex items-center justify-center w-12 h-12 shrink-0 pr-3",
                iconColor
              )}
            >
              {trailingIcon}
            </div>
          )}
        </div>

        {/* Supporting text + character count row */}
        {(helperText || characterCount) && (
          <div className="flex items-start mt-1 px-4 gap-4">
            {helperText && (
              <p
                id={supportingId}
                className={cn(
                  "flex-1 text-[12px] leading-4 tracking-[0.4px]",
                  error ? "text-error" : "text-surface-variant-foreground"
                )}
              >
                {helperText}
              </p>
            )}
            {characterCount && (
              <span
                className={cn(
                  "text-[12px] leading-4 tracking-[0.4px] shrink-0",
                  error ? "text-error" : "text-surface-variant-foreground"
                )}
              >
                {characterCount.current}/{characterCount.max}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);
TextField.displayName = "TextField";

export { TextField };

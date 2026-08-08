"use client";

import * as React from "react";

import { cn } from "./lib/utils";

/**
 * Material Design 3 Text Field
 *
 * @see https://m3.material.io/components/text-fields/specs
 *
 * Uses a <fieldset> + <legend> for the outlined notch (same as MUI React).
 * The browser natively handles the gap in the border.
 *
 * Measurements:
 * - Height: 56dp
 * - L/R padding (no icons): 16dp
 * - Corner radius: 4dp
 * - Floating label padding: 4dp (spec: "Left/right padding populated label text: 4dp")
 * - Supporting text top padding: 4dp
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
    const isFilled = variant === "filled";
    const isOutlined = variant === "outlined";

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

    const labelColor = disabled
      ? "text-[hsl(var(--on-surface)/0.38)]"
      : error
        ? "text-error"
        : isFocused
          ? "text-primary"
          : "text-surface-variant-foreground";

    const iconColor = error ? "text-error" : "text-surface-variant-foreground";

    const borderColor = disabled
      ? "border-[hsl(var(--on-surface)/0.12)]"
      : error
        ? "border-error"
        : isFocused
          ? "border-primary"
          : "border-outline";

    const inputClasses = cn(
      "w-full h-full bg-transparent outline-none",
      "text-[16px] leading-6 tracking-[0.5px] text-surface-foreground",
      "caret-primary placeholder:text-surface-variant-foreground",
      "[&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:[-webkit-text-fill-color:hsl(var(--on-surface))] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]",
      disabled && "text-[hsl(var(--on-surface)/0.38)]",
      label && !isFloating && "placeholder:text-transparent"
    );

    return (
      <div className={cn("w-full", className)}>
        <div
          className={cn(
            "relative flex items-center h-14",
            isFilled && [
              "rounded-t-[4px] rounded-b-none",
              disabled
                ? "bg-[hsl(var(--on-surface)/0.04)]"
                : "bg-surface-container-highest",
              !disabled && "hover:bg-[hsl(var(--on-surface)/0.08)]",
            ],
            disabled && "pointer-events-none"
          )}
        >
          {/* Outlined: fieldset creates the border with native legend notch */}
          {isOutlined && (
            <fieldset
              aria-hidden="true"
              className={cn(
                "absolute inset-0 -top-[5px] pointer-events-none m-0 rounded-[4px] px-2 overflow-visible",
                "border transition-colors duration-200",
                isFocused && "border-2",
                borderColor,
                !disabled && !isFocused && !error && "group-hover:border-[hsl(var(--on-surface))]"
              )}
            >
              <legend
                className={cn(
                  "invisible block h-[11px] text-[12px] leading-[11px] whitespace-nowrap overflow-hidden p-0 transition-all duration-200",
                  isFloating && label
                    ? "max-w-full ml-2 px-1"
                    : "max-w-[0.01px] ml-0 px-0"
                )}
              >
                <span>{label}</span>
              </legend>
            </fieldset>
          )}

          {/* Filled: bottom indicator */}
          {isFilled && (
            <span
              className={cn(
                "absolute bottom-0 left-0 right-0 transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
                disabled
                  ? "h-px bg-[hsl(var(--on-surface)/0.38)]"
                  : error
                    ? isFocused ? "h-0.5 bg-error" : "h-px bg-error"
                    : isFocused
                      ? "h-0.5 bg-primary"
                      : "h-px bg-[hsl(var(--on-surface-variant))]"
              )}
            />
          )}

          {/* Leading icon */}
          {leadingIcon && (
            <div className={cn("flex items-center justify-center w-12 h-12 shrink-0 pl-3", iconColor)}>
              {leadingIcon}
            </div>
          )}

          {/* Label — positioned on container */}
          {label && (
            <label
              htmlFor={fieldId}
              className={cn(
                "absolute pointer-events-none z-10",
                "transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
                labelColor,
                isFloating
                  ? [
                      "text-[12px] leading-4 tracking-[0.4px]",
                      isOutlined ? "top-[-8px] left-[16px]" : "top-2 left-4",
                    ]
                  : cn(
                      "top-1/2 -translate-y-1/2 text-[16px] leading-6 tracking-[0.5px]",
                      leadingIcon ? "left-[52px]" : "left-4"
                    )
              )}
            >
              {label}
            </label>
          )}

          {/* Content */}
          <div
            className={cn(
              "group relative flex-1 flex items-center h-full",
              leadingIcon ? "pl-1" : "pl-4",
              trailingIcon ? "pr-0" : "pr-4"
            )}
          >
            {/* Prefix */}
            {prefix && isFloating && (
              <span className="text-[16px] leading-6 tracking-[0.5px] text-surface-variant-foreground mr-0.5 shrink-0">
                {prefix}
              </span>
            )}

            {/* Input */}
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
                className={cn(inputClasses, "resize-none", label && isFloating && "pt-5")}
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
                className={cn(inputClasses, label && isFloating && "pt-3")}
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
            <div className={cn("flex items-center justify-center w-12 h-12 shrink-0 pr-3", iconColor)}>
              {trailingIcon}
            </div>
          )}
        </div>

        {/* Supporting text */}
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

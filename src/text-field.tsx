"use client";

import * as React from "react";

import { cn } from "./lib/utils";

/**
 * Material Design 3 Text Field
 *
 * @see https://m3.material.io/components/text-fields/specs
 *
 * Uses the MDC-Web notched outline approach for the outlined variant:
 * Three border segments (leading, notch, trailing) where the notch
 * removes its top border when the label floats, creating a clean gap.
 *
 * Measurements:
 * - Height: 56dp
 * - L/R padding (no icons): 16dp
 * - L/R padding (with icons): 12dp
 * - Floating label L/R padding: 4dp
 * - Corner radius: 4dp
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

    // Colors
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

    const borderWidth = isFocused ? "border-2" : "border";

    // Input classes shared between input and textarea
    const inputClasses = cn(
      "w-full bg-transparent outline-none",
      "text-[16px] leading-6 tracking-[0.5px] text-surface-foreground",
      "caret-primary placeholder:text-surface-variant-foreground",
      "[&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:[-webkit-text-fill-color:hsl(var(--on-surface))] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]",
      disabled && "text-[hsl(var(--on-surface)/0.38)]",
      label && !isFloating && "placeholder:text-transparent"
    );

    return (
      <div className={cn("w-full", className)}>
        {/* Field container */}
        <div
          className={cn(
            "group relative flex items-center h-14",
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
          {/* ─── Outlined variant: notched border ─── */}
          {isOutlined && (
            <div className="absolute inset-0 pointer-events-none flex rounded-[4px]">
              {/* Leading edge */}
              <div
                className={cn(
                  "w-3 rounded-l-[4px] border-t border-b border-l transition-colors duration-200",
                  borderWidth === "border-2" && "[border-width:2px]",
                  borderColor
                )}
              />
              {/* Notch (contains label space) */}
              <div
                className={cn(
                  "flex items-center border-b transition-colors duration-200",
                  borderWidth === "border-2" && "[border-bottom-width:2px]",
                  // Top border: hidden when label floats (creates the notch)
                  isFloating && label ? "border-t-0" : cn("border-t", borderWidth === "border-2" && "[border-top-width:2px]"),
                  borderColor
                )}
              >
                {/* Invisible label spacer to size the notch */}
                {label && (
                  <span
                    className={cn(
                      "inline-block px-1 text-[12px] leading-4 tracking-[0.4px]",
                      isFloating ? "visible" : "invisible w-0 px-0"
                    )}
                    aria-hidden="true"
                  >
                    {label}
                  </span>
                )}
              </div>
              {/* Trailing edge */}
              <div
                className={cn(
                  "flex-1 rounded-r-[4px] border-t border-b border-r transition-colors duration-200",
                  borderWidth === "border-2" && "[border-width:2px]",
                  borderColor
                )}
              />
            </div>
          )}

          {/* ─── Filled variant: bottom indicator ─── */}
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

          {/* Content area */}
          <div
            className={cn(
              "relative flex-1 flex items-center h-full",
              "pl-4",
              trailingIcon ? "pr-0" : "pr-4"
            )}
          >
            {/* Floating label (visual) */}
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
                        isOutlined ? "-top-2 left-3" : "top-1 left-0",
                      ]
                    : "top-1/2 -translate-y-1/2 left-0 text-[16px] leading-6 tracking-[0.5px]"
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
                className={cn(inputClasses, "resize-none h-full", label && isFloating && "pt-5")}
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
                className={cn(inputClasses, "h-full", label && isFloating && "pt-4")}
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

"use client";

import * as React from "react";

import { cn } from "./lib/utils";

/**
 * Material Design 3 TextField
 *
 * M3 Specs (m3.material.io/components/text-fields/specs):
 * - Container height: 56dp
 * - Corner radius: 4dp (outlined all, filled top only)
 * - Content padding: 16dp left/right
 * - Floating label: 12px/16px/400/0.4px tracking
 * - Resting label: 16px/24px/400/0.5px tracking
 * - Input text: 16px/24px/400/0.5px tracking
 * - Border: 1px default, 2px focus
 * - Outlined uses fieldset/legend for notch gap
 * - Filled uses bottom indicator line
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
      className,
      disabled = false,
      value,
      defaultValue,
      placeholder,
      onFocus,
      onBlur,
      id,
      ...inputProps
    },
    ref
  ) => {
    const [focused, setFocused] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState(
      defaultValue ?? ""
    );
    const inputId = id ?? React.useId();

    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const hasValue =
      currentValue !== "" && currentValue !== null && currentValue !== undefined;
    const isFloating = focused || hasValue || !!placeholder;

    const handleFocus = (
      e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setFocused(true);
      onFocus?.(e as React.FocusEvent<HTMLInputElement>);
    };

    const handleBlur = (
      e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setFocused(false);
      onBlur?.(e as React.FocusEvent<HTMLInputElement>);
    };

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      inputProps.onChange?.(e as React.ChangeEvent<HTMLInputElement>);
    };

    const displayedSupportingText = error && errorText ? errorText : supportingText;

    // Shared input classes
    const inputClasses = cn(
      "w-full bg-transparent outline-none cursor-text",
      "text-[16px] leading-6 font-normal tracking-[0.5px]",
      "text-[hsl(var(--on-surface))]",
      "placeholder:text-[hsl(var(--on-surface-variant))]",
      disabled && "text-[hsl(var(--on-surface)/0.38)] cursor-not-allowed",
      // Prevent autofill yellow background
      "[&:-webkit-autofill]:bg-transparent",
      "[&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_transparent_inset]",
      "[&:-webkit-autofill]:[-webkit-text-fill-color:hsl(var(--on-surface))]"
    );

    if (variant === "filled") {
      return (
        <div className={cn("relative", className)}>
          {/* Main container */}
          <div
            className={cn(
              "group relative flex items-center",
              multiline ? "min-h-14" : "h-14",
              "rounded-t rounded-b-none",
              "bg-[hsl(var(--surface-container-highest))]",
              !disabled && "hover:bg-[hsl(var(--on-surface)/0.08)]",
              disabled && "pointer-events-none cursor-not-allowed bg-[hsl(var(--on-surface)/0.04)]",
              "transition-colors duration-200"
            )}
          >
            {/* Leading icon */}
            {leadingIcon && (
              <span
                className={cn(
                  "flex items-center justify-center pl-3 pr-0",
                  "text-[hsl(var(--on-surface-variant))]",
                  disabled && "text-[hsl(var(--on-surface)/0.38)]"
                )}
              >
                {leadingIcon}
              </span>
            )}

            {/* Input area */}
            <div
              className={cn(
                "relative flex-1 flex items-center",
                leadingIcon ? "pl-3" : "pl-4",
                trailingIcon ? "pr-0" : "pr-4"
              )}
            >
              {/* Floating label */}
              {label && (
                <label
                  htmlFor={inputId}
                  className={cn(
                    "absolute pointer-events-none select-none",
                    "transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
                    "origin-top-left",
                    isFloating
                      ? [
                          "top-2 left-0",
                          "text-[12px] leading-4 tracking-[0.4px]",
                          focused && !error && "text-[hsl(var(--primary))]",
                          !focused && !error && "text-[hsl(var(--on-surface-variant))]",
                          error && "text-[hsl(var(--error))]",
                        ]
                      : [
                          "top-1/2 left-0 -translate-y-1/2",
                          "text-[16px] leading-6 tracking-[0.5px]",
                          !error
                            ? "text-[hsl(var(--on-surface-variant))]"
                            : "text-[hsl(var(--error))]",
                        ],
                    disabled && "text-[hsl(var(--on-surface)/0.38)]"
                  )}
                >
                  {label}
                </label>
              )}

              {/* Prefix */}
              {prefix && isFloating && (
                <span className="text-[16px] leading-6 tracking-[0.5px] text-[hsl(var(--on-surface-variant))] mr-0.5 mt-3">
                  {prefix}
                </span>
              )}

              {/* Input */}
              {multiline ? (
                <textarea
                  ref={ref as unknown as React.Ref<HTMLTextAreaElement>}
                  id={inputId}
                  disabled={disabled}
                  value={isControlled ? (value as string) : undefined}
                  defaultValue={!isControlled ? (defaultValue as string) : undefined}
                  placeholder={focused ? placeholder : undefined}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  rows={rows}
                  aria-invalid={error || undefined}
                  aria-describedby={
                    displayedSupportingText ? `${inputId}-supporting` : undefined
                  }
                  className={cn(inputClasses, "pt-6 pb-2 resize-y")}
                />
              ) : (
                <input
                  ref={ref}
                  id={inputId}
                  disabled={disabled}
                  value={isControlled ? value : undefined}
                  defaultValue={!isControlled ? defaultValue : undefined}
                  placeholder={focused ? placeholder : undefined}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  aria-invalid={error || undefined}
                  aria-describedby={
                    displayedSupportingText ? `${inputId}-supporting` : undefined
                  }
                  {...inputProps}
                  className={cn(inputClasses, "pt-6 pb-2")}
                />
              )}

              {/* Suffix */}
              {suffix && isFloating && (
                <span className="text-[16px] leading-6 tracking-[0.5px] text-[hsl(var(--on-surface-variant))] ml-0.5 mt-3">
                  {suffix}
                </span>
              )}
            </div>

            {/* Trailing icon */}
            {trailingIcon && (
              <span
                className={cn(
                  "flex items-center justify-center pr-3 pl-0",
                  error
                    ? "text-[hsl(var(--error))]"
                    : "text-[hsl(var(--on-surface-variant))]",
                  disabled && "text-[hsl(var(--on-surface)/0.38)]"
                )}
              >
                {trailingIcon}
              </span>
            )}

            {/* Bottom indicator line */}
            <span
              className={cn(
                "absolute bottom-0 left-0 right-0 pointer-events-none",
                "transition-[height,background-color] duration-200",
                focused
                  ? error
                    ? "h-0.5 bg-[hsl(var(--error))]"
                    : "h-0.5 bg-[hsl(var(--primary))]"
                  : error
                    ? "h-px bg-[hsl(var(--error))]"
                    : "h-px bg-[hsl(var(--on-surface-variant))]",
                disabled && "bg-[hsl(var(--on-surface)/0.12)]"
              )}
            />
          </div>

          {/* Supporting text / character count */}
          {(displayedSupportingText || characterCount) && (
            <div className="flex justify-between px-4 pt-1">
              {displayedSupportingText && (
                <span
                  id={`${inputId}-supporting`}
                  className={cn(
                    "text-[12px] leading-4 tracking-[0.4px]",
                    error
                      ? "text-[hsl(var(--error))]"
                      : "text-[hsl(var(--on-surface-variant))]",
                    disabled && "text-[hsl(var(--on-surface)/0.38)]"
                  )}
                >
                  {displayedSupportingText}
                </span>
              )}
              {characterCount && (
                <span
                  className={cn(
                    "text-[12px] leading-4 tracking-[0.4px] ml-auto",
                    "text-[hsl(var(--on-surface-variant))]",
                    disabled && "text-[hsl(var(--on-surface)/0.38)]"
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

    // Outlined variant
    return (
      <div className={cn("relative", className)}>
        {/* Main container */}
        <div
          className={cn(
            "group relative flex items-center",
            multiline ? "min-h-14" : "h-14",
            disabled && "pointer-events-none cursor-not-allowed"
          )}
        >
          {/* Fieldset for border + notch */}
          <fieldset
            aria-hidden="true"
            className={cn(
              "absolute inset-0 rounded pointer-events-none",
              "px-3",
              "transition-[border-color,border-width] duration-200",
              // Border styles
              focused
                ? error
                  ? "border-2 border-[hsl(var(--error))]"
                  : "border-2 border-[hsl(var(--primary))]"
                : error
                  ? "border border-[hsl(var(--error))]"
                  : cn(
                      "border border-[hsl(var(--outline))]",
                      !disabled && "group-hover:border-[hsl(var(--on-surface))]"
                    ),
              disabled && "border-[hsl(var(--on-surface)/0.12)]"
            )}
            style={{ top: "-5px" }}
          >
            <legend
              className={cn(
                "invisible h-0 overflow-hidden",
                "text-[12px] leading-0",
                "transition-all duration-200",
                isFloating ? "px-1 max-w-full" : "px-0 max-w-[0.01px]"
              )}
              style={{ marginLeft: "12px" }}
            >
              <span>{label}</span>
            </legend>
          </fieldset>

          {/* Visible floating label */}
          {label && (
            <label
              htmlFor={inputId}
              className={cn(
                "absolute pointer-events-none select-none",
                "transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
                "origin-top-left",
                isFloating
                  ? [
                      "text-[12px] leading-4 tracking-[0.4px]",
                      focused && !error && "text-[hsl(var(--primary))]",
                      !focused && !error && "text-[hsl(var(--on-surface-variant))]",
                      error && "text-[hsl(var(--error))]",
                    ]
                  : [
                      "top-1/2 -translate-y-1/2",
                      "text-[16px] leading-6 tracking-[0.5px]",
                      !error
                        ? "text-[hsl(var(--on-surface-variant))]"
                        : "text-[hsl(var(--error))]",
                    ],
                disabled && "text-[hsl(var(--on-surface)/0.38)]"
              )}
              style={
                isFloating
                  ? { top: "-8px", left: leadingIcon ? "48px" : "16px" }
                  : { left: leadingIcon ? "48px" : "16px" }
              }
            >
              {label}
            </label>
          )}

          {/* Leading icon */}
          {leadingIcon && (
            <span
              className={cn(
                "flex items-center justify-center pl-3 pr-0 z-10",
                "text-[hsl(var(--on-surface-variant))]",
                disabled && "text-[hsl(var(--on-surface)/0.38)]"
              )}
            >
              {leadingIcon}
            </span>
          )}

          {/* Input wrapper */}
          <div
            className={cn(
              "relative flex-1 flex items-center",
              leadingIcon ? "pl-3" : "pl-4",
              trailingIcon ? "pr-0" : "pr-4"
            )}
          >
            {/* Prefix */}
            {prefix && isFloating && (
              <span className="text-[16px] leading-6 tracking-[0.5px] text-[hsl(var(--on-surface-variant))] mr-0.5">
                {prefix}
              </span>
            )}

            {/* Input */}
            {multiline ? (
              <textarea
                ref={ref as unknown as React.Ref<HTMLTextAreaElement>}
                id={inputId}
                disabled={disabled}
                value={isControlled ? (value as string) : undefined}
                defaultValue={!isControlled ? (defaultValue as string) : undefined}
                placeholder={focused ? placeholder : undefined}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                rows={rows}
                aria-invalid={error || undefined}
                aria-describedby={
                  displayedSupportingText ? `${inputId}-supporting` : undefined
                }
                className={cn(inputClasses, "py-4 resize-y")}
              />
            ) : (
              <input
                ref={ref}
                id={inputId}
                disabled={disabled}
                value={isControlled ? value : undefined}
                defaultValue={!isControlled ? defaultValue : undefined}
                placeholder={focused ? placeholder : undefined}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                aria-invalid={error || undefined}
                aria-describedby={
                  displayedSupportingText ? `${inputId}-supporting` : undefined
                }
                {...inputProps}
                className={cn(inputClasses)}
              />
            )}

            {/* Suffix */}
            {suffix && isFloating && (
              <span className="text-[16px] leading-6 tracking-[0.5px] text-[hsl(var(--on-surface-variant))] ml-0.5">
                {suffix}
              </span>
            )}
          </div>

          {/* Trailing icon */}
          {trailingIcon && (
            <span
              className={cn(
                "flex items-center justify-center pr-3 pl-0 z-10",
                error
                  ? "text-[hsl(var(--error))]"
                  : "text-[hsl(var(--on-surface-variant))]",
                disabled && "text-[hsl(var(--on-surface)/0.38)]"
              )}
            >
              {trailingIcon}
            </span>
          )}
        </div>

        {/* Supporting text / character count */}
        {(displayedSupportingText || characterCount) && (
          <div className="flex justify-between px-4 pt-1">
            {displayedSupportingText && (
              <span
                id={`${inputId}-supporting`}
                className={cn(
                  "text-[12px] leading-4 tracking-[0.4px]",
                  error
                    ? "text-[hsl(var(--error))]"
                    : "text-[hsl(var(--on-surface-variant))]",
                  disabled && "text-[hsl(var(--on-surface)/0.38)]"
                )}
              >
                {displayedSupportingText}
              </span>
            )}
            {characterCount && (
              <span
                className={cn(
                  "text-[12px] leading-4 tracking-[0.4px] ml-auto",
                  "text-[hsl(var(--on-surface-variant))]",
                  disabled && "text-[hsl(var(--on-surface)/0.38)]"
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

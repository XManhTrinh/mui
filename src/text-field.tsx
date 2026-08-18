"use client";

import * as React from "react";
import { cn } from "./lib/utils";

/**
 * Material Design 3 Expressive — Text Field
 * https://m3.material.io/components/text-fields/specs
 *
 * Architecture:
 * - Single root element with NO positioning constraints (consumer controls layout)
 * - className prop applied to root — consumer can set position, width, margin, etc.
 * - Internal structure is self-contained (isolate stacking context)
 * - Floating label uses CSS peer selectors (no JS for float detection)
 *
 * Container: 56dp height, corner-extra-small (4px) radius
 * Typography: body-large (16/24/400/0.5) input, body-small (12/16/400/0.4) floating label
 */

export type TextFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
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
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
    const inputId = id ?? React.useId();

    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const hasValue = currentValue !== "" && currentValue != null;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFocused(true);
      onFocus?.(e as React.FocusEvent<HTMLInputElement>);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFocused(false);
      onBlur?.(e as React.FocusEvent<HTMLInputElement>);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!isControlled) setInternalValue(e.target.value);
      inputProps.onChange?.(e as React.ChangeEvent<HTMLInputElement>);
    };

    // ── Tokens ────────────────────────────────────────────────────────────────

    const displayedSupporting = error && errorText ? errorText : supportingText;

    const labelColor = disabled
      ? "text-[hsl(var(--on-surface)/0.38)]"
      : error
        ? "text-[hsl(var(--error))]"
        : focused
          ? "text-[hsl(var(--primary))]"
          : "text-[hsl(var(--on-surface-variant))]";

    const inputCx = cn(
      "peer w-full bg-transparent outline-none",
      "text-[16px] leading-6 font-normal tracking-[0.5px]",
      "text-[hsl(var(--on-surface))] caret-[hsl(var(--primary))]",
      "placeholder:text-transparent",
      disabled ? "text-[hsl(var(--on-surface)/0.38)] cursor-not-allowed" : "cursor-text"
    );

    const padL = leadingIcon ? "pl-0" : "pl-4";
    const padR = trailingIcon ? "pr-0" : "pr-4";

    // ── Shared sub-elements ───────────────────────────────────────────────────

    const leadingEl = leadingIcon && (
      <span className={cn(
        "shrink-0 flex items-center justify-center w-12 h-full pl-3",
        "text-[hsl(var(--on-surface-variant))]",
        disabled && "text-[hsl(var(--on-surface)/0.38)]"
      )}>
        {leadingIcon}
      </span>
    );

    const trailingEl = trailingIcon && (
      <span className={cn(
        "shrink-0 flex items-center justify-center w-12 h-full pr-3",
        error ? "text-[hsl(var(--error))]" : "text-[hsl(var(--on-surface-variant))]",
        disabled && "text-[hsl(var(--on-surface)/0.38)]"
      )}>
        {trailingIcon}
      </span>
    );

    const supportingEl = (displayedSupporting || characterCount) && (
      <div className="flex justify-between px-4 pt-1">
        {displayedSupporting && (
          <span
            id={`${inputId}-supporting`}
            className={cn(
              "text-xs leading-4 tracking-[0.4px]",
              error ? "text-[hsl(var(--error))]" : "text-[hsl(var(--on-surface-variant))]",
              disabled && "text-[hsl(var(--on-surface)/0.38)]"
            )}
          >
            {displayedSupporting}
          </span>
        )}
        {characterCount && (
          <span className={cn(
            "text-xs leading-4 tracking-[0.4px] ml-auto text-[hsl(var(--on-surface-variant))]",
            disabled && "text-[hsl(var(--on-surface)/0.38)]"
          )}>
            {characterCount.current}/{characterCount.max}
          </span>
        )}
      </div>
    );

    const sharedProps = {
      id: inputId,
      disabled,
      placeholder: placeholder || " ",
      onChange: handleChange,
      onFocus: handleFocus,
      onBlur: handleBlur,
      "aria-invalid": error || undefined,
      "aria-describedby": displayedSupporting ? `${inputId}-supporting` : undefined,
    };

    const showAffixes = focused || hasValue;

    // ═══════════════════════════════════════════════════════════════════════════
    // FILLED VARIANT
    // ═══════════════════════════════════════════════════════════════════════════
    if (variant === "filled") {
      return (
        <div className={cn("isolate", className)}>
          <div className={cn(
            "group relative flex items-center overflow-hidden",
            multiline ? "min-h-14" : "h-14",
            "rounded-t rounded-b-none bg-surface-container-highest",
            !disabled && "before:absolute before:inset-0 before:transition-colors before:duration-200 hover:before:bg-[hsl(var(--on-surface)/0.08)]",
            disabled && "pointer-events-none cursor-not-allowed bg-[hsl(var(--on-surface)/0.04)]",
          )}>
            {leadingEl}

            <div className={cn("relative flex-1 h-full flex items-center", padL, padR)}>
              {prefix && showAffixes && (
                <span className="text-[16px] leading-6 tracking-[0.5px] text-[hsl(var(--on-surface-variant))] shrink-0 mr-1 pt-6 pb-2">
                  {prefix}
                </span>
              )}

              {multiline ? (
                <textarea
                  {...sharedProps}
                  value={isControlled ? (value as string) : undefined}
                  defaultValue={!isControlled ? (defaultValue as string) : undefined}
                  rows={rows}
                  className={cn(inputCx, "pt-6 pb-2 resize-y")}
                />
              ) : (
                <input
                  ref={ref}
                  {...sharedProps}
                  {...inputProps}
                  value={isControlled ? value : undefined}
                  defaultValue={!isControlled ? defaultValue : undefined}
                  className={cn(inputCx, "pt-6 pb-2")}
                />
              )}

              {label && (
                <label
                  htmlFor={inputId}
                  className={cn(
                    "absolute left-0 pointer-events-none select-none z-1",
                    padL,
                    "origin-top-left transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
                    "top-1/2 -translate-y-1/2 text-[16px] leading-6 tracking-[0.5px]",
                    "peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:leading-4 peer-focus:tracking-[0.4px]",
                    "peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:leading-4 peer-not-placeholder-shown:tracking-[0.4px]",
                    "peer-[:-webkit-autofill]:top-2 peer-[:-webkit-autofill]:translate-y-0 peer-[:-webkit-autofill]:text-xs peer-[:-webkit-autofill]:leading-4 peer-[:-webkit-autofill]:tracking-[0.4px]",
                    labelColor
                  )}
                >
                  {label}
                </label>
              )}

              {suffix && showAffixes && (
                <span className="text-[16px] leading-6 tracking-[0.5px] text-[hsl(var(--on-surface-variant))] shrink-0 ml-1 pt-6 pb-2">
                  {suffix}
                </span>
              )}
            </div>

            {trailingEl}

            {/* Active indicator */}
            <span className={cn(
              "absolute bottom-0 inset-x-0 pointer-events-none transition-[height,background-color] duration-200",
              focused
                ? error ? "h-0.5 bg-[hsl(var(--error))]" : "h-0.5 bg-[hsl(var(--primary))]"
                : error ? "h-px bg-[hsl(var(--error))]" : "h-px bg-[hsl(var(--on-surface))]",
              disabled && "h-px bg-[hsl(var(--on-surface)/0.12)]"
            )} />
          </div>

          {supportingEl}
        </div>
      );
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // OUTLINED VARIANT
    // ═══════════════════════════════════════════════════════════════════════════
    return (
      <div className={cn("isolate", className)}>
        <div className={cn(
          "group relative flex items-center rounded",
          multiline ? "min-h-14" : "h-14",
          disabled && "pointer-events-none cursor-not-allowed"
        )}>
          {/* Border + notch */}
          <fieldset
            aria-hidden="true"
            className={cn(
              "absolute inset-x-0 -top-2 bottom-0 rounded pointer-events-none m-0 px-3",
              "transition-[border-color,border-width] duration-200",
              focused
                ? error ? "border-2 border-[hsl(var(--error))]" : "border-2 border-[hsl(var(--primary))]"
                : error
                  ? "border border-[hsl(var(--error))]"
                  : cn("border border-[hsl(var(--outline))]", !disabled && "group-hover:border-[hsl(var(--on-surface))]"),
              disabled && "border border-[hsl(var(--on-surface)/0.12)]"
            )}
          >
            <legend className={cn(
              "invisible h-0 overflow-hidden block text-xs leading-0",
              "transition-all duration-200",
              (focused || hasValue) ? "px-1 max-w-full" : "px-0 max-w-[0.01px]"
            )}>
              <span>{label}</span>
            </legend>
          </fieldset>

          {leadingEl}

          <div className={cn("relative flex-1 h-full flex items-center", padL, padR)}>
            {prefix && showAffixes && (
              <span className="text-[16px] leading-6 tracking-[0.5px] text-[hsl(var(--on-surface-variant))] shrink-0 mr-1">
                {prefix}
              </span>
            )}

            {multiline ? (
              <textarea
                {...sharedProps}
                value={isControlled ? (value as string) : undefined}
                defaultValue={!isControlled ? (defaultValue as string) : undefined}
                rows={rows}
                className={cn(inputCx, "py-4 resize-y")}
              />
            ) : (
              <input
                ref={ref}
                {...sharedProps}
                {...inputProps}
                value={isControlled ? value : undefined}
                defaultValue={!isControlled ? defaultValue : undefined}
                className={cn(inputCx, "py-4")}
              />
            )}

            {/* Label — floats into the fieldset notch area */}
            {label && (
              <label
                htmlFor={inputId}
                className={cn(
                  "absolute pointer-events-none select-none",
                  "origin-top-left transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
                  // Resting: align with input text
                  leadingIcon ? "left-0" : "left-4",
                  "top-1/2 -translate-y-1/2 text-[16px] leading-6 tracking-[0.5px]",
                  // Floating: move up into the fieldset notch (which extends 8px above the container via -top-2)
                  leadingIcon
                    ? cn(
                        "peer-focus:-top-2 peer-focus:-translate-y-1/2 peer-focus:-left-9 peer-focus:text-xs peer-focus:leading-4 peer-focus:tracking-[0.4px]",
                        "peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:-left-9 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:leading-4 peer-not-placeholder-shown:tracking-[0.4px]",
                        "peer-[:-webkit-autofill]:-top-2 peer-[:-webkit-autofill]:-translate-y-1/2 peer-[:-webkit-autofill]:-left-9 peer-[:-webkit-autofill]:text-xs peer-[:-webkit-autofill]:leading-4 peer-[:-webkit-autofill]:tracking-[0.4px]"
                      )
                    : cn(
                        "peer-focus:-top-2 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:leading-4 peer-focus:tracking-[0.4px]",
                        "peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:leading-4 peer-not-placeholder-shown:tracking-[0.4px]",
                        "peer-[:-webkit-autofill]:-top-2 peer-[:-webkit-autofill]:-translate-y-1/2 peer-[:-webkit-autofill]:text-xs peer-[:-webkit-autofill]:leading-4 peer-[:-webkit-autofill]:tracking-[0.4px]"
                      ),
                  labelColor
                )}
              >
                {label}
              </label>
            )}

            {suffix && showAffixes && (
              <span className="text-[16px] leading-6 tracking-[0.5px] text-[hsl(var(--on-surface-variant))] shrink-0 ml-1">
                {suffix}
              </span>
            )}
          </div>

          {trailingEl}
        </div>

        {supportingEl}
      </div>
    );
  }
);
TextField.displayName = "TextField";

export { TextField };

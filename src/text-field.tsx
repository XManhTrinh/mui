"use client";

import * as React from "react";
import { cn } from "./lib/utils";

/**
 * Material Design 3 — Text Field
 * https://m3.material.io/components/text-fields/specs
 *
 * Layout (both variants):
 *   Container height: 56dp | Shape: extra-small (4dp)
 *   Padding: 16dp left/right (no icons)
 *   Icon area: 12dp + 24dp + 16dp = 52dp (w-13)
 *   Icon alignment: vertically centered
 *
 * Typography:
 *   Input/placeholder: body-large (16/24/400/0.5)
 *   Label resting:     body-large (16/24/400/0.5), on-surface-variant
 *   Label floating:    body-small (12/16/400/0.4), primary (focused)
 *   Supporting text:   body-small (12/16/400/0.4), 4dp top padding
 *   Prefix/suffix:     body-large (16/24/400/0.5), on-surface-variant
 *
 * Filled:
 *   Background: surface-container-highest
 *   Hover: state layer on-surface/0.08 via ::before
 *   Active indicator: 1dp enabled → 2dp focused
 *   Label resting: vertically centered
 *   Label floating: 8dp from top
 *   Input: pt-6 (24dp) pb-2 (8dp)
 *
 * Outlined:
 *   Border: 1dp outline (enabled) → 2dp primary (focused)
 *   Hover: border → on-surface
 *   Label resting: vertically centered
 *   Label floating: centered on top border
 *   Input: py-4 (16dp top/bottom)
 *   Notch: fieldset/legend, 4dp padding around label text
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
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
    const inputId = id ?? React.useId();

    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const hasValue = currentValue !== "" && currentValue != null;
    // isFloating controls label position and prefix/suffix visibility
    const isFloating = focused || hasValue;

    // Detect browser autofill on mount — Chrome fills value without triggering onChange
    const internalRef = React.useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
    const [browserFilled, setBrowserFilled] = React.useState(false);

    React.useEffect(() => {
      const el = internalRef.current;
      if (!el) return;
      // Check after a short delay to let the browser autofill
      const timer = setTimeout(() => {
        if (el.matches(":-webkit-autofill")) {
          setBrowserFilled(true);
        } else if (el.value && !hasValue) {
          setBrowserFilled(true);
        }
      }, 100);
      return () => clearTimeout(timer);
    }, []);

    const shouldFloat = isFloating || browserFilled;

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

    const displayedSupporting = error && errorText ? errorText : supportingText;

    // ── Design tokens ─────────────────────────────────────────────────────────

    const labelColor = disabled
      ? "text-[hsl(var(--on-surface)/0.38)]"
      : error
        ? "text-[hsl(var(--error))]"
        : focused
          ? "text-[hsl(var(--primary))]"
          : "text-[hsl(var(--on-surface-variant))]";

    const inputCx = cn(
      "w-full bg-transparent outline-none",
      "text-[16px] leading-[24px] font-normal tracking-[0.5px]",
      "text-[hsl(var(--on-surface))] caret-[hsl(var(--primary))]",
      "placeholder:text-[hsl(var(--on-surface-variant))] placeholder:text-[16px]",
      disabled ? "text-[hsl(var(--on-surface)/0.38)] cursor-not-allowed" : "cursor-text"
    );

    // Autofill: transition prevents Chrome's forced bg from rendering
    const filledAutofill = "[&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_9999px_var(--color-surface-container-highest)_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:hsl(var(--on-surface))]";
    const outlinedAutofill = "[&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_9999px_var(--m3-surface-bg,hsl(var(--surface)))_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:hsl(var(--on-surface))]";

    // Padding: 16dp without icons, 0 with (icon slot provides 52dp spacing)
    const padL = leadingIcon ? "pl-0" : "pl-4";
    const padR = trailingIcon ? "pr-0" : "pr-4";

    // ── Reusable elements ─────────────────────────────────────────────────────

    const leadingEl = leadingIcon && (
      <span className={cn(
        "shrink-0 flex items-center justify-center w-13 h-full pl-3",
        "text-[hsl(var(--on-surface-variant))]",
        disabled && "text-[hsl(var(--on-surface)/0.38)]"
      )}>
        {leadingIcon}
      </span>
    );

    const trailingEl = trailingIcon && (
      <span className={cn(
        "shrink-0 flex items-center justify-center w-13 h-full pr-3",
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

    // ═══════════════════════════════════════════════════════════════════════════
    // FILLED VARIANT
    // ═══════════════════════════════════════════════════════════════════════════
    if (variant === "filled") {
      return (
        <div className={cn("relative w-full", className)}>
          <div
            className={cn(
              "group relative flex items-center overflow-hidden",
              multiline ? "min-h-14" : "h-14",
              "rounded-t rounded-b-none",
              "bg-surface-container-highest",
              !disabled && "before:absolute before:inset-0 before:transition-colors before:duration-200 hover:before:bg-[hsl(var(--on-surface)/0.08)]",
              disabled && "pointer-events-none cursor-not-allowed bg-[hsl(var(--on-surface)/0.04)]",
            )}
          >
            {leadingEl}

            {/* Content area — label & input share same padding */}
            <div className={cn("relative flex-1 h-full flex items-center", padL, padR)}>
              {/* Label */}
              {label && (
                <label
                  htmlFor={inputId}
                  className={cn(
                    "absolute left-0 pointer-events-none select-none z-1",
                    padL,
                    "transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)] origin-top-left",
                    shouldFloat
                      ? "top-2 text-xs leading-4 tracking-[0.4px]"
                      : "top-1/2 -translate-y-1/2 text-base leading-6 tracking-[0.5px]",
                    labelColor
                  )}
                >
                  {label}
                </label>
              )}

              {/* Prefix — aligned with input text (pt-6 pb-2 for filled) */}
              {prefix && isFloating && (
                <span className={cn(
                  "text-base leading-6 tracking-[0.5px] text-[hsl(var(--on-surface-variant))] shrink-0 mr-1 pt-6 pb-2",
                  disabled && "text-[hsl(var(--on-surface)/0.38)]"
                )}>
                  {prefix}
                </span>
              )}

              {/* Input */}
              {multiline ? (
                <textarea
                  ref={(el) => { internalRef.current = el; }}
                  id={inputId}
                  data-m3-input=""
                  disabled={disabled}
                  value={isControlled ? (value as string) : undefined}
                  defaultValue={!isControlled ? (defaultValue as string) : undefined}
                  placeholder={placeholder || " "}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  rows={rows}
                  aria-invalid={error || undefined}
                  aria-describedby={displayedSupporting ? `${inputId}-supporting` : undefined}
                  className={cn(inputCx, filledAutofill, "peer pt-6 pb-2 resize-y")}
                />
              ) : (
                <input
                  ref={(el) => { internalRef.current = el; if (typeof ref === "function") ref(el); else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el; }}
                  id={inputId}
                  data-m3-input=""
                  disabled={disabled}
                  value={isControlled ? value : undefined}
                  defaultValue={!isControlled ? defaultValue : undefined}
                  placeholder={placeholder || " "}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  aria-invalid={error || undefined}
                  aria-describedby={displayedSupporting ? `${inputId}-supporting` : undefined}
                  {...inputProps}
                  className={cn(inputCx, filledAutofill, "peer pt-6 pb-2")}
                />
              )}

              {/* Suffix — aligned with input text */}
              {suffix && isFloating && (
                <span className={cn(
                  "text-base leading-6 tracking-[0.5px] text-[hsl(var(--on-surface-variant))] shrink-0 ml-1 pt-6 pb-2",
                  disabled && "text-[hsl(var(--on-surface)/0.38)]"
                )}>
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
      <div className={cn("relative w-full", className)}>
        {/* Label — on root wrapper, never clipped by overflow-hidden */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "absolute pointer-events-none select-none z-3",
              "transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)] origin-top-left",
              leadingIcon ? "left-13" : "left-4",
              shouldFloat
                ? "top-0 -translate-y-1/2 text-xs leading-4 tracking-[0.4px]"
                : "top-1/2 -translate-y-1/2 text-base leading-6 tracking-[0.5px]",
              labelColor
            )}
          >
            {label}
          </label>
        )}

        {/* Container */}
        <div
          className={cn(
            "group relative flex items-center overflow-hidden rounded",
            multiline ? "min-h-14" : "h-14",
            disabled && "pointer-events-none cursor-not-allowed"
          )}
        >
          {/* Border with notch */}
          <fieldset
            aria-hidden="true"
            className={cn(
              "absolute inset-0 rounded pointer-events-none m-0 px-3 z-2",
              "transition-[border-color,border-width] duration-200",
              focused
                ? error ? "border-2 border-[hsl(var(--error))]" : "border-2 border-[hsl(var(--primary))]"
                : error
                  ? "border border-[hsl(var(--error))]"
                  : cn("border border-[hsl(var(--outline))]", !disabled && "group-hover:border-[hsl(var(--on-surface))]"),
              disabled && "border border-[hsl(var(--on-surface)/0.12)]"
            )}
          >
            <legend
              className={cn(
                "invisible h-0 overflow-hidden block text-xs leading-0",
                "transition-all duration-200",
                shouldFloat ? "px-1 max-w-full" : "px-0 max-w-[0.01px]",
                leadingIcon ? "ml-9" : "ml-0"
              )}
            >
              <span>{label}</span>
            </legend>
          </fieldset>

          {leadingEl}

          {/* Content area */}
          <div className={cn("relative flex-1 h-full flex items-center", padL, padR)}>
            {/* Prefix — vertically centered in outlined */}
            {prefix && isFloating && (
              <span className={cn(
                "text-base leading-6 tracking-[0.5px] text-[hsl(var(--on-surface-variant))] shrink-0 mr-1",
                disabled && "text-[hsl(var(--on-surface)/0.38)]"
              )}>
                {prefix}
              </span>
            )}

            {/* Input */}
            {multiline ? (
              <textarea
                ref={(el) => { internalRef.current = el; }}
                id={inputId}
                data-m3-input=""
                disabled={disabled}
                value={isControlled ? (value as string) : undefined}
                defaultValue={!isControlled ? (defaultValue as string) : undefined}
                placeholder={placeholder || " "}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                rows={rows}
                aria-invalid={error || undefined}
                aria-describedby={displayedSupporting ? `${inputId}-supporting` : undefined}
                className={cn(inputCx, outlinedAutofill, "peer py-4 resize-y")}
              />
            ) : (
              <input
                ref={(el) => { internalRef.current = el; if (typeof ref === "function") ref(el); else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el; }}
                id={inputId}
                data-m3-input=""
                disabled={disabled}
                value={isControlled ? value : undefined}
                defaultValue={!isControlled ? defaultValue : undefined}
                placeholder={placeholder || " "}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                aria-invalid={error || undefined}
                aria-describedby={displayedSupporting ? `${inputId}-supporting` : undefined}
                {...inputProps}
                className={cn(inputCx, outlinedAutofill, "peer py-4")}
              />
            )}

            {/* Suffix — vertically centered in outlined */}
            {suffix && isFloating && (
              <span className={cn(
                "text-base leading-6 tracking-[0.5px] text-[hsl(var(--on-surface-variant))] shrink-0 ml-1",
                disabled && "text-[hsl(var(--on-surface)/0.38)]"
              )}>
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

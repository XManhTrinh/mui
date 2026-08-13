"use client";

import * as React from "react";
import { cn } from "./lib/utils";

/**
 * Material Design 3 — Text Field
 * https://m3.material.io/components/text-fields/specs
 *
 * Variants: outlined (default), filled
 * Container: 56dp height, 4dp corner radius
 * Typography: body-large (16/24/400/0.5) for input, body-small (12/16/400/0.4) for floating label
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
    const inputElRef = React.useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const hasValue = currentValue !== "" && currentValue != null;
    const [autofilled, setAutofilled] = React.useState(false);
    const shouldFloat = focused || hasValue || autofilled;

    // Detect autofill on mount — Chrome autofills before React hydrates
    React.useEffect(() => {
      const el = inputElRef.current;
      if (!el) return;
      // Poll briefly — Chrome may autofill with a small delay after paint
      const check = () => {
        try {
          if (el.matches(":-webkit-autofill")) {
            setAutofilled(true);
          }
        } catch { /* Firefox throws on :-webkit-autofill */ }
      };
      // Check immediately and again after a short delay
      check();
      const t1 = setTimeout(check, 120);
      const t2 = setTimeout(check, 500);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    const handleAnimationStart = (e: React.AnimationEvent) => {
      if (e.animationName === "m3-autofill-start") setAutofilled(true);
      else if (e.animationName === "m3-autofill-cancel") setAutofilled(false);
    };

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
      "w-full bg-transparent outline-none",
      "text-[16px] leading-[24px] font-normal tracking-[0.5px]",
      "text-[hsl(var(--on-surface))] caret-[hsl(var(--primary))]",
      "placeholder:text-transparent",
      disabled ? "text-[hsl(var(--on-surface)/0.38)] cursor-not-allowed" : "cursor-text"
    );

    const padL = leadingIcon ? "pl-0" : "pl-4";
    const padR = trailingIcon ? "pr-0" : "pr-4";

    // ── Shared sub-elements ───────────────────────────────────────────────────

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

    // Common input/textarea props
    const sharedProps = {
      id: inputId,
      disabled,
      placeholder: placeholder || " ",
      onChange: handleChange,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onAnimationStart: handleAnimationStart,
      "aria-invalid": error || undefined,
      "aria-describedby": displayedSupporting ? `${inputId}-supporting` : undefined,
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // FILLED
    // ═══════════════════════════════════════════════════════════════════════════
    if (variant === "filled") {
      return (
        <div className={cn("relative w-full", className)}>
          <div className={cn(
            "group relative flex items-center overflow-hidden",
            multiline ? "min-h-14" : "h-14",
            "rounded-t rounded-b-none bg-surface-container-highest",
            !disabled && "before:absolute before:inset-0 before:transition-colors before:duration-200 hover:before:bg-[hsl(var(--on-surface)/0.08)]",
            disabled && "pointer-events-none cursor-not-allowed bg-[hsl(var(--on-surface)/0.04)]",
          )}>
            {leadingEl}

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
                      : "top-1/2 -translate-y-1/2 text-[16px] leading-[24px] tracking-[0.5px]",
                    labelColor
                  )}
                >
                  {label}
                </label>
              )}

              {prefix && shouldFloat && (
                <span className="text-[16px] leading-[24px] tracking-[0.5px] text-[hsl(var(--on-surface-variant))] shrink-0 mr-1 pt-6 pb-2">
                  {prefix}
                </span>
              )}

              {multiline ? (
                <textarea ref={(el) => { inputElRef.current = el; }}
                  {...sharedProps}
                  value={isControlled ? (value as string) : undefined}
                  defaultValue={!isControlled ? (defaultValue as string) : undefined}
                  rows={rows}
                  className={cn(inputCx, "pt-6 pb-2 resize-y")}
                />
              ) : (
                <input
                  ref={(el) => { inputElRef.current = el; if (typeof ref === "function") ref(el); else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el; }}
                  {...sharedProps}
                  {...inputProps}
                  value={isControlled ? value : undefined}
                  defaultValue={!isControlled ? defaultValue : undefined}
                  className={cn(inputCx, "pt-6 pb-2")}
                />
              )}

              {suffix && shouldFloat && (
                <span className="text-[16px] leading-[24px] tracking-[0.5px] text-[hsl(var(--on-surface-variant))] shrink-0 ml-1 pt-6 pb-2">
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
    // OUTLINED
    // ═══════════════════════════════════════════════════════════════════════════
    return (
      <div className={cn("relative w-full", className)}>
        {/* Label — positioned on root to avoid clipping */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "absolute pointer-events-none select-none z-3",
              "transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)] origin-top-left",
              leadingIcon ? "left-13" : "left-4",
              shouldFloat
                ? "top-0 -translate-y-1/2 text-xs leading-4 tracking-[0.4px]"
                : "top-1/2 -translate-y-1/2 text-[16px] leading-[24px] tracking-[0.5px]",
              labelColor
            )}
          >
            {label}
          </label>
        )}

        <div className={cn(
          "group relative flex items-center overflow-hidden rounded",
          multiline ? "min-h-14" : "h-14",
          disabled && "pointer-events-none cursor-not-allowed"
        )}>
          {/* Border + notch */}
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
            <legend className={cn(
              "invisible h-0 overflow-hidden block text-xs leading-0",
              "transition-all duration-200",
              shouldFloat ? "px-1 max-w-full" : "px-0 max-w-[0.01px]",
              leadingIcon ? "ml-9" : "ml-0"
            )}>
              <span>{label}</span>
            </legend>
          </fieldset>

          {leadingEl}

          <div className={cn("relative flex-1 h-full flex items-center", padL, padR)}>
            {prefix && shouldFloat && (
              <span className="text-[16px] leading-[24px] tracking-[0.5px] text-[hsl(var(--on-surface-variant))] shrink-0 mr-1">
                {prefix}
              </span>
            )}

            {multiline ? (
              <textarea ref={(el) => { inputElRef.current = el; }}
                {...sharedProps}
                value={isControlled ? (value as string) : undefined}
                defaultValue={!isControlled ? (defaultValue as string) : undefined}
                rows={rows}
                className={cn(inputCx, "py-4 resize-y")}
              />
            ) : (
              <input
                ref={(el) => { inputElRef.current = el; if (typeof ref === "function") ref(el); else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el; }}
                {...sharedProps}
                {...inputProps}
                value={isControlled ? value : undefined}
                defaultValue={!isControlled ? defaultValue : undefined}
                className={cn(inputCx, "py-4")}
              />
            )}

            {suffix && shouldFloat && (
              <span className="text-[16px] leading-[24px] tracking-[0.5px] text-[hsl(var(--on-surface-variant))] shrink-0 ml-1">
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

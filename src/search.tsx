"use client";

import * as React from "react";

import { cn } from "./lib/utils";
import { Icon } from "./icon";

/**
 * Material Design 3 Search Bar (Contained style)
 *
 * M3 Specs (m3.material.io/components/search/specs):
 * - Container: min-width 360dp, max 720dp, height 56dp
 * - Shape: full pill (rounded-full)
 * - Unfocused margins: 24dp leading/trailing
 * - Focused margins: 12dp (expands)
 * - Leading icon and label padding: 4dp from tap target
 * - Avatar size: 30dp
 * - Colors:
 *   Search bar (unfocused): bg surface-container-high, text on-surface-variant
 *   Search bar (focused): bg surface-container-low, text on-surface
 *   Leading icon: on-surface-variant
 *   Trailing icon: on-surface-variant
 *   Input text: on-surface
 * - States: 8% hover, 10% focus, 10% press
 */

export interface SearchProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  leadingIcon?: string;
  trailingIcon?: React.ReactNode;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

const Search = React.forwardRef<HTMLInputElement, SearchProps>(
  (
    {
      value: controlledValue,
      defaultValue = "",
      onValueChange,
      placeholder = "Search",
      leadingIcon = "search",
      trailingIcon,
      onFocus,
      onBlur,
      disabled = false,
      className,
      "aria-label": ariaLabel,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const [isFocused, setIsFocused] = React.useState(false);
    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (!isControlled) setInternalValue(newValue);
      onValueChange?.(newValue);
    };

    const handleFocus = () => {
      setIsFocused(true);
      onFocus?.();
    };

    const handleBlur = () => {
      setIsFocused(false);
      onBlur?.();
    };

    return (
      <div
        className={cn(
          "relative flex items-center h-14 min-w-90 max-w-180 rounded-full",
          "transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
          // Background color
          isFocused
            ? "bg-surface-container-low"
            : "bg-surface-container-high",
          // Hover state
          !disabled && !isFocused && "hover:bg-surface-container-high/92",
          // Disabled state
          disabled && "opacity-[0.38] cursor-not-allowed",
          // Margin change on focus (container expands)
          isFocused ? "mx-3" : "mx-6",
          className
        )}
      >
        {/* Leading icon — 48dp touch target, 4dp padding */}
        <div className="flex items-center justify-center w-12 h-12 shrink-0 ml-1">
          <Icon
            name={leadingIcon}
            size={24}
            className="text-[hsl(var(--on-surface-variant))]"
          />
        </div>

        {/* Input */}
        <input
          ref={ref}
          type="text"
          value={currentValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          aria-label={ariaLabel || placeholder}
          className={cn(
            "flex-1 h-full bg-transparent outline-none",
            "text-base leading-6 text-surface-foreground",
            "placeholder:text-[hsl(var(--on-surface-variant))]",
            disabled && "cursor-not-allowed"
          )}
        />

        {/* Trailing icon */}
        {trailingIcon && (
          <div className="flex items-center justify-center w-12 h-12 shrink-0 mr-1">
            {trailingIcon}
          </div>
        )}
      </div>
    );
  }
);
Search.displayName = "Search";

export { Search };

"use client";

import * as React from "react";

import { cn } from "./lib/utils";
import { Icon } from "./icon";

// ─── Context ──────────────────────────────────────────────────────────────────

/**
 * Shared state between Search root and sub-components.
 */
export interface SearchContextValue {
  value: string;
  onValueChange: (value: string) => void;
  isFocused: boolean;
  setFocused: (focused: boolean) => void;
  disabled: boolean;
}

const SearchContext = React.createContext<SearchContextValue | null>(null);

/**
 * Hook to access Search context from within sub-components.
 * Throws if used outside a Search provider.
 */
export function useSearch(): SearchContextValue {
  const ctx = React.useContext(SearchContext);
  if (!ctx) {
    throw new Error("useSearch must be used within Search");
  }
  return ctx;
}

// ─── Search.LeadingIcon ───────────────────────────────────────────────────────

export interface SearchLeadingIconProps {
  className?: string;
  children: React.ReactNode;
}

const SearchLeadingIcon = React.forwardRef<HTMLDivElement, SearchLeadingIconProps>(
  ({ className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center w-12 h-12 shrink-0 ml-1",
          className
        )}
      >
        {children}
      </div>
    );
  }
);
SearchLeadingIcon.displayName = "SearchLeadingIcon";

// ─── Search.Input ─────────────────────────────────────────────────────────────

export interface SearchInputProps {
  placeholder?: string;
  disabled?: boolean;
  "aria-label"?: string;
  className?: string;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ placeholder = "Search", disabled: localDisabled, "aria-label": ariaLabel, className }, ref) => {
    const ctx = useSearch();
    const isDisabled = localDisabled ?? ctx.disabled;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      ctx.onValueChange(e.target.value);
    };

    const handleFocus = () => {
      ctx.setFocused(true);
    };

    const handleBlur = () => {
      ctx.setFocused(false);
    };

    return (
      <input
        ref={ref}
        type="text"
        value={ctx.value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={isDisabled}
        aria-label={ariaLabel || placeholder}
        className={cn(
          "flex-1 h-full bg-transparent outline-none border-none cursor-text",
          "text-base leading-6 text-surface-foreground",
          "placeholder:text-[hsl(var(--on-surface-variant))]",
          isDisabled && "cursor-not-allowed",
          className
        )}
      />
    );
  }
);
SearchInput.displayName = "SearchInput";

// ─── Search.TrailingIcon ──────────────────────────────────────────────────────

export interface SearchTrailingIconProps {
  className?: string;
  children: React.ReactNode;
}

const SearchTrailingIcon = React.forwardRef<HTMLDivElement, SearchTrailingIconProps>(
  ({ className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center w-12 h-12 shrink-0 mr-1",
          className
        )}
      >
        {children}
      </div>
    );
  }
);
SearchTrailingIcon.displayName = "SearchTrailingIcon";

// ─── Search (Root) ────────────────────────────────────────────────────────────

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
  children?: React.ReactNode;
}

// ─── Dual-API Detection Helper ────────────────────────────────────────────────

const COMPOUND_DISPLAY_NAMES = new Set([
  "SearchLeadingIcon",
  "SearchInput",
  "SearchTrailingIcon",
]);

function hasCompoundChildren(children: React.ReactNode): boolean {
  return React.Children.toArray(children).some(
    (child) =>
      React.isValidElement(child) &&
      typeof child.type !== "string" &&
      COMPOUND_DISPLAY_NAMES.has(
        (child.type as { displayName?: string }).displayName ?? ""
      )
  );
}

// ─── Search Root Component ────────────────────────────────────────────────────

const SearchRoot = React.forwardRef<HTMLDivElement, SearchProps>(
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
      children,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const [isFocused, setIsFocused] = React.useState(false);
    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;

    const handleValueChange = React.useCallback(
      (newValue: string) => {
        if (!isControlled) setInternalValue(newValue);
        onValueChange?.(newValue);
      },
      [isControlled, onValueChange]
    );

    const handleSetFocused = React.useCallback(
      (focused: boolean) => {
        setIsFocused(focused);
        if (focused) onFocus?.();
        else onBlur?.();
      },
      [onFocus, onBlur]
    );

    const contextValue = React.useMemo<SearchContextValue>(
      () => ({
        value: currentValue,
        onValueChange: handleValueChange,
        isFocused,
        setFocused: handleSetFocused,
        disabled,
      }),
      [currentValue, handleValueChange, isFocused, handleSetFocused, disabled]
    );

    const isComposable = children != null && hasCompoundChildren(children);

    return (
      <SearchContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            "relative flex items-center h-14 min-w-90 max-w-180 rounded-full",
            "transition-[background-color,margin] duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
            // Background color
            isFocused
              ? "bg-surface-container-low ring-2 ring-primary"
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
          {isComposable ? (
            // ── Composable Layout ──
            children
          ) : (
            // ── Legacy Prop-Based Layout ──
            <>
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
                type="text"
                value={currentValue}
                onChange={(e) => handleValueChange(e.target.value)}
                onFocus={() => handleSetFocused(true)}
                onBlur={() => handleSetFocused(false)}
                placeholder={placeholder}
                disabled={disabled}
                aria-label={ariaLabel || placeholder}
                className={cn(
                  "flex-1 h-full bg-transparent outline-none border-none cursor-text",
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
            </>
          )}
        </div>
      </SearchContext.Provider>
    );
  }
);
SearchRoot.displayName = "Search";

// ─── Compound Component Export ────────────────────────────────────────────────

export const Search = Object.assign(SearchRoot, {
  LeadingIcon: SearchLeadingIcon,
  Input: SearchInput,
  TrailingIcon: SearchTrailingIcon,
});

export { SearchLeadingIcon, SearchInput, SearchTrailingIcon };

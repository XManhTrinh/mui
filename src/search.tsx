"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion } from "motion/react";

import { cn } from "./lib/utils";
import { Icon } from "./icon";
import { spring } from "./lib/motion";

// ─── Context ──────────────────────────────────────────────────────────────────

/**
 * Shared state between Search root and sub-components.
 */
export type SearchContextValue = {
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

export type SearchLeadingIconProps = {
  className?: string;
  children: React.ReactNode;
}

const SearchLeadingIcon = React.forwardRef<HTMLDivElement, SearchLeadingIconProps>(
  ({ className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center w-12 h-12 shrink-0 ms-1",
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

export type SearchInputProps = {
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

export type SearchTrailingIconProps = {
  className?: string;
  children: React.ReactNode;
}

const SearchTrailingIcon = React.forwardRef<HTMLDivElement, SearchTrailingIconProps>(
  ({ className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center w-12 h-12 shrink-0 me-1",
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
export type SearchProps = {
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
              ? "bg-surface-container-low shadow-[inset_0_0_0_2px_hsl(var(--primary))]"
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
              <div className="flex items-center justify-center w-12 h-12 shrink-0 ms-1">
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
                <div className="flex items-center justify-center w-12 h-12 shrink-0 me-1">
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

// ─── Search View ──────────────────────────────────────────────────────────────

/**
 * Material Design 3 Search View (expanded search)
 *
 * A full-surface modal search experience, typically opened by activating a
 * search bar or a search icon. Per the M3 anatomy, a search view is composed of:
 *   - Container (surface-container-high)
 *   - Header: leading icon button (back), input text, optional trailing icon button
 *   - Divider (visible by default)
 *   - Content (scrollable suggestions / results)
 *
 * @see https://m3.material.io/components/search/specs
 * @see material-components-android/blob/master/docs/components/Search.md
 *
 * Layout behavior:
 * - Mobile: full viewport, 0dp radius (full-screen search view).
 * - sm+ : docked panel anchored top-center, corner-large radius, max width 720dp.
 *
 * Portal + focus trap + scrim + dismissal are provided by Radix Dialog (the
 * documented exception to the "no layout positioning" rule for overlays).
 *
 * Motion: M3 Expressive spring enter (the view expands from the bar) with an
 * emphasized fade, honoring prefers-reduced-motion.
 */

// Shared value/query state between SearchView and its Input sub-component.
type SearchViewContextValue = {
  value: string;
  onValueChange: (value: string) => void;
  onClose: () => void;
};

const SearchViewContext = React.createContext<SearchViewContextValue | null>(null);

function useSearchView(): SearchViewContextValue {
  const ctx = React.useContext(SearchViewContext);
  if (!ctx) {
    throw new Error("SearchView sub-components must be used within SearchView");
  }
  return ctx;
}

export type SearchViewProps = {
  /** Controlled open state */
  open: boolean;
  /** Open state change callback */
  onOpenChange: (open: boolean) => void;
  /** Controlled query value */
  value?: string;
  /** Default query value (uncontrolled) */
  defaultValue?: string;
  /** Query change callback */
  onValueChange?: (value: string) => void;
  /** Accessible label for the search view dialog */
  "aria-label"?: string;
  /** Additional className for the view container */
  className?: string;
  /** Header + content — use SearchView.Header / SearchView.Content */
  children?: React.ReactNode;
};

const SearchViewRoot = React.forwardRef<HTMLDivElement, SearchViewProps>(
  (
    {
      open,
      onOpenChange,
      value: controlledValue,
      defaultValue = "",
      onValueChange,
      "aria-label": ariaLabel = "Search",
      className,
      children,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;

    const handleValueChange = React.useCallback(
      (next: string) => {
        if (!isControlled) setInternalValue(next);
        onValueChange?.(next);
      },
      [isControlled, onValueChange]
    );

    const handleClose = React.useCallback(() => onOpenChange(false), [onOpenChange]);

    const [reducedMotion, setReducedMotion] = React.useState(false);
    React.useEffect(() => {
      const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mql.matches);
      const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    }, []);

    const contextValue = React.useMemo<SearchViewContextValue>(
      () => ({ value: currentValue, onValueChange: handleValueChange, onClose: handleClose }),
      [currentValue, handleValueChange, handleClose]
    );

    return (
      <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
        <DialogPrimitive.Portal>
          {/* Scrim */}
          <DialogPrimitive.Overlay asChild>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: "spring", ...spring.defaultEffects }}
              className="fixed inset-0 z-50 bg-[hsl(var(--on-surface)/0.32)] m3-animate-overlay-spring-close"
            />
          </DialogPrimitive.Overlay>

          <DialogPrimitive.Content
            ref={ref}
            aria-label={ariaLabel}
            asChild
            // The internal input receives focus; suppress default auto-focus ring jump
            onOpenAutoFocus={(e) => {
              e.preventDefault();
              const content = e.currentTarget as HTMLElement;
              content.querySelector<HTMLInputElement>("input")?.focus();
            }}
          >
            <motion.div
              initial={
                reducedMotion ? false : { opacity: 0, scaleY: 0.9, y: -8 }
              }
              animate={{ opacity: 1, scaleY: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, scaleY: 0.95, y: -8 }}
              transition={
                reducedMotion ? { duration: 0 } : { type: "spring", ...spring.defaultSpatial }
              }
              style={{ transformOrigin: "top center" }}
              className={cn(
                "fixed z-50 flex flex-col overflow-hidden bg-surface-container-high",
                // Mobile: full-screen search view (0dp radius)
                "inset-0 rounded-none",
                // sm+: docked panel anchored top-center
                "sm:inset-auto sm:inset-l-[50%] sm:inset-t-4 sm:translate-x-[-50%]",
                "sm:w-full sm:min-w-90 sm:max-w-180 sm:max-h-[min(560px,90vh)]",
                "sm:rounded-[28px] sm:shadow-[0_4px_8px_hsl(var(--elevation-3)),0_1px_3px_hsl(var(--elevation-3))]",
                className
              )}
            >
              {/* Radix requires an accessible title; visually hidden. */}
              <DialogPrimitive.Title className="sr-only">{ariaLabel}</DialogPrimitive.Title>
              <SearchViewContext.Provider value={contextValue}>
                {children}
              </SearchViewContext.Provider>
            </motion.div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    );
  }
);
SearchViewRoot.displayName = "SearchView";

// ─── SearchView.Header ──────────────────────────────────────────────────────

export type SearchViewHeaderProps = {
  /** Leading icon name (defaults to a back arrow that closes the view) */
  leadingIcon?: string;
  /** Accessible label for the leading (back) button */
  leadingLabel?: string;
  /** Called when the leading button is pressed (defaults to closing the view) */
  onLeadingClick?: () => void;
  /** Optional trailing content (e.g. a clear button or avatar) */
  trailing?: React.ReactNode;
  /** Additional className */
  className?: string;
  /** Header content — typically a SearchView.Input */
  children?: React.ReactNode;
};

/**
 * SearchView header row: a 56dp bar with a leading (back) icon button, the input
 * region, and an optional trailing action. Matches the M3 search bar height so
 * the contained transition reads as the bar expanding in place.
 */
const SearchViewHeader = React.forwardRef<HTMLDivElement, SearchViewHeaderProps>(
  ({ leadingIcon = "arrow_back", leadingLabel = "Back", onLeadingClick, trailing, className, children }, ref) => {
    const { onClose } = useSearchView();
    return (
      <div
        ref={ref}
        className={cn("flex items-center h-18 sm:h-14 shrink-0 px-1", className)}
      >
        <button
          type="button"
          aria-label={leadingLabel}
          onClick={onLeadingClick ?? onClose}
          className={cn(
            "relative flex items-center justify-center w-12 h-12 shrink-0 rounded-full",
            "cursor-pointer select-none text-surface-variant-foreground",
            "overflow-hidden",
            "before:absolute before:inset-0 before:rounded-[inherit] before:bg-current before:opacity-0",
            "before:transition-opacity before:duration-200 before:pointer-events-none",
            "hover:before:opacity-[0.08] focus-visible:before:opacity-[0.10] active:before:opacity-[0.10]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          )}
        >
          <Icon name={leadingIcon} size={24} />
        </button>
        <div className="flex flex-1 items-center min-w-0">{children}</div>
        {trailing && (
          <div className="flex items-center justify-center min-w-12 h-12 shrink-0">{trailing}</div>
        )}
      </div>
    );
  }
);
SearchViewHeader.displayName = "SearchViewHeader";

// ─── SearchView.Input ─────────────────────────────────────────────────────────

export type SearchViewInputProps = {
  placeholder?: string;
  "aria-label"?: string;
  /** Submit callback (Enter key) */
  onSubmit?: (value: string) => void;
  className?: string;
};

/**
 * The query input inside the search view header. Wired to the SearchView's
 * query state; pressing Escape closes the view (Radix handles this at the
 * content level too, but we also blur cleanly here).
 */
const SearchViewInput = React.forwardRef<HTMLInputElement, SearchViewInputProps>(
  ({ placeholder = "Search", "aria-label": ariaLabel, onSubmit, className }, ref) => {
    const { value, onValueChange } = useSearchView();
    return (
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmit?.(value);
        }}
        placeholder={placeholder}
        aria-label={ariaLabel || placeholder}
        className={cn(
          "flex-1 min-w-0 h-full bg-transparent outline-none border-none cursor-text px-1",
          "text-base leading-6 text-surface-foreground",
          "placeholder:text-[hsl(var(--on-surface-variant))]",
          className
        )}
      />
    );
  }
);
SearchViewInput.displayName = "SearchViewInput";

// ─── SearchView.Divider ─────────────────────────────────────────────────────

export type SearchViewDividerProps = {
  className?: string;
};

/**
 * Divider between the search view header and its content. Visible by default
 * per the M3 spec (`dividerVisible = true`).
 */
const SearchViewDivider = React.forwardRef<HTMLDivElement, SearchViewDividerProps>(
  ({ className }, ref) => (
    <div ref={ref} className={cn("h-px shrink-0 bg-outline", className)} aria-hidden="true" />
  )
);
SearchViewDivider.displayName = "SearchViewDivider";

// ─── SearchView.Content ─────────────────────────────────────────────────────

export type SearchViewContentProps = {
  className?: string;
  children?: React.ReactNode;
};

/**
 * Scrollable region below the header for suggestions and results.
 */
const SearchViewContent = React.forwardRef<HTMLDivElement, SearchViewContentProps>(
  ({ className, children }, ref) => (
    <div ref={ref} className={cn("min-h-0 flex-1 overflow-y-auto py-2", className)}>
      {children}
    </div>
  )
);
SearchViewContent.displayName = "SearchViewContent";

// ─── Compound Component Export ────────────────────────────────────────────────

export const Search = Object.assign(SearchRoot, {
  LeadingIcon: SearchLeadingIcon,
  Input: SearchInput,
  TrailingIcon: SearchTrailingIcon,
});

export const SearchView = Object.assign(SearchViewRoot, {
  Header: SearchViewHeader,
  Input: SearchViewInput,
  Divider: SearchViewDivider,
  Content: SearchViewContent,
});

export { SearchLeadingIcon, SearchInput, SearchTrailingIcon };
export { SearchViewHeader, SearchViewInput, SearchViewDivider, SearchViewContent };

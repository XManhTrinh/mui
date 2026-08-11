"use client";

import * as React from "react";
import { cn } from "./lib/utils";

// ─── Context ──────────────────────────────────────────────────────────────────

export interface AppBarContextValue {
  elevated: boolean;
  centered: boolean;
}

const AppBarContext = React.createContext<AppBarContextValue | null>(null);

/**
 * Hook to access AppBar context from within sub-components.
 * Throws if used outside an AppBar provider.
 */
export function useAppBar(): AppBarContextValue {
  const context = React.useContext(AppBarContext);
  if (!context) {
    throw new Error("useAppBar must be used within AppBar");
  }
  return context;
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

// --- AppBarLeading ---

export interface AppBarLeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * AppBar leading icon slot — 48dp touch target wrapper.
 */
const AppBarLeading = React.forwardRef<HTMLDivElement, AppBarLeadingProps>(
  ({ className, children, ...props }, ref) => {
    // If no children, don't render the slot (no reserved space)
    if (!children) return null;
    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center w-12 h-12 shrink-0", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
AppBarLeading.displayName = "AppBarLeading";

// --- AppBarHeadline ---

export interface AppBarHeadlineProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional subtitle text displayed below the headline */
  subtitle?: string;
  children?: React.ReactNode;
}

/**
 * AppBar headline slot — flex-1, title + optional subtitle.
 */
const AppBarHeadline = React.forwardRef<HTMLDivElement, AppBarHeadlineProps>(
  ({ className, subtitle, children, ...props }, ref) => {
    const { centered } = useAppBar();

    return (
      <div
        ref={ref}
        className={cn(
          "flex-1 min-w-0 px-4",
          centered && "text-center",
          className
        )}
        {...props}
      >
        {typeof children === "string" ? (
          <h1 className="text-[22px] leading-7 font-normal text-surface-foreground truncate">
            {children}
          </h1>
        ) : (
          children
        )}
        {subtitle && (
          <p className="text-[14px] leading-5 font-normal tracking-[0.25px] text-surface-variant-foreground truncate">
            {subtitle}
          </p>
        )}
      </div>
    );
  }
);
AppBarHeadline.displayName = "AppBarHeadline";

// --- AppBarTrailing ---

export interface AppBarTrailingProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * AppBar trailing actions slot — wraps trailing icon buttons.
 */
const AppBarTrailing = React.forwardRef<HTMLDivElement, AppBarTrailingProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center shrink-0", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
AppBarTrailing.displayName = "AppBarTrailing";

// ─── Dual-API Detection ──────────────────────────────────────────────────────

const COMPOUND_DISPLAY_NAMES = new Set([
  "AppBarLeading",
  "AppBarHeadline",
  "AppBarTrailing",
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

// ─── App Bar (M3 Top App Bar — Small variant) ────────────────────────────────

export interface AppBarProps extends React.HTMLAttributes<HTMLElement> {
  /** Leading content (navigation icon button) — legacy prop API */
  leadingIcon?: React.ReactNode;
  /** Headline text or element — legacy prop API */
  headline?: React.ReactNode;
  /** Subtitle text — legacy prop API */
  subtitle?: string;
  /** Trailing action elements (icon buttons) — legacy prop API */
  trailingIcons?: React.ReactNode;
  /** Whether the bar has scroll elevation */
  elevated?: boolean;
  /** Center-aligned headline */
  centered?: boolean;
}

/**
 * Material Design 3 Top App Bar — Small variant.
 *
 * Supports both a legacy prop-based API and a composable compound API.
 *
 * **Composable usage:**
 * ```tsx
 * <AppBar elevated>
 *   <AppBar.Leading>
 *     <IconButton icon="menu" />
 *   </AppBar.Leading>
 *   <AppBar.Headline subtitle="Subtitle text">
 *     Page Title
 *   </AppBar.Headline>
 *   <AppBar.Trailing>
 *     <IconButton icon="search" />
 *   </AppBar.Trailing>
 * </AppBar>
 * ```
 *
 * **Legacy usage (still supported):**
 * ```tsx
 * <AppBar
 *   leadingIcon={<IconButton icon="menu" />}
 *   headline="Page Title"
 *   subtitle="Subtitle"
 *   trailingIcons={<IconButton icon="search" />}
 *   elevated
 * />
 * ```
 *
 * Specs (m3.material.io/components/top-app-bar/specs):
 * - Container height: 64dp (h-16)
 * - Leading icon: 48dp touch target, 24dp icon
 * - Trailing icons: 48dp touch targets, 24dp icons
 * - Horizontal padding: 4dp to edge for icon touch targets
 * - Headline left padding: 16dp from leading icon
 * - Flat: bg surface, no shadow
 * - On scroll (elevated): bg surface-container, subtle elevation
 * - Headline: Title Large (22px, 400 weight, 28px line-height)
 * - Subtitle: Body Medium (14px, 400 weight, 20px line-height, 0.25px tracking)
 */
const AppBarRoot = React.forwardRef<HTMLElement, AppBarProps>(
  (
    {
      className,
      leadingIcon,
      headline,
      subtitle,
      trailingIcons,
      elevated = false,
      centered = false,
      children,
      ...props
    },
    ref
  ) => {
    const contextValue = React.useMemo<AppBarContextValue>(
      () => ({ elevated, centered }),
      [elevated, centered]
    );

    const isComposable = hasCompoundChildren(children);

    return (
      <AppBarContext.Provider value={contextValue}>
        <header
          ref={ref}
          role="banner"
          className={cn(
            "flex items-center h-16 px-1 transition-[background-color,box-shadow] duration-200",
            "bg-surface",
            elevated && "bg-surface-container shadow-[0_1px_3px_hsl(var(--elevation-1))]",
            className
          )}
          {...props}
        >
          {isComposable ? (
            // ─── Composable layout ────────────────────────────────────
            children
          ) : (
            // ─── Legacy prop-based layout ─────────────────────────────
            <>
              {/* Leading icon slot — 48dp touch target */}
              {leadingIcon && (
                <div className="flex items-center justify-center w-12 h-12 shrink-0">
                  {leadingIcon}
                </div>
              )}

              {/* Headline + subtitle */}
              {headline && (
                <div
                  className={cn(
                    "flex-1 min-w-0 px-4",
                    centered && "text-center"
                  )}
                >
                  {typeof headline === "string" ? (
                    <h1 className="text-[22px] leading-7 font-normal text-surface-foreground truncate">
                      {headline}
                    </h1>
                  ) : (
                    headline
                  )}
                  {subtitle && (
                    <p className="text-[14px] leading-5 font-normal tracking-[0.25px] text-surface-variant-foreground truncate">
                      {subtitle}
                    </p>
                  )}
                </div>
              )}

              {/* Fallback: children as flexible content when no headline */}
              {!headline && children && (
                <div className="flex-1 min-w-0 px-4 flex items-center">
                  {children}
                </div>
              )}

              {/* Trailing actions slot */}
              {trailingIcons && (
                <div className="flex items-center shrink-0">
                  {trailingIcons}
                </div>
              )}
            </>
          )}
        </header>
      </AppBarContext.Provider>
    );
  }
);
AppBarRoot.displayName = "AppBar";

// ─── Compound Component Export ────────────────────────────────────────────────

export const AppBar = Object.assign(AppBarRoot, {
  Leading: AppBarLeading,
  Headline: AppBarHeadline,
  Trailing: AppBarTrailing,
});

// ─── PageBar (content-area section header) ────────────────────────────────────

export type PageBarProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Page-level section header for page titles + action buttons.
 * Not a global navigation bar — used within page content regions.
 *
 * M3 equivalent: Section header / content region header.
 * Height: 56px minimum, items vertically centered.
 */
const PageBar = React.forwardRef<HTMLDivElement, PageBarProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center min-h-14 gap-4", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
PageBar.displayName = "PageBar";

export { AppBarLeading, AppBarHeadline, AppBarTrailing, PageBar };

"use client";

import * as React from "react";
import { cn } from "./lib/utils";

// ─── App Bar (M3 Top App Bar — Small variant) ────────────────────────────────

export interface AppBarProps extends React.HTMLAttributes<HTMLElement> {
  /** Leading content (navigation icon button) */
  leadingIcon?: React.ReactNode;
  /** Headline text or element */
  headline?: React.ReactNode;
  /** Subtitle text */
  subtitle?: string;
  /** Trailing action elements (icon buttons) */
  trailingIcons?: React.ReactNode;
  /** Whether the bar has scroll elevation */
  elevated?: boolean;
  /** Center-aligned headline */
  centered?: boolean;
}

/**
 * Material Design 3 Top App Bar — Small variant.
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
const AppBar = React.forwardRef<HTMLElement, AppBarProps>(
  (
    {
      className,
      leadingIcon,
      headline,
      subtitle,
      trailingIcons,
      elevated,
      centered,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <header
        ref={ref}
        role="banner"
        className={cn(
          "sticky top-0 z-30 flex items-center h-16 px-1 transition-[background-color,box-shadow] duration-200",
          "bg-surface",
          elevated && "bg-surface-container shadow-[0_1px_3px_hsl(var(--elevation-1))]",
          className
        )}
        {...props}
      >
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

        {/* Trailing actions slot — 48dp touch targets, 0dp gap (icons have own targets) */}
        {trailingIcons && (
          <div className="flex items-center shrink-0">
            {trailingIcons}
          </div>
        )}
      </header>
    );
  }
);
AppBar.displayName = "AppBar";

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

export { AppBar, PageBar };

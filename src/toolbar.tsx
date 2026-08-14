"use client";

import * as React from "react";

import { cn } from "./lib/utils";

/**
 * Material Design 3 Toolbar (Docked variant)
 *
 * M3 Expressive Specs (m3.material.io/components/toolbars/specs):
 * - Replaces the old Bottom App Bar
 * - Container for frequently used actions (icon buttons, FABs, text fields)
 * - Two variants: docked (fixed bar) and floating (pill-shaped)
 * - Height: 64dp (docked), auto (floating)
 * - Background: surface-container (standard) or primary-container (vibrant)
 * - No elevation shadow (M3 Expressive update)
 * - Shape: square corners (docked), rounded-full (floating)
 *
 * Usage: Toolbar is a simple container — place IconButtons, FABs,
 * or any other M3 components inside as children.
 *
 * @m3-audit VERIFIED — ToolbarLeading, ToolbarHeadline, ToolbarActions all present and correctly typed.
 * Minor: Does not use Object.assign namespace pattern (exports sub-components separately).
 * Consider adding `Object.assign(Toolbar, { Leading, Headline, Actions })` for API consistency
 * with other compound components, while keeping separate exports for tree-shaking.
 */

export type ToolbarProps = React.HTMLAttributes<HTMLDivElement>& {
  /** Toolbar style variant */
  variant?: "docked" | "floating";
  /** Color scheme */
  color?: "standard" | "vibrant";
}

const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ className, variant = "docked", color = "standard", children, ...props }, ref) => (
    <div
      ref={ref}
      role="toolbar"
      className={cn(
        "flex items-center gap-1 px-2",
        variant === "docked" && "h-16 w-full",
        variant === "floating" && "h-14 w-auto rounded-full px-3",
        color === "standard" && "bg-surface-container",
        color === "vibrant" && "bg-primary-container",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
Toolbar.displayName = "Toolbar";

export type ToolbarLeadingProps = React.HTMLAttributes<HTMLDivElement>& {}

/**
 * Leading slot — typically contains a navigation icon or close button.
 * Place an IconButton here.
 */
const ToolbarLeading = React.forwardRef<HTMLDivElement, ToolbarLeadingProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("shrink-0", className)} {...props}>
      {children}
    </div>
  )
);
ToolbarLeading.displayName = "ToolbarLeading";

export type ToolbarHeadlineProps = React.HTMLAttributes<HTMLDivElement>& {}

/**
 * Headline slot — optional title text in the toolbar.
 */
const ToolbarHeadline = React.forwardRef<HTMLDivElement, ToolbarHeadlineProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex-1 px-3 text-[16px] leading-6 font-medium text-surface-foreground truncate",
        className
      )}
      {...props}
    />
  )
);
ToolbarHeadline.displayName = "ToolbarHeadline";

export type ToolbarActionsProps = React.HTMLAttributes<HTMLDivElement>& {}

/**
 * Actions slot — contains trailing IconButtons or other controls.
 * Place IconButtons, Chips, or other M3 components here.
 */
const ToolbarActions = React.forwardRef<HTMLDivElement, ToolbarActionsProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center shrink-0", className)}
      {...props}
    />
  )
);
ToolbarActions.displayName = "ToolbarActions";

export { Toolbar, ToolbarLeading, ToolbarHeadline, ToolbarActions };
export type { ToolbarProps as ToolbarComponentProps };

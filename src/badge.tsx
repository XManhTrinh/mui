import * as React from "react";

import { cn } from "./lib/utils";

/**
 * Material Design 3 Badge
 *
 * M3 Specs (m3.material.io/components/badges/specs):
 * - Small badge (dot): 6×6dp, 3dp radius, error bg, no label
 * - Large badge (count): 16dp height, min-width 16dp, 8dp radius (pill),
 *   4dp horizontal padding, Label Small (11px/16px/500), error bg, on-error text
 * - Positioning: small offset 6×6dp, large offset 14×12dp from top-trailing corner
 */

export type BadgeProps = {
  /** Badge variant: "dot" for small indicator, "count" for number badge */
  variant?: "dot" | "count";
  /** Number to display (count variant only) */
  count?: number;
  /** Maximum number before showing "max+" (default: 99) */
  max?: number;
  /** Whether the badge is visible (default: true) */
  visible?: boolean;
  /** Additional class for the badge element */
  className?: string;
  /** Element to wrap with the badge (typically an Icon or IconButton) */
  children: React.ReactNode;
}

/**
 * BadgeWrapper positions a badge indicator relative to its child element.
 * Wraps children in a relative container and absolutely positions the badge.
 */
const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  function Badge(
    {
      variant = "dot",
      count,
      max = 99,
      visible = true,
      className,
      children,
    },
    ref
  ) {
    if (!visible) {
      return <>{children}</>;
    }

    const displayText =
      variant === "count" && count !== undefined
        ? count > max
          ? `${max}+`
          : String(count)
        : undefined;

    return (
      <span ref={ref} className="relative inline-flex overflow-visible">
        {children}
        {variant === "dot" && (
          <span
            className={cn(
              // M3 spec: small dot badge 6×6dp at top-right corner
              "absolute -top-0.5 -right-0.5 z-20",
              "size-1.5 rounded-full bg-error",
              className
            )}
            aria-hidden="true"
          />
        )}
        {variant === "count" && displayText && (
          <span
            className={cn(
              // M3 spec: large badge at top-right corner, overlapping slightly
              "absolute -top-1 -right-1 z-20",
              "h-4 min-w-4 rounded-full px-1",
              "bg-error text-error-foreground",
              "text-[11px] leading-4 font-medium tracking-[0.5px]",
              "inline-flex items-center justify-center",
              className
            )}
            aria-label={`${count} notifications`}
          >
            {displayText}
          </span>
        )}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export { Badge };

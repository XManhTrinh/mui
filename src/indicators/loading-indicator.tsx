"use client";

import * as React from "react";

import { cn } from "../lib/utils";
import { CircularProgress } from "./circular-progress";

/**
 * Material Design 3 Loading Indicator
 *
 * A convenience wrapper around CircularProgress (indeterminate)
 * with predefined size presets.
 *
 * Sizes:
 * - sm: 24dp
 * - md: 48dp (default)
 * - lg: 64dp
 */

export type LoadingIndicatorProps = {
  /** Predefined size. Default: "md" */
  size?: "sm" | "md" | "lg";
  /** Additional className */
  className?: string;
  /** Accessible label */
  "aria-label"?: string;
}

const sizeMap: Record<NonNullable<LoadingIndicatorProps["size"]>, number> = {
  sm: 24,
  md: 48,
  lg: 64,
};

const strokeWidthMap: Record<NonNullable<LoadingIndicatorProps["size"]>, number> = {
  sm: 3,
  md: 4,
  lg: 4,
};

const LoadingIndicator = React.forwardRef<HTMLDivElement, LoadingIndicatorProps>(
  ({ size = "md", className, "aria-label": ariaLabel = "Loading" }, ref) => {
    return (
      <CircularProgress
        ref={ref}
        size={sizeMap[size]}
        strokeWidth={strokeWidthMap[size]}
        className={cn(className)}
        aria-label={ariaLabel}
      />
    );
  }
);
LoadingIndicator.displayName = "LoadingIndicator";

export { LoadingIndicator };

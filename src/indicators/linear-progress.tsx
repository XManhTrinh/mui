"use client";

import * as React from "react";

import { cn } from "../lib/utils";

/**
 * Material Design 3 Linear Progress Indicator
 *
 * @see https://m3.material.io/components/progress-indicators/specs
 *
 * Variants: Determinate (shows progress %) and Indeterminate (infinite animation).
 *
 * Anatomy:
 * 1. Track (background bar)
 * 2. Active indicator (filled portion or animated bar)
 *
 * Measurements:
 * - Track height: 4dp
 * - Track shape: 2dp radius (rounded ends)
 * - Full width of container
 *
 * Colors (via CSS custom properties):
 * - Active indicator: primary
 * - Track: secondary-container
 *
 * Animation:
 * - Determinate: smooth width transition (200ms M3 standard easing)
 * - Indeterminate: active indicator slides left-to-right (2s cycle, ease-in-out)
 * - prefers-reduced-motion: static display, no animation
 */

export interface LinearProgressProps {
  /** Progress value 0-100. If undefined, renders indeterminate. */
  value?: number;
  /** Additional className */
  className?: string;
  /** Accessible label */
  "aria-label"?: string;
}

const LinearProgress = React.forwardRef<HTMLDivElement, LinearProgressProps>(
  ({ value, className, "aria-label": ariaLabel }, ref) => {
    const isDeterminate = value !== undefined;
    const clampedValue = isDeterminate
      ? Math.max(0, Math.min(100, value))
      : undefined;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={isDeterminate ? 0 : undefined}
        aria-valuemax={isDeterminate ? 100 : undefined}
        aria-valuenow={clampedValue}
        aria-label={ariaLabel}
        className={cn(
          "relative w-full h-1 rounded-full overflow-hidden bg-secondary-container",
          className
        )}
      >
        {isDeterminate ? (
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-primary transition-[width] duration-200 ease-[cubic-bezier(0.2,0,0,1)]"
            style={{ width: `${clampedValue}%` }}
          />
        ) : (
          <>
            <div className="absolute inset-y-0 rounded-full bg-primary animate-[m3-linear-indeterminate-1_2s_ease-in-out_infinite]" />
            <div className="absolute inset-y-0 rounded-full bg-primary animate-[m3-linear-indeterminate-2_2s_ease-in-out_0.8s_infinite]" />
          </>
        )}
      </div>
    );
  }
);
LinearProgress.displayName = "LinearProgress";

export { LinearProgress };

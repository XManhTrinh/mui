"use client";

import * as React from "react";

import { cn } from "../lib/utils";

/**
 * Material Design 3 Circular Progress Indicator
 *
 * @see https://m3.material.io/components/progress-indicators/specs
 *
 * Variants: Determinate (shows progress %) and Indeterminate (spinning animation).
 *
 * Anatomy:
 * 1. Track circle (background ring)
 * 2. Active indicator arc (filled portion or animated arc)
 *
 * Measurements:
 * - Default container size: 48dp × 48dp
 * - Stroke width: 4dp
 * - Circular track diameter: 40dp (48 - 2×4dp padding)
 *
 * Colors (via CSS custom properties):
 * - Active indicator: primary
 * - Track: secondary-container
 *
 * Animation:
 * - Determinate: smooth stroke-dashoffset transition (200ms M3 standard easing)
 * - Indeterminate: rotate container (1.4s) + grow/shrink arc
 * - prefers-reduced-motion: static display, no animation
 */

export interface CircularProgressProps {
  /** Progress value 0-100. If undefined, renders indeterminate. */
  value?: number;
  /** Size in px. Default: 48 */
  size?: number;
  /** Stroke width in px. Default: 4 */
  strokeWidth?: number;
  /** Additional className */
  className?: string;
  /** Accessible label */
  "aria-label"?: string;
}

const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  (
    {
      value,
      size = 48,
      strokeWidth = 4,
      className,
      "aria-label": ariaLabel,
    },
    ref
  ) => {
    const isDeterminate = value !== undefined;
    const clampedValue = isDeterminate
      ? Math.max(0, Math.min(100, value))
      : undefined;

    // SVG geometry
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = isDeterminate
      ? circumference - (clampedValue! / 100) * circumference
      : 0;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={isDeterminate ? 0 : undefined}
        aria-valuemax={isDeterminate ? 100 : undefined}
        aria-valuenow={clampedValue}
        aria-label={ariaLabel}
        className={cn(
          "inline-flex items-center justify-center",
          !isDeterminate && "animate-[m3-circular-rotate_1.4s_linear_infinite]",
          className
        )}
        style={{ width: size, height: size }}
      >
        <svg
          viewBox={`0 0 ${size} ${size}`}
          fill="none"
          className="w-full h-full"
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Track circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className="stroke-secondary-container"
            fill="none"
          />
          {/* Active indicator */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            className={cn(
              "stroke-primary",
              isDeterminate
                ? "transition-[stroke-dashoffset] duration-200 ease-[cubic-bezier(0.2,0,0,1)]"
                : "animate-[m3-circular-dash_1.4s_ease-in-out_infinite]"
            )}
            style={
              isDeterminate
                ? {
                    strokeDasharray: circumference,
                    strokeDashoffset: offset,
                  }
                : {
                    strokeDasharray: `${circumference}`,
                  }
            }
          />
        </svg>
      </div>
    );
  }
);
CircularProgress.displayName = "CircularProgress";

export { CircularProgress };

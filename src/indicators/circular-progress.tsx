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
 * Measurements (per md.comp.progress-indicator.circular):
 * - Default container size: 40dp × 40dp (48dp is the wave/expressive size)
 * - Track thickness (stroke): 4dp
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

export type CircularProgressProps = {
  /** Progress value 0-100. If undefined, renders indeterminate. */
  value?: number;
  /** Size in px. Default: 40 (M3 baseline; auto 48 when wave is set) */
  size?: number;
  /** Stroke width in px. Default: 4 */
  strokeWidth?: number;
  /**
   * M3 Expressive wavy active indicator — renders the ring as a sine-perturbed
   * circle (amplitude 1.6dp, wavelength ~15dp). Defaults size to 48dp.
   */
  wave?: boolean;
  /** Additional className */
  className?: string;
  /** Accessible label */
  "aria-label"?: string;
}

/** Build a closed wavy-circle path: base radius r, sine amplitude a, `waves` cycles. */
function buildWavyCirclePath(cx: number, cy: number, r: number, a: number, waves: number): string {
  const steps = Math.max(120, waves * 24);
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * 2 * Math.PI;
    const rr = r + a * Math.sin(waves * t);
    const x = cx + rr * Math.cos(t);
    const y = cy + rr * Math.sin(t);
    d += `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  return d + "Z";
}

const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  (
    {
      value,
      size: sizeProp,
      strokeWidth = 4,
      wave = false,
      className,
      "aria-label": ariaLabel,
    },
    ref
  ) => {
    const isDeterminate = value !== undefined;
    const clampedValue = isDeterminate
      ? Math.max(0, Math.min(100, value))
      : undefined;

    // Wave defaults to the 48dp "with wave" size.
    const size = sizeProp ?? (wave ? 48 : 40);

    // SVG geometry
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = isDeterminate
      ? circumference - (clampedValue! / 100) * circumference
      : 0;

    // Wavy ring: amplitude 1.6dp, wavelength ~15dp → whole cycles around the ring.
    const waveCount = wave ? Math.max(6, Math.round((2 * Math.PI * radius) / 15)) : 0;
    const wavyPath = wave ? buildWavyCirclePath(size / 2, size / 2, radius, 1.6, waveCount) : "";
    // Path length ≈ circumference (wave adds negligible length); reuse for dash reveal.
    const waveLen = circumference;

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
          {/* Active indicator — wavy path (Expressive) or plain arc */}
          {wave ? (
            <path
              d={wavyPath}
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
                  ? { strokeDasharray: waveLen, strokeDashoffset: (waveLen) - (clampedValue! / 100) * waveLen }
                  : { strokeDasharray: `${waveLen}` }
              }
            />
          ) : (
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
                  ? { strokeDasharray: circumference, strokeDashoffset: offset }
                  : { strokeDasharray: `${circumference}` }
              }
            />
          )}
        </svg>
      </div>
    );
  }
);
CircularProgress.displayName = "CircularProgress";

export { CircularProgress };

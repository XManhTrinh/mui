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

export type LinearProgressProps = {
  /** Progress value 0-100. If undefined, renders indeterminate. */
  value?: number;
  /**
   * M3 Expressive wavy active indicator (determinate only). Renders the filled
   * portion as an animated sine wave (amplitude 3dp, wavelength 40dp).
   */
  wave?: boolean;
  /** Additional className */
  className?: string;
  /** Accessible label */
  "aria-label"?: string;
}

// M3 Expressive wavy geometry (dp): amplitude 3, wavelength 40, stroke 4.
const WAVE_AMPLITUDE = 3;
const WAVE_WAVELENGTH = 40;
const WAVE_STROKE = 4;
const WAVE_HEIGHT = WAVE_AMPLITUDE * 2 + WAVE_STROKE; // 10dp track box

/** Build a repeating sine-wave path across `widthPx` (+ one extra wavelength for seamless scroll). */
function buildWavePath(widthPx: number): string {
  const midY = WAVE_HEIGHT / 2;
  const total = widthPx + WAVE_WAVELENGTH;
  const step = 2; // px sampling
  let d = `M 0 ${midY}`;
  for (let x = 0; x <= total; x += step) {
    const y = midY - WAVE_AMPLITUDE * Math.sin((x / WAVE_WAVELENGTH) * 2 * Math.PI);
    d += ` L ${x.toFixed(1)} ${y.toFixed(2)}`;
  }
  return d;
}

const LinearProgress = React.forwardRef<HTMLDivElement, LinearProgressProps>(
  ({ value, wave = false, className, "aria-label": ariaLabel }, ref) => {
    const isDeterminate = value !== undefined;
    const clampedValue = isDeterminate
      ? Math.max(0, Math.min(100, value))
      : undefined;

    // Measure the track width so the wave path spans it.
    const trackRef = React.useRef<HTMLDivElement | null>(null);
    const [trackWidth, setTrackWidth] = React.useState(0);
    React.useEffect(() => {
      if (!wave) return;
      const el = trackRef.current;
      if (!el) return;
      const update = () => setTrackWidth(el.clientWidth);
      update();
      if (typeof ResizeObserver !== "undefined") {
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
      }
    }, [wave]);

    // ── Wavy (determinate) variant ──
    if (wave && isDeterminate) {
      const wavePath = buildWavePath(trackWidth);
      return (
        <div
          ref={(node) => {
            trackRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={clampedValue}
          aria-label={ariaLabel}
          className={cn("relative w-full overflow-hidden", className)}
          style={{ height: WAVE_HEIGHT }}
        >
          {/* Inactive track — straight rounded bar centered vertically */}
          <div
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 rounded-full bg-secondary-container"
            style={{ width: `${100 - clampedValue!}%`, insetInlineEnd: 0, left: "auto" }}
          />
          {/* Active wave — clipped to value width, scrolls one wavelength per cycle */}
          <div
            className="absolute inset-y-0 inset-s-0 overflow-hidden"
            style={{ width: `${clampedValue}%` }}
          >
            <svg
              className="h-full motion-safe:animate-[m3-linear-wave_1s_linear_infinite]"
              style={{ width: trackWidth + WAVE_WAVELENGTH }}
              height={WAVE_HEIGHT}
              viewBox={`0 0 ${trackWidth + WAVE_WAVELENGTH} ${WAVE_HEIGHT}`}
              fill="none"
              aria-hidden="true"
            >
              <path
                d={wavePath}
                className="stroke-primary"
                strokeWidth={WAVE_STROKE}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      );
    }

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
            className="absolute inset-y-0 inset-s-0 rounded-full bg-primary transition-[width] duration-200 ease-[cubic-bezier(0.2,0,0,1)]"
            style={{ width: `${clampedValue}%` }}
          />
        ) : (
          <>
            <div className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-primary will-change-transform animate-[m3-linear-indeterminate-1_2s_cubic-bezier(0.2,0,0,1)_infinite]" />
            <div className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-primary will-change-transform animate-[m3-linear-indeterminate-2_2s_cubic-bezier(0.2,0,0,1)_0.8s_infinite]" />
          </>
        )}
      </div>
    );
  }
);
LinearProgress.displayName = "LinearProgress";

export { LinearProgress };

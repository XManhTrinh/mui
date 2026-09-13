"use client";

import * as React from "react";

import { cn } from "./lib/utils";

/**
 * Material Design 3 Slider
 *
 * @see https://m3.material.io/components/sliders/specs
 *
 * Variants: Standard (continuous) and Discrete (with stops).
 *
 * Anatomy:
 * 1. Value indicator (optional tooltip showing current value)
 * 2. Stop indicators (optional dots for discrete steps)
 * 3. Active track (filled portion)
 * 4. Handle (thumb — 44dp height × 4dp width, rounded)
 * 5. Inactive track (unfilled portion)
 *
 * Measurements (XS — web default):
 * - Track height: 16dp, shape: 8dp radius (fully rounded)
 * - Handle: 44dp height × 4dp width
 * - Label container: 44dp × 48dp
 * - Touch target: 48dp minimum
 *
 * Colors (via CSS custom properties):
 * - Active track: primary
 * - Handle: primary
 * - Inactive track: secondary-container
 * - Stop indicator (active): on-primary
 * - Stop indicator (inactive): on-secondary-container
 * - Value indicator bg: inverse-surface
 * - Value indicator text: inverse-on-surface
 * - Disabled active track: on-surface at 38%
 * - Disabled inactive track: on-surface at 12%
 * - Disabled handle: on-surface at 38%
 *
 * States: 8% hover, 10% focus, 10% press (state layer on handle)
 * Animation: value indicator fade 150ms, handle state 200ms M3 standard easing
 */

/**
 * M3 Expressive slider sizes. Per md.comp.slider.{xsmall,small,medium,large,xlarge}:
 * track height 16/24/40/56/96dp, handle height 44/44/44/68/108dp,
 * track shape-leading 8/8/12/16/28dp.
 */
export type SliderSize = "xsmall" | "small" | "medium" | "large" | "xlarge";

const sliderSizeMap: Record<
  SliderSize,
  {
    track: string;
    handle: string;
    row: string;
    radius: string;
    handleW: string;
    /** Resting handle width in px (used to inset the thumb so it never
     * overflows the track at the min/max ends). */
    handleWpx: number;
  }
> = {
  xsmall: { track: "h-4", handle: "h-11", row: "h-12", radius: "rounded-lg", handleW: "w-1", handleWpx: 4 },
  small: { track: "h-6", handle: "h-11", row: "h-12", radius: "rounded-lg", handleW: "w-1", handleWpx: 4 },
  medium: { track: "h-10", handle: "h-11", row: "h-12", radius: "rounded-xl", handleW: "w-1", handleWpx: 4 },
  large: { track: "h-14", handle: "h-17", row: "h-18", radius: "rounded-2xl", handleW: "w-1.5", handleWpx: 6 },
  xlarge: { track: "h-24", handle: "h-27", row: "h-28", radius: "rounded-[28px]", handleW: "w-1.5", handleWpx: 6 },
};

export type SliderProps = {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** M3 Expressive size (default: xsmall — the 16dp baseline track) */
  size?: SliderSize;
  disabled?: boolean;
  showValueIndicator?: boolean;
  showStops?: boolean;
  className?: string;
  "aria-label"?: string;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onValueChange,
      min = 0,
      max = 100,
      step,
      size = "xsmall",
      disabled = false,
      showValueIndicator = false,
      showStops,
      className,
      "aria-label": ariaLabel,
    },
    ref
  ) => {
    const sz = sliderSizeMap[size];
    const [internalValue, setInternalValue] = React.useState(
      defaultValue ?? min
    );
    const [isInteracting, setIsInteracting] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;

    const percentage =
      max === min ? 0 : ((currentValue - min) / (max - min)) * 100;

    // Position the handle's CENTER, inset by half its width at both ends so it
    // never spills past the track edges at min/max. This maps the value
    // fraction 0..1 into the track center-line [halfW, 100% - halfW].
    const fraction = percentage / 100;
    const thumbCenter = `calc(${sz.handleWpx / 2}px + ${fraction} * (100% - ${sz.handleWpx}px))`;

    // Determine if discrete (has stops)
    const isDiscrete = step !== undefined && step > 0;
    const shouldShowStops = showStops ?? isDiscrete;

    // Calculate stop positions for discrete mode
    const stops = React.useMemo(() => {
      if (!shouldShowStops || !step || step <= 0) return [];
      const positions: number[] = [];
      for (let v = min; v <= max; v += step) {
        const pct = ((v - min) / (max - min)) * 100;
        positions.push(pct);
      }
      return positions;
    }, [shouldShowStops, step, min, max]);

    const showIndicator =
      showValueIndicator && (isInteracting || isHovered || isFocused);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      if (!isControlled) setInternalValue(newValue);
      onValueChange?.(newValue);
    };

    return (
      <div
        className={cn(
          "isolate relative flex items-center select-none group",
          sz.row,
          disabled && "pointer-events-none cursor-not-allowed",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Value indicator (tooltip) */}
        {showValueIndicator && (
          <div
            className={cn(
              "absolute -top-12 pointer-events-none z-10",
              // Center on the thumb position: shift by -50% own width in LTR, +50% in RTL.
              "ltr:-translate-x-1/2 rtl:translate-x-1/2",
              "flex items-center justify-center w-12 h-11 rounded-full",
              "bg-inverse-surface text-inverse-on-surface",
              "text-[12px] leading-4 font-medium tracking-[0.5px]",
              "transition-opacity duration-150 ease-[cubic-bezier(0.2,0,0,1)]",
              showIndicator ? "opacity-100" : "opacity-0"
            )}
            style={{ insetInlineStart: thumbCenter }}
            aria-hidden="true"
          >
            {Math.round(currentValue)}
          </div>
        )}

        {/* Track container — per-size height + shape-leading radius */}
        <div className={cn("relative w-full overflow-hidden", sz.track, sz.radius)}>
          {/* Inactive track */}
          <div
            className={cn(
              "absolute inset-0",
              sz.radius,
              disabled
                ? "bg-[hsl(var(--on-surface)/0.12)]"
                : "bg-secondary-container"
            )}
          />

          {/* Active track */}
          <div
            className={cn(
              "absolute inset-y-0 inset-s-0",
              sz.radius,
              disabled
                ? "bg-[hsl(var(--on-surface)/0.38)]"
                : "bg-primary"
            )}
            style={{ width: `${percentage}%` }}
          />

          {/* Stop indicators */}
          {shouldShowStops &&
            stops.map((pct) => (
              <span
                key={pct}
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 ltr:-translate-x-1/2 rtl:translate-x-1/2 w-1 h-1 rounded-full pointer-events-none",
                  pct <= percentage
                    ? "bg-[hsl(var(--on-primary))]"
                    : "bg-[hsl(var(--on-secondary-container))]"
                )}
                style={{ insetInlineStart: `${pct}%` }}
                aria-hidden="true"
              />
            ))}
        </div>

        {/* Visual handle (thumb) — per-size height, 4dp width (6dp on large+/interacting) */}
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 ltr:-translate-x-1/2 rtl:translate-x-1/2 rounded-full",
            sz.handleW,
            sz.handle,
            "transition-[width,background-color] duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
            disabled
              ? "bg-[hsl(var(--on-surface)/0.38)] cursor-not-allowed"
              : cn("bg-primary", isInteracting ? "cursor-grabbing" : "cursor-grab"),
            isInteracting && !disabled && "w-1.5"
          )}
          style={{ insetInlineStart: thumbCenter }}
        >
          {/* State layer — 48dp touch area indicator */}
          <span
            className={cn(
              "absolute top-1/2 inset-s-1/2 ltr:-translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full",
              "transition-colors duration-200 pointer-events-none",
              // Press (10%) takes precedence, then focus (10%), then hover (8%).
              !disabled && isInteracting && "bg-[hsl(var(--primary)/0.10)]",
              !disabled && !isInteracting && isFocused && "bg-[hsl(var(--primary)/0.10)]",
              !disabled && !isInteracting && !isFocused && isHovered && "bg-[hsl(var(--primary)/0.08)]"
            )}
          />
        </div>

        {/* Native range input — invisible but provides accessibility + keyboard support */}
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step ?? "any"}
          value={currentValue}
          onChange={handleChange}
          onPointerDown={() => setIsInteracting(true)}
          onPointerUp={() => setIsInteracting(false)}
          onPointerCancel={() => setIsInteracting(false)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentValue}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed focus-visible:outline-none peer"
        />
      </div>
    );
  }
);
Slider.displayName = "Slider";

export { Slider };
export type { SliderProps as SliderComponentProps };

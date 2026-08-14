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

export type SliderProps = {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
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
      disabled = false,
      showValueIndicator = false,
      showStops,
      className,
      "aria-label": ariaLabel,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(
      defaultValue ?? min
    );
    const [isInteracting, setIsInteracting] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);

    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;

    const percentage =
      max === min ? 0 : ((currentValue - min) / (max - min)) * 100;

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

    const showIndicator = showValueIndicator && (isInteracting || isHovered);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      if (!isControlled) setInternalValue(newValue);
      onValueChange?.(newValue);
    };

    return (
      <div
        className={cn(
          "relative flex items-center w-full h-12 select-none group",
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
              "absolute -top-12 -translate-x-1/2 pointer-events-none z-10",
              "flex items-center justify-center w-12 h-11 rounded-full",
              "bg-inverse-surface text-inverse-on-surface",
              "text-[14px] leading-5 font-medium",
              "transition-opacity duration-150 ease-[cubic-bezier(0.2,0,0,1)]",
              showIndicator ? "opacity-100" : "opacity-0"
            )}
            style={{ left: `${percentage}%` }}
            aria-hidden="true"
          >
            {Math.round(currentValue)}
          </div>
        )}

        {/* Track container — 16dp height, fully rounded */}
        <div className="relative w-full h-4 rounded-lg overflow-hidden">
          {/* Inactive track */}
          <div
            className={cn(
              "absolute inset-0 rounded-lg",
              disabled
                ? "bg-[hsl(var(--on-surface)/0.12)]"
                : "bg-secondary-container"
            )}
          />

          {/* Active track */}
          <div
            className={cn(
              "absolute inset-y-0 left-0 rounded-lg",
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
                  "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-1 h-1 rounded-full pointer-events-none",
                  pct <= percentage
                    ? "bg-[hsl(var(--on-primary))]"
                    : "bg-[hsl(var(--on-secondary-container))]"
                )}
                style={{ left: `${pct}%` }}
                aria-hidden="true"
              />
            ))}
        </div>

        {/* Visual handle (thumb) — 44dp height × 4dp width */}
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 -translate-x-1/2",
            "w-1 h-11 rounded-full",
            "transition-[width,background-color] duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
            disabled
              ? "bg-[hsl(var(--on-surface)/0.38)] cursor-not-allowed"
              : cn("bg-primary", isInteracting ? "cursor-grabbing" : "cursor-grab"),
            isInteracting && !disabled && "w-1.5"
          )}
          style={{ left: `${percentage}%` }}
        >
          {/* State layer — 48dp touch area indicator */}
          <span
            className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full",
              "transition-colors duration-200 pointer-events-none",
              !disabled && isInteracting && "bg-[hsl(var(--primary)/0.10)]",
              !disabled && isHovered && !isInteracting && "bg-[hsl(var(--primary)/0.08)]",
              !disabled && !isHovered && !isInteracting && "group-focus-visible:bg-[hsl(var(--primary)/0.10)]"
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
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
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

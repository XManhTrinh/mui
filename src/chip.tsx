"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./lib/utils";
import { Icon } from "./icon";

/**
 * Material Design 3 Chip
 *
 * M3 Specs (m3.material.io/components/chips/specs):
 * - 4 variants: assist, filter, input, suggestion
 * - Height: 32dp
 * - Corner radius: 8dp
 * - Icon size: 18dp
 * - Padding: 16dp L/R (no icon), 8dp L/R (with icon)
 * - Gap between elements: 8dp
 * - Typography: Label Large (14px, 500 weight, 20px line-height, 0.1px tracking)
 * - States: 8% hover, 10% focus, 10% press
 * - Disabled: 38% opacity
 * - Selected (filter/input): secondary-container bg, on-secondary-container text, no border
 * - Elevated: surface-container-low bg + Level 1 shadow
 */
const chipVariants = cva(
  [
    "relative inline-flex items-center justify-center h-8 rounded-lg",
    "text-[14px] leading-5 font-medium tracking-[0.1px]",
    "transition-colors duration-200 select-none cursor-pointer",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
    "disabled:pointer-events-none disabled:opacity-[0.38] disabled:cursor-not-allowed",
  ].join(" "),
  {
    variants: {
      variant: {
        assist:
          "border border-outline text-surface-foreground px-4",
        filter:
          "border border-outline text-surface-variant-foreground px-4",
        input:
          "border border-outline-variant text-surface-variant-foreground px-4",
        suggestion:
          "border border-outline text-surface-variant-foreground px-4",
      },
      selected: {
        true: "border-transparent bg-secondary-container text-secondary-container-foreground",
        false: "",
      },
      elevated: {
        true: "bg-surface-container-low shadow-[0_1px_3px_1px_hsl(var(--elevation-1)),0_1px_2px_0_hsl(var(--elevation-1))] border-transparent",
        false: "",
      },
    },
    defaultVariants: {
      variant: "assist",
      selected: false,
      elevated: false,
    },
  }
);

export interface ChipProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">,
    VariantProps<typeof chipVariants> {
  /** Leading icon name (Material Symbols) */
  leadingIcon?: string;
  /** Trailing icon name (Material Symbols) */
  trailingIcon?: string;
  /** Whether chip is selected (filter/input variants) */
  selected?: boolean;
  /** Callback when chip is dismissed (input variant) */
  onDismiss?: () => void;
  /** Adds elevation + surface-container-low bg */
  elevated?: boolean;
  /** Disabled state */
  disabled?: boolean;
  children: React.ReactNode;
}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      className,
      variant,
      selected = false,
      elevated = false,
      leadingIcon,
      trailingIcon,
      onDismiss,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const showCheckmark = variant === "filter" && selected;
    const showDismiss = variant === "input" && onDismiss;
    const hasLeading = !!(leadingIcon || showCheckmark);
    const hasTrailing = !!(trailingIcon || showDismiss);

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={cn(
          chipVariants({ variant, selected, elevated }),
          // State layer on hover/focus/press
          "before:absolute before:inset-0 before:rounded-lg before:transition-colors before:duration-200 before:pointer-events-none",
          !selected && "hover:before:bg-[hsl(var(--on-surface)/0.08)] focus-visible:before:bg-[hsl(var(--on-surface)/0.10)] active:before:bg-[hsl(var(--on-surface)/0.10)]",
          selected && "hover:before:bg-[hsl(var(--on-secondary-container)/0.08)] focus-visible:before:bg-[hsl(var(--on-secondary-container)/0.10)] active:before:bg-[hsl(var(--on-secondary-container)/0.10)]",
          // Adjust padding when icons present
          hasLeading && "pl-2",
          hasTrailing && "pr-2",
          className
        )}
        {...props}
      >
        {showCheckmark && (
          <Icon name="check" size={18} className="mr-2 relative z-10" />
        )}
        {!showCheckmark && leadingIcon && (
          <Icon name={leadingIcon} size={18} className={cn("mr-2 relative z-10", variant === "assist" && "text-primary")} />
        )}
        <span className="relative z-10 truncate">{children}</span>
        {showDismiss && (
          <span
            role="button"
            tabIndex={-1}
            aria-label="Remove"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss?.();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                e.preventDefault();
                onDismiss?.();
              }
            }}
            className="relative z-10 ml-2 inline-flex items-center justify-center min-w-12 min-h-12 -mr-3"
          >
            <Icon name="close" size={18} />
          </span>
        )}
        {!showDismiss && trailingIcon && (
          <Icon name={trailingIcon} size={18} className="ml-2 relative z-10" />
        )}
      </button>
    );
  }
);
Chip.displayName = "Chip";

export { Chip, chipVariants };

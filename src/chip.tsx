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
    "disabled:pointer-events-none disabled:opacity-[0.38] disabled:cursor-not-allowed disabled:before:opacity-0!",
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

export type ChipProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> & VariantProps<typeof chipVariants>& {
  /** Leading icon name (Material Symbols) */
  leadingIcon?: string;
  /** Leading element (avatar, image, or custom React node — overrides leadingIcon) */
  leadingElement?: React.ReactNode;
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
      leadingElement,
      trailingIcon,
      onDismiss,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const showCheckmark = variant === "filter" && selected;
    const showDismiss = variant === "input" && !!onDismiss;
    const hasLeading = !!(leadingIcon || leadingElement || showCheckmark);
    const hasTrailing = !!(trailingIcon || showDismiss);

    const stateLayer = cn(
      "before:absolute before:inset-0 before:rounded-lg before:transition-colors before:duration-200 before:pointer-events-none",
      !selected &&
        "hover:before:bg-[hsl(var(--on-surface)/0.08)] focus-visible:before:bg-[hsl(var(--on-surface)/0.10)] active:before:bg-[hsl(var(--on-surface)/0.10)]",
      selected &&
        "hover:before:bg-[hsl(var(--on-secondary-container)/0.08)] focus-visible:before:bg-[hsl(var(--on-secondary-container)/0.10)] active:before:bg-[hsl(var(--on-secondary-container)/0.10)]"
    );

    const body = (
      <>
        {showCheckmark && (
          <Icon name="check" size={18} className="me-2 relative z-10" />
        )}
        {!showCheckmark && leadingElement && (
          <span className="relative z-10 me-2 inline-flex items-center justify-center size-4.5 rounded-full overflow-hidden shrink-0">
            {leadingElement}
          </span>
        )}
        {!showCheckmark && !leadingElement && leadingIcon && (
          <Icon
            name={leadingIcon}
            size={18}
            className={cn("me-2 relative z-10", variant === "assist" && "text-primary")}
          />
        )}
        <span className="relative z-10 truncate">{children}</span>
        {!showDismiss && trailingIcon && (
          <Icon name={trailingIcon} size={18} className="ms-2 relative z-10" />
        )}
      </>
    );

    // Input chips with a dismiss action render the label and the remove
    // control as two SEPARATE sibling buttons inside a container — never a
    // button nested in a button (invalid DOM + keyboard-unreachable). The
    // container carries the chip's visual styling.
    if (showDismiss) {
      return (
        <div
          className={cn(
            chipVariants({ variant, selected, elevated }),
            // The container is a plain div, so `disabled:` utilities don't
            // apply — dim it explicitly when disabled.
            disabled && "opacity-[0.38] pointer-events-none",
            hasLeading && "ps-2",
            "pe-1",
            className
          )}
        >
          <button
            ref={ref}
            type="button"
            disabled={disabled}
            aria-pressed={selected}
            className={cn(
              "relative inline-flex items-center rounded-lg -mx-1 px-1 focus-visible:outline-none",
              stateLayer
            )}
            {...props}
          >
            {body}
          </button>
          <button
            type="button"
            disabled={disabled}
            aria-label="Remove"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss?.();
            }}
            className="relative z-10 ms-1 inline-flex items-center justify-center size-8 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary hover:bg-[hsl(var(--on-surface)/0.08)] active:bg-[hsl(var(--on-surface)/0.10)] disabled:pointer-events-none"
          >
            <Icon name="close" size={18} />
          </button>
        </div>
      );
    }

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        aria-pressed={variant === "filter" ? selected : undefined}
        className={cn(
          chipVariants({ variant, selected, elevated }),
          stateLayer,
          hasLeading && "ps-2",
          hasTrailing && "pe-2",
          className
        )}
        {...props}
      >
        {body}
      </button>
    );
  }
);
Chip.displayName = "Chip";

export { Chip, chipVariants };

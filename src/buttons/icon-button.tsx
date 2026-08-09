"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";
import { Icon } from "../icon";

/**
 * Material Design 3 Icon Button (M3 Expressive)
 *
 * Implements Standard, Filled, Filled-Tonal, and Outlined icon button variants
 * with toggle support, shape morph on press, and accessible touch targets.
 *
 * Supports two usage patterns:
 * 1. Shorthand: `<IconButton icon="favorite" />` — renders Icon internally with correct size
 * 2. Composable: `<IconButton><Icon name="favorite" /></IconButton>` — full control
 *
 * State layers use a ::before pseudo-element with `bg-current` to inherit
 * the text color (which is the on-color for each variant).
 */

const iconButtonVariants = cva(
  [
    // Layout
    "relative inline-flex items-center justify-center",
    // Cursor & interaction
    "cursor-pointer select-none",
    // Transition for shape morph
    "transition-[border-radius] duration-100 ease-out",
    // Focus ring
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
    // State layer via ::before pseudo-element
    "overflow-hidden",
    "before:absolute before:inset-0 before:rounded-[inherit]",
    "before:bg-current before:opacity-0",
    "before:transition-opacity before:duration-200 before:pointer-events-none",
    // State layer opacities (M3: 8% hover, 10% focus, 10% press)
    "hover:before:opacity-[0.08]",
    "focus-visible:before:opacity-[0.10]",
    "active:before:opacity-[0.10]",
    // Icon sizing defaults (SVG icons)
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "[&_.material-symbols-rounded]:pointer-events-none",
  ].join(" "),
  {
    variants: {
      variant: {
        standard: "bg-transparent text-surface-variant-foreground",
        filled: "bg-primary text-primary-foreground",
        "filled-tonal":
          "bg-secondary-container text-secondary-container-foreground",
        outlined:
          "bg-transparent border border-outline text-surface-variant-foreground",
      },
      size: {
        xs: "size-8 [&_svg]:size-[18px]",
        s: "size-10 [&_svg]:size-5",
        m: "size-12 [&_svg]:size-6",
        l: "size-14 [&_svg]:size-7",
        xl: "size-16 [&_svg]:size-8",
      },
    },
    defaultVariants: {
      variant: "standard",
      size: "s",
    },
  }
);

/**
 * Proportional icon sizes per container size (M3 Expressive ~60% ratio).
 */
const iconSizeMap = {
  xs: 18,
  s: 20,
  m: 24,
  l: 28,
  xl: 32,
} as const;

/**
 * Shape classes for round and square shapes at each size.
 * Each entry includes the resting radius and the active (morphed) radius.
 * Morph reduces border-radius by ~30% on :active.
 */
const shapeClasses = {
  round: {
    xs: "rounded-full active:rounded-lg",
    s: "rounded-full active:rounded-lg",
    m: "rounded-full active:rounded-xl",
    l: "rounded-full active:rounded-2xl",
    xl: "rounded-full active:rounded-2xl",
  },
  square: {
    xs: "rounded-xl active:rounded-lg",
    s: "rounded-xl active:rounded-lg",
    m: "rounded-2xl active:rounded-xl",
    l: "rounded-[28px] active:rounded-2xl",
    xl: "rounded-[28px] active:rounded-2xl",
  },
} as const;

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "aria-label">,
    VariantProps<typeof iconButtonVariants> {
  /** Render as child element (Radix Slot pattern) */
  asChild?: boolean;
  /** Icon button style */
  variant?: "standard" | "filled" | "filled-tonal" | "outlined";
  /** Container size */
  size?: "xs" | "s" | "m" | "l" | "xl";
  /** Shape: round (circle) or square (rounded square) */
  shape?: "round" | "square";
  /**
   * Material Symbols icon name (shorthand).
   * When provided, renders an Icon internally with the correct proportional size.
   * If `children` is also provided, `children` takes priority.
   */
  icon?: string;
  /**
   * Override the icon size (in px) when using the `icon` shorthand.
   * Defaults to proportional sizing based on container size.
   */
  iconSize?: number;
  /**
   * Whether the icon is filled (when using `icon` shorthand).
   * In toggle mode, this auto-tracks the pressed state.
   */
  iconFilled?: boolean;
  /** Icon weight (when using `icon` shorthand). Default: 400 */
  iconWeight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  /** Enable toggle behavior */
  toggle?: boolean;
  /** Controlled pressed state (used with toggle) */
  pressed?: boolean;
  /** Default pressed state (uncontrolled) */
  defaultPressed?: boolean;
  /** Callback when toggle state changes */
  onPressedChange?: (pressed: boolean) => void;
  /** Remove touch-target padding for dense layouts */
  compact?: boolean;
  /** Required accessible label */
  "aria-label": string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant,
      size,
      shape = "round",
      asChild = false,
      icon,
      iconSize,
      iconFilled,
      iconWeight,
      toggle = false,
      pressed: pressedProp,
      defaultPressed = false,
      onPressedChange,
      compact = false,
      disabled = false,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const resolvedSize = size ?? "s";
    const resolvedVariant = variant ?? "standard";

    // Toggle state management
    const isControlled = pressedProp !== undefined;
    const [internalPressed, setInternalPressed] =
      React.useState(defaultPressed);
    const isPressed = toggle
      ? isControlled
        ? pressedProp
        : internalPressed
      : false;

    // Determine visual variant based on toggle state
    let effectiveVariant = resolvedVariant;
    if (toggle) {
      if (isPressed) {
        effectiveVariant = "filled";
      } else {
        effectiveVariant = "standard";
      }
    }

    // Handle click for toggle
    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (toggle) {
          const newPressed = !isPressed;
          if (!isControlled) {
            setInternalPressed(newPressed);
          }
          onPressedChange?.(newPressed);
        }
        onClick?.(event);
      },
      [toggle, isPressed, isControlled, onPressedChange, onClick]
    );

    // Touch target: need extra padding for xs (32px) and s (40px) to reach 48px
    const needsTouchTarget =
      !compact && (resolvedSize === "xs" || resolvedSize === "s");

    // Shape classes for resting + active morph
    // M3 spec: In toggle mode, selected state inverts the shape (round→square, square→round)
    let effectiveShape = shape;
    if (toggle && isPressed) {
      effectiveShape = shape === "round" ? "square" : "round";
    }
    const shapeClass = shapeClasses[effectiveShape][resolvedSize];

    // Resolve icon content: children take priority over `icon` shorthand
    const resolvedIconSize = iconSize ?? iconSizeMap[resolvedSize];
    const resolvedFilled = iconFilled ?? (toggle ? !!isPressed : false);

    const iconContent = children ?? (
      icon ? (
        <Icon
          name={icon}
          size={resolvedIconSize}
          filled={resolvedFilled}
          weight={iconWeight}
        />
      ) : null
    );

    const button = (
      <Comp
        className={cn(
          iconButtonVariants({ variant: effectiveVariant, size }),
          shapeClass,
          disabled && "opacity-[0.38] pointer-events-none cursor-not-allowed",
          className
        )}
        ref={ref}
        disabled={disabled}
        aria-disabled={disabled ? true : undefined}
        aria-pressed={toggle ? isPressed : undefined}
        tabIndex={disabled ? -1 : undefined}
        onClick={handleClick}
        {...props}
      >
        {iconContent}
      </Comp>
    );

    // Wrap with touch target expander for xs/s sizes (unless compact)
    if (needsTouchTarget) {
      return (
        <span
          className="inline-flex items-center justify-center"
          style={{
            padding: resolvedSize === "xs" ? "8px" : "4px",
          }}
        >
          {button}
        </span>
      );
    }

    return button;
  }
);
IconButton.displayName = "IconButton";

export { IconButton, iconButtonVariants };

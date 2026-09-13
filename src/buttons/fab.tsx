"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

/**
 * Material Design 3 Floating Action Button (FAB)
 *
 * Three M3 sizes (verified against md.comp.fab):
 *   - fab    — 56dp, 24dp icon, corner-large (16dp)      [default]
 *   - medium — 80dp, 28dp icon, corner-large-increased (20dp)
 *   - large  — 96dp, 36dp icon, corner-extra-large (28dp)
 * (The small FAB is deprecated in M3 Expressive.)
 *
 * Colors: tone-container (primary-container default / secondary-container /
 * tertiary-container) and tone (primary / secondary / tertiary). Surface is
 * deprecated. Elevation level 3 at rest, level 4 on hover.
 *
 * For an extended (label + icon) FAB, use the ExtendedFAB component.
 *
 * Positioning is the consumer's responsibility — use className to add
 * fixed/absolute/sticky positioning as needed.
 */

const fabVariants = cva(
  [
    // Layout
    "relative inline-flex items-center justify-center",
    // Cursor & interaction
    "cursor-pointer select-none",
    // Transition for shape morph + elevation
    "transition-[border-radius,box-shadow] duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
    // Focus ring
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
    // Elevation Level 3 at rest, Level 4 on hover
    "shadow-[0_4px_8px_hsl(var(--elevation-3)),0_1px_3px_hsl(var(--elevation-3))]",
    "hover:shadow-[0_6px_12px_hsl(var(--elevation-4)),0_2px_4px_hsl(var(--elevation-4))]",
    // Disabled
    "disabled:opacity-[0.38] disabled:pointer-events-none disabled:cursor-not-allowed disabled:shadow-none disabled:before:opacity-0!",
    // State layer via ::before pseudo-element
    "overflow-hidden",
    "before:absolute before:inset-0 before:rounded-[inherit]",
    "before:bg-current before:opacity-0",
    "before:transition-opacity before:duration-200 before:pointer-events-none",
    // State layer opacities (M3: 8% hover, 10% focus, 10% press)
    "hover:before:opacity-[0.08]",
    "focus-visible:before:opacity-[0.10]",
    "active:before:opacity-[0.10]",
    // Icon sizing defaults
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "[&_.material-symbols-rounded]:pointer-events-none",
  ].join(" "),
  {
    variants: {
      color: {
        // Tone-container styles (default set)
        "primary-container": "bg-primary-container text-primary-container-foreground",
        "secondary-container": "bg-secondary-container text-secondary-container-foreground",
        "tertiary-container": "bg-tertiary-container text-tertiary-container-foreground",
        // Tone styles (M3 Expressive additions)
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        tertiary: "bg-tertiary text-tertiary-foreground",
        // Deprecated in M3 Expressive — kept for back-compat
        surface: "bg-surface-container-high text-primary",
      },
      size: {
        // fab 56dp / medium 80dp / large 96dp
        fab: "size-14 [&_svg]:size-6",
        medium: "size-20 [&_svg]:size-7",
        large: "size-24 [&_svg]:size-9",
      },
    },
    defaultVariants: {
      color: "primary-container",
      size: "fab",
    },
  }
);

/**
 * Shape classes for round and rounded shapes at each size.
 * Resting radii per M3: fab 16dp, medium 20dp, large 28dp.
 * Pressed morph steps the radius down one shape token.
 */
const shapeClasses = {
  rounded: {
    fab: "rounded-2xl active:rounded-xl",
    medium: "rounded-[20px] active:rounded-2xl",
    large: "rounded-[28px] active:rounded-[20px]",
  },
  round: {
    fab: "rounded-full active:rounded-2xl",
    medium: "rounded-full active:rounded-[20px]",
    large: "rounded-full active:rounded-[28px]",
  },
} as const;

/** Icon spinner size per FAB size. */
const spinnerSize = {
  fab: "size-6",
  medium: "size-7",
  large: "size-9",
} as const;

function FABSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export type FABColor =
  | "primary-container"
  | "secondary-container"
  | "tertiary-container"
  | "primary"
  | "secondary"
  | "tertiary"
  | "surface";

export type FABProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof fabVariants>& {
  /** Render as child element (Radix Slot pattern) */
  asChild?: boolean;
  /** Icon to display (React node) */
  icon: React.ReactNode;
  /** Color scheme (default: primary-container). Tone-container + tone options; `surface` is deprecated. */
  color?: FABColor;
  /** Shape variant */
  shape?: "rounded" | "round";
  /** Loading state */
  loading?: boolean;
}

const FAB = React.forwardRef<HTMLButtonElement, FABProps>(
  (
    {
      className,
      color,
      size,
      shape = "rounded",
      asChild = false,
      icon,
      loading = false,
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const resolvedSize = size ?? "fab";

    // Shape classes for resting + active morph
    const shapeClass = shapeClasses[shape][resolvedSize];

    return (
      <Comp
        className={cn(
          fabVariants({ color, size }),
          shapeClass,
          loading && "pointer-events-none",
          className
        )}
        ref={ref}
        disabled={disabled}
        aria-busy={loading ? true : undefined}
        tabIndex={disabled ? -1 : undefined}
        {...props}
      >
        {loading ? <FABSpinner className={spinnerSize[resolvedSize]} /> : icon}
        {children}
      </Comp>
    );
  }
);
FAB.displayName = "FAB";

export { FAB, fabVariants };

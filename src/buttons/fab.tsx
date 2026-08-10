"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

/**
 * Material Design 3 Floating Action Button (FAB)
 *
 * Implements small, medium, large, and extended FAB sizes with
 * primary, secondary, tertiary, and surface color variants.
 * Supports shape morph on press, fixed positioning, loading state,
 * and accessible touch targets.
 *
 * State layers use a ::before pseudo-element with `bg-current` to inherit
 * the text color (which is the on-color for each variant).
 */

const fabVariants = cva(
  [
    // Layout
    "relative inline-flex items-center justify-center",
    // Cursor & interaction
    "cursor-pointer select-none",
    // Transition for shape morph + elevation
    "transition-[border-radius,box-shadow] duration-100 ease-out",
    // Focus ring
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
    // Elevation Level 3 at rest, Level 4 on hover
    "shadow-[0_4px_8px_var(--elevation-3),0_1px_3px_var(--elevation-3)]",
    "hover:shadow-[0_6px_12px_var(--elevation-4),0_2px_4px_var(--elevation-4)]",
    // Disabled
    "disabled:opacity-[0.38] disabled:pointer-events-none disabled:cursor-not-allowed disabled:shadow-none",
    // State layer via ::before pseudo-element
    "overflow-hidden",
    "before:absolute before:inset-0 before:rounded-[inherit]",
    "before:bg-current before:opacity-0",
    "before:transition-opacity before:duration-200 before:pointer-events-none",
    // State layer opacities (M3: 8% hover, 10% focus, 10% press for FABs)
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
        primary: "bg-primary-container text-primary-container-foreground",
        secondary: "bg-secondary-container text-secondary-container-foreground",
        tertiary: "bg-tertiary-container text-tertiary-container-foreground",
        surface: "bg-surface-container-high text-primary",
      },
      size: {
        m: "size-12 [&_svg]:size-6",
        l: "size-14 [&_svg]:size-6",
        xl: "size-24 [&_svg]:size-9",
        extended:
          "h-14 w-auto pl-4 pr-5 gap-2 [&_svg]:size-6",
      },
    },
    defaultVariants: {
      color: "primary",
      size: "l",
    },
  }
);

/**
 * Shape classes for rounded and round shapes at each size.
 * Each entry includes the resting radius and the active (morphed) radius.
 * Morph reduces border-radius by ~20-30% on :active.
 */
const shapeClasses = {
  rounded: {
    m: "rounded-xl active:rounded-lg",
    l: "rounded-2xl active:rounded-xl",
    xl: "rounded-[28px] active:rounded-[20px]",
    extended: "rounded-2xl active:rounded-xl",
  },
  round: {
    m: "rounded-full active:rounded-xl",
    l: "rounded-full active:rounded-2xl",
    xl: "rounded-full active:rounded-[28px]",
    extended: "rounded-full active:rounded-2xl",
  },
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

export interface FABProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof fabVariants> {
  /** Render as child element (Radix Slot pattern) */
  asChild?: boolean;
  /** Icon to display (React node) */
  icon: React.ReactNode;
  /** Label text (required for extended, provides accessible name) */
  label?: string;
  /** Color scheme */
  color?: "primary" | "secondary" | "tertiary" | "surface";
  /** Shape variant */
  shape?: "rounded" | "round";
  /** Fixed positioning (bottom-right) */
  fixed?: boolean;
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
      label,
      fixed = false,
      loading = false,
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const resolvedSize = size ?? "l";

    // Shape classes for resting + active morph
    const shapeClass = shapeClasses[shape][resolvedSize];

    // Fixed positioning classes
    const fixedClasses = fixed
      ? "fixed right-4 bottom-4 z-50 md:bottom-4 max-md:bottom-20"
      : "";

    return (
      <Comp
        className={cn(
          fabVariants({ color, size }),
          shapeClass,
          fixedClasses,
          loading && "pointer-events-none",
          className
        )}
        ref={ref}
        disabled={disabled}
        aria-busy={loading ? true : undefined}
        tabIndex={disabled ? -1 : undefined}
        {...props}
      >
        {loading ? (
          <FABSpinner
            className={resolvedSize === "xl" ? "size-9" : "size-6"}
          />
        ) : (
          icon
        )}
        {resolvedSize === "extended" && label && (
          <span className="text-[14px] font-medium leading-5 tracking-[0.1px]">
            {label}
          </span>
        )}
        {children}
      </Comp>
    );
  }
);
FAB.displayName = "FAB";

export { FAB, fabVariants };

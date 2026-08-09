"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

/**
 * Material Design 3 Extended Floating Action Button
 *
 * Implements Small (56dp), Medium (80dp), and Large (96dp) sizes with
 * Title Medium typography, icon + label content, and 6 color variants.
 * Supports shape morph on press, fixed positioning, loading state,
 * and accessible touch targets.
 *
 * State layers use a ::before pseudo-element with `bg-current` to inherit
 * the text color (which is the on-color for each variant).
 */

const extendedFabVariants = cva(
  [
    // Layout
    "relative inline-flex items-center justify-center",
    // Typography: Label Large (14px / 500 / 20px / 0.1px)
    "text-[14px] font-medium leading-5 tracking-[0.1px]",
    // Cursor & interaction
    "cursor-pointer select-none",
    // Transition for elevation + shape morph
    "transition-[border-radius,box-shadow] duration-100 ease-out",
    // Focus ring
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
    // Elevation Level 3 rest, Level 4 hover
    "shadow-[0_4px_8px_var(--elevation-3),0_1px_3px_var(--elevation-3)]",
    "hover:shadow-[0_6px_12px_var(--elevation-4),0_2px_4px_var(--elevation-4)]",
    // State layer via ::before pseudo-element
    "overflow-hidden",
    "before:absolute before:inset-0 before:rounded-[inherit]",
    "before:bg-current before:opacity-0",
    "before:transition-opacity before:duration-200 before:pointer-events-none",
    // State layer opacities (M3: 8% hover, 10% focus, 10% press)
    "hover:before:opacity-[0.08]",
    "focus-visible:before:opacity-[0.10]",
    "active:before:opacity-[0.10]",
    // Min width
    "min-w-20",
    // Icon sizing: 24dp for all sizes
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-6",
    "[&_.material-symbols-rounded]:pointer-events-none",
    // Disabled
    "disabled:opacity-[0.38] disabled:pointer-events-none disabled:cursor-not-allowed",
  ].join(" "),
  {
    variants: {
      color: {
        primary: "bg-primary-container text-primary-container-foreground",
        secondary: "bg-secondary-container text-secondary-container-foreground",
        tertiary: "bg-tertiary-container text-tertiary-container-foreground",
        "primary-fixed": "bg-primary text-primary-foreground",
        "secondary-fixed": "bg-secondary text-secondary-foreground",
        "tertiary-fixed": "bg-tertiary text-tertiary-foreground",
      },
      size: {
        small: "h-14 px-4 gap-2 rounded-2xl active:rounded-xl",
        medium: "h-20 px-4 gap-2 rounded-2xl active:rounded-xl",
        large: "h-24 px-4 gap-2 rounded-[28px] active:rounded-2xl",
      },
    },
    defaultVariants: {
      color: "primary",
      size: "medium",
    },
  }
);

function ExtendedFABSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin size-6", className)}
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

export interface ExtendedFABProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof extendedFabVariants> {
  /** Render as child element (Radix Slot pattern) */
  asChild?: boolean;
  /** Leading icon (React node) */
  icon: React.ReactNode;
  /** Label text (required, provides accessible name) */
  label: string;
  /** Color scheme */
  color?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "primary-fixed"
    | "secondary-fixed"
    | "tertiary-fixed";
  /** Size */
  size?: "small" | "medium" | "large";
  /** Fixed positioning (bottom-right) */
  fixed?: boolean;
  /** Loading state */
  loading?: boolean;
}

const ExtendedFAB = React.forwardRef<HTMLButtonElement, ExtendedFABProps>(
  (
    {
      className,
      color,
      size,
      asChild = false,
      icon,
      label,
      fixed = false,
      loading = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    // Fixed positioning classes
    const fixedClasses = fixed
      ? "fixed right-4 bottom-4 z-50 md:bottom-4 max-md:bottom-20"
      : "";

    return (
      <Comp
        className={cn(
          extendedFabVariants({ color, size }),
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
        {loading ? <ExtendedFABSpinner /> : icon}
        <span>{label}</span>
      </Comp>
    );
  }
);
ExtendedFAB.displayName = "ExtendedFAB";

export { ExtendedFAB, extendedFabVariants };

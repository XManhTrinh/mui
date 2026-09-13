"use client";

import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

/**
 * Material Design 3 Extended Floating Action Button
 *
 * Implements Small (56dp), Medium (80dp), and Large (96dp) sizes with
 * Title Medium typography, icon + label content, and 6 color variants.
 * Supports shape morph on press, loading state,
 * and accessible touch targets.
 *
 * Positioning is the consumer's responsibility — use className to add
 * fixed/absolute/sticky positioning as needed.
 *
 * State layers use a ::before pseudo-element with `bg-current` to inherit
 * the text color (which is the on-color for each variant).
 */

const extendedFabVariants = cva(
  [
    // Layout
    "relative inline-flex items-center justify-center font-medium",
    // Cursor & interaction
    "cursor-pointer select-none",
    // Transition for elevation + shape morph
    "transition-[border-radius,box-shadow] duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
    // Focus ring
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
    // Elevation Level 3 rest, Level 4 hover
    "shadow-[0_4px_8px_hsl(var(--elevation-3)),0_1px_3px_hsl(var(--elevation-3))]",
    "hover:shadow-[0_6px_12px_hsl(var(--elevation-4)),0_2px_4px_hsl(var(--elevation-4))]",
    // State layer via ::before pseudo-element
    "overflow-hidden",
    "before:absolute before:inset-0 before:rounded-[inherit]",
    "before:bg-current before:opacity-0",
    "before:transition-opacity before:duration-200 before:pointer-events-none",
    // State layer opacities (M3: 8% hover, 10% focus, 10% press)
    "hover:before:opacity-[0.08]",
    "focus-visible:before:opacity-[0.10]",
    "active:before:opacity-[0.10]",
    // Icon defaults (size set per size variant)
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "[&_.material-symbols-rounded]:pointer-events-none",
    // Disabled
    "disabled:opacity-[0.38] disabled:pointer-events-none disabled:cursor-not-allowed disabled:shadow-none disabled:before:opacity-0!",
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
      // Per md.comp.extended-fab: height / label type / icon / shape / leading+trailing / gap
      size: {
        // 56dp · Title Medium · 24 icon · corner-large(16) · 16 pad · 8 gap
        small:
          "h-14 px-4 gap-2 text-[16px] leading-6 tracking-[0.15px] rounded-2xl active:rounded-xl [&_svg]:size-6",
        // 80dp · Title Large · 28 icon · corner-large-increased(20) · 26 pad · 12 gap
        medium:
          "h-20 px-6.5 gap-3 text-[22px] leading-7 tracking-normal rounded-[20px] active:rounded-2xl [&_svg]:size-7",
        // 96dp · Headline Small · 36 icon · corner-extra-large(28) · 28 pad · 16 gap
        large:
          "h-24 px-7 gap-4 text-[24px] leading-8 tracking-normal rounded-[28px] active:rounded-2xl [&_svg]:size-9",
      },
    },
    defaultVariants: {
      color: "primary",
      size: "small",
    },
  }
);

/** Spinner size per extended-FAB size (matches icon size). */
const efabSpinnerSize = {
  small: "size-6",
  medium: "size-7",
  large: "size-9",
} as const;

function ExtendedFABSpinner({ className }: { className?: string }) {
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

export type ExtendedFABProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof extendedFabVariants>& {
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
  /** Loading state */
  loading?: boolean;
  /**
   * The slottable element when `asChild` is set (e.g. an `<a>`). The
   * icon and label are composed inside it. Ignored when `asChild` is false.
   */
  children?: React.ReactNode;
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
      loading = false,
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const resolvedSize = size ?? "small";

    const content = (
      <>
        {loading ? <ExtendedFABSpinner className={efabSpinnerSize[resolvedSize]} /> : icon}
        <span>{label}</span>
      </>
    );

    return (
      <Comp
        className={cn(
          extendedFabVariants({ color, size: resolvedSize }),
          loading && "pointer-events-none",
          // Native `disabled` is ignored when slotted onto a non-button
          // element (e.g. a link), so enforce the affordance in CSS.
          asChild && disabled && "pointer-events-none",
          className
        )}
        ref={ref}
        disabled={asChild ? undefined : disabled}
        aria-disabled={disabled ? true : undefined}
        aria-busy={loading ? true : undefined}
        tabIndex={disabled ? -1 : undefined}
        {...props}
      >
        {asChild ? (
          <>
            {content}
            <Slottable>{children}</Slottable>
          </>
        ) : (
          content
        )}
      </Comp>
    );
  }
);
ExtendedFAB.displayName = "ExtendedFAB";

export { ExtendedFAB, extendedFabVariants };

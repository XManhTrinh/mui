"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

/**
 * Material Design 3 Button
 *
 * Implements all five M3 common button variants with proper state layers,
 * icon support, loading state, and touch targets.
 *
 * State layers use a ::before pseudo-element with `bg-current` to inherit
 * the text color (which is the on-color for each variant).
 */

const buttonVariants = cva(
  [
    // Layout
    "relative inline-flex items-center justify-center whitespace-nowrap",
    // Typography: Label Large
    "text-[14px] font-medium leading-[20px] tracking-[0.1px]",
    // Shape
    "rounded-full",
    // Cursor & interaction
    "cursor-pointer select-none",
    // Transition (M3 standard easing)
    "transition-all duration-200 [transition-timing-function:cubic-bezier(0.2,0,0,1)]",
    // Focus ring
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
    // Disabled
    "disabled:opacity-[0.38] disabled:pointer-events-none",
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
  ].join(" "),
  {
    variants: {
      variant: {
        filled:
          "bg-primary text-primary-foreground hover:shadow-[0_1px_3px_var(--elevation-1)] disabled:shadow-none",
        outlined:
          "bg-transparent border border-outline text-primary disabled:border-[hsl(var(--on-surface)/0.12)]",
        text: "bg-transparent text-primary",
        elevated:
          "bg-surface-container-low text-primary shadow-[0_1px_3px_var(--elevation-1)] hover:shadow-[0_3px_6px_var(--elevation-2)] disabled:shadow-none",
        tonal:
          "bg-secondary-container text-secondary-container-foreground hover:shadow-[0_1px_3px_var(--elevation-1)]",
      },
      size: {
        xs: "h-8 px-3 gap-1.5 [&_svg]:size-5 active:rounded-lg",
        s: "h-10 px-4 gap-2 [&_svg]:size-5 active:rounded-lg",
        m: "h-12 px-6 gap-2 [&_svg]:size-5 active:rounded-xl",
        l: "h-14 px-7 gap-2 [&_svg]:size-5 active:rounded-2xl",
        xl: "h-16 px-8 gap-2 [&_svg]:size-5 active:rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "filled",
      size: "s",
    },
  }
);

// Touch target note: xs (32dp) and s (40dp) are below the 48dp minimum.
// Use adequate spacing between adjacent buttons in dense layouts.

// Asymmetric padding when icon is present (icon-side gets less padding)
const iconPaddingMap = {
  xs: { icon: "pl-2 pr-3", trailing: "pl-3 pr-2" },
  s: { icon: "pl-3 pr-4", trailing: "pl-4 pr-3" },
  m: { icon: "pl-4 pr-6", trailing: "pl-6 pr-4" },
  l: { icon: "pl-5 pr-7", trailing: "pl-7 pr-5" },
  xl: { icon: "pl-6 pr-8", trailing: "pl-8 pr-6" },
} as const;

function ButtonSpinner({ className }: { className?: string }) {
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

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as child element (Radix Slot pattern) */
  asChild?: boolean;
  /** Leading icon (React node, typically <Icon />) */
  icon?: React.ReactNode;
  /** Trailing icon (React node) */
  trailingIcon?: React.ReactNode;
  /** Loading state — shows spinner, disables interaction */
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      icon,
      trailingIcon,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const resolvedSize = size ?? "s";

    // Determine asymmetric padding
    const hasLeadingIcon = loading || !!icon;
    const hasTrailingIcon = !!trailingIcon;

    let paddingOverride = "";
    if (hasLeadingIcon && !hasTrailingIcon) {
      paddingOverride = iconPaddingMap[resolvedSize].icon;
    } else if (hasTrailingIcon && !hasLeadingIcon) {
      paddingOverride = iconPaddingMap[resolvedSize].trailing;
    } else if (hasLeadingIcon && hasTrailingIcon) {
      // Both icons: use icon padding on both sides
      paddingOverride = `${iconPaddingMap[resolvedSize].icon.split(" ")[0]} ${iconPaddingMap[resolvedSize].trailing.split(" ")[1]}`;
    }

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className: undefined }),
          paddingOverride,
          loading && "pointer-events-none",
          className
        )}
        ref={ref}
        disabled={disabled}
        aria-busy={loading ? true : undefined}
        {...props}
      >
        {loading && <ButtonSpinner />}
        {!loading && icon}
        {children}
        {trailingIcon}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

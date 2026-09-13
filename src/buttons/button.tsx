"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";
import {
  buttonBase,
  buttonVariantColors,
  buttonVariantHoverElevation,
} from "./button-primitives";

/**
 * Material Design 3 Button
 *
 * Implements all five M3 common button variants with proper state layers,
 * icon support, loading state, and shape morph on press.
 *
 * Shapes: round (default) or square (pass `square` prop).
 * Sizes (M3 Expressive height scale): xs (32dp), s (40dp, default), m (56dp),
 * l (96dp), xl (136dp). Typography and icon size scale with height:
 * xs/s = Label Large 14 + 20dp icon, m = Title Medium 16 + 24dp icon,
 * l = Headline Small 24 + 32dp icon, xl = Headline Large 32 + 40dp icon.
 */

const buttonVariants = cva(
  [
    // Layout
    "relative inline-flex items-center justify-center whitespace-nowrap",
    // Weight shared; size sets font-size/line-height/tracking (typography scales in Expressive)
    "font-medium",
    // Shared interaction + state layer + focus + transition + icon primitives
    buttonBase,
    // Disabled
    "disabled:opacity-[0.38] disabled:pointer-events-none disabled:cursor-not-allowed disabled:before:opacity-0!",
  ].join(" "),
  {
    variants: {
      variant: {
        filled: cn(buttonVariantColors.filled, buttonVariantHoverElevation.filled),
        outlined: cn(buttonVariantColors.outlined, buttonVariantHoverElevation.outlined),
        text: cn(buttonVariantColors.text, buttonVariantHoverElevation.text),
        elevated: cn(buttonVariantColors.elevated, buttonVariantHoverElevation.elevated),
        tonal: cn(buttonVariantColors.tonal, buttonVariantHoverElevation.tonal),
      },
      // M3 Expressive size scale: heights 32/40/56/96/136dp with typography and
      // icon size scaling up per size (Label Large → Title Medium → Headline).
      size: {
        xs: "h-8 px-3 gap-2 text-[14px] leading-5 tracking-[0.1px] [&_svg]:size-5",
        s: "h-10 px-4 gap-2 text-[14px] leading-5 tracking-[0.1px] [&_svg]:size-5",
        m: "h-14 px-6 gap-2 text-[16px] leading-6 tracking-[0.15px] [&_svg]:size-6",
        l: "h-24 px-12 gap-3 text-[24px] leading-8 tracking-normal [&_svg]:size-8",
        xl: "h-34 px-16 gap-3 text-[32px] leading-10 tracking-normal [&_svg]:size-10",
      },
    },
    defaultVariants: {
      variant: "filled",
      size: "s",
    },
  }
);

/**
 * Shape classes: round uses rounded-full, square uses size-dependent radii.
 * Pressed morph changes radius for both shapes (M3 Expressive shape morph).
 * M3 Expressive square resting corner radii scale with size:
 *   xs=12dp, s=12dp, m=16dp, l=28dp, xl=28dp
 * Round pressed-morph target grows with the (now taller) sizes.
 */
const shapeClasses = {
  round: {
    xs: "rounded-full active:rounded-lg",
    s: "rounded-full active:rounded-lg",
    m: "rounded-full active:rounded-xl",
    l: "rounded-full active:rounded-[28px]",
    xl: "rounded-full active:rounded-[28px]",
  },
  square: {
    xs: "rounded-xl active:rounded-lg",
    s: "rounded-xl active:rounded-lg",
    m: "rounded-2xl active:rounded-xl",
    l: "rounded-[28px] active:rounded-2xl",
    xl: "rounded-[28px] active:rounded-2xl",
  },
} as const;

// Asymmetric padding when icon is present (icon-side gets less padding per M3 spec: -8dp).
// Logical padding (ps = padding-inline-start, pe = padding-inline-end) so leading/
// trailing icon padding mirrors correctly under RTL. Format is always "ps-* pe-*"
// (start first, end second) — the combined leading+trailing case below relies on it.
const iconPaddingMap = {
  xs: { icon: "ps-2 pe-3", trailing: "ps-3 pe-2" },
  s: { icon: "ps-3 pe-4", trailing: "ps-4 pe-3" },
  m: { icon: "ps-4 pe-6", trailing: "ps-6 pe-4" },
  l: { icon: "ps-10 pe-12", trailing: "ps-12 pe-10" },
  xl: { icon: "ps-14 pe-16", trailing: "ps-16 pe-14" },
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

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>& {
  /** Render as child element (Radix Slot pattern) */
  asChild?: boolean;
  /** Use square shape (rounded corners instead of pill) */
  square?: boolean;
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
      square = false,
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
    const shape = square ? "square" : "round";

    // Determine asymmetric padding
    const hasLeadingIcon = loading || !!icon;
    const hasTrailingIcon = !!trailingIcon;

    let paddingOverride = "";
    if (hasLeadingIcon && !hasTrailingIcon) {
      paddingOverride = iconPaddingMap[resolvedSize].icon;
    } else if (hasTrailingIcon && !hasLeadingIcon) {
      paddingOverride = iconPaddingMap[resolvedSize].trailing;
    } else if (hasLeadingIcon && hasTrailingIcon) {
      paddingOverride = `${iconPaddingMap[resolvedSize].icon.split(" ")[0]} ${iconPaddingMap[resolvedSize].trailing.split(" ")[1]}`;
    }

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size }),
          shapeClasses[shape][resolvedSize],
          paddingOverride,
          loading && "pointer-events-none",
          className
        )}
        ref={ref}
        disabled={disabled}
        aria-disabled={disabled ? true : undefined}
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

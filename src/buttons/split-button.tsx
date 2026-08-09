"use client";

import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

/**
 * Material Design 3 Split Button
 *
 * A composite button with a leading action segment and a trailing menu-trigger
 * segment, separated by a 2dp gap. Features independent state layers per segment,
 * inner corner radius morph on hover/focus/press, and trailing icon rotation
 * on menu open.
 *
 * Uses Radix DropdownMenu for the trailing segment's dropdown.
 */

const splitButtonVariants = cva(
  "relative inline-flex items-center gap-[2px]",
  {
    variants: {
      variant: {
        elevated: "",
        filled: "",
        tonal: "",
        outlined: "",
      },
      size: {
        xs: "h-8",
        s: "h-9",
        m: "h-10",
        l: "h-12",
        xl: "h-14",
      },
    },
    defaultVariants: {
      variant: "tonal",
      size: "m",
    },
  }
);

// Inner corner radii per size (rest state)
const innerRadii = {
  xs: "4px",
  s: "4px",
  m: "4px",
  l: "8px",
  xl: "12px",
} as const;

// Trailing icon offsets per size (when closed)
const iconOffsets = {
  xs: -1,
  s: -1,
  m: -2,
  l: -3,
  xl: -6,
} as const;

// Segment color classes per variant
const segmentColors = {
  filled: "bg-primary text-primary-foreground",
  tonal: "bg-secondary-container text-secondary-container-foreground",
  outlined: "bg-transparent border border-outline text-primary",
  elevated:
    "bg-surface-container-low text-primary shadow-[0_1px_3px_var(--elevation-1)]",
} as const;

// Segment hover elevation
const segmentHoverElevation = {
  filled: "hover:shadow-[0_1px_3px_var(--elevation-1)]",
  tonal: "hover:shadow-[0_1px_3px_var(--elevation-1)]",
  outlined: "",
  elevated: "hover:shadow-[0_3px_6px_var(--elevation-2)]",
} as const;

// Height classes per size
const heightClasses = {
  xs: "h-8",
  s: "h-9",
  m: "h-10",
  l: "h-12",
  xl: "h-14",
} as const;

// Padding per size for leading segment
const leadingPadding = {
  xs: "px-3",
  s: "px-4",
  m: "px-6",
  l: "px-7",
  xl: "px-8",
} as const;

// Trailing segment width per size
const trailingWidth = {
  xs: "w-8",
  s: "w-9",
  m: "w-10",
  l: "w-12",
  xl: "w-14",
} as const;

export interface SplitButtonProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof splitButtonVariants> {
  /** Leading button icon */
  icon?: React.ReactNode;
  /** Leading button label */
  label?: React.ReactNode;
  /** Leading button click handler */
  onLeadingClick?: (e: React.MouseEvent) => void;
  /** Menu content (DropdownMenu items) */
  menuContent: React.ReactNode;
  /** Variant */
  variant?: "elevated" | "filled" | "tonal" | "outlined";
  /** Size */
  size?: "xs" | "s" | "m" | "l" | "xl";
  /** Disabled (both segments) */
  disabled?: boolean;
  /** Disabled (leading only) */
  leadingDisabled?: boolean;
  /** Disabled (trailing only) */
  trailingDisabled?: boolean;
  /** Leading segment aria-label */
  "aria-label"?: string;
  /** Additional className */
  className?: string;
}

const SplitButton = React.forwardRef<HTMLDivElement, SplitButtonProps>(
  (
    {
      className,
      variant: variantProp,
      size: sizeProp,
      icon,
      label,
      onLeadingClick,
      menuContent,
      disabled = false,
      leadingDisabled = false,
      trailingDisabled = false,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const [menuOpen, setMenuOpen] = React.useState(false);

    const resolvedVariant = variantProp ?? "tonal";
    const resolvedSize = sizeProp ?? "m";

    const isLeadingDisabled = disabled || leadingDisabled;
    const isTrailingDisabled = disabled || trailingDisabled;

    const innerRadius = innerRadii[resolvedSize];
    const iconOffset = iconOffsets[resolvedSize];

    return (
      <DropdownMenu.Root
        open={menuOpen}
        onOpenChange={(open) => {
          if (!isTrailingDisabled) {
            setMenuOpen(open);
          }
        }}
      >
        <div
          ref={ref}
          className={cn(
            splitButtonVariants({ variant: resolvedVariant, size: resolvedSize }),
            className
          )}
          {...props}
        >
          {/* Leading segment */}
          <button
            type="button"
            className={cn(
              // Base layout
              "relative inline-flex items-center justify-center gap-2",
              "cursor-pointer select-none",
              heightClasses[resolvedSize],
              leadingPadding[resolvedSize],
              // Typography: Label Large
              "text-[14px] font-medium leading-5 tracking-[0.1px]",
              // Colors
              segmentColors[resolvedVariant],
              segmentHoverElevation[resolvedVariant],
              // Outer corners: full pill on left, inner radius on right
              "rounded-l-full",
              // Transition
              "transition-[border-radius,box-shadow] duration-100 ease-out",
              // State layer
              "overflow-hidden",
              "before:absolute before:inset-0 before:rounded-[inherit]",
              "before:bg-current before:opacity-0",
              "before:transition-opacity before:duration-200 before:pointer-events-none",
              "hover:before:opacity-[0.08]",
              "focus-visible:before:opacity-[0.10]",
              "active:before:opacity-[0.10]",
              // Focus ring
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              // Icon sizing
              "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-5",
              "[&_.material-symbols-rounded]:pointer-events-none [&_.material-symbols-rounded]:text-[20px]",
              // Disabled
              isLeadingDisabled && "opacity-[0.38] pointer-events-none cursor-not-allowed"
            )}
            style={{
              borderTopRightRadius: innerRadius,
              borderBottomRightRadius: innerRadius,
            }}
            disabled={isLeadingDisabled}
            tabIndex={isLeadingDisabled ? -1 : undefined}
            aria-label={ariaLabel}
            onClick={onLeadingClick}
            onMouseEnter={(e) => {
              // Morph inner corners toward full round on hover
              const el = e.currentTarget;
              el.style.borderTopRightRadius = "9999px";
              el.style.borderBottomRightRadius = "9999px";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.borderTopRightRadius = innerRadius;
              el.style.borderBottomRightRadius = innerRadius;
            }}
            onFocus={(e) => {
              const el = e.currentTarget;
              el.style.borderTopRightRadius = "9999px";
              el.style.borderBottomRightRadius = "9999px";
            }}
            onBlur={(e) => {
              const el = e.currentTarget;
              el.style.borderTopRightRadius = innerRadius;
              el.style.borderBottomRightRadius = innerRadius;
            }}
          >
            {icon}
            {label && <span>{label}</span>}
          </button>

          {/* Trailing segment (menu trigger) */}
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className={cn(
                // Base layout
                "relative inline-flex items-center justify-center",
                "cursor-pointer select-none",
                heightClasses[resolvedSize],
                trailingWidth[resolvedSize],
                // Colors
                segmentColors[resolvedVariant],
                segmentHoverElevation[resolvedVariant],
                // Outer corners: full pill on right, inner radius on left
                "rounded-r-full",
                // Transition
                "transition-[border-radius,box-shadow] duration-100 ease-out",
                // State layer
                "overflow-hidden",
                "before:absolute before:inset-0 before:rounded-[inherit]",
                "before:bg-current before:opacity-0",
                "before:transition-opacity before:duration-200 before:pointer-events-none",
                "hover:before:opacity-[0.08]",
                "focus-visible:before:opacity-[0.10]",
                "active:before:opacity-[0.10]",
                // Focus ring
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                // Disabled
                isTrailingDisabled && "opacity-[0.38] pointer-events-none cursor-not-allowed"
              )}
              style={{
                borderTopLeftRadius: innerRadius,
                borderBottomLeftRadius: innerRadius,
              }}
              disabled={isTrailingDisabled}
              tabIndex={isTrailingDisabled ? -1 : undefined}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderTopLeftRadius = "9999px";
                el.style.borderBottomLeftRadius = "9999px";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderTopLeftRadius = innerRadius;
                el.style.borderBottomLeftRadius = innerRadius;
              }}
              onFocus={(e) => {
                const el = e.currentTarget;
                el.style.borderTopLeftRadius = "9999px";
                el.style.borderBottomLeftRadius = "9999px";
              }}
              onBlur={(e) => {
                const el = e.currentTarget;
                el.style.borderTopLeftRadius = innerRadius;
                el.style.borderBottomLeftRadius = innerRadius;
              }}
            >
              {/* Chevron down icon with rotation + offset animation */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="pointer-events-none transition-transform duration-200 ease-[cubic-bezier(0.2,0,0,1)]"
                style={{
                  transform: menuOpen
                    ? "translateX(0px) rotate(180deg)"
                    : `translateX(${iconOffset}px) rotate(0deg)`,
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </DropdownMenu.Trigger>
        </div>

        {/* Dropdown menu content */}
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={4}
            className={cn(
              "z-50 min-w-40 rounded-xl p-1",
              "bg-surface-container-high text-surface-foreground",
              "shadow-[0_4px_8px_var(--elevation-3),0_1px_3px_var(--elevation-3)]",
              "m3-animate-menu"
            )}
          >
            {menuContent}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    );
  }
);
SplitButton.displayName = "SplitButton";

export { SplitButton, splitButtonVariants };

"use client";

import * as React from "react";
import { cn } from "./lib/utils";

/**
 * Material Design 3 List
 *
 * M3 Specs (m3.material.io/components/lists/specs):
 * - One-line item height: 56dp (min)
 * - Two-line item height: 72dp
 * - Three-line item height: 88dp
 * - Label left padding: 16dp
 * - Leading element left padding: 16dp
 * - Trailing element right padding: 24dp
 * - Target size: 48dp (min touch target)
 * - Leading icon alignment: Center (top-aligned when ≥88dp)
 *
 * Colors:
 * - Container: surface
 * - Label text: on-surface
 * - Overline/supporting text: on-surface-variant
 * - Trailing text: on-surface-variant
 * - Leading/trailing icon: on-surface-variant
 * - Divider: outline-variant
 * - Selected bg: primary-container
 * - Selected text: on-primary-container
 *
 * States: 8% hover, 10% focus, 10% press
 */

export interface ListProps {
  className?: string;
  children: React.ReactNode;
}

const List = React.forwardRef<HTMLUListElement, ListProps>(
  ({ className, children }, ref) => (
    <ul
      ref={ref}
      role="list"
      className={cn("py-2 bg-surface", className)}
    >
      {children}
    </ul>
  )
);
List.displayName = "List";

export interface ListItemProps {
  /** Leading element (icon, avatar, image, checkbox, radio) */
  leading?: React.ReactNode;
  /** Trailing element (icon, text, switch, checkbox) */
  trailing?: React.ReactNode;
  /** Overline text above label */
  overline?: string;
  /** Primary label text (required) */
  children: React.ReactNode;
  /** Supporting/secondary text */
  supporting?: string;
  /** Number of text lines: determines height (1=56dp, 2=72dp, 3=88dp) */
  lines?: 1 | 2 | 3;
  /** Selected state */
  selected?: boolean;
  /** Disabled */
  disabled?: boolean;
  /** Interactive (adds state layers + cursor) */
  interactive?: boolean;
  /** Click handler */
  onClick?: () => void;
  className?: string;
}

const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  (
    {
      leading,
      trailing,
      overline,
      children,
      supporting,
      lines = 1,
      selected = false,
      disabled = false,
      interactive = false,
      onClick,
      className,
    },
    ref
  ) => {
    const heightClass =
      lines === 3 ? "min-h-[88px]" : lines === 2 ? "min-h-[72px]" : "min-h-[56px]";

    const isThreeLine = lines === 3;

    return (
      <li
        ref={ref}
        role={interactive ? "button" : undefined}
        tabIndex={interactive && !disabled ? 0 : undefined}
        onClick={!disabled ? onClick : undefined}
        onKeyDown={
          interactive && !disabled && onClick
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
        className={cn(
          "flex items-center gap-4 px-4",
          heightClass,
          // Selected state
          selected && "bg-primary-container",
          selected && "[&_.list-label]:text-primary-container-foreground",
          // Interactive states
          interactive && !disabled && "cursor-pointer",
          interactive &&
            !disabled &&
            !selected &&
            "hover:bg-surface-foreground/[0.08] focus-visible:bg-surface-foreground/[0.10] active:bg-surface-foreground/[0.10]",
          interactive &&
            !disabled &&
            selected &&
            "hover:bg-primary-container-foreground/[0.08] focus-visible:bg-primary-container-foreground/[0.10] active:bg-primary-container-foreground/[0.10]",
          // Disabled
          disabled && "opacity-38 pointer-events-none",
          // Transition
          "transition-colors outline-none",
          className
        )}
      >
        {/* Leading element */}
        {leading && (
          <div
            className={cn(
              "shrink-0 flex items-center justify-center text-surface-variant-foreground",
              isThreeLine && "self-start mt-2"
            )}
          >
            {leading}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0 py-2">
          {overline && (
            <p className="text-[11px] leading-4 font-medium tracking-wide uppercase text-surface-variant-foreground truncate">
              {overline}
            </p>
          )}
          <p
            className={cn(
              "list-label text-[16px] leading-6 text-surface-foreground truncate",
              selected && "text-primary-container-foreground"
            )}
          >
            {children}
          </p>
          {supporting && (
            <p
              className={cn(
                "text-[14px] leading-5 text-surface-variant-foreground",
                lines === 3 ? "line-clamp-2" : "truncate"
              )}
            >
              {supporting}
            </p>
          )}
        </div>

        {/* Trailing element */}
        {trailing && (
          <div
            className={cn(
              "shrink-0 flex items-center pr-2 text-surface-variant-foreground",
              isThreeLine && "self-start mt-2"
            )}
          >
            {trailing}
          </div>
        )}
      </li>
    );
  }
);
ListItem.displayName = "ListItem";

export { List, ListItem };

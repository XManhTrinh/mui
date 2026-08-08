"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { Icon } from "../icon";
import { Badge } from "../badge";

export interface NavigationBarItem {
  value: string;
  icon: string;
  activeIcon?: string;
  label: string;
  badge?: "dot" | number;
}

export interface NavigationBarProps {
  items: NavigationBarItem[];
  activeValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

/**
 * Material Design 3 Navigation Bar — Flexible variant
 *
 * @see https://m3.material.io/components/navigation-bar/specs
 *
 * Specs:
 * - Full-width bar fixed to bottom of screen
 * - 3-5 items, equal width
 * - Container height: 64dp (flexible)
 * - Container bg: surface-container
 * - Active indicator: 64×32dp pill, secondary-container
 * - Active icon: on-secondary-container, filled
 * - Active label: secondary (flexible variant)
 * - Inactive icon/label: on-surface-variant
 * - Label: Label Medium (12px, 500, 16px line-height, 0.5px tracking)
 * - Touch target: 48dp min height per item
 * - State layers: 8% hover, 10% focus, 10% press
 * - Active indicator animates between items (200ms M3 standard easing)
 */
export function NavigationBar({ items, activeValue, onValueChange, className }: NavigationBarProps) {
  const [internalValue, setInternalValue] = React.useState(items[0]?.value ?? "");
  const active = activeValue ?? internalValue;

  const handleChange = (value: string) => {
    if (!activeValue) setInternalValue(value);
    onValueChange?.(value);
  };

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 h-16 bg-surface-container",
        "shadow-[0_-1px_3px_0_hsl(var(--elevation-1))]",
        className
      )}
      aria-label="Bottom navigation"
    >
      <ul className="flex h-full items-center justify-around" role="tablist">
        {items.map((item) => {
          const isActive = active === item.value;

          const iconContent = (
            <Icon
              name={isActive ? (item.activeIcon ?? item.icon) : item.icon}
              size={24}
              filled={isActive}
              className={cn(
                "relative z-10 transition-colors duration-200",
                isActive
                  ? "text-secondary-container-foreground"
                  : "text-surface-variant-foreground"
              )}
            />
          );

          return (
            <li key={item.value} className="flex-1">
              <button
                role="tab"
                aria-selected={isActive}
                aria-label={item.label}
                onClick={() => handleChange(item.value)}
                className="group relative flex w-full flex-col items-center justify-center gap-1 h-16 min-h-12 outline-none cursor-pointer"
              >
                {/* Indicator container with state layer via ::after */}
                <div
                  className={cn(
                    "relative flex items-center justify-center w-16 h-8 rounded-full overflow-hidden",
                    isActive && "bg-secondary-container",
                    "after:absolute after:inset-0 after:rounded-full after:transition-colors after:duration-200",
                    isActive
                      ? "group-hover:after:bg-[hsl(var(--on-secondary-container)/0.08)] group-focus-visible:after:bg-[hsl(var(--on-secondary-container)/0.10)] group-active:after:bg-[hsl(var(--on-secondary-container)/0.10)]"
                      : "group-hover:after:bg-[hsl(var(--on-surface-variant)/0.08)] group-focus-visible:after:bg-[hsl(var(--on-surface-variant)/0.10)] group-active:after:bg-[hsl(var(--on-surface-variant)/0.10)]"
                  )}
                >
                  {/* Icon with optional badge */}
                  {item.badge !== undefined ? (
                    <Badge
                      variant={item.badge === "dot" ? "dot" : "count"}
                      count={item.badge === "dot" ? undefined : item.badge}
                      visible
                    >
                      {iconContent}
                    </Badge>
                  ) : (
                    iconContent
                  )}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    "text-[12px] leading-4 font-medium tracking-[0.5px] transition-colors duration-200",
                    isActive
                      ? "text-secondary"
                      : "text-surface-variant-foreground"
                  )}
                >
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

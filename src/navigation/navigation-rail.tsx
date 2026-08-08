"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { Icon } from "../icon";
import { Badge } from "../badge";

export interface NavigationRailItem {
  value: string;
  icon: string;
  activeIcon?: string;
  label: string;
  badge?: "dot" | number;
}

export interface NavigationRailProps {
  variant?: "collapsed" | "expanded";
  items: NavigationRailItem[];
  activeValue?: string;
  onValueChange?: (value: string) => void;
  header?: React.ReactNode;
  showLabels?: boolean;
  className?: string;
}

/**
 * Material Design 3 Navigation Rail
 *
 * @see https://m3.material.io/components/navigation-rail/specs
 *
 * Specs (Collapsed):
 * - Container width: 96dp (collapsed), 360dp (expanded)
 * - Container height: 100%
 * - Container bg: surface-container (optional, can be transparent)
 * - Active indicator: 56×32dp pill (collapsed), full-width - padding (expanded)
 * - Active indicator bg: secondary-container
 * - Active icon: on-secondary-container, filled
 * - Active label (collapsed): secondary
 * - Active label (expanded): on-secondary-container
 * - Inactive icon/label: on-surface-variant
 * - Label (collapsed): Label Medium (12px, 500, 16px, 0.5px tracking)
 * - Label (expanded): Label Large (14px, 500, 20px, 0.1px tracking)
 * - Top padding: 44dp (gap for FAB/menu button header)
 * - Item spacing: 12dp between items
 * - Touch target: 48dp minimum
 * - State layers: 8% hover, 10% focus, 10% press (full rail width target area)
 * - Animation: active indicator (200ms), expanded/collapsed transition (200ms)
 */
export function NavigationRail({
  variant = "collapsed",
  items,
  activeValue,
  onValueChange,
  header,
  showLabels = true,
  className,
}: NavigationRailProps) {
  const [internalValue, setInternalValue] = React.useState(items[0]?.value ?? "");
  const active = activeValue ?? internalValue;

  const handleChange = (value: string) => {
    if (!activeValue) setInternalValue(value);
    onValueChange?.(value);
  };

  const isCollapsed = variant === "collapsed";

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 z-40 flex flex-col items-center bg-surface-container transition-[width] duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
        isCollapsed ? "w-24" : "w-90",
        className
      )}
      aria-label="Main navigation"
    >
      {/* Header slot (FAB or menu button) — 44dp top padding area */}
      <div className="flex items-center justify-center w-full h-11 shrink-0 mt-2">
        {header}
      </div>

      {/* Navigation items */}
      <nav className="flex-1 flex flex-col w-full overflow-y-auto pt-1" aria-label="Navigation rail">
        <ul
          className={cn(
            "flex flex-col gap-3",
            isCollapsed ? "items-center" : "px-3"
          )}
          role="tablist"
          aria-orientation="vertical"
        >
          {items.map((item) => {
            const isActive = active === item.value;

            if (isCollapsed) {
              return (
                <CollapsedRailItem
                  key={item.value}
                  item={item}
                  isActive={isActive}
                  showLabel={showLabels}
                  onSelect={handleChange}
                />
              );
            }

            return (
              <ExpandedRailItem
                key={item.value}
                item={item}
                isActive={isActive}
                onSelect={handleChange}
              />
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

/** Collapsed rail item: vertical icon + optional label, 56×32dp indicator */
function CollapsedRailItem({
  item,
  isActive,
  showLabel,
  onSelect,
}: {
  item: NavigationRailItem;
  isActive: boolean;
  showLabel: boolean;
  onSelect: (value: string) => void;
}) {
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
    <li>
      <button
        role="tab"
        aria-selected={isActive}
        aria-label={item.label}
        onClick={() => onSelect(item.value)}
        className="group relative flex flex-col items-center justify-center gap-1 w-24 min-h-12 py-1 outline-none cursor-pointer"
      >
        {/* Indicator container with state layer via ::after */}
        <div
          className={cn(
            "relative flex items-center justify-center w-14 h-8 rounded-full overflow-hidden",
            // Active indicator background
            isActive && "bg-secondary-container",
            // State layer via ::after pseudo-element
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
        {showLabel && (
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
        )}
      </button>
    </li>
  );
}

/** Expanded rail item: horizontal icon + label, full-width indicator */
function ExpandedRailItem({
  item,
  isActive,
  onSelect,
}: {
  item: NavigationRailItem;
  isActive: boolean;
  onSelect: (value: string) => void;
}) {
  const iconContent = (
    <Icon
      name={isActive ? (item.activeIcon ?? item.icon) : item.icon}
      size={24}
      filled={isActive}
      className="relative z-10 shrink-0"
    />
  );

  return (
    <li>
      <button
        role="tab"
        aria-selected={isActive}
        aria-label={item.label}
        onClick={() => onSelect(item.value)}
        className={cn(
          "group relative flex items-center gap-3 w-full h-14 rounded-full px-4 pr-6 outline-none transition-colors duration-200",
          isActive
            ? "bg-secondary-container text-secondary-container-foreground font-medium"
            : "text-surface-variant-foreground"
        )}
      >
        {/* State layer */}
        <div
          className={cn(
            "absolute inset-0 rounded-full transition-colors duration-200",
            isActive
              ? "group-hover:bg-[hsl(var(--on-secondary-container)/0.08)] group-focus-visible:bg-[hsl(var(--on-secondary-container)/0.10)] group-active:bg-[hsl(var(--on-secondary-container)/0.10)]"
              : "group-hover:bg-[hsl(var(--on-surface-variant)/0.08)] group-focus-visible:bg-[hsl(var(--on-surface-variant)/0.10)] group-active:bg-[hsl(var(--on-surface-variant)/0.10)]"
          )}
        />

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

        {/* Label */}
        <span className="relative z-10 text-[14px] leading-5 font-medium tracking-[0.1px] truncate">
          {item.label}
        </span>
      </button>
    </li>
  );
}

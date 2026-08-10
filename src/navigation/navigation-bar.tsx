"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { Icon } from "../icon";
import { Badge } from "../badge";

// ─── Context ──────────────────────────────────────────────────────────────────

export interface NavigationBarContextValue {
  activeValue: string;
  onSelect: (value: string) => void;
}

const NavigationBarContext = React.createContext<NavigationBarContextValue | null>(null);

export function useNavigationBar() {
  const context = React.useContext(NavigationBarContext);
  if (!context) {
    throw new Error("useNavigationBar must be used within NavigationBar");
  }
  return context;
}

// ─── NavigationBar.Item ───────────────────────────────────────────────────────

export interface NavigationBarItemProps {
  /** Unique value identifying this item */
  value: string;
  /** Material Symbols icon name */
  icon: string;
  /** Filled icon when active */
  activeIcon?: string;
  /** Label text displayed below the icon */
  label: string;
  /** Badge indicator: "dot" for small dot, or a number for count badge */
  badge?: "dot" | number;
  /** Additional classes on the outer wrapper */
  className?: string;
}

/**
 * NavigationBar.Item — Individual navigation item for the composable API.
 *
 * M3 specs:
 * - Active indicator: 64×32dp pill, secondary-container
 * - Icon: 24dp, filled variant when active
 * - Label: 12px, Label Medium, below icon
 * - Badge: dot or count badge on top-right of icon
 * - Touch target: 48dp min height
 */
const NavigationBarItem = React.forwardRef<HTMLButtonElement, NavigationBarItemProps>(
  function NavigationBarItem({ value, icon, activeIcon, label, badge, className }, ref) {
    const { activeValue, onSelect } = useNavigationBar();
    const isActive = activeValue === value;

    const iconContent = (
      <Icon
        name={isActive ? (activeIcon ?? icon) : icon}
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
      <button
        ref={ref}
        role="tab"
        aria-selected={isActive}
        aria-label={label}
        onClick={() => onSelect(value)}
        className={cn(
          "group relative flex w-full flex-col items-center justify-center gap-1 h-16 min-h-12 outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
          className
        )}
      >
        {/* Indicator container */}
        <div className="relative flex items-center justify-center w-16 h-8">
          {/* Active indicator pill — animates from center outward */}
          <div
            className={cn(
              "absolute inset-0 rounded-full bg-secondary-container transition-transform duration-200 ease-[cubic-bezier(0.2,0,0,1)] origin-center",
              isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
            )}
          />
          {/* State layer */}
          <div
            className={cn(
              "absolute inset-0 z-10 rounded-full transition-colors duration-200",
              isActive
                ? "group-hover:bg-[hsl(var(--on-secondary-container)/0.08)] group-focus-visible:bg-[hsl(var(--on-secondary-container)/0.10)] group-active:bg-[hsl(var(--on-secondary-container)/0.10)]"
                : "group-hover:bg-[hsl(var(--on-surface-variant)/0.08)] group-focus-visible:bg-[hsl(var(--on-surface-variant)/0.10)] group-active:bg-[hsl(var(--on-surface-variant)/0.10)]"
            )}
          />
          {/* Icon with optional badge */}
          {badge !== undefined ? (
            <Badge
              variant={badge === "dot" ? "dot" : "count"}
              count={badge === "dot" ? undefined : badge}
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
            "text-[12px] leading-4 font-medium tracking-[0.5px] transition-colors duration-200 truncate max-w-full px-1",
            isActive
              ? "text-secondary"
              : "text-surface-variant-foreground"
          )}
        >
          {label}
        </span>
      </button>
    );
  }
);

// ─── Legacy data-driven item interface ────────────────────────────────────────

export interface NavigationBarItemData {
  value: string;
  icon: string;
  activeIcon?: string;
  label: string;
  badge?: "dot" | number;
}

// ─── NavigationBar Root ───────────────────────────────────────────────────────

export interface NavigationBarProps {
  /** Data-driven items array (legacy API) */
  items?: NavigationBarItemData[];
  /** Controlled active value */
  value?: string;
  /** Uncontrolled default value */
  defaultValue?: string;
  /** Legacy prop alias for controlled value (backward compat) */
  activeValue?: string;
  /** Callback when active value changes */
  onValueChange?: (value: string) => void;
  /** Additional classes */
  className?: string;
  /** Composable NavigationBar.Item children (new API) */
  children?: React.ReactNode;
}

/**
 * Material Design 3 Navigation Bar — Flexible variant
 *
 * Supports two APIs:
 * 1. Legacy data-driven: `<NavigationBar items={[...]} activeValue="home" onValueChange={...} />`
 * 2. Composable: `<NavigationBar value="home" onValueChange={...}><NavigationBar.Item ... /></NavigationBar>`
 *
 * If `items` prop is provided, the legacy path is used. Otherwise composable children are rendered.
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
function NavigationBarRoot({
  items,
  value,
  defaultValue,
  activeValue: activeValueProp,
  onValueChange,
  className,
  children,
}: NavigationBarProps) {
  // Determine controlled value: `value` takes priority, then `activeValue` (legacy alias)
  const controlledValue = value ?? activeValueProp;

  // Uncontrolled internal state
  const [internalValue, setInternalValue] = React.useState(
    defaultValue ?? items?.[0]?.value ?? ""
  );

  const active = controlledValue ?? internalValue;

  const handleSelect = React.useCallback(
    (newValue: string) => {
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [controlledValue, onValueChange]
  );

  // Dual-API detection: if `items` prop is provided, use legacy data-driven path
  if (items) {
    return (
      <nav
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 h-16 bg-surface-container",
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
                  onClick={() => handleSelect(item.value)}
                  className="group relative flex w-full flex-col items-center justify-center gap-1 h-16 min-h-12 outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                >
                  {/* Indicator container */}
                  <div className="relative flex items-center justify-center w-16 h-8">
                    {/* Active indicator pill */}
                    <div
                      className={cn(
                        "absolute inset-0 rounded-full bg-secondary-container transition-transform duration-200 ease-[cubic-bezier(0.2,0,0,1)] origin-center",
                        isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                      )}
                    />
                    {/* State layer */}
                    <div
                      className={cn(
                        "absolute inset-0 z-10 rounded-full transition-colors duration-200",
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
                  </div>

                  {/* Label */}
                  <span
                    className={cn(
                      "text-[12px] leading-4 font-medium tracking-[0.5px] transition-colors duration-200 truncate max-w-full px-1",
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

  // Composable API path: render children within context provider
  const contextValue = React.useMemo<NavigationBarContextValue>(
    () => ({ activeValue: active, onSelect: handleSelect }),
    [active, handleSelect]
  );

  return (
    <NavigationBarContext.Provider value={contextValue}>
      <nav
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 h-16 bg-surface-container",
          "shadow-[0_-1px_3px_0_hsl(var(--elevation-1))]",
          className
        )}
        aria-label="Bottom navigation"
      >
        <div className="flex h-full items-center justify-around" role="tablist">
          {children}
        </div>
      </nav>
    </NavigationBarContext.Provider>
  );
}

// ─── Compound Component Export ────────────────────────────────────────────────

export const NavigationBar = Object.assign(NavigationBarRoot, {
  Item: NavigationBarItem,
});

// Keep backward-compat type export for the data-driven item shape
export type { NavigationBarItemData as NavigationBarItem };

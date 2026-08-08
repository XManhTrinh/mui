"use client";

import * as React from "react";

import { cn } from "./lib/utils";
import { Icon } from "./icon";

/**
 * Material Design 3 Tabs
 *
 * M3 Specs (m3.material.io/components/tabs/specs):
 * Two variants: Primary tabs and Secondary tabs
 *
 * Measurements:
 * - Container height (text only): 48dp
 * - Container height (icon + text): 64dp
 * - Icon size: 24dp
 * - Divider height: 1dp
 * - Primary active indicator height: 3dp
 * - Secondary active indicator height: 2dp
 * - Active indicator shape: 3dp top corners, 0dp bottom
 * - Active indicator min length: 24dp
 * - Padding between icon and text: 8dp
 * - Tabs divided into equal sections
 *
 * Colors:
 * Primary tabs:
 *   Container: surface
 *   Active label: primary
 *   Active indicator: primary
 *   Inactive label: on-surface-variant
 *   Divider: outline-variant
 *   Icon (active): primary
 *   Icon (inactive): on-surface-variant
 *
 * Secondary tabs:
 *   Container: surface
 *   Active label: on-surface
 *   Active indicator: primary
 *   Inactive label: on-surface-variant
 *   Divider: outline-variant
 *
 * States: 8% hover, 10% focus, 10% press
 * Animation: Active indicator slides between tabs (200ms M3 standard easing)
 */

// --- Context ---

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  variant: "primary" | "secondary";
  registerTab: (value: string, element: HTMLButtonElement | null) => void;
  unregisterTab: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("Tab components must be used within <Tabs>");
  return ctx;
}

// --- Tabs (root) ---

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: "primary" | "secondary";
  className?: string;
  children: React.ReactNode;
}

function Tabs({
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  variant = "primary",
  className,
  children,
}: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const tabRefs = React.useRef<Map<string, HTMLButtonElement | null>>(new Map());

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (!isControlled) setInternalValue(newValue);
      onValueChange?.(newValue);
    },
    [isControlled, onValueChange]
  );

  const registerTab = React.useCallback(
    (tabValue: string, element: HTMLButtonElement | null) => {
      tabRefs.current.set(tabValue, element);
    },
    []
  );

  const unregisterTab = React.useCallback((tabValue: string) => {
    tabRefs.current.delete(tabValue);
  }, []);

  const contextValue = React.useMemo(
    () => ({
      value: currentValue,
      onValueChange: handleValueChange,
      variant,
      registerTab,
      unregisterTab,
    }),
    [currentValue, handleValueChange, variant, registerTab, unregisterTab]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn("flex flex-col", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

// --- TabList ---

export interface TabListProps {
  className?: string;
  children: React.ReactNode;
}

function TabList({ className, children }: TabListProps) {
  const { value, variant } = useTabsContext();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = React.useState<{
    left: number;
    width: number;
  }>({ left: 0, width: 0 });

  // Determine if any tab has an icon (for height)
  const hasIcons = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && (child.props as TabProps).icon
  );

  // Update indicator position when active value changes
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const activeTab = container.querySelector(
      `[data-tab-value="${value}"]`
    ) as HTMLElement | null;

    if (activeTab) {
      const containerRect = container.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();
      setIndicatorStyle({
        left: tabRect.left - containerRect.left,
        width: tabRect.width,
      });
    }
  }, [value]);

  const indicatorHeight = variant === "primary" ? 3 : 2;

  return (
    <div
      ref={containerRef}
      role="tablist"
      className={cn(
        "relative flex bg-surface border-b border-outline-variant",
        hasIcons ? "h-16" : "h-12",
        className
      )}
    >
      {children}

      {/* Active indicator — slides between tabs */}
      <span
        className="absolute bottom-0 bg-primary transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)]"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
          height: `${indicatorHeight}px`,
          borderTopLeftRadius: `${indicatorHeight}px`,
          borderTopRightRadius: `${indicatorHeight}px`,
          minWidth: "24px",
        }}
      />
    </div>
  );
}

// --- Tab ---

export interface TabProps {
  value: string;
  icon?: string;
  label: string;
  disabled?: boolean;
  className?: string;
}

function Tab({ value: tabValue, icon, label, disabled = false, className }: TabProps) {
  const { value: activeValue, onValueChange, variant, registerTab, unregisterTab } =
    useTabsContext();
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const isActive = activeValue === tabValue;

  React.useEffect(() => {
    registerTab(tabValue, buttonRef.current);
    return () => unregisterTab(tabValue);
  }, [tabValue, registerTab, unregisterTab]);

  const handleClick = () => {
    if (!disabled) onValueChange(tabValue);
  };

  // Color logic
  const labelColor = isActive
    ? variant === "primary"
      ? "text-primary"
      : "text-surface-foreground"
    : "text-[hsl(var(--on-surface-variant))]";

  const iconColor = isActive
    ? variant === "primary"
      ? "text-primary"
      : "text-surface-foreground"
    : "text-[hsl(var(--on-surface-variant))]";

  return (
    <button
      ref={buttonRef}
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      data-tab-value={tabValue}
      onClick={handleClick}
      className={cn(
        "relative flex-1 flex flex-col items-center justify-center gap-1 min-w-[48px] px-4",
        "select-none transition-colors duration-200",
        "focus-visible:outline-none",
        // Hover state
        !disabled && "hover:bg-[hsl(var(--on-surface)/0.08)]",
        // Disabled
        disabled && "opacity-[0.38] cursor-not-allowed",
        !disabled && "cursor-pointer",
        className
      )}
    >
      {/* State layer for focus/press */}
      <span
        className={cn(
          "absolute inset-0 rounded-none transition-colors duration-200 pointer-events-none",
          !disabled && "active:bg-[hsl(var(--on-surface)/0.10)]"
        )}
      />

      {/* Icon */}
      {icon && (
        <Icon name={icon} size={24} className={cn("relative z-10", iconColor)} />
      )}

      {/* Label */}
      <span
        className={cn(
          "relative z-10 text-sm font-medium leading-5",
          labelColor
        )}
      >
        {label}
      </span>
    </button>
  );
}

// --- TabContent ---

export interface TabContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

function TabContent({ value: contentValue, className, children }: TabContentProps) {
  const { value: activeValue } = useTabsContext();

  if (activeValue !== contentValue) return null;

  return (
    <div
      role="tabpanel"
      className={cn("mt-4 focus-visible:outline-none", className)}
    >
      {children}
    </div>
  );
}

export { Tabs, TabList, Tab, TabContent };

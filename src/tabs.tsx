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
 *
 * Compound API: Tabs / TabList / Tab / TabContent, sharing state via TabsContext.
 * Controlled/uncontrolled via value/defaultValue/onValueChange. TabList implements
 * roving-tabindex keyboard navigation (Arrow/Home/End) and a resize-aware active
 * indicator.
 */

// --- Context ---

type TabsContextValue = {
  value: string;
  onValueChange: (value: string) => void;
  variant: "primary" | "secondary";
  /** When true, tabs use natural width and scroll. When false, tabs divide equally (fixed). */
  scrollable: boolean;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("Tab components must be used within <Tabs>");
  return ctx;
}

// --- Tabs (root) ---

export type TabsProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: "primary" | "secondary";
  /**
   * When true, tabs use their natural width and scroll horizontally.
   * When false (default), tabs divide the container width equally (M3 "fixed" layout).
   */
  scrollable?: boolean;
  className?: string;
  children: React.ReactNode;
}

function Tabs({
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  variant = "primary",
  scrollable = false,
  className,
  children,
}: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (!isControlled) setInternalValue(newValue);
      onValueChange?.(newValue);
    },
    [isControlled, onValueChange]
  );

  const contextValue = React.useMemo(
    () => ({
      value: currentValue,
      onValueChange: handleValueChange,
      variant,
      scrollable,
    }),
    [currentValue, handleValueChange, variant, scrollable]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn("flex flex-col", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

// --- TabList ---

export type TabListProps = {
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

  // Keyboard navigation: ArrowLeft/ArrowRight within TabList
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      if (!container) return;

      const tabs = Array.from(
        container.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])')
      );
      const currentIndex = tabs.indexOf(e.target as HTMLButtonElement);
      if (currentIndex === -1) return;

      let nextIndex: number | null = null;

      if (e.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % tabs.length;
      } else if (e.key === "ArrowLeft") {
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (e.key === "Home") {
        nextIndex = 0;
      } else if (e.key === "End") {
        nextIndex = tabs.length - 1;
      }

      if (nextIndex !== null) {
        e.preventDefault();
        tabs[nextIndex].focus();
        tabs[nextIndex].click();
      }
    },
    []
  );

  // Measure and position the active indicator under the current tab.
  const measureIndicator = React.useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const activeTab = container.querySelector(
      `[data-tab-value="${value}"]`
    ) as HTMLElement | null;
    if (!activeTab) return;

    const containerRect = container.getBoundingClientRect();

    // Primary: indicator spans the label content width; Secondary: full tab.
    const target =
      variant === "primary"
        ? (activeTab.querySelector("[data-tab-label]") as HTMLElement | null) ?? activeTab
        : activeTab;
    const rect = target.getBoundingClientRect();

    setIndicatorStyle({
      left: rect.left - containerRect.left + container.scrollLeft,
      width: rect.width,
    });
  }, [value, variant]);

  // Reposition when the active value/variant changes, and whenever the
  // container or its tabs are resized (responsive layout, font load, etc.).
  React.useEffect(() => {
    measureIndicator();

    const container = containerRef.current;
    if (!container) return;

    // Auto-scroll the active tab into view (e.g. after content swipe)
    const activeTab = container.querySelector(
      `[data-tab-value="${value}"]`
    ) as HTMLElement | null;
    if (activeTab) {
      activeTab.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
    }

    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => measureIndicator());
    observer.observe(container);
    container
      .querySelectorAll("[data-tab-value]")
      .forEach((tab) => observer.observe(tab));

    // Re-measure on scroll so the indicator tracks during horizontal scrolling
    container.addEventListener("scroll", measureIndicator);

    return () => {
      observer.disconnect();
      container.removeEventListener("scroll", measureIndicator);
    };
  }, [measureIndicator]);

  const indicatorHeight = variant === "primary" ? 3 : 2;

  return (
    <div
      ref={containerRef}
      role="tablist"
      onKeyDown={handleKeyDown}
      className={cn(
        "relative flex overflow-x-auto scrollbar-none bg-surface border-b border-outline-variant",
        hasIcons ? "h-16" : "h-12",
        className
      )}
    >
      {children}

      {/* Active indicator — slides between tabs. Hidden until measured so it
          doesn't flash a phantom 24dp stub at the origin before layout. */}
      {indicatorStyle.width > 0 && (
        <span
          className="absolute bottom-0 bg-primary transition-[left,width] duration-200 ease-[cubic-bezier(0.2,0,0,1)]"
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
            height: `${indicatorHeight}px`,
            borderTopLeftRadius: variant === "primary" ? `${indicatorHeight}px` : "0",
            borderTopRightRadius: variant === "primary" ? `${indicatorHeight}px` : "0",
            minWidth: "24px",
          }}
        />
      )}
    </div>
  );
}

// --- Tab ---

export type TabProps = {
  value: string;
  icon?: string;
  label: string;
  disabled?: boolean;
  className?: string;
}

function Tab({ value: tabValue, icon, label, disabled = false, className }: TabProps) {
  const { value: activeValue, onValueChange, variant, scrollable } = useTabsContext();
  const isActive = activeValue === tabValue;

  const handleClick = () => {
    if (!disabled) onValueChange(tabValue);
  };

  // Color logic per variant
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

  // Primary: icon stacked above label (flex-col), Secondary: icon inline (flex-row)
  const layoutDirection = variant === "primary" ? "flex-col" : "flex-row";

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      // Roving tabindex: only the active tab is in the tab order; the rest are
      // reached via arrow keys (handled by TabList).
      tabIndex={isActive ? 0 : -1}
      data-tab-value={tabValue}
      onClick={handleClick}
      className={cn(
        "relative overflow-hidden flex items-center justify-center gap-2 min-w-20 px-4",
        scrollable ? "flex-none" : "flex-1",
        layoutDirection,
        "select-none transition-colors duration-200",
        "focus-visible:outline-none",
        // State layer via before pseudo-element
        "before:absolute before:inset-0 before:bg-current before:opacity-0 before:transition-opacity before:duration-200 before:pointer-events-none",
        // Hover state layer (8%)
        !disabled && "hover:before:opacity-[0.08]",
        // Focus state layer (10%)
        !disabled && "focus-visible:before:opacity-[0.10]",
        // Press state layer (10%)
        !disabled && "active:before:opacity-[0.10]",
        // Disabled
        disabled && "opacity-[0.38] cursor-not-allowed",
        !disabled && "cursor-pointer",
        className
      )}
    >

      {/* Icon */}
      {icon && (
        <Icon name={icon} size={24} className={cn("relative z-10", iconColor)} />
      )}

      {/* Label */}
      <span
        data-tab-label
        className={cn(
          "relative z-10 text-[14px] font-medium leading-5 tracking-[0.1px] truncate",
          labelColor
        )}
      >
        {label}
      </span>
    </button>
  );
}

// --- TabContent ---

export type TabContentProps = {
  value: string;
  className?: string;
  children: React.ReactNode;
}

function TabContent({ value: contentValue, className, children }: TabContentProps) {
  const { value: activeValue, onValueChange } = useTabsContext();
  const panelRef = React.useRef<HTMLDivElement>(null);
  const swipeStart = React.useRef<{ x: number; y: number } | null>(null);

  if (activeValue !== contentValue) return null;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "touch") return;
    swipeStart.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!swipeStart.current) return;
    const dx = e.clientX - swipeStart.current.x;
    const dy = e.clientY - swipeStart.current.y;
    swipeStart.current = null;

    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      // Find the tablist that belongs to the same Tabs container (sibling, not global)
      const panel = panelRef.current;
      const tabsRoot = panel?.closest(".flex.flex-col");
      const tablist = tabsRoot?.querySelector('[role="tablist"]') ?? document.querySelector('[role="tablist"]');
      if (!tablist) return;
      const tabs = Array.from(
        tablist.querySelectorAll<HTMLElement>('[role="tab"][data-tab-value]')
      );
      const values = tabs.map((t) => t.getAttribute("data-tab-value") ?? "");
      const currentIndex = values.indexOf(activeValue);
      if (currentIndex === -1) return;
      const nextIndex = dx < 0
        ? Math.min(currentIndex + 1, values.length - 1)
        : Math.max(currentIndex - 1, 0);
      if (nextIndex !== currentIndex) {
        onValueChange(values[nextIndex]);
      }
    }
  };

  return (
    <div
      ref={panelRef}
      role="tabpanel"
      className={cn("mt-4 focus-visible:outline-none", className)}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {children}
    </div>
  );
}

Tabs.displayName = "Tabs";
TabList.displayName = "TabList";
Tab.displayName = "Tab";
TabContent.displayName = "TabContent";

export { Tabs, TabList, Tab, TabContent };

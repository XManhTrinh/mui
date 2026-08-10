"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { Icon } from "../icon";

// ─── Context ──────────────────────────────────────────────────────────────────

interface NavigationRailContextValue {
  expanded: boolean;
}

const NavigationRailContext = React.createContext<NavigationRailContextValue>({
  expanded: false,
});

export function useNavigationRail() {
  return React.useContext(NavigationRailContext);
}

// ─── NavigationRail (Container) ───────────────────────────────────────────────

export interface NavigationRailProps {
  /** Controlled expanded state */
  expanded?: boolean;
  /** Additional classes */
  className?: string;
  children: React.ReactNode;
}

/**
 * Material Design 3 Navigation Rail (M3 Expressive) — Composable Container
 *
 * Provides the rail shell with animated width transition.
 * Children compose the content freely: headers, items, dividers, footers.
 * Child components use `useNavigationRail()` to read expanded state.
 *
 * @example
 * ```tsx
 * <NavigationRail expanded={expanded}>
 *   <NavigationRail.Header>
 *     <IconButton icon="menu" onClick={toggle} />
 *   </NavigationRail.Header>
 *   <NavigationRail.Content>
 *     <Link href="/home">
 *       <NavigationRail.Item icon="home" label="Home" active />
 *     </Link>
 *   </NavigationRail.Content>
 *   <NavigationRail.Footer>
 *     <IconButton icon="dark_mode" />
 *   </NavigationRail.Footer>
 * </NavigationRail>
 * ```
 */
function NavigationRailRoot({
  expanded = false,
  className,
  children,
}: NavigationRailProps) {
  return (
    <NavigationRailContext.Provider value={{ expanded }}>
      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-surface-container",
          "shadow-[0_4px_8px_var(--elevation-3),0_1px_3px_var(--elevation-3)]",
          "transition-[width] duration-300 ease-[cubic-bezier(0.2,0,0,1)] overflow-hidden",
          expanded ? "w-90" : "w-24",
          className
        )}
        aria-label="Main navigation"
      >
        {children}
      </aside>
    </NavigationRailContext.Provider>
  );
}

// ─── NavigationRail.Header ────────────────────────────────────────────────────

export interface NavigationRailHeaderProps {
  className?: string;
  children: React.ReactNode;
}

function NavigationRailHeader({ className, children }: NavigationRailHeaderProps) {
  return (
    <div className={cn("flex items-center shrink-0 px-3 pt-3 pb-2", className)}>
      {children}
    </div>
  );
}

// ─── NavigationRail.Content ───────────────────────────────────────────────────

export interface NavigationRailContentProps {
  className?: string;
  children: React.ReactNode;
}

function NavigationRailContent({ className, children }: NavigationRailContentProps) {
  return (
    <nav
      className={cn("flex-1 flex flex-col overflow-y-auto overflow-x-hidden py-2 px-3", className)}
      aria-label="Navigation"
    >
      {children}
    </nav>
  );
}

// ─── NavigationRail.Footer ────────────────────────────────────────────────────

export interface NavigationRailFooterProps {
  className?: string;
  children: React.ReactNode;
}

function NavigationRailFooter({ className, children }: NavigationRailFooterProps) {
  return (
    <div className={cn("flex items-center shrink-0 px-3 pb-3 pt-2", className)}>
      {children}
    </div>
  );
}

// ─── NavigationRail.Item ──────────────────────────────────────────────────────

export interface NavigationRailItemProps {
  /** Material Symbols icon name */
  icon: string;
  /** Label text */
  label: string;
  /** Whether this item is currently active */
  active?: boolean;
  /** Filled icon when active */
  activeIcon?: string;
  /** Additional classes on the outer wrapper */
  className?: string;
  /** Click handler (if not wrapped in a Link) */
  onClick?: () => void;
}

/**
 * Navigation Rail Item — morphs between expanded (horizontal pill) and collapsed (icon + label below).
 *
 * The same DOM elements exist in both states. Animation is driven by the rail's expanded context.
 * Wrap in <Link> or <a> for navigation.
 */
function NavigationRailItem({
  icon,
  label,
  active = false,
  activeIcon,
  className,
  onClick,
}: NavigationRailItemProps) {
  const { expanded } = useNavigationRail();

  return (
    <div
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center w-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full",
        className
      )}
    >
      {/* Pill — contains indicator, state layer, icon, mainlabel */}
      <span
        className={cn(
          "relative flex items-center w-full rounded-full overflow-hidden",
          "transition-[height,padding,gap,max-width] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
          expanded
            ? "h-14 px-4 gap-3 max-w-full"
            : "h-8 px-4 gap-0 max-w-14"
        )}
      >
        {/* Active indicator */}
        <span
          className={cn(
            "absolute inset-0 rounded-full bg-secondary-container transition-opacity duration-200",
            active ? "opacity-100" : "opacity-0"
          )}
        />
        {/* State layer */}
        <span
          className={cn(
            "absolute inset-0 rounded-full transition-colors duration-200",
            active
              ? "group-hover:bg-[hsl(var(--on-secondary-container)/0.08)] group-focus-visible:bg-[hsl(var(--on-secondary-container)/0.10)] group-active:bg-[hsl(var(--on-secondary-container)/0.10)]"
              : "group-hover:bg-[hsl(var(--on-surface-variant)/0.08)] group-focus-visible:bg-[hsl(var(--on-surface-variant)/0.10)] group-active:bg-[hsl(var(--on-surface-variant)/0.10)]"
          )}
        />

        {/* Icon */}
        <Icon
          name={active ? (activeIcon ?? icon) : icon}
          size={24}
          filled={active}
          className={cn(
            "relative z-10 shrink-0 transition-colors duration-200",
            active
              ? "text-secondary-container-foreground"
              : "text-surface-variant-foreground"
          )}
        />

        {/* Main label — slides/scales away when collapsing */}
        <span
          className={cn(
            "relative z-10 text-[14px] leading-5 font-medium tracking-[0.1px] whitespace-nowrap overflow-hidden origin-left",
            "transition-[opacity,max-width,transform] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
            expanded
              ? "opacity-100 max-w-48 scale-x-100 translate-x-0"
              : "opacity-0 max-w-0 scale-x-0 -translate-x-3",
            active
              ? "text-secondary-container-foreground"
              : "text-surface-variant-foreground"
          )}
        >
          {label}
        </span>
      </span>

      {/* Second label — below pill, appears from behind icon when collapsed */}
      <span
        className={cn(
          "relative z-10 text-[12px] leading-4 font-medium tracking-[0.5px] truncate text-center self-center overflow-hidden",
          "transition-[opacity,max-height,transform] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
          expanded
            ? "opacity-0 max-h-0 -translate-y-2"
            : "opacity-100 max-h-4 translate-y-0 mt-1",
          active
            ? "text-secondary"
            : "text-surface-variant-foreground"
        )}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Compound Component Export ────────────────────────────────────────────────

export const NavigationRail = Object.assign(NavigationRailRoot, {
  Header: NavigationRailHeader,
  Content: NavigationRailContent,
  Footer: NavigationRailFooter,
  Item: NavigationRailItem,
});

// Re-export types for backward compat
export type { NavigationRailItemProps as NavigationRailItemType };

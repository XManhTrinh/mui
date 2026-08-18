"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { Icon } from "../icon";

// ─── Context ──────────────────────────────────────────────────────────────────

type NavigationRailContextValue = {
  expanded: boolean;
}

const NavigationRailContext = React.createContext<NavigationRailContextValue>({
  expanded: false,
});

export function useNavigationRail() {
  return React.useContext(NavigationRailContext);
}

// ─── NavigationRail (Container) ───────────────────────────────────────────────

export type NavigationRailProps = {
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
          "z-40 flex flex-col bg-surface-container shrink-0",
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

export type NavigationRailHeaderProps = {
  className?: string;
  children: React.ReactNode;
}

function NavigationRailHeader({ className, children }: NavigationRailHeaderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center shrink-0 px-4 pt-1 pb-10 gap-4", className)}>
      {children}
    </div>
  );
}

// ─── NavigationRail.Content ───────────────────────────────────────────────────

export type NavigationRailContentProps = {
  className?: string;
  children: React.ReactNode;
}

function NavigationRailContent({ className, children }: NavigationRailContentProps) {
  const { expanded } = useNavigationRail();

  return (
    <div
      className={cn(
        "flex-1 flex flex-col overflow-y-auto overflow-x-hidden",
        expanded ? "gap-0 px-3" : "gap-1.5 px-0",
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── NavigationRail.Footer ────────────────────────────────────────────────────

export type NavigationRailFooterProps = {
  className?: string;
  children: React.ReactNode;
}

function NavigationRailFooter({ className, children }: NavigationRailFooterProps) {
  return (
    <div className={cn("flex items-center justify-center shrink-0 h-14 px-4", className)}>
      {children}
    </div>
  );
}

// ─── NavigationRail.Item ──────────────────────────────────────────────────────

export type NavigationRailItemProps = {
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
        "group relative flex flex-col items-center justify-center w-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full",
        expanded ? "py-0" : "py-1.5",
        className
      )}
    >
      {/* Pill — contains indicator, state layer, icon, mainlabel */}
      <span
        className={cn(
          "relative flex items-center w-full rounded-full",
          "transition-[height,padding,gap,max-width] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
          expanded
            ? "h-14 px-4 gap-3 max-w-full overflow-hidden"
            : "h-8 px-4 gap-0 max-w-14"
        )}
      >
        {/* Active indicator — scales from center outward */}
        <span
          className={cn(
            "absolute inset-0 rounded-full bg-secondary-container origin-center transition-transform duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
            active ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
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
          "relative z-10 block text-[12px] leading-4 font-medium tracking-[0.5px] truncate text-center overflow-hidden",
          "transition-[opacity,transform,height] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
          expanded
            ? "opacity-0 -translate-y-4 h-0"
            : "opacity-100 translate-y-0 h-4 mt-1",
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

"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "./lib/utils";
import { Icon } from "./icon";

/**
 * Material Design 3 Menu
 *
 * M3 Specs (m3.material.io/components/menus/specs — Baseline variant):
 * - Container width: min 112dp, max 280dp
 * - Corner radius: 4dp
 * - Left/right padding: 12dp
 * - List item height: 48dp
 * - Padding between elements: 12dp
 * - Divider top/bottom padding: 8dp
 * - Divider height: 1dp
 * - Leading/trailing icon size: 24dp
 * - Label alignment: center (vertical), start (horizontal)
 *
 * Colors:
 * - Container: surface-container
 * - Label text: on-surface
 * - Leading/trailing icon: on-surface-variant
 * - Trailing text: on-surface-variant
 * - Selected bg: surface-container-highest
 * - Divider: outline-variant
 * - State layer: on-surface 8% opacity
 *
 * Typography:
 * - Menu item label: Body Large (16px/24px/400/0.5px tracking)
 * - Menu header label: Label Medium (12px/16px/500/0.5px tracking)
 *
 * Animation:
 * - Enter: fade in + scale (150ms, ease-out)
 * - Exit: fade out (75ms, linear)
 */

// ─── Density Context ──────────────────────────────────────────────────────────

/**
 * Menu density. `comfortable` is the M3 baseline (48dp rows, Body Large labels,
 * 24dp icons). `dense` is the M3 high-density treatment for data-heavy UIs
 * (32dp rows, Body Medium labels, 20dp icons) per the Material density system.
 *
 * Set on `<Menu dense>` (or `<MenuSub dense>`); flows to MenuItem, MenuHeader,
 * and MenuSubTrigger via context so consumers don't thread the prop per item.
 */
export type MenuDensity = "comfortable" | "dense";

const MenuDensityContext = React.createContext<MenuDensity>("comfortable");

function useMenuDensity(): MenuDensity {
  return React.useContext(MenuDensityContext);
}

/**
 * Density-dependent class tokens for menu rows (MenuItem / MenuSubTrigger).
 * Comfortable: 48dp / Body Large. Dense: 32dp / Body Medium.
 */
const rowDensityClasses: Record<MenuDensity, string> = {
  comfortable: "h-12 gap-3 text-[16px] leading-6 tracking-[0.5px]",
  dense: "h-8 gap-2.5 text-[14px] leading-5 tracking-[0.25px]",
};

/** Density-dependent icon size (dp) for leading/trailing icons. */
const iconDensitySize: Record<MenuDensity, number> = {
  comfortable: 24,
  dense: 20,
};

// ─── Menu (Root) ──────────────────────────────────────────────────────────────

export type MenuProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom" | "left" | "right";
  /** Dense variant — 32dp rows / Body Medium labels for data-heavy menus */
  dense?: boolean;
  className?: string;
};

/**
 * Menu root component.
 *
 * Not wrapped in forwardRef because the component itself doesn't render a single
 * DOM element that a ref could meaningfully point to — the trigger already accepts
 * its own ref via `asChild`, and the menu content is portalled. Consumers should
 * attach refs directly to the trigger element they pass in.
 */
function Menu({ trigger, children, align = "start", side = "bottom", dense = false, className }: MenuProps) {
  const density: MenuDensity = dense ? "dense" : "comfortable";
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>{trigger}</DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align={align}
          side={side}
          sideOffset={4}
          className={cn(
            "z-50 min-w-28 max-w-70 overflow-hidden rounded-sm bg-surface-container shadow-[0_3px_6px_hsl(var(--elevation-2))]",
            // Dense menus tighten the container's vertical padding to match rows
            dense ? "py-1" : "py-2",
            "m3-animate-menu",
            className
          )}
        >
          <MenuDensityContext.Provider value={density}>
            {children}
          </MenuDensityContext.Provider>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}
Menu.displayName = "Menu";

// ─── MenuItem ─────────────────────────────────────────────────────────────────

export type MenuItemProps = {
  leadingIcon?: string;
  trailingIcon?: string;
  trailingText?: string;
  disabled?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  children: React.ReactNode;
  className?: string;
};

const MenuItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Item>,
  MenuItemProps
>(
  (
    {
      leadingIcon,
      trailingIcon,
      trailingText,
      disabled = false,
      selected = false,
      onSelect,
      children,
      className,
    },
    ref
  ) => {
    const density = useMenuDensity();
    const iconSize = iconDensitySize[density];
    return (
      <DropdownMenuPrimitive.Item
        ref={ref}
        disabled={disabled}
        onSelect={onSelect}
        className={cn(
          "flex items-center px-3 text-surface-foreground cursor-pointer select-none outline-none transition-colors",
          // Density: height, gap, and label typography
          rowDensityClasses[density],
          // State layers
          "focus:bg-[hsl(var(--on-surface)/0.08)] active:bg-[hsl(var(--on-surface)/0.10)]",
          // Selected state
          selected && "bg-surface-container-highest",
          // Disabled
          "data-disabled:pointer-events-none data-disabled:opacity-[0.38] data-disabled:cursor-not-allowed",
          className
        )}
      >
        {leadingIcon && (
          <Icon name={leadingIcon} size={iconSize} className="text-surface-variant-foreground" />
        )}
        <span className="flex-1 truncate">{children}</span>
        {trailingText && (
          <span className="text-[14px] leading-5 tracking-[0.25px] text-surface-variant-foreground">
            {trailingText}
          </span>
        )}
        {trailingIcon && (
          <Icon name={trailingIcon} size={iconSize} className="text-surface-variant-foreground" />
        )}
      </DropdownMenuPrimitive.Item>
    );
  }
);
MenuItem.displayName = "MenuItem";

// ─── MenuHeader ───────────────────────────────────────────────────────────────

export type MenuHeaderProps = {
  children: React.ReactNode;
  className?: string;
};

const MenuHeader = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Label>,
  MenuHeaderProps
>(({ children, className }, ref) => {
  const density = useMenuDensity();
  return (
    <DropdownMenuPrimitive.Label
      ref={ref}
      className={cn(
        "px-3 text-[12px] leading-4 font-medium tracking-[0.5px] text-surface-variant-foreground select-none",
        // Density: tighter vertical padding for dense menus
        density === "dense" ? "pt-2 pb-1" : "pt-3 pb-1.5",
        className
      )}
    >
      {children}
    </DropdownMenuPrimitive.Label>
  );
});
MenuHeader.displayName = "MenuHeader";

// ─── MenuDivider ──────────────────────────────────────────────────────────────

export type MenuDividerProps = {
  className?: string;
};

const MenuDivider = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Separator>,
  MenuDividerProps
>(({ className }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("h-px my-2 bg-outline-variant", className)}
  />
));
MenuDivider.displayName = "MenuDivider";

// ─── MenuSub (Submenu wrapper) ────────────────────────────────────────────────

export type MenuSubProps = {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Override density for this submenu (defaults to inheriting from the parent Menu) */
  dense?: boolean;
};

/**
 * Submenu wrapper — a logical grouping component that delegates to Radix's
 * `DropdownMenu.Sub`. Does not render its own DOM element, so forwardRef
 * is intentionally omitted.
 *
 * Density is inherited from the parent Menu via context. Pass `dense` to
 * override it for this submenu (e.g. a dense submenu inside a comfortable menu).
 */
function MenuSub({ children, open, defaultOpen, onOpenChange, dense }: MenuSubProps) {
  const inherited = useMenuDensity();
  const density: MenuDensity = dense === undefined ? inherited : dense ? "dense" : "comfortable";
  return (
    <DropdownMenuPrimitive.Sub open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <MenuDensityContext.Provider value={density}>{children}</MenuDensityContext.Provider>
    </DropdownMenuPrimitive.Sub>
  );
}
MenuSub.displayName = "MenuSub";

// ─── MenuSubTrigger ───────────────────────────────────────────────────────────

export type MenuSubTriggerProps = {
  leadingIcon?: string;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
};

const MenuSubTrigger = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.SubTrigger>,
  MenuSubTriggerProps
>(({ leadingIcon, disabled = false, children, className }, ref) => {
  const density = useMenuDensity();
  const iconSize = iconDensitySize[density];
  return (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      disabled={disabled}
      className={cn(
        "flex items-center px-3 text-surface-foreground cursor-pointer select-none outline-none transition-colors",
        rowDensityClasses[density],
        "focus:bg-[hsl(var(--on-surface)/0.08)] active:bg-[hsl(var(--on-surface)/0.10)]",
        "data-disabled:pointer-events-none data-disabled:opacity-[0.38] data-disabled:cursor-not-allowed",
        className
      )}
    >
      {leadingIcon && (
        <Icon name={leadingIcon} size={iconSize} className="text-surface-variant-foreground" />
      )}
      <span className="flex-1 truncate">{children}</span>
      <Icon name="chevron_right" size={iconSize} className="text-surface-variant-foreground" />
    </DropdownMenuPrimitive.SubTrigger>
  );
});
MenuSubTrigger.displayName = "MenuSubTrigger";

// ─── MenuSubContent ───────────────────────────────────────────────────────────

export type MenuSubContentProps = {
  children: React.ReactNode;
  className?: string;
};

const MenuSubContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.SubContent>,
  MenuSubContentProps
>(({ children, className }, ref) => {
  const density = useMenuDensity();
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.SubContent
        ref={ref}
        sideOffset={4}
        className={cn(
          "z-50 min-w-28 max-w-70 overflow-hidden rounded-sm bg-surface-container shadow-[0_3px_6px_hsl(var(--elevation-2))]",
          density === "dense" ? "py-1" : "py-2",
          "m3-animate-menu",
          className
        )}
      >
        {children}
      </DropdownMenuPrimitive.SubContent>
    </DropdownMenuPrimitive.Portal>
  );
});
MenuSubContent.displayName = "MenuSubContent";

// ─── Exports ──────────────────────────────────────────────────────────────────

export { Menu, MenuItem, MenuHeader, MenuDivider, MenuSub, MenuSubTrigger, MenuSubContent };

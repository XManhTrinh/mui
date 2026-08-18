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

// ─── Menu (Root) ──────────────────────────────────────────────────────────────

export type MenuProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom" | "left" | "right";
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
function Menu({ trigger, children, align = "start", side = "bottom", className }: MenuProps) {
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>{trigger}</DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align={align}
          side={side}
          sideOffset={4}
          className={cn(
            "z-50 min-w-28 max-w-70 overflow-hidden rounded-sm bg-surface-container py-2 shadow-[0_3px_6px_var(--elevation-2)]",
            "m3-animate-menu",
            className
          )}
        >
          {children}
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
  ) => (
    <DropdownMenuPrimitive.Item
      ref={ref}
      disabled={disabled}
      onSelect={onSelect}
      className={cn(
        "flex items-center gap-3 h-12 px-3 text-[16px] leading-6 tracking-[0.5px] text-surface-foreground cursor-pointer select-none outline-none transition-colors",
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
        <Icon name={leadingIcon} size={24} className="text-surface-variant-foreground" />
      )}
      <span className="flex-1 truncate">{children}</span>
      {trailingText && (
        <span className="text-[14px] leading-5 text-surface-variant-foreground">
          {trailingText}
        </span>
      )}
      {trailingIcon && (
        <Icon name={trailingIcon} size={24} className="text-surface-variant-foreground" />
      )}
    </DropdownMenuPrimitive.Item>
  )
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
>(({ children, className }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-3 pt-3 pb-1.5 text-[12px] leading-4 font-medium tracking-[0.5px] text-surface-variant-foreground select-none",
      className
    )}
  >
    {children}
  </DropdownMenuPrimitive.Label>
));
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
};

/**
 * Submenu wrapper — a logical grouping component that delegates to Radix's
 * `DropdownMenu.Sub`. Does not render its own DOM element, so forwardRef
 * is intentionally omitted.
 */
function MenuSub({ children, open, defaultOpen, onOpenChange }: MenuSubProps) {
  return (
    <DropdownMenuPrimitive.Sub open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {children}
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
>(({ leadingIcon, disabled = false, children, className }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    disabled={disabled}
    className={cn(
      "flex items-center gap-3 h-12 px-3 text-[16px] leading-6 tracking-[0.5px] text-surface-foreground cursor-pointer select-none outline-none transition-colors",
      "focus:bg-[hsl(var(--on-surface)/0.08)] active:bg-[hsl(var(--on-surface)/0.10)]",
      "data-disabled:pointer-events-none data-disabled:opacity-[0.38] data-disabled:cursor-not-allowed",
      className
    )}
  >
    {leadingIcon && (
      <Icon name={leadingIcon} size={24} className="text-surface-variant-foreground" />
    )}
    <span className="flex-1 truncate">{children}</span>
    <Icon name="chevron_right" size={24} className="text-surface-variant-foreground" />
  </DropdownMenuPrimitive.SubTrigger>
));
MenuSubTrigger.displayName = "MenuSubTrigger";

// ─── MenuSubContent ───────────────────────────────────────────────────────────

export type MenuSubContentProps = {
  children: React.ReactNode;
  className?: string;
};

const MenuSubContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.SubContent>,
  MenuSubContentProps
>(({ children, className }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      sideOffset={4}
      className={cn(
        "z-50 min-w-28 max-w-70 overflow-hidden rounded-sm bg-surface-container py-2 shadow-[0_3px_6px_var(--elevation-2)]",
        "m3-animate-menu",
        className
      )}
    >
      {children}
    </DropdownMenuPrimitive.SubContent>
  </DropdownMenuPrimitive.Portal>
));
MenuSubContent.displayName = "MenuSubContent";

// ─── Exports ──────────────────────────────────────────────────────────────────

export { Menu, MenuItem, MenuHeader, MenuDivider, MenuSub, MenuSubTrigger, MenuSubContent };

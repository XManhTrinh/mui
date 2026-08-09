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
 * Animation:
 * - Enter: fade in + scale (150ms, ease-out)
 * - Exit: fade out (75ms, linear)
 */

export interface MenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}

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
            "z-50 min-w-28 max-w-70 overflow-hidden rounded-sm bg-surface-container py-2 shadow-[0_4px_8px_var(--elevation-3),0_1px_3px_var(--elevation-3)]",
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

export interface MenuItemProps {
  leadingIcon?: string;
  trailingIcon?: string;
  trailingText?: string;
  disabled?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  children: React.ReactNode;
  className?: string;
}

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
        "flex items-center gap-3 h-12 px-3 text-[14px] leading-5 text-surface-foreground cursor-pointer select-none outline-none transition-colors",
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

export interface MenuDividerProps {
  className?: string;
}

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

export { Menu, MenuItem, MenuDivider };

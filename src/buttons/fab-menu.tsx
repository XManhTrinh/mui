"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { motion, AnimatePresence } from "motion/react";

import { cn } from "../lib/utils";
import { FAB } from "./fab";

/**
 * Material Design 3 FAB Menu
 *
 * A speed-dial overlay that opens from a FAB to display 2–6 related action
 * items. Features staggered entry/exit animations, keyboard navigation,
 * and full ARIA menu semantics.
 *
 * Uses Radix Popover for portal rendering, focus management, Escape dismiss,
 * and click-outside handling. Framer Motion provides staggered animations.
 *
 * Supports two APIs:
 * 1. Data-driven: Pass an `items` array prop
 * 2. Composable: Use `<FABMenu.Item>` sub-components as children
 */

export type FABMenuItem = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  "aria-label"?: string;
}

export type FABMenuItemComponentProps = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  "aria-label"?: string;
  className?: string;
  children?: React.ReactNode;
}

export type FABMenuProps = {
  items?: FABMenuItem[];
  colorSet?: "primary" | "secondary" | "tertiary";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeLabel?: string;
  triggerIcon: React.ReactNode;
  triggerLabel: string;
  className?: string;
  children?: React.ReactNode;
}

// ─── FABMenu.Item Sub-Component ───────────────────────────────────────────────

const FABMenuItemComponent = React.forwardRef<
  HTMLButtonElement,
  FABMenuItemComponentProps
>(function FABMenuItemComponent(_props, _ref) {
  return null;
});
FABMenuItemComponent.displayName = "FABMenuItemComponent";

// ─── Color Mappings ───────────────────────────────────────────────────────────

const menuItemColors = {
  primary: "bg-surface-container-high text-primary",
  secondary: "bg-surface-container-high text-secondary",
  tertiary: "bg-surface-container-high text-tertiary",
} as const;

// ─── Dual-API Detection ───────────────────────────────────────────────────────

function isValidFABMenuItemChild(
  child: React.ReactNode
): child is React.ReactElement<FABMenuItemComponentProps> {
  return (
    React.isValidElement(child) &&
    (child.type as { displayName?: string })?.displayName ===
      "FABMenuItemComponent"
  );
}

function extractItemsFromChildren(children: React.ReactNode): FABMenuItem[] {
  const items: FABMenuItem[] = [];
  React.Children.forEach(children, (child) => {
    if (isValidFABMenuItemChild(child)) {
      const { icon, label, onClick, "aria-label": ariaLabel } = child.props;
      items.push({ icon, label, onClick, "aria-label": ariaLabel });
    }
  });
  return items;
}

// ─── FABMenu Root Component ───────────────────────────────────────────────────

const FABMenuRoot: React.FC<FABMenuProps> = ({
  items,
  colorSet = "primary",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  closeLabel = "Close menu",
  triggerIcon,
  triggerLabel,
  className,
  children,
}) => {
  const composableItems = React.useMemo(
    () => extractItemsFromChildren(children),
    [children]
  );

  const hasItemsProp = items !== undefined && items.length > 0;
  const resolvedItems: FABMenuItem[] = hasItemsProp ? items! : composableItems;

  // Clamp items to 2-6
  const validItems = React.useMemo(() => {
    if (resolvedItems.length < 2) return [];
    return resolvedItems.slice(0, 6);
  }, [resolvedItems]);

  // Detect reduced motion
  const [reducedMotion, setReducedMotion] = React.useState(false);
  React.useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const staggerDelay = reducedMotion ? 0 : 0.05;
  const animationDuration = reducedMotion ? 0 : 0.2;

  return (
    <PopoverPrimitive.Root
      open={openProp}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <PopoverPrimitive.Trigger asChild>
        <FAB
          size="fab"
          shape="rounded"
          color={`${colorSet}-container`}
          aria-label={triggerLabel}
          icon={triggerIcon}
        />
      </PopoverPrimitive.Trigger>

      <AnimatePresence>
        {(openProp ?? defaultOpen) !== false && (
          <PopoverPrimitive.Portal forceMount>
            <PopoverPrimitive.Content
              side="top"
              sideOffset={8}
              align="center"
              className={cn(
                "z-50 flex flex-col items-center gap-1 outline-none",
                className
              )}
              // Keep the speed-dial menu focused
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <motion.div
                role="menu"
                className="flex flex-col items-center gap-1"
                initial="closed"
                animate="open"
                exit="closed"
                variants={{
                  open: { transition: { staggerChildren: staggerDelay } },
                  closed: {
                    transition: {
                      staggerChildren: staggerDelay,
                      staggerDirection: -1,
                    },
                  },
                }}
              >
                {validItems.map((item, index) => (
                  <motion.button
                    key={index}
                    type="button"
                    role="menuitem"
                    className={cn(
                      "relative h-12 min-w-40 inline-flex items-center gap-3 px-4 rounded-2xl",
                      "cursor-pointer select-none",
                      "text-[14px] font-medium leading-5 tracking-[0.1px]",
                      "overflow-hidden",
                      "before:absolute before:inset-0 before:rounded-[inherit]",
                      "before:bg-current before:opacity-0",
                      "before:transition-opacity before:duration-200 before:pointer-events-none",
                      "hover:before:opacity-[0.08]",
                      "focus-visible:before:opacity-[0.10]",
                      "active:before:opacity-[0.10]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                      "shadow-[0_2px_4px_hsl(var(--elevation-2)),0_1px_2px_hsl(var(--elevation-2))]",
                      "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-6",
                      "[&_.material-symbols-rounded]:pointer-events-none",
                      menuItemColors[colorSet]
                    )}
                    aria-label={item["aria-label"] || undefined}
                    onClick={() => {
                      item.onClick();
                      onOpenChange?.(false);
                    }}
                    variants={{
                      open: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: animationDuration, ease: [0.2, 0, 0, 1] },
                      },
                      closed: {
                        opacity: 0,
                        y: 8,
                        transition: {
                          duration: reducedMotion ? 0 : 0.15,
                          ease: [0.2, 0, 0, 1],
                        },
                      },
                    }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        )}
      </AnimatePresence>
    </PopoverPrimitive.Root>
  );
};

FABMenuRoot.displayName = "FABMenu";

// ─── Compound Component Export ────────────────────────────────────────────────

const FABMenu = Object.assign(FABMenuRoot, {
  Item: FABMenuItemComponent,
});

export { FABMenu, FABMenuItemComponent };

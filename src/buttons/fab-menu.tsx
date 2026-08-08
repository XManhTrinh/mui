"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";

import { cn } from "../lib/utils";

/**
 * Material Design 3 FAB Menu
 *
 * A speed-dial overlay that opens from a FAB to display 2–6 related action
 * items. Features staggered entry/exit animations, focus trapping, keyboard
 * navigation, and full ARIA menu semantics.
 *
 * Uses Framer Motion (motion) for orchestrated animations.
 */

export interface FABMenuItem {
  /** Icon (React node) */
  icon: React.ReactNode;
  /** Label text */
  label: string;
  /** Action callback */
  onClick: () => void;
  /** Optional aria-label override */
  "aria-label"?: string;
}

export interface FABMenuProps {
  /** Menu items (2-6) */
  items: FABMenuItem[];
  /** Color set for close button and items */
  colorSet?: "primary" | "secondary" | "tertiary";
  /** Controlled open state */
  open?: boolean;
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Close button accessible label */
  closeLabel?: string;
  /** The FAB trigger icon */
  triggerIcon: React.ReactNode;
  /** The FAB trigger aria-label */
  triggerLabel: string;
  /** Additional className for the container */
  className?: string;
}

// Color mappings for close button and menu items
const closeButtonColors = {
  primary: "bg-primary-container text-primary-container-foreground",
  secondary: "bg-secondary-container text-secondary-container-foreground",
  tertiary: "bg-tertiary-container text-tertiary-container-foreground",
} as const;

const menuItemColors = {
  primary: "bg-surface-container-high text-primary",
  secondary: "bg-surface-container-high text-secondary",
  tertiary: "bg-surface-container-high text-tertiary",
} as const;

const FABMenu: React.FC<FABMenuProps> = ({
  items,
  colorSet = "primary",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  closeLabel = "Close menu",
  triggerIcon,
  triggerLabel,
  className,
}) => {
  // Controlled / uncontrolled state
  const isControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isOpen = isControlled ? openProp : internalOpen;

  const setOpen = React.useCallback(
    (value: boolean) => {
      if (!isControlled) {
        setInternalOpen(value);
      }
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange]
  );

  // Refs for focus management
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Validate item count (dev-mode)
  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      if (items.length < 2) {
        console.warn(
          "[FABMenu] Expected 2-6 items, received %d. Menu will not render.",
          items.length
        );
      }
      if (items.length > 6) {
        console.warn(
          "[FABMenu] Expected 2-6 items, received %d. Only first 6 will render.",
          items.length
        );
      }
    }
  }, [items.length]);

  // Clamp items to 2-6
  const validItems = React.useMemo(() => {
    if (items.length < 2) return [];
    return items.slice(0, 6);
  }, [items]);

  // Detect reduced motion
  const [reducedMotion, setReducedMotion] = React.useState(false);
  React.useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Focus close button when menu opens
  React.useEffect(() => {
    if (isOpen) {
      // Small delay to allow animation to start
      requestAnimationFrame(() => {
        closeRef.current?.focus();
      });
    }
  }, [isOpen]);

  // Click outside handler
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    // Use mousedown for earlier dismissal
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setOpen]);

  // Keyboard navigation
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return;

      const focusableElements = [
        closeRef.current,
        ...itemRefs.current.filter(Boolean),
      ] as HTMLButtonElement[];

      const currentIndex = focusableElements.indexOf(
        document.activeElement as HTMLButtonElement
      );

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          setOpen(false);
          triggerRef.current?.focus();
          break;
        case "ArrowDown": {
          e.preventDefault();
          const nextIndex =
            currentIndex + 1 < focusableElements.length
              ? currentIndex + 1
              : 0;
          focusableElements[nextIndex]?.focus();
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          const prevIndex =
            currentIndex - 1 >= 0
              ? currentIndex - 1
              : focusableElements.length - 1;
          focusableElements[prevIndex]?.focus();
          break;
        }
      }
    },
    [isOpen, setOpen]
  );

  // Item activation
  const handleItemClick = React.useCallback(
    (item: FABMenuItem) => {
      item.onClick();
      setOpen(false);
      triggerRef.current?.focus();
    },
    [setOpen]
  );

  // Animation variants
  const staggerDelay = reducedMotion ? 0 : 0.05; // 50ms per item
  const animationDuration = reducedMotion ? 0 : 0.2; // 200ms

  return (
    <div ref={containerRef} className={cn("relative inline-flex flex-col items-center", className)}>
      {/* Menu overlay (when open) */}
      <AnimatePresence mode="wait">
        {isOpen && validItems.length > 0 && (
          <motion.div
            role="menu"
            className="flex flex-col items-center gap-1"
            onKeyDown={handleKeyDown}
            initial="closed"
            animate="open"
            exit="closed"
            variants={{
              open: {
                transition: {
                  staggerChildren: staggerDelay,
                },
              },
              closed: {
                transition: {
                  staggerChildren: staggerDelay,
                  staggerDirection: -1,
                },
              },
            }}
          >
            {/* Menu items (appear above close button) */}
            {validItems.map((item, index) => (
              <motion.button
                key={index}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                type="button"
                role="menuitem"
                className={cn(
                  "relative h-12 min-w-[160px] inline-flex items-center gap-3 px-4 rounded-[16px]",
                  "cursor-pointer select-none",
                  "text-[14px] font-medium leading-[20px] tracking-[0.1px]",
                  // State layer
                  "overflow-hidden",
                  "before:absolute before:inset-0 before:rounded-[inherit]",
                  "before:bg-current before:opacity-0",
                  "before:transition-opacity before:duration-200 before:pointer-events-none",
                  "hover:before:opacity-[0.08]",
                  "focus-visible:before:opacity-[0.10]",
                  "active:before:opacity-[0.10]",
                  // Focus ring
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  // Elevation
                  "shadow-[0_2px_4px_var(--elevation-2),0_1px_2px_var(--elevation-1)]",
                  // Icon sizing
                  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-[24px]",
                  "[&_.material-symbols-rounded]:pointer-events-none [&_.material-symbols-rounded]:text-[24px]",
                  menuItemColors[colorSet]
                )}
                aria-label={item["aria-label"] || undefined}
                onClick={() => handleItemClick(item)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleItemClick(item);
                  }
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
                    transition: { duration: reducedMotion ? 0 : 0.15, ease: [0.2, 0, 0, 1] },
                  },
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close button / FAB trigger */}
      {isOpen ? (
        <button
          ref={closeRef}
          type="button"
          className={cn(
            "relative mt-1 h-14 w-14 rounded-full inline-flex items-center justify-center",
            "cursor-pointer select-none",
            // State layer
            "overflow-hidden",
            "before:absolute before:inset-0 before:rounded-[inherit]",
            "before:bg-current before:opacity-0",
            "before:transition-opacity before:duration-200 before:pointer-events-none",
            "hover:before:opacity-[0.08]",
            "focus-visible:before:opacity-[0.10]",
            "active:before:opacity-[0.10]",
            // Focus ring
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            // Elevation
            "shadow-[0_4px_8px_var(--elevation-3),0_1px_3px_var(--elevation-3)]",
            // Icon sizing
            "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-[24px]",
            "[&_.material-symbols-rounded]:pointer-events-none [&_.material-symbols-rounded]:text-[24px]",
            closeButtonColors[colorSet]
          )}
          aria-label={closeLabel}
          onClick={() => {
            setOpen(false);
            triggerRef.current?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              setOpen(false);
              triggerRef.current?.focus();
            }
            // Allow arrow nav to work at container level
            handleKeyDown(e);
          }}
        >
          {/* X close icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          className={cn(
            "relative h-14 w-14 rounded-[16px] inline-flex items-center justify-center",
            "cursor-pointer select-none",
            // Transition for shape morph
            "transition-[border-radius,box-shadow] duration-100 [transition-timing-function:cubic-bezier(0.2,0,0,1)]",
            // State layer
            "overflow-hidden",
            "before:absolute before:inset-0 before:rounded-[inherit]",
            "before:bg-current before:opacity-0",
            "before:transition-opacity before:duration-200 before:pointer-events-none",
            "hover:before:opacity-[0.08]",
            "focus-visible:before:opacity-[0.10]",
            "active:before:opacity-[0.10]",
            // Shape morph on press
            "active:rounded-[12px]",
            // Focus ring
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            // Elevation
            "shadow-[0_4px_8px_var(--elevation-3),0_1px_3px_var(--elevation-3)]",
            "hover:shadow-[0_6px_12px_var(--elevation-4),0_2px_4px_var(--elevation-4)]",
            // Icon sizing
            "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-[24px]",
            "[&_.material-symbols-rounded]:pointer-events-none [&_.material-symbols-rounded]:text-[24px]",
            closeButtonColors[colorSet]
          )}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-label={triggerLabel}
          onClick={() => setOpen(true)}
        >
          {triggerIcon}
        </button>
      )}
    </div>
  );
};

FABMenu.displayName = "FABMenu";

export { FABMenu };

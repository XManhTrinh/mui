"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";

import { cn } from "../lib/utils";
import { Icon } from "../icon";

// ─── Context ──────────────────────────────────────────────────────────────────

export interface SideSheetContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: "standard" | "modal";
  side: "left" | "right";
}

const SideSheetContext = React.createContext<SideSheetContextValue | null>(null);

export function useSideSheet(): SideSheetContextValue {
  const context = React.useContext(SideSheetContext);
  if (!context) {
    throw new Error("useSideSheet must be used within SideSheet");
  }
  return context;
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

// --- SideSheetHeader ---

export interface SideSheetHeaderProps {
  /** Title text for the header */
  headline?: string;
  /** Whether to show the close button */
  showClose?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const SideSheetHeader = React.forwardRef<
  HTMLDivElement,
  SideSheetHeaderProps
>(function SideSheetHeader({ headline, showClose = true, className, children }, ref) {
  const { onOpenChange } = useSideSheet();

  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-3 px-6 pt-6 pb-3", className)}
    >
      {children ? (
        children
      ) : (
        <>
          {headline ? (
            <h2 className="flex-1 text-[14px] leading-5 font-medium text-[hsl(var(--on-surface-variant))]">
              {headline}
            </h2>
          ) : (
            <div className="flex-1" />
          )}
        </>
      )}

      {showClose && (
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="flex items-center justify-center w-10 h-10 rounded-full cursor-pointer text-[hsl(var(--on-surface-variant))] hover:bg-[hsl(var(--on-surface)/0.08)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Close"
        >
          <Icon name="close" size={24} />
        </button>
      )}
    </div>
  );
});
SideSheetHeader.displayName = "SideSheetHeader";

// --- SideSheetContent ---

export interface SideSheetContentProps {
  className?: string;
  children: React.ReactNode;
}

export const SideSheetContent = React.forwardRef<
  HTMLDivElement,
  SideSheetContentProps
>(function SideSheetContent({ className, children }, ref) {
  return (
    <div ref={ref} className={cn("flex-1 overflow-y-auto px-6", className)}>
      {children}
    </div>
  );
});
SideSheetContent.displayName = "SideSheetContent";

// --- SideSheetActions ---

export interface SideSheetActionsProps {
  className?: string;
  children: React.ReactNode;
}

export const SideSheetActions = React.forwardRef<
  HTMLDivElement,
  SideSheetActionsProps
>(function SideSheetActions({ className, children }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-end gap-2 h-18 px-6 pt-4 pb-6 border-t border-outline-variant",
        className
      )}
    >
      {children}
    </div>
  );
});
SideSheetActions.displayName = "SideSheetActions";

// ─── Dual-API Detection ──────────────────────────────────────────────────────

const COMPOUND_DISPLAY_NAMES = new Set([
  "SideSheetHeader",
  "SideSheetContent",
  "SideSheetActions",
]);

function hasCompoundChildren(children: React.ReactNode): boolean {
  return React.Children.toArray(children).some(
    (child) =>
      React.isValidElement(child) &&
      typeof child.type !== "string" &&
      COMPOUND_DISPLAY_NAMES.has(
        (child.type as { displayName?: string }).displayName ?? ""
      )
  );
}

// ─── SideSheet (Root) ────────────────────────────────────────────────────────

/**
 * Material Design 3 Side Sheet
 *
 * @see https://m3.material.io/components/side-sheets/specs
 *
 * Two variants:
 * - Standard: inline with divider, surface background
 * - Modal: overlay with scrim, surface-container-low background
 *
 * Supports two APIs:
 * - Composable: Use SideSheet.Header, SideSheet.Content, SideSheet.Actions
 * - Legacy: Pass children directly with headline, showClose, actions props
 *
 * Standard anatomy:
 * - Divider (optional), Headline, Container, Close icon button
 * - Container bg: surface
 * - Divider: outline-variant
 * - Max-width: 400dp
 * - Start/end padding: 24dp
 * - Padding between top elements: 12dp
 * - Bottom actions: 72dp height, 16dp top / 24dp bottom padding
 *
 * Modal anatomy:
 * - Back icon (optional), Headline, Container, Close icon, Divider, Actions, Scrim
 * - Container bg: surface-container-low
 * - Scrim: on-surface at 32% opacity
 * - Max-width: 400dp
 * - Same padding specs
 *
 * Animation:
 * - Slides in from specified side (200ms M3 standard easing)
 * - Scrim fades in (150ms)
 * - prefers-reduced-motion: instant
 */
export interface SideSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: "standard" | "modal";
  side?: "left" | "right";
  /** @deprecated Use SideSheet.Header with headline prop instead */
  headline?: string;
  /** @deprecated Use SideSheet.Header with showClose prop instead */
  showClose?: boolean;
  /** @deprecated Use SideSheet.Actions sub-component instead */
  actions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

function SideSheetRoot({
  open,
  onOpenChange,
  variant = "modal",
  side = "right",
  headline,
  showClose = true,
  actions,
  className,
  children,
}: SideSheetProps) {
  const sheetRef = React.useRef<HTMLDivElement>(null);
  const isModal = variant === "modal";
  const isComposable = hasCompoundChildren(children);

  const contextValue = React.useMemo<SideSheetContextValue>(
    () => ({ open, onOpenChange, variant, side }),
    [open, onOpenChange, variant, side]
  );

  // Reduced motion detection for Framer Motion animations
  const [reducedMotion, setReducedMotion] = React.useState(false);
  React.useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Focus trap for modal variant
  React.useEffect(() => {
    if (!open || !isModal) return;

    const sheet = sheetRef.current;
    if (!sheet) return;

    const focusableSelector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const focusableElements =
      sheet.querySelectorAll<HTMLElement>(focusableSelector);
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstFocusable?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onOpenChange(false);
        return;
      }

      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, isModal, onOpenChange]);

  // Close on Escape for standard variant
  React.useEffect(() => {
    if (!open || isModal) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, isModal, onOpenChange]);

  // Slide direction based on side
  const slideFrom = side === "right" ? "100%" : "-100%";

  return (
    <SideSheetContext.Provider value={contextValue}>
      <AnimatePresence>
        {open && (
          <>
            {/* Scrim (modal only) */}
            {isModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.15 }}
                className="fixed inset-0 z-50 bg-[hsl(var(--on-surface)/0.32)]"
                onClick={() => onOpenChange(false)}
                aria-hidden="true"
              />
            )}

            {/* Sheet container */}
            <motion.div
              ref={sheetRef}
              role={isModal ? "dialog" : "complementary"}
              aria-modal={isModal || undefined}
              aria-label={headline || "Side sheet"}
              initial={{ x: reducedMotion ? 0 : slideFrom }}
              animate={{ x: 0 }}
              exit={{ x: reducedMotion ? 0 : slideFrom }}
              transition={{
                type: "tween",
                duration: reducedMotion ? 0 : 0.2,
                ease: [0.2, 0, 0, 1], // M3 standard easing
              }}
              className={cn(
                "fixed top-0 bottom-0 z-50",
                "flex flex-col",
                "w-full max-w-100",
                side === "right" ? "right-0" : "left-0",
                isModal ? "bg-surface-container-low" : "bg-surface",
                // Standard variant divider
                !isModal && side === "right" && "border-l border-outline-variant",
                !isModal && side === "left" && "border-r border-outline-variant",
                className
              )}
            >
              {isComposable ? (
                // Composable layout: render sub-components directly
                children
              ) : (
                // Legacy layout: headline + close + children + actions
                <>
                  {/* Header */}
                  <div className="flex items-center gap-3 px-6 pt-6 pb-3">
                    {headline ? (
                      <h2 className="flex-1 text-[14px] leading-5 font-medium text-[hsl(var(--on-surface-variant))]">
                        {headline}
                      </h2>
                    ) : (
                      <div className="flex-1" />
                    )}

                    {showClose && (
                      <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="flex items-center justify-center w-10 h-10 rounded-full cursor-pointer text-[hsl(var(--on-surface-variant))] hover:bg-[hsl(var(--on-surface)/0.08)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label="Close"
                      >
                        <Icon name="close" size={24} />
                      </button>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto px-6">{children}</div>

                  {/* Actions (bottom bar) */}
                  {actions && (
                    <div className="flex items-center justify-end gap-2 h-18 px-6 pt-4 pb-6 border-t border-outline-variant">
                      {actions}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </SideSheetContext.Provider>
  );
}

// ─── Compound Component Export ────────────────────────────────────────────────

export const SideSheet = Object.assign(SideSheetRoot, {
  Header: SideSheetHeader,
  Content: SideSheetContent,
  Actions: SideSheetActions,
});

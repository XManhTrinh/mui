"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";

import { cn } from "../lib/utils";

// ─── Context ──────────────────────────────────────────────────────────────────

export interface BottomSheetContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: "standard" | "modal";
}

const BottomSheetContext = React.createContext<BottomSheetContextValue | null>(
  null
);

export function useBottomSheet(): BottomSheetContextValue {
  const context = React.useContext(BottomSheetContext);
  if (!context) {
    throw new Error("useBottomSheet must be used within BottomSheet");
  }
  return context;
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

// --- BottomSheetHandle ---

export type BottomSheetHandleProps = {
  className?: string;
}

export const BottomSheetHandle = React.forwardRef<
  HTMLDivElement,
  BottomSheetHandleProps
>(function BottomSheetHandle({ className }, ref) {
  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-center py-5.5", className)}
    >
      <div className="h-1 w-8 rounded-full bg-[hsl(var(--on-surface-variant)/0.4)]" />
    </div>
  );
});
BottomSheetHandle.displayName = "BottomSheetHandle";

// --- BottomSheetHeader ---

export type BottomSheetHeaderProps = {
  className?: string;
  children: React.ReactNode;
}

export const BottomSheetHeader = React.forwardRef<
  HTMLDivElement,
  BottomSheetHeaderProps
>(function BottomSheetHeader({ className, children }, ref) {
  return (
    <div ref={ref} className={cn("px-4 pb-2", className)}>
      {children}
    </div>
  );
});
BottomSheetHeader.displayName = "BottomSheetHeader";

// --- BottomSheetContent ---

export type BottomSheetContentProps = {
  className?: string;
  children: React.ReactNode;
}

export const BottomSheetContent = React.forwardRef<
  HTMLDivElement,
  BottomSheetContentProps
>(function BottomSheetContent({ className, children }, ref) {
  return (
    <div ref={ref} className={cn("overflow-y-auto px-4 pb-4 flex-1", className)}>
      {children}
    </div>
  );
});
BottomSheetContent.displayName = "BottomSheetContent";

// --- BottomSheetActions ---

export type BottomSheetActionsProps = {
  className?: string;
  children: React.ReactNode;
}

export const BottomSheetActions = React.forwardRef<
  HTMLDivElement,
  BottomSheetActionsProps
>(function BottomSheetActions({ className, children }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-end gap-2 px-4 py-4 border-t border-outline-variant",
        className
      )}
    >
      {children}
    </div>
  );
});
BottomSheetActions.displayName = "BottomSheetActions";

// ─── Dual-API Detection ──────────────────────────────────────────────────────

const COMPOUND_DISPLAY_NAMES = new Set([
  "BottomSheetHandle",
  "BottomSheetHeader",
  "BottomSheetContent",
  "BottomSheetActions",
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

// ─── BottomSheet (Root) ──────────────────────────────────────────────────────

/**
 * Material Design 3 Bottom Sheet
 *
 * @see https://m3.material.io/components/bottom-sheets/specs
 *
 * Two variants:
 * - Standard: no scrim, inline content
 * - Modal: above scrim overlay, focus-trapped
 *
 * Supports two APIs:
 * - Composable: Use BottomSheet.Handle, BottomSheet.Header, BottomSheet.Content, BottomSheet.Actions
 * - Legacy: Pass children directly (rendered in a scrollable content area)
 *
 * Anatomy:
 * 1. Container (surface-container-low, 28dp top corners)
 * 2. Drag handle (optional, 32×4dp, centered)
 * 3. Scrim (modal only, on-surface at 32% opacity)
 *
 * Measurements:
 * - Width: full, max 640dp
 * - Top margin: 72dp (compact), 56dp (>640dp)
 * - Corner radius: 28dp top-left/right
 * - Drag handle: 32×4dp, padding 22dp top/bottom
 *
 * Animation:
 * - Open: slide up 200ms M3 standard easing
 * - Close: slide down 150ms
 * - Scrim: fade 150ms
 * - prefers-reduced-motion: instant
 */
export type BottomSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: "standard" | "modal";
  /** @deprecated Use BottomSheet.Handle sub-component instead */
  showDragHandle?: boolean;
  className?: string;
  children: React.ReactNode;
}

function BottomSheetRoot({
  open,
  onOpenChange,
  variant = "modal",
  showDragHandle = true,
  className,
  children,
}: BottomSheetProps) {
  const sheetRef = React.useRef<HTMLDivElement>(null);
  const isModal = variant === "modal";
  const isComposable = hasCompoundChildren(children);

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

  const contextValue = React.useMemo<BottomSheetContextValue>(
    () => ({ open, onOpenChange, variant }),
    [open, onOpenChange, variant]
  );

  return (
    <BottomSheetContext.Provider value={contextValue}>
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
              role={isModal ? "dialog" : undefined}
              aria-modal={isModal || undefined}
              initial={{ y: reducedMotion ? 0 : "100%" }}
              animate={{ y: 0 }}
              exit={{ y: reducedMotion ? 0 : "100%" }}
              transition={{
                type: "tween",
                duration: reducedMotion ? 0 : 0.2,
                ease: [0.2, 0, 0, 1], // M3 standard easing
              }}
              className={cn(
                "fixed bottom-0 left-0 right-0 z-50",
                "mx-0 max-w-160",
                "mt-18",
                "rounded-t-[28px]",
                "bg-surface-container-low",
                "shadow-[0_-4px_16px_var(--elevation-3)]",
                // Responsive: wider viewport adjustments
                "min-[640px]:mx-auto min-[640px]:mt-14",
                isComposable && "flex flex-col",
                className
              )}
            >
              {isComposable ? (
                // Composable layout: render children directly (sub-components)
                children
              ) : (
                // Legacy layout: drag handle + children in content area
                <>
                  {showDragHandle && (
                    <div className="flex items-center justify-center py-5.5">
                      <div className="h-1 w-8 rounded-full bg-[hsl(var(--on-surface-variant)/0.4)]" />
                    </div>
                  )}
                  <div className="overflow-y-auto px-4 pb-4">{children}</div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </BottomSheetContext.Provider>
  );
}

// ─── Compound Component Export ────────────────────────────────────────────────

export const BottomSheet = Object.assign(BottomSheetRoot, {
  Handle: BottomSheetHandle,
  Header: BottomSheetHeader,
  Content: BottomSheetContent,
  Actions: BottomSheetActions,
});

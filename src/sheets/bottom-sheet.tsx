"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react";

import { cn } from "../lib/utils";

// ─── Context ──────────────────────────────────────────────────────────────────

export type BottomSheetContextValue = {
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

export type BottomSheetHandleProps = {
  className?: string;
  /** @internal Pointer handler for drag-to-dismiss (set by BottomSheet root) */
  onPointerDown?: React.PointerEventHandler;
};

export const BottomSheetHandle = React.forwardRef<
  HTMLDivElement,
  BottomSheetHandleProps
>(function BottomSheetHandle({ className, onPointerDown }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center py-5.5 cursor-grab active:cursor-grabbing touch-none",
        className
      )}
      onPointerDown={onPointerDown}
    >
      <div className="h-1 w-8 rounded-full bg-surface-variant-foreground" />
    </div>
  );
});
BottomSheetHandle.displayName = "BottomSheetHandle";

export type BottomSheetHeaderProps = {
  className?: string;
  children: React.ReactNode;
};

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

export type BottomSheetContentProps = {
  className?: string;
  children: React.ReactNode;
};

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

export type BottomSheetActionsProps = {
  className?: string;
  children: React.ReactNode;
};

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

// ─── Sheet Content (shared between modal and standard) ───────────────────────

function SheetBody({
  showDragHandle,
  isComposable,
  onDragHandlePointerDown,
  className,
  children,
}: {
  showDragHandle: boolean;
  isComposable: boolean;
  onDragHandlePointerDown?: React.PointerEventHandler;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-t-[28px] bg-surface-container-low",
        "shadow-[0_-1px_3px_hsl(var(--elevation-1))]",
        isComposable && "flex flex-col",
        className
      )}
    >
      {isComposable ? (
        children
      ) : (
        <>
          {showDragHandle && (
            <div
              className="flex items-center justify-center py-5.5 cursor-grab active:cursor-grabbing touch-none"
              onPointerDown={onDragHandlePointerDown}
            >
              <div className="h-1 w-8 rounded-full bg-surface-variant-foreground" />
            </div>
          )}
          <div className="overflow-y-auto px-4 pb-4">{children}</div>
        </>
      )}
    </div>
  );
}

// ─── BottomSheet (Root) ──────────────────────────────────────────────────────

/**
 * Material Design 3 Bottom Sheet
 *
 * @see https://m3.material.io/components/bottom-sheets/specs
 *
 * Two variants:
 * - Standard: no scrim, inline content, Escape to dismiss
 * - Modal: Radix Dialog overlay with focus trap, scrim, scroll lock,
 *   focus restoration, and click-outside dismiss — all handled by Radix.
 *
 * Supports two APIs:
 * - Composable: BottomSheet.Handle / .Header / .Content / .Actions
 * - Legacy: Pass children directly
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
  const isModal = variant === "modal";
  const isComposable = hasCompoundChildren(children);

  const [reducedMotion, setReducedMotion] = React.useState(false);
  React.useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const contextValue = React.useMemo<BottomSheetContextValue>(
    () => ({ open, onOpenChange, variant }),
    [open, onOpenChange, variant]
  );

  // ── Drag-to-dismiss ─────────────────────────────────────────────
  const dragY = useMotionValue(0);
  const sheetRef = React.useRef<HTMLDivElement>(null);

  // Fade the scrim as the sheet is dragged down
  const scrimOpacity = useTransform(dragY, [0, 300], [1, 0]);

  const handleDragEnd = React.useCallback(
    (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
      const sheetHeight = sheetRef.current?.offsetHeight ?? 400;
      const threshold = sheetHeight * 0.3;
      // Dismiss if dragged far enough or flicked fast enough downward
      if (info.offset.y > threshold || info.velocity.y > 500) {
        onOpenChange(false);
      }
      // Otherwise snap back (motion animate handles this via animate prop)
      dragY.set(0);
    },
    [onOpenChange, dragY]
  );

  // ── Modal variant: Radix Dialog handles focus trap, scroll lock,
  //    focus restoration, Escape dismiss, and click-outside dismiss.
  if (isModal) {
    return (
      <BottomSheetContext.Provider value={contextValue}>
        <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
          <AnimatePresence>
            {open && (
              <DialogPrimitive.Portal forceMount>
                {/* Scrim */}
                <DialogPrimitive.Overlay asChild>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reducedMotion ? 0 : 0.15 }}
                    style={{ opacity: scrimOpacity }}
                    className="fixed inset-0 z-50 bg-[hsl(var(--on-surface)/0.32)]"
                  />
                </DialogPrimitive.Overlay>

                {/* Sheet */}
                <DialogPrimitive.Content asChild>
                  <motion.div
                    ref={sheetRef}
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={{ top: 0, bottom: 0.5 }}
                    onDragEnd={handleDragEnd}
                    style={{ y: dragY }}
                    initial={{ y: reducedMotion ? 0 : "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: reducedMotion ? 0 : "100%" }}
                    transition={{
                      type: "tween",
                      duration: reducedMotion ? 0 : 0.2,
                      ease: [0.2, 0, 0, 1],
                    }}
                    className={cn(
                      "fixed bottom-0 left-0 right-0 z-50",
                      "mx-0 max-w-160 mt-18",
                      "min-[640px]:mx-auto min-[640px]:mt-14",
                      "outline-none touch-none"
                    )}
                  >
                    <SheetBody
                      showDragHandle={showDragHandle}
                      isComposable={isComposable}
                      className={className}
                    >
                      {children}
                    </SheetBody>
                  </motion.div>
                </DialogPrimitive.Content>
              </DialogPrimitive.Portal>
            )}
          </AnimatePresence>
        </DialogPrimitive.Root>
      </BottomSheetContext.Provider>
    );
  }

  // ── Standard variant: no overlay, no focus trap. Just Escape to dismiss.
  React.useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  return (
    <BottomSheetContext.Provider value={contextValue}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: reducedMotion ? 0 : "100%" }}
            animate={{ y: 0 }}
            exit={{ y: reducedMotion ? 0 : "100%" }}
            transition={{
              type: "tween",
              duration: reducedMotion ? 0 : 0.2,
              ease: [0.2, 0, 0, 1],
            }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50",
              "mx-0 max-w-160 mt-18",
              "min-[640px]:mx-auto min-[640px]:mt-14"
            )}
          >
            <SheetBody
              showDragHandle={showDragHandle}
              isComposable={isComposable}
              className={className}
            >
              {children}
            </SheetBody>
          </motion.div>
        )}
      </AnimatePresence>
    </BottomSheetContext.Provider>
  );
}

// ─── Compound Component Export ────────────────────────────────────────────────

BottomSheetRoot.displayName = "BottomSheet";

export const BottomSheet = Object.assign(BottomSheetRoot, {
  Handle: BottomSheetHandle,
  Header: BottomSheetHeader,
  Content: BottomSheetContent,
  Actions: BottomSheetActions,
});

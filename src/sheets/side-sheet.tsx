"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react";

import { cn } from "../lib/utils";
import { Icon } from "../icon";

// ─── Context ──────────────────────────────────────────────────────────────────

export type SideSheetContextValue = {
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

export type SideSheetHeaderProps = {
  headline?: string;
  showClose?: boolean;
  className?: string;
  children?: React.ReactNode;
};

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
            <DialogPrimitive.Title className="flex-1 text-[14px] leading-5 font-medium tracking-[0.1px] text-[hsl(var(--on-surface-variant))]">
              {headline}
            </DialogPrimitive.Title>
          ) : (
            <div className="flex-1" />
          )}
        </>
      )}

      {showClose && (
        <DialogPrimitive.Close asChild>
          <button
            type="button"
            className="flex items-center justify-center w-10 h-10 rounded-full cursor-pointer text-[hsl(var(--on-surface-variant))] hover:bg-[hsl(var(--on-surface)/0.08)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Close"
          >
            <Icon name="close" size={24} />
          </button>
        </DialogPrimitive.Close>
      )}
    </div>
  );
});
SideSheetHeader.displayName = "SideSheetHeader";

export type SideSheetContentProps = {
  className?: string;
  children: React.ReactNode;
};

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

export type SideSheetActionsProps = {
  className?: string;
  children: React.ReactNode;
};

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

// ─── Sheet Visual Content ────────────────────────────────────────────────────

function SheetInner({
  side,
  isModal,
  isComposable,
  headline,
  showClose,
  actions,
  onOpenChange,
  className,
  children,
}: {
  side: "left" | "right";
  isModal: boolean;
  isComposable: boolean;
  headline?: string;
  showClose: boolean;
  actions?: React.ReactNode;
  onOpenChange: (open: boolean) => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col h-full w-full max-w-100",
        isModal ? "bg-surface-container-low" : "bg-surface",
        !isModal && side === "right" && "border-l border-outline-variant",
        !isModal && side === "left" && "border-r border-outline-variant",
        className
      )}
    >
      {isComposable ? (
        children
      ) : (
        <>
          <div className="flex items-center gap-3 px-6 pt-6 pb-3">
            {headline ? (
              <h2 className="flex-1 text-[14px] leading-5 font-medium tracking-[0.1px] text-[hsl(var(--on-surface-variant))]">
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
          <div className="flex-1 overflow-y-auto px-6">{children}</div>
          {actions && (
            <div className="flex items-center justify-end gap-2 h-18 px-6 pt-4 pb-6 border-t border-outline-variant">
              {actions}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── SideSheet (Root) ────────────────────────────────────────────────────────

/**
 * Material Design 3 Side Sheet
 *
 * @see https://m3.material.io/components/side-sheets/specs
 *
 * Modal variant uses Radix Dialog for focus trap, scroll lock, focus
 * restoration, Escape dismiss, and click-outside dismiss.
 * Standard variant is an inline panel with Escape to dismiss.
 */
export type SideSheetProps = {
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

  const slideFrom = side === "right" ? "100%" : "-100%";

  // ── Drag-to-dismiss for modal side sheets ───────────────────────
  const dragX = useMotionValue(0);
  const sheetRef = React.useRef<HTMLDivElement>(null);
  const scrimOpacity = useTransform(
    dragX,
    side === "right" ? [0, 300] : [-300, 0],
    side === "right" ? [1, 0] : [0, 1]
  );

  const handleDragEnd = React.useCallback(
    (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      const sheetWidth = sheetRef.current?.offsetWidth ?? 400;
      const threshold = sheetWidth * 0.3;
      const dismissRight = side === "right" && (info.offset.x > threshold || info.velocity.x > 500);
      const dismissLeft = side === "left" && (info.offset.x < -threshold || info.velocity.x < -500);
      if (dismissRight || dismissLeft) {
        onOpenChange(false);
      }
      dragX.set(0);
    },
    [onOpenChange, dragX, side]
  );

  const contextValue = React.useMemo<SideSheetContextValue>(
    () => ({ open, onOpenChange, variant, side }),
    [open, onOpenChange, variant, side]
  );

  // ── Modal: Radix Dialog handles focus trap, scroll lock, focus restore,
  //    Escape dismiss, click-outside dismiss.
  if (isModal) {
    return (
      <SideSheetContext.Provider value={contextValue}>
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
                <DialogPrimitive.Content
                  asChild
                  aria-label={headline || "Side sheet"}
                >
                  <motion.div
                    ref={sheetRef}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={side === "right" ? { left: 0, right: 0.5 } : { left: 0.5, right: 0 }}
                    onDragEnd={handleDragEnd}
                    style={{ x: dragX }}
                    initial={{ x: reducedMotion ? 0 : slideFrom }}
                    animate={{ x: 0 }}
                    exit={{ x: reducedMotion ? 0 : slideFrom }}
                    transition={{
                      type: "tween",
                      duration: reducedMotion ? 0 : 0.2,
                      ease: [0.2, 0, 0, 1],
                    }}
                    className={cn(
                      "fixed top-0 bottom-0 z-50 outline-none touch-none",
                      side === "right" ? "right-0" : "left-0"
                    )}
                  >
                    <SheetInner
                      side={side}
                      isModal
                      isComposable={isComposable}
                      headline={headline}
                      showClose={showClose}
                      actions={actions}
                      onOpenChange={onOpenChange}
                      className={className}
                    >
                      {children}
                    </SheetInner>
                  </motion.div>
                </DialogPrimitive.Content>
              </DialogPrimitive.Portal>
            )}
          </AnimatePresence>
        </DialogPrimitive.Root>
      </SideSheetContext.Provider>
    );
  }

  // ── Standard: inline panel, Escape to dismiss only.
  React.useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  return (
    <SideSheetContext.Provider value={contextValue}>
      <AnimatePresence>
        {open && (
          <motion.div
            role="complementary"
            aria-label={headline || "Side sheet"}
            initial={{ x: reducedMotion ? 0 : slideFrom }}
            animate={{ x: 0 }}
            exit={{ x: reducedMotion ? 0 : slideFrom }}
            transition={{
              type: "tween",
              duration: reducedMotion ? 0 : 0.2,
              ease: [0.2, 0, 0, 1],
            }}
            className={cn(
              "fixed top-0 bottom-0 z-50",
              side === "right" ? "right-0" : "left-0"
            )}
          >
            <SheetInner
              side={side}
              isModal={false}
              isComposable={isComposable}
              headline={headline}
              showClose={showClose}
              actions={actions}
              onOpenChange={onOpenChange}
              className={className}
            >
              {children}
            </SheetInner>
          </motion.div>
        )}
      </AnimatePresence>
    </SideSheetContext.Provider>
  );
}

// ─── Compound Component Export ────────────────────────────────────────────────

SideSheetRoot.displayName = "SideSheet";

export const SideSheet = Object.assign(SideSheetRoot, {
  Header: SideSheetHeader,
  Content: SideSheetContent,
  Actions: SideSheetActions,
});

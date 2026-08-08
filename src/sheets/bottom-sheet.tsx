"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";

import { cn } from "../lib/utils";

/**
 * Material Design 3 Bottom Sheet
 *
 * @see https://m3.material.io/components/bottom-sheets/specs
 *
 * Two variants:
 * - Standard: no scrim, inline content
 * - Modal: above scrim overlay, focus-trapped
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

export interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: "standard" | "modal";
  showDragHandle?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function BottomSheet({
  open,
  onOpenChange,
  variant = "modal",
  showDragHandle = true,
  className,
  children,
}: BottomSheetProps) {
  const sheetRef = React.useRef<HTMLDivElement>(null);
  const isModal = variant === "modal";

  // Focus trap for modal variant
  React.useEffect(() => {
    if (!open || !isModal) return;

    const sheet = sheetRef.current;
    if (!sheet) return;

    const focusableSelector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const focusableElements = sheet.querySelectorAll<HTMLElement>(focusableSelector);
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

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Scrim (modal only) */}
          {isModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
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
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "tween",
              duration: 0.2,
              ease: [0.2, 0, 0, 1], // M3 standard easing
            }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50",
              "mx-0 max-w-[640px]",
              "mt-[72px]",
              "rounded-t-[28px]",
              "bg-surface-container-low",
              "shadow-[0_-4px_16px_var(--elevation-3)]",
              // Responsive: wider viewport adjustments
              "min-[640px]:mx-auto min-[640px]:mt-[56px]",
              className
            )}
          >
            {/* Drag handle */}
            {showDragHandle && (
              <div className="flex items-center justify-center py-[22px]">
                <div className="h-1 w-8 rounded-full bg-[hsl(var(--on-surface-variant)/0.4)]" />
              </div>
            )}

            {/* Content */}
            <div className="overflow-y-auto px-4 pb-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

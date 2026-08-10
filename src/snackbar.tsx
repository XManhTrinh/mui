"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./lib/utils";
import { Icon } from "./icon";

/**
 * @m3-audit VERIFIED — SnackbarProvider with imperative show() hook present.
 * Uses context pattern with show(), dismiss(), dismissAll() API.
 * M3 spec compliant: inverse-surface bg, action button, close icon, auto-dismiss timers,
 * aria-live regions (polite/assertive), hover pause behavior. Complete per M3.
 * No gaps found.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SnackbarMessage {
  /** Unique ID (auto-generated if omitted) */
  id?: string;
  /** Supporting text (required) */
  message: string;
  /** Optional action button */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Show close icon button */
  showClose?: boolean;
  /** Duration in ms. Default 6000. 0 = persistent. Action snackbars are persistent by default. */
  duration?: number;
  /** Affects aria-live: "normal" = polite, "urgent" = assertive */
  priority?: "normal" | "urgent";
}

export interface SnackbarProviderProps {
  children: React.ReactNode;
  /** Max visible snackbars at once (M3: 1) */
  maxVisible?: number;
  /** Position on screen */
  position?: "bottom-left" | "bottom-center" | "bottom-right";
}

interface SnackbarContextValue {
  show: (message: SnackbarMessage) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const SnackbarContext = React.createContext<SnackbarContextValue | null>(null);

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSnackbar(): SnackbarContextValue {
  const ctx = React.useContext(SnackbarContext);
  if (!ctx) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return ctx;
}

// ─── ID Generator ─────────────────────────────────────────────────────────────

let idCounter = 0;
function generateId(): string {
  return `snackbar-${++idCounter}-${Date.now()}`;
}

// ─── Individual Snackbar ──────────────────────────────────────────────────────

interface SnackbarItemProps {
  item: SnackbarMessage & { id: string };
  onDismiss: (id: string) => void;
  reducedMotion: boolean;
}

function SnackbarItem({ item, onDismiss, reducedMotion }: SnackbarItemProps) {
  const { id, message, action, showClose, duration, priority = "normal" } = item;

  // Determine effective duration: action snackbars are persistent by default
  const effectiveDuration = duration !== undefined ? duration : action ? 0 : 6000;
  const isPersistent = effectiveDuration === 0;

  const [paused, setPaused] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const remainingRef = React.useRef(effectiveDuration);
  const startTimeRef = React.useRef(Date.now());

  // Auto-dismiss timer with pause/resume on hover
  React.useEffect(() => {
    if (isPersistent) return;

    const startTimer = () => {
      startTimeRef.current = Date.now();
      timerRef.current = setTimeout(() => {
        onDismiss(id);
      }, remainingRef.current);
    };

    if (!paused) {
      startTimer();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [id, isPersistent, paused, onDismiss]);

  const handleMouseEnter = () => {
    if (isPersistent) return;
    setPaused(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      const elapsed = Date.now() - startTimeRef.current;
      remainingRef.current = Math.max(0, remainingRef.current - elapsed);
    }
  };

  const handleMouseLeave = () => {
    if (isPersistent) return;
    setPaused(false);
  };

  const handleAction = () => {
    action?.onClick();
    onDismiss(id);
  };

  const handleClose = () => {
    onDismiss(id);
  };

  const role = priority === "urgent" ? "alert" : "status";
  const ariaLive = priority === "urgent" ? "assertive" : "polite";

  return (
    <motion.div
      layout
      initial={{ y: reducedMotion ? 0 : "100%", opacity: reducedMotion ? 1 : 0 }}
      animate={{ y: 0, opacity: 1, transition: { duration: reducedMotion ? 0 : 0.2, ease: [0.2, 0, 0, 1] } }}
      exit={{ opacity: 0, transition: { duration: reducedMotion ? 0 : 0.15, ease: [0.4, 0, 1, 1] } }}
      transition={{ duration: reducedMotion ? 0 : 0.2, ease: [0.2, 0, 0, 1] }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role={role}
      aria-live={ariaLive}
      className={cn(
        "flex items-center min-h-12 gap-2 rounded-sm",
        "bg-inverse-surface text-inverse-on-surface",
        "shadow-[0_3px_5px_-1px_hsl(var(--elevation-3)),0_6px_10px_0_hsl(var(--elevation-3)),0_1px_18px_0_hsl(var(--elevation-3))]",
        // Padding
        "pl-4 py-3",
        action || showClose ? "pr-2" : "pr-4"
      )}
    >
      {/* Supporting text — Body Medium */}
      <span
        className={cn(
          "flex-1 text-[14px] font-normal leading-5 tracking-[0.25px]",
          "text-inverse-on-surface"
        )}
      >
        {message}
      </span>

      {/* Action button — Label Large */}
      {action && (
        <button
          type="button"
          onClick={handleAction}
          className={cn(
            "shrink-0 text-[14px] font-medium leading-5 tracking-[0.1px]",
            "text-[hsl(var(--inverse-primary,var(--primary)))]",
            "hover:opacity-80 transition-opacity cursor-pointer",
            "px-2 py-1.5 rounded-sm",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--inverse-primary,var(--primary)))]",
            showClose ? "mr-0" : "mr-2"
          )}
        >
          {action.label}
        </button>
      )}

      {/* Close icon button */}
      {showClose && (
        <button
          type="button"
          onClick={handleClose}
          className={cn(
            "shrink-0 flex items-center justify-center w-8 h-8 rounded-full cursor-pointer",
            "text-inverse-on-surface",
            "hover:bg-[hsl(var(--inverse-on-surface)/0.08)] transition-colors",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverse-on-surface",
            "mr-1"
          )}
          aria-label="Close"
        >
          <Icon name="close" size={20} />
        </button>
      )}
    </motion.div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function SnackbarProvider({
  children,
  maxVisible = 1,
  position = "bottom-left",
}: SnackbarProviderProps) {
  const [queue, setQueue] = React.useState<(SnackbarMessage & { id: string })[]>([]);

  // Reduced motion detection for Framer Motion animations
  const [reducedMotion, setReducedMotion] = React.useState(false);
  React.useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const show = React.useCallback((msg: SnackbarMessage): string => {
    const id = msg.id ?? generateId();
    setQueue((prev) => [...prev, { ...msg, id }]);
    return id;
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const dismissAll = React.useCallback(() => {
    setQueue([]);
  }, []);

  const contextValue = React.useMemo(
    () => ({ show, dismiss, dismissAll }),
    [show, dismiss, dismissAll]
  );

  // Only show up to maxVisible items from the front of the queue
  const visible = queue.slice(0, maxVisible);

  const positionClasses = {
    "bottom-left": "items-start left-4",
    "bottom-center": "items-center left-1/2 -translate-x-1/2",
    "bottom-right": "items-end right-4",
  };

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}

      {/* Snackbar container — fixed at bottom */}
      <div
        className={cn(
          "fixed bottom-4 z-70 flex flex-col gap-2 w-full max-w-140 pointer-events-none",
          // Mobile: 16dp margins, centered
          "max-sm:left-4 max-sm:right-4 max-sm:w-[calc(100%-32px)]",
          // Above mobile nav (bottom-20 ~ 80px for nav bar clearance)
          "max-sm:bottom-20",
          // Desktop: position-based
          "sm:" + positionClasses[position]
        )}
      >
        <AnimatePresence mode="sync">
          {visible.map((item) => (
            <div key={item.id} className="pointer-events-auto">
              <SnackbarItem item={item} onDismiss={dismiss} reducedMotion={reducedMotion} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </SnackbarContext.Provider>
  );
}

export type { SnackbarContextValue };

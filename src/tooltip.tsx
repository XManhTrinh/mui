"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "motion/react";

import { cn } from "./lib/utils";

// ─── M3 Expressive Motion Tokens ─────────────────────────────────────────────
//
// Sourced from material-components-android/docs/theming/Motion.md:
//
// Duration:
//   motionDurationShort3 = 150ms (enter — tooltip appearance)
//   motionDurationShort1 = 75ms  (exit  — tooltip dismissal, ~50% of enter)
//
// Easing (Emphasized — the M3 Expressive default for stylized motion):
//   motionEasingEmphasizedDecelerateInterpolator: cubic-bezier(0.05, 0.7, 0.1, 1)
//   motionEasingEmphasizedAccelerateInterpolator: cubic-bezier(0.3, 0, 0.8, 0.15)
//
// Scale (from MDC Web _tooltip.scss):
//   $_animation-scale: 0.8

const ENTER_DURATION_S = 0.15;
const EXIT_DURATION_S = 0.075;
const EMPHASIZED_DECELERATE = [0.05, 0.7, 0.1, 1] as const;
const EMPHASIZED_ACCELERATE = [0.3, 0, 0.8, 0.15] as const;
const SCALE_INITIAL = 0.8;

// ─── M3 Tooltip Spacing Tokens ───────────────────────────────────────────────

/** Gap between trigger and tooltip surface (dp) */
const GAP_PLAIN = 4;
const GAP_RICH = 8;
/** Viewport safety margin for collision detection (dp) */
const VIEWPORT_MARGIN = 8;

// ─── Positioning ─────────────────────────────────────────────────────────────

type Side = "top" | "bottom" | "left" | "right";

const OPPOSITE: Record<Side, Side> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

const TRANSFORM_ORIGIN: Record<Side, string> = {
  top: "bottom center",
  bottom: "top center",
  left: "center right",
  right: "center left",
};

interface Position {
  top: number;
  left: number;
  side: Side;
}

function computePosition(
  anchor: DOMRect,
  tooltip: { width: number; height: number },
  preferred: Side,
  gap: number,
): Position {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const resolve = (s: Side) => {
    const isVertical = s === "top" || s === "bottom";
    return {
      top: isVertical
        ? s === "top"
          ? anchor.top - tooltip.height - gap
          : anchor.bottom + gap
        : anchor.top + anchor.height / 2 - tooltip.height / 2,
      left: isVertical
        ? anchor.left + anchor.width / 2 - tooltip.width / 2
        : s === "left"
          ? anchor.left - tooltip.width - gap
          : anchor.right + gap,
    };
  };

  const fits = (p: { top: number; left: number }) =>
    p.top >= VIEWPORT_MARGIN &&
    p.left >= VIEWPORT_MARGIN &&
    p.top + tooltip.height <= vh - VIEWPORT_MARGIN &&
    p.left + tooltip.width <= vw - VIEWPORT_MARGIN;

  // 1. Preferred side
  const pos = resolve(preferred);
  if (fits(pos)) return { ...pos, side: preferred };

  // 2. Opposite side
  const flipped = OPPOSITE[preferred];
  const alt = resolve(flipped);
  if (fits(alt)) return { ...alt, side: flipped };

  // 3. Clamp to viewport
  return {
    top: Math.min(Math.max(VIEWPORT_MARGIN, pos.top), vh - tooltip.height - VIEWPORT_MARGIN),
    left: Math.min(Math.max(VIEWPORT_MARGIN, pos.left), vw - tooltip.width - VIEWPORT_MARGIN),
    side: preferred,
  };
}

// ─── Variant Styles ──────────────────────────────────────────────────────────
//
// M3 Specs — sourced from:
//   m3.material.io/components/tooltips/specs
//   MDC Web: packages/mdc-tooltip/_tooltip.scss
//   MDC Web: packages/mdc-tooltip/_rich-tooltip-theme.scss
//   Angular Material: src/material/tooltip/_m3-tooltip.scss
//
// Plain tooltip
// ─────────────
//   Container:   sys.color.inverse-surface, corner-extra-small (4dp)
//   Dimensions:  h 24dp, min-w 40dp, max-w 200dp, max-h 40vh
//   Padding:     4dp vertical (implicit via fixed h + flex center), 8dp horizontal
//   Typography:  body-small — 12/16/400/0.4
//   Elevation:   none
//   Interactive: no (pointer-events-none)
//
// Rich tooltip
// ────────────
//   Container:   sys.color.surface-container, 12dp radius
//   Dimensions:  min-h 24dp, min-w 40dp, max-w 320dp
//   Padding:     12dp top, 8dp bottom, 16dp horizontal
//   Typography:  body2 — 14/20/400
//   Subhead:     subtitle2 — 14/22/500, sys.color.on-surface
//   Layout:      flex column, items-start, text-left, content-margin 8dp
//   Elevation:   level 2
//   Interactive: yes (WCAG 1.4.13 "Hoverable")

const tooltipVariants = cva(
  // Base: high-contrast-mode border (becomes visible in forced-colors)
  "select-none border border-transparent",
  {
    variants: {
      variant: {
        plain: [
          "h-6 min-w-10 max-w-50 max-h-[40vh] px-2 rounded-sm",
          "bg-inverse-surface text-inverse-on-surface",
          "text-[12px] leading-4 font-normal tracking-[0.4px]",
          "whitespace-nowrap overflow-hidden text-center",
          "pointer-events-none",
          "flex items-center justify-center",
        ].join(" "),
        rich: [
          "min-h-6 min-w-10 max-w-80 pt-3 pb-2 px-4 rounded-xl",
          "bg-surface-container text-surface-variant-foreground",
          "text-sm leading-5 font-normal whitespace-normal text-left",
          "flex flex-col items-start",
          "shadow-[0_2px_6px_var(--elevation-2),0_1px_2px_var(--elevation-1)]",
          "pointer-events-auto", // WCAG 1.4.13
        ].join(" "),
      },
    },
    defaultVariants: { variant: "plain" },
  },
);

// ─── Types ────────────────────────────────────────────────────────────────────

export type TooltipProps = VariantProps<typeof tooltipVariants> & {
  /** Tooltip body text */
  content: string;
  /** Rich-only: optional subhead above the body */
  subhead?: string;
  /** Trigger element (must accept ref forwarding) */
  children: React.ReactElement;
  /** Preferred placement relative to trigger */
  side?: Side;
  /** Extra classes on the tooltip surface */
  className?: string;
  /** Show delay in ms (M3 default: 500) */
  delayShow?: number;
  /** Hide delay in ms (M3 default: 200) */
  delayHide?: number;
};

// ─── Surface (portal-rendered) ────────────────────────────────────────────────

interface SurfaceProps {
  id: string;
  variant: "plain" | "rich";
  subhead?: string;
  content: string;
  anchor: DOMRect;
  side: Side;
  className?: string;
  reducedMotion: boolean;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
}

function TooltipSurface({
  id,
  variant,
  subhead,
  content,
  anchor,
  side: preferred,
  className,
  reducedMotion,
  onPointerEnter,
  onPointerLeave,
}: SurfaceProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [pos, setPos] = React.useState<Position | null>(null);

  const gap = variant === "rich" ? GAP_RICH : GAP_PLAIN;

  // Measure after first paint, then position
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos(computePosition(anchor, rect, preferred, gap));
  }, [anchor, preferred, gap]);

  const resolved = pos?.side ?? preferred;
  const noMotion = reducedMotion;

  return (
    <motion.span
      ref={ref}
      id={id}
      role="tooltip"
      initial={{ opacity: 0, scale: noMotion ? 1 : SCALE_INITIAL }}
      animate={{
        opacity: pos ? 1 : 0,
        scale: 1,
        transition: noMotion
          ? { duration: 0 }
          : { duration: ENTER_DURATION_S, ease: [...EMPHASIZED_DECELERATE] },
      }}
      exit={{
        opacity: 0,
        scale: noMotion ? 1 : SCALE_INITIAL,
        transition: noMotion
          ? { duration: 0 }
          : { duration: EXIT_DURATION_S, ease: [...EMPHASIZED_ACCELERATE] },
      }}
      className={cn(tooltipVariants({ variant }), className)}
      style={{
        position: "fixed",
        zIndex: 9999,
        top: pos?.top ?? -9999,
        left: pos?.left ?? -9999,
        transformOrigin: TRANSFORM_ORIGIN[resolved],
        visibility: pos ? "visible" : "hidden",
      }}
      // WCAG 1.4.13 "Hoverable" — only rich tooltips accept pointer events
      onPointerEnter={variant === "rich" ? onPointerEnter : undefined}
      onPointerLeave={variant === "rich" ? onPointerLeave : undefined}
    >
      {variant === "rich" && subhead && (
        <span className="block text-surface-foreground text-sm leading-5.5 font-medium mb-2">
          {subhead}
        </span>
      )}
      {content}
    </motion.span>
  );
}

TooltipSurface.displayName = "TooltipSurface";

// ─── Tooltip ──────────────────────────────────────────────────────────────────

function Tooltip({
  content,
  subhead,
  children,
  variant = "plain",
  side = "top",
  className,
  delayShow = 500,
  delayHide = 200,
}: TooltipProps) {
  const [visible, setVisible] = React.useState(false);
  const [anchor, setAnchor] = React.useState<DOMRect | null>(null);
  const triggerRef = React.useRef<HTMLSpanElement>(null);
  const showTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = React.useId();

  // ── Reduced motion ──────────────────────────────────────────────────────
  const [reducedMotion, setReducedMotion] = React.useState(false);
  React.useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // ── Timer helpers ───────────────────────────────────────────────────────
  const clearTimers = React.useCallback(() => {
    if (showTimer.current) clearTimeout(showTimer.current);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    showTimer.current = null;
    hideTimer.current = null;
  }, []);

  const measureAnchor = React.useCallback(() => {
    const el = triggerRef.current;
    if (el) setAnchor(el.getBoundingClientRect());
  }, []);

  const open = React.useCallback(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    showTimer.current = setTimeout(() => {
      measureAnchor();
      setVisible(true);
    }, delayShow);
  }, [delayShow, measureAnchor]);

  const close = React.useCallback(() => {
    if (showTimer.current) {
      clearTimeout(showTimer.current);
      showTimer.current = null;
    }
    hideTimer.current = setTimeout(() => setVisible(false), delayHide);
  }, [delayHide]);

  // WCAG 1.4.13 "Hoverable" — cancel hide when pointer enters rich surface
  const handleSurfaceEnter = React.useCallback(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  }, []);

  // Resume hide when pointer leaves rich surface
  const handleSurfaceLeave = React.useCallback(() => {
    hideTimer.current = setTimeout(() => setVisible(false), delayHide);
  }, [delayHide]);

  // ── Cleanup on unmount ──────────────────────────────────────────────────
  React.useEffect(() => clearTimers, [clearTimers]);

  // ── Escape dismisses (M3 spec, WCAG 1.4.13 "Dismissible") ──────────────
  React.useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        clearTimers();
        setVisible(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible, clearTimers]);

  // ── Reposition on scroll / resize ───────────────────────────────────────
  React.useEffect(() => {
    if (!visible) return;
    const reposition = () => measureAnchor();
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [visible, measureAnchor]);

  // ── Render ──────────────────────────────────────────────────────────────
  const resolvedVariant = variant ?? "plain";

  return (
    <span
      ref={triggerRef}
      className="inline-flex"
      onPointerEnter={open}
      onPointerLeave={close}
      onFocus={open}
      onBlur={close}
    >
      {React.cloneElement(children, {
        "aria-describedby": visible ? tooltipId : undefined,
      } as React.HTMLAttributes<HTMLElement>)}

      {typeof document !== "undefined" &&
        ReactDOM.createPortal(
          <AnimatePresence>
            {visible && anchor && (
              <TooltipSurface
                key="tooltip-surface"
                id={tooltipId}
                variant={resolvedVariant}
                subhead={subhead}
                content={content}
                anchor={anchor}
                side={side}
                className={className}
                reducedMotion={reducedMotion}
                onPointerEnter={handleSurfaceEnter}
                onPointerLeave={handleSurfaceLeave}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </span>
  );
}

Tooltip.displayName = "Tooltip";

// ─── Exports ──────────────────────────────────────────────────────────────────

export { Tooltip, tooltipVariants };

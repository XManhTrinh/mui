"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "motion/react";

import { cn } from "./lib/utils";

/**
 * Material Design 3 Tooltip
 *
 * M3 Specs (m3.material.io/components/tooltips/specs):
 * - Plain tooltip: inverse-surface bg, inverse-on-surface text, 24dp height,
 *   8dp horizontal / 4dp vertical padding, 4dp corner radius, Body Small (12px/16px/400),
 *   single line, max 200px, no shadow
 * - Rich tooltip: surface-container bg, on-surface-variant text, 12dp corner radius,
 *   12dp top / 8dp bottom / 16dp horizontal padding, max 320px, elevation shadow
 * - Delay: 500ms show, 200ms hide
 * - Animation: 150ms fade in/out
 * - Accessibility: role="tooltip", aria-describedby on trigger
 */

const tooltipVariants = cva("absolute z-60 pointer-events-none", {
  variants: {
    variant: {
      plain: [
        // M3 spec: container height 24dp, padding 8dp horizontal, 4dp corner radius
        "h-6 max-w-50 px-2 rounded-sm",
        "bg-inverse-surface text-inverse-on-surface",
        "text-[12px] leading-4 font-normal tracking-[0.4px] whitespace-nowrap",
        "flex items-center",
      ].join(" "),
      rich: [
        // M3 spec: top 12dp, bottom 8dp, left/right 16dp, 12dp corner radius
        "max-w-80 pt-3 pb-2 px-4 rounded-xl",
        "bg-surface-container text-surface-variant-foreground",
        "text-[14px] leading-5 font-normal whitespace-normal",
        "shadow-[0_2px_6px_var(--elevation-2),0_1px_2px_var(--elevation-1)]",
      ].join(" "),
    },
  },
  defaultVariants: {
    variant: "plain",
  },
});

export type TooltipProps = VariantProps<typeof tooltipVariants>& {
  /** Tooltip text content */
  content: string;
  /** Optional subhead for rich tooltips */
  subhead?: string;
  /** Children element that triggers the tooltip */
  children: React.ReactElement;
  /** Side of the element to show tooltip */
  side?: "top" | "bottom" | "left" | "right";
  /** Additional class */
  className?: string;
  /** Delay before showing (ms) */
  delayShow?: number;
  /** Delay before hiding (ms) */
  delayHide?: number;
}

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
  const [isVisible, setIsVisible] = React.useState(false);
  const showTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = React.useId();

  // Reduced motion detection
  const [reducedMotion, setReducedMotion] = React.useState(false);
  React.useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const show = () => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
    showTimeout.current = setTimeout(() => setIsVisible(true), delayShow);
  };

  const hide = () => {
    if (showTimeout.current) {
      clearTimeout(showTimeout.current);
      showTimeout.current = null;
    }
    hideTimeout.current = setTimeout(() => setIsVisible(false), delayHide);
  };

  React.useEffect(() => {
    return () => {
      if (showTimeout.current) clearTimeout(showTimeout.current);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

  // Escape key dismisses tooltip (M3 spec)
  React.useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showTimeout.current) {
          clearTimeout(showTimeout.current);
          showTimeout.current = null;
        }
        if (hideTimeout.current) {
          clearTimeout(hideTimeout.current);
          hideTimeout.current = null;
        }
        setIsVisible(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isVisible]);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {React.cloneElement(children, {
        "aria-describedby": isVisible ? tooltipId : undefined,
      } as React.HTMLAttributes<HTMLElement>)}
      <AnimatePresence>
        {isVisible && (
          <motion.span
            id={tooltipId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.15 }}
            className={cn(
              tooltipVariants({ variant }),
              positionClasses[side],
              className
            )}
            role="tooltip"
          >
            {variant === "rich" && subhead && (
              <span className="block text-surface-foreground text-[12px] leading-4 font-medium mb-1">
                {subhead}
              </span>
            )}
            {content}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

export { Tooltip, tooltipVariants };

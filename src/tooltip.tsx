"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./lib/utils";

// ─── Variant Styles ──────────────────────────────────────────────────────────
//
// M3 Specs — m3.material.io/components/tooltips/specs
//
// Plain tooltip: inverse-surface bg, corner-extra-small (4dp), h 24dp,
//   max-w 200dp, body-small typography, no elevation, pointer-events-none.
//
// Rich tooltip: surface-container bg, 12dp radius, max-w 320dp,
//   level 2 elevation, interactive (WCAG 1.4.13 "Hoverable").

const tooltipVariants = cva(
  "select-none border border-transparent z-[9999] animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
  {
    variants: {
      variant: {
        plain: [
          "h-6 min-w-10 max-w-50 px-2 rounded",
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
          "shadow-[0_2px_6px_hsl(var(--elevation-2)),0_1px_2px_hsl(var(--elevation-1))]",
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
  /** Trigger element */
  children: React.ReactNode;
  /** Preferred placement relative to trigger */
  side?: "top" | "bottom" | "left" | "right";
  /** Extra classes on the tooltip surface */
  className?: string;
  /** Show delay in ms (M3 default: 500) */
  delayShow?: number;
  /** Hide delay in ms (M3 default: 200) */
  delayHide?: number;
};

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
  const resolvedVariant = variant ?? "plain";
  const isRich = resolvedVariant === "rich";

  return (
    <TooltipPrimitive.Provider delayDuration={delayShow} skipDelayDuration={300}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          {children}
        </TooltipPrimitive.Trigger>

        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={isRich ? 8 : 4}
            className={cn(tooltipVariants({ variant: resolvedVariant }), className)}
            // Rich tooltips stay open on hover (WCAG 1.4.13 "Hoverable")
            onPointerDownOutside={(e) => {
              if (isRich) e.preventDefault();
            }}
          >
            {isRich && subhead && (
              <span className="block text-surface-foreground text-sm leading-5.5 font-medium mb-2">
                {subhead}
              </span>
            )}
            {content}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

Tooltip.displayName = "Tooltip";

// ─── Exports ──────────────────────────────────────────────────────────────────

export { Tooltip, tooltipVariants };

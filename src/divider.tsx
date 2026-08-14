"use client";

import * as React from "react";
import { cn } from "./lib/utils";

/**
 * Material Design 3 Divider
 *
 * M3 Specs (m3.material.io/components/divider/specs):
 * - Color: outline-variant
 * - Height: 1px (1dp)
 * - Variants: full (100%), inset (16dp left), middle-inset (16dp left + right)
 * - Orientation: horizontal (default), vertical
 * - Space between divider & supporting text: 4dp
 * - Bottom margin: 8dp (when in a list context)
 */

export type DividerProps = {
  variant?: "full" | "inset" | "middle-inset";
  orientation?: "horizontal" | "vertical";
  className?: string;
}

const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  ({ variant = "full", orientation = "horizontal", className }, ref) => {
    const isHorizontal = orientation === "horizontal";

    return (
      <hr
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cn(
          "shrink-0 border-none bg-outline-variant",
          isHorizontal ? "h-px w-full" : "w-px h-full",
          isHorizontal && variant === "inset" && "ml-4",
          isHorizontal && variant === "middle-inset" && "mx-4",
          !isHorizontal && variant === "inset" && "mt-4",
          !isHorizontal && variant === "middle-inset" && "my-4",
          className
        )}
      />
    );
  }
);
Divider.displayName = "Divider";

export { Divider };

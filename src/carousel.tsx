"use client";

import * as React from "react";
import { cn } from "./lib/utils";
import { Icon } from "./icon";

/**
 * Material Design 3 Carousel
 *
 * M3 Specs (m3.material.io/components/carousel/specs):
 * - Horizontal CSS scroll-snap container
 * - Item corner radius: 28dp
 * - Gap between items: 8dp
 * - State layers: 8% hover, 10% focus, 10% press
 * - Native touch/drag scrollable
 * - Keyboard accessible (arrow keys)
 * - Hidden scrollbar for clean appearance
 *
 * Variants:
 * - uncontained (default): leading padding 16dp, items scroll past trailing edge
 * - hero: leading + trailing padding, first item large, trailing items peek small
 * - full-screen: no padding, full-width items, one at a time
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CarouselProps {
  /** Layout variant */
  variant?: "uncontained" | "hero" | "full-screen";
  /** Gap between items in pixels (default: 8) */
  gap?: number;
  /** Show navigation arrows */
  showArrows?: boolean;
  /** Additional className for container */
  className?: string;
  /** Carousel items */
  children: React.ReactNode;
}

export interface CarouselItemProps {
  /** Item width: "large" (dynamic fill), "medium" (half), "small" (40-56dp) */
  size?: "large" | "medium" | "small";
  /** Disabled state (38% opacity) */
  disabled?: boolean;
  /** Additional className */
  className?: string;
  children: React.ReactNode;
}

// ─── Carousel ─────────────────────────────────────────────────────────────────

function Carousel({
  variant = "uncontained",
  gap = 8,
  showArrows = false,
  className,
  children,
}: CarouselProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const updateScrollState = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  React.useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;

    // Use ResizeObserver to detect size changes
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(el);

    return () => resizeObserver.disconnect();
  }, [updateScrollState, children]);

  const scrollBy = (direction: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollBy(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollBy(1);
    }
  };

  return (
    <div
      className={cn("relative w-full group/carousel", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Carousel"
    >
      {/* Scroll container */}
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="list"
        className={cn(
          "flex overflow-x-auto",
          "scroll-smooth snap-x snap-mandatory",
          "[-webkit-overflow-scrolling:touch] [scrollbar-width:none]",
          "[&::-webkit-scrollbar]:hidden",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-[28px]",
          variant === "uncontained" && "pl-4",
          variant === "hero" && "px-4",
          variant === "full-screen" && "px-0"
        )}
        style={{
          gap: `${gap}px`,
          paddingTop: variant === "full-screen" ? 0 : "8px",
          paddingBottom: variant === "full-screen" ? 0 : "8px",
        }}
      >
        {children}
      </div>

      {/* Navigation arrows */}
      {showArrows && (
        <>
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 z-10",
              "flex items-center justify-center w-12 h-12 rounded-full",
              "bg-surface text-surface-foreground shadow-[0_2px_6px_var(--elevation-2),0_1px_2px_var(--elevation-1)]",
              "opacity-0 group-hover/carousel:opacity-100 transition-opacity",
              "hover:bg-surface-container-high",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              "disabled:opacity-0 disabled:pointer-events-none"
            )}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <Icon name="chevron_left" size={24} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 z-10",
              "flex items-center justify-center w-12 h-12 rounded-full",
              "bg-surface text-surface-foreground shadow-[0_2px_6px_var(--elevation-2),0_1px_2px_var(--elevation-1)]",
              "opacity-0 group-hover/carousel:opacity-100 transition-opacity",
              "hover:bg-surface-container-high",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              "disabled:opacity-0 disabled:pointer-events-none"
            )}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <Icon name="chevron_right" size={24} />
          </button>
        </>
      )}
    </div>
  );
}
Carousel.displayName = "Carousel";

// ─── CarouselItem ─────────────────────────────────────────────────────────────

function CarouselItem({
  size = "large",
  disabled = false,
  className,
  children,
}: CarouselItemProps) {
  return (
    <div
      role="listitem"
      aria-roledescription="slide"
      className={cn(
        // Base styles
        "relative shrink-0 rounded-[28px] overflow-hidden",
        "snap-start",
        "bg-surface",
        // Size variants
        size === "large" && "w-[calc(100%-48px)] min-w-[200px]",
        size === "medium" && "w-[calc(50%-12px)] min-w-[150px]",
        size === "small" && "w-14 min-w-[40px] max-w-14",
        // State layer via pseudo-element
        "before:absolute before:inset-0 before:z-10 before:rounded-[28px] before:pointer-events-none",
        "before:bg-on-surface before:opacity-0 before:transition-opacity",
        "hover:before:opacity-[0.08]",
        "focus-within:before:opacity-[0.10]",
        "active:before:opacity-[0.10]",
        // Disabled state
        disabled && "opacity-[0.38] pointer-events-none",
        className
      )}
    >
      {children}
    </div>
  );
}
CarouselItem.displayName = "CarouselItem";

export { Carousel, CarouselItem };

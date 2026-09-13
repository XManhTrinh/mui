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
 * - multi-browse: large → medium → small items for quickly browsing many items
 *   (the default M3 strategy). Items without an explicit size auto-size by position.
 * - uncontained (default): leading padding 16dp, items scroll past trailing edge
 * - hero: leading + trailing padding, first item large, trailing items peek small
 * - full-screen: no padding, full-width items, one at a time
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type CarouselVariant = "multi-browse" | "uncontained" | "hero" | "full-screen";

export type CarouselProps = {
  /** Layout variant */
  variant?: CarouselVariant;
  /** Gap between items in pixels (default: 8) */
  gap?: number;
  /** Show navigation arrows */
  showArrows?: boolean;
  /** Additional className for container */
  className?: string;
  /** Carousel items */
  children: React.ReactNode;
}

export type CarouselItemProps = {
  /**
   * Item width: "large" (dynamic fill), "medium" (half), "small" (40-56dp).
   * When omitted, the size is derived from the carousel variant and the item's
   * position (multi-browse: large → medium → small; otherwise large).
   */
  size?: "large" | "medium" | "small";
  /** Disabled state (38% opacity) */
  disabled?: boolean;
  /** Additional className */
  className?: string;
  children: React.ReactNode;
}

// ─── Context ──────────────────────────────────────────────────────────────────

type CarouselContextValue = {
  variant: CarouselVariant;
  /** Resolve a default item size from its position when it has no explicit size. */
  defaultSizeForIndex: (index: number) => "large" | "medium" | "small";
};

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

/** Per-item index, provided by Carousel so items can derive a default size. */
const CarouselIndexContext = React.createContext<number>(0);

/**
 * Multi-browse default sizing: first item large, next medium, the rest small.
 * This produces the large → medium → small progression M3 defines for the
 * multi-browse strategy without requiring the consumer to size each item.
 */
function multiBrowseSize(index: number): "large" | "medium" | "small" {
  if (index === 0) return "large";
  if (index === 1) return "medium";
  return "small";
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

  // ── Mouse-drag-to-scroll (desktop) ──────────────────────────────
  // On touch devices native scroll works; on desktop we need pointer
  // event handling to allow click-and-drag scrolling.
  const isDragging = React.useRef(false);
  const dragStart = React.useRef({ x: 0, scrollLeft: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only handle primary button, skip touch (native scroll handles it)
    if (e.pointerType === "touch" || e.button !== 0) return;
    const el = scrollRef.current;
    if (!el) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX, scrollLeft: el.scrollLeft };
    el.style.scrollBehavior = "auto";
    el.style.cursor = "grabbing";
    el.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const el = scrollRef.current;
    if (!el) return;
    const dx = e.clientX - dragStart.current.x;
    el.scrollLeft = dragStart.current.scrollLeft - dx;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const el = scrollRef.current;
    if (el) {
      el.style.scrollBehavior = "";
      el.style.cursor = "";
      el.releasePointerCapture(e.pointerId);
    }
  };

  const contextValue = React.useMemo<CarouselContextValue>(
    () => ({
      variant,
      defaultSizeForIndex: variant === "multi-browse" ? multiBrowseSize : () => "large",
    }),
    [variant]
  );

  // Tag each item with its index so items can derive a multi-browse default size.
  const indexedChildren = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child;
    return (
      <CarouselIndexContext.Provider value={index}>{child}</CarouselIndexContext.Provider>
    );
  });

  return (
    <CarouselContext.Provider value={contextValue}>
    <div
      className={cn("isolate relative group/carousel", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Carousel"
    >
      {/* Scroll container */}
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        tabIndex={0}
        role="list"
        className={cn(
          "flex overflow-x-auto cursor-grab active:cursor-grabbing",
          "scroll-smooth snap-x snap-mandatory",
          "[-webkit-overflow-scrolling:touch] scrollbar-none",
          "[&::-webkit-scrollbar]:hidden",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-[28px]",
          (variant === "uncontained" || variant === "multi-browse") && "ps-4",
          variant === "hero" && "px-4",
          variant === "full-screen" && "px-0"
        )}
        style={{
          gap: `${gap}px`,
          paddingTop: variant === "full-screen" ? 0 : "8px",
          paddingBottom: variant === "full-screen" ? 0 : "8px",
        }}
      >
        {indexedChildren}
      </div>

      {/* Navigation arrows */}
      {showArrows && (
        <>
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 z-10",
              "flex items-center justify-center w-12 h-12 rounded-full cursor-pointer",
              "bg-surface text-surface-foreground shadow-[0_2px_6px_hsl(var(--elevation-2)),0_1px_2px_hsl(var(--elevation-1))]",
              "opacity-0 group-hover/carousel:opacity-100 transition-opacity",
              "hover:bg-surface-container-high transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              "disabled:opacity-0 disabled:pointer-events-none disabled:cursor-not-allowed"
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
              "flex items-center justify-center w-12 h-12 rounded-full cursor-pointer",
              "bg-surface text-surface-foreground shadow-[0_2px_6px_hsl(var(--elevation-2)),0_1px_2px_hsl(var(--elevation-1))]",
              "opacity-0 group-hover/carousel:opacity-100 transition-opacity",
              "hover:bg-surface-container-high transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              "disabled:opacity-0 disabled:pointer-events-none disabled:cursor-not-allowed"
            )}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <Icon name="chevron_right" size={24} />
          </button>
        </>
      )}
    </div>
    </CarouselContext.Provider>
  );
}
Carousel.displayName = "Carousel";

// ─── CarouselItem ─────────────────────────────────────────────────────────────

function CarouselItem({
  size,
  disabled = false,
  className,
  children,
}: CarouselItemProps) {
  const ctx = React.useContext(CarouselContext);
  const index = React.useContext(CarouselIndexContext);
  // Explicit size wins; otherwise derive from the variant + position.
  const resolvedSize = size ?? ctx?.defaultSizeForIndex(index) ?? "large";
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
        resolvedSize === "large" && "w-[calc(100%-48px)] min-w-50",
        resolvedSize === "medium" && "w-[calc(50%-12px)] min-w-37.5",
        resolvedSize === "small" && "w-14 min-w-10 max-w-14",
        // State layer via pseudo-element
        "before:absolute before:inset-0 before:z-10 before:rounded-[28px] before:pointer-events-none",
        "before:bg-surface-foreground before:opacity-0 before:transition-opacity",
        "hover:before:opacity-[0.08]",
        "focus-within:before:opacity-[0.10]",
        "active:before:opacity-[0.10]",
        // Disabled state
        disabled && "opacity-[0.38] pointer-events-none cursor-not-allowed",
        className
      )}
    >
      {children}
    </div>
  );
}
CarouselItem.displayName = "CarouselItem";

export { Carousel, CarouselItem };

"use client";

import { Icon } from "@mui/index";

export default function CarouselPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Carousel
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Carousels show a collection of items one at a time with support for
          swipe, drag-to-scroll, keyboard navigation, and auto-play.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 py-16 rounded-2xl border border-outline-variant bg-surface-container-low">
        <div className="flex items-center justify-center size-16 rounded-full bg-secondary-container">
          <Icon name="construction" size={32} className="text-secondary-container-foreground" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-[22px] leading-7 font-normal text-surface-foreground">
            Coming Soon
          </p>
          <p className="text-[14px] leading-5 text-surface-variant-foreground max-w-80">
            The Carousel component is being refined to meet full M3 Expressive specs.
            Check back soon.
          </p>
        </div>
      </div>
    </div>
  );
}

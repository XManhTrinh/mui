"use client";

import * as React from "react";
import { Carousel, CarouselItem } from "@mui/index";
import { Showcase } from "@/components/showcase";
import { PropsTable, type PropDef } from "@/components/props-table";

export default function CarouselPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2 flex items-center gap-3">
          Carousel
          <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-tertiary-container text-tertiary-container-foreground text-[11px] font-medium tracking-[0.5px]">
            Coming soon
          </span>
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Carousels show a collection of items one at a time. They can be
          uncontained (items peek from the edges) or hero (one item takes focus).
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Uncontained</h2>
        <Showcase title="Uncontained Carousel" className="flex-col items-stretch" code={`<Carousel variant="uncontained">\n  <CarouselItem>\n    <div>Slide 1</div>\n  </CarouselItem>\n  <CarouselItem>\n    <div>Slide 2</div>\n  </CarouselItem>\n  <CarouselItem>\n    <div>Slide 3</div>\n  </CarouselItem>\n</Carousel>`}>
          <Carousel variant="uncontained">
            <CarouselItem>
              <div className="w-64 h-40 rounded-xl bg-primary-container flex items-center justify-center">
                <span className="text-primary text-sm font-medium">Slide 1</span>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="w-64 h-40 rounded-xl bg-secondary-container flex items-center justify-center">
                <span className="text-secondary text-sm font-medium">Slide 2</span>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="w-64 h-40 rounded-xl bg-tertiary-container flex items-center justify-center">
                <span className="text-tertiary text-sm font-medium">Slide 3</span>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="w-64 h-40 rounded-xl bg-primary-container flex items-center justify-center">
                <span className="text-primary text-sm font-medium">Slide 4</span>
              </div>
            </CarouselItem>
          </Carousel>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Hero</h2>
        <Showcase title="Hero Carousel" className="flex-col items-stretch" code={`<Carousel variant="hero">\n  <CarouselItem>\n    <div>Featured Item 1</div>\n  </CarouselItem>\n  <CarouselItem>\n    <div>Featured Item 2</div>\n  </CarouselItem>\n</Carousel>`}>
          <Carousel variant="hero">
            <CarouselItem>
              <div className="w-full h-48 rounded-xl bg-primary-container flex items-center justify-center">
                <span className="text-primary text-lg font-medium">Featured Item 1</span>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="w-full h-48 rounded-xl bg-secondary-container flex items-center justify-center">
                <span className="text-secondary text-lg font-medium">Featured Item 2</span>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="w-full h-48 rounded-xl bg-tertiary-container flex items-center justify-center">
                <span className="text-tertiary text-lg font-medium">Featured Item 3</span>
              </div>
            </CarouselItem>
          </Carousel>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Usage Notes</h2>
        <Showcase title="Guidelines" code={`<Carousel variant="uncontained">\n  <CarouselItem>...</CarouselItem>\n</Carousel>`}>
          <div className="text-sm text-surface-variant-foreground space-y-2">
            <p>• Uncontained carousels show peek of adjacent items to indicate scrollability.</p>
            <p>• Hero carousels emphasize one item at a time with a larger viewport.</p>
            <p>• Both variants support swipe and button navigation.</p>
            <p>• On desktop, you can click and drag to scroll the carousel.</p>
          </div>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Auto-Play</h2>
        <Showcase title="Auto-advancing carousel" className="flex-col items-stretch" code={`<Carousel autoPlay={3000}>\n  <CarouselItem>\n    <div>Slide 1</div>\n  </CarouselItem>\n  <CarouselItem>\n    <div>Slide 2</div>\n  </CarouselItem>\n  <CarouselItem>\n    <div>Slide 3</div>\n  </CarouselItem>\n</Carousel>`}>
          <Carousel autoPlay={3000}>
            <CarouselItem>
              <div className="w-64 h-40 rounded-xl bg-primary-container flex items-center justify-center">
                <span className="text-primary text-sm font-medium">Auto Slide 1</span>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="w-64 h-40 rounded-xl bg-secondary-container flex items-center justify-center">
                <span className="text-secondary text-sm font-medium">Auto Slide 2</span>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="w-64 h-40 rounded-xl bg-tertiary-container flex items-center justify-center">
                <span className="text-tertiary text-sm font-medium">Auto Slide 3</span>
              </div>
            </CarouselItem>
          </Carousel>
          <p className="text-sm text-surface-variant-foreground mt-2">
            Advances every 3 seconds. Pauses on hover or focus.
          </p>
        </Showcase>
      </section>

      <PropsTable
        componentName="Carousel"
        props={[
          { name: "variant", type: '"multi-browse" | "uncontained" | "hero" | "full-screen"', default: '"uncontained"', description: "Carousel layout variant" },
          { name: "gap", type: "number", default: "8", description: "Gap between items in pixels" },
          { name: "showArrows", type: "boolean", default: "true", description: "Shows navigation arrow buttons" },
          { name: "autoPlay", type: "number", default: "0", description: "Auto-advance interval in ms (0 = disabled). Pauses on hover/focus." },
          { name: "className", type: "string", description: "Additional CSS classes" },
          { name: "children", type: "ReactNode", description: "CarouselItem elements", required: true },
        ]}
      />

      <PropsTable
        componentName="CarouselItem"
        props={[
          { name: "size", type: '"large" | "medium" | "small"', description: "Item size (auto-derived from position in multi-browse)" },
          { name: "disabled", type: "boolean", description: "Disables the carousel item" },
          { name: "className", type: "string", description: "Additional CSS classes" },
          { name: "children", type: "ReactNode", description: "Item content", required: true },
        ]}
      />
    </div>
  );
}

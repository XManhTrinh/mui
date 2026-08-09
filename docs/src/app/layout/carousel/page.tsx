"use client";

import * as React from "react";
import { Carousel, CarouselItem } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function CarouselPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Carousel
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Carousels show a collection of items one at a time. They can be
          uncontained (items peek from the edges) or hero (one item takes focus).
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Uncontained</h2>
        <Showcase title="Uncontained Carousel" className="flex-col items-stretch">
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
        <Showcase title="Hero Carousel" className="flex-col items-stretch">
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
        <Showcase title="Guidelines">
          <div className="text-sm text-surface-variant-foreground space-y-2">
            <p>• Uncontained carousels show peek of adjacent items to indicate scrollability.</p>
            <p>• Hero carousels emphasize one item at a time with a larger viewport.</p>
            <p>• Both variants support swipe and button navigation.</p>
          </div>
        </Showcase>
      </section>
    </div>
  );
}

"use client";

import * as React from "react";
import { Chip } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function ChipsPage() {
  const [selected, setSelected] = React.useState(false);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Chips
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Chips help people enter information, make selections, filter content,
          or trigger actions.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Assist Chips</h2>
        <Showcase title="Assist">
          <Chip variant="assist" leadingIcon="event">Add to calendar</Chip>
          <Chip variant="assist" leadingIcon="directions">Get directions</Chip>
          <Chip variant="assist" leadingIcon="share">Share</Chip>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Filter Chips</h2>
        <Showcase title="Filter">
          <Chip
            variant="filter"
            selected={selected}
            onClick={() => setSelected((s) => !s)}
          >Running</Chip>
          <Chip variant="filter">Walking</Chip>
          <Chip variant="filter" selected>Cycling</Chip>
          <Chip variant="filter">Swimming</Chip>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Input Chips</h2>
        <Showcase title="Input">
          <Chip variant="input" onDismiss={() => {}}>john@example.com</Chip>
          <Chip variant="input" onDismiss={() => {}}>jane@example.com</Chip>
          <Chip variant="input" onDismiss={() => {}}>bob@example.com</Chip>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Suggestion Chips</h2>
        <Showcase title="Suggestion">
          <Chip variant="suggestion">Price: Low to High</Chip>
          <Chip variant="suggestion">Top Rated</Chip>
          <Chip variant="suggestion">Nearby</Chip>
        </Showcase>
      </section>
    </div>
  );
}

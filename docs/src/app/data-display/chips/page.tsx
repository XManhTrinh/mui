"use client";

import * as React from "react";
import { Chip, Icon } from "@mui/index";
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
          <Chip variant="assist" label="Add to calendar" icon={<Icon name="event" />} />
          <Chip variant="assist" label="Get directions" icon={<Icon name="directions" />} />
          <Chip variant="assist" label="Share" icon={<Icon name="share" />} />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Filter Chips</h2>
        <Showcase title="Filter">
          <Chip
            variant="filter"
            label="Running"
            selected={selected}
            onSelectedChange={setSelected}
          />
          <Chip variant="filter" label="Walking" />
          <Chip variant="filter" label="Cycling" selected />
          <Chip variant="filter" label="Swimming" />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Input Chips</h2>
        <Showcase title="Input">
          <Chip variant="input" label="john@example.com" onDismiss={() => {}} />
          <Chip variant="input" label="jane@example.com" onDismiss={() => {}} />
          <Chip variant="input" label="bob@example.com" onDismiss={() => {}} />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Suggestion Chips</h2>
        <Showcase title="Suggestion">
          <Chip variant="suggestion" label="Price: Low to High" />
          <Chip variant="suggestion" label="Top Rated" />
          <Chip variant="suggestion" label="Nearby" />
        </Showcase>
      </section>
    </div>
  );
}

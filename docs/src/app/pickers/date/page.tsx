"use client";

import * as React from "react";
import { DatePicker } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function DatePickerPage() {
  const [date, setDate] = React.useState<Date | null>(null);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Date Picker
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Date pickers let users select a date or range of dates.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Basic</h2>
        <Showcase title="Default Date Picker">
          <DatePicker value={date} onChange={setDate} />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Min/Max</h2>
        <Showcase title="Constrained Date Range">
          <DatePicker
            min={new Date(2024, 0, 1)}
            max={new Date(2024, 11, 31)}
          />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Disabled</h2>
        <Showcase title="Disabled State">
          <DatePicker disabled />
        </Showcase>
      </section>
    </div>
  );
}

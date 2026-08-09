"use client";

import * as React from "react";
import { DatePicker } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function DatePickerPage() {
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Date Picker
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Date pickers let users select a date or range of dates. They can be
          used in dialogs or as inline elements.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Basic</h2>
        <Showcase title="Default Date Picker">
          <DatePicker
            value={date}
            onValueChange={setDate}
            placeholder="Select date"
          />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Initial Value</h2>
        <Showcase title="Pre-selected Date">
          <DatePicker
            defaultValue={new Date(2024, 5, 15)}
            placeholder="Choose a date"
          />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Constraints</h2>
        <Showcase title="Min and Max Dates">
          <DatePicker
            placeholder="Select date"
            min={new Date(2024, 0, 1)}
            max={new Date(2024, 11, 31)}
          />
          <span className="text-sm text-surface-variant-foreground">
            Limited to year 2024
          </span>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Disabled</h2>
        <Showcase title="Disabled State">
          <DatePicker
            defaultValue={new Date(2024, 2, 10)}
            disabled
          />
        </Showcase>
      </section>
    </div>
  );
}

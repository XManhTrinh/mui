"use client";

import * as React from "react";
import { TimePicker } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function TimePickerPage() {
  const [time, setTime] = React.useState<string | undefined>(undefined);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Time Picker
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Time pickers help users select and set a specific time. They can
          display in 12-hour or 24-hour format.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">12-Hour Format</h2>
        <Showcase title="AM/PM Time Picker">
          <TimePicker
            value={time}
            onValueChange={setTime}
            format="12h"
            placeholder="Select time"
          />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">24-Hour Format</h2>
        <Showcase title="24-Hour Time Picker">
          <TimePicker
            format="24h"
            placeholder="Select time"
          />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Default Value</h2>
        <Showcase title="Pre-selected Time">
          <TimePicker
            defaultValue="09:30"
            format="12h"
          />
          <TimePicker
            defaultValue="14:45"
            format="24h"
          />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Disabled</h2>
        <Showcase title="Disabled State">
          <TimePicker
            defaultValue="10:00"
            format="12h"
            disabled
          />
        </Showcase>
      </section>
    </div>
  );
}

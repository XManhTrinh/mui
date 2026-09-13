"use client";

import * as React from "react";
import { TimePicker } from "@mui/index";
import { Showcase } from "@/components/showcase";
import { PropsTable, type PropDef } from "@/components/props-table";

export default function TimePickerPage() {
  const [time, setTime] = React.useState<{ hours: number; minutes: number } | null>(null);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Time Picker
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Time pickers help users select and set a specific time.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">12-Hour Format</h2>
        <Showcase title="AM/PM" code={`<TimePicker format="12h" value={time} onChange={setTime} />`}>
          <TimePicker format="12h" value={time} onChange={setTime} />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">24-Hour Format</h2>
        <Showcase title="24h" code={`<TimePicker format="24h" />`}>
          <TimePicker format="24h" />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Value</h2>
        <Showcase title="Pre-selected Time" code={`<TimePicker format="12h" value={{ hours: 9, minutes: 30 }} />\n<TimePicker format="24h" value={{ hours: 14, minutes: 45 }} />`}>
          <TimePicker format="12h" value={{ hours: 9, minutes: 30 }} />
          <TimePicker format="24h" value={{ hours: 14, minutes: 45 }} />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Disabled</h2>
        <Showcase title="Disabled State" code={`<TimePicker format="12h" value={{ hours: 10, minutes: 0 }} disabled />`}>
          <TimePicker format="12h" value={{ hours: 10, minutes: 0 }} disabled />
        </Showcase>
      </section>

      <PropsTable
        componentName="TimePicker"
        props={[
          { name: "value", type: "TimeValue", description: "Controlled time value — { hours: number, minutes: number }" },
          { name: "onChange", type: "(value: TimeValue) => void", description: "Callback when the time value changes" },
          { name: "format", type: '"12h" | "24h"', default: '"12h"', description: "Time display format" },
          { name: "disabled", type: "boolean", description: "Disables the time picker" },
          { name: "className", type: "string", description: "Additional CSS classes" },
        ]}
      />
    </div>
  );
}

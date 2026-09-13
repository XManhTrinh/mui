"use client";

import * as React from "react";
import { DatePicker, DatePickerModal, Button } from "@mui/index";
import type { DateRange } from "@mui/index";
import { Showcase } from "@/components/showcase";
import { PropsTable, type PropDef } from "@/components/props-table";

export default function DatePickerPage() {
  const [date, setDate] = React.useState<Date | null>(null);

  // Modal state (single)
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalDate, setModalDate] = React.useState<Date | null>(null);

  // Modal state (range)
  const [rangeModalOpen, setRangeModalOpen] = React.useState(false);
  const [rangeValue, setRangeValue] = React.useState<DateRange>({ start: null, end: null });

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
        <p className="text-sm text-surface-variant-foreground">
          On touch devices, swipe left/right on the calendar grid to navigate between months.
        </p>
        <Showcase title="Default Date Picker" code={`<DatePicker value={date} onChange={setDate} />`}>
          <DatePicker value={date} onChange={setDate} />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Min/Max</h2>
        <Showcase title="Constrained Date Range" code={`<DatePicker\n  min={new Date(2024, 0, 1)}\n  max={new Date(2024, 11, 31)}\n/>`}>
          <DatePicker
            min={new Date(2024, 0, 1)}
            max={new Date(2024, 11, 31)}
          />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Disabled</h2>
        <Showcase title="Disabled State" code={`<DatePicker disabled />`}>
          <DatePicker disabled />
        </Showcase>
      </section>

      {/* Modal Date Picker */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Modal (Single)</h2>
        <Showcase
          title="Modal Date Picker"
          code={`<Button variant="outlined" onClick={() => setModalOpen(true)}>
  Pick a date
</Button>
<DatePickerModal
  open={modalOpen}
  onOpenChange={setModalOpen}
  mode="single"
  value={modalDate}
  onConfirm={(d) => setModalDate(d as Date | null)}
/>`}
        >
          <div className="flex items-center gap-4">
            <Button variant="outlined" onClick={() => setModalOpen(true)}>
              Pick a date
            </Button>
            {modalDate && (
              <span className="text-sm text-surface-variant-foreground">
                {modalDate.toLocaleDateString()}
              </span>
            )}
          </div>
          <DatePickerModal
            open={modalOpen}
            onOpenChange={setModalOpen}
            mode="single"
            value={modalDate}
            onConfirm={(d) => setModalDate(d as Date | null)}
          />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Modal (Range)</h2>
        <Showcase
          title="Range Date Picker"
          code={`<Button variant="outlined" onClick={() => setRangeModalOpen(true)}>
  Pick a range
</Button>
<DatePickerModal
  open={rangeModalOpen}
  onOpenChange={setRangeModalOpen}
  mode="range"
  rangeValue={rangeValue}
  onConfirm={(r) => setRangeValue(r as DateRange)}
/>`}
        >
          <div className="flex items-center gap-4">
            <Button variant="outlined" onClick={() => setRangeModalOpen(true)}>
              Pick a range
            </Button>
            {rangeValue.start && rangeValue.end && (
              <span className="text-sm text-surface-variant-foreground">
                {rangeValue.start.toLocaleDateString()} – {rangeValue.end.toLocaleDateString()}
              </span>
            )}
          </div>
          <DatePickerModal
            open={rangeModalOpen}
            onOpenChange={setRangeModalOpen}
            mode="range"
            rangeValue={rangeValue}
            onConfirm={(r) => setRangeValue(r as DateRange)}
          />
        </Showcase>
      </section>

      <PropsTable
        componentName="DatePicker"
        props={[
          { name: "value", type: "Date | null", description: "Controlled selected date" },
          { name: "onChange", type: "(date: Date | null) => void", description: "Callback when the selected date changes" },
          { name: "min", type: "Date", description: "Earliest selectable date" },
          { name: "max", type: "Date", description: "Latest selectable date" },
          { name: "disabled", type: "boolean", description: "Disables the date picker" },
          { name: "className", type: "string", description: "Additional CSS classes" },
        ]}
      />

      <PropsTable
        componentName="DatePickerModal"
        props={[
          { name: "open", type: "boolean", description: "Controlled open state", required: true },
          { name: "onOpenChange", type: "(open: boolean) => void", description: "Callback when open state changes", required: true },
          { name: "mode", type: '"single" | "range"', default: '"single"', description: "Selection mode" },
          { name: "value", type: "Date | null", description: 'Selected date (mode="single")' },
          { name: "rangeValue", type: "DateRange", description: 'Selected range (mode="range") — { start: Date | null, end: Date | null }' },
          { name: "onConfirm", type: "(selection: Date | null | DateRange) => void", description: "Callback when OK is pressed with the current selection" },
          { name: "min", type: "Date", description: "Earliest selectable date" },
          { name: "max", type: "Date", description: "Latest selectable date" },
          { name: "supportingText", type: "string", description: 'Header supporting text (default: "Select date" / "Select range")' },
          { name: "confirmLabel", type: "string", default: '"OK"', description: "Confirm button label" },
          { name: "cancelLabel", type: "string", default: '"Cancel"', description: "Cancel button label" },
          { name: "className", type: "string", description: "Additional CSS classes" },
        ]}
      />
    </div>
  );
}

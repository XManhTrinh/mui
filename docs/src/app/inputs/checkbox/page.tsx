"use client";

import * as React from "react";
import { Checkbox } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function CheckboxPage() {
  const [checked, setChecked] = React.useState(true);
  const [indeterminate, setIndeterminate] = React.useState(true);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Checkbox
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Checkboxes allow users to select one or more items from a set, or turn
          an option on or off.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">States</h2>
        <Showcase title="Unchecked & Checked">
          <Checkbox />
          <Checkbox defaultChecked />
        </Showcase>
        <Showcase title="Indeterminate">
          <Checkbox checked={indeterminate ? "indeterminate" : checked} onCheckedChange={(val) => {
            if (indeterminate) {
              setIndeterminate(false);
              setChecked(true);
            } else {
              setChecked(val as boolean);
            }
          }} />
          <span className="text-sm text-surface-variant-foreground">
            Click to cycle through states
          </span>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Disabled</h2>
        <Showcase title="Disabled States">
          <Checkbox disabled />
          <Checkbox disabled defaultChecked />
          <span className="text-sm text-surface-variant-foreground">
            Disabled unchecked & checked
          </span>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Labels</h2>
        <Showcase title="Labeled Checkboxes">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox defaultChecked />
            <span className="text-sm text-surface-foreground">Accept terms</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox />
            <span className="text-sm text-surface-foreground">Subscribe to newsletter</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox />
            <span className="text-sm text-surface-foreground">Remember me</span>
          </label>
        </Showcase>
      </section>
    </div>
  );
}

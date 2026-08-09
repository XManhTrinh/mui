"use client";

import * as React from "react";
import { Checkbox, Chip, Switch } from "@mui/index";
import { Showcase, Playground } from "@/components/showcase";

export default function CheckboxPage() {
  const [checked, setChecked] = React.useState(false);

  // Playground state
  const [pgChecked, setPgChecked] = React.useState(true);
  const [pgIndeterminate, setPgIndeterminate] = React.useState(false);
  const [pgDisabled, setPgDisabled] = React.useState(false);

  const pgCode = `<Checkbox${pgChecked ? " checked" : ""}${pgIndeterminate ? " indeterminate" : ""}${pgDisabled ? " disabled" : ""} />`;

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Checkbox
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Checkboxes allow users to select one or more items from a set.
        </p>
      </div>

      {/* Interactive Playground */}
      <Playground
        title="Playground"
        code={pgCode}
        controls={
          <>
            <div className="space-y-3 pt-1">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[13px] text-surface-foreground">Checked</span>
                <Switch checked={pgChecked} onCheckedChange={setPgChecked} />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[13px] text-surface-foreground">Indeterminate</span>
                <Switch checked={pgIndeterminate} onCheckedChange={setPgIndeterminate} />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[13px] text-surface-foreground">Disabled</span>
                <Switch checked={pgDisabled} onCheckedChange={setPgDisabled} />
              </label>
            </div>
          </>
        }
      >
        <Checkbox checked={pgChecked} indeterminate={pgIndeterminate} disabled={pgDisabled} onCheckedChange={(v) => setPgChecked(v === true)} />
      </Playground>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">States</h2>
        <Showcase title="Unchecked & Checked" code={`<Checkbox checked={checked} onCheckedChange={setChecked} />`}>
          <Checkbox checked={checked} onCheckedChange={(v) => setChecked(v === true)} />
          <Checkbox defaultChecked />
        </Showcase>
        <Showcase title="Indeterminate" code={`<Checkbox indeterminate />`}>
          <Checkbox indeterminate />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Disabled</h2>
        <Showcase title="Disabled States" code={`<Checkbox disabled />\n<Checkbox disabled defaultChecked />`}>
          <Checkbox disabled />
          <Checkbox disabled defaultChecked />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Labels</h2>
        <Showcase title="Labeled Checkboxes" className="flex-col items-start" code={`<label className="flex items-center gap-2">\n  <Checkbox defaultChecked />\n  <span>Accept terms</span>\n</label>`}>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox defaultChecked />
            <span className="text-sm text-surface-foreground">Accept terms</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox />
            <span className="text-sm text-surface-foreground">Subscribe to newsletter</span>
          </label>
        </Showcase>
      </section>
    </div>
  );
}

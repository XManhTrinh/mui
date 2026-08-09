"use client";

import * as React from "react";
import { Radio, RadioGroup } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function RadioPage() {
  const [value, setValue] = React.useState("option1");

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Radio
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Radio buttons allow users to select one option from a set of mutually
          exclusive choices.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Basic Radio</h2>
        <Showcase title="Individual Radio Buttons" code={`<Radio value="a" checked />\n<Radio value="b" />\n<Radio value="c" disabled />`}>
          <Radio value="a" checked />
          <Radio value="b" />
          <Radio value="c" disabled />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Radio Group</h2>
        <Showcase title="Controlled Radio Group" code={`<RadioGroup value={value} onValueChange={setValue}>\n  <Radio value="option1" />\n  <Radio value="option2" />\n  <Radio value="option3" />\n</RadioGroup>`}>
          <RadioGroup value={value} onValueChange={setValue}>
            <label className="flex items-center gap-2 cursor-pointer">
              <Radio value="option1" />
              <span className="text-sm text-surface-foreground">Option 1</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Radio value="option2" />
              <span className="text-sm text-surface-foreground">Option 2</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Radio value="option3" />
              <span className="text-sm text-surface-foreground">Option 3</span>
            </label>
          </RadioGroup>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Disabled</h2>
        <Showcase title="Disabled Radio Group" code={`<RadioGroup value="disabled1" disabled>\n  <Radio value="disabled1" />\n  <Radio value="disabled2" />\n</RadioGroup>`}>
          <RadioGroup value="disabled1" disabled>
            <label className="flex items-center gap-2">
              <Radio value="disabled1" />
              <span className="text-sm text-surface-variant-foreground">Selected (disabled)</span>
            </label>
            <label className="flex items-center gap-2">
              <Radio value="disabled2" />
              <span className="text-sm text-surface-variant-foreground">Unselected (disabled)</span>
            </label>
          </RadioGroup>
        </Showcase>
      </section>
    </div>
  );
}

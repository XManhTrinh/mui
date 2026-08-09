"use client";

import * as React from "react";
import { Switch, Icon } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function SwitchPage() {
  const [enabled, setEnabled] = React.useState(true);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Switch
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Switches toggle the state of a single item on or off. They are the
          preferred way to adjust settings on mobile.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Basic</h2>
        <Showcase title="On and Off States">
          <Switch checked={enabled} onCheckedChange={setEnabled} />
          <Switch />
          <span className="text-sm text-surface-variant-foreground">
            First switch is {enabled ? "on" : "off"}
          </span>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Icons</h2>
        <Showcase title="Switch with Icons">
          <Switch defaultChecked icon={<Icon name="check" />} />
          <Switch icon={<Icon name="close" />} />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Disabled</h2>
        <Showcase title="Disabled States">
          <Switch disabled checked />
          <Switch disabled />
          <span className="text-sm text-surface-variant-foreground">
            Disabled on & off
          </span>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Labels</h2>
        <Showcase title="Labeled Switches" className="flex-col items-start">
          <label className="flex items-center justify-between w-64 cursor-pointer">
            <span className="text-sm text-surface-foreground">Wi-Fi</span>
            <Switch defaultChecked />
          </label>
          <label className="flex items-center justify-between w-64 cursor-pointer">
            <span className="text-sm text-surface-foreground">Bluetooth</span>
            <Switch />
          </label>
          <label className="flex items-center justify-between w-64 cursor-pointer">
            <span className="text-sm text-surface-foreground">Airplane mode</span>
            <Switch disabled />
          </label>
        </Showcase>
      </section>
    </div>
  );
}

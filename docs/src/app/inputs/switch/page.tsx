"use client";

import * as React from "react";
import { Switch, Icon, Chip } from "@mui/index";
import { Showcase, Playground } from "@/components/showcase";

export default function SwitchPage() {
  const [enabled, setEnabled] = React.useState(true);

  // Playground state
  const [pgChecked, setPgChecked] = React.useState(true);
  const [pgShowIcons, setPgShowIcons] = React.useState(false);
  const [pgDisabled, setPgDisabled] = React.useState(false);

  const pgCode = `<Switch${pgChecked ? " checked" : ""}${pgShowIcons ? " showIcons" : ""}${pgDisabled ? " disabled" : ""} />`;

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
                <span className="text-[13px] text-surface-foreground">Show icons</span>
                <Switch checked={pgShowIcons} onCheckedChange={setPgShowIcons} />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[13px] text-surface-foreground">Disabled</span>
                <Switch checked={pgDisabled} onCheckedChange={setPgDisabled} />
              </label>
            </div>
          </>
        }
      >
        <Switch checked={pgChecked} onCheckedChange={setPgChecked} showIcons={pgShowIcons} disabled={pgDisabled} />
      </Playground>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Basic</h2>
        <Showcase title="On and Off States" code={`<Switch checked={enabled} onCheckedChange={setEnabled} />`}>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
          <Switch />
          <span className="text-sm text-surface-variant-foreground">
            First switch is {enabled ? "on" : "off"}
          </span>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Icons</h2>
        <Showcase title="Switch with Icons" code={`<Switch defaultChecked showIcons />`}>
          <Switch defaultChecked showIcons />
          <Switch showIcons />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Disabled</h2>
        <Showcase title="Disabled States" code={`<Switch disabled checked />`}>
          <Switch disabled checked />
          <Switch disabled />
          <span className="text-sm text-surface-variant-foreground">
            Disabled on & off
          </span>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Labels</h2>
        <Showcase title="Labeled Switches" className="flex-col items-start" code={`<label className="flex items-center justify-between">\n  <span>Wi-Fi</span>\n  <Switch defaultChecked />\n</label>`}>
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

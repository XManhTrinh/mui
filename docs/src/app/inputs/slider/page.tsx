"use client";

import * as React from "react";
import { Slider, Chip, Switch } from "@mui/index";
import { Showcase, Playground } from "@/components/showcase";

export default function SliderPage() {
  const [value, setValue] = React.useState(50);
  const [discreteValue, setDiscreteValue] = React.useState(40);

  // Playground state
  const [pgValue, setPgValue] = React.useState(50);
  const [pgStep, setPgStep] = React.useState<1 | 5 | 10 | 25>(1);
  const [pgShowValueIndicator, setPgShowValueIndicator] = React.useState(false);
  const [pgDisabled, setPgDisabled] = React.useState(false);

  const pgCode = `<Slider value={${pgValue}} min={0} max={100} step={${pgStep}}${pgShowValueIndicator ? " showValueIndicator" : ""}${pgDisabled ? " disabled" : ""} />`;

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Slider
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Sliders allow users to make selections from a range of values. They
          are ideal for adjusting settings such as volume, brightness, or
          applying image filters.
        </p>
      </div>

      {/* Interactive Playground */}
      <Playground
        title="Playground"
        code={pgCode}
        controls={
          <>
            <div>
              <span className="text-[12px] font-medium text-surface-variant-foreground block mb-1.5">Value: {pgValue}</span>
              <Slider value={pgValue} onValueChange={setPgValue} min={0} max={100} step={1} />
            </div>
            <div>
              <span className="text-[12px] font-medium text-surface-variant-foreground block mb-1.5">Step</span>
              <div className="flex flex-wrap gap-1">
                {([1, 5, 10, 25] as const).map((s) => (
                  <Chip key={s} variant="filter" selected={pgStep === s} onClick={() => setPgStep(s)}>
                    {s}
                  </Chip>
                ))}
              </div>
            </div>
            <div className="space-y-3 pt-1">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[13px] text-surface-foreground">Show value indicator</span>
                <Switch checked={pgShowValueIndicator} onCheckedChange={setPgShowValueIndicator} />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[13px] text-surface-foreground">Disabled</span>
                <Switch checked={pgDisabled} onCheckedChange={setPgDisabled} />
              </label>
            </div>
          </>
        }
      >
        <div className="w-64">
          <Slider
            value={pgValue}
            onValueChange={setPgValue}
            min={0}
            max={100}
            step={pgStep}
            showValueIndicator={pgShowValueIndicator}
            disabled={pgDisabled}
          />
        </div>
      </Playground>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Continuous</h2>
        <Showcase title="Continuous Slider" className="flex-col items-stretch" code={`<Slider value={value} onValueChange={setValue} min={0} max={100} />`}>
          <Slider value={value} onValueChange={setValue} min={0} max={100} />
          <p className="text-sm text-surface-variant-foreground">
            Value: {value}
          </p>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Discrete</h2>
        <Showcase title="Discrete Slider (step: 10)" className="flex-col items-stretch" code={`<Slider value={value} onValueChange={setValue} min={0} max={100} step={10} />`}>
          <Slider
            value={discreteValue}
            onValueChange={setDiscreteValue}
            min={0}
            max={100}
            step={10}
          />
          <p className="text-sm text-surface-variant-foreground">
            Value: {discreteValue}
          </p>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Value Indicator</h2>
        <Showcase title="Value Indicator" className="flex-col items-stretch" code={`<Slider defaultValue={60} min={0} max={100} showValueIndicator />`}>
          <Slider
            defaultValue={60}
            min={0}
            max={100}
            showValueIndicator
          />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Disabled</h2>
        <Showcase title="Disabled Slider" className="flex-col items-stretch" code={`<Slider defaultValue={30} min={0} max={100} disabled />`}>
          <Slider defaultValue={30} min={0} max={100} disabled />
        </Showcase>
      </section>
    </div>
  );
}

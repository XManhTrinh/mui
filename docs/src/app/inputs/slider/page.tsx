"use client";

import * as React from "react";
import { Slider } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function SliderPage() {
  const [value, setValue] = React.useState(50);
  const [discreteValue, setDiscreteValue] = React.useState(40);

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

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Continuous</h2>
        <Showcase title="Continuous Slider" className="flex-col items-stretch">
          <Slider value={value} onValueChange={setValue} min={0} max={100} />
          <p className="text-sm text-surface-variant-foreground">
            Value: {value}
          </p>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Discrete</h2>
        <Showcase title="Discrete Slider (step: 10)" className="flex-col items-stretch">
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
        <Showcase title="Value Indicator" className="flex-col items-stretch">
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
        <Showcase title="Disabled Slider" className="flex-col items-stretch">
          <Slider defaultValue={30} min={0} max={100} disabled />
        </Showcase>
      </section>
    </div>
  );
}

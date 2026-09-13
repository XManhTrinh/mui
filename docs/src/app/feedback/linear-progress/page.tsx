"use client";

import * as React from "react";
import { LinearProgress, Chip, Switch } from "@mui/index";
import { Showcase, Playground } from "@/components/showcase";
import { PropsTable } from "@/components/props-table";

export default function LinearProgressPage() {
  // Playground state
  const [pgDeterminate, setPgDeterminate] = React.useState(true);
  const [pgValue, setPgValue] = React.useState(50);

  const pgCode = pgDeterminate
    ? `<LinearProgress value={${pgValue}} />`
    : `<LinearProgress />`;

  return (
    <div className="max-w-4xl space-y-8">
      {/* Hero */}
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Linear Progress
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Linear progress indicators display the length of a process along a
          horizontal track. Use determinate mode when the percentage is known,
          and indeterminate mode when wait time is uncertain.
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
                <span className="text-[13px] text-surface-foreground">Determinate</span>
                <Switch checked={pgDeterminate} onCheckedChange={setPgDeterminate} />
              </label>
            </div>
            {pgDeterminate && (
              <div>
                <span className="text-[12px] font-medium text-surface-variant-foreground block mb-1.5">
                  Value: {pgValue}
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={pgValue}
                  onChange={(e) => setPgValue(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </>
        }
      >
        <div className="w-full max-w-xs">
          <LinearProgress value={pgDeterminate ? pgValue : undefined} />
        </div>
      </Playground>

      {/* Determinate */}
      <Showcase
        title="Determinate"
        className="flex-col items-stretch"
        code={`<LinearProgress value={0} />\n<LinearProgress value={25} />\n<LinearProgress value={50} />\n<LinearProgress value={75} />\n<LinearProgress value={100} />`}
      >
        <LinearProgress value={0} />
        <LinearProgress value={25} />
        <LinearProgress value={50} />
        <LinearProgress value={75} />
        <LinearProgress value={100} />
      </Showcase>

      {/* Indeterminate */}
      <Showcase
        title="Indeterminate"
        className="flex-col items-stretch"
        code={`<LinearProgress />`}
      >
        <LinearProgress />
      </Showcase>

      {/* Wavy Determinate */}
      <Showcase
        title="Wavy Determinate"
        className="flex-col items-stretch"
        code={`<LinearProgress value={30} wave />\n<LinearProgress value={60} wave />\n<LinearProgress value={90} wave />`}
      >
        <LinearProgress value={30} wave />
        <LinearProgress value={60} wave />
        <LinearProgress value={90} wave />
      </Showcase>

      {/* Props Table */}
      <PropsTable
        componentName="LinearProgress"
        props={[
          { name: "value", type: "number", description: "Progress value from 0 to 100. Omit for indeterminate mode." },
          { name: "wave", type: "boolean", default: "false", description: "Render the active indicator as an animated sine wave per M3 Expressive" },
          { name: "className", type: "string", description: "Additional Tailwind classes" },
          { name: "aria-label", type: "string", description: "Accessible label for the progress bar" },
        ]}
      />
    </div>
  );
}

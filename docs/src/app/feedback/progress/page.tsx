"use client";

import * as React from "react";
import { LinearProgress, CircularProgress, LoadingIndicator, Chip, Switch } from "@mui/index";
import { Showcase, Playground } from "@/components/showcase";

export default function ProgressPage() {
  // Playground state
  const [pgDeterminate, setPgDeterminate] = React.useState(true);
  const [pgValue, setPgValue] = React.useState(50);

  const pgCode = pgDeterminate
    ? `<LinearProgress value={${pgValue}} />\n<CircularProgress value={${pgValue}} />`
    : `<LinearProgress />\n<CircularProgress />`;

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Progress Indicators
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Progress indicators inform users about the status of ongoing
          processes, such as loading an app, submitting a form, or saving
          updates.
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
                <span className="text-[12px] font-medium text-surface-variant-foreground block mb-1.5">Value: {pgValue}</span>
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
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="w-full max-w-xs">
            <LinearProgress value={pgDeterminate ? pgValue : undefined} />
          </div>
          <CircularProgress value={pgDeterminate ? pgValue : undefined} />
        </div>
      </Playground>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Linear Progress</h2>
        <Showcase title="Determinate" className="flex-col items-stretch" code={`<LinearProgress value={50} />`}>
          <LinearProgress value={0} />
          <LinearProgress value={25} />
          <LinearProgress value={50} />
          <LinearProgress value={75} />
          <LinearProgress value={100} />
        </Showcase>
        <Showcase title="Indeterminate" className="flex-col items-stretch" code={`<LinearProgress />`}>
          <LinearProgress />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Circular Progress</h2>
        <Showcase title="Determinate" code={`<CircularProgress value={50} />`}>
          <CircularProgress value={0} />
          <CircularProgress value={25} />
          <CircularProgress value={50} />
          <CircularProgress value={75} />
          <CircularProgress value={100} />
        </Showcase>
        <Showcase title="Indeterminate" code={`<CircularProgress />`}>
          <CircularProgress />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Loading Indicator</h2>
        <Showcase title="Loading States" code={`<LoadingIndicator />\n<LoadingIndicator size="sm" />\n<LoadingIndicator size="md" />\n<LoadingIndicator size="lg" />`}>
          <LoadingIndicator />
          <LoadingIndicator size="sm" />
          <LoadingIndicator size="md" />
          <LoadingIndicator size="lg" />
        </Showcase>
      </section>
    </div>
  );
}

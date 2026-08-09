"use client";

import * as React from "react";
import { LinearProgress, CircularProgress, LoadingIndicator } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function ProgressPage() {
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

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Linear Progress</h2>
        <Showcase title="Determinate" className="flex-col items-stretch">
          <LinearProgress value={0} />
          <LinearProgress value={25} />
          <LinearProgress value={50} />
          <LinearProgress value={75} />
          <LinearProgress value={100} />
        </Showcase>
        <Showcase title="Indeterminate" className="flex-col items-stretch">
          <LinearProgress />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Circular Progress</h2>
        <Showcase title="Determinate">
          <CircularProgress value={0} />
          <CircularProgress value={25} />
          <CircularProgress value={50} />
          <CircularProgress value={75} />
          <CircularProgress value={100} />
        </Showcase>
        <Showcase title="Indeterminate">
          <CircularProgress />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Loading Indicator</h2>
        <Showcase title="Loading States">
          <LoadingIndicator />
          <LoadingIndicator size="sm" />
          <LoadingIndicator size="md" />
          <LoadingIndicator size="lg" />
        </Showcase>
      </section>
    </div>
  );
}

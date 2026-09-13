"use client";

import * as React from "react";
import { CircularProgress } from "@mui/index";
import { Showcase } from "@/components/showcase";
import { PropsTable } from "@/components/props-table";

export default function CircularProgressPage() {
  return (
    <div className="max-w-4xl space-y-8">
      {/* Hero */}
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Circular Progress
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Circular progress indicators display progress as a growing arc around
          a circle. Use determinate mode when the percentage is known, and
          indeterminate mode when wait time is uncertain. The wavy variant adds
          M3 Expressive sine-perturbed animation.
        </p>
      </div>

      {/* Determinate */}
      <Showcase
        title="Determinate"
        code={`<CircularProgress value={0} />\n<CircularProgress value={25} />\n<CircularProgress value={50} />\n<CircularProgress value={75} />\n<CircularProgress value={100} />`}
      >
        <CircularProgress value={0} />
        <CircularProgress value={25} />
        <CircularProgress value={50} />
        <CircularProgress value={75} />
        <CircularProgress value={100} />
      </Showcase>

      {/* Indeterminate */}
      <Showcase
        title="Indeterminate"
        code={`<CircularProgress />`}
      >
        <CircularProgress />
      </Showcase>

      {/* Wavy Indeterminate */}
      <Showcase
        title="Wavy Indeterminate"
        code={`<CircularProgress wave />`}
      >
        <CircularProgress wave />
      </Showcase>

      {/* Wavy Determinate */}
      <Showcase
        title="Wavy Determinate"
        code={`<CircularProgress value={25} wave />\n<CircularProgress value={50} wave />\n<CircularProgress value={75} wave />`}
      >
        <CircularProgress value={25} wave />
        <CircularProgress value={50} wave />
        <CircularProgress value={75} wave />
      </Showcase>

      {/* Props Table */}
      <PropsTable
        componentName="CircularProgress"
        props={[
          { name: "value", type: "number", description: "Progress value from 0 to 100. Omit for indeterminate mode." },
          { name: "wave", type: "boolean", default: "false", description: "Render the arc as a sine-perturbed wave per M3 Expressive" },
          { name: "size", type: "number", default: "40", description: "Diameter of the circular indicator in pixels" },
          { name: "className", type: "string", description: "Additional Tailwind classes" },
          { name: "aria-label", type: "string", description: "Accessible label for the progress indicator" },
        ]}
      />
    </div>
  );
}

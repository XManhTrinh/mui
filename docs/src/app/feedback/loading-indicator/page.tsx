"use client";

import * as React from "react";
import { LoadingIndicator } from "@mui/index";
import { Showcase } from "@/components/showcase";
import { PropsTable } from "@/components/props-table";

export default function LoadingIndicatorPage() {
  return (
    <div className="max-w-4xl space-y-8">
      {/* Hero */}
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Loading Indicator
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          A convenience wrapper for short processes that typically take less than
          5 seconds. Renders a compact animated indicator in small, medium, or
          large sizes. Use this for inline loading states where a full progress
          bar is unnecessary.
        </p>
      </div>

      {/* All 3 sizes */}
      <Showcase
        title="All Sizes"
        code={`<LoadingIndicator size="sm" />\n<LoadingIndicator size="md" />\n<LoadingIndicator size="lg" />`}
      >
        <LoadingIndicator size="sm" />
        <LoadingIndicator size="md" />
        <LoadingIndicator size="lg" />
      </Showcase>

      {/* Default (no size prop) */}
      <Showcase
        title="Default (no size prop)"
        code={`<LoadingIndicator />`}
      >
        <LoadingIndicator />
      </Showcase>

      {/* Props Table */}
      <PropsTable
        componentName="LoadingIndicator"
        props={[
          { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Size of the loading indicator" },
          { name: "className", type: "string", description: "Additional Tailwind classes" },
        ]}
      />
    </div>
  );
}

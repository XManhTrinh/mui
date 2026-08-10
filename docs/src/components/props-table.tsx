"use client";

import * as React from "react";
import { Icon } from "@mui/index";

export interface PropDef {
  name: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}

interface PropsTableProps {
  componentName: string;
  props: PropDef[];
}

export function PropsTable({ componentName, props }: PropsTableProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-[22px] leading-7 font-normal text-surface-foreground">
        {componentName} Props
      </h2>
      <div className="rounded-2xl border border-outline-variant overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-[minmax(120px,1fr)_minmax(140px,1.5fr)_minmax(80px,0.7fr)_minmax(160px,2fr)] bg-surface-container px-4 py-2.5 border-b border-outline-variant">
          <div className="text-sm font-medium text-surface-foreground">Prop</div>
          <div className="text-sm font-medium text-surface-foreground">Type</div>
          <div className="text-sm font-medium text-surface-foreground">Default</div>
          <div className="text-sm font-medium text-surface-foreground">Description</div>
        </div>
        {/* Rows */}
        {props.map((prop, index) => (
          <div
            key={prop.name}
            className={`grid grid-cols-[minmax(120px,1fr)_minmax(140px,1.5fr)_minmax(80px,0.7fr)_minmax(160px,2fr)] px-4 py-2.5 ${
              index < props.length - 1 ? "border-b border-outline-variant" : ""
            }`}
          >
            <div className="flex items-center gap-1">
              <code className="text-xs font-mono text-surface-foreground">
                {prop.name}
              </code>
              {prop.required && (
                <Icon name="star" size={12} className="text-error" />
              )}
            </div>
            <div>
              <code className="text-xs font-mono text-surface-variant-foreground">
                {prop.type}
              </code>
            </div>
            <div>
              <code className="text-xs font-mono text-surface-variant-foreground">
                {prop.default ?? "—"}
              </code>
            </div>
            <div className="text-sm text-surface-variant-foreground">
              {prop.description}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

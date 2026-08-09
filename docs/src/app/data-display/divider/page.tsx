"use client";

import * as React from "react";
import { Divider } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function DividerPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Divider
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Dividers are thin lines that group content in lists and containers.
          They come in full-width, inset, and middle-inset variants.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Full Width</h2>
        <Showcase title="Full-Width Divider" className="flex-col items-stretch" code={`<Divider variant="full" />`}>
          <p className="text-sm text-surface-foreground">Content above</p>
          <Divider variant="full" />
          <p className="text-sm text-surface-foreground">Content below</p>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Inset</h2>
        <Showcase title="Inset Divider" className="flex-col items-stretch" code={`<Divider variant="inset" />`}>
          <p className="text-sm text-surface-foreground">Content above</p>
          <Divider variant="inset" />
          <p className="text-sm text-surface-foreground">Content below</p>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Middle Inset</h2>
        <Showcase title="Middle-Inset Divider" className="flex-col items-stretch" code={`<Divider variant="middle-inset" />`}>
          <p className="text-sm text-surface-foreground">Content above</p>
          <Divider variant="middle-inset" />
          <p className="text-sm text-surface-foreground">Content below</p>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">In Context</h2>
        <Showcase title="Divider in a List" className="flex-col items-stretch" code={`<div>\n  <div>Item 1</div>\n  <Divider variant="inset" />\n  <div>Item 2</div>\n  <Divider variant="inset" />\n  <div>Item 3</div>\n</div>`}>
          <div className="space-y-0">
            <div className="py-3 px-4">
              <p className="text-sm font-medium text-surface-foreground">Item 1</p>
              <p className="text-xs text-surface-variant-foreground">Supporting text</p>
            </div>
            <Divider variant="inset" />
            <div className="py-3 px-4">
              <p className="text-sm font-medium text-surface-foreground">Item 2</p>
              <p className="text-xs text-surface-variant-foreground">Supporting text</p>
            </div>
            <Divider variant="inset" />
            <div className="py-3 px-4">
              <p className="text-sm font-medium text-surface-foreground">Item 3</p>
              <p className="text-xs text-surface-variant-foreground">Supporting text</p>
            </div>
          </div>
        </Showcase>
      </section>
    </div>
  );
}

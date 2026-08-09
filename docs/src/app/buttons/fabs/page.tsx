"use client";

import * as React from "react";
import { FAB, ExtendedFAB, Icon } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function FABsPage() {
  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-surface-foreground mb-1">
          Floating Action Buttons
        </h1>
        <p className="text-surface-variant-foreground">
          FABs represent the most important action on a screen. They come in
          standard and extended variants with multiple sizes and colors.
        </p>
      </div>

      <Showcase title="FAB Sizes">
        <FAB size="m" icon={<Icon name="add" />} aria-label="Add" />
        <FAB size="l" icon={<Icon name="add" />} aria-label="Add" />
        <FAB size="xl" icon={<Icon name="add" />} aria-label="Add" />
      </Showcase>

      <Showcase title="FAB Colors">
        <FAB color="primary" icon={<Icon name="edit" />} aria-label="Edit" />
        <FAB color="secondary" icon={<Icon name="edit" />} aria-label="Edit" />
        <FAB color="tertiary" icon={<Icon name="edit" />} aria-label="Edit" />
      </Showcase>

      <Showcase title="FAB Round Shape">
        <FAB shape="round" size="m" icon={<Icon name="navigation" />} aria-label="Navigate" />
        <FAB shape="round" size="l" icon={<Icon name="navigation" />} aria-label="Navigate" />
        <FAB shape="round" size="xl" icon={<Icon name="navigation" />} aria-label="Navigate" />
      </Showcase>

      <Showcase title="Extended FAB Sizes">
        <ExtendedFAB size="small" icon={<Icon name="add" />} label="Create" />
        <ExtendedFAB size="medium" icon={<Icon name="edit" />} label="Compose" />
        <ExtendedFAB size="large" icon={<Icon name="navigation" />} label="Navigate" />
      </Showcase>

      <Showcase title="Extended FAB Colors">
        <ExtendedFAB color="primary" icon={<Icon name="add" />} label="Primary" />
        <ExtendedFAB color="secondary" icon={<Icon name="add" />} label="Secondary" />
        <ExtendedFAB color="tertiary" icon={<Icon name="add" />} label="Tertiary" />
      </Showcase>

      <Showcase title="Extended FAB without Icon">
        <ExtendedFAB size="medium" label="No Icon" />
      </Showcase>

      {/* Props Table */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">FAB Props</h2>
        <div className="overflow-x-auto rounded-xl border border-outline-variant">
          <table className="w-full text-sm">
            <thead className="bg-surface-container">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Prop</th>
                <th className="text-left px-4 py-2 font-medium">Type</th>
                <th className="text-left px-4 py-2 font-medium">Default</th>
                <th className="text-left px-4 py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              <tr>
                <td className="px-4 py-2 font-mono text-xs">size</td>
                <td className="px-4 py-2 font-mono text-xs">{`"m" | "l" | "xl"`}</td>
                <td className="px-4 py-2 font-mono text-xs">{`"l"`}</td>
                <td className="px-4 py-2">FAB size</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">color</td>
                <td className="px-4 py-2 font-mono text-xs">{`"primary" | "secondary" | "tertiary"`}</td>
                <td className="px-4 py-2 font-mono text-xs">{`"primary"`}</td>
                <td className="px-4 py-2">Color scheme</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">shape</td>
                <td className="px-4 py-2 font-mono text-xs">{`"square" | "round"`}</td>
                <td className="px-4 py-2 font-mono text-xs">{`"square"`}</td>
                <td className="px-4 py-2">Border radius shape</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">icon</td>
                <td className="px-4 py-2 font-mono text-xs">ReactNode</td>
                <td className="px-4 py-2 font-mono text-xs">—</td>
                <td className="px-4 py-2">Icon element</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-semibold">ExtendedFAB Props</h2>
        <div className="overflow-x-auto rounded-xl border border-outline-variant">
          <table className="w-full text-sm">
            <thead className="bg-surface-container">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Prop</th>
                <th className="text-left px-4 py-2 font-medium">Type</th>
                <th className="text-left px-4 py-2 font-medium">Default</th>
                <th className="text-left px-4 py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              <tr>
                <td className="px-4 py-2 font-mono text-xs">size</td>
                <td className="px-4 py-2 font-mono text-xs">{`"small" | "medium" | "large"`}</td>
                <td className="px-4 py-2 font-mono text-xs">{`"medium"`}</td>
                <td className="px-4 py-2">Extended FAB size</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">color</td>
                <td className="px-4 py-2 font-mono text-xs">{`"primary" | "secondary" | "tertiary"`}</td>
                <td className="px-4 py-2 font-mono text-xs">{`"primary"`}</td>
                <td className="px-4 py-2">Color scheme</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">icon</td>
                <td className="px-4 py-2 font-mono text-xs">ReactNode</td>
                <td className="px-4 py-2 font-mono text-xs">—</td>
                <td className="px-4 py-2">Optional leading icon</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">label</td>
                <td className="px-4 py-2 font-mono text-xs">string</td>
                <td className="px-4 py-2 font-mono text-xs">—</td>
                <td className="px-4 py-2">Text label</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

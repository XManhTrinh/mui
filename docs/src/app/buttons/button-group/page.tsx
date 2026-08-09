"use client";

import * as React from "react";
import { ButtonGroup, ButtonGroupItem, Icon } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function ButtonGroupPage() {
  const [selected, setSelected] = React.useState("center");

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Button Group
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Button groups organize related actions together, allowing users to
          select from a set of options. They come in connected and standard
          variants.
        </p>
      </div>

      <Showcase title="Connected Button Group" code={`<ButtonGroup variant="connected">\n  <ButtonGroupItem value="left" label="Left" />\n  <ButtonGroupItem value="center" label="Center" />\n  <ButtonGroupItem value="right" label="Right" />\n</ButtonGroup>`}>
        <ButtonGroup variant="connected">
          <ButtonGroupItem value="left" label="Left" />
          <ButtonGroupItem value="center" label="Center" />
          <ButtonGroupItem value="right" label="Right" />
        </ButtonGroup>
      </Showcase>

      <Showcase title="Standard Button Group" code={`<ButtonGroup variant="standard">\n  <ButtonGroupItem value="a" label="Option A" />\n  <ButtonGroupItem value="b" label="Option B" />\n  <ButtonGroupItem value="c" label="Option C" />\n</ButtonGroup>`}>
        <ButtonGroup variant="standard">
          <ButtonGroupItem value="a" label="Option A" />
          <ButtonGroupItem value="b" label="Option B" />
          <ButtonGroupItem value="c" label="Option C" />
        </ButtonGroup>
      </Showcase>

      <Showcase title="Controlled Button Group" code={`<ButtonGroup variant="connected" value={selected} onValueChange={setSelected}>\n  <ButtonGroupItem value="left" label="Left" />\n  <ButtonGroupItem value="center" label="Center" />\n  <ButtonGroupItem value="right" label="Right" />\n</ButtonGroup>`}>
        <div className="flex flex-col gap-4">
          <ButtonGroup variant="connected" value={selected} onValueChange={(v) => setSelected(Array.isArray(v) ? v[0] : v)}>
            <ButtonGroupItem value="left" label="Left" />
            <ButtonGroupItem value="center" label="Center" />
            <ButtonGroupItem value="right" label="Right" />
          </ButtonGroup>
          <p className="text-sm text-surface-variant-foreground">
            Selected: <strong>{selected}</strong>
          </p>
        </div>
      </Showcase>

      <Showcase title="Multi-Option Group" code={`<ButtonGroup variant="connected">\n  <ButtonGroupItem value="bold" label="B" />\n  <ButtonGroupItem value="italic" label="I" />\n  <ButtonGroupItem value="underline" label="U" />\n  <ButtonGroupItem value="strike" label="S" />\n</ButtonGroup>`}>
        <ButtonGroup variant="connected">
          <ButtonGroupItem value="bold" label="B" />
          <ButtonGroupItem value="italic" label="I" />
          <ButtonGroupItem value="underline" label="U" />
          <ButtonGroupItem value="strike" label="S" />
        </ButtonGroup>
      </Showcase>

      {/* Props Table */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Props</h2>
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
                <td className="px-4 py-2 font-mono text-xs">variant</td>
                <td className="px-4 py-2 font-mono text-xs">{`"connected" | "standard"`}</td>
                <td className="px-4 py-2 font-mono text-xs">{`"connected"`}</td>
                <td className="px-4 py-2">Visual grouping style</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">value</td>
                <td className="px-4 py-2 font-mono text-xs">string</td>
                <td className="px-4 py-2 font-mono text-xs">—</td>
                <td className="px-4 py-2">Controlled selected value</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">onValueChange</td>
                <td className="px-4 py-2 font-mono text-xs">{`(value: string) => void`}</td>
                <td className="px-4 py-2 font-mono text-xs">—</td>
                <td className="px-4 py-2">Callback when selection changes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

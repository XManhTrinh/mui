"use client";

import * as React from "react";
import { Chip, Switch } from "@mui/index";
import { Showcase, Playground } from "@/components/showcase";
import { PropsTable, type PropDef } from "@/components/props-table";

export default function ChipsPage() {
  const [selected, setSelected] = React.useState(false);

  // Playground state
  const [pgVariant, setPgVariant] = React.useState<"assist" | "filter" | "input" | "suggestion">("filter");
  const [pgSelected, setPgSelected] = React.useState(false);
  const [pgElevated, setPgElevated] = React.useState(false);

  const pgCode = `<Chip variant="${pgVariant}"${pgSelected ? " selected" : ""}${pgElevated ? " elevated" : ""}>Label</Chip>`;

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Chips
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Chips help people enter information, make selections, filter content,
          or trigger actions.
        </p>
      </div>

      {/* Interactive Playground */}
      <Playground
        title="Playground"
        code={pgCode}
        controls={
          <>
            <div>
              <span className="text-[12px] font-medium text-surface-variant-foreground block mb-1.5">Variant</span>
              <div className="flex flex-wrap gap-1">
                {(["assist", "filter", "input", "suggestion"] as const).map((v) => (
                  <Chip key={v} variant="filter" selected={pgVariant === v} onClick={() => setPgVariant(v)}>
                    {v}
                  </Chip>
                ))}
              </div>
            </div>
            <div className="space-y-3 pt-1">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[13px] text-surface-foreground">Selected</span>
                <Switch checked={pgSelected} onCheckedChange={setPgSelected} />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[13px] text-surface-foreground">Elevated</span>
                <Switch checked={pgElevated} onCheckedChange={setPgElevated} />
              </label>
            </div>
          </>
        }
      >
        <Chip variant={pgVariant} selected={pgSelected} elevated={pgElevated}>
          Label
        </Chip>
      </Playground>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Assist Chips</h2>
        <Showcase title="Assist" code={`<Chip variant="assist" leadingIcon="event">Add to calendar</Chip>`}>
          <Chip variant="assist" leadingIcon="event">Add to calendar</Chip>
          <Chip variant="assist" leadingIcon="directions">Get directions</Chip>
          <Chip variant="assist" leadingIcon="share">Share</Chip>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Filter Chips</h2>
        <Showcase title="Filter" code={`<Chip variant="filter" selected={selected} onClick={() => setSelected(!selected)}>Running</Chip>`}>
          <Chip
            variant="filter"
            selected={selected}
            onClick={() => setSelected((s) => !s)}
          >Running</Chip>
          <Chip variant="filter">Walking</Chip>
          <Chip variant="filter" selected>Cycling</Chip>
          <Chip variant="filter">Swimming</Chip>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Input Chips</h2>
        <Showcase title="Input" code={`<Chip variant="input" onDismiss={() => {}}>john@example.com</Chip>`}>
          <Chip variant="input" onDismiss={() => {}}>john@example.com</Chip>
          <Chip variant="input" onDismiss={() => {}}>jane@example.com</Chip>
          <Chip variant="input" onDismiss={() => {}}>bob@example.com</Chip>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Suggestion Chips</h2>
        <Showcase title="Suggestion" code={`<Chip variant="suggestion">Price: Low to High</Chip>`}>
          <Chip variant="suggestion">Price: Low to High</Chip>
          <Chip variant="suggestion">Top Rated</Chip>
          <Chip variant="suggestion">Nearby</Chip>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Leading Avatar</h2>
        <Showcase title="Leading Avatar" code={`<Chip\n  variant="input"\n  leadingElement={\n    <img src="https://i.pravatar.cc/36" alt="" className="size-full object-cover" />\n  }\n>\n  John Doe\n</Chip>`}>
          <Chip variant="input" leadingElement={<img src="https://i.pravatar.cc/36" alt="" className="size-full object-cover" />}>
            John Doe
          </Chip>
          <Chip variant="input" leadingElement={<img src="https://i.pravatar.cc/36?u=jane" alt="" className="size-full object-cover" />} onDismiss={() => {}}>
            Jane Smith
          </Chip>
        </Showcase>
      </section>

      <PropsTable
        componentName="Chip"
        props={[
          { name: "variant", type: '"assist" | "filter" | "input" | "suggestion"', default: '"assist"', description: "Chip style variant" },
          { name: "selected", type: "boolean", default: "false", description: "Whether the chip is selected (filter chips)" },
          { name: "elevated", type: "boolean", default: "false", description: "Apply elevated shadow style" },
          { name: "leadingIcon", type: "string", description: "Material Symbols icon name shown before the label" },
          { name: "leadingElement", type: "ReactNode", description: "Leading element (avatar, image) — overrides leadingIcon when provided" },
          { name: "onDismiss", type: "() => void", description: "Callback when the dismiss button is clicked (input chips)" },
          { name: "onClick", type: "() => void", description: "Callback when the chip is clicked" },
          { name: "disabled", type: "boolean", default: "false", description: "Disable the chip" },
          { name: "children", type: "ReactNode", description: "Chip label content", required: true },
        ]}
      />
    </div>
  );
}

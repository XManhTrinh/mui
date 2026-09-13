"use client";

import * as React from "react";
import { ButtonGroup, ButtonGroupItem, Icon } from "@mui/index";
import { Showcase } from "@/components/showcase";
import { PropsTable, type PropDef } from "@/components/props-table";

const buttonGroupProps: PropDef[] = [
  {
    name: "variant",
    type: '"connected" | "standard"',
    default: '"connected"',
    description: "Visual grouping style: connected (joined segments) or standard (spaced)",
  },
  {
    name: "selectionMode",
    type: '"single" | "multiple" | "selection-required"',
    default: '"single"',
    description: "Selection behavior: single toggle, multiple checkboxes, or at-least-one required",
  },
  {
    name: "value",
    type: "string | string[]",
    description: "Controlled selected value(s)",
  },
  {
    name: "defaultValue",
    type: "string | string[]",
    description: "Uncontrolled default selected value(s)",
  },
  {
    name: "onValueChange",
    type: "(value: string | string[]) => void",
    description: "Callback when selection changes. Returns string for single/selection-required, string[] for multiple.",
  },
  {
    name: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    default: '"m"',
    description: "Button size: xs (32dp), s (36dp), m (40dp), l (48dp), xl (56dp)",
  },
  {
    name: "shape",
    type: '"round" | "square"',
    default: '"round"',
    description: "Corner shape for the group items",
  },
  {
    name: "equalWidth",
    type: "boolean",
    default: "false",
    description: "Makes all items flex to equal width",
  },
  {
    name: "children",
    type: "ReactNode",
    required: true,
    description: "ButtonGroupItem elements",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes for the container",
  },
];

const buttonGroupItemProps: PropDef[] = [
  {
    name: "value",
    type: "string",
    required: true,
    description: "Unique value identifier for this item",
  },
  {
    name: "icon",
    type: "string",
    description: "Material Symbols icon name (shown when unselected; replaced by checkmark when selected)",
  },
  {
    name: "label",
    type: "string",
    description: "Text label for the item",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disables this item",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes",
  },
];

export default function ButtonGroupPage() {
  const [selected, setSelected] = React.useState("center");
  const [multiSelected, setMultiSelected] = React.useState<string[]>(["bold"]);
  const [requiredSelected, setRequiredSelected] = React.useState("a");

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Button Group
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Button groups organize related actions together, allowing users to
          select from a set of options. They come in connected and standard
          variants with keyboard navigation (Arrow keys, Home/End) and
          proper ARIA roles.
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

      <Showcase title="Controlled" code={`<ButtonGroup variant="connected" value={selected} onValueChange={setSelected}>\n  <ButtonGroupItem value="left" label="Left" />\n  <ButtonGroupItem value="center" label="Center" />\n  <ButtonGroupItem value="right" label="Right" />\n</ButtonGroup>`}>
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

      {/* Selection Mode: single (default) */}
      <Showcase
        title='Selection Mode: "single" (default)'
        code={`<ButtonGroup selectionMode="single" value={selected} onValueChange={setSelected}>\n  <ButtonGroupItem value="left" label="Left" />\n  <ButtonGroupItem value="center" label="Center" />\n  <ButtonGroupItem value="right" label="Right" />\n</ButtonGroup>`}
      >
        <ButtonGroup selectionMode="single" value={selected} onValueChange={(v) => setSelected(Array.isArray(v) ? v[0] : v)}>
          <ButtonGroupItem value="left" label="Left" />
          <ButtonGroupItem value="center" label="Center" />
          <ButtonGroupItem value="right" label="Right" />
        </ButtonGroup>
      </Showcase>

      {/* Selection Mode: multiple */}
      <Showcase
        title='Selection Mode: "multiple"'
        code={`<ButtonGroup selectionMode="multiple" value={multiSelected} onValueChange={setMultiSelected}>\n  <ButtonGroupItem value="bold" label="B" />\n  <ButtonGroupItem value="italic" label="I" />\n  <ButtonGroupItem value="underline" label="U" />\n  <ButtonGroupItem value="strike" label="S" />\n</ButtonGroup>`}
      >
        <div className="flex flex-col gap-4">
          <ButtonGroup
            selectionMode="multiple"
            value={multiSelected}
            onValueChange={(v) => setMultiSelected(Array.isArray(v) ? v : [v])}
          >
            <ButtonGroupItem value="bold" label="B" />
            <ButtonGroupItem value="italic" label="I" />
            <ButtonGroupItem value="underline" label="U" />
            <ButtonGroupItem value="strike" label="S" />
          </ButtonGroup>
          <p className="text-sm text-surface-variant-foreground">
            Selected: <strong>{multiSelected.join(", ") || "none"}</strong>
          </p>
        </div>
      </Showcase>

      {/* Selection Mode: selection-required */}
      <Showcase
        title='Selection Mode: "selection-required"'
        code={`<ButtonGroup selectionMode="selection-required" value={selected} onValueChange={setSelected}>\n  <ButtonGroupItem value="a" label="Option A" />\n  <ButtonGroupItem value="b" label="Option B" />\n  <ButtonGroupItem value="c" label="Option C" />\n</ButtonGroup>`}
      >
        <div className="flex flex-col gap-4">
          <ButtonGroup
            selectionMode="selection-required"
            value={requiredSelected}
            onValueChange={(v) => setRequiredSelected(Array.isArray(v) ? v[0] : v)}
          >
            <ButtonGroupItem value="a" label="Option A" />
            <ButtonGroupItem value="b" label="Option B" />
            <ButtonGroupItem value="c" label="Option C" />
          </ButtonGroup>
          <p className="text-sm text-surface-variant-foreground">
            Cannot deselect the last item — always at least one selected: <strong>{requiredSelected}</strong>
          </p>
        </div>
      </Showcase>

      {/* Sizes */}
      <Showcase
        title="Sizes"
        code={`<ButtonGroup size="xs">...</ButtonGroup>\n<ButtonGroup size="s">...</ButtonGroup>\n<ButtonGroup size="m">...</ButtonGroup>\n<ButtonGroup size="l">...</ButtonGroup>\n<ButtonGroup size="xl">...</ButtonGroup>`}
      >
        <div className="flex flex-col gap-4 items-start">
          {(["xs", "s", "m", "l", "xl"] as const).map((s) => (
            <ButtonGroup key={s} size={s}>
              <ButtonGroupItem value="a" label={`${s.toUpperCase()} - A`} />
              <ButtonGroupItem value="b" label={`${s.toUpperCase()} - B`} />
              <ButtonGroupItem value="c" label={`${s.toUpperCase()} - C`} />
            </ButtonGroup>
          ))}
        </div>
      </Showcase>

      {/* Shape */}
      <Showcase
        title="Shape"
        code={`<ButtonGroup shape="round">...</ButtonGroup>\n<ButtonGroup shape="square">...</ButtonGroup>`}
      >
        <div className="flex flex-col gap-4 items-start">
          <ButtonGroup shape="round">
            <ButtonGroupItem value="a" label="Round A" />
            <ButtonGroupItem value="b" label="Round B" />
            <ButtonGroupItem value="c" label="Round C" />
          </ButtonGroup>
          <ButtonGroup shape="square">
            <ButtonGroupItem value="a" label="Square A" />
            <ButtonGroupItem value="b" label="Square B" />
            <ButtonGroupItem value="c" label="Square C" />
          </ButtonGroup>
        </div>
      </Showcase>

      {/* Equal Width */}
      <Showcase
        title="Equal Width"
        code={`<ButtonGroup equalWidth className="w-full">\n  <ButtonGroupItem value="a" label="Short" />\n  <ButtonGroupItem value="b" label="Medium Text" />\n  <ButtonGroupItem value="c" label="A Longer Label" />\n</ButtonGroup>`}
      >
        <div className="w-full">
          <ButtonGroup equalWidth className="w-full">
            <ButtonGroupItem value="a" label="Short" />
            <ButtonGroupItem value="b" label="Medium Text" />
            <ButtonGroupItem value="c" label="A Longer Label" />
          </ButtonGroup>
        </div>
      </Showcase>

      {/* With Icons */}
      <Showcase title="With Icons" code={`<ButtonGroup variant="connected">\n  <ButtonGroupItem value="list" icon="view_list" label="List" />\n  <ButtonGroupItem value="grid" icon="grid_view" label="Grid" />\n  <ButtonGroupItem value="chart" icon="bar_chart" label="Chart" />\n</ButtonGroup>`}>
        <ButtonGroup variant="connected">
          <ButtonGroupItem value="list" icon="view_list" label="List" />
          <ButtonGroupItem value="grid" icon="grid_view" label="Grid" />
          <ButtonGroupItem value="chart" icon="bar_chart" label="Chart" />
        </ButtonGroup>
      </Showcase>

      {/* Props Tables */}
      <PropsTable componentName="ButtonGroup" props={buttonGroupProps} />
      <PropsTable componentName="ButtonGroupItem" props={buttonGroupItemProps} />
    </div>
  );
}

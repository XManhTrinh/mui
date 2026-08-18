"use client";

import * as React from "react";
import {
  Button,
  IconButton,
  FAB,
  ExtendedFAB,
  SplitButton,
  ButtonGroup,
  ButtonGroupItem,
  Icon,
  Chip,
  Switch,
} from "@mui/index";
import { Showcase, Playground } from "@/components/showcase";
import { PropsTable, type PropDef } from "@/components/props-table";

const buttonProps: PropDef[] = [
  {
    name: "variant",
    type: '"filled" | "outlined" | "text" | "elevated" | "tonal"',
    default: '"filled"',
    description: "Visual variant controlling color and elevation",
  },
  {
    name: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    default: '"m"',
    description: "Button height: xs(32dp), s(36dp), m(40dp), l(48dp), xl(56dp)",
  },
  {
    name: "square",
    type: "boolean",
    default: "false",
    description: "Use square corners instead of rounded (corner-full)",
  },
  {
    name: "icon",
    type: "ReactNode",
    description: "Leading icon element",
  },
  {
    name: "trailingIcon",
    type: "ReactNode",
    description: "Trailing icon element",
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    description: "Show loading spinner and disable interaction",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disable button interaction",
  },
  {
    name: "children",
    type: "ReactNode",
    description: "Button label content",
    required: true,
  },
  {
    name: "className",
    type: "string",
    description: "Additional Tailwind classes",
  },
];

export default function ButtonsPage() {
  const [loading, setLoading] = React.useState(false);
  const [togglePressed, setTogglePressed] = React.useState(false);

  // Playground state
  const [pgVariant, setPgVariant] = React.useState<"filled" | "outlined" | "text" | "elevated" | "tonal">("filled");
  const [pgSize, setPgSize] = React.useState<"xs" | "s" | "m" | "l" | "xl">("m");
  const [pgSquare, setPgSquare] = React.useState(false);
  const [pgIcon, setPgIcon] = React.useState(false);
  const [pgDisabled, setPgDisabled] = React.useState(false);

  const pgCode = `<Button variant="${pgVariant}" size="${pgSize}"${pgSquare ? " square" : ""}${pgIcon ? ' icon={<Icon name="add" />}' : ""}${pgDisabled ? " disabled" : ""}>
  Label
</Button>`;

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Buttons
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Buttons help people initiate actions, from sending an email, to sharing a document, to liking a post.
          Follows M3 Expressive specs with shape morph on press (<code>active:rounded-xl</code>).
          Default size is <code>m</code> (40dp).
        </p>
      </div>

      {/* Interactive Playground */}
      <Playground
        title="Playground"
        code={pgCode}
        controls={
          <>
            {/* Variant */}
            <div>
              <span className="text-[12px] font-medium text-surface-variant-foreground block mb-1.5">Variant</span>
              <div className="flex flex-wrap gap-1">
                {(["filled", "outlined", "text", "elevated", "tonal"] as const).map((v) => (
                  <Chip
                    key={v}
                    variant="filter"
                    selected={pgVariant === v}
                    onClick={() => setPgVariant(v)}
                  >
                    {v}
                  </Chip>
                ))}
              </div>
            </div>
            {/* Size */}
            <div>
              <span className="text-[12px] font-medium text-surface-variant-foreground block mb-1.5">Size</span>
              <div className="flex gap-1">
                {(["xs", "s", "m", "l", "xl"] as const).map((s) => (
                  <Chip
                    key={s}
                    variant="filter"
                    selected={pgSize === s}
                    onClick={() => setPgSize(s)}
                  >
                    {s}
                  </Chip>
                ))}
              </div>
            </div>
            {/* Boolean toggles */}
            <div className="space-y-3 pt-1">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[13px] text-surface-foreground">Square</span>
                <Switch checked={pgSquare} onCheckedChange={setPgSquare} />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[13px] text-surface-foreground">With icon</span>
                <Switch checked={pgIcon} onCheckedChange={setPgIcon} />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[13px] text-surface-foreground">Disabled</span>
                <Switch checked={pgDisabled} onCheckedChange={setPgDisabled} />
              </label>
            </div>
          </>
        }
      >
        <Button
          variant={pgVariant}
          size={pgSize}
          square={pgSquare}
          icon={pgIcon ? <Icon name="add" /> : undefined}
          disabled={pgDisabled}
        >
          Label
        </Button>
      </Playground>

      {/* Button Variants */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Variants</h2>

        <Showcase
          title="Filled"
          code={`<Button variant="filled">Save</Button>`}
        >
          <Button variant="filled" size="xs">XS</Button>
          <Button variant="filled" size="s">Small</Button>
          <Button variant="filled" size="m">Medium</Button>
          <Button variant="filled" size="l">Large</Button>
          <Button variant="filled" size="xl">XL</Button>
        </Showcase>

        <Showcase
          title="Outlined"
          code={`<Button variant="outlined">Cancel</Button>`}
        >
          <Button variant="outlined" size="xs">XS</Button>
          <Button variant="outlined" size="s">Small</Button>
          <Button variant="outlined" size="m">Medium</Button>
          <Button variant="outlined" size="l">Large</Button>
          <Button variant="outlined" size="xl">XL</Button>
        </Showcase>

        <Showcase
          title="Text"
          code={`<Button variant="text">Learn more</Button>`}
        >
          <Button variant="text" size="xs">XS</Button>
          <Button variant="text" size="s">Small</Button>
          <Button variant="text" size="m">Medium</Button>
          <Button variant="text" size="l">Large</Button>
          <Button variant="text" size="xl">XL</Button>
        </Showcase>

        <Showcase
          title="Elevated"
          code={`<Button variant="elevated">Open</Button>`}
        >
          <Button variant="elevated" size="xs">XS</Button>
          <Button variant="elevated" size="s">Small</Button>
          <Button variant="elevated" size="m">Medium</Button>
          <Button variant="elevated" size="l">Large</Button>
          <Button variant="elevated" size="xl">XL</Button>
        </Showcase>

        <Showcase
          title="Tonal"
          code={`<Button variant="tonal">Add item</Button>`}
        >
          <Button variant="tonal" size="xs">XS</Button>
          <Button variant="tonal" size="s">Small</Button>
          <Button variant="tonal" size="m">Medium</Button>
          <Button variant="tonal" size="l">Large</Button>
          <Button variant="tonal" size="xl">XL</Button>
        </Showcase>

        <Showcase
          title="Square Shape"
          code={`<Button square>Square Button</Button>`}
        >
          <Button square variant="filled" size="xs">XS</Button>
          <Button square variant="filled" size="s">Small</Button>
          <Button square variant="filled" size="m">Medium</Button>
          <Button square variant="filled" size="l">Large</Button>
          <Button square variant="filled" size="xl">XL</Button>
        </Showcase>
      </section>

      {/* With Icons */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Icons</h2>

        <Showcase
          title="Leading Icon"
          code={`<Button icon={<Icon name="add" />}>Create</Button>`}
        >
          <Button variant="filled" icon={<Icon name="add" />}>Create</Button>
          <Button variant="outlined" icon={<Icon name="edit" />}>Edit</Button>
          <Button variant="tonal" icon={<Icon name="send" />}>Send</Button>
        </Showcase>

        <Showcase
          title="Trailing Icon"
          code={`<Button trailingIcon={<Icon name="arrow_forward" />}>Next</Button>`}
        >
          <Button variant="filled" trailingIcon={<Icon name="arrow_forward" />}>Next</Button>
          <Button variant="outlined" trailingIcon={<Icon name="open_in_new" />}>Open</Button>
        </Showcase>
      </section>

      {/* Loading */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Loading State</h2>

        <Showcase
          title="Loading"
          code={`<Button loading>Saving...</Button>`}
        >
          <Button variant="filled" loading={loading} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 2000); }}>
            {loading ? "Saving..." : "Click to Load"}
          </Button>
          <Button variant="outlined" loading>Loading</Button>
          <Button variant="tonal" loading>Processing</Button>
        </Showcase>
      </section>

      {/* Disabled */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Disabled</h2>

        <Showcase
          title="Disabled"
          code={`<Button disabled>Can't click</Button>`}
        >
          <Button variant="filled" disabled>Filled</Button>
          <Button variant="outlined" disabled>Outlined</Button>
          <Button variant="tonal" disabled>Tonal</Button>
          <Button variant="elevated" disabled>Elevated</Button>
          <Button variant="text" disabled>Text</Button>
        </Showcase>
      </section>

      {/* M3 Expressive Specs */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">M3 Expressive Specs</h2>
        <div className="rounded-xl border border-outline-variant p-4 space-y-2 text-sm text-surface-variant-foreground">
          <p><strong>Sizes:</strong> xs (32dp) · s (36dp) · m (40dp, default) · l (48dp) · xl (56dp)</p>
          <p><strong>Shape:</strong> corner-full (rounded-full) at rest → <code>active:rounded-xl</code> on press (shape morph)</p>
          <p><strong>Variants:</strong> filled, outlined, tonal, text, elevated</p>
          <p><strong>Elevation:</strong> Elevated variant uses Level 1 shadow at rest, Level 2 on hover</p>
        </div>
      </section>

      <PropsTable componentName="Button" props={buttonProps} />
    </div>
  );
}

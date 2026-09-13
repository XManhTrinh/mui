"use client";

import * as React from "react";
import { Typography, Chip, Switch } from "@mui/index";
import { Showcase, Playground } from "@/components/showcase";
import { PropsTable, type PropDef } from "@/components/props-table";

const typographyProps: PropDef[] = [
  {
    name: "variant",
    type: '"display-large" | "display-medium" | ... | "label-small"',
    default: '"body-medium"',
    description: "M3 type scale role — controls font-size, line-height, weight, and tracking",
  },
  {
    name: "color",
    type: '"surface-foreground" | "surface-variant-foreground" | "primary" | "secondary" | "tertiary" | "error" | ...',
    default: '"surface-foreground"',
    description: "Text color from the M3 color system",
  },
  {
    name: "asChild",
    type: "boolean",
    default: "false",
    description: "Render as child element via Radix Slot pattern",
  },
  {
    name: "className",
    type: "string",
    description: "Additional Tailwind classes",
  },
];

type TypographyVariant =
  | "display-large" | "display-medium" | "display-small"
  | "headline-large" | "headline-medium" | "headline-small"
  | "title-large" | "title-medium" | "title-small"
  | "body-large" | "body-medium" | "body-small"
  | "label-large" | "label-medium" | "label-small";

export default function TypographyPage() {
  const [pgVariant, setPgVariant] = React.useState<TypographyVariant>("display-large");

  const pgCode = `<Typography variant="${pgVariant}">The quick brown fox</Typography>`;

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Typography
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Typography renders text in one of the 15 M3 type-scale roles. Each role maps to the correct
          semantic HTML element (h1–h6, p, span) and applies exact font-size, line-height, weight, and
          letter-spacing from the spec.
        </p>
      </div>

      {/* Interactive Playground */}
      <Playground
        title="Playground"
        code={pgCode}
        controls={
          <div className="space-y-3">
            <span className="text-[12px] font-medium text-surface-variant-foreground block mb-1.5">Variant</span>
            <div className="flex flex-wrap gap-1">
              {(["display-large", "display-medium", "display-small", "headline-large", "headline-medium", "headline-small", "title-large", "title-medium", "title-small", "body-large", "body-medium", "body-small", "label-large", "label-medium", "label-small"] as const).map((v) => (
                <Chip key={v} variant="filter" selected={pgVariant === v} onClick={() => setPgVariant(v)}>
                  {v}
                </Chip>
              ))}
            </div>
          </div>
        }
      >
        <Typography variant={pgVariant}>The quick brown fox jumps over the lazy dog</Typography>
      </Playground>

      {/* Display */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Display</h2>
        <Showcase
          title="Display roles"
          className="flex-col items-start gap-4"
          code={`<Typography variant="display-large">Display Large</Typography>\n<Typography variant="display-medium">Display Medium</Typography>\n<Typography variant="display-small">Display Small</Typography>`}
        >
          <Typography variant="display-large">Display Large — 57px</Typography>
          <Typography variant="display-medium">Display Medium — 45px</Typography>
          <Typography variant="display-small">Display Small — 36px</Typography>
        </Showcase>
      </section>

      {/* Headline */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Headline</h2>
        <Showcase
          title="Headline roles"
          className="flex-col items-start gap-3"
          code={`<Typography variant="headline-large">Headline Large</Typography>\n<Typography variant="headline-medium">Headline Medium</Typography>\n<Typography variant="headline-small">Headline Small</Typography>`}
        >
          <Typography variant="headline-large">Headline Large — 32px</Typography>
          <Typography variant="headline-medium">Headline Medium — 28px</Typography>
          <Typography variant="headline-small">Headline Small — 24px</Typography>
        </Showcase>
      </section>

      {/* Title */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Title</h2>
        <Showcase
          title="Title roles"
          className="flex-col items-start gap-2"
          code={`<Typography variant="title-large">Title Large</Typography>\n<Typography variant="title-medium">Title Medium</Typography>\n<Typography variant="title-small">Title Small</Typography>`}
        >
          <Typography variant="title-large">Title Large — 22px</Typography>
          <Typography variant="title-medium">Title Medium — 16px / 500</Typography>
          <Typography variant="title-small">Title Small — 14px / 500</Typography>
        </Showcase>
      </section>

      {/* Body */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Body</h2>
        <Showcase
          title="Body roles"
          className="flex-col items-start gap-2"
          code={`<Typography variant="body-large">Body Large</Typography>\n<Typography variant="body-medium">Body Medium</Typography>\n<Typography variant="body-small">Body Small</Typography>`}
        >
          <Typography variant="body-large">Body Large — 16px (default)</Typography>
          <Typography variant="body-medium">Body Medium — 14px</Typography>
          <Typography variant="body-small">Body Small — 12px</Typography>
        </Showcase>
      </section>

      {/* Label */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Label</h2>
        <Showcase
          title="Label roles"
          className="flex-col items-start gap-2"
          code={`<Typography variant="label-large">Label Large</Typography>\n<Typography variant="label-medium">Label Medium</Typography>\n<Typography variant="label-small">Label Small</Typography>`}
        >
          <Typography variant="label-large">Label Large — 14px / 500</Typography>
          <Typography variant="label-medium">Label Medium — 12px / 500</Typography>
          <Typography variant="label-small">Label Small — 11px / 500</Typography>
        </Showcase>
      </section>

      {/* Color variants */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Colors</h2>
        <Showcase
          title="Color presets"
          className="flex-col items-start gap-2"
          code={`<Typography color="primary">Primary</Typography>\n<Typography color="error">Error</Typography>\n<Typography color="surface-variant-foreground">Muted</Typography>`}
        >
          <Typography variant="title-medium" color="surface-foreground">Default (surface-foreground)</Typography>
          <Typography variant="title-medium" color="primary">Primary</Typography>
          <Typography variant="title-medium" color="secondary">Secondary</Typography>
          <Typography variant="title-medium" color="error">Error</Typography>
          <Typography variant="title-medium" color="surface-variant-foreground">Muted (surface-variant-foreground)</Typography>
        </Showcase>
      </section>

      {/* Spec reference */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">M3 Type Scale Reference</h2>
        <div className="rounded-xl border border-outline-variant p-4 overflow-x-auto">
          <table className="w-full text-sm text-surface-variant-foreground">
            <thead>
              <tr className="border-b border-outline-variant text-left">
                <th className="py-2 pr-4 font-medium">Role</th>
                <th className="py-2 pr-4 font-medium">Size</th>
                <th className="py-2 pr-4 font-medium">Line height</th>
                <th className="py-2 pr-4 font-medium">Weight</th>
                <th className="py-2 font-medium">Tracking</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              <tr><td className="py-1.5 pr-4">Display Large</td><td className="pr-4">57px</td><td className="pr-4">64px</td><td className="pr-4">400</td><td>-0.25px</td></tr>
              <tr><td className="py-1.5 pr-4">Display Medium</td><td className="pr-4">45px</td><td className="pr-4">52px</td><td className="pr-4">400</td><td>0</td></tr>
              <tr><td className="py-1.5 pr-4">Display Small</td><td className="pr-4">36px</td><td className="pr-4">44px</td><td className="pr-4">400</td><td>0</td></tr>
              <tr><td className="py-1.5 pr-4">Headline Large</td><td className="pr-4">32px</td><td className="pr-4">40px</td><td className="pr-4">400</td><td>0</td></tr>
              <tr><td className="py-1.5 pr-4">Headline Medium</td><td className="pr-4">28px</td><td className="pr-4">36px</td><td className="pr-4">400</td><td>0</td></tr>
              <tr><td className="py-1.5 pr-4">Headline Small</td><td className="pr-4">24px</td><td className="pr-4">32px</td><td className="pr-4">400</td><td>0</td></tr>
              <tr><td className="py-1.5 pr-4">Title Large</td><td className="pr-4">22px</td><td className="pr-4">28px</td><td className="pr-4">400</td><td>0</td></tr>
              <tr><td className="py-1.5 pr-4">Title Medium</td><td className="pr-4">16px</td><td className="pr-4">24px</td><td className="pr-4">500</td><td>0.15px</td></tr>
              <tr><td className="py-1.5 pr-4">Title Small</td><td className="pr-4">14px</td><td className="pr-4">20px</td><td className="pr-4">500</td><td>0.1px</td></tr>
              <tr><td className="py-1.5 pr-4">Body Large</td><td className="pr-4">16px</td><td className="pr-4">24px</td><td className="pr-4">400</td><td>0.5px</td></tr>
              <tr><td className="py-1.5 pr-4">Body Medium</td><td className="pr-4">14px</td><td className="pr-4">20px</td><td className="pr-4">400</td><td>0.25px</td></tr>
              <tr><td className="py-1.5 pr-4">Body Small</td><td className="pr-4">12px</td><td className="pr-4">16px</td><td className="pr-4">400</td><td>0.4px</td></tr>
              <tr><td className="py-1.5 pr-4">Label Large</td><td className="pr-4">14px</td><td className="pr-4">20px</td><td className="pr-4">500</td><td>0.1px</td></tr>
              <tr><td className="py-1.5 pr-4">Label Medium</td><td className="pr-4">12px</td><td className="pr-4">16px</td><td className="pr-4">500</td><td>0.5px</td></tr>
              <tr><td className="py-1.5 pr-4">Label Small</td><td className="pr-4">11px</td><td className="pr-4">16px</td><td className="pr-4">500</td><td>0.5px</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <PropsTable componentName="Typography" props={typographyProps} />
    </div>
  );
}

"use client";

import * as React from "react";
import { TextField, Icon, Chip, Switch } from "@mui/index";
import { Showcase, Playground } from "@/components/showcase";
import { PropsTable, type PropDef } from "@/components/props-table";

const textFieldProps: PropDef[] = [
  { name: "variant", type: '"filled" | "outlined"', default: '"outlined"', description: "The visual style of the text field container." },
  { name: "label", type: "string", default: "—", description: "Floating label text displayed above the input when focused or populated." },
  { name: "leadingIcon", type: "ReactNode", default: "—", description: "Icon rendered at the start of the text field container." },
  { name: "trailingIcon", type: "ReactNode", default: "—", description: "Icon rendered at the end of the text field container." },
  { name: "supportingText", type: "string", default: "—", description: "Helper text displayed below the text field." },
  { name: "error", type: "boolean", default: "false", description: "When true, applies error styling to the field and label." },
  { name: "errorText", type: "string", default: "—", description: "Error message displayed below the field (replaces supportingText when error is true)." },
  { name: "prefix", type: "string", default: "—", description: "Text displayed before the input value (e.g. currency symbol)." },
  { name: "suffix", type: "string", default: "—", description: "Text displayed after the input value (e.g. unit)." },
  { name: "multiline", type: "boolean", default: "false", description: "When true, renders a textarea instead of an input." },
  { name: "rows", type: "number", default: "3", description: "Number of visible text rows when multiline is true." },
  { name: "characterCount", type: "{ current: number; max: number }", default: "—", description: "Displays a character counter below the field showing current/max." },
  { name: "disabled", type: "boolean", default: "false", description: "When true, prevents interaction and applies muted styling." },
  { name: "className", type: "string", default: "—", description: "Additional CSS classes applied to the root container." },
];

export default function TextFieldsPage() {
  // Playground state
  const [pgVariant, setPgVariant] = React.useState<"outlined" | "filled">("outlined");
  const [pgError, setPgError] = React.useState(false);
  const [pgDisabled, setPgDisabled] = React.useState(false);
  const [pgMultiline, setPgMultiline] = React.useState(false);
  const [pgLabel, setPgLabel] = React.useState("Email");
  const [pgSupportingText, setPgSupportingText] = React.useState("");

  const pgCode = `<TextField variant="${pgVariant}" label="${pgLabel}"${pgError ? " error" : ""}${pgDisabled ? " disabled" : ""}${pgMultiline ? " multiline rows={3}" : ""}${pgSupportingText ? ` supportingText="${pgSupportingText}"` : ""} />`;

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Text Fields
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Text fields allow users to enter text into a UI. They typically appear
          in forms and dialogs.
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
                {(["outlined", "filled"] as const).map((v) => (
                  <Chip key={v} variant="filter" selected={pgVariant === v} onClick={() => setPgVariant(v)}>
                    {v}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[12px] font-medium text-surface-variant-foreground block mb-1.5">Label text</span>
              <input
                type="text"
                value={pgLabel}
                onChange={(e) => setPgLabel(e.target.value)}
                className="w-full px-2 py-1 text-sm rounded border border-outline-variant bg-surface-container text-surface-foreground"
              />
            </div>
            <div>
              <span className="text-[12px] font-medium text-surface-variant-foreground block mb-1.5">Supporting text</span>
              <input
                type="text"
                value={pgSupportingText}
                onChange={(e) => setPgSupportingText(e.target.value)}
                placeholder="Optional helper text"
                className="w-full px-2 py-1 text-sm rounded border border-outline-variant bg-surface-container text-surface-foreground"
              />
            </div>
            <div className="space-y-3 pt-1">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[13px] text-surface-foreground">Error</span>
                <Switch checked={pgError} onCheckedChange={setPgError} />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[13px] text-surface-foreground">Disabled</span>
                <Switch checked={pgDisabled} onCheckedChange={setPgDisabled} />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[13px] text-surface-foreground">Multiline</span>
                <Switch checked={pgMultiline} onCheckedChange={setPgMultiline} />
              </label>
            </div>
          </>
        }
      >
        <TextField
          variant={pgVariant}
          label={pgLabel}
          error={pgError}
          disabled={pgDisabled}
          multiline={pgMultiline}
          rows={pgMultiline ? 3 : undefined}
          supportingText={pgSupportingText || undefined}
          placeholder="Enter text"
        />
      </Playground>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Variants</h2>
        <Showcase title="Outlined" code={`<TextField variant="outlined" label="Label" placeholder="Enter text" />`}>
          <TextField variant="outlined" label="Label" placeholder="Enter text" />
          <TextField variant="outlined" label="With value" defaultValue="Hello" />
        </Showcase>
        <Showcase title="Filled" code={`<TextField variant="filled" label="Label" placeholder="Enter text" />`}>
          <TextField variant="filled" label="Label" placeholder="Enter text" />
          <TextField variant="filled" label="With value" defaultValue="Hello" />
        </Showcase>
      </section>

      {/* States */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">States</h2>
        <Showcase title="Error" code={`<TextField variant="outlined" label="Email" error errorText="Invalid email address" />`}>
          <TextField variant="outlined" label="Email" error errorText="Invalid email address" defaultValue="not-an-email" />
          <TextField variant="filled" label="Email" error errorText="Required field" />
        </Showcase>
        <Showcase title="Disabled" code={`<TextField variant="outlined" label="Disabled" disabled />`}>
          <TextField variant="outlined" label="Disabled" disabled defaultValue="Cannot edit" />
          <TextField variant="filled" label="Disabled" disabled defaultValue="Cannot edit" />
        </Showcase>
      </section>

      {/* With Icons */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Icons</h2>
        <Showcase title="Leading & Trailing Icons" code={`<TextField variant="outlined" label="Search" leadingIcon={<Icon name="search" />} />`}>
          <TextField
            variant="outlined"
            label="Search"
            leadingIcon={<Icon name="search" />}
          />
          <TextField
            variant="outlined"
            label="Password"
            trailingIcon={<Icon name="visibility" />}
          />
          <TextField
            variant="filled"
            label="Email"
            leadingIcon={<Icon name="mail" />}
            trailingIcon={<Icon name="check_circle" />}
          />
        </Showcase>
      </section>

      {/* Prefix & Suffix */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Prefix & Suffix</h2>
        <Showcase title="Prefix and Suffix Text" code={`<TextField variant="outlined" label="Amount" prefix="$" />`}>
          <TextField variant="outlined" label="Amount" prefix="$" />
          <TextField variant="outlined" label="Weight" suffix="kg" />
          <TextField variant="filled" label="Website" prefix="https://" />
        </Showcase>
      </section>

      {/* Supporting Text */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Supporting Text</h2>
        <Showcase
          title="Helper text below the field"
          code={`<TextField label="Username" supportingText="Must be 3-20 characters" />\n<TextField label="Email" error errorText="Please enter a valid email" />`}
        >
          <TextField variant="outlined" label="Username" supportingText="Must be 3-20 characters" />
          <TextField variant="filled" label="Password" supportingText="At least 8 characters" />
          <TextField variant="outlined" label="Email" error errorText="Please enter a valid email" defaultValue="bad" />
        </Showcase>
      </section>

      {/* Character Count */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Character Count</h2>
        <Showcase
          title="Display current/max character usage"
          code={`<TextField label="Bio" characterCount={{ current: 42, max: 200 }} />`}
        >
          <TextField variant="outlined" label="Bio" characterCount={{ current: 42, max: 200 }} defaultValue="Hello, I'm a software engineer." />
          <TextField variant="filled" label="Tweet" characterCount={{ current: 128, max: 280 }} supportingText="Keep it short" defaultValue="Just shipped a new feature!" />
        </Showcase>
      </section>

      {/* Multiline */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Multiline</h2>
        <Showcase
          title="Textarea with configurable rows"
          code={`<TextField label="Description" multiline rows={4} />`}
        >
          <TextField variant="outlined" label="Description" multiline rows={4} placeholder="Enter a description..." />
          <TextField variant="filled" label="Notes" multiline rows={3} defaultValue={"Line one\nLine two\nLine three"} />
        </Showcase>
      </section>

      {/* Theming */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Theming</h2>
        <p className="text-sm text-surface-variant-foreground">
          All TextField colors are driven by CSS custom properties (HSL-based design tokens). Override them on a parent container or globally to theme the component.
        </p>
        <Showcase
          title="CSS variable-driven theming"
          code={`/* Override design tokens */\n.custom-theme {\n  --primary: 270 80% 60%;        /* purple focus ring */\n  --on-surface: 270 10% 20%;     /* dark text */\n  --on-surface-variant: 270 5% 45%; /* label/hint */\n  --outline: 270 20% 70%;        /* border */\n  --error: 0 80% 50%;            /* red errors */\n}\n\n<div className="custom-theme">\n  <TextField label="Themed" />\n</div>`}
        >
          <div style={{ "--primary": "270 80% 60%", "--outline": "270 20% 70%", "--on-surface-variant": "270 5% 45%" } as React.CSSProperties}>
            <TextField variant="outlined" label="Custom themed" placeholder="Purple focus" />
          </div>
        </Showcase>
      </section>

      {/* M3 Expressive Specs */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">M3 Expressive Specs</h2>
        <p className="text-sm text-surface-variant-foreground">
          Measurements follow the Material Design 3 text field specification.
        </p>
        <div className="rounded-2xl border border-outline-variant overflow-hidden">
          <div className="grid grid-cols-[1fr_auto] bg-surface-container px-4 py-2.5 border-b border-outline-variant">
            <div className="text-sm font-medium text-surface-foreground">Property</div>
            <div className="text-sm font-medium text-surface-foreground">Value</div>
          </div>
          {[
            ["Container height", "56dp"],
            ["L/R padding without icons", "16dp"],
            ["L/R padding with icons", "12dp"],
            ["Padding between icons and text", "16dp"],
            ["Top/bottom padding (filled)", "8dp"],
            ["Supporting text top padding", "4dp"],
            ["Label alignment", "Vertically centered"],
            ["Populated label L/R padding (outlined)", "4dp"],
            ["Target size", "56dp"],
          ].map(([property, value], index, arr) => (
            <div
              key={property}
              className={`grid grid-cols-[1fr_auto] px-4 py-2.5 ${index < arr.length - 1 ? "border-b border-outline-variant" : ""}`}
            >
              <div className="text-sm text-surface-foreground">{property}</div>
              <div>
                <code className="text-xs font-mono text-surface-variant-foreground">{value}</code>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Props Table */}
      <PropsTable componentName="TextField" props={textFieldProps} />
    </div>
  );
}

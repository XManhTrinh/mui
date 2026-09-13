"use client";

import * as React from "react";
import { Select, Chip, Switch } from "@mui/index";
import { Showcase, Playground } from "@/components/showcase";
import { PropsTable, type PropDef } from "@/components/props-table";

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry", disabled: true },
];

const selectProps: PropDef[] = [
  {
    name: "options",
    type: "SelectOption[]",
    description: "Array of { value, label, disabled? } objects",
    required: true,
  },
  {
    name: "variant",
    type: '"filled" | "outlined"',
    default: '"outlined"',
    description: "Visual variant matching TextField",
  },
  {
    name: "value",
    type: "string",
    description: "Controlled selected value",
  },
  {
    name: "defaultValue",
    type: "string",
    description: "Uncontrolled default selected value",
  },
  {
    name: "onValueChange",
    type: "(value: string) => void",
    description: "Callback when the selected value changes",
  },
  {
    name: "label",
    type: "string",
    description: "Floating label text",
  },
  {
    name: "placeholder",
    type: "string",
    description: "Placeholder text when no value is selected",
  },
  {
    name: "error",
    type: "boolean",
    default: "false",
    description: "Show error styling and error text",
  },
  {
    name: "errorText",
    type: "string",
    description: "Error message shown below the field",
  },
  {
    name: "supportingText",
    type: "string",
    description: "Helper text shown below the field",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disable interaction",
  },
  {
    name: "required",
    type: "boolean",
    default: "false",
    description: "Show required asterisk on label",
  },
];

export default function SelectPage() {
  const [value, setValue] = React.useState("");

  // Playground state
  const [pgVariant, setPgVariant] = React.useState<"filled" | "outlined">("outlined");
  const [pgDisabled, setPgDisabled] = React.useState(false);
  const [pgError, setPgError] = React.useState(false);

  const pgCode = `<Select
  variant="${pgVariant}"
  label="Fruit"
  options={fruits}${pgError ? '\n  error\n  errorText="Please select a fruit"' : ""}${pgDisabled ? "\n  disabled" : ""}
/>`;

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Select
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Select (Exposed Dropdown Menu) lets users choose a single value from a list
          of options. Matches the M3 text-field styling with a floating label and
          dropdown menu.
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
              <div className="flex gap-1">
                {(["outlined", "filled"] as const).map((v) => (
                  <Chip key={v} variant="filter" selected={pgVariant === v} onClick={() => setPgVariant(v)}>
                    {v}
                  </Chip>
                ))}
              </div>
            </div>
            <div className="space-y-3 pt-1">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[13px] text-surface-foreground">Disabled</span>
                <Switch checked={pgDisabled} onCheckedChange={setPgDisabled} />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[13px] text-surface-foreground">Error</span>
                <Switch checked={pgError} onCheckedChange={setPgError} />
              </label>
            </div>
          </>
        }
      >
        <div className="w-64">
          <Select
            variant={pgVariant}
            label="Fruit"
            options={fruits}
            disabled={pgDisabled}
            error={pgError}
            errorText={pgError ? "Please select a fruit" : undefined}
          />
        </div>
      </Playground>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Variants</h2>
        <Showcase
          title="Outlined (default)"
          code={`<Select variant="outlined" label="Fruit" options={fruits} />`}
        >
          <div className="w-64">
            <Select variant="outlined" label="Fruit" options={fruits} />
          </div>
        </Showcase>
        <Showcase
          title="Filled"
          code={`<Select variant="filled" label="Fruit" options={fruits} />`}
        >
          <div className="w-64">
            <Select variant="filled" label="Fruit" options={fruits} />
          </div>
        </Showcase>
      </section>

      {/* Controlled */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Controlled</h2>
        <Showcase
          title="Controlled value"
          code={`<Select label="Fruit" options={fruits} value={value} onValueChange={setValue} />`}
        >
          <div className="w-64">
            <Select label="Fruit" options={fruits} value={value} onValueChange={setValue} />
          </div>
          <p className="text-sm text-surface-variant-foreground">
            Selected: {value || "(none)"}
          </p>
        </Showcase>
      </section>

      {/* Error + Supporting */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Error & Supporting Text</h2>
        <Showcase
          title="Error state"
          code={`<Select label="Fruit" options={fruits} error errorText="Required" />`}
        >
          <div className="w-64">
            <Select label="Fruit" options={fruits} error errorText="This field is required" />
          </div>
        </Showcase>
        <Showcase
          title="Supporting text"
          code={`<Select label="Fruit" options={fruits} supportingText="Choose your favorite" />`}
        >
          <div className="w-64">
            <Select label="Fruit" options={fruits} supportingText="Choose your favorite" />
          </div>
        </Showcase>
      </section>

      {/* Disabled */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Disabled</h2>
        <Showcase
          title="Disabled"
          code={`<Select label="Fruit" options={fruits} disabled />`}
        >
          <div className="w-64">
            <Select label="Fruit" options={fruits} disabled />
          </div>
        </Showcase>
      </section>

      <PropsTable componentName="Select" props={selectProps} />
    </div>
  );
}

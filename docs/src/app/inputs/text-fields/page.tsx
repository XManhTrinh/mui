"use client";

import * as React from "react";
import { TextField, Icon, Chip, Switch } from "@mui/index";
import { Showcase, Playground } from "@/components/showcase";

export default function TextFieldsPage() {
  // Playground state
  const [pgVariant, setPgVariant] = React.useState<"outlined" | "filled">("outlined");
  const [pgError, setPgError] = React.useState(false);
  const [pgDisabled, setPgDisabled] = React.useState(false);
  const [pgLabel, setPgLabel] = React.useState("Email");

  const pgCode = `<TextField variant="${pgVariant}" label="${pgLabel}"${pgError ? " error" : ""}${pgDisabled ? " disabled" : ""} />`;

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
            <div className="space-y-3 pt-1">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[13px] text-surface-foreground">Error</span>
                <Switch checked={pgError} onCheckedChange={setPgError} />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[13px] text-surface-foreground">Disabled</span>
                <Switch checked={pgDisabled} onCheckedChange={setPgDisabled} />
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
          placeholder="Enter text"
        />
      </Playground>

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

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Prefix & Suffix</h2>
        <Showcase title="Prefix and Suffix Text" code={`<TextField variant="outlined" label="Amount" prefix="$" />`}>
          <TextField variant="outlined" label="Amount" prefix="$" />
          <TextField variant="outlined" label="Weight" suffix="kg" />
          <TextField variant="filled" label="Website" prefix="https://" />
        </Showcase>
      </section>
    </div>
  );
}

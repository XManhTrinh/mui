"use client";

import * as React from "react";
import { TextField, Icon } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function TextFieldsPage() {
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

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Variants</h2>
        <Showcase title="Outlined">
          <TextField variant="outlined" label="Label" placeholder="Enter text" />
          <TextField variant="outlined" label="With value" defaultValue="Hello" />
        </Showcase>
        <Showcase title="Filled">
          <TextField variant="filled" label="Label" placeholder="Enter text" />
          <TextField variant="filled" label="With value" defaultValue="Hello" />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">States</h2>
        <Showcase title="Error">
          <TextField variant="outlined" label="Email" error errorText="Invalid email address" defaultValue="not-an-email" />
          <TextField variant="filled" label="Email" error errorText="Required field" />
        </Showcase>
        <Showcase title="Disabled">
          <TextField variant="outlined" label="Disabled" disabled defaultValue="Cannot edit" />
          <TextField variant="filled" label="Disabled" disabled defaultValue="Cannot edit" />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Icons</h2>
        <Showcase title="Leading & Trailing Icons">
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
        <Showcase title="Prefix and Suffix Text">
          <TextField variant="outlined" label="Amount" prefix="$" />
          <TextField variant="outlined" label="Weight" suffix="kg" />
          <TextField variant="filled" label="Website" prefix="https://" />
        </Showcase>
      </section>
    </div>
  );
}

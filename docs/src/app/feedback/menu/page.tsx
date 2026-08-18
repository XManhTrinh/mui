"use client";

import * as React from "react";
import { Menu, MenuItem, MenuDivider, Button, IconButton, Icon } from "@mui/index";
import { Showcase } from "@/components/showcase";
import { PropsTable, type PropDef } from "@/components/props-table";

const menuProps: PropDef[] = [
  {
    name: "trigger",
    type: "ReactNode",
    description: "Element that opens the menu on click",
    required: true,
  },
  {
    name: "open",
    type: "boolean",
    description: "Controlled open state",
  },
  {
    name: "onOpenChange",
    type: "(open: boolean) => void",
    description: "Callback when open state changes",
  },
  {
    name: "children",
    type: "ReactNode",
    description: "MenuItem and MenuDivider elements",
    required: true,
  },
];

const menuItemProps: PropDef[] = [
  {
    name: "leadingIcon",
    type: "string",
    description: "Material Symbols icon name for leading icon",
  },
  {
    name: "trailingText",
    type: "string",
    description: "Trailing text (e.g., keyboard shortcut)",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disable the menu item",
  },
  {
    name: "onClick",
    type: "() => void",
    description: "Click handler",
  },
  {
    name: "children",
    type: "ReactNode",
    description: "Menu item label text",
    required: true,
  },
];

export default function MenuPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Menu
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Menus display a list of choices on a temporary surface.
          Follows M3 Expressive specs with Level 2 elevation (updated from Level 3).
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Basic</h2>
        <Showcase title="Simple Menu" code={`<Menu trigger={<Button variant="outlined">Open Menu</Button>}>\n  <MenuItem>Cut</MenuItem>\n  <MenuItem>Copy</MenuItem>\n  <MenuItem>Paste</MenuItem>\n</Menu>`}>
          <Menu trigger={<Button variant="outlined">Open Menu</Button>}>
            <MenuItem>Cut</MenuItem>
            <MenuItem>Copy</MenuItem>
            <MenuItem>Paste</MenuItem>
          </Menu>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Icons</h2>
        <Showcase title="Leading Icons" code={`<Menu trigger={<Button variant="filled">Edit</Button>}>\n  <MenuItem leadingIcon="content_cut">Cut</MenuItem>\n  <MenuItem leadingIcon="content_copy">Copy</MenuItem>\n  <MenuItem leadingIcon="content_paste">Paste</MenuItem>\n  <MenuDivider />\n  <MenuItem leadingIcon="select_all">Select All</MenuItem>\n</Menu>`}>
          <Menu trigger={<Button variant="filled">Edit</Button>}>
            <MenuItem leadingIcon="content_cut">Cut</MenuItem>
            <MenuItem leadingIcon="content_copy">Copy</MenuItem>
            <MenuItem leadingIcon="content_paste">Paste</MenuItem>
            <MenuDivider />
            <MenuItem leadingIcon="select_all">Select All</MenuItem>
          </Menu>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Trailing Text</h2>
        <Showcase title="Keyboard Shortcuts" code={`<Menu trigger={<IconButton variant="standard" aria-label="More"><Icon name="more_vert" /></IconButton>}>\n  <MenuItem leadingIcon="content_cut" trailingText="⌘X">Cut</MenuItem>\n  <MenuItem leadingIcon="content_copy" trailingText="⌘C">Copy</MenuItem>\n  <MenuItem leadingIcon="content_paste" trailingText="⌘V">Paste</MenuItem>\n</Menu>`}>
          <Menu trigger={<IconButton variant="standard" aria-label="More"><Icon name="more_vert" /></IconButton>}>
            <MenuItem leadingIcon="content_cut" trailingText="⌘X">Cut</MenuItem>
            <MenuItem leadingIcon="content_copy" trailingText="⌘C">Copy</MenuItem>
            <MenuItem leadingIcon="content_paste" trailingText="⌘V">Paste</MenuItem>
            <MenuDivider />
            <MenuItem leadingIcon="select_all" trailingText="⌘A">Select All</MenuItem>
          </Menu>
        </Showcase>
      </section>

      {/* M3 Expressive Specs */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">M3 Expressive Specs</h2>
        <div className="rounded-xl border border-outline-variant p-4 space-y-2 text-sm text-surface-variant-foreground">
          <p><strong>Elevation:</strong> Level 2 (updated from Level 3)</p>
          <p><strong>Shape:</strong> corner-extra-small (4dp, rounded-sm)</p>
          <p><strong>Min width:</strong> 112dp</p>
          <p><strong>Max width:</strong> 280dp</p>
        </div>
      </section>

      <PropsTable componentName="Menu" props={menuProps} />
      <PropsTable componentName="MenuItem" props={menuItemProps} />
    </div>
  );
}

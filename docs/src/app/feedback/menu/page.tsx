"use client";

import * as React from "react";
import {
  Menu,
  MenuItem,
  MenuHeader,
  MenuDivider,
  MenuSub,
  MenuSubTrigger,
  MenuSubContent,
  Button,
  IconButton,
  Icon,
} from "@mui/index";
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
    name: "children",
    type: "ReactNode",
    description: "MenuItem, MenuHeader, MenuDivider, and MenuSub elements",
    required: true,
  },
  {
    name: "align",
    type: '"start" | "center" | "end"',
    default: '"start"',
    description: "Horizontal alignment of the menu relative to trigger",
  },
  {
    name: "side",
    type: '"top" | "bottom" | "left" | "right"',
    default: '"bottom"',
    description: "Side of the trigger to render the menu on",
  },
  {
    name: "dense",
    type: "boolean",
    default: "false",
    description: "Dense variant — 32dp rows and Body Medium labels for data-heavy menus",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes on the menu content container",
  },
];

const menuItemProps: PropDef[] = [
  {
    name: "children",
    type: "ReactNode",
    description: "Menu item label text",
    required: true,
  },
  {
    name: "leadingIcon",
    type: "string",
    description: "Material Symbols icon name for leading icon",
  },
  {
    name: "trailingIcon",
    type: "string",
    description: "Material Symbols icon name for trailing icon",
  },
  {
    name: "trailingText",
    type: "string",
    description: "Trailing text (e.g., keyboard shortcut)",
  },
  {
    name: "selected",
    type: "boolean",
    default: "false",
    description: "Whether the item is selected (shows surface-container-highest background)",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disable the menu item",
  },
  {
    name: "onSelect",
    type: "() => void",
    description: "Callback when the item is selected",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes",
  },
];

const menuHeaderProps: PropDef[] = [
  {
    name: "children",
    type: "ReactNode",
    description: "Header label text",
    required: true,
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes",
  },
];

const menuSubProps: PropDef[] = [
  {
    name: "children",
    type: "ReactNode",
    description: "MenuSubTrigger and MenuSubContent elements",
    required: true,
  },
  {
    name: "open",
    type: "boolean",
    description: "Controlled open state of the submenu",
  },
  {
    name: "defaultOpen",
    type: "boolean",
    description: "Initial open state (uncontrolled)",
  },
  {
    name: "onOpenChange",
    type: "(open: boolean) => void",
    description: "Callback when submenu open state changes",
  },
  {
    name: "dense",
    type: "boolean",
    description: "Override density for this submenu (inherits from parent by default)",
  },
];

const menuSubTriggerProps: PropDef[] = [
  {
    name: "children",
    type: "ReactNode",
    description: "Trigger label text",
    required: true,
  },
  {
    name: "leadingIcon",
    type: "string",
    description: "Material Symbols icon name for leading icon",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disable the submenu trigger",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes",
  },
];

const menuSubContentProps: PropDef[] = [
  {
    name: "children",
    type: "ReactNode",
    description: "MenuItem and other menu elements inside the submenu",
    required: true,
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes",
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

      {/* Basic */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Basic</h2>
        <Showcase
          title="Simple Menu"
          code={`<Menu trigger={<Button variant="outlined">Open Menu</Button>}>
  <MenuItem>Cut</MenuItem>
  <MenuItem>Copy</MenuItem>
  <MenuItem>Paste</MenuItem>
</Menu>`}
        >
          <Menu trigger={<Button variant="outlined">Open Menu</Button>}>
            <MenuItem>Cut</MenuItem>
            <MenuItem>Copy</MenuItem>
            <MenuItem>Paste</MenuItem>
          </Menu>
        </Showcase>
      </section>

      {/* With Icons */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Icons</h2>
        <Showcase
          title="Leading Icons"
          code={`<Menu trigger={<Button variant="filled">Edit</Button>}>
  <MenuItem leadingIcon="content_cut">Cut</MenuItem>
  <MenuItem leadingIcon="content_copy">Copy</MenuItem>
  <MenuItem leadingIcon="content_paste">Paste</MenuItem>
  <MenuDivider />
  <MenuItem leadingIcon="select_all">Select All</MenuItem>
</Menu>`}
        >
          <Menu trigger={<Button variant="filled">Edit</Button>}>
            <MenuItem leadingIcon="content_cut">Cut</MenuItem>
            <MenuItem leadingIcon="content_copy">Copy</MenuItem>
            <MenuItem leadingIcon="content_paste">Paste</MenuItem>
            <MenuDivider />
            <MenuItem leadingIcon="select_all">Select All</MenuItem>
          </Menu>
        </Showcase>
      </section>

      {/* With Trailing Text */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Trailing Text</h2>
        <Showcase
          title="Keyboard Shortcuts"
          code={`<Menu trigger={<IconButton variant="standard" aria-label="More"><Icon name="more_vert" /></IconButton>}>
  <MenuItem leadingIcon="content_cut" trailingText="⌘X">Cut</MenuItem>
  <MenuItem leadingIcon="content_copy" trailingText="⌘C">Copy</MenuItem>
  <MenuItem leadingIcon="content_paste" trailingText="⌘V">Paste</MenuItem>
  <MenuDivider />
  <MenuItem leadingIcon="select_all" trailingText="⌘A">Select All</MenuItem>
</Menu>`}
        >
          <Menu
            trigger={
              <IconButton variant="standard" aria-label="More">
                <Icon name="more_vert" />
              </IconButton>
            }
          >
            <MenuItem leadingIcon="content_cut" trailingText="⌘X">Cut</MenuItem>
            <MenuItem leadingIcon="content_copy" trailingText="⌘C">Copy</MenuItem>
            <MenuItem leadingIcon="content_paste" trailingText="⌘V">Paste</MenuItem>
            <MenuDivider />
            <MenuItem leadingIcon="select_all" trailingText="⌘A">Select All</MenuItem>
          </Menu>
        </Showcase>
      </section>

      {/* Menu Header */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Menu Header</h2>
        <Showcase
          title="Grouped with Headers"
          code={`<Menu trigger={<Button variant="outlined">Sort</Button>}>
  <MenuHeader>Sort by</MenuHeader>
  <MenuItem leadingIcon="sort_by_alpha">Name</MenuItem>
  <MenuItem leadingIcon="schedule">Date modified</MenuItem>
  <MenuItem leadingIcon="data_usage">Size</MenuItem>
  <MenuDivider />
  <MenuHeader>Order</MenuHeader>
  <MenuItem selected>Ascending</MenuItem>
  <MenuItem>Descending</MenuItem>
</Menu>`}
        >
          <Menu trigger={<Button variant="outlined">Sort</Button>}>
            <MenuHeader>Sort by</MenuHeader>
            <MenuItem leadingIcon="sort_by_alpha">Name</MenuItem>
            <MenuItem leadingIcon="schedule">Date modified</MenuItem>
            <MenuItem leadingIcon="data_usage">Size</MenuItem>
            <MenuDivider />
            <MenuHeader>Order</MenuHeader>
            <MenuItem selected>Ascending</MenuItem>
            <MenuItem>Descending</MenuItem>
          </Menu>
        </Showcase>
      </section>

      {/* Sub-Menus */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Sub-Menus</h2>
        <Showcase
          title="Nested Menus"
          code={`<Menu trigger={<Button variant="filled">Options</Button>}>
  <MenuItem leadingIcon="content_copy">Copy</MenuItem>
  <MenuItem leadingIcon="content_paste">Paste</MenuItem>
  <MenuDivider />
  <MenuSub>
    <MenuSubTrigger leadingIcon="share">Share</MenuSubTrigger>
    <MenuSubContent>
      <MenuItem leadingIcon="mail">Email</MenuItem>
      <MenuItem leadingIcon="chat">Message</MenuItem>
      <MenuItem leadingIcon="link">Copy Link</MenuItem>
    </MenuSubContent>
  </MenuSub>
  <MenuSub>
    <MenuSubTrigger leadingIcon="download">Export</MenuSubTrigger>
    <MenuSubContent>
      <MenuItem>PDF</MenuItem>
      <MenuItem>CSV</MenuItem>
      <MenuItem>JSON</MenuItem>
    </MenuSubContent>
  </MenuSub>
</Menu>`}
        >
          <Menu trigger={<Button variant="filled">Options</Button>}>
            <MenuItem leadingIcon="content_copy">Copy</MenuItem>
            <MenuItem leadingIcon="content_paste">Paste</MenuItem>
            <MenuDivider />
            <MenuSub>
              <MenuSubTrigger leadingIcon="share">Share</MenuSubTrigger>
              <MenuSubContent>
                <MenuItem leadingIcon="mail">Email</MenuItem>
                <MenuItem leadingIcon="chat">Message</MenuItem>
                <MenuItem leadingIcon="link">Copy Link</MenuItem>
              </MenuSubContent>
            </MenuSub>
            <MenuSub>
              <MenuSubTrigger leadingIcon="download">Export</MenuSubTrigger>
              <MenuSubContent>
                <MenuItem>PDF</MenuItem>
                <MenuItem>CSV</MenuItem>
                <MenuItem>JSON</MenuItem>
              </MenuSubContent>
            </MenuSub>
          </Menu>
        </Showcase>
      </section>

      {/* Dense Mode */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Dense Mode</h2>
        <p className="text-sm text-surface-variant-foreground">
          Dense menus use 32dp rows and Body Medium (14px) labels — ideal for data-heavy UIs.
          Set <code className="text-xs font-mono bg-surface-container-highest px-1 py-0.5 rounded">dense</code> on
          the Menu root and it flows to all children via context.
        </p>
        <Showcase
          title="Dense Menu"
          code={`<Menu dense trigger={<Button variant="outlined">Dense Menu</Button>}>
  <MenuHeader>Actions</MenuHeader>
  <MenuItem leadingIcon="content_cut" trailingText="⌘X">Cut</MenuItem>
  <MenuItem leadingIcon="content_copy" trailingText="⌘C">Copy</MenuItem>
  <MenuItem leadingIcon="content_paste" trailingText="⌘V">Paste</MenuItem>
  <MenuDivider />
  <MenuItem leadingIcon="delete" trailingIcon="warning">Delete</MenuItem>
</Menu>`}
        >
          <Menu dense trigger={<Button variant="outlined">Dense Menu</Button>}>
            <MenuHeader>Actions</MenuHeader>
            <MenuItem leadingIcon="content_cut" trailingText="⌘X">Cut</MenuItem>
            <MenuItem leadingIcon="content_copy" trailingText="⌘C">Copy</MenuItem>
            <MenuItem leadingIcon="content_paste" trailingText="⌘V">Paste</MenuItem>
            <MenuDivider />
            <MenuItem leadingIcon="delete" trailingIcon="warning">Delete</MenuItem>
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
          <p><strong>Item height:</strong> 48dp comfortable, 32dp dense</p>
          <p><strong>Typography:</strong> Body Large (comfortable) / Body Medium (dense)</p>
          <p><strong>Header:</strong> Label Medium (12px/16px/500/0.5px tracking)</p>
        </div>
      </section>

      {/* Props Tables */}
      <PropsTable componentName="Menu" props={menuProps} />
      <PropsTable componentName="MenuItem" props={menuItemProps} />
      <PropsTable componentName="MenuHeader" props={menuHeaderProps} />
      <PropsTable componentName="MenuSub" props={menuSubProps} />
      <PropsTable componentName="MenuSubTrigger" props={menuSubTriggerProps} />
      <PropsTable componentName="MenuSubContent" props={menuSubContentProps} />
    </div>
  );
}

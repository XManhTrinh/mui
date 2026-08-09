"use client";

import * as React from "react";
import { Menu, MenuItem, MenuDivider, Icon, Button } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function MenuPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Menu
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Menus display a list of choices on a temporary surface. They appear
          when users interact with a button, action, or other control.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Basic Menu</h2>
        <Showcase title="Simple Menu">
          <Menu trigger={<Button variant="outlined">Open Menu</Button>}>
            <MenuItem label="Cut" />
            <MenuItem label="Copy" />
            <MenuItem label="Paste" />
          </Menu>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Icons</h2>
        <Showcase title="Menu Items with Icons">
          <Menu trigger={<Button variant="filled">Edit Menu</Button>}>
            <MenuItem label="Cut" icon={<Icon name="content_cut" />} />
            <MenuItem label="Copy" icon={<Icon name="content_copy" />} />
            <MenuItem label="Paste" icon={<Icon name="content_paste" />} />
            <MenuDivider />
            <MenuItem label="Select All" icon={<Icon name="select_all" />} />
          </Menu>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Trailing Text</h2>
        <Showcase title="Keyboard Shortcuts">
          <Menu trigger={<Button variant="outlined">File Menu</Button>}>
            <MenuItem label="New" icon={<Icon name="add" />} trailing="Ctrl+N" />
            <MenuItem label="Open" icon={<Icon name="folder_open" />} trailing="Ctrl+O" />
            <MenuItem label="Save" icon={<Icon name="save" />} trailing="Ctrl+S" />
            <MenuDivider />
            <MenuItem label="Print" icon={<Icon name="print" />} trailing="Ctrl+P" />
          </Menu>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Divider</h2>
        <Showcase title="Grouped Menu Items">
          <Menu trigger={<Button variant="tonal">Actions</Button>}>
            <MenuItem label="Edit" icon={<Icon name="edit" />} />
            <MenuItem label="Duplicate" icon={<Icon name="content_copy" />} />
            <MenuDivider />
            <MenuItem label="Archive" icon={<Icon name="archive" />} />
            <MenuItem label="Delete" icon={<Icon name="delete" />} />
          </Menu>
        </Showcase>
      </section>
    </div>
  );
}

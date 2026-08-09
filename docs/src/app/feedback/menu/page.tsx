"use client";

import * as React from "react";
import { Menu, MenuItem, MenuDivider, Button, IconButton, Icon } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function MenuPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Menu
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Menus display a list of choices on a temporary surface.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Basic</h2>
        <Showcase title="Simple Menu">
          <Menu trigger={<Button variant="outlined">Open Menu</Button>}>
            <MenuItem>Cut</MenuItem>
            <MenuItem>Copy</MenuItem>
            <MenuItem>Paste</MenuItem>
          </Menu>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Icons</h2>
        <Showcase title="Leading Icons">
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
        <Showcase title="Keyboard Shortcuts">
          <Menu trigger={<IconButton variant="standard" aria-label="More"><Icon name="more_vert" /></IconButton>}>
            <MenuItem leadingIcon="content_cut" trailingText="⌘X">Cut</MenuItem>
            <MenuItem leadingIcon="content_copy" trailingText="⌘C">Copy</MenuItem>
            <MenuItem leadingIcon="content_paste" trailingText="⌘V">Paste</MenuItem>
            <MenuDivider />
            <MenuItem leadingIcon="select_all" trailingText="⌘A">Select All</MenuItem>
          </Menu>
        </Showcase>
      </section>
    </div>
  );
}

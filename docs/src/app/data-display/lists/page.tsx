"use client";

import * as React from "react";
import { List, ListItem, Icon, Checkbox, Switch } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function ListsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Lists
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Lists are continuous, vertical indexes of text and images. They are
          composed of items containing primary and supplemental actions.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">One Line</h2>
        <Showcase title="Single-Line List" className="flex-col items-stretch">
          <List>
            <ListItem headline="List item 1" />
            <ListItem headline="List item 2" />
            <ListItem headline="List item 3" />
          </List>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Two Lines</h2>
        <Showcase title="Two-Line List" className="flex-col items-stretch">
          <List>
            <ListItem
              headline="Photos"
              supportingText="Jan 9, 2024"
            />
            <ListItem
              headline="Recipes"
              supportingText="Jan 17, 2024"
            />
            <ListItem
              headline="Work"
              supportingText="Feb 2, 2024"
            />
          </List>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Three Lines</h2>
        <Showcase title="Three-Line List" className="flex-col items-stretch">
          <List>
            <ListItem
              headline="Brunch this weekend?"
              supportingText="Ali Connors — I'll be in your neighborhood doing errands this weekend."
              lines={3}
            />
            <ListItem
              headline="Summer BBQ"
              supportingText="to Alex, Scott, Jennifer — Wish I could come, but I'm out of town this weekend."
              lines={3}
            />
          </List>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Leading & Trailing</h2>
        <Showcase title="With Icons and Actions" className="flex-col items-stretch">
          <List>
            <ListItem
              headline="Wi-Fi"
              supportingText="Connected"
              leading={<Icon name="wifi" />}
              trailing={<Switch defaultChecked />}
            />
            <ListItem
              headline="Bluetooth"
              supportingText="Off"
              leading={<Icon name="bluetooth" />}
              trailing={<Switch />}
            />
            <ListItem
              headline="Data usage"
              supportingText="1.2 GB used"
              leading={<Icon name="data_usage" />}
              trailing={<Icon name="chevron_right" />}
            />
          </List>
        </Showcase>
      </section>
    </div>
  );
}

"use client";

import * as React from "react";
import { List, ListItem, Icon } from "@mui/index";
import { Showcase } from "@/components/showcase";
import { PropsTable, type PropDef } from "@/components/props-table";

export default function ListsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Lists
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Lists are continuous, vertical indexes of text and images.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">One Line</h2>
        <Showcase title="Single-Line List" className="flex-col items-stretch" code={`<List>\n  <ListItem>List item 1</ListItem>\n  <ListItem>List item 2</ListItem>\n  <ListItem>List item 3</ListItem>\n</List>`}>
          <List>
            <ListItem>List item 1</ListItem>
            <ListItem>List item 2</ListItem>
            <ListItem>List item 3</ListItem>
          </List>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Two Lines</h2>
        <Showcase title="Two-Line List" className="flex-col items-stretch" code={`<List>\n  <ListItem supporting="Jan 9, 2024" leading={<Icon name="folder" />} lines={2}>\n    Photos\n  </ListItem>\n  <ListItem supporting="Jan 17, 2024" leading={<Icon name="folder" />} lines={2}>\n    Recipes\n  </ListItem>\n</List>`}>
          <List>
            <ListItem supporting="Jan 9, 2024" leading={<Icon name="folder" size={24} />} lines={2}>
              Photos
            </ListItem>
            <ListItem supporting="Jan 17, 2024" leading={<Icon name="folder" size={24} />} lines={2}>
              Recipes
            </ListItem>
            <ListItem supporting="Feb 2, 2024" leading={<Icon name="folder" size={24} />} lines={2}>
              Work
            </ListItem>
          </List>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Three Lines</h2>
        <Showcase title="Three-Line List" className="flex-col items-stretch" code={`<List>\n  <ListItem\n    supporting="Ali Connors — I'll be in your neighborhood..."\n    leading={<Icon name="person" />}\n    trailing={<span>3m</span>}\n    lines={3}\n  >\n    Brunch this weekend?\n  </ListItem>\n</List>`}>
          <List>
            <ListItem
              supporting="Ali Connors — I'll be in your neighborhood doing errands."
              leading={<Icon name="person" size={24} />}
              trailing={<span className="text-xs text-surface-variant-foreground">3m</span>}
              lines={3}
            >
              Brunch this weekend?
            </ListItem>
            <ListItem
              supporting="to Alex, Scott — Wish I could come, but I'm out of town."
              leading={<Icon name="person" size={24} />}
              trailing={<span className="text-xs text-surface-variant-foreground">1h</span>}
              lines={3}
            >
              Summer BBQ
            </ListItem>
          </List>
        </Showcase>
      </section>

      <PropsTable
        componentName="List"
        props={[
          { name: "className", type: "string", description: "Additional CSS classes" },
          { name: "children", type: "ReactNode", description: "ListItem elements", required: true },
        ]}
      />

      <PropsTable
        componentName="ListItem"
        props={[
          { name: "leading", type: "ReactNode", description: "Leading element (icon, avatar, image)" },
          { name: "trailing", type: "ReactNode", description: "Trailing element (icon, text, checkbox)" },
          { name: "overline", type: "string", description: "Overline text above the headline" },
          { name: "supporting", type: "string", description: "Supporting text below the headline" },
          { name: "children", type: "ReactNode", description: "Headline content", required: true },
          { name: "lines", type: "1 | 2 | 3", default: "1", description: "Number of text lines to display" },
          { name: "selected", type: "boolean", description: "Whether the item is selected" },
          { name: "disabled", type: "boolean", description: "Disables the item" },
          { name: "interactive", type: "boolean", description: "Enables hover and press states" },
          { name: "onClick", type: "() => void", description: "Click handler (implies interactive)" },
          { name: "className", type: "string", description: "Additional CSS classes" },
        ]}
      />
    </div>
  );
}

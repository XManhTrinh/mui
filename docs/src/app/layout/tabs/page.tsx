"use client";

import * as React from "react";
import { Tabs, TabList, Tab, TabContent } from "@mui/index";
import { Showcase } from "@/components/showcase";
import { PropsTable, type PropDef } from "@/components/props-table";

const tabsProps: PropDef[] = [
  {
    name: "defaultValue",
    type: "string",
    description: "Initial active tab value (uncontrolled)",
  },
  {
    name: "value",
    type: "string",
    description: "Controlled active tab value",
  },
  {
    name: "onValueChange",
    type: "(value: string) => void",
    description: "Callback when active tab changes",
  },
  {
    name: "variant",
    type: '"primary" | "secondary"',
    default: '"primary"',
    description: "Tab indicator style: primary (3dp, label-width) or secondary (2dp, full-width)",
  },
  {
    name: "children",
    type: "ReactNode",
    description: "TabList and TabContent elements",
    required: true,
  },
];

const tabProps: PropDef[] = [
  {
    name: "value",
    type: "string",
    description: "Unique value identifying this tab",
    required: true,
  },
  {
    name: "label",
    type: "string",
    description: "Tab label text",
    required: true,
  },
  {
    name: "icon",
    type: "string",
    description: "Material Symbols icon name (8dp gap between icon and label)",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disable the tab",
  },
];

export default function TabsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Tabs
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Tabs organize content across different screens and data sets.
          Follows M3 Expressive specs: primary indicator is 3dp spanning label only,
          secondary indicator is 2dp full-width. Icon-label gap is 8dp.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Primary Tabs</h2>
        <Showcase title="Primary" className="flex-col items-stretch" code={`<Tabs defaultValue="tab1" variant="primary">\n  <TabList>\n    <Tab value="tab1" label="Flights" />\n    <Tab value="tab2" label="Hotels" />\n    <Tab value="tab3" label="Activities" />\n  </TabList>\n  <TabContent value="tab1">Flights content</TabContent>\n  <TabContent value="tab2">Hotels content</TabContent>\n</Tabs>`}>
          <Tabs defaultValue="tab1" variant="primary">
            <TabList>
              <Tab value="tab1" label="Flights" />
              <Tab value="tab2" label="Hotels" />
              <Tab value="tab3" label="Activities" />
            </TabList>
            <TabContent value="tab1">
              <p className="p-4 text-sm text-surface-foreground">Flights content</p>
            </TabContent>
            <TabContent value="tab2">
              <p className="p-4 text-sm text-surface-foreground">Hotels content</p>
            </TabContent>
            <TabContent value="tab3">
              <p className="p-4 text-sm text-surface-foreground">Activities content</p>
            </TabContent>
          </Tabs>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Secondary Tabs</h2>
        <Showcase title="Secondary" className="flex-col items-stretch" code={`<Tabs defaultValue="all" variant="secondary">\n  <TabList>\n    <Tab value="all" label="All" />\n    <Tab value="unread" label="Unread" />\n    <Tab value="starred" label="Starred" />\n  </TabList>\n  <TabContent value="all">All messages</TabContent>\n</Tabs>`}>
          <Tabs defaultValue="all" variant="secondary">
            <TabList>
              <Tab value="all" label="All" />
              <Tab value="unread" label="Unread" />
              <Tab value="starred" label="Starred" />
            </TabList>
            <TabContent value="all">
              <p className="p-4 text-sm text-surface-foreground">All messages</p>
            </TabContent>
            <TabContent value="unread">
              <p className="p-4 text-sm text-surface-foreground">Unread messages</p>
            </TabContent>
            <TabContent value="starred">
              <p className="p-4 text-sm text-surface-foreground">Starred messages</p>
            </TabContent>
          </Tabs>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Icons</h2>
        <Showcase title="Tabs with Icons" className="flex-col items-stretch" code={`<Tabs defaultValue="photos" variant="primary">\n  <TabList>\n    <Tab value="photos" icon="photo" label="Photos" />\n    <Tab value="videos" icon="videocam" label="Videos" />\n    <Tab value="music" icon="music_note" label="Music" />\n  </TabList>\n  <TabContent value="photos">Your photos</TabContent>\n</Tabs>`}>
          <Tabs defaultValue="photos" variant="primary">
            <TabList>
              <Tab value="photos" icon="photo" label="Photos" />
              <Tab value="videos" icon="videocam" label="Videos" />
              <Tab value="music" icon="music_note" label="Music" />
            </TabList>
            <TabContent value="photos">
              <p className="p-4 text-sm text-surface-foreground">Your photos</p>
            </TabContent>
            <TabContent value="videos">
              <p className="p-4 text-sm text-surface-foreground">Your videos</p>
            </TabContent>
            <TabContent value="music">
              <p className="p-4 text-sm text-surface-foreground">Your music</p>
            </TabContent>
          </Tabs>
        </Showcase>
      </section>

      {/* M3 Expressive Specs */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">M3 Expressive Specs</h2>
        <div className="rounded-xl border border-outline-variant p-4 space-y-2 text-sm text-surface-variant-foreground">
          <p><strong>Primary indicator:</strong> 3dp height, spans label text only</p>
          <p><strong>Secondary indicator:</strong> 2dp height, full tab width</p>
          <p><strong>Icon-label gap:</strong> 8dp vertical spacing between icon and label</p>
        </div>
      </section>

      <PropsTable componentName="Tabs" props={tabsProps} />
      <PropsTable componentName="Tab" props={tabProps} />
    </div>
  );
}

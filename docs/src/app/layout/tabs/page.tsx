"use client";

import * as React from "react";
import { Tabs, TabList, Tab, TabContent, Icon } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function TabsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Tabs
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Tabs organize content across different screens, data sets, and other
          interactions. They come in primary and secondary variants.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Primary Tabs</h2>
        <Showcase title="Primary" className="flex-col items-stretch">
          <Tabs defaultValue="tab1" variant="primary">
            <TabList>
              <Tab value="tab1">Flights</Tab>
              <Tab value="tab2">Hotels</Tab>
              <Tab value="tab3">Activities</Tab>
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
        <Showcase title="Secondary" className="flex-col items-stretch">
          <Tabs defaultValue="all" variant="secondary">
            <TabList>
              <Tab value="all">All</Tab>
              <Tab value="unread">Unread</Tab>
              <Tab value="starred">Starred</Tab>
              <Tab value="archived">Archived</Tab>
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
            <TabContent value="archived">
              <p className="p-4 text-sm text-surface-foreground">Archived messages</p>
            </TabContent>
          </Tabs>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Icons</h2>
        <Showcase title="Tabs with Icons" className="flex-col items-stretch">
          <Tabs defaultValue="photos" variant="primary">
            <TabList>
              <Tab value="photos" icon={<Icon name="photo" />}>Photos</Tab>
              <Tab value="videos" icon={<Icon name="videocam" />}>Videos</Tab>
              <Tab value="music" icon={<Icon name="music_note" />}>Music</Tab>
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

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Icon Only</h2>
        <Showcase title="Icon-Only Tabs" className="flex-col items-stretch">
          <Tabs defaultValue="home" variant="primary">
            <TabList>
              <Tab value="home" icon={<Icon name="home" />} />
              <Tab value="search" icon={<Icon name="search" />} />
              <Tab value="favorite" icon={<Icon name="favorite" />} />
              <Tab value="settings" icon={<Icon name="settings" />} />
            </TabList>
          </Tabs>
        </Showcase>
      </section>
    </div>
  );
}

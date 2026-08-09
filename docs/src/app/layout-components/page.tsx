"use client";

import * as React from "react";
import {
  AppBar,
  Tabs,
  TabList,
  Tab,
  TabContent,
  BottomSheet,
  SideSheet,
  Toolbar,
  ToolbarLeading,
  ToolbarHeadline,
  ToolbarActions,
  ToolbarAction,
  Carousel,
  CarouselItem,
  Icon,
  Button,
  IconButton,
} from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function LayoutComponentsPage() {
  const [activeTab, setActiveTab] = React.useState("tab1");
  const [secondaryTab, setSecondaryTab] = React.useState("photos");
  const [bottomSheetOpen, setBottomSheetOpen] = React.useState(false);
  const [sideSheetOpen, setSideSheetOpen] = React.useState(false);

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-surface-foreground mb-1">
          Layout Components
        </h1>
        <p className="text-surface-variant-foreground">
          Layout components provide structure and organize content within an
          application.
        </p>
      </div>

      {/* AppBar */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">App Bar</h2>

        <Showcase title="App Bar" className="flex-col items-stretch">
          <div className="rounded-xl overflow-hidden border border-outline-variant">
            <AppBar
              leadingIcon={
                <IconButton variant="standard" aria-label="Menu">
                  <Icon name="menu" />
                </IconButton>
              }
              headline="Page Title"
              trailingIcons={
                <>
                  <IconButton variant="standard" aria-label="Search">
                    <Icon name="search" />
                  </IconButton>
                  <IconButton variant="standard" aria-label="More">
                    <Icon name="more_vert" />
                  </IconButton>
                </>
              }
            />
          </div>
        </Showcase>

        <Showcase title="App Bar with Actions" className="flex-col items-stretch">
          <div className="rounded-xl overflow-hidden border border-outline-variant">
            <AppBar
              leadingIcon={
                <IconButton variant="standard" aria-label="Back">
                  <Icon name="arrow_back" />
                </IconButton>
              }
              headline="Settings"
              trailingIcons={
                <IconButton variant="standard" aria-label="Help">
                  <Icon name="help" />
                </IconButton>
              }
            />
          </div>
        </Showcase>
      </section>

      {/* Tabs */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Tabs</h2>

        <Showcase title="Primary Tabs" className="flex-col items-stretch">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabList>
              <Tab value="tab1" label="Overview" />
              <Tab value="tab2" label="Specifications" />
              <Tab value="tab3" label="Reviews" />
            </TabList>
            <TabContent value="tab1" className="p-4">
              <p className="text-sm text-surface-variant-foreground">
                Overview content goes here.
              </p>
            </TabContent>
            <TabContent value="tab2" className="p-4">
              <p className="text-sm text-surface-variant-foreground">
                Specification details go here.
              </p>
            </TabContent>
            <TabContent value="tab3" className="p-4">
              <p className="text-sm text-surface-variant-foreground">
                User reviews are displayed here.
              </p>
            </TabContent>
          </Tabs>
        </Showcase>

        <Showcase title="Secondary Tabs with Icons" className="flex-col items-stretch">
          <Tabs value={secondaryTab} onValueChange={setSecondaryTab} variant="secondary">
            <TabList>
              <Tab value="photos" icon="photo" label="Photos" />
              <Tab value="videos" icon="videocam" label="Videos" />
              <Tab value="music" icon="music_note" label="Music" />
            </TabList>
            <TabContent value="photos" className="p-4">
              <p className="text-sm text-surface-variant-foreground">
                Your photo gallery.
              </p>
            </TabContent>
            <TabContent value="videos" className="p-4">
              <p className="text-sm text-surface-variant-foreground">
                Your video collection.
              </p>
            </TabContent>
            <TabContent value="music" className="p-4">
              <p className="text-sm text-surface-variant-foreground">
                Your music library.
              </p>
            </TabContent>
          </Tabs>
        </Showcase>
      </section>

      {/* Bottom Sheet */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Bottom Sheet</h2>

        <Showcase title="Bottom Sheet">
          <Button variant="filled" onClick={() => setBottomSheetOpen(true)}>
            Open Bottom Sheet
          </Button>
          <BottomSheet
            open={bottomSheetOpen}
            onOpenChange={setBottomSheetOpen}
          >
            <div className="space-y-3 p-4">
              <h3 className="text-lg font-semibold">Share</h3>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container-high cursor-pointer">
                <Icon name="link" />
                <span>Copy link</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container-high cursor-pointer">
                <Icon name="mail" />
                <span>Email</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container-high cursor-pointer">
                <Icon name="message" />
                <span>Messages</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container-high cursor-pointer">
                <Icon name="download" />
                <span>Save to Drive</span>
              </div>
            </div>
          </BottomSheet>
        </Showcase>
      </section>

      {/* Side Sheet */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Side Sheet</h2>

        <Showcase title="Side Sheet">
          <Button variant="filled" onClick={() => setSideSheetOpen(true)}>
            Open Side Sheet
          </Button>
          <SideSheet
            open={sideSheetOpen}
            onOpenChange={setSideSheetOpen}
            headline="Filters"
          >
            <div className="space-y-4 p-4">
              <p className="text-sm text-surface-variant-foreground">
                Apply filters to narrow down your results.
              </p>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <div className="flex flex-wrap gap-2">
                  <Button variant="tonal" size="s">All</Button>
                  <Button variant="outlined" size="s">Photos</Button>
                  <Button variant="outlined" size="s">Videos</Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outlined" size="s">Today</Button>
                  <Button variant="outlined" size="s">This Week</Button>
                  <Button variant="tonal" size="s">This Month</Button>
                </div>
              </div>
            </div>
          </SideSheet>
        </Showcase>
      </section>

      {/* Toolbar */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Toolbar</h2>

        <Showcase title="Toolbar" className="flex-col items-stretch">
          <div className="rounded-xl overflow-hidden border border-outline-variant">
            <Toolbar>
              <ToolbarLeading icon="menu" />
              <ToolbarHeadline>Documents</ToolbarHeadline>
              <ToolbarActions>
                <ToolbarAction icon="search" label="Search" />
                <ToolbarAction icon="filter_list" label="Filter" />
                <ToolbarAction icon="more_vert" label="More" />
              </ToolbarActions>
            </Toolbar>
          </div>
        </Showcase>
      </section>

      {/* Carousel */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Carousel</h2>

        <Showcase title="Carousel" className="flex-col items-stretch">
          <Carousel>
            <CarouselItem>
              <div className="h-48 rounded-2xl bg-primary-container flex items-center justify-center">
                <Icon name="image" size={48} className="text-primary-container-foreground" />
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="h-48 rounded-2xl bg-secondary-container flex items-center justify-center">
                <Icon name="landscape" size={48} className="text-secondary-container-foreground" />
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="h-48 rounded-2xl bg-tertiary-container flex items-center justify-center">
                <Icon name="palette" size={48} className="text-tertiary-container-foreground" />
              </div>
            </CarouselItem>
          </Carousel>
        </Showcase>
      </section>

      {/* Props Tables */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">AppBar Props</h2>
        <div className="overflow-x-auto rounded-xl border border-outline-variant">
          <table className="w-full text-sm">
            <thead className="bg-surface-container">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Prop</th>
                <th className="text-left px-4 py-2 font-medium">Type</th>
                <th className="text-left px-4 py-2 font-medium">Default</th>
                <th className="text-left px-4 py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              <tr>
                <td className="px-4 py-2 font-mono text-xs">leadingIcon</td>
                <td className="px-4 py-2 font-mono text-xs">ReactNode</td>
                <td className="px-4 py-2 font-mono text-xs">—</td>
                <td className="px-4 py-2">Leading icon/button slot</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">headline</td>
                <td className="px-4 py-2 font-mono text-xs">ReactNode</td>
                <td className="px-4 py-2 font-mono text-xs">—</td>
                <td className="px-4 py-2">Title text</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">trailingIcons</td>
                <td className="px-4 py-2 font-mono text-xs">ReactNode</td>
                <td className="px-4 py-2 font-mono text-xs">—</td>
                <td className="px-4 py-2">Trailing icons/actions slot</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-semibold">Tabs Props</h2>
        <div className="overflow-x-auto rounded-xl border border-outline-variant">
          <table className="w-full text-sm">
            <thead className="bg-surface-container">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Prop</th>
                <th className="text-left px-4 py-2 font-medium">Type</th>
                <th className="text-left px-4 py-2 font-medium">Default</th>
                <th className="text-left px-4 py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              <tr>
                <td className="px-4 py-2 font-mono text-xs">value</td>
                <td className="px-4 py-2 font-mono text-xs">string</td>
                <td className="px-4 py-2 font-mono text-xs">—</td>
                <td className="px-4 py-2">Active tab value (controlled)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">onValueChange</td>
                <td className="px-4 py-2 font-mono text-xs">{`(value: string) => void`}</td>
                <td className="px-4 py-2 font-mono text-xs">—</td>
                <td className="px-4 py-2">Callback when tab changes</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">variant (TabList)</td>
                <td className="px-4 py-2 font-mono text-xs">{`"primary" | "secondary"`}</td>
                <td className="px-4 py-2 font-mono text-xs">{`"primary"`}</td>
                <td className="px-4 py-2">Tab list visual style</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

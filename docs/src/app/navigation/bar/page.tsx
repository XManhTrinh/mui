"use client";

import * as React from "react";
import { NavigationBar, Switch } from "@mui/index";
import { Showcase, Playground } from "@/components/showcase";
import { PropsTable } from "@/components/props-table";
import { AccessibilityNotes } from "@/components/accessibility-notes";

export default function NavigationBarPage() {
  const [active, setActive] = React.useState("home");
  // Playground state
  const [pgActive, setPgActive] = React.useState("home");
  const [showBadges, setShowBadges] = React.useState(false);

  const playgroundCode = `<NavigationBar value={active} onValueChange={setActive}>
  <NavigationBar.Item value="home" icon="home" label="Home" />
  <NavigationBar.Item value="search" icon="search" label="Search"${showBadges ? ' badge="dot"' : ""} />
  <NavigationBar.Item value="notifications" icon="notifications" label="Alerts"${showBadges ? " badge={5}" : ""} />
  <NavigationBar.Item value="profile" icon="person" label="Profile" />
</NavigationBar>`;

  return (
    <div className="max-w-4xl space-y-8">
      {/* Hero */}
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Navigation Bar
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Navigation bars let people switch between UI views on smaller devices.
          Use for 3–5 destinations. Follows M3 Expressive specs: active indicator
          is 64×32dp pill, no drop shadow (tonal elevation only).
        </p>
      </div>

      {/* Playground */}
      <Playground
        title="Playground"
        code={playgroundCode}
        controls={
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[13px] text-surface-foreground">Show Badges</span>
              <Switch checked={showBadges} onCheckedChange={setShowBadges} />
            </label>
          </div>
        }
      >
        <div className="relative h-20 w-full">
          <NavigationBar value={pgActive} onValueChange={setPgActive} className="relative!">
            <NavigationBar.Item value="home" icon="home" label="Home" />
            <NavigationBar.Item value="search" icon="search" label="Search" badge={showBadges ? "dot" : undefined} />
            <NavigationBar.Item value="notifications" icon="notifications" label="Alerts" badge={showBadges ? 5 : undefined} />
            <NavigationBar.Item value="profile" icon="person" label="Profile" />
          </NavigationBar>
        </div>
      </Playground>

      {/* Examples */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Basic Navigation</h2>
        <Showcase
          title="Basic Navigation"
          className="flex-col items-stretch"
          code={`<NavigationBar value={active} onValueChange={setActive}>\n  <NavigationBar.Item value="home" icon="home" label="Home" />\n  <NavigationBar.Item value="search" icon="search" label="Search" />\n  <NavigationBar.Item value="profile" icon="person" label="Profile" />\n</NavigationBar>`}
        >
          <div className="relative h-20">
            <NavigationBar value={active} onValueChange={setActive} className="relative!">
              <NavigationBar.Item value="home" icon="home" label="Home" />
              <NavigationBar.Item value="search" icon="search" label="Search" />
              <NavigationBar.Item value="profile" icon="person" label="Profile" />
            </NavigationBar>
          </div>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Badges</h2>
        <Showcase
          title="With Badges"
          className="flex-col items-stretch"
          code={`<NavigationBar value={active} onValueChange={setActive}>\n  <NavigationBar.Item value="home" icon="home" label="Home" />\n  <NavigationBar.Item value="search" icon="search" label="Search" badge="dot" />\n  <NavigationBar.Item value="notifications" icon="notifications" label="Alerts" badge={5} />\n  <NavigationBar.Item value="profile" icon="person" label="Profile" badge={3} />\n</NavigationBar>`}
        >
          <div className="relative h-20">
            <NavigationBar value={active} onValueChange={setActive} className="relative!">
              <NavigationBar.Item value="home" icon="home" label="Home" />
              <NavigationBar.Item value="search" icon="search" label="Search" badge="dot" />
              <NavigationBar.Item value="notifications" icon="notifications" label="Alerts" badge={5} />
              <NavigationBar.Item value="profile" icon="person" label="Profile" badge={3} />
            </NavigationBar>
          </div>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Five Destinations</h2>
        <Showcase
          title="Five Destinations"
          className="flex-col items-stretch"
          code={`<NavigationBar value={active} onValueChange={setActive}>\n  <NavigationBar.Item value="home" icon="home" label="Home" />\n  <NavigationBar.Item value="explore" icon="explore" label="Explore" />\n  <NavigationBar.Item value="search" icon="search" label="Search" />\n  <NavigationBar.Item value="library" icon="video_library" label="Library" />\n  <NavigationBar.Item value="profile" icon="person" label="Profile" />\n</NavigationBar>`}
        >
          <div className="relative h-20">
            <NavigationBar value={active} onValueChange={setActive} className="relative!">
              <NavigationBar.Item value="home" icon="home" label="Home" />
              <NavigationBar.Item value="explore" icon="explore" label="Explore" />
              <NavigationBar.Item value="search" icon="search" label="Search" />
              <NavigationBar.Item value="library" icon="video_library" label="Library" />
              <NavigationBar.Item value="profile" icon="person" label="Profile" />
            </NavigationBar>
          </div>
        </Showcase>
      </section>

      {/* Props Tables */}
      <PropsTable
        componentName="NavigationBar"
        props={[
          { name: "value", type: "string", description: "Controlled active item value" },
          { name: "defaultValue", type: "string", description: "Default active value (uncontrolled)" },
          { name: "onValueChange", type: "(value: string) => void", description: "Callback when active item changes" },
          { name: "children", type: "ReactNode", description: "NavigationBar.Item elements", required: true },
          { name: "className", type: "string", description: "Additional CSS classes" },
        ]}
      />

      <PropsTable
        componentName="NavigationBar.Item"
        props={[
          { name: "value", type: "string", description: "Unique value identifying this item", required: true },
          { name: "icon", type: "string", description: "Material Symbols icon name", required: true },
          { name: "activeIcon", type: "string", description: "Filled icon when active (defaults to icon)" },
          { name: "label", type: "string", description: "Label text below icon", required: true },
          { name: "badge", type: '"dot" | number', description: "Badge indicator on the icon" },
          { name: "className", type: "string", description: "Additional CSS classes" },
        ]}
      />

      {/* Accessibility */}
      <AccessibilityNotes
        componentName="NavigationBar"
        notes={[
          { category: "aria", description: "Container uses role=\"tablist\", items use role=\"tab\" with aria-selected" },
          { category: "keyboard", description: "Items are focusable with Tab, activation on Enter/Space" },
          { category: "screen-reader", description: "Each item has aria-label matching the label text" },
          { category: "focus", description: "Active indicator provides 64×32dp focus target, focus-visible ring on keyboard navigation" },
        ]}
      />
    </div>
  );
}

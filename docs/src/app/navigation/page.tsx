"use client";

import * as React from "react";
import { NavigationBar, NavigationRail, Icon } from "@mui/index";
import type { NavigationBarItem, NavigationRailItem } from "@mui/index";
import { Showcase } from "@/components/showcase";

const navBarItems: NavigationBarItem[] = [
  { value: "home", icon: "home", activeIcon: "home", label: "Home" },
  { value: "explore", icon: "explore", activeIcon: "explore", label: "Explore" },
  { value: "saved", icon: "bookmark", activeIcon: "bookmark", label: "Saved", badge: 3 },
  { value: "profile", icon: "person", activeIcon: "person", label: "Profile", badge: "dot" },
];

const railItems: NavigationRailItem[] = [
  { value: "inbox", icon: "inbox", activeIcon: "inbox", label: "Inbox", badge: 12 },
  { value: "articles", icon: "article", activeIcon: "article", label: "Articles" },
  { value: "chat", icon: "chat", activeIcon: "chat", label: "Chat", badge: "dot" },
  { value: "spaces", icon: "group", activeIcon: "group", label: "Spaces" },
];

export default function NavigationPage() {
  const [navBarValue, setNavBarValue] = React.useState("home");
  const [railValue, setRailValue] = React.useState("inbox");
  const [railExpandedValue, setRailExpandedValue] = React.useState("inbox");

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Navigation
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Navigation components help users move between destinations in an app.
        </p>
      </div>

      {/* NavigationBar */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Navigation Bar</h2>

        <Showcase title="Navigation Bar with Badges" className="flex-col items-stretch">
          <div className="relative w-full max-w-md mx-auto">
            <NavigationBar
              items={navBarItems}
              activeValue={navBarValue}
              onValueChange={setNavBarValue}
            />
          </div>
        </Showcase>
      </section>

      {/* NavigationRail */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Navigation Rail</h2>

        <Showcase title="Collapsed Navigation Rail" className="flex-col items-stretch">
          <div className="relative h-96 w-full border border-outline-variant rounded-xl overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0">
              <NavigationRail
                variant="collapsed"
                items={railItems}
                activeValue={railValue}
                onValueChange={setRailValue}
                className="relative!"
              />
            </div>
            <div className="ml-24 p-4">
              <p className="text-sm text-surface-variant-foreground">
                Content area — selected: <strong>{railValue}</strong>
              </p>
            </div>
          </div>
        </Showcase>

        <Showcase title="Expanded Navigation Rail" className="flex-col items-stretch">
          <div className="relative h-96 w-full border border-outline-variant rounded-xl overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0">
              <NavigationRail
                variant="expanded"
                items={railItems}
                activeValue={railExpandedValue}
                onValueChange={setRailExpandedValue}
                className="relative! w-64!"
              />
            </div>
            <div className="ml-64 p-4">
              <p className="text-sm text-surface-variant-foreground">
                Content area — selected: <strong>{railExpandedValue}</strong>
              </p>
            </div>
          </div>
        </Showcase>
      </section>

      {/* Props Table */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">NavigationBar Props</h2>
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
                <td className="px-4 py-2 font-mono text-xs">items</td>
                <td className="px-4 py-2 font-mono text-xs">NavigationBarItem[]</td>
                <td className="px-4 py-2 font-mono text-xs">required</td>
                <td className="px-4 py-2">Navigation destinations</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">activeValue</td>
                <td className="px-4 py-2 font-mono text-xs">string</td>
                <td className="px-4 py-2 font-mono text-xs">—</td>
                <td className="px-4 py-2">Controlled active item value</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">onValueChange</td>
                <td className="px-4 py-2 font-mono text-xs">{`(value: string) => void`}</td>
                <td className="px-4 py-2 font-mono text-xs">—</td>
                <td className="px-4 py-2">Callback when active item changes</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-[22px] leading-7 font-normal">NavigationRail Props</h2>
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
                <td className="px-4 py-2 font-mono text-xs">variant</td>
                <td className="px-4 py-2 font-mono text-xs">{`"collapsed" | "expanded"`}</td>
                <td className="px-4 py-2 font-mono text-xs">{`"collapsed"`}</td>
                <td className="px-4 py-2">Rail display mode</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">items</td>
                <td className="px-4 py-2 font-mono text-xs">NavigationRailItem[]</td>
                <td className="px-4 py-2 font-mono text-xs">required</td>
                <td className="px-4 py-2">Navigation destinations</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">activeValue</td>
                <td className="px-4 py-2 font-mono text-xs">string</td>
                <td className="px-4 py-2 font-mono text-xs">—</td>
                <td className="px-4 py-2">Controlled active item</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">header</td>
                <td className="px-4 py-2 font-mono text-xs">ReactNode</td>
                <td className="px-4 py-2 font-mono text-xs">—</td>
                <td className="px-4 py-2">Header slot (FAB or logo)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">showLabels</td>
                <td className="px-4 py-2 font-mono text-xs">boolean</td>
                <td className="px-4 py-2 font-mono text-xs">true</td>
                <td className="px-4 py-2">Show item labels in collapsed mode</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

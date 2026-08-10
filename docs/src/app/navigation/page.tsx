"use client";

import * as React from "react";
import { NavigationBar, NavigationRail } from "@mui/index";
import type { NavigationBarItem } from "@mui/index";
import { Showcase } from "@/components/showcase";

const navBarItems: NavigationBarItem[] = [
  { value: "home", icon: "home", activeIcon: "home", label: "Home" },
  { value: "explore", icon: "explore", activeIcon: "explore", label: "Explore" },
  { value: "saved", icon: "bookmark", activeIcon: "bookmark", label: "Saved", badge: 3 },
  { value: "profile", icon: "person", activeIcon: "person", label: "Profile", badge: "dot" },
];

const railItems = [
  { value: "inbox", icon: "inbox", label: "Inbox" },
  { value: "articles", icon: "article", label: "Articles" },
  { value: "chat", icon: "chat", label: "Chat" },
  { value: "spaces", icon: "group", label: "Spaces" },
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
            <NavigationRail expanded={false} className="relative! h-full">
              <NavigationRail.Content>
                {railItems.map((item) => (
                  <NavigationRail.Item
                    key={item.value}
                    icon={item.icon}
                    label={item.label}
                    active={railValue === item.value}
                    onClick={() => setRailValue(item.value)}
                  />
                ))}
              </NavigationRail.Content>
            </NavigationRail>
            <div className="ml-24 p-4">
              <p className="text-sm text-surface-variant-foreground">
                Content area — selected: <strong>{railValue}</strong>
              </p>
            </div>
          </div>
        </Showcase>

        <Showcase title="Expanded Navigation Rail" className="flex-col items-stretch">
          <div className="relative h-96 w-full border border-outline-variant rounded-xl overflow-hidden">
            <NavigationRail expanded={true} className="relative! h-full w-64!">
              <NavigationRail.Content>
                {railItems.map((item) => (
                  <NavigationRail.Item
                    key={item.value}
                    icon={item.icon}
                    label={item.label}
                    active={railExpandedValue === item.value}
                    onClick={() => setRailExpandedValue(item.value)}
                  />
                ))}
              </NavigationRail.Content>
            </NavigationRail>
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
        <h2 className="text-[22px] leading-7 font-normal">NavigationRail API</h2>
        <div className="overflow-x-auto rounded-xl border border-outline-variant">
          <table className="w-full text-sm">
            <thead className="bg-surface-container">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Component</th>
                <th className="text-left px-4 py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              <tr>
                <td className="px-4 py-2 font-mono text-xs">NavigationRail</td>
                <td className="px-4 py-2">Container. Accepts `expanded` prop for width control.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">NavigationRail.Header</td>
                <td className="px-4 py-2">Top slot — burger menu, FAB, logo.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">NavigationRail.Content</td>
                <td className="px-4 py-2">Scrollable area for items.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">NavigationRail.Item</td>
                <td className="px-4 py-2">Nav item — morphs between expanded/collapsed. Props: icon, label, active.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">NavigationRail.Footer</td>
                <td className="px-4 py-2">Bottom slot — theme toggle, settings, etc.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

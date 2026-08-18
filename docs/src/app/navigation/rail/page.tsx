"use client";

import * as React from "react";
import { NavigationRail } from "@mui/index";
import { Showcase } from "@/components/showcase";
import { PropsTable, type PropDef } from "@/components/props-table";

const railProps: PropDef[] = [
  {
    name: "expanded",
    type: "boolean",
    default: "false",
    description: "Whether the rail is expanded (shows labels inline) or collapsed (80dp width)",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes",
  },
  {
    name: "children",
    type: "ReactNode",
    description: "NavigationRail.Header, NavigationRail.Content, NavigationRail.Footer",
    required: true,
  },
];

const railItemProps: PropDef[] = [
  {
    name: "icon",
    type: "string",
    description: "Material Symbols icon name",
    required: true,
  },
  {
    name: "label",
    type: "string",
    description: "Label text (Label Medium: 12/16/500/0.5)",
    required: true,
  },
  {
    name: "active",
    type: "boolean",
    default: "false",
    description: "Whether this item is currently active",
  },
  {
    name: "onClick",
    type: "() => void",
    description: "Click handler for navigation",
  },
];

export default function NavigationRailPage() {
  const [activeItem, setActiveItem] = React.useState("home");
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Navigation Rail
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Navigation rails provide access to primary destinations in apps when
          using tablet and desktop screens. Composable — wrap items in links, add headers, footers, dividers.
          Follows M3 Expressive specs: collapsed width is 80dp (updated from 96dp).
          Label uses Label Medium (12/16/500/0.5) typography.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Collapsed</h2>
        <Showcase title="Collapsed Rail" className="justify-start min-h-80" code={`<NavigationRail expanded={false}>\n  <NavigationRail.Content>\n    <NavigationRail.Item icon="home" label="Home" active />\n    <NavigationRail.Item icon="explore" label="Explore" />\n    <NavigationRail.Item icon="video_library" label="Library" />\n    <NavigationRail.Item icon="settings" label="Settings" />\n  </NavigationRail.Content>\n</NavigationRail>`}>
          <NavigationRail expanded={false} className="relative! h-80">
            <NavigationRail.Content>
              {["home", "explore", "video_library", "settings"].map((icon) => (
                <NavigationRail.Item
                  key={icon}
                  icon={icon}
                  label={icon.replace("_", " ")}
                  active={activeItem === icon}
                  onClick={() => setActiveItem(icon)}
                />
              ))}
            </NavigationRail.Content>
          </NavigationRail>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Expanded</h2>
        <Showcase title="Expanded Rail" className="justify-start min-h-80" code={`<NavigationRail expanded={true}>\n  <NavigationRail.Content>\n    <NavigationRail.Item icon="home" label="Home" active />\n    <NavigationRail.Item icon="explore" label="Explore" />\n    <NavigationRail.Item icon="video_library" label="Library" />\n    <NavigationRail.Item icon="settings" label="Settings" />\n  </NavigationRail.Content>\n</NavigationRail>`}>
          <NavigationRail expanded={true} className="relative! h-80 w-80!">
            <NavigationRail.Content>
              {["home", "explore", "video_library", "settings"].map((icon) => (
                <NavigationRail.Item
                  key={icon}
                  icon={icon}
                  label={icon.replace("_", " ")}
                  active={activeItem === icon}
                  onClick={() => setActiveItem(icon)}
                />
              ))}
            </NavigationRail.Content>
          </NavigationRail>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Collapsible</h2>
        <Showcase title="Toggle expanded/collapsed" className="justify-start min-h-80" code={`<NavigationRail expanded={expanded}>\n  <NavigationRail.Header>\n    <IconButton icon="menu" onClick={toggle} />\n  </NavigationRail.Header>\n  <NavigationRail.Content>\n    <NavigationRail.Item icon="home" label="Home" active />\n  </NavigationRail.Content>\n</NavigationRail>`}>
          <div className="relative h-80 w-full overflow-hidden rounded-xl border border-outline-variant">
            <NavigationRail expanded={expanded} className="relative! h-full">
              <NavigationRail.Header>
                <button
                  onClick={() => setExpanded((p) => !p)}
                  className="flex items-center justify-center w-12 h-12 rounded-full cursor-pointer hover:bg-[hsl(var(--on-surface)/0.08)]"
                >
                  <span className="material-symbols-rounded text-surface-variant-foreground" style={{ fontSize: 24 }}>menu</span>
                </button>
              </NavigationRail.Header>
              <NavigationRail.Content>
                {["home", "explore", "video_library", "settings"].map((icon) => (
                  <NavigationRail.Item
                    key={icon}
                    icon={icon}
                    label={icon.replace("_", " ")}
                    active={activeItem === icon}
                    onClick={() => setActiveItem(icon)}
                  />
                ))}
              </NavigationRail.Content>
            </NavigationRail>
          </div>
        </Showcase>
      </section>

      {/* M3 Expressive Specs */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">M3 Expressive Specs</h2>
        <div className="rounded-xl border border-outline-variant p-4 space-y-2 text-sm text-surface-variant-foreground">
          <p><strong>Collapsed width:</strong> 80dp (updated from 96dp)</p>
          <p><strong>Label:</strong> Label Medium (12/16/500/0.5)</p>
          <p><strong>Active indicator:</strong> Pill shape with primary-container fill</p>
        </div>
      </section>

      <PropsTable componentName="NavigationRail" props={railProps} />
      <PropsTable componentName="NavigationRail.Item" props={railItemProps} />
    </div>
  );
}

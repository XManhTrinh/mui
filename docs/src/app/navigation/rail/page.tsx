"use client";

import * as React from "react";
import { NavigationRail } from "@mui/index";
import { Showcase } from "@/components/showcase";

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
    </div>
  );
}

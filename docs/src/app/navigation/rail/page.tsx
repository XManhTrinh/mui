"use client";

import * as React from "react";
import { NavigationRail, Icon, FAB } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function NavigationRailPage() {
  const [activeItem, setActiveItem] = React.useState("home");

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Navigation Rail
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Navigation rails provide access to primary destinations in apps when
          using tablet and desktop screens. They can be collapsed to show only
          icons or expanded to display labels.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Collapsed</h2>
        <Showcase title="Collapsed Rail" className="justify-start min-h-[400px]">
          <NavigationRail
            activeItem={activeItem}
            onActiveItemChange={setActiveItem}
            items={[
              { id: "home", icon: "home", label: "Home" },
              { id: "explore", icon: "explore", label: "Explore" },
              { id: "library", icon: "video_library", label: "Library" },
              { id: "settings", icon: "settings", label: "Settings" },
            ]}
          />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Expanded</h2>
        <Showcase title="Expanded Rail with Labels" className="justify-start min-h-[400px]">
          <NavigationRail
            expanded
            activeItem={activeItem}
            onActiveItemChange={setActiveItem}
            items={[
              { id: "home", icon: "home", label: "Home" },
              { id: "explore", icon: "explore", label: "Explore" },
              { id: "library", icon: "video_library", label: "Library" },
              { id: "settings", icon: "settings", label: "Settings" },
            ]}
          />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With FAB</h2>
        <Showcase title="Rail with Floating Action Button" className="justify-start min-h-[400px]">
          <NavigationRail
            activeItem="inbox"
            onActiveItemChange={setActiveItem}
            fab={<FAB size="m" icon={<Icon name="edit" />} aria-label="Compose" />}
            items={[
              { id: "inbox", icon: "inbox", label: "Inbox" },
              { id: "sent", icon: "send", label: "Sent" },
              { id: "drafts", icon: "drafts", label: "Drafts" },
              { id: "trash", icon: "delete", label: "Trash" },
            ]}
          />
        </Showcase>
      </section>
    </div>
  );
}

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
          using tablet and desktop screens.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Collapsed</h2>
        <Showcase title="Collapsed Rail" className="justify-start min-h-80">
          <NavigationRail
            variant="collapsed"
            activeValue={activeItem}
            onValueChange={setActiveItem}
            items={[
              { value: "home", icon: "home", label: "Home" },
              { value: "explore", icon: "explore", label: "Explore" },
              { value: "library", icon: "video_library", label: "Library" },
              { value: "settings", icon: "settings", label: "Settings" },
            ]}
            className="!static !relative"
          />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Expanded</h2>
        <Showcase title="Expanded Rail with Labels" className="justify-start min-h-80">
          <NavigationRail
            variant="expanded"
            activeValue={activeItem}
            onValueChange={setActiveItem}
            items={[
              { value: "home", icon: "home", label: "Home" },
              { value: "explore", icon: "explore", label: "Explore" },
              { value: "library", icon: "video_library", label: "Library" },
              { value: "settings", icon: "settings", label: "Settings" },
            ]}
            className="!static !relative !w-64"
          />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Badges</h2>
        <Showcase title="Rail with Badges" className="justify-start min-h-80">
          <NavigationRail
            variant="collapsed"
            activeValue="inbox"
            onValueChange={setActiveItem}
            items={[
              { value: "inbox", icon: "inbox", label: "Inbox", badge: 12 },
              { value: "sent", icon: "send", label: "Sent" },
              { value: "drafts", icon: "drafts", label: "Drafts", badge: "dot" },
              { value: "trash", icon: "delete", label: "Trash" },
            ]}
            className="!static !relative"
          />
        </Showcase>
      </section>
    </div>
  );
}

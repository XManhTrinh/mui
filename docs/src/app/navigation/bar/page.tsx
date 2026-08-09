"use client";

import * as React from "react";
import { NavigationBar, Badge, Icon } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function NavigationBarPage() {
  const [activeItem, setActiveItem] = React.useState("home");

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Navigation Bar
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Navigation bars let people switch between UI views on smaller devices.
          They should be used for three to five destinations.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Basic</h2>
        <Showcase title="Standard Navigation Bar" className="flex-col items-stretch">
          <NavigationBar
            activeItem={activeItem}
            onActiveItemChange={setActiveItem}
            items={[
              { id: "home", icon: "home", label: "Home" },
              { id: "explore", icon: "explore", label: "Explore" },
              { id: "library", icon: "video_library", label: "Library" },
              { id: "profile", icon: "person", label: "Profile" },
            ]}
          />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Badges</h2>
        <Showcase title="Navigation Bar with Badges" className="flex-col items-stretch">
          <NavigationBar
            activeItem="inbox"
            items={[
              { id: "inbox", icon: "inbox", label: "Inbox", badge: 12 },
              { id: "articles", icon: "article", label: "Articles", badge: "dot" },
              { id: "messages", icon: "chat", label: "Messages", badge: 3 },
              { id: "videos", icon: "play_circle", label: "Videos" },
            ]}
          />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Three Items</h2>
        <Showcase title="Minimal Navigation" className="flex-col items-stretch">
          <NavigationBar
            activeItem="feed"
            items={[
              { id: "feed", icon: "dynamic_feed", label: "Feed" },
              { id: "search", icon: "search", label: "Search" },
              { id: "settings", icon: "settings", label: "Settings" },
            ]}
          />
        </Showcase>
      </section>
    </div>
  );
}

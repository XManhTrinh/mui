"use client";

import * as React from "react";
import { NavigationBar } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function NavigationBarPage() {
  const [active, setActive] = React.useState("home");

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Navigation Bar
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Navigation bars let people switch between UI views on smaller devices.
          Use for 3–5 destinations.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Basic</h2>
        <Showcase title="Standard Navigation Bar" className="flex-col items-stretch">
          <div className="relative h-20">
            <NavigationBar
              activeValue={active}
              onValueChange={setActive}
              items={[
                { value: "home", icon: "home", label: "Home" },
                { value: "explore", icon: "explore", label: "Explore" },
                { value: "library", icon: "video_library", label: "Library" },
                { value: "profile", icon: "person", label: "Profile" },
              ]}
              className="!static !relative"
            />
          </div>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Badges</h2>
        <Showcase title="Badges" className="flex-col items-stretch">
          <div className="relative h-20">
            <NavigationBar
              activeValue="inbox"
              onValueChange={setActive}
              items={[
                { value: "inbox", icon: "inbox", label: "Inbox", badge: 12 },
                { value: "articles", icon: "article", label: "Articles", badge: "dot" },
                { value: "messages", icon: "chat", label: "Messages", badge: 3 },
                { value: "videos", icon: "play_circle", label: "Videos" },
              ]}
              className="!static !relative"
            />
          </div>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Three Items</h2>
        <Showcase title="Minimal" className="flex-col items-stretch">
          <div className="relative h-20">
            <NavigationBar
              activeValue="feed"
              items={[
                { value: "feed", icon: "dynamic_feed", label: "Feed" },
                { value: "search", icon: "search", label: "Search" },
                { value: "settings", icon: "settings", label: "Settings" },
              ]}
              className="!static !relative"
            />
          </div>
        </Showcase>
      </section>
    </div>
  );
}

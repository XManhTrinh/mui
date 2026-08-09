"use client";

import * as React from "react";
import { AppBar, IconButton, Icon } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function AppBarPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          App Bar
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Top app bars display information and actions at the top of a screen.
          They provide content and actions related to the current screen.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Basic</h2>
        <Showcase title="Simple App Bar" className="flex-col items-stretch">
          <AppBar headline="Page Title" />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Icons</h2>
        <Showcase title="App Bar with Navigation & Actions" className="flex-col items-stretch">
          <AppBar
            headline="Messages"
            leadingIcon={
              <IconButton variant="standard" aria-label="Menu">
                <Icon name="menu" />
              </IconButton>
            }
            trailingIcons={
              <>
                <IconButton variant="standard" aria-label="Search">
                  <Icon name="search" />
                </IconButton>
                <IconButton variant="standard" aria-label="More options">
                  <Icon name="more_vert" />
                </IconButton>
              </>
            }
          />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Subtitle</h2>
        <Showcase title="App Bar with Subtitle" className="flex-col items-stretch">
          <AppBar
            headline="Inbox"
            subtitle="3 new messages"
            leadingIcon={
              <IconButton variant="standard" aria-label="Back">
                <Icon name="arrow_back" />
              </IconButton>
            }
            trailingIcons={
              <IconButton variant="standard" aria-label="Search">
                <Icon name="search" />
              </IconButton>
            }
          />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Centered Title</h2>
        <Showcase title="Centered" className="flex-col items-stretch">
          <AppBar
            headline="Profile"
            centered
            leadingIcon={
              <IconButton variant="standard" aria-label="Back">
                <Icon name="arrow_back" />
              </IconButton>
            }
            trailingIcons={
              <IconButton variant="standard" aria-label="Edit">
                <Icon name="edit" />
              </IconButton>
            }
          />
        </Showcase>
      </section>
    </div>
  );
}

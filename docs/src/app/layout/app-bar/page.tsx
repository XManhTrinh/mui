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
        <Showcase title="Simple App Bar" className="flex-col items-stretch" code={`<AppBar headline="Page Title" />`}>
          <AppBar headline="Page Title" />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Icons</h2>
        <Showcase title="App Bar with Navigation & Actions" className="flex-col items-stretch" code={`<AppBar\n  headline="Messages"\n  leadingIcon={\n    <IconButton variant="standard" aria-label="Menu">\n      <Icon name="menu" />\n    </IconButton>\n  }\n  trailingIcons={\n    <>\n      <IconButton variant="standard" aria-label="Search">\n        <Icon name="search" />\n      </IconButton>\n    </>\n  }\n/>`}>
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
        <Showcase title="App Bar with Subtitle" className="flex-col items-stretch" code={`<AppBar\n  headline="Inbox"\n  subtitle="3 new messages"\n  leadingIcon={<IconButton variant="standard"><Icon name="arrow_back" /></IconButton>}\n/>`}>
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
        <Showcase title="Centered" className="flex-col items-stretch" code={`<AppBar\n  headline="Profile"\n  centered\n  leadingIcon={<IconButton variant="standard"><Icon name="arrow_back" /></IconButton>}\n  trailingIcons={<IconButton variant="standard"><Icon name="edit" /></IconButton>}\n/>`}>
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

      {/* ─── Composable API ─────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Composable API</h2>
        <p className="text-[14px] leading-5 text-surface-variant-foreground">
          The composable compound component API gives you full control over the
          AppBar layout using <code>AppBar.Leading</code>,{" "}
          <code>AppBar.Headline</code>, and <code>AppBar.Trailing</code>{" "}
          sub-components. This is ideal when you need custom content in each slot.
        </p>

        <Showcase
          title="Composable — Navigation & Actions"
          className="flex-col items-stretch"
          code={`<AppBar elevated>\n  <AppBar.Leading>\n    <IconButton variant="standard" aria-label="Menu">\n      <Icon name="menu" />\n    </IconButton>\n  </AppBar.Leading>\n  <AppBar.Headline subtitle="3 new messages">Inbox</AppBar.Headline>\n  <AppBar.Trailing>\n    <IconButton variant="standard" aria-label="Search">\n      <Icon name="search" />\n    </IconButton>\n    <IconButton variant="standard" aria-label="More">\n      <Icon name="more_vert" />\n    </IconButton>\n  </AppBar.Trailing>\n</AppBar>`}
        >
          <AppBar elevated>
            <AppBar.Leading>
              <IconButton variant="standard" aria-label="Menu">
                <Icon name="menu" />
              </IconButton>
            </AppBar.Leading>
            <AppBar.Headline subtitle="3 new messages">Inbox</AppBar.Headline>
            <AppBar.Trailing>
              <IconButton variant="standard" aria-label="Search">
                <Icon name="search" />
              </IconButton>
              <IconButton variant="standard" aria-label="More">
                <Icon name="more_vert" />
              </IconButton>
            </AppBar.Trailing>
          </AppBar>
        </Showcase>

        <Showcase
          title="Composable — Centered with Back Navigation"
          className="flex-col items-stretch"
          code={`<AppBar centered>\n  <AppBar.Leading>\n    <IconButton variant="standard" aria-label="Back">\n      <Icon name="arrow_back" />\n    </IconButton>\n  </AppBar.Leading>\n  <AppBar.Headline>Settings</AppBar.Headline>\n  <AppBar.Trailing>\n    <IconButton variant="standard" aria-label="Save">\n      <Icon name="check" />\n    </IconButton>\n  </AppBar.Trailing>\n</AppBar>`}
        >
          <AppBar centered>
            <AppBar.Leading>
              <IconButton variant="standard" aria-label="Back">
                <Icon name="arrow_back" />
              </IconButton>
            </AppBar.Leading>
            <AppBar.Headline>Settings</AppBar.Headline>
            <AppBar.Trailing>
              <IconButton variant="standard" aria-label="Save">
                <Icon name="check" />
              </IconButton>
            </AppBar.Trailing>
          </AppBar>
        </Showcase>
      </section>
    </div>
  );
}

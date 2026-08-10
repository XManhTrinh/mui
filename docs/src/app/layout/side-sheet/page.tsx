"use client";

import * as React from "react";
import { SideSheet, Button, Icon } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function SideSheetPage() {
  const [rightOpen, setRightOpen] = React.useState(false);
  const [leftOpen, setLeftOpen] = React.useState(false);
  const [composableRight, setComposableRight] = React.useState(false);
  const [composableLeft, setComposableLeft] = React.useState(false);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Side Sheet
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Side sheets are surfaces containing supplementary content anchored to
          the left or right edge of the screen.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Right Side</h2>
        <Showcase title="Right Side Sheet" code={`<SideSheet\n  open={rightOpen}\n  onOpenChange={setRightOpen}\n  headline="Filters"\n  side="right"\n>\n  <p>Apply filters to narrow your results.</p>\n</SideSheet>`}>
          <Button variant="filled" onClick={() => setRightOpen(true)}>
            Open Right Sheet
          </Button>
          <SideSheet open={rightOpen} onOpenChange={setRightOpen} headline="Filters" side="right">
            <div className="space-y-4">
              <p className="text-sm text-surface-variant-foreground">
                Apply filters to narrow your results.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="tonal" size="s">All</Button>
                <Button variant="outlined" size="s">Photos</Button>
                <Button variant="outlined" size="s">Videos</Button>
              </div>
            </div>
          </SideSheet>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Left Side</h2>
        <Showcase title="Left Side Sheet" code={`<SideSheet\n  open={leftOpen}\n  onOpenChange={setLeftOpen}\n  headline="Navigation"\n  side="left"\n>\n  <div>Navigation content</div>\n</SideSheet>`}>
          <Button variant="outlined" onClick={() => setLeftOpen(true)}>
            Open Left Sheet
          </Button>
          <SideSheet open={leftOpen} onOpenChange={setLeftOpen} headline="Navigation" side="left">
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[hsl(var(--on-surface)/0.08)] cursor-pointer">
                <Icon name="home" size={24} className="text-surface-variant-foreground" />
                <span className="text-[14px] text-surface-foreground">Home</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[hsl(var(--on-surface)/0.08)] cursor-pointer">
                <Icon name="person" size={24} className="text-surface-variant-foreground" />
                <span className="text-[14px] text-surface-foreground">Profile</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[hsl(var(--on-surface)/0.08)] cursor-pointer">
                <Icon name="settings" size={24} className="text-surface-variant-foreground" />
                <span className="text-[14px] text-surface-foreground">Settings</span>
              </div>
            </div>
          </SideSheet>
        </Showcase>
      </section>

      {/* ─── Composable API ─────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Composable API</h2>
        <p className="text-[14px] leading-5 text-surface-variant-foreground">
          The composable API uses <code>SideSheet.Header</code>,{" "}
          <code>SideSheet.Content</code>, and <code>SideSheet.Actions</code>{" "}
          sub-components for structured layouts with header, scrollable content,
          and a fixed action bar at the bottom.
        </p>

        <Showcase
          title="Composable — Filters Panel"
          code={`<SideSheet open={open} onOpenChange={setOpen} side="right">\n  <SideSheet.Header headline="Filters" showClose />\n  <SideSheet.Content>\n    <p>Filter options go here...</p>\n  </SideSheet.Content>\n  <SideSheet.Actions>\n    <Button variant="outlined">Reset</Button>\n    <Button variant="filled">Apply</Button>\n  </SideSheet.Actions>\n</SideSheet>`}
        >
          <Button variant="filled" onClick={() => setComposableRight(true)}>
            Open Composable Sheet
          </Button>
          <SideSheet open={composableRight} onOpenChange={setComposableRight} side="right">
            <SideSheet.Header headline="Filters" showClose />
            <SideSheet.Content>
              <div className="space-y-4">
                <p className="text-sm text-surface-variant-foreground">
                  Narrow your results using the filters below.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="tonal" size="s">All</Button>
                  <Button variant="outlined" size="s">Photos</Button>
                  <Button variant="outlined" size="s">Videos</Button>
                  <Button variant="outlined" size="s">Documents</Button>
                </div>
              </div>
            </SideSheet.Content>
            <SideSheet.Actions>
              <Button variant="outlined" onClick={() => setComposableRight(false)}>Reset</Button>
              <Button variant="filled" onClick={() => setComposableRight(false)}>Apply</Button>
            </SideSheet.Actions>
          </SideSheet>
        </Showcase>

        <Showcase
          title="Composable — Details Panel (Left)"
          code={`<SideSheet open={open} onOpenChange={setOpen} side="left">\n  <SideSheet.Header headline="Item Details" showClose />\n  <SideSheet.Content>\n    <p>Detailed information...</p>\n  </SideSheet.Content>\n  <SideSheet.Actions>\n    <Button variant="outlined">Close</Button>\n    <Button variant="filled">Save</Button>\n  </SideSheet.Actions>\n</SideSheet>`}
        >
          <Button variant="outlined" onClick={() => setComposableLeft(true)}>
            Open Details Panel
          </Button>
          <SideSheet open={composableLeft} onOpenChange={setComposableLeft} side="left">
            <SideSheet.Header headline="Item Details" showClose />
            <SideSheet.Content>
              <div className="space-y-3">
                <p className="text-sm text-surface-variant-foreground">
                  View and edit the details for this item.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-surface-variant-foreground">Created</span>
                    <span className="text-surface-foreground">Jan 15, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-variant-foreground">Modified</span>
                    <span className="text-surface-foreground">Mar 2, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-variant-foreground">Size</span>
                    <span className="text-surface-foreground">2.4 MB</span>
                  </div>
                </div>
              </div>
            </SideSheet.Content>
            <SideSheet.Actions>
              <Button variant="outlined" onClick={() => setComposableLeft(false)}>Close</Button>
              <Button variant="filled" onClick={() => setComposableLeft(false)}>Save</Button>
            </SideSheet.Actions>
          </SideSheet>
        </Showcase>
      </section>
    </div>
  );
}

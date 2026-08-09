"use client";

import * as React from "react";
import { SideSheet, Button, Icon } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function SideSheetPage() {
  const [rightOpen, setRightOpen] = React.useState(false);
  const [leftOpen, setLeftOpen] = React.useState(false);

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
        <Showcase title="Right Side Sheet">
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
        <Showcase title="Left Side Sheet">
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
    </div>
  );
}

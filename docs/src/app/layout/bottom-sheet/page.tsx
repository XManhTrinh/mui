"use client";

import * as React from "react";
import { BottomSheet, Button, Icon } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function BottomSheetPage() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Bottom Sheet
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Bottom sheets are surfaces containing supplementary content, anchored
          to the bottom of the screen.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Modal</h2>
        <Showcase title="Modal Bottom Sheet">
          <Button variant="filled" onClick={() => setOpen(true)}>
            Open Bottom Sheet
          </Button>
          <BottomSheet open={open} onOpenChange={setOpen}>
            <div className="space-y-1 p-2">
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[hsl(var(--on-surface)/0.08)] cursor-pointer">
                <Icon name="link" size={24} className="text-surface-variant-foreground" />
                <span className="text-[14px] text-surface-foreground">Copy link</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[hsl(var(--on-surface)/0.08)] cursor-pointer">
                <Icon name="mail" size={24} className="text-surface-variant-foreground" />
                <span className="text-[14px] text-surface-foreground">Email</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[hsl(var(--on-surface)/0.08)] cursor-pointer">
                <Icon name="chat" size={24} className="text-surface-variant-foreground" />
                <span className="text-[14px] text-surface-foreground">Messages</span>
              </div>
            </div>
          </BottomSheet>
        </Showcase>
      </section>
    </div>
  );
}

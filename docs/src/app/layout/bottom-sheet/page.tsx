"use client";

import * as React from "react";
import { BottomSheet, Button, Icon } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function BottomSheetPage() {
  const [open, setOpen] = React.useState(false);
  const [composableOpen, setComposableOpen] = React.useState(false);
  const [composableOpen2, setComposableOpen2] = React.useState(false);

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
        <Showcase title="Modal Bottom Sheet" code={`<BottomSheet open={open} onOpenChange={setOpen}>\n  <div className="p-2">\n    <div>Copy link</div>\n    <div>Email</div>\n    <div>Messages</div>\n  </div>\n</BottomSheet>`}>
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

      {/* ─── Composable API ─────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Composable API</h2>
        <p className="text-[14px] leading-5 text-surface-variant-foreground">
          The composable API uses <code>BottomSheet.Handle</code>,{" "}
          <code>BottomSheet.Header</code>, <code>BottomSheet.Content</code>, and{" "}
          <code>BottomSheet.Actions</code> sub-components for structured sheet layouts
          with clear semantic sections.
        </p>

        <Showcase
          title="Composable — Share Sheet"
          code={`<BottomSheet open={open} onOpenChange={setOpen}>\n  <BottomSheet.Handle />\n  <BottomSheet.Header>\n    <h2 className="text-lg font-medium">Share</h2>\n  </BottomSheet.Header>\n  <BottomSheet.Content>\n    <p>Share this item with your contacts.</p>\n  </BottomSheet.Content>\n  <BottomSheet.Actions>\n    <Button variant="outlined">Cancel</Button>\n    <Button variant="filled">Share</Button>\n  </BottomSheet.Actions>\n</BottomSheet>`}
        >
          <Button variant="filled" onClick={() => setComposableOpen(true)}>
            Open Composable Sheet
          </Button>
          <BottomSheet open={composableOpen} onOpenChange={setComposableOpen}>
            <BottomSheet.Handle />
            <BottomSheet.Header>
              <h2 className="text-lg font-medium text-surface-foreground">Share</h2>
            </BottomSheet.Header>
            <BottomSheet.Content>
              <p className="text-sm text-surface-variant-foreground">
                Share this item with your contacts via email, message, or link.
              </p>
            </BottomSheet.Content>
            <BottomSheet.Actions>
              <Button variant="outlined" onClick={() => setComposableOpen(false)}>Cancel</Button>
              <Button variant="filled" onClick={() => setComposableOpen(false)}>Share</Button>
            </BottomSheet.Actions>
          </BottomSheet>
        </Showcase>

        <Showcase
          title="Composable — Confirmation Dialog"
          code={`<BottomSheet open={open} onOpenChange={setOpen}>\n  <BottomSheet.Handle />\n  <BottomSheet.Header>\n    <h2 className="text-lg font-medium">Delete item?</h2>\n  </BottomSheet.Header>\n  <BottomSheet.Content>\n    <p>This action cannot be undone.</p>\n  </BottomSheet.Content>\n  <BottomSheet.Actions>\n    <Button variant="outlined">Keep</Button>\n    <Button variant="filled">Delete</Button>\n  </BottomSheet.Actions>\n</BottomSheet>`}
        >
          <Button variant="outlined" onClick={() => setComposableOpen2(true)}>
            Open Confirmation Sheet
          </Button>
          <BottomSheet open={composableOpen2} onOpenChange={setComposableOpen2}>
            <BottomSheet.Handle />
            <BottomSheet.Header>
              <h2 className="text-lg font-medium text-surface-foreground">Delete item?</h2>
            </BottomSheet.Header>
            <BottomSheet.Content>
              <p className="text-sm text-surface-variant-foreground">
                This action cannot be undone. The item will be permanently removed from your library.
              </p>
            </BottomSheet.Content>
            <BottomSheet.Actions>
              <Button variant="outlined" onClick={() => setComposableOpen2(false)}>Keep</Button>
              <Button variant="filled" onClick={() => setComposableOpen2(false)}>Delete</Button>
            </BottomSheet.Actions>
          </BottomSheet>
        </Showcase>
      </section>
    </div>
  );
}

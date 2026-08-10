"use client";

import * as React from "react";
import { BottomSheet, Button } from "@mui/index";
import { Showcase } from "@/components/showcase";
import { PropsTable } from "@/components/props-table";
import { AccessibilityNotes } from "@/components/accessibility-notes";

export default function BottomSheetPage() {
  const [shareOpen, setShareOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [actionsOpen, setActionsOpen] = React.useState(false);

  return (
    <div className="max-w-4xl space-y-8">
      {/* Hero */}
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Bottom Sheet
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Bottom sheets are surfaces containing supplementary content, anchored
          to the bottom of the screen.
        </p>
      </div>

      {/* Examples */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Share Sheet</h2>
        <Showcase
          title="Share Sheet"
          code={`<BottomSheet open={open} onOpenChange={setOpen}>\n  <BottomSheet.Handle />\n  <BottomSheet.Header>\n    <h2 className="text-lg font-medium">Share</h2>\n  </BottomSheet.Header>\n  <BottomSheet.Content>\n    <p>Share this item with your contacts.</p>\n  </BottomSheet.Content>\n  <BottomSheet.Actions>\n    <Button variant="outlined">Cancel</Button>\n    <Button variant="filled">Share</Button>\n  </BottomSheet.Actions>\n</BottomSheet>`}
        >
          <Button variant="filled" onClick={() => setShareOpen(true)}>
            Open Share Sheet
          </Button>
          <BottomSheet open={shareOpen} onOpenChange={setShareOpen}>
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
              <Button variant="outlined" onClick={() => setShareOpen(false)}>Cancel</Button>
              <Button variant="filled" onClick={() => setShareOpen(false)}>Share</Button>
            </BottomSheet.Actions>
          </BottomSheet>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Confirmation Dialog</h2>
        <Showcase
          title="Confirmation Dialog"
          code={`<BottomSheet open={open} onOpenChange={setOpen}>\n  <BottomSheet.Handle />\n  <BottomSheet.Header>\n    <h2 className="text-lg font-medium">Delete item?</h2>\n  </BottomSheet.Header>\n  <BottomSheet.Content>\n    <p>This action cannot be undone.</p>\n  </BottomSheet.Content>\n  <BottomSheet.Actions>\n    <Button variant="outlined">Keep</Button>\n    <Button variant="filled">Delete</Button>\n  </BottomSheet.Actions>\n</BottomSheet>`}
        >
          <Button variant="outlined" onClick={() => setConfirmOpen(true)}>
            Open Confirmation Sheet
          </Button>
          <BottomSheet open={confirmOpen} onOpenChange={setConfirmOpen}>
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
              <Button variant="outlined" onClick={() => setConfirmOpen(false)}>Keep</Button>
              <Button variant="filled" onClick={() => setConfirmOpen(false)}>Delete</Button>
            </BottomSheet.Actions>
          </BottomSheet>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Content Only</h2>
        <Showcase
          title="Without Actions"
          code={`<BottomSheet open={open} onOpenChange={setOpen}>\n  <BottomSheet.Handle />\n  <BottomSheet.Header>\n    <h2 className="text-lg font-medium">Quick Actions</h2>\n  </BottomSheet.Header>\n  <BottomSheet.Content>\n    <div className="space-y-2">\n      <p>Select an option below to continue.</p>\n    </div>\n  </BottomSheet.Content>\n</BottomSheet>`}
        >
          <Button variant="tonal" onClick={() => setActionsOpen(true)}>
            Open Content Sheet
          </Button>
          <BottomSheet open={actionsOpen} onOpenChange={setActionsOpen}>
            <BottomSheet.Handle />
            <BottomSheet.Header>
              <h2 className="text-lg font-medium text-surface-foreground">Quick Actions</h2>
            </BottomSheet.Header>
            <BottomSheet.Content>
              <div className="space-y-2">
                <p className="text-sm text-surface-variant-foreground">
                  Select an option below to continue.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outlined" size="s" onClick={() => setActionsOpen(false)}>Copy Link</Button>
                  <Button variant="outlined" size="s" onClick={() => setActionsOpen(false)}>Download</Button>
                  <Button variant="outlined" size="s" onClick={() => setActionsOpen(false)}>Print</Button>
                </div>
              </div>
            </BottomSheet.Content>
          </BottomSheet>
        </Showcase>
      </section>

      {/* Props Tables */}
      <PropsTable
        componentName="BottomSheet"
        props={[
          { name: "open", type: "boolean", description: "Controls visibility of the bottom sheet", required: true },
          { name: "onOpenChange", type: "(open: boolean) => void", description: "Callback when open state changes", required: true },
          { name: "variant", type: '"standard" | "modal"', default: '"modal"', description: "Standard (inline) or modal (overlay with scrim)" },
          { name: "children", type: "ReactNode", description: "BottomSheet.Handle, .Header, .Content, .Actions", required: true },
          { name: "className", type: "string", description: "Additional CSS classes" },
        ]}
      />

      <PropsTable
        componentName="BottomSheet.Handle"
        props={[
          { name: "className", type: "string", description: "Additional CSS classes" },
        ]}
      />

      <PropsTable
        componentName="BottomSheet.Header"
        props={[
          { name: "children", type: "ReactNode", description: "Header content (typically a heading element)", required: true },
          { name: "className", type: "string", description: "Additional CSS classes" },
        ]}
      />

      <PropsTable
        componentName="BottomSheet.Content"
        props={[
          { name: "children", type: "ReactNode", description: "Scrollable content area", required: true },
          { name: "className", type: "string", description: "Additional CSS classes" },
        ]}
      />

      <PropsTable
        componentName="BottomSheet.Actions"
        props={[
          { name: "children", type: "ReactNode", description: "Action buttons (typically Cancel + Confirm)", required: true },
          { name: "className", type: "string", description: "Additional CSS classes" },
        ]}
      />

      {/* Accessibility */}
      <AccessibilityNotes
        componentName="BottomSheet"
        notes={[
          { category: "aria", description: "Modal variant uses role=\"dialog\" with aria-modal=\"true\"" },
          { category: "keyboard", description: "Escape key closes the sheet. Tab is trapped within modal variant." },
          { category: "screen-reader", description: "Scrim overlay is hidden with aria-hidden=\"true\"" },
          { category: "focus", description: "Focus is moved to the first focusable element when opened, returned to trigger on close" },
        ]}
      />
    </div>
  );
}

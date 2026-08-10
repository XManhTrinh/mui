"use client";

import * as React from "react";
import { SideSheet, Button } from "@mui/index";
import { Showcase } from "@/components/showcase";
import { PropsTable } from "@/components/props-table";
import { AccessibilityNotes } from "@/components/accessibility-notes";

export default function SideSheetPage() {
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  return (
    <div className="max-w-4xl space-y-8">
      {/* Hero */}
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Side Sheet
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Side sheets are surfaces containing supplementary content anchored to
          the left or right edge of the screen.
        </p>
      </div>

      {/* Examples */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Filters Panel</h2>
        <Showcase
          title="Filters Panel (Right)"
          code={`<SideSheet open={open} onOpenChange={setOpen} side="right">\n  <SideSheet.Header headline="Filters" showClose />\n  <SideSheet.Content>\n    <p>Filter options go here...</p>\n  </SideSheet.Content>\n  <SideSheet.Actions>\n    <Button variant="outlined">Reset</Button>\n    <Button variant="filled">Apply</Button>\n  </SideSheet.Actions>\n</SideSheet>`}
        >
          <Button variant="filled" onClick={() => setFiltersOpen(true)}>
            Open Filters Panel
          </Button>
          <SideSheet open={filtersOpen} onOpenChange={setFiltersOpen} side="right">
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
              <Button variant="outlined" onClick={() => setFiltersOpen(false)}>Reset</Button>
              <Button variant="filled" onClick={() => setFiltersOpen(false)}>Apply</Button>
            </SideSheet.Actions>
          </SideSheet>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Details Panel</h2>
        <Showcase
          title="Details Panel (Left)"
          code={`<SideSheet open={open} onOpenChange={setOpen} side="left">\n  <SideSheet.Header headline="Item Details" showClose />\n  <SideSheet.Content>\n    <p>Detailed information...</p>\n  </SideSheet.Content>\n  <SideSheet.Actions>\n    <Button variant="outlined">Close</Button>\n    <Button variant="filled">Save</Button>\n  </SideSheet.Actions>\n</SideSheet>`}
        >
          <Button variant="outlined" onClick={() => setDetailsOpen(true)}>
            Open Details Panel
          </Button>
          <SideSheet open={detailsOpen} onOpenChange={setDetailsOpen} side="left">
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
              <Button variant="outlined" onClick={() => setDetailsOpen(false)}>Close</Button>
              <Button variant="filled" onClick={() => setDetailsOpen(false)}>Save</Button>
            </SideSheet.Actions>
          </SideSheet>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Settings Panel</h2>
        <Showcase
          title="Settings (Right, No Actions)"
          code={`<SideSheet open={open} onOpenChange={setOpen} side="right">\n  <SideSheet.Header headline="Settings" showClose />\n  <SideSheet.Content>\n    <div className="space-y-4">\n      <p>Configuration options...</p>\n    </div>\n  </SideSheet.Content>\n</SideSheet>`}
        >
          <Button variant="tonal" onClick={() => setSettingsOpen(true)}>
            Open Settings
          </Button>
          <SideSheet open={settingsOpen} onOpenChange={setSettingsOpen} side="right">
            <SideSheet.Header headline="Settings" showClose />
            <SideSheet.Content>
              <div className="space-y-4">
                <p className="text-sm text-surface-variant-foreground">
                  Configure your preferences below.
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-surface-foreground">Notifications</span>
                    <span className="text-surface-variant-foreground">On</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-surface-foreground">Dark Mode</span>
                    <span className="text-surface-variant-foreground">Auto</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-surface-foreground">Language</span>
                    <span className="text-surface-variant-foreground">English</span>
                  </div>
                </div>
              </div>
            </SideSheet.Content>
          </SideSheet>
        </Showcase>
      </section>

      {/* Props Tables */}
      <PropsTable
        componentName="SideSheet"
        props={[
          { name: "open", type: "boolean", description: "Controls visibility of the side sheet", required: true },
          { name: "onOpenChange", type: "(open: boolean) => void", description: "Callback when open state changes", required: true },
          { name: "variant", type: '"standard" | "modal"', default: '"modal"', description: "Standard (inline with divider) or modal (overlay with scrim)" },
          { name: "side", type: '"left" | "right"', default: '"right"', description: "Which edge the sheet appears on" },
          { name: "children", type: "ReactNode", description: "SideSheet.Header, .Content, .Actions", required: true },
          { name: "className", type: "string", description: "Additional CSS classes" },
        ]}
      />

      <PropsTable
        componentName="SideSheet.Header"
        props={[
          { name: "headline", type: "string", description: "Title text for the header" },
          { name: "showClose", type: "boolean", default: "true", description: "Whether to show the close button" },
          { name: "children", type: "ReactNode", description: "Custom header content (overrides headline)" },
          { name: "className", type: "string", description: "Additional CSS classes" },
        ]}
      />

      <PropsTable
        componentName="SideSheet.Content"
        props={[
          { name: "children", type: "ReactNode", description: "Scrollable content area", required: true },
          { name: "className", type: "string", description: "Additional CSS classes" },
        ]}
      />

      <PropsTable
        componentName="SideSheet.Actions"
        props={[
          { name: "children", type: "ReactNode", description: "Action buttons (typically Reset + Apply)", required: true },
          { name: "className", type: "string", description: "Additional CSS classes" },
        ]}
      />

      {/* Accessibility */}
      <AccessibilityNotes
        componentName="SideSheet"
        notes={[
          { category: "aria", description: "Modal variant uses role=\"dialog\" with aria-modal. Standard variant uses role=\"complementary\"." },
          { category: "keyboard", description: "Escape key closes the sheet. Focus is trapped within modal variant." },
          { category: "screen-reader", description: "Sheet has aria-label from headline text. Scrim is hidden with aria-hidden." },
          { category: "focus", description: "Focus moves to first focusable element on open, returns to trigger element on close" },
        ]}
      />
    </div>
  );
}

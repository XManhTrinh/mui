"use client";

import * as React from "react";
import { FABMenu, Icon, Chip } from "@mui/index";
import { Showcase } from "@/components/showcase";
import { PropsTable } from "@/components/props-table";

export default function FABMenuPage() {
  const [lastAction, setLastAction] = React.useState<string | null>(null);

  return (
    <div className="max-w-5xl space-y-8">
      {/* Hero */}
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          FAB Menu
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          A speed-dial overlay that opens from a FAB to display 2–6 related
          actions. Click the FAB to expand, then click an action item. The menu
          closes automatically after selection.
        </p>
      </div>

      {/* Interactive Example */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Interactive Example</h2>
        <p className="text-[14px] text-surface-variant-foreground">
          Click the FAB, then pick an action. The selected action shows below.
        </p>
        <Showcase
          title="Click an action"
          code={`<FABMenu triggerIcon={<Icon name="add" />} triggerLabel="Actions">
  <FABMenu.Item icon={<Icon name="edit" />} label="Edit" onClick={() => setAction("Edit")} />
  <FABMenu.Item icon={<Icon name="share" />} label="Share" onClick={() => setAction("Share")} />
  <FABMenu.Item icon={<Icon name="delete" />} label="Delete" onClick={() => setAction("Delete")} />
</FABMenu>`}
        >
          <div className="flex items-end gap-6">
            <FABMenu triggerIcon={<Icon name="add" />} triggerLabel="Actions">
              <FABMenu.Item icon={<Icon name="edit" />} label="Edit" onClick={() => setLastAction("Edit")} />
              <FABMenu.Item icon={<Icon name="share" />} label="Share" onClick={() => setLastAction("Share")} />
              <FABMenu.Item icon={<Icon name="delete" />} label="Delete" onClick={() => setLastAction("Delete")} />
            </FABMenu>
            {lastAction && (
              <Chip variant="filter" selected className="animate-in fade-in-0 zoom-in-95">
                Action: {lastAction}
              </Chip>
            )}
          </div>
        </Showcase>
      </section>

      {/* Color Sets */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Color Sets</h2>

        <Showcase
          title="Primary (default)"
          code={`<FABMenu triggerIcon={<Icon name="add" />} triggerLabel="Actions">\n  <FABMenu.Item icon={<Icon name="edit" />} label="Edit" onClick={() => {}} />\n  <FABMenu.Item icon={<Icon name="share" />} label="Share" onClick={() => {}} />\n  <FABMenu.Item icon={<Icon name="delete" />} label="Delete" onClick={() => {}} />\n</FABMenu>`}
        >
          <FABMenu triggerIcon={<Icon name="add" />} triggerLabel="Actions">
            <FABMenu.Item icon={<Icon name="edit" />} label="Edit" onClick={() => {}} />
            <FABMenu.Item icon={<Icon name="share" />} label="Share" onClick={() => {}} />
            <FABMenu.Item icon={<Icon name="delete" />} label="Delete" onClick={() => {}} />
          </FABMenu>
        </Showcase>

      {/* Secondary Color */}
      <Showcase
        title="Secondary Color Set"
        code={`<FABMenu\n  triggerIcon={<Icon name="more_vert" />}\n  triggerLabel="More actions"\n  colorSet="secondary"\n>\n  <FABMenu.Item icon={<Icon name="bookmark" />} label="Save" onClick={() => {}} />\n  <FABMenu.Item icon={<Icon name="content_copy" />} label="Copy" onClick={() => {}} />\n  <FABMenu.Item icon={<Icon name="link" />} label="Link" onClick={() => {}} />\n</FABMenu>`}
      >
        <FABMenu
          triggerIcon={<Icon name="more_vert" />}
          triggerLabel="More actions"
          colorSet="secondary"
        >
          <FABMenu.Item icon={<Icon name="bookmark" />} label="Save" onClick={() => {}} />
          <FABMenu.Item icon={<Icon name="content_copy" />} label="Copy" onClick={() => {}} />
          <FABMenu.Item icon={<Icon name="link" />} label="Link" onClick={() => {}} />
        </FABMenu>
      </Showcase>

      {/* Tertiary Color */}
      <Showcase
        title="Tertiary Color Set"
        code={`<FABMenu\n  triggerIcon={<Icon name="palette" />}\n  triggerLabel="Creative tools"\n  colorSet="tertiary"\n>\n  <FABMenu.Item icon={<Icon name="brush" />} label="Draw" onClick={() => {}} />\n  <FABMenu.Item icon={<Icon name="text_fields" />} label="Text" onClick={() => {}} />\n  <FABMenu.Item icon={<Icon name="image" />} label="Image" onClick={() => {}} />\n</FABMenu>`}
      >
        <FABMenu
          triggerIcon={<Icon name="palette" />}
          triggerLabel="Creative tools"
          colorSet="tertiary"
        >
          <FABMenu.Item icon={<Icon name="brush" />} label="Draw" onClick={() => {}} />
          <FABMenu.Item icon={<Icon name="text_fields" />} label="Text" onClick={() => {}} />
          <FABMenu.Item icon={<Icon name="image" />} label="Image" onClick={() => {}} />
        </FABMenu>
        </Showcase>
      </section>

      {/* Icon-Only Items */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Icon-Only Items</h2>
        <p className="text-[14px] text-surface-variant-foreground">
          For a compact speed-dial, use shorter labels or set descriptive
          <code>aria-label</code> overrides. The items display icon + label by default.
        </p>
        <Showcase
          title="Compact Labels"
          code={`<FABMenu triggerIcon={<Icon name="edit" />} triggerLabel="Quick actions">
  <FABMenu.Item icon={<Icon name="image" />} label="Photo" onClick={() => {}} />
  <FABMenu.Item icon={<Icon name="videocam" />} label="Video" onClick={() => {}} />
  <FABMenu.Item icon={<Icon name="mic" />} label="Audio" onClick={() => {}} />
  <FABMenu.Item icon={<Icon name="attachment" />} label="File" onClick={() => {}} />
</FABMenu>`}
        >
          <FABMenu triggerIcon={<Icon name="edit" />} triggerLabel="Quick actions">
            <FABMenu.Item icon={<Icon name="image" />} label="Photo" onClick={() => {}} />
            <FABMenu.Item icon={<Icon name="videocam" />} label="Video" onClick={() => {}} />
            <FABMenu.Item icon={<Icon name="mic" />} label="Audio" onClick={() => {}} />
            <FABMenu.Item icon={<Icon name="attachment" />} label="File" onClick={() => {}} />
          </FABMenu>
        </Showcase>
      </section>

      {/* Props Tables */}
      <PropsTable
        componentName="FABMenu"
        props={[
          { name: "triggerIcon", type: "ReactNode", description: "Icon for the FAB trigger button", required: true },
          { name: "triggerLabel", type: "string", description: "Accessible label for the trigger button", required: true },
          { name: "colorSet", type: '"primary" | "secondary" | "tertiary"', default: '"primary"', description: "Color set for the close button and menu items" },
          { name: "open", type: "boolean", description: "Controlled open state" },
          { name: "defaultOpen", type: "boolean", default: "false", description: "Uncontrolled default open state" },
          { name: "onOpenChange", type: "(open: boolean) => void", description: "Callback when open state changes" },
          { name: "closeLabel", type: "string", default: '"Close menu"', description: "Accessible label for the close button" },
          { name: "children", type: "ReactNode", description: "FABMenu.Item elements (2–6 items)", required: true },
        ]}
      />

      <PropsTable
        componentName="FABMenu.Item"
        props={[
          { name: "icon", type: "ReactNode", description: "Icon element", required: true },
          { name: "label", type: "string", description: "Label text displayed beside the item", required: true },
          { name: "onClick", type: "() => void", description: "Action callback when item is clicked", required: true },
          { name: "aria-label", type: "string", description: "Optional aria-label override for the item" },
        ]}
      />
    </div>
  );
}

"use client";

import * as React from "react";
import { FABMenu, Icon } from "@mui/index";
import { Showcase } from "@/components/showcase";
import { PropsTable } from "@/components/props-table";

export default function FABMenuPage() {
  return (
    <div className="max-w-5xl space-y-8">
      {/* Hero */}
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          FAB Menu
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          A speed-dial overlay that opens from a FAB to display related actions.
          Use <code>FABMenu.Item</code> sub-components to compose each action.
          Supports staggered M3 Expressive spring animation, scrim backdrop, and
          keyboard navigation.
        </p>
      </div>

      {/* Composable API — Primary */}
      <Showcase
        title="Composable API — Primary"
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

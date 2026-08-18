"use client";

import * as React from "react";
import { FAB, ExtendedFAB, FABMenu, Icon } from "@mui/index";
import { Showcase } from "@/components/showcase";
import { PropsTable } from "@/components/props-table";
import { AccessibilityNotes } from "@/components/accessibility-notes";

export default function FABsPage() {
  return (
    <div className="max-w-5xl space-y-8">
      {/* Hero */}
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Floating Action Buttons
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          FABs represent the most important action on a screen. They come in
          standard and extended variants with multiple sizes and colors.
          Follows M3 Expressive specs: corner-large (<code>rounded-2xl</code>) at rest with
          shape morph (<code>active:rounded-xl</code>) on press. Elevation Level 3 at rest, Level 4 on hover.
        </p>
      </div>

      {/* FAB Examples */}
      <Showcase title="FAB Sizes" code={`<FAB size="m" icon={<Icon name="add" />} aria-label="Add" />\n<FAB size="l" icon={<Icon name="add" />} aria-label="Add" />\n<FAB size="xl" icon={<Icon name="add" />} aria-label="Add" />`}>
        <FAB size="m" icon={<Icon name="add" />} aria-label="Add" />
        <FAB size="l" icon={<Icon name="add" />} aria-label="Add" />
        <FAB size="xl" icon={<Icon name="add" />} aria-label="Add" />
      </Showcase>

      <Showcase title="FAB Colors" code={`<FAB color="primary" icon={<Icon name="edit" />} aria-label="Edit" />\n<FAB color="secondary" icon={<Icon name="edit" />} aria-label="Edit" />\n<FAB color="tertiary" icon={<Icon name="edit" />} aria-label="Edit" />`}>
        <FAB color="primary" icon={<Icon name="edit" />} aria-label="Edit" />
        <FAB color="secondary" icon={<Icon name="edit" />} aria-label="Edit" />
        <FAB color="tertiary" icon={<Icon name="edit" />} aria-label="Edit" />
      </Showcase>

      <Showcase title="FAB Round Shape" code={`<FAB shape="round" size="m" icon={<Icon name="navigation" />} aria-label="Navigate" />\n<FAB shape="round" size="l" icon={<Icon name="navigation" />} aria-label="Navigate" />\n<FAB shape="round" size="xl" icon={<Icon name="navigation" />} aria-label="Navigate" />`}>
        <FAB shape="round" size="m" icon={<Icon name="navigation" />} aria-label="Navigate" />
        <FAB shape="round" size="l" icon={<Icon name="navigation" />} aria-label="Navigate" />
        <FAB shape="round" size="xl" icon={<Icon name="navigation" />} aria-label="Navigate" />
      </Showcase>

      {/* ExtendedFAB Examples */}
      <Showcase title="Extended FAB Sizes" code={`<ExtendedFAB size="small" icon={<Icon name="add" />} label="Create" />\n<ExtendedFAB size="medium" icon={<Icon name="edit" />} label="Compose" />\n<ExtendedFAB size="large" icon={<Icon name="navigation" />} label="Navigate" />`}>
        <ExtendedFAB size="small" icon={<Icon name="add" />} label="Create" />
        <ExtendedFAB size="medium" icon={<Icon name="edit" />} label="Compose" />
        <ExtendedFAB size="large" icon={<Icon name="navigation" />} label="Navigate" />
      </Showcase>

      <Showcase title="Extended FAB Colors" code={`<ExtendedFAB color="primary" icon={<Icon name="add" />} label="Primary" />\n<ExtendedFAB color="secondary" icon={<Icon name="add" />} label="Secondary" />\n<ExtendedFAB color="tertiary" icon={<Icon name="add" />} label="Tertiary" />`}>
        <ExtendedFAB color="primary" icon={<Icon name="add" />} label="Primary" />
        <ExtendedFAB color="secondary" icon={<Icon name="add" />} label="Secondary" />
        <ExtendedFAB color="tertiary" icon={<Icon name="add" />} label="Tertiary" />
      </Showcase>

      <Showcase title="Extended FAB without Icon" code={`<ExtendedFAB size="medium" icon={null} label="No Icon" />`}>
        <ExtendedFAB size="medium" icon={null} label="No Icon" />
      </Showcase>

      {/* FABMenu — Composable API */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">FABMenu — Composable API</h2>
        <p className="text-[14px] leading-5 text-surface-variant-foreground">
          The <code>FABMenu</code> component provides a speed-dial overlay that
          opens from a FAB to display related actions. Use{" "}
          <code>FABMenu.Item</code> sub-components for each action.
        </p>

        <Showcase
          title="FABMenu — Composable Items"
          code={`<FABMenu triggerIcon={<Icon name="add" />} triggerLabel="Actions">\n  <FABMenu.Item icon={<Icon name="edit" />} label="Edit" onClick={() => {}} />\n  <FABMenu.Item icon={<Icon name="share" />} label="Share" onClick={() => {}} />\n  <FABMenu.Item icon={<Icon name="delete" />} label="Delete" onClick={() => {}} />\n</FABMenu>`}
        >
          <FABMenu triggerIcon={<Icon name="add" />} triggerLabel="Actions">
            <FABMenu.Item icon={<Icon name="edit" />} label="Edit" onClick={() => {}} />
            <FABMenu.Item icon={<Icon name="share" />} label="Share" onClick={() => {}} />
            <FABMenu.Item icon={<Icon name="delete" />} label="Delete" onClick={() => {}} />
          </FABMenu>
        </Showcase>

        <Showcase
          title="FABMenu — Secondary Color"
          code={`<FABMenu\n  triggerIcon={<Icon name="more_vert" />}\n  triggerLabel="More actions"\n  colorSet="secondary"\n>\n  <FABMenu.Item icon={<Icon name="bookmark" />} label="Save" onClick={() => {}} />\n  <FABMenu.Item icon={<Icon name="content_copy" />} label="Copy" onClick={() => {}} />\n</FABMenu>`}
        >
          <FABMenu
            triggerIcon={<Icon name="more_vert" />}
            triggerLabel="More actions"
            colorSet="secondary"
          >
            <FABMenu.Item icon={<Icon name="bookmark" />} label="Save" onClick={() => {}} />
            <FABMenu.Item icon={<Icon name="content_copy" />} label="Copy" onClick={() => {}} />
          </FABMenu>
        </Showcase>

        <Showcase
          title="FABMenu — Tertiary Color"
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

      {/* Props Tables */}
      <PropsTable
        componentName="FAB"
        props={[
          { name: "size", type: '"m" | "l" | "xl" | "extended"', default: '"l"', description: "FAB size: m(48dp/small), l(56dp/medium, default), xl(96dp/large), extended(56dp height)" },
          { name: "color", type: '"primary" | "secondary" | "tertiary"', default: '"primary"', description: "Color scheme" },
          { name: "shape", type: '"square" | "round"', default: '"square"', description: "Corner shape: corner-large (rounded-2xl) at rest, active:rounded-xl on press" },
          { name: "icon", type: "ReactNode", description: "Icon element", required: true },
          { name: "aria-label", type: "string", description: "Accessible label", required: true },
        ]}
      />

      <PropsTable
        componentName="ExtendedFAB"
        props={[
          { name: "size", type: '"small" | "medium" | "large"', default: '"small"', description: "Extended FAB size (56dp/80dp/96dp height)" },
          { name: "color", type: '"primary" | "secondary" | "tertiary"', default: '"primary"', description: "Color scheme" },
          { name: "icon", type: "ReactNode | null", description: "Optional leading icon" },
          { name: "label", type: "string", description: "Text label", required: true },
        ]}
      />

      <PropsTable
        componentName="FABMenu"
        props={[
          { name: "triggerIcon", type: "ReactNode", description: "Icon for the FAB trigger button", required: true },
          { name: "triggerLabel", type: "string", description: "Accessible label for the trigger button", required: true },
          { name: "colorSet", type: '"primary" | "secondary" | "tertiary"', default: '"primary"', description: "Color set for close button and items" },
          { name: "open", type: "boolean", description: "Controlled open state" },
          { name: "onOpenChange", type: "(open: boolean) => void", description: "Callback when open state changes" },
          { name: "children", type: "ReactNode", description: "FABMenu.Item elements (2–6 items)", required: true },
        ]}
      />

      <PropsTable
        componentName="FABMenu.Item"
        props={[
          { name: "icon", type: "ReactNode", description: "Icon element", required: true },
          { name: "label", type: "string", description: "Label text", required: true },
          { name: "onClick", type: "() => void", description: "Action callback", required: true },
          { name: "aria-label", type: "string", description: "Optional aria-label override" },
        ]}
      />

      {/* M3 Expressive Specs */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">M3 Expressive Specs</h2>
        <div className="rounded-xl border border-outline-variant p-4 space-y-2 text-sm text-surface-variant-foreground">
          <p><strong>Sizes:</strong> m (48dp) · l (56dp, default) · xl (96dp) · extended (56dp height)</p>
          <p><strong>Shape:</strong> corner-large (rounded-2xl) at rest → <code>active:rounded-xl</code> on press</p>
          <p><strong>Elevation:</strong> Level 3 at rest, Level 4 on hover</p>
          <p><strong>Color:</strong> Uses primary-container, secondary-container, or tertiary-container surfaces</p>
        </div>
      </section>

      {/* Accessibility */}
      <AccessibilityNotes
        componentName="FAB"
        notes={[
          { category: "aria", description: "FAB uses aria-label for accessible name since it contains only an icon" },
          { category: "keyboard", description: "FABs are focusable with Tab and activated with Enter/Space" },
          { category: "focus", description: "Focus ring visible on keyboard navigation with 2px primary ring" },
          { category: "aria", description: "FABMenu trigger uses aria-haspopup=\"menu\" and aria-expanded" },
          { category: "keyboard", description: "FABMenu supports Arrow Up/Down navigation and Escape to close" },
          { category: "screen-reader", description: "Menu items use role=\"menuitem\" with readable labels" },
        ]}
      />
    </div>
  );
}

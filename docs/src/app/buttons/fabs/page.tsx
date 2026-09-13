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
      <Showcase title="FAB Sizes" code={`<FAB size="fab" icon={<Icon name="add" />} aria-label="Add" />\n<FAB size="medium" icon={<Icon name="add" />} aria-label="Add" />\n<FAB size="large" icon={<Icon name="add" />} aria-label="Add" />`}>
        <FAB size="fab" icon={<Icon name="add" />} aria-label="Add" />
        <FAB size="medium" icon={<Icon name="add" />} aria-label="Add" />
        <FAB size="large" icon={<Icon name="add" />} aria-label="Add" />
      </Showcase>

      {/* Container Colors */}
      <Showcase title="FAB Container Colors (default)" code={`<FAB color="primary-container" icon={<Icon name="add" />} aria-label="Add" />\n<FAB color="secondary-container" icon={<Icon name="edit" />} aria-label="Edit" />\n<FAB color="tertiary-container" icon={<Icon name="palette" />} aria-label="Create" />`}>
        <FAB color="primary-container" icon={<Icon name="add" />} aria-label="Add" />
        <FAB color="secondary-container" icon={<Icon name="edit" />} aria-label="Edit" />
        <FAB color="tertiary-container" icon={<Icon name="palette" />} aria-label="Create" />
      </Showcase>

      <Showcase title="FAB Tone Colors" code={`<FAB color="primary" icon={<Icon name="edit" />} aria-label="Edit" />\n<FAB color="secondary" icon={<Icon name="edit" />} aria-label="Edit" />\n<FAB color="tertiary" icon={<Icon name="edit" />} aria-label="Edit" />`}>
        <FAB color="primary" icon={<Icon name="edit" />} aria-label="Edit" />
        <FAB color="secondary" icon={<Icon name="edit" />} aria-label="Edit" />
        <FAB color="tertiary" icon={<Icon name="edit" />} aria-label="Edit" />
      </Showcase>

      <Showcase title="FAB Round Shape" code={`<FAB shape="round" size="fab" icon={<Icon name="navigation" />} aria-label="Navigate" />\n<FAB shape="round" size="medium" icon={<Icon name="navigation" />} aria-label="Navigate" />\n<FAB shape="round" size="large" icon={<Icon name="navigation" />} aria-label="Navigate" />`}>
        <FAB shape="round" size="fab" icon={<Icon name="navigation" />} aria-label="Navigate" />
        <FAB shape="round" size="medium" icon={<Icon name="navigation" />} aria-label="Navigate" />
        <FAB shape="round" size="large" icon={<Icon name="navigation" />} aria-label="Navigate" />
      </Showcase>

      {/* Loading & Disabled */}
      <Showcase title="Loading State" code={`<FAB loading icon={<Icon name="add" />} aria-label="Add" />\n<ExtendedFAB loading icon={<Icon name="add" />} label="Creating..." />`}>
        <FAB loading icon={<Icon name="add" />} aria-label="Add" />
        <ExtendedFAB loading icon={<Icon name="add" />} label="Creating..." />
      </Showcase>

      <Showcase title="Disabled" code={`<FAB disabled icon={<Icon name="add" />} aria-label="Add" />\n<ExtendedFAB disabled icon={<Icon name="add" />} label="Create" />`}>
        <FAB disabled icon={<Icon name="add" />} aria-label="Add" />
        <ExtendedFAB disabled icon={<Icon name="add" />} label="Create" />
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
          { name: "size", type: '"fab" | "medium" | "large"', default: '"fab"', description: "FAB size: fab (56dp), medium (80dp), large (96dp)" },
          { name: "color", type: '"primary-container" | "secondary-container" | "tertiary-container" | "primary" | "secondary" | "tertiary" | "surface"', default: '"primary-container"', description: "Color scheme (container variants are tonal, non-container are filled)" },
          { name: "shape", type: '"rounded" | "round"', default: '"rounded"', description: "Corner shape: rounded (corner-large) or round (corner-full)" },
          { name: "icon", type: "ReactNode", description: "Icon element", required: true },
          { name: "loading", type: "boolean", default: "false", description: "Show spinner, disable interaction" },
          { name: "disabled", type: "boolean", default: "false", description: "Disable interaction" },
          { name: "asChild", type: "boolean", default: "false", description: "Render as child element via Radix Slot (e.g. a link)" },
          { name: "aria-label", type: "string", description: "Accessible label (required — icon-only element)" },
          { name: "className", type: "string", description: "Additional Tailwind classes" },
        ]}
      />

      <PropsTable
        componentName="ExtendedFAB"
        props={[
          { name: "size", type: '"small" | "medium" | "large"', default: '"small"', description: "Extended FAB size: small (56dp), medium (80dp), large (96dp)" },
          { name: "color", type: '"primary" | "secondary" | "tertiary" | "primary-fixed" | "secondary-fixed" | "tertiary-fixed"', default: '"primary"', description: "Color scheme" },
          { name: "icon", type: "ReactNode", description: "Leading icon element", required: true },
          { name: "label", type: "string", description: "Text label (provides accessible name)", required: true },
          { name: "loading", type: "boolean", default: "false", description: "Show spinner, disable interaction" },
          { name: "disabled", type: "boolean", default: "false", description: "Disable interaction" },
          { name: "asChild", type: "boolean", default: "false", description: "Render as child element via Radix Slot" },
          { name: "className", type: "string", description: "Additional Tailwind classes" },
        ]}
      />

      <PropsTable
        componentName="FABMenu"
        props={[
          { name: "triggerIcon", type: "ReactNode", description: "Icon for the FAB trigger button", required: true },
          { name: "triggerLabel", type: "string", description: "Accessible label for the trigger button", required: true },
          { name: "colorSet", type: '"primary" | "secondary" | "tertiary"', default: '"primary"', description: "Color set for close button and items" },
          { name: "open", type: "boolean", description: "Controlled open state" },
          { name: "defaultOpen", type: "boolean", default: "false", description: "Uncontrolled default open state" },
          { name: "onOpenChange", type: "(open: boolean) => void", description: "Callback when open state changes" },
          { name: "closeLabel", type: "string", default: '"Close menu"', description: "Close button accessible label" },
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
          <p><strong>FAB sizes:</strong> fab (56dp, default) · medium (80dp) · large (96dp)</p>
          <p><strong>ExtendedFAB sizes:</strong> small (56dp, default) · medium (80dp) · large (96dp)</p>
          <p><strong>Shape:</strong> rounded (corner-large) or round (corner-full) — shape morph on press</p>
          <p><strong>Elevation:</strong> Level 3 at rest, Level 4 on hover</p>
          <p><strong>Colors:</strong> Container variants (primary-container, secondary-container, tertiary-container) and tone variants (primary, secondary, tertiary)</p>
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

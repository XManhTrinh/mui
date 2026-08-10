"use client";

import * as React from "react";
import { FAB, ExtendedFAB, FABMenu, Icon } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function FABsPage() {
  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Floating Action Buttons
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          FABs represent the most important action on a screen. They come in
          standard and extended variants with multiple sizes and colors.
        </p>
      </div>

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

      {/* Props Table */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">FABMenu — Composable API</h2>
        <p className="text-[14px] leading-5 text-surface-variant-foreground">
          The <code>FABMenu</code> component provides a speed-dial overlay that
          opens from a FAB to display related actions. The composable API uses{" "}
          <code>FABMenu.Item</code> sub-components instead of a data-driven{" "}
          <code>items</code> array, giving you more control over each action item.
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
      </section>

      {/* Props Table */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">FAB Props</h2>
        <div className="overflow-x-auto rounded-xl border border-outline-variant">
          <table className="w-full text-sm">
            <thead className="bg-surface-container">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Prop</th>
                <th className="text-left px-4 py-2 font-medium">Type</th>
                <th className="text-left px-4 py-2 font-medium">Default</th>
                <th className="text-left px-4 py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              <tr>
                <td className="px-4 py-2 font-mono text-xs">size</td>
                <td className="px-4 py-2 font-mono text-xs">{`"m" | "l" | "xl"`}</td>
                <td className="px-4 py-2 font-mono text-xs">{`"l"`}</td>
                <td className="px-4 py-2">FAB size</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">color</td>
                <td className="px-4 py-2 font-mono text-xs">{`"primary" | "secondary" | "tertiary"`}</td>
                <td className="px-4 py-2 font-mono text-xs">{`"primary"`}</td>
                <td className="px-4 py-2">Color scheme</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">shape</td>
                <td className="px-4 py-2 font-mono text-xs">{`"square" | "round"`}</td>
                <td className="px-4 py-2 font-mono text-xs">{`"square"`}</td>
                <td className="px-4 py-2">Border radius shape</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">icon</td>
                <td className="px-4 py-2 font-mono text-xs">ReactNode</td>
                <td className="px-4 py-2 font-mono text-xs">—</td>
                <td className="px-4 py-2">Icon element</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-[22px] leading-7 font-normal">ExtendedFAB Props</h2>
        <div className="overflow-x-auto rounded-xl border border-outline-variant">
          <table className="w-full text-sm">
            <thead className="bg-surface-container">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Prop</th>
                <th className="text-left px-4 py-2 font-medium">Type</th>
                <th className="text-left px-4 py-2 font-medium">Default</th>
                <th className="text-left px-4 py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              <tr>
                <td className="px-4 py-2 font-mono text-xs">size</td>
                <td className="px-4 py-2 font-mono text-xs">{`"small" | "medium" | "large"`}</td>
                <td className="px-4 py-2 font-mono text-xs">{`"medium"`}</td>
                <td className="px-4 py-2">Extended FAB size</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">color</td>
                <td className="px-4 py-2 font-mono text-xs">{`"primary" | "secondary" | "tertiary"`}</td>
                <td className="px-4 py-2 font-mono text-xs">{`"primary"`}</td>
                <td className="px-4 py-2">Color scheme</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">icon</td>
                <td className="px-4 py-2 font-mono text-xs">ReactNode</td>
                <td className="px-4 py-2 font-mono text-xs">—</td>
                <td className="px-4 py-2">Optional leading icon</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">label</td>
                <td className="px-4 py-2 font-mono text-xs">string</td>
                <td className="px-4 py-2 font-mono text-xs">—</td>
                <td className="px-4 py-2">Text label</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

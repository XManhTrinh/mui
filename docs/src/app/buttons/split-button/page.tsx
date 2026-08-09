"use client";

import * as React from "react";
import { SplitButton, Icon } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function SplitButtonPage() {
  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Split Button
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Split buttons let users take a primary action while also providing
          access to related secondary actions through a dropdown menu.
        </p>
      </div>

      <Showcase title="Basic Split Button" code={`<SplitButton\n  label="Save"\n  icon={<Icon name="save" />}\n  menuContent={\n    <>\n      <MenuItem>Save as Draft</MenuItem>\n      <MenuItem>Save and Publish</MenuItem>\n    </>\n  }\n/>`}>
        <SplitButton
          label="Save"
          icon={<Icon name="save" />}
          menuContent={
            <>
              <div className="px-3 py-2 text-sm hover:bg-surface-container-high rounded cursor-pointer">Save as Draft</div>
              <div className="px-3 py-2 text-sm hover:bg-surface-container-high rounded cursor-pointer">Save and Publish</div>
              <div className="px-3 py-2 text-sm hover:bg-surface-container-high rounded cursor-pointer">Save as Template</div>
            </>
          }
        />
      </Showcase>

      <Showcase title="Split Button Variants" code={`<SplitButton\n  label="Send"\n  icon={<Icon name="send" />}\n  menuContent={<>...</>}\n/>\n<SplitButton\n  label="Download"\n  icon={<Icon name="download" />}\n  menuContent={<>...</>}\n/>`}>
        <SplitButton
          label="Send"
          icon={<Icon name="send" />}
          menuContent={
            <>
              <div className="px-3 py-2 text-sm hover:bg-surface-container-high rounded cursor-pointer">Send Now</div>
              <div className="px-3 py-2 text-sm hover:bg-surface-container-high rounded cursor-pointer">Schedule Send</div>
              <div className="px-3 py-2 text-sm hover:bg-surface-container-high rounded cursor-pointer">Save as Draft</div>
            </>
          }
        />
        <SplitButton
          label="Download"
          icon={<Icon name="download" />}
          menuContent={
            <>
              <div className="px-3 py-2 text-sm hover:bg-surface-container-high rounded cursor-pointer">Download PDF</div>
              <div className="px-3 py-2 text-sm hover:bg-surface-container-high rounded cursor-pointer">Download PNG</div>
              <div className="px-3 py-2 text-sm hover:bg-surface-container-high rounded cursor-pointer">Download SVG</div>
            </>
          }
        />
      </Showcase>

      <Showcase title="Without Icon" code={`<SplitButton\n  label="Actions"\n  menuContent={<>...</>}\n/>`}>
        <SplitButton
          label="Actions"
          menuContent={
            <>
              <div className="px-3 py-2 text-sm hover:bg-surface-container-high rounded cursor-pointer">Edit</div>
              <div className="px-3 py-2 text-sm hover:bg-surface-container-high rounded cursor-pointer">Duplicate</div>
              <div className="px-3 py-2 text-sm hover:bg-surface-container-high rounded cursor-pointer">Archive</div>
            </>
          }
        />
      </Showcase>

      {/* Props Table */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Props</h2>
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
                <td className="px-4 py-2 font-mono text-xs">label</td>
                <td className="px-4 py-2 font-mono text-xs">string</td>
                <td className="px-4 py-2 font-mono text-xs">—</td>
                <td className="px-4 py-2">Primary button label</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">icon</td>
                <td className="px-4 py-2 font-mono text-xs">ReactNode</td>
                <td className="px-4 py-2 font-mono text-xs">—</td>
                <td className="px-4 py-2">Optional leading icon</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">menuContent</td>
                <td className="px-4 py-2 font-mono text-xs">ReactNode</td>
                <td className="px-4 py-2 font-mono text-xs">—</td>
                <td className="px-4 py-2">Dropdown menu items</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">onClick</td>
                <td className="px-4 py-2 font-mono text-xs">{`() => void`}</td>
                <td className="px-4 py-2 font-mono text-xs">—</td>
                <td className="px-4 py-2">Primary button click handler</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

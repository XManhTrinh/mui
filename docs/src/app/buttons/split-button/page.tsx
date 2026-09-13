"use client";

import * as React from "react";
import { SplitButton, Icon } from "@mui/index";
import { Showcase } from "@/components/showcase";
import { PropsTable, type PropDef } from "@/components/props-table";

const menuItems = (
  <>
    <div className="px-3 py-2 text-sm hover:bg-surface-container-high rounded cursor-pointer">Save as Draft</div>
    <div className="px-3 py-2 text-sm hover:bg-surface-container-high rounded cursor-pointer">Save and Publish</div>
    <div className="px-3 py-2 text-sm hover:bg-surface-container-high rounded cursor-pointer">Save as Template</div>
  </>
);

const splitButtonProps: PropDef[] = [
  {
    name: "label",
    type: "ReactNode",
    description: "Leading button label (legacy prop-based API)",
  },
  {
    name: "icon",
    type: "ReactNode",
    description: "Leading button icon (legacy prop-based API)",
  },
  {
    name: "menuContent",
    type: "ReactNode",
    required: true,
    description: "Dropdown menu items rendered via Radix DropdownMenu",
  },
  {
    name: "onLeadingClick",
    type: "(e: React.MouseEvent) => void",
    description: "Click handler for the leading segment",
  },
  {
    name: "variant",
    type: '"elevated" | "filled" | "tonal" | "outlined"',
    default: '"tonal"',
    description: "Visual variant (colors and elevation)",
  },
  {
    name: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    default: '"m"',
    description: "Split button size: xs (32dp), s (36dp), m (40dp), l (48dp), xl (56dp)",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disables both leading and trailing segments",
  },
  {
    name: "leadingDisabled",
    type: "boolean",
    default: "false",
    description: "Disables only the leading segment",
  },
  {
    name: "trailingDisabled",
    type: "boolean",
    default: "false",
    description: "Disables only the trailing (menu trigger) segment",
  },
  {
    name: "children",
    type: "ReactNode",
    description: "Use SplitButton.Leading sub-component for composable API",
  },
];

export default function SplitButtonPage() {
  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Split Button
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Split buttons let users take a primary action while also providing
          access to related secondary actions through a dropdown menu. The leading
          and trailing segments have independent state layers and a 2dp gap
          per M3 Expressive spec.
        </p>
      </div>

      <Showcase title="Basic Split Button" code={`<SplitButton\n  label="Save"\n  icon={<Icon name="save" />}\n  onLeadingClick={() => console.log("Save clicked")}\n  menuContent={<>...</>}\n/>`}>
        <SplitButton
          label="Save"
          icon={<Icon name="save" />}
          menuContent={menuItems}
        />
      </Showcase>

      {/* Variant Showcases */}
      <Showcase
        title="Elevated"
        code={`<SplitButton variant="elevated" label="Save" icon={<Icon name="save" />} menuContent={<>...</>} />`}
      >
        <SplitButton variant="elevated" label="Save" icon={<Icon name="save" />} menuContent={menuItems} />
      </Showcase>

      <Showcase
        title="Filled"
        code={`<SplitButton variant="filled" label="Send" icon={<Icon name="send" />} menuContent={<>...</>} />`}
      >
        <SplitButton variant="filled" label="Send" icon={<Icon name="send" />} menuContent={menuItems} />
      </Showcase>

      <Showcase
        title="Tonal (default)"
        code={`<SplitButton variant="tonal" label="Download" icon={<Icon name="download" />} menuContent={<>...</>} />`}
      >
        <SplitButton variant="tonal" label="Download" icon={<Icon name="download" />} menuContent={menuItems} />
      </Showcase>

      <Showcase
        title="Outlined"
        code={`<SplitButton variant="outlined" label="Share" icon={<Icon name="share" />} menuContent={<>...</>} />`}
      >
        <SplitButton variant="outlined" label="Share" icon={<Icon name="share" />} menuContent={menuItems} />
      </Showcase>

      {/* Sizes */}
      <Showcase
        title="Sizes"
        code={`<SplitButton size="xs" label="XS" menuContent={<>...</>} />\n<SplitButton size="s" label="S" menuContent={<>...</>} />\n<SplitButton size="m" label="M" menuContent={<>...</>} />\n<SplitButton size="l" label="L" menuContent={<>...</>} />`}
      >
        <SplitButton size="xs" label="XS" icon={<Icon name="save" />} menuContent={menuItems} />
        <SplitButton size="s" label="S" icon={<Icon name="save" />} menuContent={menuItems} />
        <SplitButton size="m" label="M (default)" icon={<Icon name="save" />} menuContent={menuItems} />
        <SplitButton size="l" label="L" icon={<Icon name="save" />} menuContent={menuItems} />
      </Showcase>

      <Showcase title="Without Icon" code={`<SplitButton label="Actions" menuContent={<>...</>} />`}>
        <SplitButton
          label="Actions"
          menuContent={menuItems}
        />
      </Showcase>

      {/* Disabled states */}
      <Showcase
        title="Disabled States"
        code={`{/* Both segments disabled */}\n<SplitButton disabled label="Disabled" menuContent={<>...</>} />\n{/* Leading only disabled */}\n<SplitButton leadingDisabled label="Leading Disabled" menuContent={<>...</>} />\n{/* Trailing only disabled */}\n<SplitButton trailingDisabled label="Trailing Disabled" menuContent={<>...</>} />`}
      >
        <SplitButton disabled label="Disabled" icon={<Icon name="save" />} menuContent={menuItems} />
        <SplitButton leadingDisabled label="Leading Disabled" icon={<Icon name="save" />} menuContent={menuItems} />
        <SplitButton trailingDisabled label="Trailing Disabled" icon={<Icon name="save" />} menuContent={menuItems} />
      </Showcase>

      {/* Composable API */}
      <Showcase
        title="Composable API (SplitButton.Leading)"
        code={`<SplitButton menuContent={<>...</>}>\n  <SplitButton.Leading\n    onClick={() => console.log("Custom click")}\n    aria-label="Custom action"\n  >\n    <Icon name="star" />\n    <span>Custom Content</span>\n  </SplitButton.Leading>\n</SplitButton>`}
      >
        <SplitButton menuContent={menuItems}>
          <SplitButton.Leading
            onClick={() => {}}
            aria-label="Custom action"
          >
            <Icon name="star" />
            <span>Custom Content</span>
          </SplitButton.Leading>
        </SplitButton>
      </Showcase>

      {/* Props Table */}
      <PropsTable componentName="SplitButton" props={splitButtonProps} />
    </div>
  );
}

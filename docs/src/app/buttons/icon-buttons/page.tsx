"use client";

import * as React from "react";
import { IconButton, Icon, Chip, Switch } from "@mui/index";
import { Showcase, Playground } from "@/components/showcase";
import { PropsTable, type PropDef } from "@/components/props-table";

const iconButtonProps: PropDef[] = [
  {
    name: "icon",
    type: "string",
    description: "Material Symbols icon name (shorthand). Auto-sizes proportionally.",
  },
  {
    name: "iconSize",
    type: "number",
    default: "auto",
    description: "Override icon size (px). Defaults to proportional (18→20→24→28→32).",
  },
  {
    name: "iconFilled",
    type: "boolean",
    default: "false",
    description: "Fill the icon. In toggle mode, auto-tracks pressed state.",
  },
  {
    name: "variant",
    type: '"standard" | "filled" | "filled-tonal" | "outlined"',
    default: '"standard"',
    description: "Visual variant (colors and container fill)",
  },
  {
    name: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    default: '"s"',
    description: "Container size: xs(32dp), s(40dp, 24dp icon), m(48dp), l(56dp), xl(64dp)",
  },
  {
    name: "shape",
    type: '"round" | "square"',
    default: '"round"',
    description: "Corner shape with morph on press",
  },
  {
    name: "toggle",
    type: "boolean",
    default: "false",
    description: "Enable toggle behavior with shape inversion on pressed state",
  },
  {
    name: "pressed",
    type: "boolean",
    description: "Controlled pressed state (toggle mode)",
  },
  {
    name: "onPressedChange",
    type: "(pressed: boolean) => void",
    description: "Callback when toggle state changes",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disables the button",
  },
  {
    name: "children",
    type: "ReactNode",
    description: "Custom icon content (takes priority over `icon` prop)",
  },
];

export default function IconButtonsPage() {
  const [togglePressed, setTogglePressed] = React.useState(false);

  // Playground state
  const [pgVariant, setPgVariant] = React.useState<"standard" | "filled" | "filled-tonal" | "outlined">("standard");
  const [pgSize, setPgSize] = React.useState<"xs" | "s" | "m" | "l" | "xl">("m");
  const [pgShape, setPgShape] = React.useState<"round" | "square">("round");
  const [pgToggle, setPgToggle] = React.useState(false);

  const pgCode = pgToggle
    ? `<IconButton icon="favorite" variant="${pgVariant}" size="${pgSize}" shape="${pgShape}" toggle pressed aria-label="Favorite" />`
    : `<IconButton icon="favorite" variant="${pgVariant}" size="${pgSize}" shape="${pgShape}" aria-label="Favorite" />`;

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Icon Buttons
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Icon buttons help people take supplementary actions with a single tap.
          They come in four variants with different emphasis levels.
          Follows M3 Expressive specs with default size <code>s</code> (40dp container, 24dp icon).
          Toggle support includes shape inversion on pressed state.
        </p>
      </div>

      {/* Interactive Playground */}
      <Playground
        title="Playground"
        code={pgCode}
        controls={
          <>
            <div>
              <span className="text-[12px] font-medium text-surface-variant-foreground block mb-1.5">Variant</span>
              <div className="flex flex-wrap gap-1">
                {(["standard", "filled", "filled-tonal", "outlined"] as const).map((v) => (
                  <Chip key={v} variant="filter" selected={pgVariant === v} onClick={() => setPgVariant(v)}>
                    {v}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[12px] font-medium text-surface-variant-foreground block mb-1.5">Size</span>
              <div className="flex gap-1">
                {(["xs", "s", "m", "l", "xl"] as const).map((s) => (
                  <Chip key={s} variant="filter" selected={pgSize === s} onClick={() => setPgSize(s)}>
                    {s}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[12px] font-medium text-surface-variant-foreground block mb-1.5">Shape</span>
              <div className="flex gap-1">
                {(["round", "square"] as const).map((sh) => (
                  <Chip key={sh} variant="filter" selected={pgShape === sh} onClick={() => setPgShape(sh)}>
                    {sh}
                  </Chip>
                ))}
              </div>
            </div>
            <div className="space-y-3 pt-1">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[13px] text-surface-foreground">Toggle</span>
                <Switch checked={pgToggle} onCheckedChange={setPgToggle} />
              </label>
            </div>
          </>
        }
      >
        <IconButton
          icon="favorite"
          variant={pgVariant}
          size={pgSize}
          shape={pgShape}
          toggle={pgToggle}
          pressed={pgToggle ? true : undefined}
          aria-label="Favorite"
        />
      </Playground>

      {/* Shorthand usage — sizes with auto-proportional icons */}
      <Showcase
        title="Sizes (shorthand)"
        code={`<IconButton icon="settings" size="xs" aria-label="Settings" />\n<IconButton icon="search" size="s" aria-label="Search" />\n<IconButton icon="close" size="m" aria-label="Close" />\n<IconButton icon="menu" size="l" aria-label="Menu" />\n<IconButton icon="home" size="xl" aria-label="Home" />`}
      >
        <IconButton icon="settings" variant="standard" size="xs" aria-label="Settings" />
        <IconButton icon="search" variant="standard" size="s" aria-label="Search" />
        <IconButton icon="close" variant="standard" size="m" aria-label="Close" />
        <IconButton icon="menu" variant="standard" size="l" aria-label="Menu" />
        <IconButton icon="home" variant="standard" size="xl" aria-label="Home" />
      </Showcase>

      <Showcase title="Filled" code={`<IconButton icon="add" variant="filled" aria-label="Add" />`}>
        <IconButton icon="add" variant="filled" aria-label="Add" />
        <IconButton icon="edit" variant="filled" aria-label="Edit" />
        <IconButton icon="delete" variant="filled" aria-label="Delete" />
      </Showcase>

      <Showcase title="Filled Tonal" code={`<IconButton icon="bookmark" variant="filled-tonal" aria-label="Bookmark" />`}>
        <IconButton icon="bookmark" variant="filled-tonal" aria-label="Bookmark" />
        <IconButton icon="share" variant="filled-tonal" aria-label="Share" />
        <IconButton icon="download" variant="filled-tonal" aria-label="Download" />
      </Showcase>

      <Showcase title="Outlined" code={`<IconButton icon="favorite" variant="outlined" aria-label="Favorite" />`}>
        <IconButton icon="favorite" variant="outlined" aria-label="Favorite" />
        <IconButton icon="print" variant="outlined" aria-label="Print" />
        <IconButton icon="more_vert" variant="outlined" aria-label="More" />
      </Showcase>

      <Showcase title="Toggle (auto-fills icon)" code={`<IconButton\n  icon="favorite"\n  toggle\n  pressed={pressed}\n  onPressedChange={setPressed}\n  aria-label="Favorite"\n/>`}>
        <IconButton
          icon="favorite"
          toggle
          pressed={togglePressed}
          onPressedChange={setTogglePressed}
          aria-label="Favorite"
        />
        <span className="text-sm text-surface-variant-foreground">
          {togglePressed ? "Pressed" : "Unpressed"} — click to toggle
        </span>
      </Showcase>

      <Showcase title="Disabled" code={`<IconButton icon="settings" disabled aria-label="Settings" />`}>
        <IconButton icon="settings" variant="standard" disabled aria-label="Settings" />
        <IconButton icon="add" variant="filled" disabled aria-label="Add" />
        <IconButton icon="bookmark" variant="filled-tonal" disabled aria-label="Bookmark" />
        <IconButton icon="favorite" variant="outlined" disabled aria-label="Favorite" />
      </Showcase>

      {/* Composable usage — backward compatible */}
      <Showcase title="Composable (children)" code={`<IconButton size="m" aria-label="Settings">\n  <Icon name="settings" size={24} weight={300} />\n</IconButton>`}>
        <IconButton size="m" aria-label="Settings">
          <Icon name="settings" size={24} weight={300} />
        </IconButton>
        <IconButton variant="filled" size="l" aria-label="Star">
          <Icon name="star" size={28} filled />
        </IconButton>
      </Showcase>

      {/* Props Table */}
      <PropsTable componentName="IconButton" props={iconButtonProps} />

      {/* M3 Expressive Specs */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">M3 Expressive Specs</h2>
        <div className="rounded-xl border border-outline-variant p-4 space-y-2 text-sm text-surface-variant-foreground">
          <p><strong>Default size:</strong> s (40dp container, 24dp icon)</p>
          <p><strong>Variants:</strong> standard, filled, filled-tonal, outlined</p>
          <p><strong>Toggle:</strong> Shape inversion on pressed state (round↔square)</p>
          <p><strong>Shape morph:</strong> <code>active:rounded-xl</code> on press for non-round shapes</p>
        </div>
      </section>
    </div>
  );
}

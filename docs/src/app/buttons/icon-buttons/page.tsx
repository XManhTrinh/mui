"use client";

import * as React from "react";
import { IconButton, Icon, Chip, Switch } from "@mui/index";
import { Showcase, Playground } from "@/components/showcase";

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
                <td className="px-4 py-2 font-mono text-xs">icon</td>
                <td className="px-4 py-2 font-mono text-xs">string</td>
                <td className="px-4 py-2 font-mono text-xs">—</td>
                <td className="px-4 py-2">Material Symbols icon name (shorthand). Auto-sizes proportionally.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">iconSize</td>
                <td className="px-4 py-2 font-mono text-xs">number</td>
                <td className="px-4 py-2 font-mono text-xs">auto</td>
                <td className="px-4 py-2">Override icon size (px). Defaults to proportional (18→20→24→28→32).</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">iconFilled</td>
                <td className="px-4 py-2 font-mono text-xs">boolean</td>
                <td className="px-4 py-2 font-mono text-xs">false</td>
                <td className="px-4 py-2">Fill the icon. In toggle mode, auto-tracks pressed state.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">variant</td>
                <td className="px-4 py-2 font-mono text-xs">{`"standard" | "filled" | "filled-tonal" | "outlined"`}</td>
                <td className="px-4 py-2 font-mono text-xs">{`"standard"`}</td>
                <td className="px-4 py-2">Visual variant (colors and container fill)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">size</td>
                <td className="px-4 py-2 font-mono text-xs">{`"xs" | "s" | "m" | "l" | "xl"`}</td>
                <td className="px-4 py-2 font-mono text-xs">{`"s"`}</td>
                <td className="px-4 py-2">Container size (32→40→48→56→64dp)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">shape</td>
                <td className="px-4 py-2 font-mono text-xs">{`"round" | "square"`}</td>
                <td className="px-4 py-2 font-mono text-xs">{`"round"`}</td>
                <td className="px-4 py-2">Corner shape with morph on press</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">toggle</td>
                <td className="px-4 py-2 font-mono text-xs">boolean</td>
                <td className="px-4 py-2 font-mono text-xs">false</td>
                <td className="px-4 py-2">Enable toggle behavior</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">pressed</td>
                <td className="px-4 py-2 font-mono text-xs">boolean</td>
                <td className="px-4 py-2 font-mono text-xs">—</td>
                <td className="px-4 py-2">Controlled pressed state (toggle mode)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">onPressedChange</td>
                <td className="px-4 py-2 font-mono text-xs">{`(pressed: boolean) => void`}</td>
                <td className="px-4 py-2 font-mono text-xs">—</td>
                <td className="px-4 py-2">Callback when toggle state changes</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">disabled</td>
                <td className="px-4 py-2 font-mono text-xs">boolean</td>
                <td className="px-4 py-2 font-mono text-xs">false</td>
                <td className="px-4 py-2">Disables the button</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">children</td>
                <td className="px-4 py-2 font-mono text-xs">ReactNode</td>
                <td className="px-4 py-2 font-mono text-xs">—</td>
                <td className="px-4 py-2">Custom icon content (takes priority over `icon` prop)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

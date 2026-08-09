"use client";

import * as React from "react";
import { IconButton, Icon } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function IconButtonsPage() {
  const [togglePressed, setTogglePressed] = React.useState(false);

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-surface-foreground mb-1">
          Icon Buttons
        </h1>
        <p className="text-surface-variant-foreground">
          Icon buttons help people take supplementary actions with a single tap.
          They come in four variants with different emphasis levels.
        </p>
      </div>

      <Showcase title="Standard">
        <IconButton variant="standard" size="xs" aria-label="Settings">
          <Icon name="settings" />
        </IconButton>
        <IconButton variant="standard" size="s" aria-label="Search">
          <Icon name="search" />
        </IconButton>
        <IconButton variant="standard" size="m" aria-label="Close">
          <Icon name="close" />
        </IconButton>
        <IconButton variant="standard" size="l" aria-label="Menu">
          <Icon name="menu" />
        </IconButton>
        <IconButton variant="standard" size="xl" aria-label="Home">
          <Icon name="home" />
        </IconButton>
      </Showcase>

      <Showcase title="Filled">
        <IconButton variant="filled" aria-label="Add">
          <Icon name="add" />
        </IconButton>
        <IconButton variant="filled" aria-label="Edit">
          <Icon name="edit" />
        </IconButton>
        <IconButton variant="filled" aria-label="Delete">
          <Icon name="delete" />
        </IconButton>
      </Showcase>

      <Showcase title="Filled Tonal">
        <IconButton variant="filled-tonal" aria-label="Bookmark">
          <Icon name="bookmark" />
        </IconButton>
        <IconButton variant="filled-tonal" aria-label="Share">
          <Icon name="share" />
        </IconButton>
        <IconButton variant="filled-tonal" aria-label="Download">
          <Icon name="download" />
        </IconButton>
      </Showcase>

      <Showcase title="Outlined">
        <IconButton variant="outlined" aria-label="Favorite">
          <Icon name="favorite" />
        </IconButton>
        <IconButton variant="outlined" aria-label="Print">
          <Icon name="print" />
        </IconButton>
        <IconButton variant="outlined" aria-label="More">
          <Icon name="more_vert" />
        </IconButton>
      </Showcase>

      <Showcase title="Toggle Icon Button">
        <IconButton
          variant="standard"
          toggle
          pressed={togglePressed}
          onPressedChange={setTogglePressed}
          aria-label="Favorite"
        >
          <Icon name="favorite" filled={togglePressed} />
        </IconButton>
        <span className="text-sm text-surface-variant-foreground">
          {togglePressed ? "Pressed" : "Unpressed"} — click to toggle
        </span>
      </Showcase>

      <Showcase title="Disabled States">
        <IconButton variant="standard" disabled aria-label="Settings">
          <Icon name="settings" />
        </IconButton>
        <IconButton variant="filled" disabled aria-label="Add">
          <Icon name="add" />
        </IconButton>
        <IconButton variant="filled-tonal" disabled aria-label="Bookmark">
          <Icon name="bookmark" />
        </IconButton>
        <IconButton variant="outlined" disabled aria-label="Favorite">
          <Icon name="favorite" />
        </IconButton>
      </Showcase>

      {/* Props Table */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Props</h2>
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
                <td className="px-4 py-2 font-mono text-xs">variant</td>
                <td className="px-4 py-2 font-mono text-xs">{`"standard" | "filled" | "filled-tonal" | "outlined"`}</td>
                <td className="px-4 py-2 font-mono text-xs">{`"standard"`}</td>
                <td className="px-4 py-2">Visual variant</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">size</td>
                <td className="px-4 py-2 font-mono text-xs">{`"xs" | "s" | "m" | "l" | "xl"`}</td>
                <td className="px-4 py-2 font-mono text-xs">{`"m"`}</td>
                <td className="px-4 py-2">Button size</td>
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
                <td className="px-4 py-2 font-mono text-xs">false</td>
                <td className="px-4 py-2">Controlled pressed state (toggle mode)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">onPressedChange</td>
                <td className="px-4 py-2 font-mono text-xs">{`(pressed: boolean) => void`}</td>
                <td className="px-4 py-2 font-mono text-xs">—</td>
                <td className="px-4 py-2">Callback when pressed state changes</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">disabled</td>
                <td className="px-4 py-2 font-mono text-xs">boolean</td>
                <td className="px-4 py-2 font-mono text-xs">false</td>
                <td className="px-4 py-2">Disables the button</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

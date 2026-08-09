"use client";

import * as React from "react";
import { Tooltip, IconButton, Icon, Button } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function TooltipPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Tooltip
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Tooltips display informative text when users hover over, focus on, or
          tap an element. They come in plain and rich variants.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Plain Tooltip</h2>
        <Showcase title="Plain" code={`<Tooltip content="Add item" variant="plain">\n  <IconButton variant="filled" aria-label="Add">\n    <Icon name="add" />\n  </IconButton>\n</Tooltip>`}>
          <Tooltip content="Add item" variant="plain">
            <IconButton variant="filled" aria-label="Add">
              <Icon name="add" />
            </IconButton>
          </Tooltip>
          <Tooltip content="Delete" variant="plain">
            <IconButton variant="standard" aria-label="Delete">
              <Icon name="delete" />
            </IconButton>
          </Tooltip>
          <Tooltip content="Save changes" variant="plain">
            <IconButton variant="outlined" aria-label="Save">
              <Icon name="save" />
            </IconButton>
          </Tooltip>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Rich Tooltip</h2>
        <Showcase title="Rich" code={`<Tooltip\n  variant="rich"\n  subhead="Rich tooltip"\n  content="Rich tooltips bring attention to a particular element..."\n>\n  <Button variant="outlined">Hover for details</Button>\n</Tooltip>`}>
          <Tooltip
            variant="rich"
            subhead="Rich tooltip"
            content="Rich tooltips bring attention to a particular element of a feature that otherwise might go unnoticed."
          >
            <Button variant="outlined">Hover for details</Button>
          </Tooltip>
          <Tooltip
            variant="rich"
            subhead="Keyboard shortcut"
            content="Press Ctrl+S to save your work. Changes are saved automatically every 5 minutes."
          >
            <Button variant="text">Shortcut info</Button>
          </Tooltip>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Placement</h2>
        <Showcase title="Tooltip Positions" code={`<Tooltip content="Top" variant="plain" side="top">\n  <Button variant="outlined">Top</Button>\n</Tooltip>`}>
          <Tooltip content="Top" variant="plain" side="top">
            <Button variant="outlined">Top</Button>
          </Tooltip>
          <Tooltip content="Bottom" variant="plain" side="bottom">
            <Button variant="outlined">Bottom</Button>
          </Tooltip>
          <Tooltip content="Left" variant="plain" side="left">
            <Button variant="outlined">Left</Button>
          </Tooltip>
          <Tooltip content="Right" variant="plain" side="right">
            <Button variant="outlined">Right</Button>
          </Tooltip>
        </Showcase>
      </section>
    </div>
  );
}

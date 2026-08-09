"use client";

import * as React from "react";
import { Toolbar, ToolbarLeading, ToolbarHeadline, ToolbarActions, IconButton, Icon } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function ToolbarPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Toolbar
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Toolbars provide a space for actions and information related to the
          current context. They can be docked or floating, with standard or
          vibrant appearance.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Docked</h2>
        <Showcase title="Docked Standard" className="flex-col items-stretch">
          <Toolbar variant="docked">
            <ToolbarLeading>
              <IconButton variant="standard" aria-label="Menu">
                <Icon name="menu" />
              </IconButton>
            </ToolbarLeading>
            <ToolbarHeadline>Document</ToolbarHeadline>
            <ToolbarActions>
              <IconButton variant="standard" aria-label="Search">
                <Icon name="search" />
              </IconButton>
              <IconButton variant="standard" aria-label="More">
                <Icon name="more_vert" />
              </IconButton>
            </ToolbarActions>
          </Toolbar>
        </Showcase>
        <Showcase title="Docked Vibrant" className="flex-col items-stretch">
          <Toolbar variant="docked" color="vibrant">
            <ToolbarLeading>
              <IconButton variant="standard" aria-label="Back">
                <Icon name="arrow_back" />
              </IconButton>
            </ToolbarLeading>
            <ToolbarHeadline>Settings</ToolbarHeadline>
            <ToolbarActions>
              <IconButton variant="standard" aria-label="Save">
                <Icon name="save" />
              </IconButton>
            </ToolbarActions>
          </Toolbar>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Floating</h2>
        <Showcase title="Floating Standard" className="flex-col items-stretch">
          <Toolbar variant="floating">
            <ToolbarLeading>
              <IconButton variant="standard" aria-label="Close">
                <Icon name="close" />
              </IconButton>
            </ToolbarLeading>
            <ToolbarHeadline>Editing</ToolbarHeadline>
            <ToolbarActions>
              <IconButton variant="standard" aria-label="Undo">
                <Icon name="undo" />
              </IconButton>
              <IconButton variant="standard" aria-label="Redo">
                <Icon name="redo" />
              </IconButton>
              <IconButton variant="standard" aria-label="Done">
                <Icon name="check" />
              </IconButton>
            </ToolbarActions>
          </Toolbar>
        </Showcase>
        <Showcase title="Floating Vibrant" className="flex-col items-stretch">
          <Toolbar variant="floating" color="vibrant">
            <ToolbarLeading>
              <IconButton variant="standard" aria-label="Close">
                <Icon name="close" />
              </IconButton>
            </ToolbarLeading>
            <ToolbarHeadline>Selection: 3 items</ToolbarHeadline>
            <ToolbarActions>
              <IconButton variant="standard" aria-label="Share">
                <Icon name="share" />
              </IconButton>
              <IconButton variant="standard" aria-label="Delete">
                <Icon name="delete" />
              </IconButton>
            </ToolbarActions>
          </Toolbar>
        </Showcase>
      </section>
    </div>
  );
}

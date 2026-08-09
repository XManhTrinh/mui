"use client";

import * as React from "react";
import { SideSheet, Button, List, ListItem, Icon } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function SideSheetPage() {
  const [leftOpen, setLeftOpen] = React.useState(false);
  const [rightOpen, setRightOpen] = React.useState(false);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Side Sheet
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Side sheets are surfaces containing supplementary content or actions.
          They are anchored to the left or right edge of the screen.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Right Side</h2>
        <Showcase title="Right Side Sheet">
          <Button variant="filled" onClick={() => setRightOpen(true)}>
            Open Right Sheet
          </Button>
          <SideSheet
            side="right"
            open={rightOpen}
            onOpenChange={setRightOpen}
            title="Filters"
          >
            <div className="p-4 space-y-4">
              <p className="text-sm text-surface-variant-foreground">
                Apply filters to narrow your results.
              </p>
              <List>
                <ListItem headline="Category" trailing={<Icon name="chevron_right" />} />
                <ListItem headline="Price Range" trailing={<Icon name="chevron_right" />} />
                <ListItem headline="Rating" trailing={<Icon name="chevron_right" />} />
                <ListItem headline="Availability" trailing={<Icon name="chevron_right" />} />
              </List>
            </div>
          </SideSheet>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Left Side</h2>
        <Showcase title="Left Side Sheet (Navigation Drawer)">
          <Button variant="outlined" onClick={() => setLeftOpen(true)}>
            Open Left Sheet
          </Button>
          <SideSheet
            side="left"
            open={leftOpen}
            onOpenChange={setLeftOpen}
            title="Navigation"
          >
            <div className="p-4">
              <List>
                <ListItem headline="Home" leading={<Icon name="home" />} />
                <ListItem headline="Profile" leading={<Icon name="person" />} />
                <ListItem headline="Settings" leading={<Icon name="settings" />} />
                <ListItem headline="Help" leading={<Icon name="help" />} />
              </List>
            </div>
          </SideSheet>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Usage Notes</h2>
        <Showcase title="Design Guidelines">
          <div className="text-sm text-surface-variant-foreground space-y-2">
            <p>• Use right side sheets for supplementary content like filters and details.</p>
            <p>• Use left side sheets for navigation drawers on larger screens.</p>
            <p>• Side sheets can be modal (with scrim) or standard (persistent).</p>
          </div>
        </Showcase>
      </section>
    </div>
  );
}

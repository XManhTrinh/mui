"use client";

import * as React from "react";
import { BottomSheet, Button, List, ListItem, Icon } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function BottomSheetPage() {
  const [standardOpen, setStandardOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Bottom Sheet
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Bottom sheets are surfaces containing supplementary content, anchored
          to the bottom of the screen. They come in standard (non-modal) and
          modal variants.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Standard</h2>
        <Showcase title="Standard Bottom Sheet">
          <Button variant="filled" onClick={() => setStandardOpen(true)}>
            Open Standard Sheet
          </Button>
          <BottomSheet
            variant="standard"
            open={standardOpen}
            onOpenChange={setStandardOpen}
            title="Share"
          >
            <List>
              <ListItem headline="Copy link" leading={<Icon name="link" />} />
              <ListItem headline="Email" leading={<Icon name="mail" />} />
              <ListItem headline="Messages" leading={<Icon name="chat" />} />
              <ListItem headline="Bluetooth" leading={<Icon name="bluetooth" />} />
            </List>
          </BottomSheet>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Modal</h2>
        <Showcase title="Modal Bottom Sheet">
          <Button variant="outlined" onClick={() => setModalOpen(true)}>
            Open Modal Sheet
          </Button>
          <BottomSheet
            variant="modal"
            open={modalOpen}
            onOpenChange={setModalOpen}
            title="Sort by"
          >
            <List>
              <ListItem headline="Date (newest first)" leading={<Icon name="arrow_downward" />} />
              <ListItem headline="Date (oldest first)" leading={<Icon name="arrow_upward" />} />
              <ListItem headline="Name (A-Z)" leading={<Icon name="sort_by_alpha" />} />
              <ListItem headline="Size" leading={<Icon name="storage" />} />
            </List>
          </BottomSheet>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Usage Notes</h2>
        <Showcase title="Behavior">
          <div className="text-sm text-surface-variant-foreground space-y-2">
            <p>• Standard sheets coexist with the main content and do not block interaction.</p>
            <p>• Modal sheets appear over content with a scrim and require dismissal.</p>
            <p>• Both variants support drag-to-dismiss gestures.</p>
          </div>
        </Showcase>
      </section>
    </div>
  );
}

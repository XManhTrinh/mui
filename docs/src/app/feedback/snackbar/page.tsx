"use client";

import * as React from "react";
import { SnackbarProvider, useSnackbar, Button } from "@mui/index";
import { Showcase } from "@/components/showcase";

function SnackbarDemos() {
  const { showSnackbar } = useSnackbar();

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Snackbar
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Snackbars provide brief messages about app processes at the bottom of
          the screen. They can contain an action and can be dismissed.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Basic</h2>
        <Showcase title="With Action">
          <Button
            variant="filled"
            onClick={() =>
              showSnackbar({
                message: "Item archived",
                action: { label: "Undo", onClick: () => {} },
              })
            }
          >
            Show Snackbar with Action
          </Button>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Close</h2>
        <Showcase title="Dismissable">
          <Button
            variant="outlined"
            onClick={() =>
              showSnackbar({
                message: "Message sent successfully",
                dismissible: true,
              })
            }
          >
            Show Dismissable Snackbar
          </Button>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Persistent</h2>
        <Showcase title="Longer Duration">
          <Button
            variant="tonal"
            onClick={() =>
              showSnackbar({
                message: "No internet connection",
                action: { label: "Retry", onClick: () => {} },
                duration: 10000,
              })
            }
          >
            Show Persistent Snackbar
          </Button>
          <Button
            variant="text"
            onClick={() =>
              showSnackbar({
                message: "Processing your request...",
                dismissible: true,
                duration: Infinity,
              })
            }
          >
            Show Indefinite Snackbar
          </Button>
        </Showcase>
      </section>
    </div>
  );
}

export default function SnackbarPage() {
  return (
    <SnackbarProvider>
      <SnackbarDemos />
    </SnackbarProvider>
  );
}

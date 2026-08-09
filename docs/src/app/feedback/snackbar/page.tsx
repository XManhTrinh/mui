"use client";

import * as React from "react";
import { SnackbarProvider, useSnackbar, Button } from "@mui/index";
import { Showcase } from "@/components/showcase";

function SnackbarDemos() {
  const { show } = useSnackbar();

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
        <Showcase title="With Action" code={`const { show } = useSnackbar();\n\nshow({\n  message: "Item archived",\n  action: { label: "Undo", onClick: () => {} },\n});`}>
          <Button
            variant="filled"
            onClick={() =>
              show({
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
        <Showcase title="Dismissable" code={`show({\n  message: "Message sent successfully",\n  showClose: true,\n});`}>
          <Button
            variant="outlined"
            onClick={() =>
              show({
                message: "Message sent successfully",
                showClose: true,
              })
            }
          >
            Show Dismissable Snackbar
          </Button>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Persistent</h2>
        <Showcase title="Longer Duration" code={`show({\n  message: "No internet connection",\n  action: { label: "Retry", onClick: () => {} },\n  duration: 10000,\n});`}>
          <Button
            variant="tonal"
            onClick={() =>
              show({
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
              show({
                message: "Processing your request...",
                showClose: true,
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

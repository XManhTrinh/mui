"use client";

import * as React from "react";
import { SnackbarProvider, useSnackbar, Button } from "@mui/index";
import { Showcase } from "@/components/showcase";
import { PropsTable, type PropDef } from "@/components/props-table";

const snackbarMessageProps: PropDef[] = [
  {
    name: "message",
    type: "string",
    description: "Snackbar message text",
    required: true,
  },
  {
    name: "id",
    type: "string",
    description: "Unique ID (auto-generated if omitted)",
  },
  {
    name: "action",
    type: '{ label: string; onClick: () => void }',
    description: "Optional action button",
  },
  {
    name: "showClose",
    type: "boolean",
    default: "false",
    description: "Show dismiss close button",
  },
  {
    name: "duration",
    type: "number",
    default: "6000",
    description: "Auto-dismiss duration in ms. 0 = persistent. Action snackbars are persistent by default.",
  },
  {
    name: "priority",
    type: '"normal" | "urgent"',
    default: '"normal"',
    description: 'Affects aria-live: "normal" uses polite, "urgent" uses assertive',
  },
];

const snackbarProviderProps: PropDef[] = [
  {
    name: "children",
    type: "ReactNode",
    description: "App content that can use the useSnackbar hook",
    required: true,
  },
  {
    name: "position",
    type: '"bottom-left" | "bottom-center" | "bottom-right"',
    default: '"bottom-left"',
    description: "Position of the snackbar container on screen",
  },
  {
    name: "maxVisible",
    type: "number",
    default: "1",
    description: "Maximum number of snackbars visible at once (M3 recommends 1)",
  },
];

const useSnackbarReturnProps: PropDef[] = [
  {
    name: "show",
    type: "(message: SnackbarMessage) => string",
    description: "Show a snackbar. Returns the snackbar ID.",
    required: true,
  },
  {
    name: "dismiss",
    type: "(id: string) => void",
    description: "Dismiss a specific snackbar by its ID",
    required: true,
  },
  {
    name: "dismissAll",
    type: "() => void",
    description: "Dismiss all visible snackbars",
    required: true,
  },
];

function SnackbarDemos() {
  const { show, dismiss, dismissAll } = useSnackbar();

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Snackbar
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Snackbars provide brief messages about app processes at the bottom of
          the screen. They can contain an action and can be dismissed.
          Follows M3 Expressive specs: Level 3 shadow, rounded-sm (4dp) shape.
        </p>
      </div>

      {/* Basic */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Basic</h2>
        <Showcase
          title="With Action"
          code={`const { show } = useSnackbar();

show({
  message: "Item archived",
  action: { label: "Undo", onClick: () => {} },
});`}
        >
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

      {/* With Close */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Close</h2>
        <Showcase
          title="Dismissable"
          code={`show({
  message: "Message sent successfully",
  showClose: true,
});`}
        >
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

      {/* Persistent */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Persistent</h2>
        <Showcase
          title="Longer Duration"
          code={`show({
  message: "No internet connection",
  action: { label: "Retry", onClick: () => {} },
  duration: 10000,
});`}
        >
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
                duration: 0,
              })
            }
          >
            Show Indefinite Snackbar
          </Button>
        </Showcase>
      </section>

      {/* Dismiss Methods */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Programmatic Dismiss</h2>
        <Showcase
          title="dismiss() and dismissAll()"
          code={`const { show, dismiss, dismissAll } = useSnackbar();

// Dismiss a specific snackbar by ID
const id = show({ message: "Uploading...", duration: 0 });
dismiss(id);

// Dismiss all visible snackbars
dismissAll();`}
        >
          <Button
            variant="filled"
            onClick={() => {
              const id = show({
                message: "Uploading file... (dismiss in 2s)",
                showClose: true,
                duration: 0,
              });
              setTimeout(() => dismiss(id), 2000);
            }}
          >
            Show & Auto-Dismiss
          </Button>
          <Button
            variant="outlined"
            onClick={() => dismissAll()}
          >
            Dismiss All
          </Button>
        </Showcase>
      </section>

      {/* Priority */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Priority</h2>
        <p className="text-sm text-surface-variant-foreground">
          Urgent priority uses <code className="text-xs font-mono bg-surface-container-highest px-1 py-0.5 rounded">aria-live=&quot;assertive&quot;</code> and{" "}
          <code className="text-xs font-mono bg-surface-container-highest px-1 py-0.5 rounded">role=&quot;alert&quot;</code> for
          screen readers to announce immediately. Normal priority uses{" "}
          <code className="text-xs font-mono bg-surface-container-highest px-1 py-0.5 rounded">aria-live=&quot;polite&quot;</code>.
        </p>
        <Showcase
          title="Urgent Priority"
          code={`show({
  message: "Connection lost!",
  priority: "urgent",
  action: { label: "Retry", onClick: () => {} },
  showClose: true,
});`}
        >
          <Button
            variant="filled"
            onClick={() =>
              show({
                message: "Connection lost!",
                priority: "urgent",
                action: { label: "Retry", onClick: () => {} },
                showClose: true,
              })
            }
          >
            Show Urgent Snackbar
          </Button>
          <Button
            variant="outlined"
            onClick={() =>
              show({
                message: "File saved",
                priority: "normal",
              })
            }
          >
            Show Normal Snackbar
          </Button>
        </Showcase>
      </section>

      {/* M3 Expressive Specs */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">M3 Expressive Specs</h2>
        <div className="rounded-xl border border-outline-variant p-4 space-y-2 text-sm text-surface-variant-foreground">
          <p><strong>Elevation:</strong> Level 3 shadow</p>
          <p><strong>Shape:</strong> rounded-sm (4dp)</p>
          <p><strong>Background:</strong> inverse-surface</p>
          <p><strong>Text:</strong> inverse-on-surface</p>
          <p><strong>Default duration:</strong> 6000ms (action snackbars are persistent by default)</p>
          <p><strong>Max visible:</strong> 1 (M3 recommended)</p>
        </div>
      </section>

      {/* Props Tables */}
      <PropsTable componentName="SnackbarProvider" props={snackbarProviderProps} />
      <PropsTable componentName="SnackbarMessage" props={snackbarMessageProps} />
      <PropsTable componentName="useSnackbar()" props={useSnackbarReturnProps} />
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

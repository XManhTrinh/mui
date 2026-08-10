"use client";

import * as React from "react";
import { AppBar, IconButton, Icon, Switch } from "@mui/index";
import { Showcase, Playground } from "@/components/showcase";
import { PropsTable } from "@/components/props-table";
import { AccessibilityNotes } from "@/components/accessibility-notes";

export default function AppBarPage() {
  // Playground state
  const [elevated, setElevated] = React.useState(false);
  const [centered, setCentered] = React.useState(false);
  const [showSubtitle, setShowSubtitle] = React.useState(false);

  const playgroundCode = `<AppBar${elevated ? " elevated" : ""}${centered ? " centered" : ""}>
  <AppBar.Leading>
    <IconButton variant="standard" aria-label="Menu">
      <Icon name="menu" />
    </IconButton>
  </AppBar.Leading>
  <AppBar.Headline${showSubtitle ? ' subtitle="3 messages"' : ""}>Page Title</AppBar.Headline>
  <AppBar.Trailing>
    <IconButton variant="standard" aria-label="Search">
      <Icon name="search" />
    </IconButton>
  </AppBar.Trailing>
</AppBar>`;

  return (
    <div className="max-w-4xl space-y-8">
      {/* Hero */}
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          App Bar
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Top app bars display information and actions at the top of a screen.
          They provide content and actions related to the current screen.
        </p>
      </div>

      {/* Playground */}
      <Playground
        title="Playground"
        code={playgroundCode}
        controls={
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[13px] text-surface-foreground">Elevated</span>
              <Switch checked={elevated} onCheckedChange={setElevated} />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[13px] text-surface-foreground">Centered</span>
              <Switch checked={centered} onCheckedChange={setCentered} />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[13px] text-surface-foreground">Subtitle</span>
              <Switch checked={showSubtitle} onCheckedChange={setShowSubtitle} />
            </label>
          </div>
        }
      >
        <AppBar elevated={elevated} centered={centered} className="relative! w-full">
          <AppBar.Leading>
            <IconButton variant="standard" aria-label="Menu">
              <Icon name="menu" />
            </IconButton>
          </AppBar.Leading>
          <AppBar.Headline subtitle={showSubtitle ? "3 messages" : undefined}>
            Page Title
          </AppBar.Headline>
          <AppBar.Trailing>
            <IconButton variant="standard" aria-label="Search">
              <Icon name="search" />
            </IconButton>
          </AppBar.Trailing>
        </AppBar>
      </Playground>

      {/* Examples */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Navigation & Actions</h2>
        <Showcase
          title="Navigation & Actions"
          className="flex-col items-stretch"
          code={`<AppBar elevated>\n  <AppBar.Leading>\n    <IconButton variant="standard" aria-label="Menu">\n      <Icon name="menu" />\n    </IconButton>\n  </AppBar.Leading>\n  <AppBar.Headline subtitle="3 new messages">Inbox</AppBar.Headline>\n  <AppBar.Trailing>\n    <IconButton variant="standard" aria-label="Search">\n      <Icon name="search" />\n    </IconButton>\n    <IconButton variant="standard" aria-label="More">\n      <Icon name="more_vert" />\n    </IconButton>\n  </AppBar.Trailing>\n</AppBar>`}
        >
          <AppBar elevated>
            <AppBar.Leading>
              <IconButton variant="standard" aria-label="Menu">
                <Icon name="menu" />
              </IconButton>
            </AppBar.Leading>
            <AppBar.Headline subtitle="3 new messages">Inbox</AppBar.Headline>
            <AppBar.Trailing>
              <IconButton variant="standard" aria-label="Search">
                <Icon name="search" />
              </IconButton>
              <IconButton variant="standard" aria-label="More">
                <Icon name="more_vert" />
              </IconButton>
            </AppBar.Trailing>
          </AppBar>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Centered Title</h2>
        <Showcase
          title="Centered with Back Navigation"
          className="flex-col items-stretch"
          code={`<AppBar centered>\n  <AppBar.Leading>\n    <IconButton variant="standard" aria-label="Back">\n      <Icon name="arrow_back" />\n    </IconButton>\n  </AppBar.Leading>\n  <AppBar.Headline>Settings</AppBar.Headline>\n  <AppBar.Trailing>\n    <IconButton variant="standard" aria-label="Save">\n      <Icon name="check" />\n    </IconButton>\n  </AppBar.Trailing>\n</AppBar>`}
        >
          <AppBar centered>
            <AppBar.Leading>
              <IconButton variant="standard" aria-label="Back">
                <Icon name="arrow_back" />
              </IconButton>
            </AppBar.Leading>
            <AppBar.Headline>Settings</AppBar.Headline>
            <AppBar.Trailing>
              <IconButton variant="standard" aria-label="Save">
                <Icon name="check" />
              </IconButton>
            </AppBar.Trailing>
          </AppBar>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Subtitle</h2>
        <Showcase
          title="Elevated with Subtitle"
          className="flex-col items-stretch"
          code={`<AppBar elevated>\n  <AppBar.Leading>\n    <IconButton variant="standard" aria-label="Back">\n      <Icon name="arrow_back" />\n    </IconButton>\n  </AppBar.Leading>\n  <AppBar.Headline subtitle="Last synced 5 min ago">Messages</AppBar.Headline>\n  <AppBar.Trailing>\n    <IconButton variant="standard" aria-label="Refresh">\n      <Icon name="refresh" />\n    </IconButton>\n  </AppBar.Trailing>\n</AppBar>`}
        >
          <AppBar elevated>
            <AppBar.Leading>
              <IconButton variant="standard" aria-label="Back">
                <Icon name="arrow_back" />
              </IconButton>
            </AppBar.Leading>
            <AppBar.Headline subtitle="Last synced 5 min ago">Messages</AppBar.Headline>
            <AppBar.Trailing>
              <IconButton variant="standard" aria-label="Refresh">
                <Icon name="refresh" />
              </IconButton>
            </AppBar.Trailing>
          </AppBar>
        </Showcase>
      </section>

      {/* Props Tables */}
      <PropsTable
        componentName="AppBar"
        props={[
          { name: "elevated", type: "boolean", default: "false", description: "Adds scroll elevation styling" },
          { name: "centered", type: "boolean", default: "false", description: "Center-aligns the headline" },
          { name: "children", type: "ReactNode", description: "AppBar.Leading, AppBar.Headline, AppBar.Trailing", required: true },
          { name: "className", type: "string", description: "Additional CSS classes" },
        ]}
      />

      <PropsTable
        componentName="AppBar.Headline"
        props={[
          { name: "children", type: "ReactNode", description: "Title text or element", required: true },
          { name: "subtitle", type: "string", description: "Optional subtitle displayed below the headline" },
          { name: "className", type: "string", description: "Additional CSS classes" },
        ]}
      />

      <PropsTable
        componentName="AppBar.Leading"
        props={[
          { name: "children", type: "ReactNode", description: "Navigation icon button (48dp touch target)", required: true },
          { name: "className", type: "string", description: "Additional CSS classes" },
        ]}
      />

      <PropsTable
        componentName="AppBar.Trailing"
        props={[
          { name: "children", type: "ReactNode", description: "Trailing action icon buttons", required: true },
          { name: "className", type: "string", description: "Additional CSS classes" },
        ]}
      />

      {/* Accessibility */}
      <AccessibilityNotes
        componentName="AppBar"
        notes={[
          { category: "aria", description: "Uses role=\"banner\" for landmark navigation" },
          { category: "keyboard", description: "All action buttons are focusable with Tab" },
          { category: "screen-reader", description: "Headline is rendered as <h1> for proper heading hierarchy" },
          { category: "focus", description: "Focus order follows visual order: leading → headline → trailing" },
        ]}
      />
    </div>
  );
}

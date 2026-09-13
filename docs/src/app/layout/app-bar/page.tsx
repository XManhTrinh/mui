"use client";

import * as React from "react";
import { AppBar, IconButton, Icon, Switch, PageBar, useAppBarCollapse, Button } from "@mui/index";
import { Showcase, Playground } from "@/components/showcase";
import { PropsTable, type PropDef } from "@/components/props-table";
import { AccessibilityNotes } from "@/components/accessibility-notes";

export default function AppBarPage() {
  // Playground state
  const [elevated, setElevated] = React.useState(false);
  const [centered, setCentered] = React.useState(false);
  const [showSubtitle, setShowSubtitle] = React.useState(false);

  // Collapse demo state
  const { collapseFraction: mediumFraction, isScrolled: mediumScrolled, onScroll: onMediumScroll } =
    useAppBarCollapse({ variant: "medium" });
  const { collapseFraction: largeFraction, isScrolled: largeScrolled, onScroll: onLargeScroll } =
    useAppBarCollapse({ variant: "large", hasSubtitle: true });

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
          Supports small (64dp), medium (112dp), and large (152dp) variants.
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

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Variants</h2>
        <p className="text-sm text-surface-variant-foreground">
          Three variants: <strong>small</strong> (64dp, default),{" "}
          <strong>medium</strong> (112dp expanded, Headline Small title), and{" "}
          <strong>large</strong> (152dp expanded, Headline Medium title).
          Medium and large collapse to 64dp as the user scrolls.
        </p>

        <Showcase
          title="Small (default, 64dp)"
          className="flex-col items-stretch"
          code={`<AppBar variant="small" elevated>
  <AppBar.Leading>
    <IconButton variant="standard" aria-label="Menu">
      <Icon name="menu" />
    </IconButton>
  </AppBar.Leading>
  <AppBar.Headline>Small App Bar</AppBar.Headline>
  <AppBar.Trailing>
    <IconButton variant="standard" aria-label="Search">
      <Icon name="search" />
    </IconButton>
  </AppBar.Trailing>
</AppBar>`}
        >
          <AppBar variant="small" elevated>
            <AppBar.Leading>
              <IconButton variant="standard" aria-label="Menu">
                <Icon name="menu" />
              </IconButton>
            </AppBar.Leading>
            <AppBar.Headline>Small App Bar</AppBar.Headline>
            <AppBar.Trailing>
              <IconButton variant="standard" aria-label="Search">
                <Icon name="search" />
              </IconButton>
            </AppBar.Trailing>
          </AppBar>
        </Showcase>

        <Showcase
          title="Medium (112dp expanded)"
          className="flex-col items-stretch"
          code={`<AppBar variant="medium" collapseFraction={0} headline="Medium App Bar">
  <AppBar.Leading>
    <IconButton variant="standard" aria-label="Back">
      <Icon name="arrow_back" />
    </IconButton>
  </AppBar.Leading>
  <AppBar.Headline>Medium App Bar</AppBar.Headline>
  <AppBar.Trailing>
    <IconButton variant="standard" aria-label="More">
      <Icon name="more_vert" />
    </IconButton>
  </AppBar.Trailing>
</AppBar>`}
        >
          <AppBar variant="medium" collapseFraction={0}>
            <AppBar.Leading>
              <IconButton variant="standard" aria-label="Back">
                <Icon name="arrow_back" />
              </IconButton>
            </AppBar.Leading>
            <AppBar.Headline>Medium App Bar</AppBar.Headline>
            <AppBar.Trailing>
              <IconButton variant="standard" aria-label="More">
                <Icon name="more_vert" />
              </IconButton>
            </AppBar.Trailing>
          </AppBar>
        </Showcase>

        <Showcase
          title="Large (152dp expanded)"
          className="flex-col items-stretch"
          code={`<AppBar variant="large" collapseFraction={0}>
  <AppBar.Leading>
    <IconButton variant="standard" aria-label="Back">
      <Icon name="arrow_back" />
    </IconButton>
  </AppBar.Leading>
  <AppBar.Headline subtitle="Section subtitle">Large App Bar</AppBar.Headline>
  <AppBar.Trailing>
    <IconButton variant="standard" aria-label="Search">
      <Icon name="search" />
    </IconButton>
  </AppBar.Trailing>
</AppBar>`}
        >
          <AppBar variant="large" collapseFraction={0}>
            <AppBar.Leading>
              <IconButton variant="standard" aria-label="Back">
                <Icon name="arrow_back" />
              </IconButton>
            </AppBar.Leading>
            <AppBar.Headline subtitle="Section subtitle">Large App Bar</AppBar.Headline>
            <AppBar.Trailing>
              <IconButton variant="standard" aria-label="Search">
                <Icon name="search" />
              </IconButton>
            </AppBar.Trailing>
          </AppBar>
        </Showcase>
      </section>

      {/* Navigation & Actions */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Navigation & Actions</h2>
        <Showcase
          title="Navigation & Actions"
          className="flex-col items-stretch"
          code={`<AppBar elevated>
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
</AppBar>`}
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

      {/* Centered Title */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Centered Title</h2>
        <Showcase
          title="Centered with Back Navigation"
          className="flex-col items-stretch"
          code={`<AppBar centered>
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
</AppBar>`}
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

      {/* Scroll Collapse with useAppBarCollapse */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Scroll-Driven Collapse</h2>
        <p className="text-sm text-surface-variant-foreground">
          Use the <code className="text-xs font-mono bg-surface-container-highest px-1 py-0.5 rounded">useAppBarCollapse</code> hook
          to compute <code className="text-xs font-mono bg-surface-container-highest px-1 py-0.5 rounded">collapseFraction</code> from
          a scroll container. Attach <code className="text-xs font-mono bg-surface-container-highest px-1 py-0.5 rounded">onScroll</code> to
          the scrollable element and pass the returned values to AppBar.
        </p>
        <Showcase
          title="Medium — Scroll to collapse"
          className="flex-col items-stretch p-0!"
          code={`const { collapseFraction, isScrolled, onScroll } = useAppBarCollapse({
  variant: "medium",
});

<AppBar variant="medium" collapseFraction={collapseFraction} elevated={isScrolled}>
  <AppBar.Leading>
    <IconButton variant="standard" aria-label="Back">
      <Icon name="arrow_back" />
    </IconButton>
  </AppBar.Leading>
  <AppBar.Headline>Medium Collapsing</AppBar.Headline>
  <AppBar.Trailing>
    <IconButton variant="standard" aria-label="More">
      <Icon name="more_vert" />
    </IconButton>
  </AppBar.Trailing>
</AppBar>
<div className="overflow-auto h-48" onScroll={onScroll}>
  {/* scrollable content */}
</div>`}
        >
          <div className="w-full">
            <AppBar variant="medium" collapseFraction={mediumFraction} elevated={mediumScrolled}>
              <AppBar.Leading>
                <IconButton variant="standard" aria-label="Back">
                  <Icon name="arrow_back" />
                </IconButton>
              </AppBar.Leading>
              <AppBar.Headline>Medium Collapsing</AppBar.Headline>
              <AppBar.Trailing>
                <IconButton variant="standard" aria-label="More">
                  <Icon name="more_vert" />
                </IconButton>
              </AppBar.Trailing>
            </AppBar>
            <div className="overflow-auto h-48" onScroll={onMediumScroll}>
              <div className="p-4 space-y-3">
                {Array.from({ length: 20 }, (_, i) => (
                  <p key={i} className="text-sm text-surface-variant-foreground">
                    Scroll content item {i + 1} — scroll down to see the app bar collapse
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Showcase>

        <Showcase
          title="Large with Subtitle — Scroll to collapse"
          className="flex-col items-stretch p-0!"
          code={`const { collapseFraction, isScrolled, onScroll } = useAppBarCollapse({
  variant: "large",
  hasSubtitle: true,
});

<AppBar variant="large" collapseFraction={collapseFraction} elevated={isScrolled}>
  <AppBar.Leading>
    <IconButton variant="standard" aria-label="Back">
      <Icon name="arrow_back" />
    </IconButton>
  </AppBar.Leading>
  <AppBar.Headline subtitle="Updated just now">Large Collapsing</AppBar.Headline>
  <AppBar.Trailing>
    <IconButton variant="standard" aria-label="Search">
      <Icon name="search" />
    </IconButton>
  </AppBar.Trailing>
</AppBar>
<div className="overflow-auto h-48" onScroll={onScroll}>
  {/* scrollable content */}
</div>`}
        >
          <div className="w-full">
            <AppBar variant="large" collapseFraction={largeFraction} elevated={largeScrolled}>
              <AppBar.Leading>
                <IconButton variant="standard" aria-label="Back">
                  <Icon name="arrow_back" />
                </IconButton>
              </AppBar.Leading>
              <AppBar.Headline subtitle="Updated just now">Large Collapsing</AppBar.Headline>
              <AppBar.Trailing>
                <IconButton variant="standard" aria-label="Search">
                  <Icon name="search" />
                </IconButton>
              </AppBar.Trailing>
            </AppBar>
            <div className="overflow-auto h-48" onScroll={onLargeScroll}>
              <div className="p-4 space-y-3">
                {Array.from({ length: 20 }, (_, i) => (
                  <p key={i} className="text-sm text-surface-variant-foreground">
                    Scroll content item {i + 1} — scroll down to see the large app bar collapse
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Showcase>
      </section>

      {/* PageBar */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">PageBar</h2>
        <p className="text-sm text-surface-variant-foreground">
          Page-level section header for page titles and action buttons.
          Not a global navigation bar — used within page content regions.
          Minimum height of 56px with vertically centered items.
        </p>
        <Showcase
          title="PageBar with Actions"
          className="flex-col items-stretch"
          code={`<PageBar>
  <h2 className="text-[22px] leading-7 font-normal flex-1">All Projects</h2>
  <Button variant="tonal">
    <Icon name="add" size={18} />
    New Project
  </Button>
  <IconButton variant="standard" aria-label="Filter">
    <Icon name="filter_list" />
  </IconButton>
</PageBar>`}
        >
          <PageBar>
            <h2 className="text-[22px] leading-7 font-normal flex-1">All Projects</h2>
            <Button variant="tonal">
              <Icon name="add" size={18} />
              New Project
            </Button>
            <IconButton variant="standard" aria-label="Filter">
              <Icon name="filter_list" />
            </IconButton>
          </PageBar>
        </Showcase>
      </section>

      {/* Props Tables */}
      <PropsTable
        componentName="AppBar"
        props={[
          { name: "variant", type: '"small" | "medium" | "large"', default: '"small"', description: 'App bar variant. Small = 64dp, Medium = 112dp expanded, Large = 152dp expanded.' },
          { name: "elevated", type: "boolean", default: "false", description: "Adds scroll elevation styling (surface-container background + shadow)" },
          { name: "centered", type: "boolean", default: "false", description: "Center-aligns the headline" },
          { name: "collapseFraction", type: "number", default: "0", description: "Collapse fraction (0 = expanded, 1 = collapsed). For medium/large variants. Ignored for small." },
          { name: "leadingIcon", type: "ReactNode", description: "Leading navigation icon (prop API)" },
          { name: "headline", type: "ReactNode", description: "Headline text or element (prop API)" },
          { name: "subtitle", type: "string", description: "Subtitle text (prop API)" },
          { name: "trailingIcons", type: "ReactNode", description: "Trailing action elements (prop API)" },
          { name: "children", type: "ReactNode", description: "AppBar.Leading, AppBar.Headline, AppBar.Trailing (compound API)" },
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

      <PropsTable
        componentName="useAppBarCollapse"
        props={[
          { name: "variant", type: '"medium" | "large"', description: "App bar variant — determines the expanded height", required: true },
          { name: "hasSubtitle", type: "boolean", default: "false", description: "Whether the app bar has a subtitle (affects expanded height)" },
        ]}
      />

      <PropsTable
        componentName="useAppBarCollapse() Return"
        props={[
          { name: "collapseFraction", type: "number", description: "Current collapse fraction (0 = expanded, 1 = collapsed)", required: true },
          { name: "isScrolled", type: "boolean", description: "Whether the content has been scrolled (for elevation)", required: true },
          { name: "scrollRef", type: "RefObject<HTMLElement | null>", description: "Ref to attach to the scrollable container", required: true },
          { name: "onScroll", type: "(e: UIEvent<HTMLElement>) => void", description: "Scroll event handler — attach to onScroll on the scrollable container", required: true },
        ]}
      />

      <PropsTable
        componentName="PageBar"
        props={[
          { name: "children", type: "ReactNode", description: "Page title, action buttons, and other content", required: true },
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

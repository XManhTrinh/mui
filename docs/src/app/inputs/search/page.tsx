"use client";

import * as React from "react";
import { Search, Icon, IconButton, Switch } from "@mui/index";
import { Showcase, Playground } from "@/components/showcase";
import { PropsTable } from "@/components/props-table";
import { AccessibilityNotes } from "@/components/accessibility-notes";

export default function SearchPage() {
  const [query, setQuery] = React.useState("");
  // Playground state
  const [pgQuery, setPgQuery] = React.useState("");
  const [showTrailing, setShowTrailing] = React.useState(true);
  const [disabled, setDisabled] = React.useState(false);

  const playgroundCode = `<Search value={query} onValueChange={setQuery}${disabled ? " disabled" : ""}>
  <Search.LeadingIcon>
    <Icon name="search" size={24} />
  </Search.LeadingIcon>
  <Search.Input placeholder="Search items..." />
${showTrailing ? `  <Search.TrailingIcon>
    <IconButton variant="standard" size="xs" aria-label="Voice search">
      <Icon name="mic" />
    </IconButton>
  </Search.TrailingIcon>\n` : ""}</Search>`;

  return (
    <div className="max-w-4xl space-y-8">
      {/* Hero */}
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Search
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Search bars allow users to enter a keyword or phrase and get relevant
          information. They can be used as a primary or auxiliary method of
          discovery.
        </p>
      </div>

      {/* Playground */}
      <Playground
        title="Playground"
        code={playgroundCode}
        controls={
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[13px] text-surface-foreground">Trailing Icon</span>
              <Switch checked={showTrailing} onCheckedChange={setShowTrailing} />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[13px] text-surface-foreground">Disabled</span>
              <Switch checked={disabled} onCheckedChange={setDisabled} />
            </label>
          </div>
        }
      >
        <Search value={pgQuery} onValueChange={setPgQuery} disabled={disabled}>
          <Search.LeadingIcon>
            <Icon name="search" size={24} />
          </Search.LeadingIcon>
          <Search.Input placeholder="Search items..." />
          {showTrailing && (
            <Search.TrailingIcon>
              <IconButton variant="standard" size="xs" aria-label="Voice search">
                <Icon name="mic" />
              </IconButton>
            </Search.TrailingIcon>
          )}
        </Search>
      </Playground>

      {/* Examples */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Icons</h2>
        <Showcase
          title="Search with Icons"
          code={`<Search value={query} onValueChange={setQuery}>\n  <Search.LeadingIcon>\n    <Icon name="search" size={24} />\n  </Search.LeadingIcon>\n  <Search.Input placeholder="Search items..." />\n  <Search.TrailingIcon>\n    <IconButton variant="standard" size="xs" aria-label="Voice search">\n      <Icon name="mic" />\n    </IconButton>\n  </Search.TrailingIcon>\n</Search>`}
        >
          <Search value={query} onValueChange={setQuery}>
            <Search.LeadingIcon>
              <Icon name="search" size={24} />
            </Search.LeadingIcon>
            <Search.Input placeholder="Search items..." />
            <Search.TrailingIcon>
              <IconButton variant="standard" size="xs" aria-label="Voice search">
                <Icon name="mic" />
              </IconButton>
            </Search.TrailingIcon>
          </Search>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Clear Button</h2>
        <Showcase
          title="With Clear Button"
          code={`<Search value={query} onValueChange={setQuery}>\n  <Search.LeadingIcon>\n    <Icon name="search" size={24} />\n  </Search.LeadingIcon>\n  <Search.Input placeholder="Type to search..." />\n  <Search.TrailingIcon>\n    <IconButton\n      variant="standard"\n      size="xs"\n      aria-label="Clear"\n      onClick={() => setQuery("")}\n    >\n      <Icon name="close" />\n    </IconButton>\n  </Search.TrailingIcon>\n</Search>`}
        >
          <Search value={query} onValueChange={setQuery}>
            <Search.LeadingIcon>
              <Icon name="search" size={24} />
            </Search.LeadingIcon>
            <Search.Input placeholder="Type to search..." />
            <Search.TrailingIcon>
              <IconButton
                variant="standard"
                size="xs"
                aria-label="Clear"
                onClick={() => setQuery("")}
              >
                <Icon name="close" />
              </IconButton>
            </Search.TrailingIcon>
          </Search>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Leading Icon Only</h2>
        <Showcase
          title="Leading Icon Only"
          code={`<Search value={query} onValueChange={setQuery}>\n  <Search.LeadingIcon>\n    <Icon name="search" size={24} />\n  </Search.LeadingIcon>\n  <Search.Input placeholder="Search..." />\n</Search>`}
        >
          <Search value={query} onValueChange={setQuery}>
            <Search.LeadingIcon>
              <Icon name="search" size={24} />
            </Search.LeadingIcon>
            <Search.Input placeholder="Search..." />
          </Search>
        </Showcase>
      </section>

      {/* Props Tables */}
      <PropsTable
        componentName="Search"
        props={[
          { name: "value", type: "string", description: "Controlled input value" },
          { name: "defaultValue", type: "string", default: '""', description: "Default value (uncontrolled)" },
          { name: "onValueChange", type: "(value: string) => void", description: "Callback when value changes" },
          { name: "disabled", type: "boolean", default: "false", description: "Disables the search input" },
          { name: "children", type: "ReactNode", description: "Search.LeadingIcon, Search.Input, Search.TrailingIcon", required: true },
          { name: "className", type: "string", description: "Additional CSS classes" },
        ]}
      />

      <PropsTable
        componentName="Search.Input"
        props={[
          { name: "placeholder", type: "string", default: '"Search"', description: "Placeholder text" },
          { name: "disabled", type: "boolean", description: "Overrides parent disabled state" },
          { name: "aria-label", type: "string", description: "Accessible label (defaults to placeholder)" },
          { name: "className", type: "string", description: "Additional CSS classes" },
        ]}
      />

      <PropsTable
        componentName="Search.LeadingIcon"
        props={[
          { name: "children", type: "ReactNode", description: "Icon element (typically an Icon component)", required: true },
          { name: "className", type: "string", description: "Additional CSS classes" },
        ]}
      />

      <PropsTable
        componentName="Search.TrailingIcon"
        props={[
          { name: "children", type: "ReactNode", description: "Icon or IconButton element", required: true },
          { name: "className", type: "string", description: "Additional CSS classes" },
        ]}
      />

      {/* Accessibility */}
      <AccessibilityNotes
        componentName="Search"
        notes={[
          { category: "aria", description: "Input uses aria-label derived from placeholder text" },
          { category: "keyboard", description: "Input is focusable with Tab, focus ring appears on keyboard focus" },
          { category: "screen-reader", description: "Trailing action buttons have descriptive aria-labels" },
          { category: "focus", description: "Container shows ring-2 ring-primary visual focus indicator when input is focused" },
        ]}
      />
    </div>
  );
}

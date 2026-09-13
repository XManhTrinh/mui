"use client";

import * as React from "react";
import { Search, SearchView, Icon, IconButton, Switch, Button, List, ListItem } from "@mui/index";
import { Showcase, Playground } from "@/components/showcase";
import { PropsTable } from "@/components/props-table";
import { AccessibilityNotes } from "@/components/accessibility-notes";

export default function SearchPage() {
  const [query, setQuery] = React.useState("");
  // Playground state
  const [pgQuery, setPgQuery] = React.useState("");
  const [showTrailing, setShowTrailing] = React.useState(true);
  const [disabled, setDisabled] = React.useState(false);

  // SearchView state
  const [viewOpen, setViewOpen] = React.useState(false);
  const [viewQuery, setViewQuery] = React.useState("");

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

      {/* Search View */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Search View</h2>
        <p className="text-sm text-surface-variant-foreground">
          SearchView provides a full-surface expanded search experience. On mobile
          it covers the full viewport; on larger screens it renders as a docked
          panel anchored top-center.
        </p>
        <Showcase
          title="Expanded Search View"
          code={`<Button variant="outlined" onClick={() => setViewOpen(true)}>
  Open Search View
</Button>
<SearchView open={viewOpen} onOpenChange={setViewOpen} value={viewQuery} onValueChange={setViewQuery}>
  <SearchView.Header
    trailing={
      <IconButton variant="standard" size="xs" aria-label="Clear" onClick={() => setViewQuery("")}>
        <Icon name="close" />
      </IconButton>
    }
  >
    <SearchView.Input placeholder="Search..." />
  </SearchView.Header>
  <SearchView.Divider />
  <SearchView.Content>
    <List>
      <ListItem leading={<Icon name="history" size={24} />} interactive>Recent search 1</ListItem>
      <ListItem leading={<Icon name="history" size={24} />} interactive>Recent search 2</ListItem>
      <ListItem leading={<Icon name="trending_up" size={24} />} interactive>Trending topic</ListItem>
    </List>
  </SearchView.Content>
</SearchView>`}
        >
          <Button variant="outlined" onClick={() => setViewOpen(true)}>
            Open Search View
          </Button>
          <SearchView open={viewOpen} onOpenChange={setViewOpen} value={viewQuery} onValueChange={setViewQuery}>
            <SearchView.Header
              trailing={
                viewQuery ? (
                  <IconButton variant="standard" size="xs" aria-label="Clear" onClick={() => setViewQuery("")}>
                    <Icon name="close" />
                  </IconButton>
                ) : undefined
              }
            >
              <SearchView.Input placeholder="Search..." />
            </SearchView.Header>
            <SearchView.Divider />
            <SearchView.Content>
              <List>
                <ListItem leading={<Icon name="history" size={24} />} interactive>Recent search 1</ListItem>
                <ListItem leading={<Icon name="history" size={24} />} interactive>Recent search 2</ListItem>
                <ListItem leading={<Icon name="trending_up" size={24} />} interactive>Trending topic</ListItem>
              </List>
            </SearchView.Content>
          </SearchView>
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

      <PropsTable
        componentName="SearchView"
        props={[
          { name: "open", type: "boolean", description: "Controlled open state", required: true },
          { name: "onOpenChange", type: "(open: boolean) => void", description: "Callback when open state changes", required: true },
          { name: "value", type: "string", description: "Controlled query value" },
          { name: "defaultValue", type: "string", default: '""', description: "Default query value (uncontrolled)" },
          { name: "onValueChange", type: "(value: string) => void", description: "Callback when query value changes" },
          { name: "aria-label", type: "string", default: '"Search"', description: "Accessible label for the dialog" },
          { name: "className", type: "string", description: "Additional CSS classes for the view container" },
          { name: "children", type: "ReactNode", description: "SearchView.Header, SearchView.Divider, SearchView.Content" },
        ]}
      />

      <PropsTable
        componentName="SearchView.Header"
        props={[
          { name: "leadingIcon", type: "string", default: '"arrow_back"', description: "Leading icon name (back button)" },
          { name: "leadingLabel", type: "string", default: '"Back"', description: "Accessible label for the leading button" },
          { name: "onLeadingClick", type: "() => void", description: "Leading button click handler (defaults to closing the view)" },
          { name: "trailing", type: "ReactNode", description: "Trailing content (e.g. clear button or avatar)" },
          { name: "className", type: "string", description: "Additional CSS classes" },
          { name: "children", type: "ReactNode", description: "Header content — typically a SearchView.Input" },
        ]}
      />

      <PropsTable
        componentName="SearchView.Input"
        props={[
          { name: "placeholder", type: "string", default: '"Search"', description: "Placeholder text" },
          { name: "aria-label", type: "string", description: "Accessible label (defaults to placeholder)" },
          { name: "onSubmit", type: "(value: string) => void", description: "Callback when Enter key is pressed" },
          { name: "className", type: "string", description: "Additional CSS classes" },
        ]}
      />

      <PropsTable
        componentName="SearchView.Divider"
        props={[
          { name: "className", type: "string", description: "Additional CSS classes" },
        ]}
      />

      <PropsTable
        componentName="SearchView.Content"
        props={[
          { name: "className", type: "string", description: "Additional CSS classes" },
          { name: "children", type: "ReactNode", description: "Suggestions and search results" },
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

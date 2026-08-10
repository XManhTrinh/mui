"use client";

import * as React from "react";
import { Search, Icon, IconButton } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function SearchPage() {
  const [query, setQuery] = React.useState("");

  return (
    <div className="max-w-4xl space-y-8">
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

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Basic</h2>
        <Showcase title="Default Search Bar" code={`<Search placeholder="Search..." />`}>
          <Search placeholder="Search..." />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Controlled</h2>
        <Showcase title="Controlled Search" className="flex-col items-stretch" code={`<Search\n  value={query}\n  onValueChange={setQuery}\n  placeholder="Type to search..."\n/>`}>
          <Search
            value={query}
            onValueChange={setQuery}
            placeholder="Type to search..."
          />
          <p className="text-sm text-surface-variant-foreground">
            Query: &quot;{query}&quot;
          </p>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">With Leading Icon</h2>
        <Showcase title="Search with Avatar/Icon" code={`<Search placeholder="Search messages..." leadingIcon="search" />`}>
          <Search
            placeholder="Search messages..."
            leadingIcon="search"
          />
        </Showcase>
      </section>

      {/* ─── Composable API ─────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Composable API</h2>
        <p className="text-[14px] leading-5 text-surface-variant-foreground">
          The composable API uses <code>Search.LeadingIcon</code>,{" "}
          <code>Search.Input</code>, and <code>Search.TrailingIcon</code>{" "}
          sub-components for full control over each slot. This enables custom
          icons, buttons, or avatars in the leading and trailing positions.
        </p>

        <Showcase
          title="Composable — Custom Icons"
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

        <Showcase
          title="Composable — With Clear Button"
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
    </div>
  );
}

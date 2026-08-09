"use client";

import * as React from "react";
import { Search, Icon } from "@mui/index";
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
    </div>
  );
}

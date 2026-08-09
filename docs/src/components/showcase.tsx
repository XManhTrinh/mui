"use client";

import * as React from "react";

interface ShowcaseProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Showcase({ title, children, className }: ShowcaseProps) {
  return (
    <div className="rounded-2xl border border-outline-variant overflow-hidden">
      <div className="px-4 py-2 border-b border-outline-variant bg-surface-container">
        <h3 className="text-sm font-medium text-surface-foreground">{title}</h3>
      </div>
      <div
        className={`p-6 bg-surface-container-low flex flex-wrap items-center gap-4 ${className ?? ""}`}
      >
        {children}
      </div>
    </div>
  );
}

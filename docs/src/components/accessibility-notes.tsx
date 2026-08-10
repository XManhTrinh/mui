"use client";

import * as React from "react";
import { Icon, Card, CardContent, CardHeader, CardTitle } from "@mui/index";

export interface A11yNote {
  category: "keyboard" | "aria" | "screen-reader" | "focus";
  description: string;
}

interface AccessibilityNotesProps {
  componentName: string;
  notes: A11yNote[];
}

const categoryConfig: Record<
  A11yNote["category"],
  { icon: string; label: string }
> = {
  keyboard: { icon: "keyboard", label: "Keyboard" },
  aria: { icon: "accessibility", label: "ARIA" },
  "screen-reader": { icon: "record_voice_over", label: "Screen Reader" },
  focus: { icon: "center_focus_strong", label: "Focus" },
};

export function AccessibilityNotes({
  componentName,
  notes,
}: AccessibilityNotesProps) {
  // Group notes by category
  const grouped = notes.reduce<Record<string, A11yNote[]>>((acc, note) => {
    if (!acc[note.category]) acc[note.category] = [];
    acc[note.category].push(note);
    return acc;
  }, {});

  return (
    <section className="space-y-3">
      <h2 className="text-[22px] leading-7 font-normal text-surface-foreground">
        Accessibility
      </h2>
      <Card variant="outlined">
        <CardHeader>
          <CardTitle>{componentName} — Accessibility Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(grouped).map(([category, categoryNotes]) => {
              const config = categoryConfig[category as A11yNote["category"]];
              return (
                <div key={category} className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Icon
                      name={config.icon}
                      size={20}
                      className="text-primary"
                    />
                    <span className="text-sm font-medium text-surface-foreground">
                      {config.label}
                    </span>
                  </div>
                  <ul className="ml-7 space-y-1">
                    {categoryNotes.map((note, i) => (
                      <li
                        key={i}
                        className="text-sm text-surface-variant-foreground"
                      >
                        {note.description}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

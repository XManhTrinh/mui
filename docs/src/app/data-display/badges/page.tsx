"use client";

import * as React from "react";
import { Badge, Icon, IconButton, Chip, Switch } from "@mui/index";
import { Showcase, Playground } from "@/components/showcase";

export default function BadgesPage() {
  // Playground state
  const [pgVariant, setPgVariant] = React.useState<"dot" | "count">("count");
  const [pgCount, setPgCount] = React.useState(5);

  const pgCode = pgVariant === "dot"
    ? `<Badge variant="dot">\n  <IconButton variant="standard" aria-label="Notifications">\n    <Icon name="notifications" />\n  </IconButton>\n</Badge>`
    : `<Badge variant="count" count={${pgCount}}>\n  <IconButton variant="standard" aria-label="Notifications">\n    <Icon name="notifications" />\n  </IconButton>\n</Badge>`;

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Badges
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Badges convey dynamic information, such as counts or status. A badge
          can include a label or be used as a dot indicator.
        </p>
      </div>

      {/* Interactive Playground */}
      <Playground
        title="Playground"
        code={pgCode}
        controls={
          <>
            <div>
              <span className="text-[12px] font-medium text-surface-variant-foreground block mb-1.5">Variant</span>
              <div className="flex flex-wrap gap-1">
                {(["dot", "count"] as const).map((v) => (
                  <Chip key={v} variant="filter" selected={pgVariant === v} onClick={() => setPgVariant(v)}>
                    {v}
                  </Chip>
                ))}
              </div>
            </div>
            {pgVariant === "count" && (
              <div>
                <span className="text-[12px] font-medium text-surface-variant-foreground block mb-1.5">Count: {pgCount}</span>
                <input
                  type="range"
                  min={0}
                  max={999}
                  value={pgCount}
                  onChange={(e) => setPgCount(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </>
        }
      >
        <Badge variant={pgVariant} count={pgVariant === "count" ? pgCount : undefined}>
          <IconButton variant="standard" aria-label="Notifications">
            <Icon name="notifications" />
          </IconButton>
        </Badge>
      </Playground>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Dot Badge</h2>
        <Showcase title="Dot Indicator" code={`<Badge variant="dot">\n  <IconButton variant="standard" aria-label="Notifications">\n    <Icon name="notifications" />\n  </IconButton>\n</Badge>`}>
          <Badge variant="dot">
            <IconButton variant="standard" aria-label="Notifications">
              <Icon name="notifications" />
            </IconButton>
          </Badge>
          <Badge variant="dot">
            <IconButton variant="standard" aria-label="Mail">
              <Icon name="mail" />
            </IconButton>
          </Badge>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Count Badge</h2>
        <Showcase title="With Count" code={`<Badge variant="count" count={3}>\n  <IconButton variant="standard" aria-label="Notifications">\n    <Icon name="notifications" />\n  </IconButton>\n</Badge>`}>
          <Badge variant="count" count={3}>
            <IconButton variant="standard" aria-label="Notifications">
              <Icon name="notifications" />
            </IconButton>
          </Badge>
          <Badge variant="count" count={12}>
            <IconButton variant="standard" aria-label="Mail">
              <Icon name="mail" />
            </IconButton>
          </Badge>
          <Badge variant="count" count={999}>
            <IconButton variant="standard" aria-label="Chat">
              <Icon name="chat" />
            </IconButton>
          </Badge>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Max Count</h2>
        <Showcase title="Overflow Behavior" code={`<Badge variant="count" count={100} max={99}>\n  <IconButton variant="standard" aria-label="Updates">\n    <Icon name="update" />\n  </IconButton>\n</Badge>`}>
          <Badge variant="count" count={100} max={99}>
            <IconButton variant="standard" aria-label="Updates">
              <Icon name="update" />
            </IconButton>
          </Badge>
          <span className="text-sm text-surface-variant-foreground">
            Displays &quot;99+&quot; when count exceeds max
          </span>
        </Showcase>
      </section>
    </div>
  );
}

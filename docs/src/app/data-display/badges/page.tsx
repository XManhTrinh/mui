"use client";

import * as React from "react";
import { Badge, Icon, IconButton } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function BadgesPage() {
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

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Dot Badge</h2>
        <Showcase title="Dot Indicator">
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
        <Showcase title="With Count">
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
        <Showcase title="Overflow Behavior">
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

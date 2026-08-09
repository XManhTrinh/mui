"use client";

import * as React from "react";
import { Icon } from "@mui/index";
import { Showcase } from "@/components/showcase";

export default function IconPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[28px] leading-9 font-normal text-surface-foreground mb-2">
          Icon
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground">
          Icons are visual symbols used to represent ideas, objects, or actions.
          They communicate messages at a glance, afford interactivity, and draw
          attention to important information.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Sizes</h2>
        <Showcase title="Icon Sizes" code={`<Icon name="home" size={18} />\n<Icon name="home" size={24} />\n<Icon name="home" size={40} />\n<Icon name="home" size={48} />`}>
          <Icon name="home" size={18} />
          <Icon name="home" size={20} />
          <Icon name="home" size={24} />
          <Icon name="home" size={40} />
          <Icon name="home" size={40} />
          <Icon name="home" size={48} />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Weight</h2>
        <Showcase title="Font Weights" code={`<Icon name="settings" weight={100} />\n<Icon name="settings" weight={400} />\n<Icon name="settings" weight={700} />`}>
          <Icon name="settings" weight={100} />
          <Icon name="settings" weight={200} />
          <Icon name="settings" weight={300} />
          <Icon name="settings" weight={400} />
          <Icon name="settings" weight={500} />
          <Icon name="settings" weight={600} />
          <Icon name="settings" weight={700} />
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Filled & Outlined</h2>
        <Showcase title="Fill Styles" code={`<Icon name="favorite" filled />\n<Icon name="favorite" />`}>
          <div className="flex flex-col items-center gap-1">
            <Icon name="favorite" filled />
            <span className="text-xs text-surface-variant-foreground">Filled</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Icon name="favorite" />
            <span className="text-xs text-surface-variant-foreground">Outlined</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Icon name="star" filled />
            <span className="text-xs text-surface-variant-foreground">Filled</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Icon name="star" />
            <span className="text-xs text-surface-variant-foreground">Outlined</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Icon name="bookmark" filled />
            <span className="text-xs text-surface-variant-foreground">Filled</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Icon name="bookmark" />
            <span className="text-xs text-surface-variant-foreground">Outlined</span>
          </div>
        </Showcase>
      </section>

      <section className="space-y-4">
        <h2 className="text-[22px] leading-7 font-normal">Common Icons</h2>
        <Showcase title="Icon Gallery" code={`<Icon name="home" />\n<Icon name="search" />\n<Icon name="settings" />\n<Icon name="person" />\n<Icon name="mail" />`}>
          <Icon name="home" />
          <Icon name="search" />
          <Icon name="settings" />
          <Icon name="person" />
          <Icon name="mail" />
          <Icon name="notifications" />
          <Icon name="edit" />
          <Icon name="delete" />
          <Icon name="add" />
          <Icon name="close" />
          <Icon name="menu" />
          <Icon name="more_vert" />
          <Icon name="check" />
          <Icon name="arrow_back" />
          <Icon name="arrow_forward" />
        </Showcase>
      </section>
    </div>
  );
}

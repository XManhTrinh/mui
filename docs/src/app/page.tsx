"use client";

import { Icon, Card, CardContent, Chip, Divider } from "@mui/index";
import Link from "next/link";

const categories = [
  {
    title: "Buttons",
    icon: "buttons_alt",
    href: "/buttons",
    components: ["Button", "IconButton", "FAB", "ExtendedFAB", "SplitButton", "ButtonGroup"],
  },
  {
    title: "Inputs & Selection",
    icon: "input",
    href: "/inputs/text-fields",
    components: ["TextField", "Checkbox", "Radio", "Switch", "Slider", "Search"],
  },
  {
    title: "Data Display",
    icon: "dashboard",
    href: "/data-display/cards",
    components: ["Card", "Badge", "Chip", "List", "Tooltip", "Divider", "Icon"],
  },
  {
    title: "Feedback",
    icon: "feedback",
    href: "/feedback/dialog",
    components: ["Dialog", "Snackbar", "Menu", "Progress"],
  },
  {
    title: "Navigation",
    icon: "near_me",
    href: "/navigation/bar",
    components: ["NavigationBar", "NavigationRail"],
  },
  {
    title: "Layout & Containment",
    icon: "view_sidebar",
    href: "/layout/app-bar",
    components: ["AppBar", "Tabs", "BottomSheet", "SideSheet", "Toolbar", "Carousel"],
  },
  {
    title: "Date & Time",
    icon: "calendar_month",
    href: "/pickers/date",
    components: ["DatePicker", "TimePicker"],
  },
];

export default function HomePage() {
  return (
    <div className="max-w-4xl space-y-8">
      {/* Hero */}
      <div className="space-y-3">
        <h1 className="text-[32px] leading-10 font-normal text-surface-foreground">
          M3 Components
        </h1>
        <p className="text-[16px] leading-6 text-surface-variant-foreground max-w-160">
          A Material Design 3 Expressive component library for React and Next.js.
          36 components built per official m3.material.io specifications with
          Tailwind CSS v4 and Radix primitives.
        </p>
      </div>

      <Divider />

      {/* Category grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <Link key={cat.title} href={cat.href} className="no-underline">
            <Card variant="outlined" interactive className="h-full">
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-container">
                    <Icon name={cat.icon} size={20} className="text-primary-container-foreground" />
                  </div>
                  <h2 className="text-[16px] leading-6 font-medium text-surface-foreground">
                    {cat.title}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cat.components.map((comp) => (
                    <Chip key={comp} variant="suggestion" className="h-6 text-[11px] px-2">
                      {comp}
                    </Chip>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick stats */}
      <div className="flex flex-wrap gap-6 pt-4">
        <Stat value="36" label="Components" />
        <Stat value="7" label="Categories" />
        <Stat value="100%" label="Theme-driven" />
        <Stat value="0" label="Dependencies" />
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[28px] leading-9 font-normal text-primary">{value}</span>
      <span className="text-[12px] leading-4 tracking-[0.4px] text-surface-variant-foreground">{label}</span>
    </div>
  );
}

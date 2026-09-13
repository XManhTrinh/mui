"use client";

import * as React from "react";
import {
  Button,
  Icon,
  Card,
  CardContent,
  Chip,
  Divider,
  Typography,
  Badge,
  IconButton,
  FAB,
  Switch,
  Checkbox,
  LinearProgress,
  CircularProgress,
  Tabs,
  TabList,
  Tab,
  TabContent,
  Slider,
  TextField,
} from "@mui/index";
import Link from "next/link";

// ─── Category data ────────────────────────────────────────────────────────────

type ComponentLink = { name: string; href: string };

const categories: {
  title: string;
  icon: string;
  href: string;
  description: string;
  components: ComponentLink[];
  color: string;
  iconColor: string;
}[] = [
  {
    title: "Buttons",
    icon: "buttons_alt",
    href: "/buttons",
    description: "Common buttons, icon buttons, FABs, split buttons, and button groups",
    components: [
      { name: "Button", href: "/buttons" },
      { name: "IconButton", href: "/buttons/icon-buttons" },
      { name: "FAB", href: "/buttons/fabs" },
      { name: "ExtendedFAB", href: "/buttons/fabs" },
      { name: "FABMenu", href: "/buttons/fabs" },
      { name: "SplitButton", href: "/buttons/split-button" },
      { name: "ButtonGroup", href: "/buttons/button-group" },
    ],
    color: "bg-primary-container",
    iconColor: "text-primary-container-foreground",
  },
  {
    title: "Inputs",
    icon: "input",
    href: "/inputs/text-fields",
    description: "Text fields, selects, checkboxes, radios, switches, sliders, and search",
    components: [
      { name: "TextField", href: "/inputs/text-fields" },
      { name: "Select", href: "/inputs/select" },
      { name: "Checkbox", href: "/inputs/checkbox" },
      { name: "Radio", href: "/inputs/radio" },
      { name: "Switch", href: "/inputs/switch" },
      { name: "Slider", href: "/inputs/slider" },
      { name: "Search", href: "/inputs/search" },
    ],
    color: "bg-secondary-container",
    iconColor: "text-secondary-container-foreground",
  },
  {
    title: "Data Display",
    icon: "dashboard",
    href: "/data-display/cards",
    description: "Cards, badges, chips, lists, tooltips, dividers, and icons",
    components: [
      { name: "Card", href: "/data-display/cards" },
      { name: "Badge", href: "/data-display/badges" },
      { name: "Chip", href: "/data-display/chips" },
      { name: "List", href: "/data-display/lists" },
      { name: "Tooltip", href: "/data-display/tooltip" },
      { name: "Divider", href: "/data-display/divider" },
      { name: "Icon", href: "/data-display/icon" },
    ],
    color: "bg-tertiary-container",
    iconColor: "text-tertiary-container-foreground",
  },
  {
    title: "Feedback",
    icon: "feedback",
    href: "/feedback/dialog",
    description: "Dialogs, snackbars, menus, and progress indicators",
    components: [
      { name: "Dialog", href: "/feedback/dialog" },
      { name: "Snackbar", href: "/feedback/snackbar" },
      { name: "Menu", href: "/feedback/menu" },
      { name: "Progress", href: "/feedback/progress" },
    ],
    color: "bg-primary-container",
    iconColor: "text-primary-container-foreground",
  },
  {
    title: "Navigation",
    icon: "near_me",
    href: "/navigation/bar",
    description: "Bottom navigation bars and side navigation rails",
    components: [
      { name: "NavigationBar", href: "/navigation/bar" },
      { name: "NavigationRail", href: "/navigation/rail" },
    ],
    color: "bg-secondary-container",
    iconColor: "text-secondary-container-foreground",
  },
  {
    title: "Layout",
    icon: "view_sidebar",
    href: "/layout/app-bar",
    description: "App bars, tabs, sheets, toolbars, carousels, and typography",
    components: [
      { name: "AppBar", href: "/layout/app-bar" },
      { name: "Tabs", href: "/layout/tabs" },
      { name: "BottomSheet", href: "/layout/bottom-sheet" },
      { name: "SideSheet", href: "/layout/side-sheet" },
      { name: "Toolbar", href: "/layout/toolbar" },
      { name: "Carousel", href: "/layout/carousel" },
      { name: "Typography", href: "/layout/typography" },
    ],
    color: "bg-tertiary-container",
    iconColor: "text-tertiary-container-foreground",
  },
  {
    title: "Pickers",
    icon: "calendar_month",
    href: "/pickers/date",
    description: "Calendar date pickers and time input pickers",
    components: [
      { name: "DatePicker", href: "/pickers/date" },
      { name: "TimePicker", href: "/pickers/time" },
    ],
    color: "bg-primary-container",
    iconColor: "text-primary-container-foreground",
  },
];

// ─── Home page ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [demoTab, setDemoTab] = React.useState("buttons");
  const [sliderVal, setSliderVal] = React.useState(60);
  const [switchOn, setSwitchOn] = React.useState(true);
  const [checkOn, setCheckOn] = React.useState(true);

  return (
    <div className="space-y-16 pb-16">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-primary-container px-8 py-14 sm:px-14 sm:py-20">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -inset-r-20 -inset-t-20 size-80 rounded-full bg-primary/[0.07]" />
        <div className="pointer-events-none absolute -inset-l-10 -inset-b-10 size-60 rounded-full bg-tertiary/[0.06]" />

        <div className="relative z-10 max-w-160 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/[0.12] px-3 py-1">
            <Icon name="auto_awesome" size={16} className="text-primary" />
            <span className="text-[12px] font-medium tracking-[0.5px] text-primary">
              M3 Expressive — May 2025
            </span>
          </div>

          <h1 className="text-[45px] leading-[52px] font-normal tracking-normal text-primary-container-foreground sm:text-[57px] sm:leading-[64px] sm:tracking-[-0.25px]">
            Material Design 3
            <br />
            for React
          </h1>

          <p className="max-w-120 text-[16px] leading-6 tracking-[0.5px] text-primary-container-foreground/80">
            37+ production-ready components built to spec. Token-verified against
            official MDC sources. Tailwind CSS v4, zero runtime config, full dark
            mode, and RTL support out of the box.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              asChild
              variant="filled"
              size="m"
              icon={<Icon name="rocket_launch" />}
            >
              <Link href="/buttons">Get started</Link>
            </Button>
            <Button asChild variant="outlined" size="m">
              <a
                href="https://github.com/XManhTrinh/mui"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="code" className="me-2" />
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Stats row ────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { value: "37+", label: "Components", icon: "widgets" },
          { value: "100%", label: "Token verified", icon: "verified" },
          { value: "0", label: "Config needed", icon: "settings" },
          { value: "A11y", label: "WCAG ready", icon: "accessibility_new" },
        ].map((s) => (
          <Card key={s.label} variant="filled" className="text-center">
            <CardContent className="flex flex-col items-center gap-2 py-6">
              <Icon name={s.icon} size={24} className="text-primary" />
              <span className="text-[28px] leading-9 font-normal text-surface-foreground">
                {s.value}
              </span>
              <span className="text-[12px] leading-4 font-medium tracking-[0.5px] text-[hsl(var(--on-surface-variant))]">
                {s.label}
              </span>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* ── Live preview ─────────────────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="space-y-1">
          <Typography variant="headline-medium">See it in action</Typography>
          <Typography variant="body-large" color="surface-variant-foreground">
            Every component follows M3 Expressive specs — proper tokens, state
            layers, shape morph, and motion.
          </Typography>
        </div>

        <Card variant="outlined" className="overflow-hidden">
          <Tabs value={demoTab} onValueChange={setDemoTab} variant="secondary">
            <TabList>
              <Tab value="buttons" label="Buttons" icon="buttons_alt" />
              <Tab value="inputs" label="Inputs" icon="input" />
              <Tab value="feedback" label="Feedback" icon="feedback" />
            </TabList>

            <TabContent value="buttons">
              <div className="flex flex-wrap items-center gap-3 p-6">
                <Button variant="filled">Filled</Button>
                <Button variant="outlined">Outlined</Button>
                <Button variant="tonal">Tonal</Button>
                <Button variant="elevated">Elevated</Button>
                <Button variant="text">Text</Button>
                <Divider orientation="vertical" className="h-8 mx-1" />
                <IconButton variant="filled" aria-label="Edit">
                  <Icon name="edit" />
                </IconButton>
                <IconButton variant="filled-tonal" aria-label="Bookmark">
                  <Icon name="bookmark" />
                </IconButton>
                <IconButton variant="outlined" aria-label="Share">
                  <Icon name="share" />
                </IconButton>
                <Divider orientation="vertical" className="h-8 mx-1" />
                <FAB
                  size="fab"
                  icon={<Icon name="add" />}
                  aria-label="Add"
                />
              </div>
            </TabContent>

            <TabContent value="inputs">
              <div className="flex flex-col gap-5 p-6 max-w-sm">
                <TextField label="Email address" type="email" leadingIcon={<Icon name="mail" />} />
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={checkOn} onCheckedChange={(v) => setCheckOn(v === true)} />
                    <span className="text-[14px]">Subscribe</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Switch checked={switchOn} onCheckedChange={setSwitchOn} />
                    <span className="text-[14px]">Notifications</span>
                  </label>
                </div>
                <div>
                  <span className="text-[12px] font-medium text-[hsl(var(--on-surface-variant))] block mb-2">
                    Volume: {sliderVal}
                  </span>
                  <Slider
                    value={sliderVal}
                    onValueChange={setSliderVal}
                    min={0}
                    max={100}
                    showValueIndicator
                    aria-label="Volume"
                  />
                </div>
              </div>
            </TabContent>

            <TabContent value="feedback">
              <div className="flex flex-col gap-5 p-6">
                <div className="flex items-center gap-4">
                  <CircularProgress />
                  <CircularProgress value={75} />
                  <CircularProgress wave />
                </div>
                <div className="space-y-3 max-w-xs">
                  <LinearProgress value={65} />
                  <LinearProgress />
                  <LinearProgress value={40} wave />
                </div>
              </div>
            </TabContent>
          </Tabs>
        </Card>
      </section>

      {/* ── Categories grid ──────────────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="space-y-1">
          <Typography variant="headline-medium">Browse components</Typography>
          <Typography variant="body-large" color="surface-variant-foreground">
            7 categories, every M3 component you need.
          </Typography>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Card
              key={cat.title}
              variant="elevated"
              className="h-full flex flex-col"
            >
              <CardContent className="flex flex-col gap-4 flex-1">
                {/* Header — links to the category overview */}
                <Link href={cat.href} className="no-underline group/head">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center justify-center size-12 rounded-2xl shrink-0 ${cat.color}`}
                    >
                      <Icon
                        name={cat.icon}
                        size={24}
                        className={cat.iconColor}
                      />
                    </div>
                    <div className="min-w-0">
                      <Typography variant="title-medium" className="group-hover/head:text-primary transition-colors">
                        {cat.title}
                      </Typography>
                      <Typography
                        variant="label-small"
                        color="surface-variant-foreground"
                      >
                        {cat.components.length} components
                      </Typography>
                    </div>
                    <Icon
                      name="arrow_forward"
                      size={18}
                      className="ms-auto text-[hsl(var(--on-surface-variant))] opacity-0 -translate-x-1 group-hover/head:opacity-100 group-hover/head:translate-x-0 transition-all duration-200"
                    />
                  </div>
                </Link>

                {/* Description */}
                <Typography
                  variant="body-small"
                  color="surface-variant-foreground"
                >
                  {cat.description}
                </Typography>

                {/* Component chips — each links to its own page */}
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {cat.components.map((comp) => (
                    <Link
                      key={comp.name}
                      href={comp.href}
                      className="no-underline"
                    >
                      <Chip
                        variant="assist"
                        className="h-7 text-[11px] px-2.5 hover:bg-[hsl(var(--on-surface)/0.08)] transition-colors cursor-pointer"
                      >
                        {comp.name}
                      </Chip>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Quick start ──────────────────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="space-y-1">
          <Typography variant="headline-medium">Quick start</Typography>
          <Typography variant="body-large" color="surface-variant-foreground">
            Three steps. No config files, no build plugins.
          </Typography>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StepCard
            step={1}
            title="Install"
            code="pnpm add github:XManhTrinh/mui"
          />
          <StepCard
            step={2}
            title="Import theme"
            code={'@import "@vkieu/mui/theme.css";'}
          />
          <StepCard
            step={3}
            title="Use components"
            code={'import { Button } from "@vkieu/mui";'}
          />
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="space-y-6">
        <Typography variant="headline-medium">Built right</Typography>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: "palette",
              title: "Full M3 token system",
              desc: "Every color, elevation, shape, and motion token verified against MDC source files. Light + dark mode via CSS custom properties.",
            },
            {
              icon: "accessibility_new",
              title: "Accessible by default",
              desc: "48dp touch targets, focus-visible rings, ARIA roles and states, roving tabindex, focus trapping, and prefers-reduced-motion support.",
            },
            {
              icon: "swap_horiz",
              title: "RTL ready",
              desc: "Logical CSS properties throughout — inset-inline-start, margin-inline, padding-inline. Components mirror correctly under dir=\"rtl\".",
            },
            {
              icon: "tune",
              title: "Zero config theming",
              desc: "Override CSS custom properties in :root to rebrand. No build step, no config file, no runtime JS. Works with any Tailwind v4 project.",
            },
            {
              icon: "animation",
              title: "M3 Expressive motion",
              desc: "Shape morph on press, spring physics, wavy progress indicators, staggered FAB menus — all respecting prefers-reduced-motion.",
            },
            {
              icon: "account_tree",
              title: "Composable APIs",
              desc: "Compound components with context (Tabs, Sheets, AppBar, NavigationRail). Polymorphic rendering via asChild for links and custom elements.",
            },
          ].map((f) => (
            <Card key={f.title} variant="outlined">
              <CardContent className="flex gap-4">
                <div className="flex items-center justify-center size-10 shrink-0 rounded-full bg-secondary-container">
                  <Icon name={f.icon} size={20} className="text-secondary-container-foreground" />
                </div>
                <div className="space-y-1 min-w-0">
                  <Typography variant="title-small">{f.title}</Typography>
                  <Typography variant="body-small" color="surface-variant-foreground">
                    {f.desc}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <Divider />
      <footer className="flex flex-col items-center gap-2 text-center">
        <Typography variant="body-small" color="surface-variant-foreground">
          Built with ❤️ by{" "}
          <a
            href="https://github.com/XManhTrinh"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            @XManhTrinh
          </a>
        </Typography>
        <Typography variant="label-small" color="surface-variant-foreground">
          MIT License · M3 Expressive · React 18+ · Tailwind CSS v4
        </Typography>
      </footer>
    </div>
  );
}

// ─── Step card ────────────────────────────────────────────────────────────────

function StepCard({
  step,
  title,
  code,
}: {
  step: number;
  title: string;
  code: string;
}) {
  return (
    <Card variant="filled">
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <Badge variant="count" count={step}>
            <div className="size-8" />
          </Badge>
          <Typography variant="title-small">{title}</Typography>
        </div>
        <pre className="overflow-x-auto rounded-lg bg-[hsl(var(--on-surface)/0.05)] px-3 py-2.5 text-[13px] leading-5 text-surface-foreground font-mono">
          {code}
        </pre>
      </CardContent>
    </Card>
  );
}

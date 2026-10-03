# Plan: consumer documentation site

Status: **planned, not started** · 2026-10-03

## Goal

Give teams consuming `@vkieu/mui` a real documentation site: how to install it, theme it, customise it and use every component. Storybook (`apps/docs`) stays the workbench and visual test harness; it is not the consumer docs.

## Decisions

| # | Decision | Value |
|---|---|---|
| 1 | Where the docs live | A dedicated **Next.js App Router site**, `apps/site`, written in MDX (`@next/mdx`) |
| 2 | Why Next.js | It uses the library the way consumers will (server rendering, cookie theming with no flash, `next/font`, App Router routing), so the site doubles as proof of the Next.js support |
| 3 | Output | **Static export** (`output: 'export'`); hosting decided later (any static host: GitHub Pages, Vercel, …) |
| 4 | Props tables | **Generated** from the TSDoc already on every public API (`react-docgen-typescript` at build time), never hand-written, so they can't drift from the code |
| 5 | Examples | Live components rendered on the page, with their source shown next to them (one file per example, imported both as a component and as raw text) |
| 6 | Migration notes | **None.** This is a new library with nothing to migrate from |

## Site structure

```
apps/site
  app/
    layout.tsx               ThemeProvider (cookie storage), Roboto Flex via next/font, NextRouterProvider
    page.tsx                 Home: what the library is, quick start, component gallery
    (docs)/
      layout.tsx             Navigation rail / bar + top app bar with search, theme controls
      getting-started/
      theming/
      motion/
      customisation/
      accessibility/
      nextjs/
      components/[slug]/     One page per component (statically generated)
  content/                   MDX for guides and component pages
  examples/                  One file per live example
  scripts/generate-props.ts  TSDoc → props JSON per component
```

The site is built from the library's own components: navigation rail / flexible navigation bar, top app bar, search bar for the page index, lists, cards, tabs for example source, and a theme / mode / contrast / motion / direction switcher.

## Content

1. **Getting started**
   - Install with Tailwind in Vite and in Next.js (`@import "@vkieu/mui/styles.css"`, `@source`), or without Tailwind (`styles.compiled.css`).
   - Loading Roboto Flex (`next/font`, Google Fonts) and the system-font fallback.
   - Icons: passing Material Symbols SVGs as React elements.
   - Client routing: `RouterProvider` / `NextRouterProvider`.
   - Vite 8 `"use client"` warning filter.
2. **Theming**
   - The six themes × light / dark / system × three contrast levels, with a live switcher.
   - `ThemeProvider` (controlled and uncontrolled, storage options), `useTheme`, `ThemeScope`, `useThemeScope`.
   - Custom themes: `createTheme` at runtime and the `vkieu-mui theme` CLI for static CSS.
   - No theme flash: cookie + `getThemeFromCookies()` (recommended) or `ThemeScript`.
   - Overriding tokens in CSS (`--md-sys-*`), globally or per theme.
3. **Motion**
   - The `expressive` and `standard` schemes; spatial and effects springs at three speeds.
   - Tailwind utilities (`ease-m3-*`, `duration-m3-*`), `useM3Spring` / `getM3Spring`.
   - Reduced motion: what changes.
   - The legacy easing and duration tokens, as part of the motion API.
4. **Customisation**
   - The override levels: tokens → theme → restricted theme list → `ThemeScope` → `className` / `classNames`.
   - Extending the exported variant definitions (`buttonStyles`, …) with `tv`.
   - `cn()` and why consumer classes always win.
   - Layout safety: what consumers can put on any component (`fixed`, `overflow-*`, transforms, …) and the few documented exceptions (overlays, scroll-driven app bars).
5. **Accessibility**
   - WCAG 2.2 AA commitments, 48px touch targets, focus rings.
   - Names the types require (icon buttons, toolbars, lists, sliders, …).
   - Keyboard behaviour per component (a summary table, detailed on each component page).
   - RTL and the DOM-direction behaviour (`DomDirectionLocale`).
6. **Next.js**
   - App Router and Pages Router setup, `"use client"` boundaries, server-safe utilities.
   - `@vkieu/mui/next` helpers.
7. **Components** (about 40 pages), each with:
   - What it is for, and when to use something else.
   - Live examples of its variants, sizes and states.
   - The generated props table (and `classNames` slots).
   - Keyboard and screen-reader behaviour.
   - Where it differs from Compose, condensed from `docs/architecture.md` §9.
   - Pages: Button, IconButton, ButtonGroup, SplitButton, Fab / ExtendedFab, FabMenu, Card, Chips, TextField, Checkbox, RadioGroup, Switch, Slider / RangeSlider, Dialog, Menu, Tooltip, Snackbar, BottomSheet / SideSheet, NavigationRail, NavigationBar, Tabs, TopAppBar, SearchBar / SearchAppBar, Toolbars, List, Carousel, Badge, Divider, Progress indicators, LoadingIndicator, DatePicker / DateRangePicker, TimePicker, PickerDialog, plus the primitives (`@vkieu/mui/primitives`) on one page.

## Build steps

1. **Shell:** scaffold `apps/site` in the workspace and Turborepo (`build`, `typecheck`, `lint`, `test:e2e`), static export, MDX, layout with navigation and theme controls, home page.
2. **Props generation:** `scripts/generate-props.ts` reads the library's TypeScript and writes props JSON per component; a `<PropsTable>` component renders it. Runs before `build` / `dev`.
3. **Guide pages:** getting started, theming, motion, customisation, accessibility, Next.js.
4. **Component pages** in batches (actions; inputs and selection; containment and overlays; navigation; feedback and pickers), committing per batch.
5. **Checks:**
   - Playwright smoke test: every page renders, has no console errors, passes axe, and works in RTL and dark mode.
   - A link checker for internal links.
   - The site's build added to CI.
6. **Records:** a decision row in `docs/architecture.md` (§1, §13 repo layout, §14 quality) and a README link.

## Definition of done

- `pnpm build`, `typecheck`, `lint`, `test` and the site's Playwright suite pass.
- Every public component has a page with live examples and a generated props table.
- The site builds to a static export that opens from any static host.

## Open

- Hosting target (static export works anywhere; pick before the first deploy).
- Whether the site gets its own domain and versioned docs once `@vkieu/mui` is published.

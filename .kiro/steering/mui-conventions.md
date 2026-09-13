---
inclusion: auto
name: MUI Fork Conventions
description: Conventions for the @vkieu/mui Material Design 3 Expressive component library — covers code style, M3 compliance, theming, accessibility, and motion patterns
---

# @vkieu/mui — Component Library Conventions

## What This Is

`@vkieu/mui` is a **production-ready Material Design 3 Expressive component library** for React + Next.js + Tailwind CSS v4. It is a direct, faithful implementation of M3 Expressive — not an approximation. Every token (color, shape, typography, motion, elevation, state layer) must match the official M3 Expressive spec.

The library lives at `/Users/xuan-manh.trinh/workplace/web/mui`. It is consumed by the strata app at `/Users/xuan-manh.trinh/workplace/web/strata` as `@vkieu/mui` (installed from GitHub).

**Key reference files:**
- Audit report with full status: `.kiro/specs/m3-expressive-full-audit/audit-report.md`
- Theme tokens: `src/theme.css`
- Motion constants: `src/lib/motion.ts`
- Barrel exports: `src/index.ts`

**Authoritative M3 Expressive sources (always verify against these):**
- MDC Android: `github.com/material-components/material-components-android/blob/master/docs/components/`
- MDC Web: `github.com/material-components/material-components-web/blob/master/packages/`
- material-web: `github.com/material-components/material-web/blob/main/docs/`
- Angular Material M3 tokens: `github.com/angular/components/blob/main/src/material/`

## Engineering Standards

Work on this library must meet Fellow/VP-level engineering standards:

- **Verify every spec value** against authoritative sources (MDC Android, MDC Web, Angular Material, material-web) before changing token values. Never assume — always check.
- **Production-ready code only** — no shortcuts, no "good enough." Every component must handle all states (hover, focus, press, disabled, error, loading) correctly per M3.
- **Full API surface** — variants, sizes, shadows, colors, theming, typography, animation, accessibility. Nothing half-done.
- **Cross-reference M3 Expressive specifically** — M3 Expressive changed many values from base M3 (e.g., NavigationBar 80dp→64dp, NavigationRail 80dp→96dp, small FAB deprecated, surface FABs deprecated). Always check the Expressive-specific docs.
- **Disabled states must be bulletproof** — no hover, no shadow change, no press, no state layer, cursor-not-allowed, pointer-events-none, M3 opacity (38% content, 12% container).
- **No layout positioning in components** — components never set position/z-index/inset. Consumer's responsibility. Only exception: portal overlays (Dialog, Tooltip, Sheet scrims).
- **Tailwind v4 canonical classes** — use canonical classes over arbitrary values when they exist. Arbitrary values only for M3-specific tokens with no Tailwind equivalent.

## Design Principles

1. **M3 Expressive is the spec** — every token (color, shape, typography, motion, elevation, state layer) must match m3.material.io. When in doubt, reference MDC Web, MDC Android, or Angular Material source code.

2. **No layout positioning** — components NEVER set `position` (fixed/absolute/sticky), `top/right/bottom/left`, `z-index`, or `inset`. Positioning is the consumer's responsibility. Only exceptions: internal implementation details (state layer pseudo-elements) and portal-rendered overlays (Tooltip, Dialog scrim).

3. **className passthrough** — every component accepts `className` and merges via `cn()`. Consumers can always override or extend.

4. **Intrinsic styling only** — components own height, width, padding, border-radius, font, color, shadow — everything that defines *appearance*. Never what position it occupies in the page.

## Code Style

- `"use client"` at top of every interactive component
- `import * as React from "react"` (namespace import, never destructured)
- Section dividers: `// ─── Section Name ──────────` (em-dash lines)
- `displayName` set on every exported component
- `cn()` from `./lib/utils` for class merging
- CVA for components with multiple visual variants; plain `cn()` otherwise
- `React.forwardRef` on leaf components consumers might ref; plain functions for orchestrators

## M3 Tokens

### Colors
All M3 color tokens are CSS custom properties in `theme.css` (`:root` and `.dark`). Use Tailwind utility classes: `bg-primary`, `text-surface-foreground`, `border-outline-variant`, etc.

### Shape Scale (Tailwind v4 mapping)
| M3 Token | dp | Tailwind Class |
|---|---|---|
| corner-none | 0 | `rounded-none` |
| corner-extra-small | 4 | `rounded-sm` |
| corner-small | 8 | `rounded-lg` |
| corner-medium | 12 | `rounded-xl` |
| corner-large | 16 | `rounded-2xl` |
| corner-extra-large | 28 | `rounded-[28px]` |
| corner-full | 9999 | `rounded-full` |

### Typography
15 type scale roles defined in `Typography` component and as `--m3-typescale-*` CSS custom properties. Use specific values in components (e.g., `text-[14px] leading-5 font-medium tracking-[0.1px]` for Label Large).

### Motion
Import from `./lib/motion.ts`:
```ts
import { easing, duration, transition } from "./lib/motion";
```
- CSS transitions: use `duration-200 ease-[cubic-bezier(0.2,0,0,1)]` (M3 standard)
- motion/react animations: use `transition.enterEmphasized` / `transition.exitEmphasized`
- Springs: use `spring.fastSpatial` for small components, `spring.defaultSpatial` for medium

### State Layers
All interactive components use `::before` pseudo-element with `bg-current`:
- Hover: `hover:before:opacity-[0.08]` (8%)
- Focus: `focus-visible:before:opacity-[0.10]` (10%)
- Press: `active:before:opacity-[0.10]` (10%)

### Disabled States
When disabled, a component must:
- `disabled:opacity-[0.38]` (content)
- `disabled:pointer-events-none` (no hover/press/focus)
- `disabled:cursor-not-allowed`
- `disabled:shadow-none` (no elevation)
- `disabled:before:opacity-0!` (no state layer)
- Never show hover effects, shadow changes, or press feedback

## Accessibility

- `role`, `aria-*` attributes per WAI-ARIA APG patterns
- `focus-visible:ring-2 focus-visible:ring-primary` for keyboard focus
- `prefers-reduced-motion` respected (check inline or rely on CSS media query)
- WCAG 1.4.13 for hover/focus content (Dismissible, Hoverable, Persistent)
- 48dp minimum touch targets (wrap in touch-target expander if needed)
- `aria-label` required on icon-only interactive elements

## Exports

- Barrel export from `index.ts`: `import { Button, Dialog, Icon } from "@vkieu/mui"`
- Sub-path exports: `import { Button } from "@vkieu/mui/buttons"`
- Types always exported separately: `export type { ButtonProps } from "./buttons"`
- Motion utilities: `import { easing, duration } from "@vkieu/mui"`

## Development Workflow

### Testing changes in strata

Strata installs `@vkieu/mui` from GitHub as a pinned commit:
```
"@vkieu/mui": "github:XManhTrinh/mui#<commit-hash>"
```

To test MUI fork changes locally in strata **without pushing**, copy modified files to strata's pnpm store:
```bash
STORE="/Users/xuan-manh.trinh/workplace/web/strata/node_modules/.pnpm/@vkieu+mui@https+++codeload.github.com+XManhTrinh+mui+tar.gz+<hash>_<hash>/node_modules/@vkieu/mui/src"
cp /Users/xuan-manh.trinh/workplace/web/mui/src/<file> "$STORE/<file>"
```

Find the exact store path with:
```bash
find /Users/xuan-manh.trinh/workplace/web/strata -path "*/node_modules/@vkieu/mui/src/index.ts" 2>/dev/null
```

Always verify both workspaces compile after changes:
```bash
cd /Users/xuan-manh.trinh/workplace/web/mui && npx tsc --noEmit
cd /Users/xuan-manh.trinh/workplace/web/strata/apps/web && npx tsc --noEmit
```

### To make changes permanent
1. Commit and push the MUI fork
2. Update strata's package.json with the new commit hash
3. Run `pnpm install` in strata

## Remaining Work (as of September 12, 2026)

All systemic and production issues are resolved. The remaining items are **new feature additions**:

### Priority 1 — High Value
- ~~**AppBar**: Add medium flexible + large flexible variants~~ → ✅ Completed (variant="medium" / variant="large", collapseFraction, subtitle, useAppBarCollapse hook)
- ~~**FABMenu → compose FAB**~~ → ✅ Completed (trigger + close buttons now render `<FAB size="l">`; removed duplicated state-layer/elevation/shape-morph styling and the closeButtonColors map)
- ~~**SplitButton → compose Button**~~ → ✅ Completed (shared `button-primitives.ts` extracts `buttonBase` + `buttonVariantColors` + `buttonVariantHoverElevation`; both Button and SplitButton consume them, removing the duplicated segment color/hover-elevation/state-layer/focus/transition blocks. SplitButton keeps its own split geometry + inner-corner morph.)

### Priority 2 — Medium Value
- ~~**Menu**: Add dense variant for data-heavy UIs~~ → ✅ Completed (`<Menu dense>` / `<MenuSub dense>` via MenuDensityContext — 32dp rows, Body Medium labels, 20dp icons, tighter container padding. Flows to MenuItem/MenuHeader/MenuSubTrigger/MenuSubContent automatically.)
- ~~**Search**: Add expanded search view (currently only search bar)~~ → ✅ Completed (`SearchView` compound: portal + scrim + focus trap via Radix Dialog, full-screen on mobile / docked panel sm+, M3 Expressive spring enter. Sub-components: `SearchView.Header` (back button + trailing), `SearchView.Input`, `SearchView.Divider` (visible by default per spec), `SearchView.Content` scroll region. Controlled open/value, reduced-motion aware.)
- ~~**RTL support**: Audit left/right assumptions across all components~~ → ✅ Completed (converted physical directional utilities to logical properties: ml/mr→ms/me, pl/pr→ps/pe, left/right→start/end, rounded-l/r→rounded-s/e, plus inline borderTop{Left,Right}Radius→border{Start,End}{Start,End}Radius in split-button; text-left→text-start in select. Covered buttons, text-field, select, chip, list, snackbar, divider, search, time-picker, carousel, dialog, linear-progress. **Intentionally physical (unchanged):** snackbar named positions (bottom-left/right), side-sheet `side` prop. **Known follow-up:** Slider full RTL needs a coordinated pass — thumb/indicator/stops use inline `left:%` and the clientX→value math is physical, so a partial class swap would desync; linear-progress indeterminate keyframe animation is LTR-designed.)

### Priority 3 — New Variants
- ~~**DatePicker**: Modal variant, date range picker~~ → ✅ Completed (extracted shared CalendarView; added `DatePickerModal` — Radix Dialog portal/scrim/focus, M3 header with supporting text + selected-date headline, Cancel/OK text buttons, staged draft selection committed on OK. Range selection via `mode="range"` + `rangeValue`/`onRangeChange` with secondary-container in-range band, endpoint circles, and hover preview. `DateRange` type exported. Docked `DatePicker` API unchanged.)
- ~~**TimePicker**: Clock dial variant (currently text input only)~~ → ✅ Completed (`variant="dial"` renders the M3 analog clock: 256dp surface-variant face, tappable HH:MM time fields that switch the edited unit, AM/PM for 12h, 24h dual-ring (outer 1–12, inner 13–00), pointer down/drag selection via trig, selector hand + center dot + filled end circle, auto-advance hours→minutes. `variant="input"` (default) unchanged. `TimeValue` type exported.)
- ~~**Carousel**: Multi-browse variant~~ → ✅ Completed (`variant="multi-browse"` — the default M3 strategy: large → medium → small progression. Carousel provides variant + per-item index via context; CarouselItem auto-derives its size from position when `size` is omitted (explicit size still wins). Leading gutter + start snap. `CarouselVariant` type exported.)

See `.kiro/specs/m3-expressive-full-audit/audit-report.md` for the full component-by-component audit.

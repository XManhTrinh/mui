# @vkieu/mui — Architecture Plan

Status: **Agreed, pre-build** · Last updated: 2026-10-01 (rev. 5 — Foundations checks 1–2 resolved)

A production-ready React component library implementing the **latest Material Design 3 Expressive** specification, consumed by many React and Next.js projects.

```tsx
import { Button, Dialog, DialogTrigger, ThemeProvider } from '@vkieu/mui';
```

---

## 1. Decisions

| # | Decision | Value |
|---|---|---|
| 1 | Package name | `@vkieu/mui` (kept deliberately) |
| 2 | React | Latest only (React 19+). `ref` as a normal prop, **no `forwardRef`** |
| 3 | Spec source of truth | **m3.material.io** for design intent; **Jetpack Compose Material 3 token files** for exact values (dp → CSS px 1:1). Material Web is in maintenance mode and will not implement Expressive, so it is *not* a reference |
| 4 | Themes | 6 built-in colour themes × light/dark, generated with `ColorSpec2025` (see §5) |
| 5 | Contrast | Standard, medium and high contrast shipped in v1 |
| 6 | Motion | Two motion schemes, `expressive` (default) and `standard`, independent of colour theme (see §6) |
| 7 | Styling | Tailwind-first. Also ship one precompiled CSS file for non-Tailwind projects |
| 8 | Frameworks | Plain React (Vite etc.) **and** Next.js 15/16 (App Router first, Pages Router supported) |
| 9 | Overrides | Consumers can override at every level (see §8) |
| 10 | Layout safety | Consumer layout classes never break a component (see §10) |
| 11 | Icons | No bundled icon font. Components accept any icon as a React element; docs recommend Material Symbols SVGs |
| 12 | Fonts | Roboto Flex **not bundled**. Documented setup for `next/font` / Google Fonts, system-font fallback |
| 13 | Breakpoints | M3 window size classes added as Tailwind breakpoints alongside Tailwind's defaults (see §7) |
| 14 | Browser baseline | Safari 17.2+, Chrome 113+, Firefox 128+ (needed for `linear()` springs, `@property`, `color-mix()`) |
| 15 | Density | Not in v1 (planned later) |
| 16 | Stability labels | Expressive-only components marked **Preview** in docs while the upstream spec is still experimental in Compose |
| 17 | Licence | **MIT** |
| 18 | Monorepo tooling | **pnpm workspaces + Turborepo** |

## 2. Stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | React 19 + TypeScript strict | |
| Accessibility | **React Aria** (`react-aria` + `react-stately`) | Keyboard, focus, ARIA, RTL, i18n. Exposes pressed/hovered/focus-visible states needed for M3 state layers. Replaces Radix |
| Styling | **Tailwind CSS v4** | `@theme`, `@theme inline`, `@custom-variant`, `@utility`. No `tailwind.config.js` |
| Variants | **tailwind-variants v3** (slots) | Replaces CVA — slots style multi-part components in one call |
| Class merge | `cn()` = tailwind-merge (extended) + clsx | `packages/ui/src/utils/cn.ts`; its token lists are generated from the token source (§4) |
| Motion | **Motion** (`motion/react`) | Spring choreography, enter/exit, layout, morph. `LazyMotion` + `m`. Simple state transitions use CSS `linear()` springs |
| Colour | `@material/material-color-utilities` with **`ColorSpec2025`** | Confirm the npm package exposes the 2025 spec before Foundations; fall back to 2021 spec only if not |
| Shapes | Port of Android `androidx.graphics.shapes` | Feature-matched morph across M3's 35 shapes. Replaces Flubber. Vendored with Apache-2.0 NOTICE |
| Fonts | Roboto Flex (variable: wght, wdth, opsz, GRAD) | Consumer-loaded |
| Repo tooling | pnpm workspaces + Turborepo | Cached builds/tests across packages and apps |

## 3. Composition architecture (DRY)

Four layers. **Dependencies only point downward** — enforced by a lint rule (dependency-cruiser / eslint-plugin-boundaries).

1. **Tokens** — CSS variables for colour, shape, type, motion, elevation, state opacity, z-index.
2. **Primitives** (internal; also exported from `@vkieu/mui/primitives`)
   - `useM3Interaction` — wraps React Aria `usePress` / `useHover` / `useFocusRing` / drag → emits `data-pressed`, `data-hovered`, `data-focus-visible`, `data-dragged`, `data-disabled`, `data-selected`
   - State layer + ripple as **background-layer utilities** on the root (no child elements — see §10), outline-based focus ring, `Elevation`, `Surface`
   - `Overlay` (portal, focus trap, dismiss, scroll lock)
   - `useM3Morph` (shape-library morph driven by Motion `useTransform`)
   - `useM3Spring` (resolves the active motion scheme → Motion spring config)
   - `Field` parts: `Label`, `SupportingText`, `ErrorText`, character counter
3. **Components** — Button, IconButton, FAB, Card, TextField, Checkbox, Radio, Switch… assembled from primitives.
4. **Composites** — built **only from public components** (dogfooding the public API):
   - Button group (connected) = Buttons / IconButtons + group context
   - SplitButton = Button group + Button + IconButton + Menu
   - FAB menu = FAB + Menu-style items
   - Dialog = Overlay + Surface + Buttons
   - Navigation rail (modal expanded) = Overlay + rail items
   - Select / Combobox reuse `Field` parts + Menu list

### Rules
- **Flat named exports** for multi-part components: `Dialog`, `DialogTrigger`, `DialogTitle`, `DialogContent`, `DialogActions`. No dot-notation (`Dialog.Title`) — it breaks in Next.js Server Components.
- **Two API levels**: a convenient "batteries-included" form (`<TextField label="Email" />`) built from exported parts for full control. One implementation, not two.
- **Context cascade**: parents pass shared props to children (`ButtonGroup size="sm"` → Buttons). Child's explicit prop wins.
- **Shared style fragments**: state-layer, focus-ring, disabled styles defined once and reused; never copy class strings.
- Because composites use public components, a theme or `className` override on Button also applies to the Button inside SplitButton.

## 4. Tokens — single source of truth

One token source file (TypeScript) generates **all** of:
- the CSS variables in `styles.css` (`@theme` / `@theme inline`)
- the token lists used by `cn()`'s tailwind-merge config
- the Motion spring configs used by `useM3Spring`

so CSS, class merging and JS motion can never drift apart.

### Shape (corner) scale — spec tokens only
| Token | Value |
|---|---|
| none | 0 |
| extra-small | 4px |
| small | 8px |
| medium | 12px |
| large | 16px |
| large-increased | 20px |
| extra-large | 28px |
| extra-large-increased | 32px |
| extra-extra-large | 48px |
| full | 9999px |

No invented radii (e.g. the earlier `m3-expressive-1` / `m3-expressive-2` are removed). The 35 Expressive *shapes* (cookie, clover, burst, …) are path shapes in the shape library, not radii.

### State layer opacities
hover 8% · focus 10% · pressed 10% · dragged 16% · disabled content 38% · disabled container 12%.

### Typography
Full baseline type scale + Expressive **emphasized** variants for every role (display/headline/title/body/label × large/medium/small).

## 5. Theming

### Token layering
```css
/* Layer 1 — theme sets M3 system tokens */
[data-theme="ocean"][data-mode="dark"] { --md-sys-color-primary: …; }

/* Layer 2 — Tailwind utilities reference them at runtime */
@theme inline { --color-primary: var(--md-sys-color-primary); }
```
- Components use **only semantic M3 roles** (`bg-primary`, `text-on-surface`, `bg-surface-container-high`, …), never raw colours → every component is themed automatically.
- Switching theme = changing attributes on an ancestor. No re-render, SSR-safe.

### Attributes
- `data-theme` — colour theme
- `data-mode` — `light` | `dark` (or system)
- `data-contrast` — `standard` | `medium` | `high`
- `data-motion` — `expressive` | `standard`

### Built-in themes (ColorSpec2025)
| Theme | Seed | Scheme |
|---|---|---|
| `baseline` (default) | `#6750A4` | Tonal spot |
| `ocean` | `#0061A4` | Tonal spot |
| `forest` | `#386A20` | Tonal spot |
| `sunset` | `#A04100` | Tonal spot |
| `rose` | `#9C4146` | Tonal spot |
| `slate` | `#545F71` | Neutral |

Each: light + dark × 3 contrast levels, generated at **build time** into static CSS. Mode follows system preference unless set.

### API
- `<ThemeProvider defaultTheme defaultMode defaultContrast defaultMotion themes>` + `useTheme()` → `{ theme, setTheme, mode, setMode, resolvedMode, contrast, setContrast, motion, setMotion, themes }`. Persists to localStorage/cookie.
- `<ThemeScope theme mode contrast motion>` — theme a subtree; nestable.
- `createTheme({ name, seed, variant, contrast })` — runtime custom theme.
- CLI: `npx @vkieu/mui theme --seed <hex> --name <name>` → static CSS (no flash).

## 6. Motion system (M3 Expressive)

Springs replace duration + easing pairs.

- **Two motion schemes**: `expressive` (visible overshoot/bounce, **default**) and `standard` (restrained, no visible overshoot). Set via `data-motion` / `ThemeProvider` / `ThemeScope`, independent of colour theme.
- **Two spring families**:
  - **Spatial** — position, size, shape, rotation. May overshoot.
  - **Effects** — colour, opacity. Never overshoot (critically damped).
- **Three speeds** each: fast, default, slow.
- Expressive spatial overshoot: fast ≈ 9%, default/slow ≈ 1.5%. Standard spatial: no visible overshoot. Exact damping/stiffness taken from Compose `MotionScheme` tokens (decision #3).
- **Delivery**:
  - CSS: `--md-sys-motion-spring-{spatial|effects}-{fast|default|slow}-{easing|duration}`, easing as `linear()` approximations; values switch with `data-motion`. Utilities like `ease-m3-spatial-fast` read these variables, so they follow the scheme automatically.
  - JS: `useM3Spring('spatial', 'fast')` → Motion `{ type: 'spring', stiffness, damping, mass }` for the active scheme.
- **Reduced motion**: `prefers-reduced-motion` forces `standard` springs and removes non-essential movement (morphs, overshoot).
- Legacy M3 easing/duration tokens kept only for consumers migrating from baseline M3.

## 7. Layout & breakpoints

M3 window size classes as Tailwind custom breakpoints (alongside Tailwind defaults):

| Class | Width | Utility prefix |
|---|---|---|
| Compact | < 600px | default (mobile-first) |
| Medium | 600–839px | `medium:` |
| Expanded | 840–1199px | `expanded:` |
| Large | 1200–1599px | `large:` |
| Extra-large | ≥ 1600px | `xlarge:` |

Adaptive components (Navigation rail ↔ Flexible navigation bar, dialogs ↔ full-screen dialogs, sheets) use these.

## 8. Consumer overrides (broad → narrow)

1. **Tokens via CSS** — globally or per theme:
   ```css
   :root { --md-sys-shape-corner-full: 12px; --md-ref-typeface-brand: "Inter"; }
   [data-theme="ocean"] { --md-sys-color-primary: #0050C8; }
   ```
2. **Brand theme** — `createTheme({ seed })` or the CLI.
3. **Restrict the picker** — `<ThemeProvider themes={['baseline','ocean','acme']}>`.
4. **Subtree** — `<ThemeScope theme="forest" mode="dark">`.
5. **Component** — `className`, `classNames={{ root, label, icon }}` (consumer always wins via `cn()`); exported variant definitions (`buttonStyles`, …) can be extended with new variants.

## 9. Component API conventions

- `variant`, `size`, `className`, `classNames` (per slot), `ref` as prop.
- Controlled + uncontrolled (`value`/`defaultValue`, `open`/`defaultOpen`, `selected`/`defaultSelected`, `onChange`/`onOpenChange`/`onSelectedChange`).
- State exposed as `data-*` attributes for consumer styling.
- Icons passed as React elements (`icon`, `leadingIcon`, `trailingIcon`).
- Accessibility target **WCAG 2.2 AA**: keyboard, visible focus, 48px touch targets (even for XS visuals), `prefers-reduced-motion`, RTL, screen-reader labels required by types where needed (e.g. icon-only buttons require `aria-label`).
- Links (`href`) use client-side routing via React Aria `RouterProvider`.

### Expressive Button family (API fixed from day one)
- **Button**: `variant` = `elevated | filled | tonal | outlined | text`; `size` = `xs | sm | md | lg | xl`; `shape` = `round | square`; `toggle` + `selected`/`defaultSelected` (selected state changes colour and shape); **press morph** — corners animate squarer on press (spatial spring, animated `border-radius` on an inner layer per §10).
- **IconButton**: same `variant`/`size`/`shape`/`toggle`, plus `width` = `narrow | default | wide`.
- **Button group**: `variant` = `standard | connected`; shares `size`/`shape` via context; neighbours react to a pressed button (Expressive width interaction). Connected group replaces the deprecated segmented button.
- **FAB**: `size` = `default | medium | large` (small FAB deprecated); colours per spec; **Extended FAB** `size` = `sm | md | lg`.

## 10. Layout safety (consumer positioning never breaks a component)

**Principle:** a component's internal visuals never depend on the root element's `position`, `overflow`, `display` or `transform`. Consumers may put any layout class on any component — e.g. `<Button className="fixed bottom-4 right-4">` — and it must look and behave the same.

### Failure modes this prevents
- `static` on a root that relied on `relative` → absolutely-positioned state layer escapes and covers the parent/page.
- `overflow-visible` → ripple spills outside rounded corners.
- Motion animating the root's `transform` → fights consumer `translate`/`rotate`/`style.transform`, and turns the component into the containing block for any `fixed` descendant.
- `className` landing on an inner element of a multi-part component → `fixed` moves only part of it.

### Rules
1. **`className` and `style` always go on the outermost element.** Layout utilities apply to the whole component. `style` is merged, never replaced.
2. **State layer and ripple are painted as background layers on the root**, not as absolutely-positioned children: state layer = `linear-gradient` overlay using state colour × state opacity token; ripple = `radial-gradient` animated via registered `@property` custom properties. They follow `border-radius` automatically and need neither `relative` nor `overflow-hidden`.
3. **Unavoidable inner overlays** (FAB morph shape, badges, press-morph layer) live inside a library-owned inner wrapper with its own `relative`/clipping. Consumer classes go on the outer element.
4. **Motion never animates the root's `transform`.** Springs, press-scale and morph run on inner layers.
5. **Containers never trap `fixed` children.** Card, Dialog content, Sheet etc. never put `transform`, `filter`, `backdrop-filter`, `contain` or `will-change: transform` on their root.
6. **Focus ring = CSS `outline` (+ `outline-offset`)**, so `overflow-hidden`, `fixed` or clipping ancestors can't hide it.
7. **Layout-neutral roots**: no outer margins, no own `z-index`, no own positioning. Overlays portal to `body` with a z-index token scale (`--md-sys-z-*`) consumers can override.
8. **`cn()` conflict resolution** guarantees the consumer's layout class wins whenever the library does set a conflicting one.

### Verification
An **override matrix** in CI: every component rendered with `fixed`, `absolute`, `sticky`, `static`, `overflow-hidden`, `overflow-visible`, `w-full`, a transform, inside a transformed ancestor, and in RTL — Playwright visual snapshots plus interaction checks.

## 11. Next.js support

- Next.js 15/16, App Router primary, Pages Router supported; Turbopack + webpack.
- `"use client"` preserved at the top of every interactive component file in the build; utilities (`cn`, tokens, `createTheme`) are server-safe.
- No `window`/`document` access at module load; overlays portal only on the client.
- **No theme flash**:
  - Cookie (recommended): `getThemeFromCookies()` from `@vkieu/mui/next` → render `<html data-theme data-mode data-contrast data-motion>` on the server.
  - Script: `<ThemeScript />` in `<head>` for static/exported sites (`suppressHydrationWarning` on `<html>`).
- `<NextRouterProvider>` — one-line client routing integration.
- Roboto Flex via `next/font`, wired to `--md-ref-typeface-*`.
- No `transpilePackages` needed (ships compiled ESM).

## 12. Package & install

### Exports
- `@vkieu/mui` — components, ThemeProvider, hooks, `cn`
- `@vkieu/mui/primitives` — building blocks
- `@vkieu/mui/next` — Next.js helpers
- `@vkieu/mui/styles.css` — tokens + themes for Tailwind projects
- `@vkieu/mui/styles.compiled.css` — precompiled for non-Tailwind projects
- ESM + `.d.ts`, `sideEffects: ["*.css"]`, modules preserved for tree-shaking.

### Install (Tailwind project / Next.js)
```bash
npm i @vkieu/mui motion
```
```css
/* globals.css */
@import "tailwindcss";
@import "@vkieu/mui/styles.css";
@source "../node_modules/@vkieu/mui";
```
```tsx
// app/layout.tsx
<ThemeProvider defaultTheme="baseline">{children}</ThemeProvider>
```
Plus font setup (Roboto Flex via `next/font` or Google Fonts) — documented, not bundled.

## 13. Repo layout (pnpm workspaces + Turborepo)

```
CLAUDE.md
docs/architecture.md   # this file
pnpm-workspace.yaml
turbo.json
packages/ui            # @vkieu/mui (MIT)
apps/docs              # Storybook
apps/next-playground   # Next.js App Router test app
```

## 14. Quality

- Vitest + Testing Library (unit/behaviour)
- axe accessibility checks per component
- Playwright visual regression: every component × 6 themes × light/dark (+ contrast levels on key components) × both motion schemes where relevant
- Layout-safety override matrix (§10)
- Next playground build + Playwright in CI
- Changesets for versioning/changelog

## 15. Component roadmap (M3 Expressive set)

- **Tier 1**: Button, IconButton, **Button group** (standard + connected), FAB + Extended FAB, Card, TextField, Checkbox, Radio, Switch, Dialog, Menu (Expressive: standard + vibrant colours, grouped items with gaps, selected state)
- **Tier 2**: Split button, **FAB menu**, Chips, Tabs, **Navigation rail** (collapsed / expanded / modal expanded), **Flexible navigation bar**, Snackbar, Tooltip, **Loading indicator** (shape morph), Progress indicators (linear + circular, wavy, with stop indicator)
- **Tier 3**: **Toolbars** (floating + docked), Flexible app bars + search app bar, Slider (XS–XL, vertical, centred, range, inset icons), Expressive lists (segmented/grouped), Carousel (incl. vertical), Bottom/side sheets, Date & time pickers, Badges, Dividers, Search

Build order: Foundations (token source, 6 themes × modes × contrast, motion schemes, ThemeProvider, `cn`, primitives) → Tier 1 → Tier 2 → Tier 3.

### Not built (deprecated in M3 Expressive)
| Deprecated | Replaced by |
|---|---|
| Navigation drawer | Navigation rail (expanded / modal expanded) |
| Original navigation bar | Flexible navigation bar |
| Small FAB | FAB sizes default / medium / large |
| Segmented button | Connected button group |
| Bottom app bar | Docked toolbar |
| Indeterminate circular progress | Loading indicator |

## 16. Licences & attribution

- `@vkieu/mui` — **MIT**
- Roboto Flex — SIL OFL 1.1 (consumer-loaded)
- Material Symbols — Apache-2.0 (recommended, not bundled)
- Vendored androidx.graphics.shapes port — Apache-2.0, ship `NOTICE`
- Material Design guidelines/tokens — Google, referenced per decision #3

## 17. Open checks before / during Foundations

- ✅ **`ColorSpec2025` confirmed** (2026-10-01): `@material/material-color-utilities@0.4.0` exposes `SpecVersion = '2021' | '2025'` via the scheme constructors (`new SchemeTonalSpot(hct, isDark, contrast, '2025')`). 2025 applies to Tonal spot, Neutral, Vibrant and Expressive (other variants fall back to 2021), which covers all six built-in themes. **Caveat:** 0.4.0's published ESM has extensionless relative imports (`'../dynamiccolor/dynamic_scheme'`), so plain Node ESM fails to load it. The build-time theme generator and the CLI must run through a bundler (esbuild/tsup/Vite). Browser consumers are unaffected because their bundlers resolve these imports.
- ✅ **Compose tokens pulled** (2026-10-01, androidx `120345129e`, `compose/material3/material3/src/commonMain/.../tokens/`). Shape scale (§4) and state opacities match. Springs (Compose `dampingRatio` / `stiffness`, mass 1; Motion `damping` = 2·ratio·√stiffness):

  | Scheme | Spatial fast | Spatial default | Spatial slow | Effects fast / default / slow |
  |---|---|---|---|---|
  | expressive | 0.6 / 800 | 0.8 / 380 | 0.8 / 200 | 1.0 / 3800 · 1600 · 800 |
  | standard | 0.9 / 1400 | 0.9 / 700 | 0.9 / 300 | 1.0 / 3800 · 1600 · 800 |

  Overshoot: expressive spatial 9.5% fast, 1.5% default/slow; standard spatial 0.15%; effects 0%. This matches §6.
- Open spec gaps: `FabMediumTokens` / `ExtendedFabMediumTokens` have `ContainerShape` commented out in Compose (comment says `CornerLargeIncreased`, 20px). `LargeIconButtonTokens` has `Uniform` spacing instead of `Default`. Confirm both against m3.material.io before building FAB / IconButton.
- `@vkieu` npm scope must be owned before publishing.

## 18. Related

- Closest existing project: `m3-expressive-react` (CSS Modules, early stage). No mature Tailwind-based M3 Expressive library exists.

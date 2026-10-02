# @vkieu/mui — Architecture Plan

Status: **Tier 1 in progress** (Button, IconButton, ButtonGroup, FAB, Card, TextField, Checkbox, Radio and Switch done; Dialog and Menu remain; shape library port pending, see §17) · Last updated: 2026-10-02 (rev. 13 — selection controls)

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
| 19 | Toolchain | Node 24 (`.nvmrc`), pnpm 12 (`packageManager`), **TypeScript 6.0**: TS 7 is out, but typescript-eslint only supports TS < 6.1, so type-aware linting pins 6.0 |
| 20 | Library build | **tsdown** in unbundle mode (one output file per module, so per-file `"use client"` survives). `scripts/check-dist.ts` verifies directives, extensions and paths after every build |
| 21 | Colour library | `@material/material-color-utilities` is a devDependency **bundled into `dist/vendor/`** (Apache-2.0 notice in `NOTICE`), because its published ESM cannot be loaded by plain Node (§17) |

## 2. Stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | React 19 + TypeScript strict | |
| Accessibility | **React Aria** (`react-aria` + `react-stately`) | Keyboard, focus, ARIA, RTL, i18n. Exposes pressed/hovered/focus-visible states needed for M3 state layers. Replaces Radix |
| Styling | **Tailwind CSS v4** | `@theme`, `@theme inline`, `@custom-variant`, `@utility`. No `tailwind.config.js` |
| Variants | **tailwind-variants v3** (slots) | Replaces CVA — slots style multi-part components in one call |
| Class merge | `cn()` = tailwind-merge (extended) + clsx | `packages/ui/src/utils/cn.ts`; its token lists are generated from the token source (§4) |
| Motion | **Motion** (`motion/react`) | Spring choreography, enter/exit, layout, morph. `LazyMotion` + `m`. Simple state transitions use CSS `linear()` springs |
| Colour | `@material/material-color-utilities` 0.4.0 with **`ColorSpec2025`** | Vendored into the build (decision #21) |
| Shapes | Port of Android `androidx.graphics.shapes` | Feature-matched morph across M3's 35 shapes. Replaces Flubber. Vendored with Apache-2.0 NOTICE |
| Fonts | Roboto Flex (variable: wght, wdth, opsz, GRAD) | Consumer-loaded |
| Repo tooling | pnpm workspaces + Turborepo | Cached builds/tests across packages and apps |

## 3. Composition architecture (DRY)

Four layers. **Dependencies only point downward**, enforced by `eslint-plugin-boundaries` in `eslint.config.js`. In source, the layers are `src/tokens` → `src/utils` → `src/theme` / `src/motion` → `src/primitives` → `src/components` → `src/composites`. Composites may not import `src/primitives`.

1. **Tokens** — CSS variables for colour, shape, type, motion, elevation, state opacity, z-index.
2. **Primitives** (internal; also exported from `@vkieu/mui/primitives`)
   - `useM3Interaction` — wraps React Aria `usePress` / `useHover` / `useFocusRing` / drag → emits `data-pressed`, `data-hovered`, `data-focus-visible`, `data-dragged`, `data-disabled`, `data-selected`. Pass `isPressed` from another React Aria hook (e.g. `useButton`) to skip its own press handling. It also sets the ripple origin (`--m3-ripple-x/y/size`) on pointer-down or Enter/Space.
   - `ButtonBase` — unstyled button behaviour shared by every button-like component: `<button>`, link (`href`, via `useLink`) or toggle (`toggle`, via `useToggleButton`), with `useM3Interaction` applied. `children` may be a function of `{ isSelected }`. Button, IconButton and later FAB / chips render it and only add styling.
   - `TouchTarget` — 48×48px hit area for small controls, placed in the inner wrapper.
   - State layer + ripple as **background-layer utilities** on the root (no child elements — see §10): `state-layer`, plus `focus-ring` / `focus-ring-inset` (outline). `Surface` (`container` role + `elevation` 0–5 + `shape`) covers elevation; there is no separate `Elevation` component.
   - `Overlay`: portal to `body` that **re-applies the theme attributes of where it was rendered**, so overlays opened inside a `ThemeScope` keep its theme. Dismissal, focus containment and scroll lock come from the React Aria overlay hooks (`useModalOverlay`, `usePopover`, …) used by each component.
   - `useM3Morph` (shape-library morph driven by Motion `useTransform`)
   - `useM3Spring` (resolves the active motion scheme → Motion spring config)
   - `Field` parts: `FieldLabel`, `SupportingText`, `ErrorText`, `CharacterCounter`
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

In practice the source is `packages/ui/src/tokens/*.ts`. `pnpm generate` writes `src/styles/generated/{tokens,themes,theme}.css`; those files are gitignored and Turborepo regenerates them before build, typecheck, lint and test. `cn()` and `useM3Spring` import the token objects directly.

Tailwind utility names:

| Token | Utilities |
|---|---|
| Colour roles | `bg-primary`, `text-on-surface`, `border-outline-variant`, … |
| Type scale | `text-<role>` sets size, line height, tracking and weight (`text-body-large`, `text-label-large-emphasized`); typeface via `font-brand` / `font-plain` |
| Corners | `rounded-corner-<name>` (`rounded-corner-full`, `rounded-corner-medium`, …) |
| Elevation | `shadow-elevation-0` … `shadow-elevation-5` |
| Springs | `ease-m3-<family>-<speed>` and `duration-m3-<family>-<speed>`; legacy curves are `ease-m3-emphasized`, … |
| Variants | `medium:` / `expanded:` / `large:` / `xlarge:`; `dark:` follows `data-mode` (including `system`); `motion-standard:` |

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
- `<ThemeProvider defaultTheme defaultMode defaultContrast defaultMotion themes>` + `useTheme()` → `{ theme, setTheme, mode, setMode, resolvedMode, contrast, setContrast, motion, setMotion, themes }`.
  - Each dimension can also be controlled: `theme` + `onThemeChange`, and likewise for the others.
  - `storage`: `"cookie"` (default), `"local-storage"` or `"none"`. The key is `vkieu-mui-theme` (`storageKey`) and the value is URL-encoded `theme=…&mode=…&contrast=…&motion=…`.
  - The stored value is read with `useSyncExternalStore`, so there's no hydration mismatch or extra render.
  - `applyToDocument={false}` stops it from writing to `<html>`.
  - `createTheme()` results passed in `themes` are injected as hoisted React 19 `<style precedence>` tags.
- `<ThemeScope theme mode contrast motion>` — theme a subtree; nestable. It writes all four attributes, inheriting the ones you don't set, and adds `text-on-surface`, which `className` can override. `useThemeScope()` reads the effective state.
- Attribute fallbacks: a missing `data-contrast` behaves as `standard`, a missing `data-mode` as `light`, and a root without `data-theme` gets `baseline`.
- `createTheme({ name, seed, variant, contrast })` — runtime custom theme. `contrast` takes one level or a list (default: all three).
- CLI: `npx @vkieu/mui theme --seed <hex> --name <name> [--variant] [--contrast] [--out]` → static CSS (no flash). The bin is `vkieu-mui`.

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
- **Button** (built): `variant` = `elevated | filled | tonal | outlined | text`; `size` = `xs | sm | md | lg | xl`; `shape` = `round | square`; `toggle` + `selected`/`defaultSelected`/`onSelectedChange` (selected state changes colour and shape); **press morph** — corners animate squarer on press. Also `leadingIcon` / `trailingIcon`, `href` (renders `<a>` via React Aria `useLink`), `disabled`, `classNames` slots `root | content | label | icon`, and `ButtonContext` so a parent (button group) can cascade `variant` / `size` / `shape` / `disabled`.
  - **Values come from what Compose's `Button.kt` / `ToggleButton.kt` actually use**, which in places overrides their token files: text buttons use `primary` (the token file says `on-surface-variant`, flagged by a Compose TODO); XS padding is 12px with a 4px icon gap; small toggle buttons press to a 6px corner. Label type: `label-large` (XS, S), `title-medium` (M), `headline-small` (L), `headline-large` (XL).
  - **Press morph** is a CSS `border-radius` transition on the root (border-radius is not a transform, so §10 rule 4 holds). It uses the **effects default** spring, which never bounces, matching Compose. Toggle buttons use the **fast spatial** spring, which does bounce. Full corners are capped at half the container height (`min(var(--md-sys-shape-corner-full), h/2)`) so the transition interpolates smoothly.
  - **Toggle shape:** selected round buttons become square, as Compose does. Selected square buttons become round, which follows m3.material.io; Compose only ships round toggles. Text buttons have no toggle form, which the types enforce.
  - **Disabled:** container `on-surface` 10% and content `on-surface-variant` 38% for every variant (the Expressive token files). Compose's older `FilledTonalButtonTokens` (12%, `on-surface`) are not used.
  - **Touch targets:** XS and S get a 48px `TouchTarget` inside the library-owned inner wrapper. Layout height stays 32 / 40px.
- **IconButton** (built): `variant` = `standard | filled | tonal | outlined` (Compose's icon button variants: no elevated or text); same `size` / `shape` / `toggle`, plus `width` = `narrow | default | wide`, `icon`, an optional `selectedIcon` for toggles, and `href`.
  - **Name required by the types:** either `aria-label` or `aria-labelledby`.
  - **Width** = icon size + leading + trailing space. Compose's `Uniform` option is the default width, which resolves the `LargeIconButtonTokens` naming gap. In px (narrow / default / wide): XS 28/32/40, S 32/40/52, M 48/56/72, L 64/96/128, XL 104/136/184. Icons are 20/24/24/32/40px.
  - **Colour:** standard and outlined icon buttons **inherit the surrounding text colour**, like Compose's `LocalContentColor`. The outlined border is drawn in that colour, and disabled is that colour at 38%. Filled and tonal use their tokens, with disabled container `on-surface` 10% and icon `on-surface` 38%. Compose's "vibrant" colours (token `on-surface-variant` / `outline-variant`, used by toolbars) are left for the Toolbar work.
  - **Selected toggles:** standard turns `primary`, filled `primary`/`on-primary` (unselected `surface-container`), tonal `secondary`/`on-secondary`, and outlined `inverse-surface`/`inverse-on-surface` with no border. Shape swaps round ↔ square (Compose tokens). Every icon button morph, toggles included, uses the non-bouncing effects spring, as Compose does.
  - Reads `size` / `shape` / `disabled` from `ButtonContext`, but not `variant`, because the variant sets differ.
- **Colour note:** the 2025 colour spec makes `inverse-on-surface` noticeably muted (baseline light `#a09ba1` on `#0f0d12`, about 7:1 contrast). Selected outlined buttons and icon buttons look greyer than the 2021 palette did. That's correct, not a bug.
- **Button group** (built, `ButtonGroup`, a composite): `variant` = `standard | connected`; shares `size` / `shape` / `disabled` and `buttonVariant` (Buttons only) through `ButtonContext`, and the child's own props win.
  - **Press expansion:** neighbours react to a pressed button (Compose `ButtonGroup`). The pressed item grows by `expandedRatio` (0.15) of its width, and its neighbours shrink by the same amount. Each neighbour gives up at most its compression limit, which is half the space around its content (Compose: the item's end padding). Middle items split the growth across both sides, so the group's total width stays constant.
  - **How it works on the web:** the group watches its children's public `data-pressed` attribute (a MutationObserver), pins their `flex-basis` to the measured width, and animates it on the fast spatial spring (added to `container-motion`). While pinned, `min-width` is 0 (Compose forces exact widths too). Inline styles are removed once the release settles, so consumer sizing such as `flex-1` applies again. `expandedRatio={0}` turns it off.
  - **Connected:** 2px gap. Outer corners stay full, inner corners are small (8px) and extra-small (4px) when pressed, and selected buttons become fully round. These are logical corners, so they mirror in RTL. Children get `connected` = `leading | middle | trailing` through a per-child `ButtonContext` provider; Button and IconButton apply it in their recipes, and it replaces their normal shape classes.
  - **Selection:** `selectionMode` = `none | single | multiple` with `selectedKeys` / `defaultSelectedKeys` / `onSelectionChange` / `disallowEmptySelection`. Toggle buttons with a `value` join the group's React Aria toggle-group state (`ToggleGroupStateContext`, read by `ButtonBase`). Single selection renders as a `radiogroup` of `radio`s. React Aria keeps every option tabbable and adds arrow-key movement. No-op changes that React Stately reports (same keys) are not passed to `onSelectionChange`.
  - **Spec gaps:** Compose only has *Small* tokens for groups (standard gap 12px; connected gap 2px, inner corners 8/4px). They are used at every size until per-size values are published. The Compose **overflow menu** is deferred until Menu exists.
  - Children must be direct elements (each is wrapped in its own context provider).
- **FAB** (built, `Fab` + `ExtendedFab`): `Fab` `size` = `default | medium | large` (56 / 80 / 96px; small FAB deprecated); `ExtendedFab` `size` = `sm | md | lg` (56 / 80 / 96px tall).
  - **Shared:** `color`, `lowered` and `href`.
  - **Shapes and icons follow Compose's code:** corners are large (16px) / large-increased (20px) / extra-large (28px). Compose's code uses `LargeIncreased` for medium FABs, which **resolves the §17 gap**. Icons are 24 / 28 / 36px; the large icon is 36px, because Compose marks the 32px token incorrect.
  - **Extended FAB:** padding 16 / 26 / 28px; icon gap 8 / 12 / 16px (Compose overrides the medium and large token gaps); label `title-medium` / `title-large` / `headline-small`.
  - **Elevation:** level 3, hover 4; `lowered` is level 1, hover 2. There's no press morph, and no `disabled` (FABs have none in M3; the types enforce it).
  - **Colour styles:** `primary-container` (default), `secondary-container`, `tertiary-container`, `primary`, `secondary`, `tertiary`, each a role + on-role pair. Compose only ships tokens for the first two; the other four follow m3.material.io's colour styles.
  - **`expanded` (Extended FAB):** collapses to an icon-only square. The label sits in a CSS grid column that transitions between `0fr` and `1fr`, so the FAB's natural width animates without JavaScript or transforms. It expands on the fast spatial + default effects springs and collapses on default spatial + fast effects, as Compose does. The label stays in the accessible name while collapsed.
  - **Deferred:** Compose's show/hide (`animateFloatingActionButton`, scale to 0.2 + fade) scales the whole FAB, which conflicts with §10 rule 4. It needs its own design, likely a wrapper element the consumer positions.

### Card (built)
- `variant` = `filled | elevated | outlined` (default `filled`, as Compose's `Card`). All have 12px corners and `on-surface` content: filled is `surface-container-highest`, elevated is `surface-container-low` at level 1, outlined is `surface` with a 1px `outline-variant` border.
- **Clipping:** cards clip content to their corners (`overflow-hidden`, as Compose clips), so media gets rounded edges; `overflow-visible` turns it off. They're `flex flex-col` with no padding, and content sets its own.
- **Three forms:**
  - **Static** (`<div>`).
  - **Pressable** (`onPress`): renders `<div role="button">` through `ButtonBase`'s new `elementType: 'div'`, because a `<button>` may only contain phrasing content and cards hold headings, media and blocks.
  - **Link** (`href`, `<a>`).
- **Interactive cards** fill their container's width (`w-full`), get state layers and the focus ring, and should be named with `aria-labelledby` (their headline). In development they warn if they contain buttons, links or fields, since interactive content can't nest; use a static card with its own actions instead.
- **Elevation and disabled state follow Compose's code:** filled rises 0→1 on hover, elevated 1→2, dragged 3 / 4 / 3. Outlined cards **don't rise on hover**: the code keeps hover, focus and press at the default level although the token says level 1. Disabled colours are Compose's composites, done with `color-mix`: filled `surface-variant` 38% over its container, elevated `surface`, the outlined border `outline` 12% over `surface-container-low`. Content is `on-surface` 38%.
- No anatomy sub-components (headline, media, actions) in v1. Compose doesn't ship them, and layout utilities cover them.

### TextField (built)
- `variant` = `filled | outlined`, a floating `label`, `supportingText`, `errorMessage` / `invalid` / `validate` (React Aria `useTextField`), `required` (visual `*`, `aria-required`), `disabled`, `readOnly`, `leadingIcon`, `trailingIcon` (may be an `IconButton`), `prefix`, `suffix`, `maxLength` with a `count/max` counter, and `multiline` (`<textarea>` that grows from `rows` up to `maxRows`, then scrolls). It's controlled or uncontrolled through `value` / `defaultValue` / `onChange(value)`.
- **Naming:** a `label` **or** `aria-label` / `aria-labelledby` is required by the types.
- **Where props go:** `ref`, `className`, `style` and `data-*` go on the root; `inputRef` and every other attribute go to the input.
- **Values from Compose** (`TextFieldImpl.kt` + tokens):
  - 56px minimum height, 280px default width (`max-w-full`).
  - 16px padding; next to an icon it drops to 4px, because icons sit in 48px boxes.
  - Filled with a label: 8px padding, label floated 8px from the top. 4px above supporting text, 2px around affixes.
  - Filled has `surface-container-highest` with an `on-surface-variant` indicator (2px `primary` on focus). Outlined has a 1px `outline` border, 2px `primary` on focus, and the label centred on the border at 16px inside a notch with 4px padding.
  - With a leading icon, an outlined label moves from after the icon to 16px when it floats, while a filled label stays aligned with the text.
  - Hovered labels stay `on-surface-variant` on filled fields and darken to `on-surface` on outlined ones. Error-hover switches to `on-error-container`.
  - The label floats on the fast spatial spring and recolours on fast effects.
- **One state:** colours follow a single computed `data-field-state` (`disabled > error-focus > error-hover > error > focus > hover > rest`), so the styles of each part never compete on CSS order. `data-focused` / `data-hovered` / `data-invalid` / `data-disabled` / `data-floated` are exposed too.
- **Floating label:** an absolutely positioned `<label>` that transitions `top`, `inset-inline-start` and the type-scale properties, so it needs no transforms and mirrors in RTL. It also floats for browser autofill (`:has(:autofill)`), since autofilled values are hidden from JavaScript until the user interacts.
- **Outlined notch:** a hidden `fieldset`/`legend` carrying the label text, so the gap matches the label exactly. The outline is shifted up 8px only when there is a label.
- **Errors:** the error message replaces the supporting text visually, but the supporting text stays in the accessible description (`sr-only`).
- With a label, the placeholder, prefix and suffix appear only once the label floats (Compose).
- Pressing the container focuses the input (not when pressing an icon button).
- **Not in v1:** composable TextField parts (the doc's "two API levels"); only the batteries-included form is exported, built from the Field primitives.

### Selection controls (built: Checkbox, RadioGroup + Radio, Switch)
- **Shared anatomy:** the `SelectionControl` primitive + `selectionControlStyles`.
  - A root `<label>` (`ref`, `className`, `style`, `data-*`) with a visually hidden native input (`inputRef`) from React Aria (`useCheckbox` / `useRadio` / `useSwitch`), so forms, labels and assistive tech work natively.
  - A control holding the focus ring and a 48px touch target, and the label text (`text-body-large`).
  - `kind: 'circle'` (Checkbox, Radio) makes the control the 40px state-layer circle: `on-surface` unselected, `primary` selected, inverted while pressed, `error` when invalid (M3 spec; this token set has no state-layer colours).
  - `kind: 'track'` (Switch) makes the control the track, with a state layer that follows the thumb.
  - The types require a label or an accessible name. Selection is `selected` / `defaultSelected` / `onSelectedChange` (Checkbox, Switch) or the group's `value` / `defaultValue` / `onChange` (RadioGroup).
- **Checkbox:** Compose's **M3 styling**, i.e. `ComposeMaterial3Flags.isCheckboxStylingFixEnabled = true`. Compose defaults that flag to false, which keeps M2 styling.
  - Geometry: an 18px box with 2px corners and a 2px outline; check path (0.25, 0.5) → (0.4, 0.65) → (0.75, 0.3), 2px square cap.
  - Motion: the check draws on default spatial and snaps away 100ms after unchecking; the box fills on default effects and empties on fast effects.
  - `indeterminate` draws a dash path. **Deviation:** Compose morphs the check into the dash, but CSS can't animate a path shape in Safari, so the dash draws on its own.
  - Error uses `error` / `on-error`. Disabled checked is `on-surface` 38% with a `surface` check.
- **Radio:** a 20px ring (2px). The dot is 10px and grows on fast spatial; colour changes on default effects.
  - The unselected ring darkens to `on-surface` on hover, focus and press. Disabled is `on-surface` 38%, which also overrides the selected colour (stacked variant).
  - M3 radios have **no error colour**; an invalid `RadioGroup` shows its error text.
  - `RadioGroup` provides the state, arrow keys, label (`text-title-small`), supporting/error text and orientation. A `Radio` outside a group throws.
- **Switch:** a 52×32px track (2px outline).
  - Thumb geometry is computed like Compose's `ThumbNode`: 16px off, 24px on or with an icon, 28px pressed, centred 16 / 36px from the start. It's passed as `--m3-thumb-size` / `--m3-thumb-center`, so no CSS state selectors compete.
  - Pressing snaps the thumb; release animates `width` / `height` / `top` / `inset-inline-start` on fast spatial. Mirrors in RTL.
  - Hover, focus and press change the thumb to `on-surface-variant` (off) / `primary-container` (on). Disabled colours are Compose's composites over `surface` (`color-mix`).
  - `icons` shows the default check / close icons; `selectedIcon` / `unselectedIcon` override them. The focus ring surrounds the track.
- **No CheckboxGroup** in v1. Compose has none, and a fieldset of Checkboxes with `name` covers forms.
- `splitDataAttributes` (utils) routes `data-*` to the root for components whose remaining props go to a React Aria hook (TextField, the selection controls). Those hooks forward only the attributes they know, so consumer `data-*` attributes were being dropped.

## 10. Layout safety (consumer positioning never breaks a component)

**Principle:** a component's internal visuals never depend on the root element's `position`, `overflow`, `display` or `transform`. Consumers may put any layout class on any component — e.g. `<Button className="fixed bottom-4 right-4">` — and it must look and behave the same.

### Failure modes this prevents
- `static` on a root that relied on `relative` → absolutely-positioned state layer escapes and covers the parent/page.
- `overflow-visible` → ripple spills outside rounded corners.
- Motion animating the root's `transform` → fights consumer `translate`/`rotate`/`style.transform`, and turns the component into the containing block for any `fixed` descendant.
- `className` landing on an inner element of a multi-part component → `fixed` moves only part of it.

### Rules
1. **`className` and `style` always go on the outermost element.** Layout utilities apply to the whole component. `style` is merged, never replaced.
2. **State layer and ripple are painted as background layers on the root**, not as absolutely-positioned children: state layer = `linear-gradient` overlay using state colour × state opacity token; ripple = `radial-gradient` animated via registered `@property` custom properties. They follow `border-radius` automatically and need neither `relative` nor `overflow-hidden`. Components add their own transitions (corners, colours, elevation) through the `--m3-transition-{property,duration,easing,delay}` lists, which the `container-motion` utility fills. Setting `transition-*` directly would cancel the state layer's transitions.
3. **Unavoidable inner overlays** (FAB morph shape, badges, touch targets) live inside a library-owned inner wrapper with its own `relative`/clipping. Consumer classes go on the outer element.
4. **Motion never animates the root's `transform`.** Springs, press-scale and morph run on inner layers.
5. **Containers never trap `fixed` children.** Card, Dialog content, Sheet etc. never put `transform`, `filter`, `backdrop-filter`, `contain` or `will-change: transform` on their root.
6. **Focus ring = CSS `outline` (+ `outline-offset`)**, so `overflow-hidden`, `fixed` or clipping ancestors can't hide it.
7. **Layout-neutral roots**: no outer margins, no own `z-index`, no own positioning. Overlays portal to `body` with a z-index token scale (`--md-sys-z-*`) consumers can override.
8. **`cn()` conflict resolution** guarantees the consumer's layout class wins whenever the library does set a conflicting one.

### Verification
An **override matrix** in CI: every component rendered with `fixed`, `absolute`, `sticky`, `static`, `overflow-hidden`, `overflow-visible`, `w-full`, a transform, inside a transformed ancestor, and in RTL — Playwright visual snapshots plus interaction checks. Each component gets a `LayoutOverride` story (`apps/docs`) and a Playwright test that checks layout size, the background state layer, corner radius, the absence of positioned children, pressing and the keyboard focus ring for every combination.

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
apps/docs              # Storybook 10 (theme/mode/contrast/motion/direction toolbars) + Playwright visual tests
apps/next-playground   # Next.js App Router + Pages Router test app, Playwright e2e (pnpm test:e2e)
```

## 14. Quality

- Vitest + Testing Library (unit/behaviour)
- axe accessibility checks per component
- Playwright visual regression: every component × 6 themes × light/dark (+ contrast levels on key components) × both motion schemes where relevant
  - Screenshots are taken against the static Storybook build (`pnpm test:e2e`), with the font loaded locally (`@fontsource-variable/roboto-flex`) so results don't depend on the network.
  - Baselines are platform-specific (`*-darwin.png` today). CI has to render them in a pinned container image and commit that platform's baselines.
  - Every class a `tv` recipe can emit is checked to appear literally in its source and to compile in Tailwind. A class assembled at runtime would never be generated.
  - **Screenshot tolerance:** `maxDiffPixelRatio` is 0.0002 (0.02%). At 0.2%, a moved hairline (FAB collapse width, TextField outline offset) still matched an outdated baseline. Re-baseline deliberately after visual changes and review the images.
  - **Storybook server:** the static build is served with `sirv --dev`, which reads files per request, so a server reused across rebuilds never returns 404s for new asset hashes.
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
- ✅ Spec gaps resolved: medium FABs use `LargeIncreased` (20px) in Compose's code (§9). `LargeIconButtonTokens` `Uniform` is the default width (§9).
- `@vkieu` npm scope must be owned before publishing.

### Remaining Foundations work
- **Shape library port + `useM3Morph`** (`androidx.graphics.shapes`, 35 shapes, feature-matched morph). It is not started. Nothing in Tier 1 needs it, since the Button press morph animates `border-radius`. The Loading indicator and FAB menu (Tier 2) do, so it has to land before Tier 2.
- **Vite 8 directive warnings:** Vite 8 (rolldown) logs `MODULE_LEVEL_DIRECTIVE` for every `"use client"` file when a client-only app bundles the library. The warnings are harmless. The `build.rolldownOptions.onLog` filter is in `packages/ui/README.md` and `apps/docs/.storybook/main.ts`.
- **Stylesheet size:** the six themes × three contrast levels × light/dark/system are about 120 KB unminified, most of the shipped CSS. If that matters to consumers, a later option is to split medium/high contrast into opt-in files.

## 18. Related

- Closest existing project: `m3-expressive-react` (CSS Modules, early stage). No mature Tailwind-based M3 Expressive library exists.

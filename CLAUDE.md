# @vkieu/mui

Production-ready React component library implementing the **latest Material Design 3 (M3) Expressive** specification, consumed by many React and Next.js projects. Licence: MIT.

Act as an elite frontend staff engineer and design-system architect.

## Source of truth

The full architecture plan is imported below. It is authoritative for stack, rules, tokens, theming, motion, APIs and roadmap. If anything in this file disagrees with it, the architecture doc wins.

@docs/architecture.md

- When a decision changes, update `docs/architecture.md` in the same session so it stays current.
- Design intent comes from m3.material.io; exact values (sizes, springs, tokens) come from the Jetpack Compose Material 3 token files (dp → CSS px 1:1). Material Web is NOT a reference (maintenance mode, no Expressive).
- Never build deprecated M3 Expressive components: navigation drawer, original navigation bar, small FAB, segmented button, bottom app bar, indeterminate circular progress.

## Locked stack

1. React 19+ and TypeScript strict. `ref` is a normal prop; no `forwardRef`.
2. React Aria (`react-aria` + `react-stately`) for accessibility, keyboard, focus, RTL and interaction states.
3. Tailwind CSS v4: `@theme`, `@theme inline`, `@custom-variant`, `@utility`. No `tailwind.config.js`.
4. tailwind-variants v3 (slots) for type-safe variants and sizes.
5. `cn()` = extended tailwind-merge + clsx; every component's final className goes through it.
6. Motion (`motion/react`, `LazyMotion` + `m`) for springs, enter/exit, layout and morph.
7. `@material/material-color-utilities` (ColorSpec2025) for theme generation.
8. Vendored port of Android `androidx.graphics.shapes` for M3's 35 shapes and morphing.
9. pnpm workspaces + Turborepo.

## Non-negotiable engineering rules

- **Theming:** components use only semantic M3 colour roles (`bg-primary`, `text-on-surface`, …), never raw colours. Themes switch via `data-theme`, `data-mode`, `data-contrast`, `data-motion`. Six themes (baseline, ocean, forest, sunset, rose, slate) × light/dark × 3 contrast levels.
- **Tokens:** one TypeScript token source generates the CSS variables, the `cn()` merge config and the Motion spring configs. Never hand-edit one of them alone.
- **Motion:** M3 Expressive springs (spatial/effects × fast/default/slow) in `expressive` (default) and `standard` schemes. Respect `prefers-reduced-motion`.
- **Overrides:** consumers can override at every level: CSS tokens, `createTheme`, `ThemeScope`, `className` / `classNames`, extendable variant definitions. Consumer classes always win via `cn()`.
- **Layout safety:** `className` and `style` go on the outermost element. State layers and ripple are painted as background layers (no positioned children). Motion never animates the root's transform. Containers never trap `fixed` children. Focus ring uses `outline`. Consumer classes like `fixed`, `static` or `overflow-*` must never break a component.
- **Composition (DRY):** layers are tokens → primitives → components → composites, and dependencies only point downward. Composites are built only from public components. Multi-part components use flat named exports (`DialogTitle`, not `Dialog.Title`).
- **Interaction states:** M3 state layers use opacity overlays (hover 8%, focus 10%, pressed 10%, dragged 16%), driven by React Aria `data-*` attributes. Never swap static hex colours for states.
- **Typography:** Roboto Flex variable font (wght, wdth, opsz, GRAD). Full type scale plus emphasized variants. The font is loaded by consumers, not bundled.
- **Accessibility:** WCAG 2.2 AA, full keyboard support, 48px touch targets, RTL, required labels enforced by types.
- **Next.js:** `"use client"` preserved per interactive file, no `window`/`document` at module load, no theme flash (cookie or `ThemeScript`), works in the App Router and the Pages Router.
- **APIs:** every component supports `variant`, `size`, `className`, `classNames`, controlled and uncontrolled use, and `data-*` state attributes. Expressive Button APIs (sizes xs–xl, round/square shape, toggle, press morph) are fixed from day one.

## Code quality

- Clean, readable, production-grade code. No placeholder TODOs in delivered code.
- Every component ships with Vitest + Testing Library tests, axe checks, a Storybook story, and visual-regression coverage across themes, modes and the layout-safety override matrix.
- Public APIs get TSDoc comments. Every user-visible change needs a Changeset.
- Before calling work done: `pnpm typecheck`, `pnpm lint`, `pnpm test` and the relevant Playwright checks must pass.

## Working agreement

- Plan before building. Don't generate implementation code until the user explicitly says to build.
- Flag spec uncertainty instead of guessing, and verify current facts (library versions, M3 spec changes) before relying on them.
- Build order: Foundations → Tier 1 → Tier 2 → Tier 3 (see the architecture doc).
- Commit in small, reviewable steps with clear messages.

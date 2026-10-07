# Plan: Skeleton (`@vkieu/mui/vk`)

Status: **built and merged (584c7f4), 2026-10-07**

## Goal

A placeholder that shows the shape of content while it loads, so a page keeps its layout (no layout shift) and people can see what is coming. The first consumer is the VKIEU home page, whose content rows stream in from the server one by one.

M3 has no skeleton component: its loading components are the progress indicators and the Expressive `LoadingIndicator`. So `Skeleton` is a **`vk` component** (architecture decision #22). It is built to the same bar as the M3 components: it follows the M3 colour roles, shape scale, motion tokens and accessibility rules, and every theme, mode, contrast level and motion scheme.

## When to use which

| Use | When |
|---|---|
| `Skeleton` | The layout of the coming content is known (cards, list rows, text), and the content replaces the placeholder in place |
| `LoadingIndicator` (M3 Expressive) | A short wait where the shape isn't known, or a whole region or page is loading, or as a pull-to-refresh or button-level wait |
| `LinearProgressIndicator` / `CircularProgressIndicator` | Progress that can be measured (uploads, steps) |

The docs page states this, so consumers don't use a skeleton where M3 expects a loading indicator.

## Decisions

| # | Decision | Value |
|---|---|---|
| 1 | Where | `packages/ui/src/vk/skeleton/`, exported from `@vkieu/mui/vk` |
| 2 | Parts | `Skeleton` (one placeholder shape) and `SkeletonGroup` (the loading region that names it and runs one shared animation) |
| 3 | Rendering | **Pure CSS, a server component (no `"use client"`, no JS animation).** It must animate inside a React Suspense fallback streamed from the server, which stays static HTML until its content arrives and so never runs JS (found in VKIEU: a JS-driven indicator in a streamed fallback stays frozen) |
| 4 | Colour | Semantic roles only: `surface-container-highest` by default, so it reads on `surface` and `surface-container-low`; a `tone` of `highest` (reads on every surface up to `surface-container`) or `high` (a subtler fill for `surface` and `surface-container-low`). Follows all six themes × light/dark × three contrast levels with no extra work |
| 5 | Shape | The M3 shape scale (`corner` = `none` … `extra-large`, `full`), measured on the visible bar: a text line is drawn inside padding, so the padding is added back to its radius. Defaults: `small` for rectangles, `extra-small` for text lines (gently rounded, not pills; Mike, 2026-10-08), `full` for circles |
| 6 | Text lines | `variant="text"` takes a type-scale role (`typescale="body-medium"`, …) so each line is as tall as that role's line height with the glyph-height bar centred inside it, and `lines={n}` stacks lines with the last at 60% width, so a text skeleton is the same height as the text it stands for |
| 7 | Motion | `animation` = `pulse` (default) \| `shimmer` \| `none` (Mike, 2026-10-07: support both). **Pulse** fades the placeholder's opacity with M3 duration and easing tokens. **Shimmer** sweeps a highlight across it: an `on-surface` overlay at the M3 hover state-layer opacity (8%), so it follows every theme and mode, moving from the start edge to the end edge (mirrored in right-to-left). `SkeletonGroup` sets the animation for all its placeholders, so a region moves together; a `Skeleton` can override it |
| 8 | Reduced motion | Static under `prefers-reduced-motion: reduce`, for both animations. The `standard` motion scheme keeps the animation: it is a calmer scheme, not reduced motion |
| 9 | Accessibility | Placeholders are `aria-hidden`. `SkeletonGroup` requires a `label` by type (like other components' required names) and renders it once as visually hidden status text, with `aria-busy="true"` on the region, so a screen reader hears "Loading businesses" once, not every bar |
| 10 | Forced colours | In Windows high-contrast mode backgrounds disappear, so each placeholder gets a 1px `CanvasText` outline there and stays visible |
| 11 | Layout safety | `className` and `style` on the outermost element; no positioned children; the animation changes opacity only, never the root's transform; consumer `w-*`, `h-*` and `aspect-*` win through `cn()` |
| 12 | API conventions | `variant`, `className`, `classNames`, `data-*` state attributes and TSDoc that says it isn't an M3 component, like the other `vk` components |

## API

```tsx
import { Skeleton, SkeletonGroup } from '@vkieu/mui/vk';

<SkeletonGroup label="Loading businesses" className="grid grid-cols-4 gap-4">
  {cards.map((key) => (
    <div key={key} className="flex flex-col gap-3">
      <Skeleton className="h-28" corner="medium" />
      <Skeleton variant="text" typescale="title-medium" className="w-3/4" />
      <Skeleton variant="text" typescale="body-medium" lines={2} />
    </div>
  ))}
</SkeletonGroup>
```

- **`Skeleton`:** `variant` = `rectangle` (default) | `text` | `circle`; `corner` (shape scale); `typescale` and `lines` for `text`; `tone` = `highest` (default) | `high`; `animation` to override the group's; `className`, `classNames` (`root`, `line`), `style`.
- **`SkeletonGroup`:** `label` (required), `animation` = `pulse` (default) | `shimmer` | `none`, `as` (`div`, `section`, `ul`, `li`), `className`, `classNames` (`root`, `label`). Exposes `data-animation`.
- A `Skeleton` outside a group still renders and pulses on its own; the docs recommend the group.

## Files

```
packages/ui/src/vk/skeleton/
  Skeleton.tsx                 Skeleton and SkeletonGroup
  skeleton-styles.ts           tailwind-variants slots (variant, corner, tone, typescale)
  skeleton-styles.test.ts
  Skeleton.test.tsx            rendering, ARIA, required label, classNames, overrides, axe
packages/ui/src/styles/        keyframes and the reduced-motion rule, from the token source
apps/docs/stories/Skeleton.stories.tsx
apps/site/                     component page, examples, generated props table, "when to use which"
.changeset/                    minor: adds Skeleton to @vkieu/mui/vk
```

## Tests and checks

- **Unit (Vitest and Testing Library):** variants and corners map to the right tokens; text lines match each typescale role's line height; `lines` and the 60% last line; placeholders are `aria-hidden`; the group renders its label once with `aria-busy`; `className` and `classNames` win; `cn()` lets `w-*` and `h-*` override.
- **No client code:** a test fails if a skeleton file gains `"use client"` or a hook, so it keeps working in streamed fallbacks.
- **Axe** in every story, light and dark.
- **Visual regression** across the six themes × light/dark × three contrast levels, both motion schemes (animation paused for screenshots), right-to-left, forced colours, and the layout-safety override matrix.
- **Next.js:** a check in `apps/next-playground` that a skeleton inside a streamed Suspense fallback animates before hydration.
- `pnpm typecheck`, `pnpm lint`, `pnpm test` and the Playwright checks pass.

## Rollout

1. Build in this repo on a branch, with a changeset. Mike approves.
2. Merge to `main`, then bump VKIEU's pinned commit and its `allowBuilds` key.
3. In VKIEU, the home rows' loading state becomes skeleton cards in the row's place, streamed as the Suspense fallback (no client code needed), replacing the current indicator workaround.

## Questions for Mike

1. ~~**Home rows in VKIEU:** skeleton cards or the loading indicator?~~ **Skeleton cards** (Mike, 2026-10-07). The morphing `LoadingIndicator` stays for waits where the layout isn't known.
2. ~~**Pulse only, or a shimmer option too?**~~ **Both** (Mike, 2026-10-07), pulse by default.

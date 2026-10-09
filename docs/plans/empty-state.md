# Plan: EmptyState (`@vkieu/mui/vk`)

Status: **proposed, waiting for Mike's approval** (2026-10-10)

## Goal

A designed state for a region with nothing to show: no posts yet, no photos, no search results, a section that's coming soon, or a list that couldn't load. It replaces a blank area or a raw message with an icon, a short title, one line of help and, when there's a next step, an action.

VKIEU is the first consumer. Its profile and home page already hand-build the same block four times (no posts, no photos, the home feed, empty home rows), and every new screen needs one (VKIEU's rule: a designed state for loading, empty, error and success).

M3 describes empty states as a pattern but has no component for them, so `EmptyState` is a **`vk` component** (architecture decision #22). It's built only from M3 pieces: colour roles, the type scale, the shape scale and the Expressive shapes, the motion tokens, and the public `Card` and `Button`.

## Name

`EmptyState`, the common name for this pattern (Shopify Polaris and Atlassian name their components the same, and Material's guidance calls the pattern "empty states"). It also covers "no results" and "couldn't load" with the `error` tone, because those are the same layout with different words. VKIEU's full-page states (not found, server error) stay screens, not this component.

## When to use which

| Use | When |
|---|---|
| `EmptyState` | A region or list has no content yet, a filter or search found nothing, a section isn't available yet, or loading failed and can be retried |
| `Skeleton` | Content is loading and its layout is known |
| `LoadingIndicator` | A short wait where the layout isn't known |
| `Snackbar` | Brief feedback about an action, not about a region's content |
| Inline helper or error text | A form field's problem |

## Decisions

| # | Decision | Value |
|---|---|---|
| 1 | Where | `packages/ui/src/vk/empty-state/`, exported from `@vkieu/mui/vk` |
| 2 | Anatomy | An **icon** in a coloured **container shape**, a **title**, an optional **description**, and optional **actions**, centred in a column. Text is at most 448px wide so lines stay readable |
| 3 | `variant` (M3 card variants) | `plain` (default: no container, for a page or a region that's already a surface), or `filled`, `elevated`, `outlined`, which wrap it in the public `Card` with the same variant, so it matches the cards around it |
| 4 | `size` | `sm`, `md` (default), `lg`, following the type scale and spacing tokens: **sm** for inside a list or small card (40px icon container with a 24px icon, `title-small`, `body-small`, 16px padding); **md** for a section or column (56px with 28px, `title-medium`, `body-medium`, 48px vertical padding); **lg** for a whole page area (96px with 48px, `headline-small`, `body-large`, 64px vertical padding) |
| 5 | `tone` (M3 colour roles for the icon container) | `secondary` (default, `secondary-container` / `on-secondary-container`), `primary`, `tertiary`, `neutral` (`surface-container-highest` / `on-surface-variant`) and `error` (`error-container` / `on-error-container`) for "couldn't load". Title is `on-surface`, description `on-surface-variant`. Every theme, mode and contrast level follows |
| 6 | `shape` (M3 shapes) | `circle` (default), or any of the 35 M3 Expressive shapes by name (`Cookie9Sided`, `Sunny`, `Clover4Leaf`, …), drawn as a CSS mask that scales with the container. The mask helper `Avatar` uses moves to a shared shapes utility, so both use one implementation |
| 7 | Actions | An `actions` slot for up to two `Button`s, laid out in a row (a column on narrow widths). The docs recommend one `filled` or `tonal` primary action at most, with a `text` second action, so the empty state never competes with the page's main action |
| 8 | Semantics | A plain region of text: the title is a `<p>` by default, or a heading with `titleAs="h2"`/`"h3"` when the empty state is the only content of a section. The icon is decorative (`aria-hidden`). `role="status"` is opt-in (`announce`) for an empty state that replaces a list after a search or filter, so screen readers hear "No results" without a page reload |
| 9 | Motion | It appears with the M3 **effects** spring (opacity only, so the root's transform never animates). With reduced motion it appears at once. Pure CSS, no JavaScript |
| 10 | Server rendering | A server component (no `"use client"`): it renders in streamed Suspense fallbacks and on static pages. With a `Card` variant, `Card` brings its own client boundary |
| 11 | Forced colours | The icon container keeps a visible `CanvasText` border, and the icon uses `CanvasText` |
| 12 | Right-to-left | Centred, so nothing mirrors except the actions row order |
| 13 | API conventions | `className` and `style` on the outermost element; `classNames` for the slots (`root`, `media`, `icon`, `title`, `description`, `actions`); `data-variant`, `data-size` and `data-tone` attributes; extendable `emptyStateStyles` (tailwind-variants); TSDoc that says it isn't an M3 component |
| 14 | Later, if needed | An illustration slot instead of the icon (for first-run onboarding), and a compact horizontal layout for table rows |

## API

```tsx
import { EmptyState } from '@vkieu/mui/vk';

// A profile with no posts: in a card, like the posts around it.
<EmptyState
  variant="filled"
  icon={<DynamicFeedIcon />}
  title="No posts yet"
  description="When Lan posts, you'll see it here."
/>

// The owner's own profile: with the next step.
<EmptyState
  variant="filled"
  icon={<DynamicFeedIcon />}
  title="No posts yet"
  description="Posts you share will appear here."
  actions={<Button variant="tonal">Create a post</Button>}
/>

// A list that couldn't load.
<EmptyState
  tone="error"
  size="sm"
  icon={<CloudOffIcon />}
  title="Couldn't load this list"
  actions={<Button variant="tonal" onPress={retry}>Try again</Button>}
/>

// Search with no results, announced to screen readers.
<EmptyState announce shape="Cookie9Sided" icon={<SearchOffIcon />} title="No results for “phở”" />
```

## Files

```
packages/ui/src/vk/empty-state/
  EmptyState.tsx               the component (server component)
  empty-state-styles.ts        tailwind-variants slots: variant × size × tone
  EmptyState.test.tsx          rendering, slots, semantics and variants
packages/ui/src/shapes/mask.ts the Expressive shape mask, shared with Avatar
apps/docs/stories/EmptyState.stories.tsx, apps/docs/e2e/empty-state.spec.ts
apps/site/                     page, playground, examples, catalog entry (Feedback,
                               with Snackbar and Skeleton) with search keywords (empty, no results,
                               blank, zero state, nothing here, placeholder, error state),
                               side nav, components listing and the component count
.changeset/                    minor: adds EmptyState to @vkieu/mui/vk
```

## Tests and checks

- **Unit:**
  - every variant renders the matching `Card` variant, or no container for `plain`;
  - each size uses its type roles, icon container size and padding;
  - each tone uses its container and content roles;
  - an Expressive `shape` applies the mask, and `circle` doesn't;
  - `titleAs` renders a heading, `announce` adds `role="status"`, the icon is hidden from assistive tech;
  - `className` and `classNames` win over the defaults through `cn()`.
- **Axe** in every story, light and dark.
- **Visual regression** across the six themes × light/dark × three contrast levels: every variant, size and tone, an Expressive shape, with one and two actions, at phone and desktop widths, right-to-left and forced colours.
- **Reduced motion:** no transition with `prefers-reduced-motion`.
- **Next.js:** renders in a server component and inside a Suspense fallback.
- **Avatar** still passes its tests after its mask moves to the shared utility.
- `pnpm typecheck`, `pnpm lint`, `pnpm test` and the Playwright checks pass.

## In VKIEU, once it's built

The profile's no posts and no photos cards and the home page's feed box and empty rows become `<EmptyState variant="filled" …>`, with VKIEU's card colour passed through `className` (`cardSurface`), and the profile's private `EmptyStateCard` is removed.

## Questions for Mike

1. **Name:** `EmptyState` (recommended), covering empty, no results and couldn't load.
2. **Defaults:** `variant="plain"`, `size="md"`, `tone="secondary"` and `shape="circle"`, so VKIEU passes `variant="filled"` where it wants a card. Or should the default be `filled`?
3. **Expressive shapes:** allow any of the 35 M3 shapes for the icon container (recommended, shared with `Avatar`), or keep it to a circle?

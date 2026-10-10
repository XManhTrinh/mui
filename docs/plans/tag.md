# Plan: Tag (`@vkieu/mui/vk`)

Status: **proposed, waiting for Mike's approval** (2026-10-10)

## Goal

A small, non-interactive label that names a state or a category of the thing it sits beside: "Draft", "Sold", "Featured", "Open now", "Full-time", "Verified", or the "M3E" and "VK" labels in this library's own docs navigation.

M3 has no such component. Its **chips** are all interactive (assist, filter, input, suggestion: each is a button), and its **badge** is a 6px dot or a short count anchored to an icon. Using a chip for a label would make it focusable and announce it as a button; a disabled chip would read as "unavailable". So `Tag` is a **`vk` component** (architecture decision #22), built only from M3 pieces: colour roles, the type scale, the shape scale, and its own component tokens.

First consumers: the docs site's `PageChips` (Expressive / M3E and VK, in the side navigation and the gallery) and VKIEU's "Draft" label on legal pages; then listing, job and business statuses in VKIEU.

## Name

`Tag`, the common name for this pattern (Atlassian, Carbon and Ant Design call it a tag; Polaris and Primer call it a badge, which M3 already uses for counts). `TagGroup` holds several.

## When to use which

| Use | When |
|---|---|
| `Tag` | A short, static word about the item beside it: a status, a category, a quality. It never does anything when pressed |
| `Badge` | A count or a dot on an icon or avatar: unread messages, new activity |
| `AssistChip` / `SuggestionChip` | The label is an action or a suggestion the person can press |
| `FilterChip` | The label filters a list and can be turned on and off |
| `InputChip` | The label is a value the person entered and can remove |

## Anatomy

```
╭───────────────────╮
│ ● ⓘ  Open now     │   container · dot or leading icon · label
╰───────────────────╯
```

- **Container:** colour from `variant` × `tone`, height and corners from `size` and `shape`.
- **Dot** (optional, `dot`): a 6px circle in the tone's strong colour, for live status ("Open now", "Online").
- **Leading icon** (optional, `icon`): sized by `size`, decorative. A tag has a dot or an icon, not both.
- **Label:** one line, `label-*` type role by `size`, truncated with an ellipsis at `maxWidth` when set.

## Decisions

| # | Decision | Value |
|---|---|---|
| 1 | Where | `packages/ui/src/vk/tag/`, exported from `@vkieu/mui/vk` |
| 2 | Parts | `Tag` (one label) and `TagGroup` (several, as a list) |
| 3 | `variant` | `tonal` (default: the tone's container role and on-container content), `filled` (the tone's role and on-role content, for strong emphasis such as "Sold"), `outlined` (no container; a 1px border and content in the tone's colour, the quietest) |
| 4 | `tone` (M3 colour roles) | `neutral` (default), `primary`, `secondary`, `tertiary`, `error`. M3 has no success or warning roles, so consumers add their own through the component tokens (decision 9), as VKIEU does for its green "Open now" |
| 5 | `size` | `sm` (20px, `label-small`, 14px icon, 6px side padding), `md` (default, 24px, `label-medium`, 16px icon, 8px), `lg` (32px, `label-large`, 18px icon, 12px). `lg` matches a chip's height, so a tag can sit in a row of chips without looking interactive (it has no border state layer, no hover, no focus) |
| 6 | `shape` | `full` (default, a pill) or `rounded`: the shape scale by size, `extra-small` (4px) for `sm`, `small` (8px) for `md` and `lg`, matching the chips' corners |
| 7 | Short form | `fullLabel`: the visible label is short ("M3E"), screen readers hear `fullLabel` ("Expressive") instead, and a pointer shows it as the native `title`. The visible text is `aria-hidden` and `fullLabel` is visually hidden text, so it reads the same in every screen reader |
| 8 | Semantics | A `<span>`, never focusable and with no role: it's plain text in the reading order. `TagGroup` is a `<ul>` of `<li>`s with an optional `aria-label` ("Listing status"), so screen readers say how many there are |
| 9 | Tokens | **Component tokens as CSS variables**, read by every part so consumers can retheme one tag, a subtree or the whole app without new variants: `--vk-tag-container`, `--vk-tag-content`, `--vk-tag-outline`, `--vk-tag-dot`, `--vk-tag-height`, `--vk-tag-padding-inline`, `--vk-tag-gap`, `--vk-tag-icon-size`, `--vk-tag-corner`. Each defaults to the value its variant, tone, size and shape set. **A typed token source**, `tagTokens` in `tag-tokens.ts`: per size (height, padding, gap, icon size, type role, rounded corner) and per variant × tone (container, content, outline and dot roles). The styles are written from it (every class literal, so Tailwind finds it), and a test checks that each style matches its token, so the two can't drift |
| 10 | `maxWidth` | Optional: the label truncates with an ellipsis, and the full text goes to `title`, so long categories never break a layout |
| 11 | Disabled look | None: a tag isn't interactive. To show something is unavailable, use the `neutral` tone and the words |
| 12 | High contrast and forced colours | The contrast levels strengthen the roles automatically. In forced colours, every variant gets a 1px `CanvasText` border and `CanvasText` content, so filled and tonal tags stay visible when backgrounds are removed |
| 13 | Right-to-left | The dot and icon sit at the start and mirror; the label doesn't |
| 14 | Motion | None at rest. If `variant`, `tone` or the label changes (a listing goes from "Available" to "Sold"), colours ease on the default effects spring; not at all under reduced motion |
| 15 | Server rendering | A server component (no `"use client"`, no hooks), so it renders in static pages and streamed fallbacks |
| 16 | API conventions | `className` and `style` on the root, `classNames` for `root`, `dot`, `icon`, `label`; `data-variant`, `data-tone`, `data-size`, `data-shape`; extendable `tagStyles` (tailwind-variants); TSDoc that says it isn't an M3 component and when to use a chip or a badge instead |

## API

```tsx
import { Tag, TagGroup } from '@vkieu/mui/vk';

<Tag>Draft</Tag>                                          // tonal, neutral, md, pill
<Tag tone="error" variant="filled">Sold</Tag>
<Tag tone="tertiary" icon={<StarIcon />}>Featured</Tag>
<Tag dot className="[--vk-tag-dot:var(--vk-success)]">Open now</Tag>
<Tag size="sm" tone="tertiary" fullLabel="Expressive">M3E</Tag>
<Tag variant="outlined" shape="rounded" maxWidth="12rem">Vietnamese groceries</Tag>

<TagGroup aria-label="Job details">
  <Tag>Full-time</Tag>
  <Tag>On site</Tag>
  <Tag tone="primary">£12–14 an hour</Tag>
</TagGroup>
```

## Files

```
packages/ui/src/vk/tag/
  Tag.tsx, TagGroup.tsx        components (server components)
  tag-tokens.ts                typed component tokens (sizes; variant × tone roles)
  tag-styles.ts                tailwind-variants slots written from the tokens
  Tag.test.tsx, tag-tokens.test.ts
apps/docs/stories/Tag.stories.tsx, apps/docs/e2e/tag.spec.ts
apps/site/                     page (with a "Tag, Badge or Chip?" section), examples
                               (statuses, sizes × variants × tones, dots and icons, short
                               forms, a group, custom tones with tokens), playground,
                               catalog entry (Containment, with Badge), search keywords (tag,
                               label, status, pill, lozenge, category), side nav, listing,
                               component count; PageChips replaced by Tag
.changeset/                    minor: adds Tag and TagGroup to @vkieu/mui/vk
```

## Tests and checks

- **Unit:**
  - every variant × tone uses its roles; every size its height, padding, type role and icon size; both shapes their corners;
  - `tagStyles` matches `tagTokens` for every size, variant and tone;
  - the component tokens override each part (container, content, outline, dot, height, corner);
  - `fullLabel` hides the short text from assistive technology and reads the full one, and sets `title`;
  - `maxWidth` truncates and sets `title`;
  - `TagGroup` renders a list with its label; a tag has no role and isn't focusable;
  - `className` and `classNames` win through `cn()`.
- **Axe** in every story, light and dark; **contrast** of content on container for every variant × tone × theme × mode × contrast level, at least 4.5:1 (a test computes it from the generated roles).
- **Visual regression** across the six themes × light/dark × three contrast levels: the variant × tone grid, the sizes, both shapes, dots and icons, a long truncated label, a group, right-to-left and forced colours.
- **Layout safety** (architecture §10): the override matrix keeps the tag's height, corners and unpositioned internals.
- **Reduced motion:** no colour transition.
- **Next.js:** renders in a server component and inside a Suspense fallback.
- `pnpm typecheck`, `pnpm lint`, `pnpm test` and the Playwright checks pass.

## In VKIEU, once it's built

The legal page's "Draft" label becomes `<Tag tone="tertiary">`. VKIEU defines `--vk-success` and `--vk-warning` (next to its avatar colours, with a contrast test) for statuses M3 has no role for, and uses them through the tag's tokens.

## Questions for Mike

1. **Name:** `Tag` and `TagGroup`.
2. **Defaults:** `tonal`, `neutral`, `md`, pill (`full`).
3. **Tones:** M3's roles only (neutral, primary, secondary, tertiary, error), with success and warning added by consumers through tokens (recommended, so the library never invents colours M3 doesn't have). Or should the library ship `success` and `warning` tones with its own generated colours?

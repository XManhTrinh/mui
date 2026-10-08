# Plan: Avatar and AvatarGroup (`@vkieu/mui/vk`)

Status: **built and merged (90f2b65), 2026-10-08; badge, placement and colour-slot changes on `feat/vk-avatar-badges`**

## Goal

One avatar for every person and business in apps built on the library: profiles, posts, comments, chat, lists, chips, search, staff in bookings, team members. VKIEU will use it on most screens, so it must be fast, server-rendered, accessible and consistent everywhere, and it must slot into the M3 components that already take an avatar.

M3 has no avatar component; it uses avatars inside other components (the input chip's 24px avatar, list items' 40px leading avatar, the search bar's trailing avatar). So `Avatar` is a **`vk` component** (decision #22), designed to M3's colour roles, shapes, type scale and motion.

## Compared with shadcn/ui

shadcn's avatar (Radix) is `Avatar` + `AvatarImage` + `AvatarFallback`: it shows the fallback until the image has loaded, which needs client JS, so a server-rendered page first shows initials and then swaps to the photo. This plan keeps the same composable idea and improves on it:

| | shadcn/ui | This plan |
|---|---|---|
| Image loading | JS loading state; fallback shown until hydration and load | The image and the fallback are stacked with CSS, so the photo shows on the server-rendered page as soon as it loads, with or without JS. On an error, the image hides and the fallback shows |
| Fallback | Whatever you pass | Initials from the name (Unicode-aware, so "Ứng", "Đức" and "Nguyễn Văn An" work), else a person icon or the `icon` you pass |
| Colour | One neutral colour | A stable colour per name from the theme's container roles, so the same person always has the same colour, in every theme and mode |
| Sizes | Free-form | Named sizes matching M3 slots (24 chip, 32, 40 list, 56, 72, 96 profile), plus free sizing by class |
| Shape | Circle | A circle by default, a rounded square, or any of the 35 M3 Expressive shapes, chosen with `shape` |
| Status | None | Presence and verified badges, built on the M3 `Badge` |
| Groups | None (hand-built with negative margins) | `AvatarGroup` with overlap, a maximum, a "+N" overflow and one accessible name |
| Interaction | None | Optional link or button form with the M3 state layer, focus ring and a 48px touch target |

## Decisions

| # | Decision | Value |
|---|---|---|
| 1 | Where | `packages/ui/src/vk/avatar/`, exported from `@vkieu/mui/vk` |
| 2 | Parts | `Avatar` (one person or business), `AvatarGroup` (several), and `getInitials` (the helper the fallback uses, exported for consumers) |
| 3 | Rendering | A server component by default (no `"use client"`). The image and fallback sit in one CSS grid cell, image on top, so no positioned children (layout safety). Only the error handling and the interactive form are client code |
| 4 | Image | `src`, `srcSet`, `sizes`, `alt`; `loading="lazy"` and `decoding="async"` by default; an `image` slot takes any element instead (for example `next/image`), so apps keep their image optimisation |
| 5 | Fallback order | Image → initials from `name` → `icon` (a person icon by default) |
| 6 | Initials | `getInitials(name, locale)`: the first letters of the first and last words, split by grapheme (`Intl.Segmenter`) so diacritics stay attached ("Đỗ Ứng" → "ĐỨ"), upper-cased for the locale, one letter for one word. An `initials` prop overrides it |
| 7 | Colour | `tone` = `auto` (default) hashes `name` into one of **12 colour slots**, each a CSS variable pair (`--vk-avatar-tone-N` / `--vk-avatar-on-tone-N`) that takes any colour; by default the slots cycle through `primary-container`, `secondary-container`, `tertiary-container` and `surface-container-highest` with their `on-*` text, so an app adds colours without code (Mike, 2026-10-08). Or a fixed tone. Tailwind classes on the parts (`classNames.visual`) win too |
| 8 | Sizes | `size` = `xs` 24 · `sm` 32 · `md` 40 (default) · `lg` 56 · `xl` 72 · `2xl` 96, each with a type-scale role for the initials (from `label-small` to `headline-medium`). Consumer `size-*` classes still win through `cn()` |
| 9 | Shape | `shape` = `circle` (default) \| `rounded` (shape-scale corner, scaled with size) \| any of the 35 M3 Expressive shapes (a CSS mask, so it scales). No other prop changes the shape (Mike, 2026-10-08: `kind` removed, the shape is chosen only with `shape`). `avatarShapes` lists them all |
| 10 | Badges | `presence` = `online` \| `away` \| `offline`, and `badge`: any icon or short content with a required `badgeLabel` for the accessible name (Mike, 2026-10-08: replaces `verified`, which is an app meaning). `presencePlacement` (default `bottom-end`) and `badgePlacement` (default `top-end`) take any logical corner, mirrored in right-to-left. Drawn in the avatar's grid cell (no positioned children), raised with `z-1` above the photo and overlapping neighbours. Colours default to M3 roles and are CSS variables (`--vk-avatar-online`, `--vk-avatar-away`, `--vk-avatar-offline`, `--vk-avatar-badge`, `--vk-avatar-on-badge`) |
| 11 | Interactive | With `href` or `onPress`, the avatar becomes a link or button using `ButtonBase` (state layer, focus ring) and `TouchTarget` (48px hit area for 24–40px avatars). A name is required by type in this form |
| 12 | Accessibility | `alt` is required unless `decorative` (when the name is already written next to it, as in most lists). Badge meanings are part of the name ("Lan, online, verified") |
| 13 | Group layout | `AvatarGroup` overlaps its avatars (overlap scaled with size), separates them with a `surface` ring (`ringColor` for avatars on other surfaces), `max` shows the first N and a "+N" avatar, and `spacing` = `overlap` (default) | `spaced`. Right-to-left mirrors the stacking |
| 14 | Group naming | The group takes a `label` (for example "Lan, Minh and 3 others"); its avatars become decorative so the list isn't read item by item. The "+N" can be a button (`onOverflowPress`) that opens the full list in a menu or dialog |
| 15 | Motion | None by default. In an interactive group, hovering or focusing an avatar raises it above its neighbours with an M3 effects spring; it stays static under reduced motion |
| 16 | Conventions | `variant`-free; `size`, `className`, `classNames` (`root`, `image`, `fallback`, `badge`), controlled props where they apply, `data-*` state (`data-status="loaded|error"`), and TSDoc that says it isn't M3 |

## API

```tsx
import { Avatar, AvatarGroup } from '@vkieu/mui/vk';

<Avatar name="Nguyễn Văn An" src={user.photo} alt="Nguyễn Văn An" size="lg" presence="online" />

<Avatar shape="rounded" name="Phở Sài Gòn" src={business.logo} decorative badge={<VerifiedIcon />} badgeLabel="verified" />

<Avatar name="Lan" href="/u/lan" alt="Lan's profile" size="sm" />

<AvatarGroup label="Lan, Minh and 3 others" max={3} size="sm" onOverflowPress={openAttendees}>
  {people.map((person) => (
    <Avatar key={person.id} name={person.name} src={person.photo} />
  ))}
</AvatarGroup>

// Inside M3 components, at their slot sizes:
<InputChip avatar={<Avatar name="Lan" src={lan.photo} size="xs" decorative />}>Lan</InputChip>
```

## Files

```
packages/ui/src/vk/avatar/
  Avatar.tsx                  Avatar (server) and its interactive form
  AvatarGroup.tsx
  avatar-image.tsx            the client error handling for the image
  get-initials.ts             initials, by grapheme and locale
  avatar-styles.ts            tailwind-variants slots (size, shape, tone)
  *.test.ts(x)                unit, accessibility and axe tests
apps/docs/stories/Avatar.stories.tsx
apps/site/                    component page, examples, props tables
.changeset/                   minor: adds Avatar and AvatarGroup to @vkieu/mui/vk
```

## Tests and checks

- **Initials:** Vietnamese and other diacritics, one word, extra spaces, emoji, empty names, and locale casing (Turkish "i").
- **Fallbacks:** a loaded image hides nothing; a broken image shows the initials; no name shows the person icon or the given `icon`.
- **Colour:** the same name always gets the same tone; every tone pairs a container with its `on-*` role.
- **Accessibility:** `alt` is required or `decorative` is set (a type test); badge meanings are in the name; the group reads once; the interactive form has a 48px target and a visible focus ring; axe in light and dark.
- **Server rendering:** an avatar renders on the server with no client code unless it's interactive or the image needs error handling; the photo shows before hydration.
- **Visual regression:** six themes × light/dark × three contrast levels, every size and shape, badges, groups with overflow, right-to-left, forced colours and the layout-safety override matrix.
- `pnpm typecheck`, `pnpm lint`, `pnpm test` and the Playwright checks pass.

## Questions for Mike (answered 2026-10-07)

1. **Sizes:** 24, 32, 40, 56, 72 and 96px. **Yes.**
2. **Initials for Vietnamese names:** the first letters of the first and last words ("Nguyễn Văn An" → "NA"). **Yes.**
3. **Profile and business headers:** an **M3 Expressive shape**, passed with `shape` (for example `Cookie12Sided` or `Cookie4Sided`). The default is a circle at every size (Mike, 2026-10-08).

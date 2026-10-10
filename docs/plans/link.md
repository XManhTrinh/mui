# Plan: Link (`@vkieu/mui/vk`)

Status: **approved by Mike on 2026-10-10**

## Goal

A text link that looks and behaves the same everywhere: inside a sentence ("I agree to the Terms of service"), as a standalone line ("Forgot password?"), in a footer list, or as a person's name on a post. Today every consumer hand-builds it with an `<a>` or Next's `Link` and its own classes, so colours, underlines, focus rings and new-tab handling drift.

M3 has no link component (its buttons cover actions, and text links are left to the platform), so `Link` is a **`vk` component** (architecture decision #22), built from M3 colour roles, the type scale, the focus indicator, and React Aria's `useLink`.

## When to use which

| Use | When |
|---|---|
| `Link` | Navigation written as text: inside a sentence, a name, a short line of its own, a list of links |
| `Button variant="text"` (with `href`) | A link that's the action of a section or a dialog ("See all", "Edit profile") |
| `Card` / `ListItem` with `href` | A whole card or row that goes somewhere |

## Decisions

| # | Decision | Value |
|---|---|---|
| 1 | Where | `packages/ui/src/vk/link/`, exported from `@vkieu/mui/vk` |
| 2 | Rendering | React Aria's `useLink` on an `<a>`, so it routes through `RouterProvider` (Next.js, React Router) like every other library link, and `data-hovered`, `data-pressed` and `data-focus-visible` drive its states |
| 3 | `variant` | `inline` (default: underlined, for links inside running text, as WCAG 1.4.1 asks when colour alone would mark them) and `standalone` (no underline at rest, underlined on hover and focus, for links on their own line or in a list) |
| 4 | Colour | `primary` by default; `tone="inherit"` takes the surrounding text colour, for links on coloured containers (`on-primary-container`, an error banner) where `primary` would lack contrast. Visited links aren't styled, as in M3 |
| 5 | Type | Inherits the surrounding type role by default; `size` (`small`, `medium`, `large`) sets `label-*` for standalone links that stand alone |
| 6 | Underline | `underline-offset` and thickness from tokens, so it clears Vietnamese diacritics below the line (ạ, ặ, ụ) |
| 7 | External links | `external` (or an absolute URL with `target="_blank"`) adds `rel="noreferrer noopener"`, a trailing 16px "open in new" icon, and visually hidden text from `labels.newTab` ("opens in a new tab"), so nobody is surprised |
| 8 | Focus | The M3 focus indicator (`focus-ring`: 3px `secondary` outline, 2px offset) with the corner `extra-small`, on keyboard focus only |
| 9 | Disabled | Not offered: a link that goes nowhere should be text |
| 10 | Tokens | `--vk-link-color`, `--vk-link-underline-thickness`, `--vk-link-underline-offset` |
| 11 | Forced colours | `LinkText`, and the underline is always shown |
| 12 | Server rendering | `"use client"` for `useLink` (routing and press states); renders on the server without layout shift |
| 13 | API conventions | `className`, `classNames` (`root`, `icon`), `data-*` states, `labels` for the new-tab text, TSDoc that says it isn't an M3 component |

## API

```tsx
import { Link } from '@vkieu/mui/vk';

<p>I agree to the <Link href="/legal/terms" external>Terms of service</Link>.</p>
<Link variant="standalone" size="medium" href="/forgot-password">Forgot password?</Link>
<Link variant="standalone" tone="inherit" href="/@lan.nguyen">Nguyễn Thị Lan</Link>
```

## Files

`packages/ui/src/vk/link/` (`Link.tsx`, `link-styles.ts`, `Link.test.tsx`), stories, e2e, docs site page with examples, playground, catalog entry (Navigation) with search keywords (link, anchor, hyperlink, text link, href), side nav, listing and count, and a changeset.

## Tests and checks

Unit (variants, tones, sizes, external handling, routing through `RouterProvider`, states), axe and contrast of `primary` on every surface role, visual regression (themes × modes × contrast, RTL, forced colours, diacritics under the underline), layout safety, and the usual `typecheck`, `lint`, `test` and Playwright.

## In VKIEU, once it's built

The terms and privacy links at sign-up and on the username screen, the links in legal documents, the footer's legal links, the post card's author name and the top bar's logo link become `Link`.

## Questions for Mike

1. **Name:** `Link` (Mike, 2026-10-10).
2. **Default:** `inline` (underlined) in running text, `standalone` elsewhere (Mike, 2026-10-10).

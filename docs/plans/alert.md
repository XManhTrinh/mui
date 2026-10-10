# Plan: Alert (`@vkieu/mui/vk`)

Status: **proposed, waiting for Mike's approval** (2026-10-10)

## Goal

A message about the page or a form that stays until it's resolved: "That email and password don't match", "You're offline; changes will sync when you're back", "Your payment failed. Update your card". VKIEU hand-builds one today (`form-alert.tsx`: an error box above the auth forms).

M3 Expressive has no persistent message component: the M2 banner isn't part of it, and snackbars disappear. So `Alert` is a **`vk` component** (architecture decision #22), built from M3 colour roles, the type scale, the shape scale, `Button` and `IconButton`.

## Name

`Alert` (Mike, 2026-10-10). Banner is the M2 and Polaris name, but suggests a full-width strip at the top of a page, while this is mostly inline (a form's error). For a decision that blocks the page, use `Dialog` with `role="alertdialog"`.

## When to use which

| Use | When |
|---|---|
| `Alert` | A message that must stay visible until it's resolved or dismissed: a form's error, a page's warning, a system notice |
| `Snackbar` | Brief feedback about something that just happened, which goes away by itself |
| Field error text (`TextField errorText`) | A problem with one field |
| `EmptyState` | A region with no content, including "couldn't load" |
| `Dialog` | Something the person must decide before going on |

## Decisions

| # | Decision | Value |
|---|---|---|
| 1 | Where | `packages/ui/src/vk/alert/`, exported from `@vkieu/mui/vk` |
| 2 | Anatomy | A leading icon (by tone, replaceable), an optional title, the message, optional actions (up to two `Button`s, text or tonal) and an optional close `IconButton` |
| 3 | `tone` | `error` (default for forms: `error-container`), `info` (`secondary-container`), `neutral` (`surface-container-highest`). M3 has no success or warning roles; consumers add them through tokens, as for `Tag` |
| 4 | `variant` | `tonal` (default, the container colour) or `outlined` (the surface, a 1px border in the tone's colour), for quieter notices |
| 5 | Semantics | `error` is `role="alert"` (read at once); the others are `role="status"` (polite). The title is plain text, or a heading with `titleAs` |
| 6 | Focus | `focusOnMount` moves focus to the alert after a failed submit, as WCAG asks for errors that block progress, and forms can pass a ref instead |
| 7 | Close | `onClose` adds a close button labelled from `labels.close`; without it, the alert can't be dismissed |
| 8 | Layout | Icon, then text; actions under the text on compact widths and at the end on wider ones. Corners `medium`. Fills its container's width |
| 9 | Motion | Appears and leaves on the effects spring (opacity and height), not at all under reduced motion |
| 10 | Tokens | `--vk-alert-container`, `--vk-alert-content`, `--vk-alert-outline`, `--vk-alert-icon`, `--vk-alert-corner` |
| 11 | Forced colours | A 1px `CanvasText` border and `CanvasText` content |
| 12 | API conventions | `className`, `classNames` (`root`, `icon`, `title`, `message`, `actions`, `close`), `data-tone`, `data-variant`, `labels`, TSDoc that says it isn't an M3 component |

## API

```tsx
import { Alert } from '@vkieu/mui/vk';

<Alert>That email and password don't match. Try again or reset your password.</Alert>
<Alert tone="info" title="You're offline" onClose={hide}>Changes will sync when you're back.</Alert>
<Alert tone="error" title="Your payment failed" actions={<Button variant="text">Update card</Button>}>
  Your card was declined.
</Alert>
```

## Files

`packages/ui/src/vk/alert/` (`Alert.tsx`, `alert-styles.ts`, `Alert.test.tsx`), stories, e2e, docs site page with examples, playground, catalog entry (Feedback, with Snackbar) with search keywords (alert, banner, notice, message, error message, callout), side nav, listing and count, and a changeset.

## Tests and checks

Unit (tones, variants, roles, close, actions, focus on mount), axe, contrast for every tone × theme × mode × contrast level, visual regression (themes × modes × contrast, compact and wide, RTL, forced colours), reduced motion, layout safety, and the usual `typecheck`, `lint`, `test` and Playwright.

## In VKIEU, once it's built

`form-alert.tsx` is removed; the auth forms use `<Alert>`.

## Questions for Mike

1. **Name:** `Alert` (Mike, 2026-10-10), as in Material UI, Bootstrap, Ant Design and Chakra, and matching its `alert` and `status` roles. In Apple's and Android's vocabulary an "alert" is a modal dialog; here that's `Dialog role="alertdialog"`, and the docs and TSDoc say so.
2. **Tones:** error, info and neutral from M3's roles, with success and warning through tokens.

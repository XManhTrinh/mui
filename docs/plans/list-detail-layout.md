# Plan: ListDetailLayout (`@vkieu/mui/vk`)

Status: **draft, waiting for Mike's approval**

## Goal

M3's **list-detail** canonical layout: a list of items and the detail of the chosen one. Narrow windows show one pane at a time (the list, or the detail with a way back); wide windows show both side by side, the list beside the open item.

VKIEU is the first consumer: its settings (`/settings`, then Profile, Account, Preferences and Privacy). The messaging inbox (phase 3) and the business dashboard use the same pattern, so it's built once here, not per screen.

M3 defines list-detail as a canonical layout but has no component for it, so `ListDetailLayout` is a **`vk` component** (architecture decision #22). It's built only from M3 pieces: the window size classes in `tokens/breakpoints.ts`, the pane spacing and margins, colour roles, the shape scale and the motion tokens. The list itself is the public `List` (with `href` items and `selectedKeys`), which needs no change.

## Name

`ListDetailLayout`, after M3's "list-detail" canonical layout (Jetpack Compose's adaptive library names it `ListDetailPaneScaffold`). "Layout" rather than "Scaffold", because it arranges panes and owns no app bar or navigation.

## When to use which

| Use | When |
|---|---|
| `ListDetailLayout` | A list whose items each open a detail view, where seeing the list beside the detail helps: settings, an inbox, orders, a dashboard's sections |
| `Tabs` | A few peer views of the same thing, switched in place |
| `Dialog` / full-screen `Dialog` | A short task or a detail that doesn't need its own URL |
| A plain page | A single detail with no list worth keeping in view |

## Decisions

| # | Decision | Value |
|---|---|---|
| 1 | Where | `packages/ui/src/vk/list-detail-layout/`, exported from `@vkieu/mui/vk` |
| 2 | Anatomy | A **list pane** and a **detail pane** in a row, with M3's 24px pane spacer between them. The page owns the top app bar and the navigation; the layout only arranges the panes |
| 3 | Window size classes (M3) | **Compact** (< 600px) and **medium** (600–839px): **one pane**, chosen by `active`. **Expanded** (840px+): **two panes**. Pure CSS media queries on the shared breakpoint tokens, so the server renders the right layout and there's no flash or hydration change |
| 4 | Pane widths (M3 fixed and flexible panes) | The list pane is **fixed**: 360px on expanded, 412px on large (1200px+) and extra-large. The detail pane is **flexible** and fills the rest. `listWidth` overrides the fixed width for lists with longer rows (an inbox) |
| 5 | URL-driven, no internal state | The page decides which item is open from its route and passes `active`: `"list"` on the list route (`/settings`), `"detail"` on an item route (`/settings/profile`). On expanded windows both panes show whatever `active` is; the list route then shows a default item (Profile) beside the list. Links in the list are ordinary `href`s, so back, forward, reload and sharing a URL all work |
| 6 | Back on narrow windows | A `back` slot (typically an `IconButton` link to the list route with a translated label) rendered **only in single-pane mode** at the top of the detail pane. Hidden by CSS on expanded windows, where the list is already in view |
| 7 | Pane surfaces | `variant="plain"` (default: both panes sit on the page's `surface`, divided by the spacer), or `"filled"`: each pane is a `surface-container-low` container with the `large` shape (16px), as in M3 Expressive's pane examples. Every theme, mode and contrast level follows |
| 8 | Scrolling | The detail pane scrolls with the page. On expanded windows the list pane is **sticky**, with its own scroll when it's taller than the window, so the list stays in view beside a long detail. `stickyTop` (a CSS length, default `0`) offsets it below the page's top app bar |
| 9 | Semantics | Each pane is a labelled landmark: the list pane is a `<nav>` by default (`listAs="section"` for a list that isn't navigation, such as an inbox), and the detail pane a `<section>`, each with `listLabel` and `detailLabel`. In single-pane mode the hidden pane is `display: none`, so screen readers and the keyboard skip it |
| 10 | Focus | When the open item changes (`detailKey`, typically the pathname), focus moves to the detail pane in single-pane mode, so keyboard and screen reader users land on the new content, not on a list that's gone. On expanded windows focus stays on the list item the person chose. A small client effect; everything else is server-rendered |
| 11 | Motion | In single-pane mode, the incoming pane enters with M3's **shared axis X** transition (a short slide and fade on the spatial spring): forward into the detail, backward to the list. It's CSS `@starting-style`, so there's no JavaScript animation. With reduced motion it appears at once |
| 12 | Right-to-left | Logical properties: in RTL the list pane sits on the right and the motion mirrors |
| 13 | Forced colours | Filled panes keep a visible `CanvasText` border |
| 14 | API conventions | `className` and `style` on the outermost element; `classNames` for the slots (`root`, `list`, `detail`, `back`); `data-active` and `data-variant` attributes; extendable `listDetailLayoutStyles` (tailwind-variants); TSDoc that says it isn't an M3 component |
| 15 | Later, if needed | A third **supporting pane** (M3's supporting-pane layout), a drag handle to resize the panes, and a medium-window two-pane option for tablets in landscape |

## API

```tsx
import { List, ListItem, IconButton } from '@vkieu/mui';
import { ListDetailLayout } from '@vkieu/mui/vk';

// /settings/profile: the Profile section is open.
<ListDetailLayout
  active="detail"
  detailKey={pathname}
  listLabel={t('title')}
  detailLabel={t('profile.title')}
  stickyTop="var(--top-bar-height)"
  back={<IconButton href="/settings" aria-label={t('back')} icon={<ArrowBackIcon />} />}
  list={
    <List aria-label={t('title')} selectedKeys={['profile']}>
      <ListItem id="profile" href="/settings/profile" supportingText={t('profile.summary')}>
        {t('profile.title')}
      </ListItem>
      {/* Account, Preferences, Privacy, Legal */}
    </List>
  }
  detail={<SettingsProfile />}
/>

// /settings: the list on narrow windows; Profile beside it on wide ones.
<ListDetailLayout active="list" detailKey={pathname} list={…} detail={<SettingsProfile />} … />
```

## Files

```
packages/ui/src/vk/list-detail-layout/
  ListDetailLayout.tsx           the layout (server component)
  use-detail-focus.tsx           the client effect for decision 10
  list-detail-layout-styles.ts   tailwind-variants slots: variant × active
  ListDetailLayout.test.tsx      rendering, slots, landmarks, focus
apps/docs/stories/ListDetailLayout.stories.tsx, apps/docs/e2e/list-detail-layout.spec.ts
apps/site/                       page, playground, examples (settings, inbox), catalog entry
                                 (Layout, a new group if none fits) with search keywords
                                 (list detail, master detail, two pane, split view, canonical
                                 layout, settings, inbox), side nav, components listing and
                                 the component count
.changeset/                      minor: adds ListDetailLayout to @vkieu/mui/vk
```

## Tests and checks

- **Unit:**
  - `active="list"` and `"detail"` show the right pane below 840px and both panes from 840px (computed styles at each breakpoint);
  - the list pane is 360px on expanded and 412px on large, `listWidth` overrides it, and the detail pane fills the rest;
  - `back` renders only in single-pane mode;
  - the landmarks: `<nav>` (or `<section>` with `listAs`) and `<section>`, with their labels; the hidden pane is out of the accessibility tree;
  - a new `detailKey` moves focus to the detail pane in single-pane mode, and not on expanded windows;
  - `className` and `classNames` win over the defaults through `cn()`.
- **Axe** in every story, light and dark.
- **Visual regression** across the six themes × light/dark × three contrast levels: both variants, each active pane, at compact, medium, expanded and large widths, right-to-left and forced colours.
- **Reduced motion:** no transition with `prefers-reduced-motion`.
- **Next.js:** renders in a server component with no hydration difference between the server and the client at any width; the sticky list works under a sticky top app bar.
- `pnpm typecheck`, `pnpm lint`, `pnpm test` and the Playwright checks pass.

## In VKIEU, once it's built

`/settings` and every `/settings/*` route render through one settings layout that passes `active` from the route, with Profile as the default detail on `/settings`. The messaging inbox and the business dashboard reuse it when they're built.

## Questions for Mike

1. **Name:** `ListDetailLayout`, after M3's canonical layout.
2. **Panes on medium windows (600–839px):** one pane at a time, as M3 recommends, so a tablet in portrait shows the list, then the section. Two panes start at 840px.
3. **Default surface:** `variant="plain"` (panes on the page's surface, as the profile's columns are), with `"filled"` available. VKIEU's settings would use `plain`.
4. **Motion:** the shared axis X transition between the list and the detail in single-pane mode, and none on expanded windows, where nothing moves.

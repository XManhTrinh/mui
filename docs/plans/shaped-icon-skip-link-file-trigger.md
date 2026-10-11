# Plan: ShapedIcon, SkipLink and FileTrigger (`@vkieu/mui/vk`)

Status: approved (Mike, 2026-10-11: "go ahead, implement full API, variants, size if needed").

## Goal

Three pieces VKIEU built by hand because mui had nothing for them (an audit of VKIEU's UI, 2026-10-11). None is an M3 component, so all three live in `vk` (architecture decision #22).

## ShapedIcon

**What:** an icon in a container shaped as a circle or an M3 Expressive shape (`Cookie9Sided`, `Flower`…), in a tone's container colours. Decorative emphasis for steps, features and empty states.

**Why:** `EmptyState` already draws exactly this inside itself, and VKIEU rebuilt it for the home page's "How it works". One source of truth: `ShapedIcon` is extracted from `EmptyState`, which then uses it. That's a refactor, with no visible change to `EmptyState`. This follows Compose, where shapes are a primitive applied to any container.

**API:**

| Prop | Type | Default |
| --- | --- | --- |
| `children` | the icon (an SVG element) | |
| `shape` | `'circle'` or a `MaterialShapeName` | `'circle'` |
| `size` | `'sm'` 40/24px, `'md'` 56/28px, `'lg'` 64/32px, `'xl'` 96/48px (container/icon) | `'md'` |
| `tone` | `'primary'`, `'secondary'`, `'tertiary'`, `'neutral'`, `'error'` | `'secondary'` |
| `aria-label` | a name when the icon means something (`role="img"`); without it the icon is decorative (`aria-hidden`) | |
| `className`, `classNames` (`root`, `icon`), `style`, `ref`, `data-*` | | |

A server component (no hooks). Expressive shapes are a CSS mask, so the container's colour and the icon follow the theme and contrast. In forced colours the icon uses `CanvasText`. `EmptyState` maps its sizes `sm`/`md`/`lg` to `sm`/`md`/`xl` and keeps its `classNames.media` and `classNames.icon`. `emptyStateStyles` loses its `media` and `icon` slots, which move to `shapedIconStyles`.

## SkipLink

**What:** "Skip to content". It's the first focusable element on the page, hidden until a keyboard user tabs onto it, then shown at the top. Pressing it moves focus into the main content (WCAG 2.4.1, Bypass Blocks).

**Why a component, not a `Link` variant:** it has its own behaviour, as GOV.UK's Skip link, Carbon's `SkipToContent` and Atlassian's skip links do. It's hidden until focused, fixed in place, placed first, and it moves focus to its target rather than only scrolling. It reuses `Link`'s focus indicator and the theme's colours.

**API:**

| Prop | Type | Default |
| --- | --- | --- |
| `target` | the id of the element to move to (`main`, `search`) | |
| `children` | the label ("Skip to content") | |
| `className`, `style`, `ref`, `data-*` | | |

Several skip links in a row show one at a time, in the same place, as each takes focus. Pressing one moves focus to the target, making it focusable (`tabindex="-1"`) if it isn't, without adding the hash to the URL. Without JavaScript the plain `#target` link still works. The look is the filled button's: `primary` container, `on-primary`, label large, full corners, 48px tall. It slides in on the fast spatial spring, or appears at once under reduced motion.

## FileTrigger

**What:** a wrapper that makes any mui button open the system file picker: `Button`, `IconButton`, `Fab`, or anything else reading `TriggerContext`. `useFileTrigger` does the same for triggers that can't be wrapped, such as a menu item's action.

**Why:** browsers open the file picker only through an `<input type="file">`. Hand-wiring one under every upload button repeats the details: hidden from assistive tech, the same file chosen twice still fires, accepted types, the camera on phones. React Aria and Spectrum solve it with a `FileTrigger` wrapper, and mui's triggers (`DialogTrigger`, `MenuTrigger`, `TooltipTrigger`) already pass props to their button through `TriggerContext`.

**API:**

```tsx
<FileTrigger accept={['image/jpeg', 'image/png']} onSelect={(files) => upload(files[0])}>
  <IconButton icon={<CameraIcon />} aria-label="Change photo" />
</FileTrigger>

const picker = useFileTrigger({ accept: ['image/*'], onSelect });
// <Menu onAction={(key) => key === 'upload' && picker.open()}>…</Menu>
// {picker.input}
```

| Prop / option | Type | Notes |
| --- | --- | --- |
| `onSelect` | `(files: File[]) => void` | Called with what was chosen; never with an empty list. |
| `accept` | `readonly string[]` | MIME types or extensions. |
| `multiple` | `boolean` | Choose several files. |
| `capture` | `'user' \| 'environment'` | Open the front or back camera on phones. |
| `directory` | `boolean` | Choose a folder (where supported). |
| `inputRef` | `Ref<HTMLInputElement>` | (`FileTrigger`) the hidden input. |

`useFileTrigger` returns `{ open, input }`: `open()` opens the picker, and `input` is the hidden input to render once. The input is visually hidden, out of the tab order and `aria-hidden`; its value is cleared after each choice. `FileTrigger` keeps an outer trigger's props (a `TooltipTrigger`'s), so it goes inside one. Disabling the button stops it, so there's no `disabled` of its own.

## Tests and checks

- Unit tests: every prop, the roles and names, axe; `SkipLink` moves focus; `FileTrigger` opens the picker on press and keyboard, reports files, fires again for the same file, and keeps an outer tooltip working.
- Storybook stories and browser tests: screenshots across themes, modes, contrast and RTL; `SkipLink` shown only on focus; the `EmptyState` screenshots unchanged.
- Docs site: a page for each (examples, API, accessibility, when to use), catalog entries with keywords, navigation group, listing and count, playground descriptors.
- Changeset (minor).

## In VKIEU

Bump the pin. The home page's "How it works" uses `ShapedIcon`, the shell uses `SkipLink`, and the photo buttons use `FileTrigger` (the button) and `useFileTrigger` (the menu's "Upload photo"). Delete `shaped-icon.tsx`, `skip-link.tsx` and the hand-wired hidden input.

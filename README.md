# @strata/mui

Material Design 3 Expressive component library for React & Next.js.

Built per official [m3.material.io](https://m3.material.io) specifications (May 2025 Expressive update).

## Installation

```bash
# From GitHub
pnpm add github:XManhTrinh/mui

# or with npm
npm install github:XManhTrinh/mui

# or with yarn
yarn add github:XManhTrinh/mui
```

## Peer Dependencies

Install the required peer dependencies:

```bash
pnpm add react react-dom tailwindcss clsx tailwind-merge class-variance-authority @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-dropdown-menu motion
```

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ≥18.0.0 | Core |
| `react-dom` | ≥18.0.0 | Core |
| `tailwindcss` | ≥4.0.0 | Styling engine |
| `clsx` | ≥2.0.0 | Conditional classnames |
| `tailwind-merge` | ≥2.0.0 | Merge Tailwind classes |
| `class-variance-authority` | ≥0.7.0 | Variant management |
| `@radix-ui/react-slot` | ≥1.0.0 | Polymorphic components |
| `@radix-ui/react-dialog` | ≥1.0.0 | Dialog primitive |
| `@radix-ui/react-dropdown-menu` | ≥2.0.0 | Menu primitive |
| `motion` | ≥12.0.0 | Animations (FABMenu, Snackbar, Sheets, Tooltip) |

## Setup

### 1. Import theme tokens

Add the M3 theme tokens to your project. Either import the file directly or copy the variables into your `globals.css`:

```css
/* globals.css */
@import "tailwindcss";
@import "@strata/mui/theme.css";
```

The theme file provides all M3 color tokens, elevation shadows, shape scale, and animation keyframes for both light and dark modes.

### 2. Add Tailwind color mappings

Map the CSS custom properties to Tailwind utilities in your `globals.css`:

```css
@theme {
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--on-primary));
  --color-primary-container: hsl(var(--primary-container));
  --color-primary-container-foreground: hsl(var(--on-primary-container));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--on-secondary));
  --color-secondary-container: hsl(var(--secondary-container));
  --color-secondary-container-foreground: hsl(var(--on-secondary-container));
  --color-tertiary: hsl(var(--tertiary));
  --color-tertiary-foreground: hsl(var(--on-tertiary));
  --color-tertiary-container: hsl(var(--tertiary-container));
  --color-tertiary-container-foreground: hsl(var(--on-tertiary-container));
  --color-surface: hsl(var(--surface));
  --color-surface-foreground: hsl(var(--on-surface));
  --color-surface-variant: hsl(var(--surface-variant));
  --color-surface-variant-foreground: hsl(var(--on-surface-variant));
  --color-surface-container-low: hsl(var(--surface-container-low));
  --color-surface-container: hsl(var(--surface-container));
  --color-surface-container-high: hsl(var(--surface-container-high));
  --color-surface-container-highest: hsl(var(--surface-container-highest));
  --color-outline: hsl(var(--outline));
  --color-outline-variant: hsl(var(--outline-variant));
  --color-error: hsl(var(--error));
  --color-error-foreground: hsl(var(--on-error));
  --color-inverse-surface: hsl(var(--inverse-surface));
  --color-inverse-on-surface: hsl(var(--inverse-on-surface));
}
```

### 3. Add Material Symbols font

```bash
pnpm add material-symbols
```

Then in your root layout or entry file:

```tsx
import "material-symbols/rounded.css";
```

This is required for the `Icon` component which uses Material Symbols Rounded.

### 4. Add prefers-reduced-motion support

Add this to your `globals.css` for accessibility:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 5. Dark mode

Add the `.dark` class to your `<html>` element to activate dark mode:

```tsx
<html className="dark">
```

All components automatically adapt to the dark theme tokens.

---

## Usage

```tsx
import { Button, IconButton, Card, CardContent, Icon } from "@strata/mui";

export function MyComponent() {
  return (
    <Card>
      <CardContent>
        <h2>Hello M3</h2>
        <Button>Click me</Button>
        <IconButton aria-label="Settings">
          <Icon name="settings" />
        </IconButton>
      </CardContent>
    </Card>
  );
}
```

No variant or size props needed for default rendering. Every component has sensible defaults per M3 spec.

---

## Components

36 components covering the full M3 component set.

### Buttons

| Component | Variants | Default | Notes |
|-----------|----------|---------|-------|
| `Button` | filled, outlined, text, elevated, tonal | filled / size s | 5 sizes: xs, s, m, l, xl |
| `IconButton` | standard, filled, filled-tonal, outlined | standard / size s | Toggle support, shape morph |
| `FAB` | — | primary / size l | 3 sizes: m, l, xl |
| `ExtendedFAB` | — | primary / size medium | Icon + label |
| `FABMenu` | — | primary | Speed-dial, 2-6 items |
| `SplitButton` | elevated, filled, tonal, outlined | tonal / size m | Leading action + dropdown |
| `ButtonGroup` | standard, connected | connected | Single/multiple selection |

### Navigation

| Component | Variants | Default | Notes |
|-----------|----------|---------|-------|
| `NavigationBar` | — | — | Fixed bottom, 3-5 items |
| `NavigationRail` | collapsed, expanded | collapsed | Fixed left, 96dp width (M3 Expressive) |

### Sheets

| Component | Variants | Default | Notes |
|-----------|----------|---------|-------|
| `BottomSheet` | standard, modal | modal | Drag handle, focus trap |
| `SideSheet` | standard, modal | modal | Left/right, focus trap |

### Indicators

| Component | Variants | Default | Notes |
|-----------|----------|---------|-------|
| `LinearProgress` | determinate, indeterminate | indeterminate | 4dp track height |
| `CircularProgress` | determinate, indeterminate | indeterminate | 48dp default |
| `LoadingIndicator` | sm, md, lg | md | Convenience wrapper |

### Pickers

| Component | Variants | Default | Notes |
|-----------|----------|---------|-------|
| `DatePicker` | — | — | Calendar grid, min/max |
| `TimePicker` | 12h, 24h | 12h | Input-based |

### All Other Components

| Component | Variants | Default | Notes |
|-----------|----------|---------|-------|
| `AppBar` | — | — | Small top app bar, 64dp |
| `Badge` | dot, count | dot | M3 positioning spec |
| `Card` | elevated, filled, outlined | elevated | Interactive mode |
| `Carousel` | uncontained, hero, full-screen | uncontained | Scroll-snap, keyboard nav |
| `Checkbox` | — | — | Indeterminate, 48dp target |
| `Chip` | assist, filter, input, suggestion | assist | Selected, elevated states |
| `Dialog` | basic, full-screen | basic | Radix-based, icon support |
| `Divider` | full, inset, middle-inset | full | Horizontal/vertical |
| `Icon` | — | — | Material Symbols Rounded |
| `List` / `ListItem` | 1/2/3 line | 1 line | Leading/trailing slots |
| `Menu` / `MenuItem` | — | — | Radix dropdown, 4dp radius |
| `Radio` / `RadioGroup` | — | — | 48dp target |
| `Search` | — | — | Contained bar, 56dp |
| `Slider` | continuous, discrete | continuous | Value indicator, stops |
| `Snackbar` | — | — | Queue-based, pause on hover |
| `Switch` | — | — | Icon support, press grow |
| `Tabs` | primary, secondary | primary | Sliding indicator |
| `TextField` | filled, outlined | outlined | Floating label, error |
| `Toolbar` | — | — | Contextual action bar |
| `Tooltip` | plain, rich | plain | 500ms delay, fade animation |

---

## Design Principles

### No props required for defaults

Every component works out of the box:

```tsx
<Button>Save</Button>           {/* filled, size s */}
<IconButton aria-label="Edit">  {/* standard, size s */}
  <Icon name="edit" />
</IconButton>
<Card>...</Card>                 {/* elevated */}
<TextField label="Name" />      {/* outlined */}
<Chip>Tag</Chip>                 {/* assist */}
```

### Theme-driven

All colors use CSS custom properties. Zero hardcoded color values. Override `:root` to rebrand:

```css
:root {
  --primary: 160 60% 42%;       /* Your brand hue */
  --on-primary: 0 0% 100%;
  --primary-container: 160 60% 92%;
  --on-primary-container: 160 60% 16%;
  /* ... */
}
```

### M3 State Layers

All interactive components use consistent state layers via `::before` pseudo-elements:

- **Hover**: 8% opacity
- **Focus**: 10% opacity
- **Press**: 10% opacity

No ripple effect — M3 Expressive uses flat state layers only.

### Shape Morph

Buttons and icon buttons morph their border-radius on press (reduced by ~20-30%), per M3 Expressive motion spec.

### Accessibility

- All touch targets meet 48dp minimum
- Focus-visible rings on keyboard navigation
- ARIA attributes (roles, states, properties)
- `prefers-reduced-motion` respected (animations disabled)
- Icon buttons require `aria-label`

---

## M3 Guidelines Quick Reference

### Button usage in Dialogs

Both action buttons must be `variant="text"`:

```tsx
<DialogFooter>
  <Button variant="text">Cancel</Button>
  <Button variant="text">Confirm</Button>
</DialogFooter>
```

### Button hierarchy

| Variant | Use case |
|---------|----------|
| `filled` | Primary action (1 per screen) |
| `tonal` | Secondary actions |
| `elevated` | Actions on images/patterned backgrounds |
| `outlined` | Tertiary actions |
| `text` | Lowest emphasis, dialogs, inline |

### Icon-only buttons

Always use `IconButton`, never `Button` with size hacks:

```tsx
// ✅ Correct
<IconButton aria-label="Edit">
  <Icon name="edit" />
</IconButton>

// ❌ Wrong
<Button className="size-10 p-0">
  <Icon name="edit" />
</Button>
```

### Sizes

All button-type components use consistent sizing:

| Size | Height | Use case |
|------|--------|----------|
| `xs` | 32dp | Dense UI, toolbars |
| `s` | 40dp | Default |
| `m` | 48dp | Comfortable |
| `l` | 56dp | Prominent |
| `xl` | 64dp | Hero actions |

### FAB placement

```tsx
<FAB icon={<Icon name="add" />} fixed />
```

The `fixed` prop positions the FAB at bottom-right with proper mobile clearance.

---

## Deprecated (not included)

Per M3 Expressive (May 2025):

- **Navigation Drawer** → Use `NavigationRail variant="expanded"` instead
- **Segmented Buttons** → Use `ButtonGroup variant="connected"` instead
- **FAB size="s"** → Smallest FAB is now `m` (48dp)
- **FAB color="surface"** → Only primary, secondary, tertiary remain

---

## File Structure

```
src/
├── buttons/
│   ├── button.tsx
│   ├── icon-button.tsx
│   ├── fab.tsx
│   ├── extended-fab.tsx
│   ├── fab-menu.tsx
│   ├── split-button.tsx
│   ├── button-group.tsx
│   └── index.ts
├── navigation/
│   ├── navigation-bar.tsx
│   ├── navigation-rail.tsx
│   └── index.ts
├── sheets/
│   ├── bottom-sheet.tsx
│   ├── side-sheet.tsx
│   └── index.ts
├── indicators/
│   ├── linear-progress.tsx
│   ├── circular-progress.tsx
│   ├── loading-indicator.tsx
│   └── index.ts
├── pickers/
│   ├── date-picker.tsx
│   ├── time-picker.tsx
│   └── index.ts
├── lib/
│   └── utils.ts
├── app-bar.tsx
├── badge.tsx
├── card.tsx
├── carousel.tsx
├── checkbox.tsx
├── chip.tsx
├── dialog.tsx
├── divider.tsx
├── icon.tsx
├── list.tsx
├── menu.tsx
├── radio.tsx
├── search.tsx
├── slider.tsx
├── snackbar.tsx
├── switch.tsx
├── tabs.tsx
├── text-field.tsx
├── toolbar.tsx
├── tooltip.tsx
├── theme.css
└── index.ts
```

---

## Theming Reference

### Token format

All tokens use HSL values without `hsl()` wrapper:

```css
--primary: 214 89% 52%;  /* H S% L% */
```

This allows using them with Tailwind's opacity modifier: `bg-primary/50`.

### Available tokens

| Category | Tokens |
|----------|--------|
| Primary | `--primary`, `--on-primary`, `--primary-container`, `--on-primary-container` |
| Secondary | `--secondary`, `--on-secondary`, `--secondary-container`, `--on-secondary-container` |
| Tertiary | `--tertiary`, `--on-tertiary`, `--tertiary-container`, `--on-tertiary-container` |
| Surface | `--surface`, `--on-surface`, `--surface-variant`, `--on-surface-variant` |
| Containers | `--surface-container-low`, `--surface-container`, `--surface-container-high`, `--surface-container-highest` |
| Inverse | `--inverse-surface`, `--inverse-on-surface`, `--inverse-primary` |
| Outline | `--outline`, `--outline-variant` |
| Error | `--error`, `--on-error` |
| Elevation | `--elevation-1` through `--elevation-5` (box-shadow opacity values) |
| Shape | `--shape-full`, `--shape-xl`, `--shape-lg`, `--shape-md`, `--shape-sm` |

### Custom themes

Generate tokens using the [Material Theme Builder](https://material-foundation.github.io/material-theme-builder/) and override in `:root`:

```css
:root {
  /* Generated from Material Theme Builder */
  --primary: 265 80% 50%;
  --on-primary: 0 0% 100%;
  /* ... all other tokens */
}
```

---

## License

MIT — [XManhTrinh/mui](https://github.com/XManhTrinh/mui)

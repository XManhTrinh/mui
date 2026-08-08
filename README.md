# @strata/mui

Material Design 3 Expressive component library for React & Next.js.

Built per official [m3.material.io](https://m3.material.io) specifications (May 2025 Expressive update).

## Installation

```bash
pnpm add @strata/mui
```

### Peer Dependencies

```bash
pnpm add clsx tailwind-merge class-variance-authority @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-dropdown-menu motion
```

## Setup

### 1. Import theme CSS

```tsx
// In your root layout or global styles
import "@strata/mui/theme.css";
```

### 2. Add Tailwind color mappings

In your `globals.css` (Tailwind v4):

```css
@import "tailwindcss";

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

## Usage

```tsx
import { Button, IconButton, Card, CardContent, Icon } from "@strata/mui";

export function MyComponent() {
  return (
    <Card variant="elevated">
      <CardContent>
        <h2>Hello M3</h2>
        <Button>Click me</Button>
        <IconButton variant="standard" aria-label="Settings">
          <Icon name="settings" />
        </IconButton>
      </CardContent>
    </Card>
  );
}
```

## Components (34)

### Buttons
- `Button` — Filled, Outlined, Text, Elevated, Tonal (5 sizes: xs, s, m, l, xl)
- `IconButton` — Standard, Filled, Filled-Tonal, Outlined (with toggle + shape morph)
- `FAB` — Medium, Large, Extra Large + Extended
- `ExtendedFAB` — Small, Medium, Large
- `FABMenu` — Speed-dial with staggered animation
- `SplitButton` — Leading action + trailing menu trigger
- `ButtonGroup` — Standard + Connected (single/multi-select)

### Navigation
- `NavigationBar` — Bottom navigation (flexible variant)
- `NavigationRail` — Collapsed + Expanded (replaces Navigation Drawer)

### Containment
- `Card` — Elevated, Filled, Outlined
- `Dialog` — Basic + Full-screen
- `BottomSheet` — Standard + Modal
- `SideSheet` — Standard + Modal
- `Carousel` — Uncontained, Hero, Full-screen

### Communication
- `Badge` — Dot + Count
- `Snackbar` — Queue-based with auto-dismiss
- `Tooltip` — Plain + Rich
- `LinearProgress` — Determinate + Indeterminate
- `CircularProgress` — Determinate + Indeterminate
- `LoadingIndicator` — Preset sizes (sm/md/lg)

### Selection
- `Checkbox` — With indeterminate support
- `Radio` + `RadioGroup`
- `Switch` — With optional icons
- `Chip` — Assist, Filter, Input, Suggestion
- `Tabs` — Primary + Secondary with sliding indicator

### Text Input
- `TextField` — Filled + Outlined with floating label
- `Search` — Contained style with expand-on-focus
- `Slider` — Continuous + Discrete

### Data Display
- `List` + `ListItem` — 1/2/3 line, leading/trailing slots
- `Menu` + `MenuItem` — Dropdown with Radix
- `Divider` — Full, Inset, Middle-inset

### Layout
- `AppBar` — Top app bar (small variant)
- `Toolbar` — Contextual action bar
- `Icon` — Material Symbols Rounded

## Theming

All components use CSS custom properties. Override `:root` tokens to customize:

```css
:root {
  --primary: 220 90% 56%;  /* Your brand color in HSL */
  --on-primary: 0 0% 100%;
  /* ... */
}
```

Dark mode: add `.dark` class to `<html>` and override the same tokens.

## M3 Compliance

- State layers: 8% hover, 10% focus, 10% press
- Shape morph on press (buttons, FABs)
- Token-based elevation shadows
- `prefers-reduced-motion` respected (global CSS rule)
- WCAG AA contrast in light + dark modes
- 48dp minimum touch targets
- Full keyboard navigation + ARIA

## License

MIT

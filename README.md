# @vkieu/mui

Material Design 3 Expressive component library for React & Next.js.

Built per official [m3.material.io](https://m3.material.io) specifications (May 2025 Expressive update). 36 components, zero runtime config, theme-driven via CSS custom properties.

📖 **[Live Documentation & Playground →](https://kieuv-mui.vercel.app)** 

---

## Documentation Site

An interactive showcase with live examples of every component variant:

```bash
cd docs
npm install
npm run dev
```

Deploy to Vercel:
```bash
cd docs
npx vercel
```

---

## Installation

```bash
# From GitHub (pnpm)
pnpm add github:XManhTrinh/mui

# npm
npm install github:XManhTrinh/mui

# yarn
yarn add github:XManhTrinh/mui
```

## Peer Dependencies

Install all required peer dependencies:

```bash
pnpm add react react-dom tailwindcss clsx tailwind-merge class-variance-authority @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-dropdown-menu motion material-symbols
```

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ≥18.0.0 | Core framework |
| `react-dom` | ≥18.0.0 | DOM rendering |
| `tailwindcss` | ≥4.0.0 | Styling engine (v4 required) |
| `clsx` | ≥2.0.0 | Conditional classnames |
| `tailwind-merge` | ≥2.0.0 | Merge Tailwind classes safely |
| `class-variance-authority` | ≥0.7.0 | Component variant management |
| `@radix-ui/react-slot` | ≥1.0.0 | Polymorphic component support |
| `@radix-ui/react-dialog` | ≥1.0.0 | Dialog/sheet primitives |
| `@radix-ui/react-dropdown-menu` | ≥2.0.0 | Menu primitives |
| `motion` | ≥12.0.0 | Animations (Snackbar, Sheets, Tooltip, FABMenu) |
| `material-symbols` | latest | Icon font (Material Symbols Rounded) |

---

## Setup

### 1. Import theme tokens in your CSS

Add the M3 theme CSS file to your project's main stylesheet (e.g. `globals.css` or `app.css`):

```css
@import "tailwindcss";
@import "@vkieu/mui/theme.css";
```

This single file provides all M3 color tokens, elevation shadows, shape scale, Tailwind v4 `@theme` color mappings, keyframes, and animation utilities for both light and dark modes.

### 2. Add `@source` directive for Tailwind v4

> **⚠️ CRITICAL: This is the #1 issue people hit.** Without this, Tailwind will not scan the component library's source files and none of the utility classes will be generated.

In **Tailwind v4**, you must explicitly tell Tailwind to scan the package's source files by adding an `@source` directive to your CSS file. The path is **relative to your CSS file location**:

```css
/* app/globals.css (or wherever your main CSS file lives) */
@import "tailwindcss";
@import "@vkieu/mui/theme.css";
@source "../../node_modules/@vkieu/mui/src";
```

Adjust the relative path based on where your CSS file is relative to `node_modules`. For example:

| CSS file location | `@source` path |
|---|---|
| `src/app/globals.css` | `../../node_modules/@vkieu/mui/src` |
| `src/globals.css` | `../node_modules/@vkieu/mui/src` |
| `styles/main.css` | `../node_modules/@vkieu/mui/src` |
| `app/globals.css` | `../node_modules/@vkieu/mui/src` |

Without this, you'll see unstyled components because Tailwind won't generate the utility classes used inside the library.

### 3. Add Material Symbols font

```bash
pnpm add material-symbols
```

Then import it in your root layout or entry file:

```tsx
// app/layout.tsx or src/main.tsx
import "material-symbols/rounded.css";
```

This is required for the `Icon` component which renders Material Symbols Rounded glyphs.

### 4. Dark mode

Add the `dark` class to your `<html>` element to activate dark mode:

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html className="dark">
      <body>{children}</body>
    </html>
  );
}
```

All components automatically adapt via the dark-mode token overrides in `theme.css`. Toggle the class with JavaScript for runtime switching.

---

## Usage Examples

### Basic buttons

```tsx
import { Button, IconButton, Icon } from "@vkieu/mui";

function Actions() {
  return (
    <div className="flex gap-2">
      <Button>Save</Button>
      <Button variant="outlined">Cancel</Button>
      <Button variant="tonal" icon={<Icon name="add" />}>
        New item
      </Button>
      <IconButton aria-label="Settings">
        <Icon name="settings" />
      </IconButton>
    </div>
  );
}
```

### Card with content

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from "@vkieu/mui";

function ProductCard() {
  return (
    <Card variant="outlined">
      <CardHeader>
        <CardTitle>Product Name</CardTitle>
        <CardDescription>A brief description of the product.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Detailed content goes here.</p>
      </CardContent>
      <CardFooter>
        <Button variant="text">Learn more</Button>
      </CardFooter>
    </Card>
  );
}
```

### Dialog

```tsx
import {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogClose, Button
} from "@vkieu/mui";

function ConfirmDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outlined">Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete item?</DialogTitle>
          <DialogDescription>
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="text">Cancel</Button>
          </DialogClose>
          <Button variant="text">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### Navigation

```tsx
import { NavigationBar, NavigationRail, FAB, Icon } from "@vkieu/mui";

// Bottom navigation (mobile)
<NavigationBar
  items={[
    { value: "home", icon: "home", activeIcon: "home", label: "Home" },
    { value: "search", icon: "search", label: "Search" },
    { value: "library", icon: "video_library", activeIcon: "video_library", label: "Library" },
  ]}
  activeValue="home"
  onValueChange={(v) => setActive(v)}
/>

// Side rail (desktop)
<NavigationRail
  items={[
    { value: "inbox", icon: "inbox", label: "Inbox", badge: 3 },
    { value: "sent", icon: "send", label: "Sent" },
    { value: "drafts", icon: "drafts", label: "Drafts" },
  ]}
  header={<FAB icon={<Icon name="edit" />} size="m" />}
/>
```

### Form elements

```tsx
import { TextField, Switch, Checkbox, Radio, RadioGroup, Chip, Slider } from "@vkieu/mui";

function FormExample() {
  return (
    <form className="flex flex-col gap-4 max-w-sm">
      <TextField label="Email" type="email" />
      <TextField label="Password" type="password" variant="filled" />
      <Switch aria-label="Notifications" showIcons />
      <Checkbox aria-label="Accept terms" />
      <RadioGroup name="size" defaultValue="m">
        <Radio value="s" aria-label="Small" />
        <Radio value="m" aria-label="Medium" />
        <Radio value="l" aria-label="Large" />
      </RadioGroup>
      <div className="flex gap-2">
        <Chip variant="filter" selected>Active</Chip>
        <Chip variant="filter">Inactive</Chip>
      </div>
      <Slider defaultValue={50} showValueIndicator aria-label="Volume" />
    </form>
  );
}
```

### Snackbar

```tsx
import { SnackbarProvider, useSnackbar, Button } from "@vkieu/mui";

function App() {
  return (
    <SnackbarProvider position="bottom-left">
      <Content />
    </SnackbarProvider>
  );
}

function Content() {
  const { show } = useSnackbar();

  return (
    <Button onClick={() => show({
      message: "Item archived",
      action: { label: "Undo", onClick: () => {} },
    })}>
      Archive
    </Button>
  );
}
```

### Tabs

```tsx
import { Tabs, TabList, Tab, TabContent } from "@vkieu/mui";

function TabExample() {
  return (
    <Tabs defaultValue="overview">
      <TabList>
        <Tab value="overview" label="Overview" />
        <Tab value="specs" label="Specifications" icon="description" />
        <Tab value="reviews" label="Reviews" />
      </TabList>
      <TabContent value="overview">Overview content here.</TabContent>
      <TabContent value="specs">Specs content here.</TabContent>
      <TabContent value="reviews">Reviews content here.</TabContent>
    </Tabs>
  );
}
```

---

## Full Component List

### Buttons

| Component | Variants | Default | Sizes | Notes |
|-----------|----------|---------|-------|-------|
| `Button` | filled, outlined, text, elevated, tonal | filled / s | xs, s, m, l, xl | Icon support, loading state, shape morph |
| `IconButton` | standard, filled, filled-tonal, outlined | standard / s | xs, s, m, l, xl | Toggle support, shape morph, touch target |
| `FAB` | — | primary / l | m, l, xl, extended | Fixed positioning, shape morph |
| `ExtendedFAB` | — | primary / medium | — | Icon + label |
| `FABMenu` | — | primary | — | Speed-dial menu, 2–6 items |
| `SplitButton` | elevated, filled, tonal, outlined | tonal / m | — | Leading action + dropdown |
| `ButtonGroup` | standard, connected | connected | — | Single/multiple selection |

### Navigation

| Component | Variants | Default | Notes |
|-----------|----------|---------|-------|
| `NavigationBar` | — | — | Fixed bottom, 64dp, 3–5 items |
| `NavigationRail` | collapsed, expanded | collapsed | Fixed left, 96dp collapsed / 360dp expanded |

### Data Display

| Component | Variants | Default | Notes |
|-----------|----------|---------|-------|
| `Card` | elevated, filled, outlined | elevated | Interactive mode, 12dp radius |
| `Badge` | dot, count | dot | M3 positioning spec |
| `Chip` | assist, filter, input, suggestion | assist | Selected + elevated states |
| `List` / `ListItem` | 1/2/3 line | 1 line | Leading/trailing slots |
| `Divider` | full, inset, middle-inset | full | Horizontal/vertical |
| `Carousel` | uncontained, hero, full-screen | uncontained | Scroll-snap, keyboard nav |
| `Icon` | — | — | Material Symbols Rounded wrapper |
| `Tooltip` | plain, rich | plain | 500ms delay, fade animation |

### Inputs

| Component | Variants | Default | Notes |
|-----------|----------|---------|-------|
| `TextField` | filled, outlined | outlined | Floating label, error, character count |
| `Search` | — | — | 56dp, pill shape, 360–720dp width |
| `Checkbox` | — | — | Indeterminate support, 48dp target |
| `Radio` / `RadioGroup` | — | — | 48dp target |
| `Switch` | — | — | Icon support, press-grow animation |
| `Slider` | continuous, discrete | continuous | Value indicator, stop marks |
| `DatePicker` | — | — | Calendar grid, min/max dates |
| `TimePicker` | 12h, 24h | 12h | Input-based |

### Feedback

| Component | Variants | Default | Notes |
|-----------|----------|---------|-------|
| `Dialog` | basic, full-screen | basic | Radix-based, icon, scrim |
| `Snackbar` | — | — | Queue-based, pause on hover |
| `Menu` / `MenuItem` | — | — | Radix dropdown, 4dp radius |
| `LinearProgress` | determinate, indeterminate | indeterminate | 4dp track |
| `CircularProgress` | determinate, indeterminate | indeterminate | 48dp default |
| `LoadingIndicator` | sm, md, lg | md | Convenience wrapper |

### Layout

| Component | Variants | Default | Notes |
|-----------|----------|---------|-------|
| `AppBar` | — | — | Small top app bar, 64dp |
| `Toolbar` | — | — | Contextual action bar |
| `Tabs` | primary, secondary | primary | Sliding active indicator |
| `BottomSheet` | standard, modal | modal | 28dp corners, drag handle |
| `SideSheet` | standard, modal | modal | Left/right, 400dp max |

---

## Theming

### How it works

All components use CSS custom properties for colors. The `theme.css` file provides:
1. Default light-mode values on `:root`
2. Dark-mode overrides on `.dark`
3. Tailwind v4 `@theme` color mappings

### Customizing your theme

Override the CSS variables in `:root` to rebrand:

```css
:root {
  /* Your brand colors (HSL values without hsl() wrapper) */
  --primary: 265 80% 50%;
  --on-primary: 0 0% 100%;
  --primary-container: 265 80% 92%;
  --on-primary-container: 265 80% 16%;

  --secondary: 265 15% 46%;
  --on-secondary: 0 0% 100%;
  --secondary-container: 265 20% 92%;
  --on-secondary-container: 265 20% 18%;

  /* ... override any token */
}
```

Use the [Material Theme Builder](https://material-foundation.github.io/material-theme-builder/) to generate a full token set from your brand color.

### Token format

Tokens use HSL values **without** the `hsl()` wrapper:

```css
--primary: 214 89% 52%;  /* H S% L% */
```

This allows Tailwind's opacity modifier to work: `bg-primary/50`.

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
| Elevation | `--elevation-1` through `--elevation-5` |
| Shape | `--shape-full`, `--shape-xl`, `--shape-lg`, `--shape-md`, `--shape-sm` |
| State | `--state-hover` (0.08), `--state-focus` (0.10), `--state-press` (0.10) |

---

## M3 Guidelines Quick Reference

### Button hierarchy

Use one primary action per screen, with decreasing emphasis for secondary actions:

| Variant | Emphasis | Use case |
|---------|----------|----------|
| `filled` | Highest | Primary action (1 per screen) |
| `tonal` | Medium-high | Important secondary actions |
| `elevated` | Medium | Actions on images/patterned backgrounds |
| `outlined` | Medium-low | Tertiary actions, alternatives |
| `text` | Lowest | Inline actions, dialog buttons |

### Dialog buttons

Both action buttons in a dialog **must** use `variant="text"`:

```tsx
<DialogFooter>
  <Button variant="text">Cancel</Button>
  <Button variant="text">Confirm</Button>
</DialogFooter>
```

### Icon-only buttons

Always use `IconButton`, never `Button` with padding hacks:

```tsx
// ✅ Correct
<IconButton aria-label="Edit">
  <Icon name="edit" />
</IconButton>

// ❌ Wrong — no accessible label, wrong component
<Button className="size-10 p-0">
  <Icon name="edit" />
</Button>
```

### Consistent sizes

All button-type components share the same size scale:

| Size | Height | Use case |
|------|--------|----------|
| `xs` | 32dp | Dense UI, toolbars |
| `s` | 40dp | **Default** for most contexts |
| `m` | 48dp | Comfortable spacing |
| `l` | 56dp | Prominent actions |
| `xl` | 64dp | Hero sections |

### FAB placement

```tsx
// Fixed bottom-right with mobile nav clearance
<FAB icon={<Icon name="add" />} fixed />
```

### State layers

All interactive components use flat state layers (no ripple) per M3 Expressive:
- **Hover**: 8% opacity
- **Focus**: 10% opacity
- **Press**: 10% opacity

### Touch targets

All components meet the 48dp minimum touch target. Smaller visual sizes (xs=32dp, s=40dp) automatically add invisible touch-target padding.

---

## Deprecated (M3 Expressive, May 2025)

These legacy patterns are **not included** in this library:

| Removed | Replacement |
|---------|-------------|
| Navigation Drawer | `NavigationRail variant="expanded"` |
| Segmented Buttons | `ButtonGroup variant="connected"` |
| FAB size="s" | Smallest FAB is now `m` (48dp) |
| FAB color="surface" | Only primary, secondary, tertiary remain |

---

## File Structure

```
src/
├── buttons/
│   ├── button.tsx          # Button (5 variants × 5 sizes)
│   ├── icon-button.tsx     # IconButton (4 variants, toggle)
│   ├── fab.tsx             # FAB (3 sizes + extended)
│   ├── extended-fab.tsx    # Extended FAB
│   ├── fab-menu.tsx        # FAB speed-dial menu
│   ├── split-button.tsx    # Split button with dropdown
│   ├── button-group.tsx    # Button group / segmented
│   └── index.ts
├── navigation/
│   ├── navigation-bar.tsx  # Bottom navigation
│   ├── navigation-rail.tsx # Side rail (collapsed/expanded)
│   └── index.ts
├── sheets/
│   ├── bottom-sheet.tsx    # Bottom sheet (standard/modal)
│   ├── side-sheet.tsx      # Side sheet (standard/modal)
│   └── index.ts
├── indicators/
│   ├── linear-progress.tsx # Linear progress bar
│   ├── circular-progress.tsx # Circular spinner
│   ├── loading-indicator.tsx # Convenience wrapper
│   └── index.ts
├── pickers/
│   ├── date-picker.tsx     # Calendar date picker
│   ├── time-picker.tsx     # Time input picker
│   └── index.ts
├── lib/
│   └── utils.ts            # cn() helper (clsx + tailwind-merge)
├── app-bar.tsx             # Top app bar
├── badge.tsx               # Badge (dot/count)
├── card.tsx                # Card (elevated/filled/outlined)
├── carousel.tsx            # Carousel (scroll-snap)
├── checkbox.tsx            # Checkbox
├── chip.tsx                # Chip (4 variants)
├── dialog.tsx              # Dialog (basic/full-screen)
├── divider.tsx             # Divider
├── icon.tsx                # Material Symbols icon
├── list.tsx                # List + ListItem
├── menu.tsx                # Menu (Radix dropdown)
├── radio.tsx               # Radio + RadioGroup
├── search.tsx              # Search bar
├── slider.tsx              # Slider (continuous/discrete)
├── snackbar.tsx            # Snackbar (queue-based)
├── switch.tsx              # Switch
├── tabs.tsx                # Tabs (primary/secondary)
├── text-field.tsx          # TextField (filled/outlined)
├── toolbar.tsx             # Contextual toolbar
├── tooltip.tsx             # Tooltip (plain/rich)
├── theme.css              # All M3 tokens + Tailwind mappings
└── index.ts               # Barrel exports
```

---

## Design Principles

### Zero config defaults

Every component renders correctly without props:

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

All colors use CSS custom properties. Zero hardcoded color values. Override `:root` to rebrand the entire library.

### Shape morph

Buttons and icon buttons morph their border-radius on press (reduced by ~20–30%), per M3 Expressive motion spec.

### Accessibility

- All touch targets meet 48dp minimum
- Focus-visible rings on keyboard navigation
- ARIA attributes (roles, states, properties)
- `prefers-reduced-motion` respected (animations disabled)
- Icon buttons require `aria-label`

---

## License

MIT — [XManhTrinh/mui](https://github.com/XManhTrinh/mui)

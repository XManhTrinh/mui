# @vkieu/mui

React components implementing **Material Design 3 Expressive**, built on React Aria,
Tailwind CSS v4 and Motion. Works with Vite and Next.js (App Router and Pages Router).

```bash
npm i @vkieu/mui motion
```

```css
/* globals.css */
@import 'tailwindcss';
@import '@vkieu/mui/styles.css';
```

```tsx
import { ThemeProvider } from '@vkieu/mui';

<ThemeProvider defaultTheme="baseline">{children}</ThemeProvider>;
```

Not using Tailwind? Import `@vkieu/mui/styles.compiled.css` instead.

Fonts are not bundled: load [Roboto Flex](https://fonts.google.com/specimen/Roboto+Flex)
with `next/font` or Google Fonts. Without it, the system UI font is used.

See [`docs/architecture.md`](../../docs/architecture.md) for theming, overrides, motion and
Next.js setup.

## Licence

MIT. Bundles `@material/material-color-utilities` (Apache-2.0); see `NOTICE`.

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

### Vite 8 and `"use client"`

Interactive modules start with `"use client"` for React Server Components. Vite 8 logs a
harmless `MODULE_LEVEL_DIRECTIVE` warning for each one in client-only builds. To silence it:

```ts
// vite.config.ts
export default defineConfig({
  build: {
    rolldownOptions: {
      onLog(level, log, handler) {
        if (log.code !== 'MODULE_LEVEL_DIRECTIVE') handler(level, log);
      },
    },
  },
});
```

## Documentation

The full documentation site — getting started, theming, motion, customisation, accessibility
and Next.js guides, plus a page per component with live examples and generated props tables — is
in [`apps/site`](../../apps/site). Run it locally with `pnpm --filter site dev`.

See [`docs/architecture.md`](../../docs/architecture.md) for theming, overrides, motion and
Next.js setup.

## Licence

MIT. Bundles `@material/material-color-utilities` (Apache-2.0); see `NOTICE`.

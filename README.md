# vkieu-mui

Monorepo for **[@vkieu/mui](packages/ui)** — a React component library implementing
**Material Design 3 Expressive** — and its documentation site.

Built on [React Aria](https://react-spectrum.adobe.com/react-aria/), [Tailwind CSS v4](https://tailwindcss.com)
and [Motion](https://motion.dev). Semantic design tokens, light/dark + contrast levels, full
RTL support, and accessible-by-default components. Works with Vite and Next.js (App Router and
Pages Router).

**Live demo & docs → [vkieu-mui.vercel.app](https://vkieu-mui.vercel.app/)**

## What's inside

| Package | Description |
| --- | --- |
| [`packages/ui`](packages/ui) | The `@vkieu/mui` library — components, theming, tokens, and the `/next`, `/vk` and `/primitives` entry points. |
| [`apps/site`](apps/site) | The documentation website (Next.js static export): guides plus a page per component with live examples, an interactive playground, M3 specs and generated props tables. |
| [`apps/docs`](apps/docs) | Component stories (Storybook) used while developing the library. |
| [`apps/next-playground`](apps/next-playground) | A Next.js sandbox for exercising the library in a real app. |
| [`docs/`](docs) | Architecture and design notes ([`docs/architecture.md`](docs/architecture.md)). |

## Using the library

Install the package and its `motion` peer, then import the stylesheet:

```bash
npm i @vkieu/mui motion
```

```css
/* globals.css */
@import 'tailwindcss';
@import '@vkieu/mui/styles.css';
```

```tsx
import { ThemeProvider, Button } from '@vkieu/mui';

export function App() {
  return (
    <ThemeProvider defaultTheme="baseline">
      <Button variant="filled">Label</Button>
    </ThemeProvider>
  );
}
```

Not using Tailwind? Import `@vkieu/mui/styles.compiled.css` instead. Fonts are not bundled —
load [Roboto Flex](https://fonts.google.com/specimen/Roboto+Flex) via `next/font` or Google
Fonts. See [`packages/ui/README.md`](packages/ui/README.md) for the full consumer guide.

## Documentation

The documentation site is deployed at **[vkieu-mui.vercel.app](https://vkieu-mui.vercel.app/)**
and lives in [`apps/site`](apps/site). Run it locally:

```bash
pnpm --filter site dev
```

Deeper design and theming notes are in [`docs/architecture.md`](docs/architecture.md).

## Development

**Prerequisites:** Node.js `>=24` and [pnpm](https://pnpm.io) (`packageManager: pnpm@12.8.1`).
The repo uses [Turborepo](https://turborepo.com) for task running and caching.

```bash
pnpm install              # install all workspaces

pnpm --filter site dev    # run the docs site
pnpm build                # build every package and app
pnpm test                 # unit tests
pnpm test:e2e             # Playwright end-to-end tests
pnpm typecheck            # type-check all workspaces
pnpm lint                 # lint all workspaces
pnpm format               # Prettier write
```

Build just the library:

```bash
pnpm --filter @vkieu/mui build
```

Each app and package also defines its own scripts — see the relevant `package.json`.

## Releasing

Versioning and publishing use [Changesets](https://github.com/changesets/changesets):

```bash
pnpm changeset            # record a change
pnpm version-packages     # apply version bumps
pnpm release              # build the library and publish
```

## Licence

MIT. `@vkieu/mui` bundles [`@material/material-color-utilities`](https://github.com/material-foundation/material-color-utilities)
(Apache-2.0); see `packages/ui/NOTICE`.

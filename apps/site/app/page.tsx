import { Button, Card } from '@vkieu/mui';
import { CodeBlock } from '@vkieu/mui/vk';
import type { ReactElement } from 'react';
import { ComponentGallery } from '../components/gallery';
import { Showcase } from '../components/home/showcase';
import {
  AccessibilityIcon,
  CodeIcon,
  ExploreIcon,
  MotionIcon,
  PaletteIcon,
  TuneIcon,
} from '../components/icons';
import { CATEGORY_COUNT, COMPONENT_PAGE_COUNT } from '../content/components/catalog';
import { highlightSource } from '../lib/highlight';

interface Stat {
  label: string;
  value: string;
}

const STATS: Stat[] = [
  { label: 'Components', value: String(COMPONENT_PAGE_COUNT) },
  { label: 'Token verified', value: '100%' },
  { label: 'Config needed', value: '0' },
  { label: 'Accessibility', value: 'WCAG ready' },
];

/*
 * Quick-start snippets. Pulled verbatim from this repo's own getting-started guide
 * (apps/site/app/(docs)/getting-started/page.tsx) and the package manifest
 * (packages/ui/package.json) — not from the deployed site. Verified in verification.md.
 */
const INSTALL_SNIPPET = `npm i @vkieu/mui motion`;

const CSS_SNIPPET = `@import 'tailwindcss';
@import '@vkieu/mui/styles.css';
@source '../node_modules/@vkieu/mui';`;

const USE_SNIPPET = `import { Button, ThemeProvider } from '@vkieu/mui';

export function App() {
  return (
    <ThemeProvider defaultTheme="baseline">
      <Button variant="filled">Save</Button>
    </ThemeProvider>
  );
}`;

interface QuickStep {
  title: string;
  description: string;
  code: string;
  lang: string;
  fileLabel: string;
}

const QUICK_STEPS: QuickStep[] = [
  {
    title: 'Install',
    description: 'Add the package with motion, its animation peer dependency.',
    code: INSTALL_SNIPPET,
    lang: 'bash',
    fileLabel: 'Terminal',
  },
  {
    title: 'Import tokens & styles',
    description:
      'In a Tailwind v4 project, import Tailwind and the library tokens, then let Tailwind scan the package.',
    code: CSS_SNIPPET,
    lang: 'css',
    fileLabel: 'globals.css',
  },
  {
    title: 'Use a component',
    description: 'Wrap the tree in ThemeProvider and drop in any component.',
    code: USE_SNIPPET,
    lang: 'tsx',
    fileLabel: 'App.tsx',
  },
];

interface Feature {
  title: string;
  description: string;
  icon: ReactElement;
}

const FEATURES: Feature[] = [
  {
    title: 'Full M3 token system',
    description: 'Every surface draws from semantic colour, shape, type and elevation tokens.',
    icon: <PaletteIcon />,
  },
  {
    title: 'Accessible by default',
    description: 'Built on React Aria: names, roles, focus and keyboard behaviour come included.',
    icon: <AccessibilityIcon />,
  },
  {
    title: 'RTL ready',
    description: 'Logical properties throughout, so layouts mirror correctly from one direction flag.',
    icon: <ExploreIcon />,
  },
  {
    title: 'Zero-config theming',
    description: 'ThemeProvider sets theme, mode, contrast and motion, and remembers the choice.',
    icon: <TuneIcon />,
  },
  {
    title: 'M3 Expressive motion',
    description: 'Motion-powered springs with reduced-motion honoured out of the box.',
    icon: <MotionIcon />,
  },
  {
    title: 'Composable APIs',
    description: 'className slots and composable parts let you extend components without forking.',
    icon: <CodeIcon />,
  },
];

export default async function HomePage() {
  const stepHtml = await Promise.all(
    QUICK_STEPS.map((step) => highlightSource(step.code, step.lang)),
  );

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-20">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-corner-extra-large bg-gradient-to-b from-primary-container to-surface px-6 py-16 text-center medium:px-12 medium:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -end-16 -top-16 size-64 rounded-full bg-primary/10 motion-safe:animate-pulse"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -start-10 size-56 rounded-full bg-tertiary/10"
        />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6">
          <span className="rounded-corner-full bg-primary-container px-4 py-1 text-label-large text-on-primary-container">
            M3 Expressive — May 2025
          </span>
          <h1 className="text-display-small text-on-surface medium:text-display-large">
            Material Design 3 for React
          </h1>
          <p className="max-w-2xl text-body-large text-on-surface-variant">
            Tailwind v4, zero runtime config, full dark mode, RTL out of the box.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="filled" size="lg" href="/getting-started">
              Get started
            </Button>
            <Button variant="outlined" size="lg" href="https://github.com/XManhTrinh/mui">
              GitHub
            </Button>
          </div>
        </div>
      </section>

      {/* Stat cards */}
      <section aria-label="At a glance" className="grid grid-cols-2 gap-4 medium:grid-cols-4">
        {STATS.map((stat) => (
          <Card key={stat.label} variant="filled" className="flex flex-col gap-1 p-5 text-center">
            <span className="text-display-small text-on-surface">{stat.value}</span>
            <span className="text-body-medium text-on-surface-variant">{stat.label}</span>
          </Card>
        ))}
      </section>

      {/* Live showcase */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-headline-medium text-on-surface">See it in action</h2>
          <p className="max-w-2xl text-body-large text-on-surface-variant">
            Real components, themed by semantic tokens. Switch themes and modes anywhere in the
            docs.
          </p>
        </div>
        <Card variant="outlined" className="p-4 medium:p-6">
          <Showcase />
        </Card>
      </section>

      {/* Built right — feature grid */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-headline-medium text-on-surface">Built right</h2>
          <p className="max-w-2xl text-body-large text-on-surface-variant">
            The details that make the library dependable in production.
          </p>
        </div>
        <ul className="grid grid-cols-1 gap-4 medium:grid-cols-2 large:grid-cols-3">
          {FEATURES.map((feature) => (
            <li
              key={feature.title}
              className="flex h-full flex-col gap-3 rounded-corner-large border border-outline-variant bg-surface-container-low p-5"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-corner-large bg-secondary-container text-on-secondary-container">
                <span className="inline-flex size-6 [&>svg]:size-full">{feature.icon}</span>
              </span>
              <h3 className="text-title-medium text-on-surface">{feature.title}</h3>
              <p className="text-body-medium text-on-surface-variant">{feature.description}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Quick start */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-headline-medium text-on-surface">Quick start</h2>
          <p className="max-w-2xl text-body-large text-on-surface-variant">
            Three steps to your first component. See the{' '}
            <a
              href="/getting-started"
              className="rounded-sm text-primary underline underline-offset-2 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
            >
              full guide
            </a>{' '}
            for fonts, icons and routing.
          </p>
        </div>
        <ol className="flex flex-col gap-4">
          {QUICK_STEPS.map((step, index) => (
            <li
              key={step.title}
              className="flex flex-col gap-3 rounded-corner-large border border-outline-variant bg-surface-container-low p-5"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-corner-full bg-primary text-label-large text-on-primary">
                  {index + 1}
                </span>
                <h3 className="text-title-medium text-on-surface">{step.title}</h3>
              </div>
              <p className="text-body-medium text-on-surface-variant">{step.description}</p>
              <CodeBlock
                code={step.code}
                html={stepHtml[index]}
                lang={step.lang}
                title={step.fileLabel}
              />
            </li>
          ))}
        </ol>
      </section>

      {/* Browse components — shared gallery */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-headline-medium text-on-surface">Browse components</h2>
          <p className="max-w-2xl text-body-large text-on-surface-variant">
            {COMPONENT_PAGE_COUNT} components across {CATEGORY_COUNT} categories — each with live
            examples, M3 specs and a full props reference, plus an interactive playground on
            supported components.
          </p>
        </div>
        <ComponentGallery groupHeadingTag="h3" />
      </section>
    </div>
  );
}

import type { Metadata } from 'next';
import {
  COMPONENT_PAGES,
  type ComponentGroup,
  type ComponentPageMeta,
} from '../../../content/components/registry';

export const metadata: Metadata = { title: 'Components' };

/** Group order for the gallery; only groups with registered pages are rendered. */
const GROUP_ORDER: ComponentGroup[] = [
  'Actions',
  'Inputs & selection',
  'Containment & overlays',
  'Navigation',
  'Feedback & pickers',
  'Primitives',
];

function pagesByGroup(): [ComponentGroup, ComponentPageMeta[]][] {
  return GROUP_ORDER.map((group): [ComponentGroup, ComponentPageMeta[]] => [
    group,
    COMPONENT_PAGES.filter((page) => page.group === group),
  ]).filter(([, pages]) => pages.length > 0);
}

export default function ComponentsPage() {
  const groups = pagesByGroup();

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-10">
      <header className="flex flex-col gap-3">
        <h1 className="text-headline-large text-on-surface">Components</h1>
        <p className="text-body-large text-on-surface-variant">
          Every component is built with <code className="text-on-surface">@vkieu/mui</code>, with a
          generated props table and live examples. Pick one to see its API and behaviour.
        </p>
      </header>

      {groups.map(([group, pages]) => (
        <section key={group} className="flex flex-col gap-4">
          <h2 className="text-headline-small text-on-surface">{group}</h2>
          <ul className="grid grid-cols-1 gap-4 medium:grid-cols-2">
            {pages.map((page) => (
              <li key={page.slug}>
                <a
                  href={`/components/${page.slug}`}
                  className="state-layer focus-ring flex h-full flex-col gap-1 rounded-corner-large border border-outline-variant bg-surface p-4"
                >
                  <span className="text-title-medium text-on-surface">{page.title}</span>
                  <span className="text-body-medium text-on-surface-variant">{page.summary}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </article>
  );
}

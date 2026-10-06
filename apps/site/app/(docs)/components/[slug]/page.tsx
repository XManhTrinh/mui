import { PropsTable } from '@vkieu/mui/vk';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  COMPONENT_PAGES,
  COMPONENT_PAGE_MAP,
  COMPONENT_SLOTS,
} from '../../../../content/components/registry';
import { readComponentPropsSafe } from '../../../../lib/component-props';

interface PageParams {
  params: Promise<{ slug: string }>;
}

/** Statically generates one page per registered component (required by `output: 'export'`). */
export function generateStaticParams() {
  return COMPONENT_PAGES.map((page) => ({ slug: page.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const page = COMPONENT_PAGE_MAP[slug];
  return { title: page ? `${page.title} — Components` : 'Components' };
}

export default async function ComponentPage({ params }: PageParams) {
  const { slug } = await params;
  const page = COMPONENT_PAGE_MAP[slug];
  if (!page) notFound();
  const { title, summary, propsComponents, Body } = page;

  // Read every component's generated props JSON at build time; a missing file is skipped.
  const tables = await Promise.all(
    propsComponents.map(async (name) => ({
      name,
      json: await readComponentPropsSafe(name),
      slots: COMPONENT_SLOTS[name],
    })),
  );

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-10">
      <header className="flex flex-col gap-3">
        <h1 className="text-headline-large text-on-surface">{title}</h1>
        <p className="text-body-large text-on-surface-variant">{summary}</p>
      </header>

      <Body />

      <section className="flex flex-col gap-6">
        <h2 className="text-headline-small text-on-surface">Props</h2>
        {tables.map(({ name, json, slots }) => {
          if (!json) {
            console.warn(`[components] no generated props JSON for "${name}"; skipping its table.`);
            return null;
          }
          return (
            <div key={name} className="flex flex-col gap-3">
              <PropsTable caption={`${name} props`} rows={json.props} />
              {slots && slots.length > 0 && (
                <p className="text-body-medium text-on-surface-variant">
                  <span className="text-on-surface">{name} classNames slots:</span>{' '}
                  {slots.map((slot, index) => (
                    <span key={slot}>
                      {index > 0 && ', '}
                      <code className="text-on-surface">{slot}</code>
                    </span>
                  ))}
                </p>
              )}
            </div>
          );
        })}
      </section>
    </article>
  );
}

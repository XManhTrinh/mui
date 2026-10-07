import type { Metadata } from 'next';
import { ComponentGallery } from '../../../components/gallery';

export const metadata: Metadata = { title: 'Components' };

export default function ComponentsPage() {
  return (
    <article className="mx-auto flex max-w-6xl flex-col gap-10">
      <header className="flex flex-col gap-3">
        <h1 className="text-headline-large text-on-surface">Components</h1>
        <p className="text-body-large text-on-surface-variant">
          Every component is built with <code className="text-on-surface">@vkieu/mui</code>, with a
          generated props table and live examples. Pick one to see its API and behaviour.
        </p>
      </header>

      <ComponentGallery groupHeadingTag="h2" />
    </article>
  );
}

'use client';

import { Tab, Tabs } from '@vkieu/mui';
import { CodeBlock } from '@vkieu/mui/vk';
import type { ReactNode } from 'react';

export interface ExampleViewerProps {
  /** Optional heading shown above the example. */
  title?: string;
  /** The live preview — a rendered instance of the example component. */
  children: ReactNode;
  /** Raw example source, copied by the `CodeBlock` and used when `html` is absent. */
  code: string;
  /** Build-time Shiki markup for `code` (from `highlightSource`). */
  html: string;
  /** @default "tsx" */
  lang?: string;
  /** File name shown in the `CodeBlock` header, e.g. `button-variants.tsx`. */
  fileName?: string;
  /**
   * Shows the preview and the source in `Preview` / `Code` tabs instead of stacked. Use
   * where a single demo would otherwise take a lot of vertical space. @default false
   */
  tabbed?: boolean;
}

/**
 * A documentation example viewer: a live preview on a surface with its source below (or in
 * `Preview` / `Code` tabs when `tabbed`). Composed only from `@vkieu/mui` (`Tabs`, `Tab`),
 * `@vkieu/mui/vk` (`CodeBlock`) and semantic-token markup, so it honours "only our
 * components". `'use client'` because `Tabs` is interactive.
 */
export function ExampleViewer({
  title,
  children,
  code,
  html,
  lang = 'tsx',
  fileName,
  tabbed = false,
}: ExampleViewerProps) {
  const preview = (
    <div className="flex flex-wrap items-center gap-4 rounded-corner-large border border-outline-variant bg-surface p-4">
      {children}
    </div>
  );
  const source = <CodeBlock code={code} html={html} lang={lang} title={fileName} />;

  return (
    <div className="flex flex-col gap-3">
      {title != null && <h3 className="text-title-medium text-on-surface">{title}</h3>}
      {tabbed ? (
        <Tabs aria-label={title ? `${title} example` : 'Example'}>
          <Tab key="preview" title="Preview">
            <div className="pt-4">{preview}</div>
          </Tab>
          <Tab key="code" title="Code">
            <div className="pt-4">{source}</div>
          </Tab>
        </Tabs>
      ) : (
        <>
          {preview}
          {source}
        </>
      )}
    </div>
  );
}

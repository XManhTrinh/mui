import { ExampleViewer } from '../../components/example-viewer';
import { LinkInText } from '../../examples/link/link-in-text';
import { LinkPlain } from '../../examples/link/link-plain';
import { LinkStandalone } from '../../examples/link/link-standalone';
import { readExampleSource } from '../../lib/example-source';
import { highlightSource } from '../../lib/highlight';

/** Link page body: when to use it, examples, accessibility and tokens. */
export async function LinkBody() {
  const [inText, standalone, plain] = await Promise.all([
    readExampleSource('link/link-in-text.tsx'),
    readExampleSource('link/link-standalone.tsx'),
    readExampleSource('link/link-plain.tsx'),
  ]);
  const [inTextHtml, standaloneHtml, plainHtml] = await Promise.all([
    highlightSource(inText),
    highlightSource(standalone),
    highlightSource(plain),
  ]);

  return (
    <>
      <section className="flex flex-col gap-3">
        <h2 className="text-headline-small text-on-surface">Purpose</h2>
        <p className="text-body-large text-on-surface-variant">
          A link is navigation written as text: inside a sentence, as a name, or on a line of its
          own. It is <strong className="text-on-surface">not an M3 component</strong>: M3 leaves
          text links to the platform, so it comes from{' '}
          <code className="text-on-surface">@vkieu/mui/vk</code>, built from M3&apos;s colour roles,
          type scale and focus indicator, and routed like every library link.
        </p>
        <p className="text-body-large text-on-surface-variant">
          For a section&apos;s or a dialog&apos;s action (&quot;See all&quot;, &quot;Edit
          profile&quot;), use a text <code className="text-on-surface">Button</code> with{' '}
          <code className="text-on-surface">href</code>. When a whole card or row goes somewhere,
          give the <code className="text-on-surface">Card</code> or{' '}
          <code className="text-on-surface">ListItem</code> an{' '}
          <code className="text-on-surface">href</code>.
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-headline-small text-on-surface">Examples</h2>
        <ExampleViewer
          title="In running text"
          code={inText}
          html={inTextHtml}
          fileName="link-in-text.tsx"
        >
          <LinkInText />
        </ExampleViewer>
        <ExampleViewer
          title="Standalone and on colour"
          code={standalone}
          html={standaloneHtml}
          fileName="link-standalone.tsx"
        >
          <LinkStandalone />
        </ExampleViewer>
        <ExampleViewer
          title="Around a logo or a photo tile"
          code={plain}
          html={plainHtml}
          fileName="link-plain.tsx"
        >
          <LinkPlain />
        </ExampleViewer>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-headline-small text-on-surface">Keyboard &amp; screen reader</h2>
        <ul className="flex flex-col gap-2 ps-5 text-body-large text-on-surface-variant [&>li]:list-disc">
          <li>Tab reaches every link; Enter follows it. Keyboard focus shows the M3 focus ring.</li>
          <li>
            Links in text are underlined (WCAG 1.4.1); standalone links underline on hover, focus
            and press.
          </li>
          <li>
            <code className="text-on-surface">external</code> (or{' '}
            <code className="text-on-surface">target=&quot;_blank&quot;</code>) adds &quot;opens in
            a new tab&quot; for screen readers, translatable through{' '}
            <code className="text-on-surface">labels.newTab</code>.
          </li>
          <li>
            In forced-colours mode links use the system link colour and are always underlined.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-headline-small text-on-surface">Theming &amp; tokens</h2>
        <p className="text-body-large text-on-surface-variant">
          The colour is <code className="text-on-surface">primary</code> (or the text&apos;s, with{' '}
          <code className="text-on-surface">tone=&quot;inherit&quot;</code>). Set{' '}
          <code className="text-on-surface">--vk-link-color</code>,{' '}
          <code className="text-on-surface">--vk-link-underline-thickness</code> or{' '}
          <code className="text-on-surface">--vk-link-underline-offset</code> on a link or an
          ancestor.
        </p>
      </section>
    </>
  );
}

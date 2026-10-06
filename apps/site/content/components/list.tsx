import { ExampleViewer } from '../../components/example-viewer';
import { ListInteractive } from '../../examples/list/list-interactive';
import { ListStatic } from '../../examples/list/list-static';
import { readExampleSource } from '../../lib/example-source';
import { highlightSource } from '../../lib/highlight';

/** List page body: static and interactive lists. */
export async function ListBody() {
  const [staticSrc, interactive] = await Promise.all([
    readExampleSource('list/list-static.tsx'),
    readExampleSource('list/list-interactive.tsx'),
  ]);
  const [staticHtml, interactiveHtml] = await Promise.all([
    highlightSource(staticSrc),
    highlightSource(interactive),
  ]);

  return (
    <>
      <section className="flex flex-col gap-3">
        <h2 className="text-headline-small text-on-surface">Purpose</h2>
        <p className="text-body-large text-on-surface-variant">
          A list presents a vertical set of items, each with a headline and optional overline,
          supporting text and leading or trailing content. Use it for rows that stay visible; for a
          temporary set of choices anchored to a button use a <code className="text-on-surface">Menu</code>.
        </p>
        <p className="text-body-large text-on-surface-variant">
          <code className="text-on-surface">List</code> holds <code className="text-on-surface">ListItem</code>{' '}
          children identified by a React <code className="text-on-surface">key</code>. The{' '}
          <code className="text-on-surface">variant</code> is <code className="text-on-surface">standard</code>{' '}
          (flush) or <code className="text-on-surface">segmented</code> (rounded groups 2px apart).
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-headline-small text-on-surface">Examples</h2>
        <ExampleViewer title="Static list" code={staticSrc} html={staticHtml} fileName="list-static.tsx">
          <ListStatic />
        </ExampleViewer>
        <ExampleViewer
          title="Interactive list"
          code={interactive}
          html={interactiveHtml}
          fileName="list-interactive.tsx"
        >
          <ListInteractive />
        </ExampleViewer>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-headline-small text-on-surface">Keyboard &amp; screen reader</h2>
        <ul className="flex flex-col gap-2 ps-5 text-body-large text-on-surface-variant [&>li]:list-disc">
          <li>With <code className="text-on-surface">onAction</code>, <code className="text-on-surface">selectionMode</code> or link items the list is a grid list: ↑ / ↓ move between items, ← / → reach a trailing control (such as a switch), and typeahead jumps by headline.</li>
          <li>Press or Enter fires <code className="text-on-surface">onAction</code> with the item&apos;s key; in a selectable list it toggles selection (<code className="text-on-surface">selectedKeys</code> / <code className="text-on-surface">onSelectionChange</code>, <code className="text-on-surface">disabledKeys</code>).</li>
          <li>Without those props the list is a plain <code className="text-on-surface">ul</code> that nothing focuses.</li>
          <li>A name is required (<code className="text-on-surface">aria-label</code> or <code className="text-on-surface">aria-labelledby</code>); give a non-string headline a <code className="text-on-surface">textValue</code> for typeahead and announcements.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-headline-small text-on-surface">Differences from Compose</h2>
        <ul className="flex flex-col gap-2 ps-5 text-body-large text-on-surface-variant [&>li]:list-disc">
          <li>Heights follow Compose: at least 56px (one line), 72px (overline or supporting text) and 88px (both); three-line items align to the top, others to the centre.</li>
          <li>The two forms cover Compose&apos;s clickable, selectable and checkable <code className="text-on-surface">ListItem</code> overloads and <code className="text-on-surface">SegmentedListItem</code>.</li>
          <li>Shape precedence (pressed, then selected or focused at 16px, then hovered at 12px, else 4px) is computed into one <code className="text-on-surface">data-shape</code> that morphs on the fast spatial spring; segmented groups round their outer corners.</li>
          <li>Deviation: standard items are transparent rather than Compose&apos;s <code className="text-on-surface">surface</code>, so a list takes the colour of its sheet, card or pane. Not in v1: drag-to-reorder, swipe-to-reveal and expandable items.</li>
        </ul>
      </section>
    </>
  );
}

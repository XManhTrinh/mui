import { ExampleViewer } from '../../components/example-viewer';
import { DialogAlert } from '../../examples/dialog/dialog-alert';
import { DialogBasic } from '../../examples/dialog/dialog-basic';
import { readExampleSource } from '../../lib/example-source';
import { highlightSource } from '../../lib/highlight';

/** Dialog page body: the flat parts, basic and alert dialogs. */
export async function DialogBody() {
  const [basic, alert] = await Promise.all([
    readExampleSource('dialog/dialog-basic.tsx'),
    readExampleSource('dialog/dialog-alert.tsx'),
  ]);
  const [basicHtml, alertHtml] = await Promise.all([highlightSource(basic), highlightSource(alert)]);

  return (
    <>
      <section className="flex flex-col gap-3">
        <h2 className="text-headline-small text-on-surface">Purpose</h2>
        <p className="text-body-large text-on-surface-variant">
          A dialog is a modal surface that interrupts the user for a focused task or an important
          decision. Use a basic dialog for a short task the user can dismiss; use{' '}
          <code className="text-on-surface">role=&quot;alertdialog&quot;</code> for a decision they
          must make. For non-blocking supplementary content prefer a sheet, and for a brief message
          prefer a snackbar.
        </p>
        <p className="text-body-large text-on-surface-variant">
          A dialog is a component, not a composite: open it from a{' '}
          <code className="text-on-surface">DialogTrigger</code> (trigger first, dialog second) or
          control it with <code className="text-on-surface">open</code> /{' '}
          <code className="text-on-surface">onOpenChange</code>. Its anatomy is the flat parts{' '}
          <code className="text-on-surface">DialogTitle</code>,{' '}
          <code className="text-on-surface">DialogContent</code> and{' '}
          <code className="text-on-surface">DialogActions</code>.
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-headline-small text-on-surface">Examples</h2>
        <ExampleViewer title="Basic dialog" code={basic} html={basicHtml} fileName="dialog-basic.tsx">
          <DialogBasic />
        </ExampleViewer>
        <ExampleViewer title="Alert dialog" code={alert} html={alertHtml} fileName="dialog-alert.tsx">
          <DialogAlert />
        </ExampleViewer>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-headline-small text-on-surface">Keyboard &amp; screen reader</h2>
        <ul className="flex flex-col gap-2 ps-5 text-body-large text-on-surface-variant [&>li]:list-disc">
          <li>Opening the dialog moves focus into it and contains focus there; closing it returns focus to the trigger. The page behind does not scroll and is hidden from assistive tech.</li>
          <li>The <code className="text-on-surface">DialogTitle</code> names the dialog (or supply <code className="text-on-surface">aria-label</code>). An <code className="text-on-surface">icon</code> is decorative and centres the title.</li>
          <li>Escape closes the dialog unless <code className="text-on-surface">keyboardDismissDisabled</code> is set; a basic dialog also closes on a press outside, while an <code className="text-on-surface">alertdialog</code> does not.</li>
          <li>Long content scrolls inside the panel; when the actions don&apos;t fit on one line they stack with the confirming action (last) on top.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-headline-small text-on-surface">Differences from Compose</h2>
        <ul className="flex flex-col gap-2 ps-5 text-body-large text-on-surface-variant [&>li]:list-disc">
          <li>Values follow Compose&apos;s <code className="text-on-surface">AlertDialog.kt</code> and the dialog tokens: 280–560px wide, 24px padding, 28px corners, <code className="text-on-surface">surface-container-high</code> at level 3, a 32% scrim.</li>
          <li>Stacked actions put the confirm action on top, matching Compose&apos;s flipped <code className="text-on-surface">FlowRow</code>.</li>
          <li>Motion is not from Compose (which uses platform window animations): the panel fades and scales from 90% on enter and to 95% on exit, on a wrapper that rests at <code className="text-on-surface">scale: none</code> so it is not a lasting containing block for fixed children.</li>
          <li>Moved to the components layer because its core is the <code className="text-on-surface">Overlay</code> primitive and React Aria hooks. Full-screen dialogs are deferred.</li>
        </ul>
      </section>
    </>
  );
}

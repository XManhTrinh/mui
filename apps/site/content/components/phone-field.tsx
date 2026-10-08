import { ExampleViewer } from '../../components/example-viewer';
import { PhoneFieldFlags } from '../../examples/phone-field/phone-field-flags';
import { PhoneFieldSignup } from '../../examples/phone-field/phone-field-signup';
import { PhoneFieldVariants } from '../../examples/phone-field/phone-field-variants';
import { readExampleSource } from '../../lib/example-source';
import { highlightSource } from '../../lib/highlight';

const EXAMPLES = [
  {
    file: 'phone-field-signup.tsx',
    title: 'An optional phone at sign-up',
    Example: PhoneFieldSignup,
  },
  { file: 'phone-field-variants.tsx', title: 'Outlined or filled', Example: PhoneFieldVariants },
  {
    file: 'phone-field-flags.tsx',
    title: 'Flags, when the app wants them',
    Example: PhoneFieldFlags,
  },
];

/** Phone field page body: purpose, examples, accessibility and theming. */
export async function PhoneFieldBody() {
  const sources = await Promise.all(
    EXAMPLES.map((example) => readExampleSource(`phone-field/${example.file}`)),
  );
  const highlighted = await Promise.all(sources.map((source) => highlightSource(source)));

  return (
    <>
      <section className="flex flex-col gap-3">
        <h2 className="text-headline-small text-on-surface">Purpose</h2>
        <p className="text-body-large text-on-surface-variant">
          A phone field takes a phone number with its country: people pick their country (or a
          pasted or autofilled <code className="text-on-surface">+…</code> number picks it), type
          the number in their country&apos;s usual format, and the app gets one international{' '}
          <code className="text-on-surface">E.164</code> value such as{' '}
          <code className="text-on-surface">+447911123456</code>. It is{' '}
          <strong className="text-on-surface">not an M3 component</strong>: it comes from{' '}
          <code className="text-on-surface">@vkieu/mui/vk</code>, and its number is the
          library&apos;s Text field.
        </p>
        <p className="text-body-large text-on-surface-variant">
          The phone rules come from <code className="text-on-surface">libphonenumber-js</code>{' '}
          (Google&apos;s phone data), loaded only on pages that use the field. Country names come
          from the browser in the page&apos;s language, so no names ship with the library. Servers
          can check a value the same way with <code className="text-on-surface">phoneProblem</code>.
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-headline-small text-on-surface">Examples</h2>
        {EXAMPLES.map(({ file, title, Example }, index) => (
          <ExampleViewer
            key={file}
            title={title}
            code={sources[index]!}
            html={highlighted[index]!}
            fileName={file}
          >
            <Example />
          </ExampleViewer>
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-headline-small text-on-surface">Keyboard &amp; screen reader</h2>
        <ul className="flex flex-col gap-2 ps-5 text-body-large text-on-surface-variant [&>li]:list-disc">
          <li>
            The country button is named with the country and its code (&quot;Country: United Kingdom
            (+44)&quot;) and opens a labelled dialog.
          </li>
          <li>
            In the list, the search field keeps focus: type a name, ISO code or dialling code
            (&quot;viet&quot;, &quot;VN&quot;, &quot;84&quot;), move with the arrow keys, press
            Enter to choose or Escape to close. Focus then returns to the country button, with the
            number next.
          </li>
          <li>
            The number uses <code className="text-on-surface">type=&quot;tel&quot;</code>, the phone
            keypad and <code className="text-on-surface">autocomplete=&quot;tel&quot;</code>, so
            browsers can fill the whole number. An invalid number is announced when the field loses
            focus.
          </li>
          <li>
            On compact windows the list opens in a bottom sheet; on larger ones, in a popover by the
            button. The dial code and the number read left to right in right-to-left layouts.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-headline-small text-on-surface">Theming</h2>
        <ul className="flex flex-col gap-2 ps-5 text-body-large text-on-surface-variant [&>li]:list-disc">
          <li>
            The country field uses the Text field&apos;s tokens in both variants: the{' '}
            <code className="text-on-surface">outline</code> or filled container, 2px{' '}
            <code className="text-on-surface">primary</code> when focused or open, and{' '}
            <code className="text-on-surface">error</code> when the number is invalid.
          </li>
          <li>
            The list is a <code className="text-on-surface">surface-container</code> panel at
            elevation 2, with the chosen country in{' '}
            <code className="text-on-surface">secondary-container</code> and state layers for hover
            and keyboard focus.
          </li>
        </ul>
      </section>
    </>
  );
}

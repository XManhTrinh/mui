import { AssistChip, Button, Card, Switch } from '@vkieu/mui';
import { CodeBlock } from '@vkieu/mui/vk';
import { highlightSource } from '../lib/highlight';

const INSTALL_SNIPPET = `pnpm add @vkieu/mui`;

const CSS_SNIPPET = `@import "tailwindcss";
@import "@vkieu/mui/styles.css";
@source "../node_modules/@vkieu/mui";`;

export default async function HomePage() {
  const [installHtml, cssHtml] = await Promise.all([
    highlightSource(INSTALL_SNIPPET, 'bash'),
    highlightSource(CSS_SNIPPET, 'css'),
  ]);

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-12 p-6">
      <section className="flex flex-col gap-4 pt-8">
        <h1 className="text-display-small text-on-surface">@vkieu/mui</h1>
        <p className="max-w-2xl text-body-large text-on-surface-variant">
          A React component library implementing Material Design 3 Expressive, built on React
          Aria, Tailwind CSS v4 and Motion. Six themes, light and dark, three contrast levels and
          two motion schemes — all driven by semantic tokens.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="filled" href="/getting-started">
            Get started
          </Button>
          <Button variant="outlined" href="/components">
            Browse components
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-headline-small text-on-surface">Quick start</h2>
        <p className="max-w-2xl text-body-large text-on-surface-variant">
          Install the package, then import the stylesheet into your Tailwind entry.
        </p>
        <CodeBlock code={INSTALL_SNIPPET} html={installHtml} lang="bash" title="Terminal" />
        <CodeBlock code={CSS_SNIPPET} html={cssHtml} lang="css" title="app.css" />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-headline-small text-on-surface">A preview of the kit</h2>
        <div className="grid grid-cols-1 gap-4 medium:grid-cols-3">
          <Card variant="elevated" className="flex flex-col gap-3 p-4">
            <h3 className="text-title-medium text-on-surface">Buttons</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="filled">Filled</Button>
              <Button variant="tonal">Tonal</Button>
              <Button variant="outlined">Outlined</Button>
            </div>
          </Card>
          <Card variant="filled" className="flex flex-col gap-3 p-4">
            <h3 className="text-title-medium text-on-surface">Chips</h3>
            <div className="flex flex-wrap gap-2">
              <AssistChip>Themes</AssistChip>
              <AssistChip>Motion</AssistChip>
              <AssistChip>Tokens</AssistChip>
            </div>
          </Card>
          <Card variant="outlined" className="flex flex-col gap-3 p-4">
            <h3 className="text-title-medium text-on-surface">Switches</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Switch defaultSelected icons>
                Wi-Fi
              </Switch>
              <Switch icons>Bluetooth</Switch>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}

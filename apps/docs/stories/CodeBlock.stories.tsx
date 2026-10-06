import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodeBlock } from '@vkieu/mui/vk';

/**
 * A small pre-generated Shiki markup constant (the inner `<code>` token spans), so the
 * story needs no Shiki dependency and snapshots stay deterministic. Token colours
 * reference the `--shiki-*` custom properties the component binds to semantic roles.
 */
const SAMPLE_CODE = `import { Button } from '@vkieu/mui';

export function Save() {
  // Persist the draft
  return <Button variant="filled">Save</Button>;
}`;

const kw = (text: string) => `<span style="color:var(--shiki-token-keyword)">${text}</span>`;
const str = (text: string) => `<span style="color:var(--shiki-token-string)">${text}</span>`;
const fn = (text: string) => `<span style="color:var(--shiki-token-function)">${text}</span>`;
const com = (text: string) => `<span style="color:var(--shiki-token-comment)">${text}</span>`;
const fg = (text: string) => `<span style="color:var(--shiki-foreground)">${text}</span>`;

const SAMPLE_HTML =
  `<span class="line">${kw('import')}${fg(' { Button } ')}${kw('from')}${fg(' ')}${str("'@vkieu/mui'")}${fg(';')}</span>\n` +
  `<span class="line"></span>\n` +
  `<span class="line">${kw('export')}${fg(' ')}${kw('function')}${fg(' ')}${fn('Save')}${fg('() {')}</span>\n` +
  `<span class="line">${fg('  ')}${com('// Persist the draft')}</span>\n` +
  `<span class="line">${fg('  ')}${kw('return')}${fg(' <')}${fn('Button')}${fg(' variant=')}${str('"filled"')}${fg('>Save</')}${fn('Button')}${fg('>;')}</span>\n` +
  `<span class="line">${fg('}')}</span>`;

const meta = {
  title: 'VK/CodeBlock',
  component: CodeBlock,
  args: {
    code: SAMPLE_CODE,
    html: SAMPLE_HTML,
    lang: 'tsx',
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-2xl" data-testid="code-block">
      <CodeBlock {...args} />
    </div>
  ),
};

/** With a file-name title and the copy button. */
export const WithTitle: Story = {
  args: { title: 'Save.tsx' },
  render: (args) => (
    <div className="max-w-2xl" data-testid="code-block">
      <CodeBlock {...args} />
    </div>
  ),
};

/** Line numbers rendered from a CSS counter on each `.line`. */
export const LineNumbers: Story = {
  args: { title: 'Save.tsx', showLineNumbers: true },
  render: (args) => (
    <div className="max-w-2xl" data-testid="code-block">
      <CodeBlock {...args} />
    </div>
  ),
};

/** No header: just the highlighted block. */
export const NoHeader: Story = {
  args: { copyable: false },
  render: (args) => (
    <div className="max-w-2xl" data-testid="code-block">
      <CodeBlock {...args} />
    </div>
  ),
};

/** Token colours across the semantic roles the component maps Shiki tokens to. */
export const TokenColours: Story = {
  args: { title: 'tokens.tsx' },
  render: (args) => (
    <div className="max-w-2xl" data-testid="code-block">
      <CodeBlock {...args} />
    </div>
  ),
};

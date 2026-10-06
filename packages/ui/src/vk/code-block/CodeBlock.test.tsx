import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../../test/axe';
import { CodeBlock } from './CodeBlock';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('CodeBlock', () => {
  it('renders a header with the title and a pre > code', () => {
    render(<CodeBlock code="const a = 1;" title="example.ts" />);
    expect(screen.getByText('example.ts')).toBeInTheDocument();
    const code = document.querySelector('pre > code');
    expect(code).not.toBeNull();
    expect(code).toHaveTextContent('const a = 1;');
  });

  it('makes the scrolling source a named, focusable region that reads left to right', async () => {
    render(<CodeBlock code="const a = 1;" lang="tsx" copyable={false} />);
    const region = screen.getByRole('region', { name: 'tsx code' });
    expect(region.tagName).toBe('PRE');
    expect(region).toHaveAttribute('dir', 'ltr');
    expect(region).toHaveClass('focus-ring-inset', 'overflow-x-auto');
    await userEvent.tab();
    expect(region).toHaveFocus();
    expect(region).toHaveAttribute('data-focus-visible', 'true');
  });

  it('renders trusted html inside the code element', () => {
    render(<CodeBlock code="const a = 1;" html='<span class="tok">const</span> a = 1;' />);
    const code = document.querySelector('pre > code');
    expect(code?.querySelector('span.tok')).not.toBeNull();
  });

  it('falls back to plain code text when html is absent', () => {
    render(<CodeBlock code="plain source" />);
    const code = document.querySelector('pre > code');
    expect(code).toHaveTextContent('plain source');
    expect(code?.querySelector('span')).toBeNull();
  });

  it('exposes a copy IconButton named by copyLabel and copies the raw code', async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, 'writeText');
    render(<CodeBlock code="copy me" copyLabel="Copy snippet" copiedLabel="Copied!" />);
    const button = screen.getByRole('button', { name: 'Copy snippet' });
    expect(button.tagName).toBe('BUTTON');

    await user.click(button);
    expect(writeText).toHaveBeenCalledWith('copy me');
    expect(await screen.findByRole('button', { name: 'Copied!' })).toBeInTheDocument();
    expect(document.querySelector('[data-copied]')).not.toBeNull();
  });

  it('does not throw and stays at Copy when the clipboard rejects', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValueOnce(new Error('denied'));
    render(<CodeBlock code="copy me" />);
    await user.click(screen.getByRole('button', { name: 'Copy' }));
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
    expect(document.querySelector('[data-copied]')).toBeNull();
    expect(warn).toHaveBeenCalled();
  });

  it('hides the copy button when copyable is false', () => {
    render(<CodeBlock code="x" title="file.ts" copyable={false} />);
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByText('file.ts')).toBeInTheDocument();
  });

  it('puts className and classNames on the right slots and lets consumer classes win', () => {
    let element: HTMLDivElement | null = null;
    render(
      <CodeBlock
        ref={(node) => {
          element = node;
        }}
        code="x"
        title="t"
        className="rounded-corner-none"
        classNames={{ title: 'text-primary', pre: 'bg-surface' }}
      />,
    );
    const root = element as unknown as HTMLDivElement;
    expect(root).toHaveClass('rounded-corner-none');
    expect(root).not.toHaveClass('rounded-corner-medium');
    expect(screen.getByText('t')).toHaveClass('text-primary');
    expect(document.querySelector('pre')).toHaveClass('bg-surface');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <CodeBlock code="const a = 1;" html='<span class="tok">const</span> a = 1;' title="a.ts" />,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});

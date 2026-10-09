import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../../../test/axe';
import { Button } from '../../components/button/Button';
import { EmptyState } from './EmptyState';

const Icon = () => (
  <svg viewBox="0 0 24 24" data-testid="icon">
    <path d="M0 0h24v24H0z" />
  </svg>
);

const first = (container: HTMLElement) => container.firstElementChild as HTMLElement;
const media = (container: HTMLElement) => first(container).firstElementChild as HTMLElement;

describe('EmptyState', () => {
  it('renders a plain, medium, secondary empty state by default', () => {
    const { container } = render(
      <EmptyState icon={<Icon />} title="No posts yet" description="Posts will appear here." />,
    );
    const root = first(container);
    expect(root.tagName).toBe('DIV');
    expect(root).toHaveAttribute('data-variant', 'plain');
    expect(root).toHaveAttribute('data-size', 'md');
    expect(root).toHaveAttribute('data-tone', 'secondary');
    expect(root).toHaveClass('flex', 'flex-col', 'items-center', 'py-12');
    expect(media(container)).toHaveAttribute('aria-hidden', 'true');
    expect(media(container)).toHaveClass(
      'size-14',
      'rounded-full',
      'bg-secondary-container',
      'text-on-secondary-container',
    );
    expect(screen.getByText('No posts yet')).toHaveClass('text-title-medium', 'text-on-surface');
    expect(screen.getByText('Posts will appear here.')).toHaveClass(
      'text-body-medium',
      'text-on-surface-variant',
    );
  });

  it('wraps a card variant in the matching Card', () => {
    for (const variant of ['filled', 'elevated', 'outlined'] as const) {
      const { container, unmount } = render(
        <EmptyState variant={variant} icon={<Icon />} title="Empty" />,
      );
      const root = first(container);
      expect(root).toHaveAttribute('data-variant', variant);
      expect(root).toHaveClass('rounded-corner-medium', 'items-center');
      expect(root).toHaveClass(
        {
          filled: 'bg-surface-container-highest',
          elevated: 'bg-surface-container-low',
          outlined: 'border-outline-variant',
        }[variant],
      );
      unmount();
    }
  });

  it('follows the type scale and sizes for each size', () => {
    const cases = [
      ['sm', 'size-10', 'text-title-small', 'text-body-small'],
      ['lg', 'size-24', 'text-headline-small', 'text-body-large'],
    ] as const;
    for (const [size, mediaSize, titleRole, descriptionRole] of cases) {
      const { container, unmount } = render(
        <EmptyState size={size} icon={<Icon />} title="Title" description="Description" />,
      );
      expect(media(container)).toHaveClass(mediaSize);
      expect(screen.getByText('Title')).toHaveClass(titleRole);
      expect(screen.getByText('Description')).toHaveClass(descriptionRole);
      unmount();
    }
  });

  it('colours the icon container from the tone', () => {
    const { container } = render(<EmptyState tone="error" icon={<Icon />} title="Couldn't load" />);
    expect(media(container)).toHaveClass('bg-error-container', 'text-on-error-container');
  });

  it('masks the icon container with an Expressive shape', () => {
    const { container } = render(<EmptyState shape="Cookie9Sided" icon={<Icon />} title="Empty" />);
    expect(media(container)).not.toHaveClass('rounded-full');
    expect(media(container).style.maskImage).toMatch(/^url\("data:image\/svg\+xml,/);
  });

  it('renders the title as a heading and announces when asked', () => {
    render(<EmptyState titleAs="h2" announce icon={<Icon />} title="No results" />);
    expect(screen.getByRole('heading', { level: 2, name: 'No results' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('No results');
  });

  it('renders actions and lets consumer classes win', () => {
    const { container } = render(
      <EmptyState
        icon={<Icon />}
        title="Couldn't load"
        actions={<Button variant="tonal">Try again</Button>}
        className="py-2"
        classNames={{ title: 'text-title-large' }}
      />,
    );
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
    expect(first(container)).toHaveClass('py-2');
    expect(first(container)).not.toHaveClass('py-12');
    expect(screen.getByText("Couldn't load")).toHaveClass('text-title-large');
    expect(screen.getByText("Couldn't load")).not.toHaveClass('text-title-medium');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <main>
        <EmptyState
          variant="filled"
          titleAs="h2"
          icon={<Icon />}
          title="No posts yet"
          description="Posts will appear here."
          actions={<Button variant="tonal">Create a post</Button>}
        />
      </main>,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});

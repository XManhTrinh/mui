import { render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../../../test/axe';
import { Skeleton, SkeletonGroup } from './Skeleton';

const first = (container: HTMLElement) => container.firstElementChild as HTMLElement;

describe('Skeleton', () => {
  it('renders a hidden full-width rectangle with a small corner by default', () => {
    const { container } = render(<Skeleton />);
    const root = first(container);
    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(root).toHaveAttribute('data-variant', 'rectangle');
    expect(root).toHaveClass('vk-skeleton', 'h-24', 'w-full', 'rounded-corner-small');
  });

  it('defaults a circle to the full corner', () => {
    const { container } = render(<Skeleton variant="circle" />);
    expect(first(container)).toHaveClass('vk-skeleton', 'size-10', 'rounded-corner-full');
  });

  it('sizes a text line from its type-scale role', () => {
    const { container } = render(<Skeleton variant="text" typescale="title-large" />);
    const root = first(container);
    expect(root).toHaveClass('vk-skeleton', 'bg-clip-content', 'rounded-corner-extra-small');
    expect(root.style.getPropertyValue('--vk-skeleton-line-height')).toBe(
      'var(--md-sys-typescale-title-large-line-height)',
    );
    expect(root.style.getPropertyValue('--vk-skeleton-glyph-size')).toBe(
      'var(--md-sys-typescale-title-large-size)',
    );
    expect(root.children).toHaveLength(0);
  });

  it('defaults text to body-medium', () => {
    const { container } = render(<Skeleton variant="text" />);
    expect(first(container).style.getPropertyValue('--vk-skeleton-line-height')).toBe(
      'var(--md-sys-typescale-body-medium-line-height)',
    );
  });

  it('stacks several lines, with only the lines painted and the last one shorter', () => {
    const { container } = render(<Skeleton variant="text" lines={3} />);
    const root = first(container);
    expect(root).not.toHaveClass('vk-skeleton');
    expect(root).toHaveClass('flex', 'flex-col');
    expect(root.children).toHaveLength(3);
    for (const line of root.children) expect(line).toHaveClass('vk-skeleton', 'last:w-3/5');
  });

  it('treats fewer than one line as one', () => {
    const { container } = render(<Skeleton variant="text" lines={0} />);
    expect(first(container)).toHaveClass('vk-skeleton');
    expect(first(container).children).toHaveLength(0);
  });

  it('sets the fill colour role through the tone', () => {
    const { container: highest } = render(<Skeleton />);
    expect(first(highest)).toHaveClass(
      '[--vk-skeleton-fill:var(--md-sys-color-surface-container-highest)]',
    );
    const { container: high } = render(<Skeleton tone="high" />);
    expect(first(high)).toHaveClass(
      '[--vk-skeleton-fill:var(--md-sys-color-surface-container-high)]',
    );
  });

  it('marks an animation override on the skeleton and each of its lines', () => {
    const { container } = render(<Skeleton variant="text" lines={2} animation="shimmer" />);
    const root = first(container);
    expect(root).toHaveAttribute('data-animation', 'shimmer');
    for (const line of root.children) expect(line).toHaveAttribute('data-animation', 'shimmer');
  });

  it('lets consumer classes win and merges classNames', () => {
    const { container } = render(
      <Skeleton
        variant="text"
        lines={2}
        className="w-40"
        classNames={{ root: 'gap-2', line: 'rounded-corner-full' }}
      />,
    );
    const root = first(container);
    expect(root).toHaveClass('w-40', 'gap-2');
    expect(root).not.toHaveClass('w-full');
    expect(root.firstElementChild).toHaveClass('rounded-corner-full');
    expect(root.firstElementChild).not.toHaveClass('rounded-corner-extra-small');
  });

  it('keeps the consumer style beside the type-scale variables', () => {
    const { container } = render(<Skeleton variant="text" style={{ width: 120 }} />);
    expect(first(container).style.width).toBe('120px');
    expect(first(container).style.getPropertyValue('--vk-skeleton-glyph-size')).not.toBe('');
  });

  it('is a server component with no client code, so it animates in streamed fallbacks', () => {
    const source = readFileSync(resolve('src/vk/skeleton/Skeleton.tsx'), 'utf8');
    expect(source).not.toMatch(/['"]use client['"]/);
    expect(source).not.toMatch(/\buse[A-Z]\w*\(/);
  });
});

describe('SkeletonGroup', () => {
  it('is a busy region with one status label and a pulse by default', () => {
    const { container } = render(
      <SkeletonGroup label="Loading businesses">
        <Skeleton />
        <Skeleton variant="text" lines={2} />
      </SkeletonGroup>,
    );
    const root = first(container);
    expect(root.tagName).toBe('DIV');
    expect(root).toHaveAttribute('aria-busy', 'true');
    expect(root).toHaveAttribute('data-skeleton-animation', 'pulse');
    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(screen.getByRole('status')).toHaveTextContent('Loading businesses');
    expect(screen.getByRole('status')).toHaveClass('sr-only');
  });

  it('sets the animation for the skeletons inside', () => {
    const { container } = render(
      <SkeletonGroup label="Loading" animation="shimmer">
        <Skeleton />
      </SkeletonGroup>,
    );
    expect(first(container)).toHaveAttribute('data-skeleton-animation', 'shimmer');
  });

  it('renders as a list with the label in its own item', () => {
    const { container } = render(
      <SkeletonGroup label="Loading jobs" as="ul">
        <li>
          <Skeleton />
        </li>
      </SkeletonGroup>,
    );
    const root = first(container);
    expect(root.tagName).toBe('UL');
    for (const child of root.children) expect(child.tagName).toBe('LI');
  });

  it('merges className and classNames', () => {
    const { container } = render(
      <SkeletonGroup label="Loading" className="grid" classNames={{ label: 'text-body-small' }} />,
    );
    expect(first(container)).toHaveClass('grid');
    expect(screen.getByRole('status')).toHaveClass('sr-only', 'text-body-small');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <SkeletonGroup label="Loading businesses" as="section" aria-label="Businesses">
        <Skeleton variant="circle" />
        <Skeleton variant="text" typescale="title-medium" />
        <Skeleton variant="text" lines={3} />
      </SkeletonGroup>,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});

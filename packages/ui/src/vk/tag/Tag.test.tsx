import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../../../test/axe';
import { Tag } from './Tag';
import { TagGroup } from './TagGroup';

const Star = () => (
  <svg viewBox="0 0 24 24">
    <path d="M0 0h24v24H0z" />
  </svg>
);

const root = (container: HTMLElement) => container.firstElementChild as HTMLElement;

describe('Tag', () => {
  it('is a tonal, neutral, medium pill by default, with no role and no focus', () => {
    const { container } = render(<Tag>Draft</Tag>);
    const tag = root(container);
    expect(tag.tagName).toBe('SPAN');
    expect(tag).not.toHaveAttribute('role');
    expect(tag).not.toHaveAttribute('tabindex');
    expect(tag).toHaveAttribute('data-variant', 'tonal');
    expect(tag).toHaveAttribute('data-tone', 'neutral');
    expect(tag).toHaveAttribute('data-size', 'md');
    expect(tag).toHaveAttribute('data-shape', 'full');
    expect(tag.className).toContain('var(--md-sys-color-surface-container-highest)');
    expect(tag.className).toContain('var(--md-sys-shape-corner-full)');
    expect(tag).toHaveTextContent('Draft');
  });

  it('draws a dot or a decorative icon', () => {
    const { container, rerender } = render(
      <Tag dot tone="success">
        Open now
      </Tag>,
    );
    const dot = root(container).firstElementChild as HTMLElement;
    expect(dot).toHaveAttribute('aria-hidden', 'true');
    expect(dot.className).toContain('var(--md-sys-color-success)');
    rerender(<Tag icon={<Star />}>Featured</Tag>);
    expect(root(container).querySelector('svg')?.parentElement).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('reads the full name for a short label and shows it on hover', () => {
    const { container } = render(
      <Tag size="sm" tone="tertiary" fullLabel="Expressive">
        M3E
      </Tag>,
    );
    expect(root(container)).toHaveAttribute('title', 'Expressive');
    expect(screen.getByText('M3E')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('Expressive')).toHaveClass('sr-only');
  });

  it('truncates past maxWidth and puts the text in title', () => {
    const { container } = render(<Tag maxWidth="6rem">Vietnamese groceries</Tag>);
    expect(root(container).style.maxWidth).toBe('6rem');
    expect(root(container)).toHaveAttribute('title', 'Vietnamese groceries');
    expect(screen.getByText('Vietnamese groceries')).toHaveClass('truncate');
  });

  it('lets consumer classes and token variables win', () => {
    const { container } = render(
      <Tag className="[--vk-tag-container:red] px-2" classNames={{ label: 'uppercase' }}>
        Sale
      </Tag>,
    );
    expect(root(container)).toHaveClass('[--vk-tag-container:red]', 'px-2');
    expect(root(container).className).not.toContain('px-[var(--vk-tag-padding-inline');
    expect(screen.getByText('Sale')).toHaveClass('uppercase');
  });

  it('groups tags in a labelled list', () => {
    render(
      <TagGroup aria-label="Job details">
        <Tag>Full-time</Tag>
        <Tag tone="primary">£12–14 an hour</Tag>
      </TagGroup>,
    );
    const list = screen.getByRole('list', { name: 'Job details' });
    expect(list.querySelectorAll('li')).toHaveLength(2);
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <main>
        <TagGroup aria-label="Listing">
          <Tag variant="filled" tone="error">
            Sold
          </Tag>
          <Tag dot tone="success">
            Open now
          </Tag>
          <Tag variant="outlined" tone="warning" icon={<Star />}>
            Pending
          </Tag>
          <Tag size="sm" fullLabel="Expressive">
            M3E
          </Tag>
        </TagGroup>
      </main>,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});

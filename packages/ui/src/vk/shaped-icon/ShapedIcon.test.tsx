import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../../../test/axe';
import { ShapedIcon } from './ShapedIcon';

const Icon = () => <svg viewBox="0 0 24 24" data-testid="icon" />;
const root = (container: HTMLElement) => container.firstElementChild as HTMLElement;

describe('ShapedIcon', () => {
  it('is a decorative medium circle in the secondary container colours by default', () => {
    const { container } = render(
      <ShapedIcon>
        <Icon />
      </ShapedIcon>,
    );
    expect(root(container)).toHaveAttribute('aria-hidden', 'true');
    expect(root(container)).toHaveAttribute('data-shape', 'circle');
    expect(root(container)).toHaveClass(
      'size-14',
      'rounded-full',
      'bg-secondary-container',
      'text-on-secondary-container',
    );
    expect(screen.getByTestId('icon').parentElement).toHaveClass('size-7');
  });

  it('sizes the container and icon for each size', () => {
    const cases = [
      ['sm', 'size-10', 'size-6'],
      ['md', 'size-14', 'size-7'],
      ['lg', 'size-16', 'size-8'],
      ['xl', 'size-24', 'size-12'],
    ] as const;
    for (const [size, box, icon] of cases) {
      const { container, unmount } = render(
        <ShapedIcon size={size}>
          <Icon />
        </ShapedIcon>,
      );
      expect(root(container)).toHaveClass(box);
      expect(root(container).firstElementChild).toHaveClass(icon);
      unmount();
    }
  });

  it('takes each tone’s container colour roles', () => {
    const cases = [
      ['primary', 'bg-primary-container', 'text-on-primary-container'],
      ['tertiary', 'bg-tertiary-container', 'text-on-tertiary-container'],
      ['neutral', 'bg-surface-container-highest', 'text-on-surface-variant'],
      ['error', 'bg-error-container', 'text-on-error-container'],
    ] as const;
    for (const [tone, background, foreground] of cases) {
      const { container, unmount } = render(
        <ShapedIcon tone={tone}>
          <Icon />
        </ShapedIcon>,
      );
      expect(root(container)).toHaveClass(background, foreground);
      unmount();
    }
  });

  it('masks the container with an Expressive shape', () => {
    const { container } = render(
      <ShapedIcon shape="Cookie9Sided" style={{ margin: 4 }}>
        <Icon />
      </ShapedIcon>,
    );
    expect(root(container)).not.toHaveClass('rounded-full');
    expect(root(container)).toHaveAttribute('data-shape', 'Cookie9Sided');
    expect(root(container).style.maskImage).toMatch(/^url\("data:image\/svg\+xml,/);
    expect(root(container).style.margin).toBe('4px');
  });

  it('is an image with a name when it means something', async () => {
    const { container } = render(
      <ShapedIcon aria-label="Verified business" data-testid="badge">
        <Icon />
      </ShapedIcon>,
    );
    const image = screen.getByRole('img', { name: 'Verified business' });
    expect(image).toBe(screen.getByTestId('badge'));
    expect(image).not.toHaveAttribute('aria-hidden');
    expect(await axeViolations(container)).toEqual([]);
  });

  it('lets consumer classes win', () => {
    const { container } = render(
      <ShapedIcon className="size-20" classNames={{ icon: 'size-10' }}>
        <Icon />
      </ShapedIcon>,
    );
    expect(root(container)).toHaveClass('size-20');
    expect(root(container)).not.toHaveClass('size-14');
    expect(root(container).firstElementChild).toHaveClass('size-10');
  });
});

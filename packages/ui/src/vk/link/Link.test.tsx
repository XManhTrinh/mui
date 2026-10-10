import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider } from 'react-aria';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../../test/axe';
import { Link } from './Link';

describe('Link', () => {
  it('is an underlined primary link by default, inheriting the type', () => {
    render(<Link href="/legal/terms">Terms of service</Link>);
    const link = screen.getByRole('link', { name: 'Terms of service' });
    expect(link).toHaveAttribute('href', '/legal/terms');
    expect(link).toHaveAttribute('data-variant', 'inline');
    expect(link).toHaveClass(
      'underline',
      'text-[var(--vk-link-color,var(--md-sys-color-primary))]',
    );
    expect(link.className).not.toMatch(/text-label-/);
  });

  it('underlines a standalone link only on hover, focus and press', () => {
    render(
      <Link variant="standalone" size="medium" href="/forgot-password">
        Forgot password?
      </Link>,
    );
    const link = screen.getByRole('link', { name: 'Forgot password?' });
    expect(link).toHaveClass('no-underline', 'data-hovered:underline', 'text-label-medium');
  });

  it('never underlines or fills a plain link, and lets its content react to hover', async () => {
    render(
      <Link variant="plain" tone="inherit" href="/@lan">
        <span className="group-data-hovered/link:underline">Lan</span>
      </Link>,
    );
    const link = screen.getByRole('link', { name: 'Lan' });
    expect(link).toHaveClass('no-underline', 'group/link');
    expect(link.className).not.toMatch(/data-hovered:underline|state-layer|bg-/);
    await userEvent.hover(link);
    expect(link).toHaveAttribute('data-hovered', 'true');
  });

  it('takes the surrounding colour with tone="inherit"', () => {
    render(
      <Link tone="inherit" href="/@lan">
        Lan
      </Link>,
    );
    expect(screen.getByRole('link', { name: 'Lan' })).toHaveClass(
      'text-[var(--vk-link-color,inherit)]',
    );
  });

  it('opens external links safely in a new tab and says so', () => {
    const { rerender } = render(
      <Link href="/legal/privacy" external>
        Privacy policy
      </Link>,
    );
    const link = screen.getByRole('link', { name: 'Privacy policy, opens in a new tab' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    rerender(
      <Link href="https://example.com" target="_blank" labels={{ newTab: 'mở trong thẻ mới' }}>
        Example
      </Link>,
    );
    expect(screen.getByRole('link', { name: 'Example, mở trong thẻ mới' })).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    );
  });

  it('routes through RouterProvider', async () => {
    const navigate = vi.fn();
    render(
      <RouterProvider navigate={navigate}>
        <Link href="/settings">Settings</Link>
      </RouterProvider>,
    );
    await userEvent.click(screen.getByRole('link', { name: 'Settings' }));
    expect(navigate).toHaveBeenCalledWith('/settings', undefined);
  });

  it('lets consumer classes win', () => {
    render(
      <Link href="/" className="no-underline" classNames={{ root: 'font-brand' }}>
        Home
      </Link>,
    );
    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).toHaveClass('no-underline', 'font-brand');
    expect(link).not.toHaveClass('underline');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <main>
        <p>
          I agree to the{' '}
          <Link href="/legal/terms" external>
            Terms of service
          </Link>{' '}
          and the <Link href="/legal/privacy">Privacy policy</Link>.
        </p>
      </main>,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});

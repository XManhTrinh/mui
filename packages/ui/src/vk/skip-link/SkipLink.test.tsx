import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../../../test/axe';
import { SkipLink } from './SkipLink';

function Page({ focusableMain = false }: { focusableMain?: boolean }) {
  return (
    <>
      <SkipLink target="main" data-testid="skip">
        Skip to content
      </SkipLink>
      <SkipLink target="search">Skip to search</SkipLink>
      <header>
        <a href="/">Home</a>
        <input aria-label="Search" id="search" />
      </header>
      <main id="main" {...(focusableMain && { tabIndex: 0 })}>
        <h1>Page</h1>
        <button type="button">First action</button>
      </main>
    </>
  );
}

describe('SkipLink', () => {
  it('is the first stop, a plain #target link, off screen until it takes focus', async () => {
    const { container } = render(<Page />);
    const skip = screen.getByRole('link', { name: 'Skip to content' });
    expect(skip).toBe(screen.getByTestId('skip'));
    expect(skip).toHaveAttribute('href', '#main');
    expect(skip).toHaveClass('fixed', '-translate-y-[calc(100%+16px)]', 'focus:translate-y-0');
    await userEvent.tab();
    expect(skip).toHaveFocus();
    expect(skip).toHaveAttribute('data-focus-visible', 'true');
    expect(await axeViolations(container)).toEqual([]);
  });

  it('moves focus to the target, so the next Tab continues from there', async () => {
    render(<Page />);
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    const main = screen.getByRole('main');
    expect(main).toHaveFocus();
    expect(main).toHaveAttribute('tabindex', '-1');
    // The hash stays out of the URL.
    expect(window.location.hash).toBe('');
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'First action' })).toHaveFocus();
  });

  it('leaves a target that already takes focus as it is', async () => {
    render(<Page focusableMain />);
    await userEvent.click(screen.getByRole('link', { name: 'Skip to content' }));
    expect(screen.getByRole('main')).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('main')).toHaveFocus();
  });

  it('offers several destinations in order', async () => {
    render(<Page />);
    await userEvent.tab();
    await userEvent.tab();
    const search = screen.getByRole('link', { name: 'Skip to search' });
    expect(search).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('textbox', { name: 'Search' })).toHaveFocus();
  });
});

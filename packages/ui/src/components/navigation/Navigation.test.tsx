import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../../test/axe';
import { NavigationBar, NavigationBarItem } from './NavigationBar';
import { NavigationRail, NavigationRailItem, type NavigationRailProps } from './NavigationRail';

const Icon = ({ id }: { id: string }) => <svg data-testid={id} viewBox="0 0 24 24" />;

function Rail(props: Partial<NavigationRailProps> & { onNavigate?: () => void }) {
  const { onNavigate, ...rest } = props;
  return (
    <NavigationRail
      aria-label="Main"
      header={({ toggle, expanded }) => (
        <button type="button" onClick={toggle}>
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      )}
      {...(rest as object)}
    >
      <NavigationRailItem href="/inbox" icon={<Icon id="inbox" />} selected>
        Inbox
      </NavigationRailItem>
      <NavigationRailItem icon={<Icon id="sent" />} onPress={onNavigate}>
        Sent
      </NavigationRailItem>
    </NavigationRail>
  );
}

describe('NavigationRail', () => {
  it('is a collapsed navigation landmark with stacked items', async () => {
    const { container } = render(<Rail />);
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(nav).toHaveStyle({ '--m3-rail-width': '96px' });
    expect(nav).toHaveClass('bg-surface', 'w-(--m3-rail-width)');
    const inbox = screen.getByRole('link', { name: 'Inbox' });
    expect(inbox).toHaveAttribute('aria-current', 'page');
    expect(inbox).toHaveAttribute('data-current', 'true');
    expect(inbox).toHaveClass('min-h-[64px]', 'px-[20px]');
    expect(screen.getByRole('button', { name: 'Sent' })).not.toHaveAttribute('aria-current');
    // The label sits below the 56×32 pill.
    const pill = screen.getByTestId('inbox').closest('[class*="w-[56px]"]')!;
    expect(pill).toHaveClass('h-[32px]', 'w-[56px]', 'rounded-full');
    expect(pill.nextElementSibling).toHaveTextContent('Inbox');
    expect(pill.nextElementSibling).toHaveClass('text-label-medium');
    expect(screen.getByTestId('inbox').parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(await axeViolations(container)).toEqual([]);
  });

  it('expands from its header, moving labels beside the icons', async () => {
    const onExpandedChange = vi.fn();
    render(<Rail onExpandedChange={onExpandedChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Expand' }));
    expect(onExpandedChange).toHaveBeenCalledWith(true);
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('data-expanded', 'true');
    // jsdom measures 0px labels, so the width is the 220px minimum.
    expect(nav).toHaveStyle({ '--m3-rail-width': '220px' });
    const label = screen.getByText('Inbox');
    expect(label).toHaveClass('text-label-large', 'starting:opacity-0');
    expect(label.parentElement).toHaveClass('gap-[8px]', 'ps-[16px]');
    expect(screen.getByRole('button', { name: 'Collapse' })).toBeInTheDocument();
  });

  it('can be controlled', () => {
    render(<Rail expanded />);
    expect(screen.getByRole('navigation')).toHaveAttribute('data-expanded', 'true');
  });

  it('opens a modal sheet that closes on Escape and after navigating', async () => {
    const onNavigate = vi.fn();
    function Modal() {
      const [expanded, setExpanded] = useState(false);
      return (
        <Rail modal expanded={expanded} onExpandedChange={setExpanded} onNavigate={onNavigate} />
      );
    }
    const { container } = render(<Modal />);
    await userEvent.click(screen.getByRole('button', { name: 'Expand' }));
    const sheet = screen.getByRole('dialog', { name: 'Main' });
    expect(sheet).toHaveClass(
      'bg-surface-container',
      'shadow-elevation-2',
      'rounded-e-corner-large',
    );
    expect(within(sheet).getByRole('link', { name: 'Inbox' })).toBeInTheDocument();
    // The in-flow rail stays collapsed.
    expect(container.querySelector('nav')).not.toHaveAttribute('data-expanded');

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull(), { timeout: 1500 });

    await userEvent.click(screen.getByRole('button', { name: 'Expand' }));
    await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Sent' }));
    expect(onNavigate).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull(), { timeout: 1500 });
  });

  it('hides the collapsed rail with hideOnCollapse', () => {
    render(<Rail modal hideOnCollapse />);
    expect(screen.queryByRole('navigation')).toBeNull();
  });

  it('requires items inside a rail', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(<NavigationRailItem icon={<Icon id="x" />}>Lost</NavigationRailItem>),
    ).toThrow(/inside a NavigationRail/);
  });
});

describe('NavigationBar', () => {
  function Bar(props: Partial<React.ComponentProps<typeof NavigationBar>>) {
    return (
      <NavigationBar aria-label="Main" {...(props as object)}>
        <NavigationBarItem
          href="/"
          icon={<Icon id="home" />}
          selectedIcon={<Icon id="home-filled" />}
          selected
        >
          Home
        </NavigationBarItem>
        <NavigationBarItem href="/search" icon={<Icon id="search" />}>
          Search
        </NavigationBarItem>
        <NavigationBarItem href="/library" icon={<Icon id="library" />}>
          Library
        </NavigationBarItem>
        <NavigationBarItem href="/you" icon={<Icon id="you" />}>
          You
        </NavigationBarItem>
      </NavigationBar>
    );
  }

  it('shares the width equally with stacked items', async () => {
    const { container } = render(<Bar />);
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(nav).toHaveClass('min-h-[64px]', 'bg-surface-container');
    const home = screen.getByRole('link', { name: 'Home' });
    expect(home).toHaveClass('flex-1', 'py-[6px]');
    expect(home).toHaveAttribute('aria-current', 'page');
    expect(screen.getByTestId('home-filled')).toBeInTheDocument();
    expect(screen.queryByTestId('home')).toBeNull();
    expect(await axeViolations(container)).toEqual([]);
  });

  it('puts icons beside labels in 40px pills', () => {
    render(<Bar iconPosition="start" />);
    const label = screen.getByText('Search');
    expect(label).toHaveClass('text-label-medium');
    expect(label.parentElement).toHaveClass('gap-[4px]', 'ps-[16px]');
    expect(label.parentElement!.parentElement).toHaveClass('h-[40px]');
  });

  it('centres items within Compose’s side padding', () => {
    render(<Bar arrangement="centered" />);
    // 4 items: (100 − 10 × 7) / 2 = 15%.
    expect(screen.getByRole('navigation')).toHaveStyle({ paddingInline: '15%' });
  });
});

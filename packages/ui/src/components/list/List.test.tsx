import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../../test/axe';
import { Switch } from '../switch/Switch';
import { List, ListItem } from './List';

const Icon = () => <svg data-testid="icon" viewBox="0 0 24 24" />;

describe('List (static)', () => {
  it('renders a plain list with Compose padding, lines and colours', async () => {
    const { container } = render(
      <List aria-label="Contacts" data-testid="list" className="w-80">
        <ListItem key="a" leading={<Icon />}>
          Alice
        </ListItem>
        <ListItem key="b" supportingText="Online">
          Bob
        </ListItem>
        <ListItem key="c" overline="Work" supportingText="Busy" trailing="9:41">
          Carol
        </ListItem>
      </List>,
    );
    const list = screen.getByRole('list', { name: 'Contacts' });
    expect(list).toBe(screen.getByTestId('list'));
    expect(list).toHaveClass('w-80', 'flex-col');
    const [one, two, three] = screen.getAllByRole('listitem') as [
      HTMLElement,
      HTMLElement,
      HTMLElement,
    ];
    expect(one).toHaveClass(
      'ps-[16px]',
      'pe-[16px]',
      'pt-[10px]',
      'pb-[10px]',
      'min-h-[56px]',
      'bg-surface',
    );
    expect(two).toHaveClass('min-h-[72px]', 'items-center');
    expect(three).toHaveClass('min-h-[88px]', 'items-start');
    expect(one).not.toHaveClass('state-layer');
    expect(within(one).getByText('Alice')).toHaveClass('text-body-large', 'text-on-surface');
    expect(within(two).getByText('Online')).toHaveClass(
      'text-body-medium',
      'text-on-surface-variant',
    );
    expect(within(three).getByText('Work')).toHaveClass('text-label-small');
    expect(within(three).getByText('9:41')).toHaveClass('text-label-small', 'col-start-3');
    expect(screen.getByTestId('icon').parentElement).toHaveClass(
      'text-on-surface-variant',
      'col-start-1',
    );
    expect(await axeViolations(container)).toEqual([]);
  });

  it('separates segmented items by 2px and marks their position', () => {
    render(
      <List aria-label="Settings" variant="segmented">
        <ListItem key="a">A</ListItem>
        <ListItem key="b">B</ListItem>
        <ListItem key="c">C</ListItem>
      </List>,
    );
    expect(screen.getByRole('list')).toHaveClass('gap-[2px]');
    const items = screen.getAllByRole('listitem');
    expect(items.map((item) => item.dataset.position)).toEqual(['first', 'middle', 'last']);
    expect(items[0]).toHaveClass('data-[shape=rest]:data-[position=first]:rounded-t-corner-large');
  });
});

describe('List (interactive)', () => {
  it('is a grid list whose items act, with state layers and shape states', async () => {
    const onAction = vi.fn();
    const { container } = render(
      <List aria-label="Mail" onAction={onAction} variant="segmented">
        <ListItem key="inbox" supportingText="3 new">
          Inbox
        </ListItem>
        <ListItem key="sent">Sent</ListItem>
      </List>,
    );
    const grid = screen.getByRole('grid', { name: 'Mail' });
    const [inbox, sent] = within(grid).getAllByRole('row') as [HTMLElement, HTMLElement];
    expect(inbox).toHaveClass(
      'state-layer',
      'focus-ring-inset',
      'data-[shape=rest]:rounded-corner-extra-small',
      'data-[shape=hovered]:rounded-corner-medium',
      'data-[shape=active]:rounded-corner-large',
    );
    expect(inbox).toHaveAttribute('data-shape', 'rest');
    expect(inbox).toHaveAttribute('data-position', 'first');
    await userEvent.click(inbox);
    expect(onAction).toHaveBeenCalledWith('inbox');
    await userEvent.keyboard('{ArrowDown}');
    expect(sent).toHaveFocus();
    expect(sent).toHaveAttribute('data-shape', 'active');
    await userEvent.keyboard('{Enter}');
    expect(onAction).toHaveBeenLastCalledWith('sent');
    expect(await axeViolations(container)).toEqual([]);
  });

  it('selects items with secondary-container colours', async () => {
    const onSelectionChange = vi.fn();
    render(
      <List
        aria-label="Labels"
        selectionMode="multiple"
        defaultSelectedKeys={['work']}
        onSelectionChange={onSelectionChange}
      >
        <ListItem key="work">Work</ListItem>
        <ListItem key="home">Home</ListItem>
      </List>,
    );
    const [work, home] = screen.getAllByRole('row') as [HTMLElement, HTMLElement];
    expect(work).toHaveAttribute('aria-selected', 'true');
    expect(work).toHaveAttribute('data-selected', 'true');
    expect(work).toHaveAttribute('data-shape', 'active');
    expect(work).toHaveClass('data-selected:bg-secondary-container');
    expect(within(work).getByText('Work')).toHaveClass(
      'group-data-selected/list-item:text-on-secondary-container',
    );
    await userEvent.click(home);
    expect(onSelectionChange).toHaveBeenCalled();
    expect(home).toHaveAttribute('aria-selected', 'true');
  });

  it('lets ← / → reach a trailing control and disables items', async () => {
    render(
      <List aria-label="Settings" onAction={() => {}} disabledKeys={['b']}>
        <ListItem key="a" trailing={<Switch aria-label="Wi-Fi on" />}>
          Wi-Fi
        </ListItem>
        <ListItem key="b">Bluetooth</ListItem>
      </List>,
    );
    const [wifi, bluetooth] = screen.getAllByRole('row') as [HTMLElement, HTMLElement];
    expect(bluetooth).toHaveAttribute('data-disabled');
    await userEvent.tab();
    expect(wifi).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('switch', { name: 'Wi-Fi on' })).toHaveFocus();
  });

  it('renders link items', () => {
    render(
      <List aria-label="Pages">
        <ListItem key="home" href="/home">
          Home
        </ListItem>
      </List>,
    );
    expect(screen.getByRole('row')).toBeInTheDocument();
  });

  it('requires a name in its types', () => {
    const unnamed = (
      // @ts-expect-error aria-label or aria-labelledby is required
      <List>
        <ListItem key="a">A</ListItem>
      </List>
    );
    expect(unnamed).toBeTruthy();
  });
});

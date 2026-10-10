import { act, render, screen, within } from '@testing-library/react';
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
      'bg-transparent',
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

describe('List (switch and checkbox items)', () => {
  it('makes the whole item one switch, named by its headline and described by the rest', async () => {
    const onCheckedChange = vi.fn();
    const { container } = render(
      <List variant="segmented" aria-label="Privacy">
        <ListItem
          key="search"
          control="switch"
          defaultChecked
          onCheckedChange={onCheckedChange}
          supportingText="Search engines can list you"
        >
          Show my profile in search engines
        </ListItem>
        <ListItem key="online" control="switch">
          Show when I'm online
        </ListItem>
      </List>,
    );
    expect(screen.getByRole('list', { name: 'Privacy' })).toBeInTheDocument();
    const search = screen.getByRole('switch', { name: 'Show my profile in search engines' });
    expect(search).toBeChecked();
    expect(search).toHaveAccessibleDescription('Search engines can list you');
    // One control per item: the drawn switch is hidden from assistive tech.
    expect(screen.getAllByRole('switch')).toHaveLength(2);

    const item = search.closest('label') as HTMLElement;
    expect(item).toHaveAttribute('data-selected', 'true');
    expect(item).toHaveAttribute('data-shape', 'active');
    expect(item).toHaveAttribute('data-position', 'first');
    expect(item).toHaveClass('data-selected:bg-secondary-container', 'state-layer', 'bg-surface');

    // Pressing anywhere on the item toggles it.
    await userEvent.click(within(item).getByText('Search engines can list you'));
    expect(search).not.toBeChecked();
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
    // Off, with the pointer still over it: the hovered shape.
    expect(item).toHaveAttribute('data-shape', 'hovered');

    // Space toggles from the keyboard, and the focused item takes the focused shape.
    act(() => search.blur());
    await userEvent.tab();
    expect(search).toHaveFocus();
    expect(item).toHaveAttribute('data-focus-visible', 'true');
    await userEvent.keyboard(' ');
    expect(search).toBeChecked();
    expect(await axeViolations(container)).toEqual([]);
  });

  it('places the switch at the end and checkboxes at the start, unless told otherwise', () => {
    render(
      <List aria-label="Options">
        <ListItem key="a" control="switch">
          Wi-Fi
        </ListItem>
        <ListItem key="b" control="checkbox">
          Alice
        </ListItem>
        <ListItem key="c" control="checkbox" controlPlacement="trailing">
          Bob
        </ListItem>
      </List>,
    );
    const drawn = (name: string) =>
      (
        screen
          .getByRole(name === 'Wi-Fi' ? 'switch' : 'checkbox', { name })
          .closest('label') as HTMLElement
      ).querySelector('[aria-hidden="true"].group\\/control') as HTMLElement;
    expect(drawn('Wi-Fi').parentElement).toHaveClass('col-start-3');
    expect(drawn('Alice').parentElement).toHaveClass('col-start-1');
    expect(drawn('Bob').parentElement).toHaveClass('col-start-3');
  });

  it('is controlled, disables items and posts with a form', async () => {
    const onCheckedChange = vi.fn();
    const { container } = render(
      <form>
        <List aria-label="Filters" disabled={false}>
          <ListItem
            key="a"
            control="checkbox"
            checked={false}
            onCheckedChange={onCheckedChange}
            name="type"
            value="cars"
          >
            Cars
          </ListItem>
          <ListItem key="b" control="checkbox" disabled name="type" value="boats">
            Boats
          </ListItem>
        </List>
      </form>,
    );
    const cars = screen.getByRole('checkbox', { name: 'Cars' });
    await userEvent.click(cars.closest('label') as HTMLElement);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(cars).not.toBeChecked();

    const boats = screen.getByRole('checkbox', { name: 'Boats' });
    expect(boats).toBeDisabled();
    expect(boats.closest('label')).toHaveAttribute('data-disabled', 'true');
    expect(container.querySelector('input[name="type"][value="cars"]')).toBe(cars);
  });

  it("refuses switch items in a list with onAction, so a row isn't two controls", () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(
        <List aria-label="Settings" onAction={() => {}}>
          <ListItem key="a" control="switch">
            Wi-Fi
          </ListItem>
        </List>,
      ),
    ).toThrow(/can't be in a list with onAction/);
    vi.restoreAllMocks();
  });
});

describe('List (radio lists)', () => {
  it('is a radio group of items with one Tab stop, and arrow keys choose', async () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <>
        <button type="button">Before</button>
        <List
          variant="segmented"
          aria-label="Theme"
          defaultValue="dark"
          onValueChange={onValueChange}
        >
          <ListItem key="light" value="light">
            Light
          </ListItem>
          <ListItem key="dark" value="dark" supportingText="Easier on the eyes at night">
            Dark
          </ListItem>
          <ListItem key="system" value="system">
            Match my device
          </ListItem>
        </List>
      </>,
    );
    expect(screen.getByRole('radiogroup', { name: 'Theme' })).toBeInTheDocument();
    const dark = screen.getByRole('radio', { name: 'Dark' });
    expect(dark).toBeChecked();
    expect(dark).toHaveAccessibleDescription('Easier on the eyes at night');
    expect(dark.closest('label')).toHaveAttribute('data-selected', 'true');

    await userEvent.click(screen.getByRole('button', { name: 'Before' }));
    await userEvent.tab();
    expect(dark).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    const system = screen.getByRole('radio', { name: 'Match my device' });
    expect(system).toBeChecked();
    expect(onValueChange).toHaveBeenLastCalledWith('system');

    await userEvent.click(screen.getByText('Light'));
    expect(screen.getByRole('radio', { name: 'Light' })).toBeChecked();
    expect(system.closest('label')).not.toHaveAttribute('data-selected');
    expect(await axeViolations(container)).toEqual([]);
  });

  it('is controlled, places radios at the end when asked, and disables items', async () => {
    const onValueChange = vi.fn();
    render(
      <List
        aria-label="Language"
        value="en"
        onValueChange={onValueChange}
        controlPlacement="trailing"
        name="locale"
      >
        <ListItem key="en" value="en">
          English
        </ListItem>
        <ListItem key="vi" value="vi">
          Tiếng Việt
        </ListItem>
        <ListItem key="fr" value="fr" disabled>
          Français
        </ListItem>
      </List>,
    );
    const vi_ = screen.getByRole('radio', { name: 'Tiếng Việt' });
    await userEvent.click(vi_);
    expect(onValueChange).toHaveBeenCalledWith('vi');
    expect(screen.getByRole('radio', { name: 'English' })).toBeChecked();
    expect(vi_).toHaveAttribute('name', 'locale');
    expect(screen.getByRole('radio', { name: 'Français' })).toBeDisabled();
    const ring = (vi_.closest('label') as HTMLElement).querySelector('.group\\/control');
    expect(ring?.parentElement).toHaveClass('col-start-3');
  });

  it('needs a value on every item', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(
        <List aria-label="Theme" defaultValue="a">
          <ListItem key="a">A</ListItem>
        </List>,
      ),
    ).toThrow(/needs a value/);
    vi.restoreAllMocks();
  });
});

describe('List (item options)', () => {
  it('aligns content to the top or centre when asked', () => {
    render(
      <List aria-label="Messages">
        <ListItem key="a" overline="Work" supportingText="Lunch?" verticalAlignment="center">
          Carol
        </ListItem>
        <ListItem key="b" verticalAlignment="top">
          Dan
        </ListItem>
      </List>,
    );
    const [carol, dan] = screen.getAllByRole('listitem') as [HTMLElement, HTMLElement];
    expect(carol).toHaveClass('items-center');
    expect(carol).not.toHaveClass('items-start');
    expect(dan).toHaveClass('items-start');
    expect(dan).not.toHaveClass('items-center');
  });

  it('disables single items of an interactive list, or all of them', () => {
    const { rerender } = render(
      <List aria-label="Pages" onAction={() => {}}>
        <ListItem key="a">A</ListItem>
        <ListItem key="b" disabled>
          B
        </ListItem>
      </List>,
    );
    let [a, b] = screen.getAllByRole('row') as [HTMLElement, HTMLElement];
    expect(a).not.toHaveAttribute('data-disabled');
    expect(b).toHaveAttribute('data-disabled');
    rerender(
      <List aria-label="Pages" onAction={() => {}} disabled>
        <ListItem key="a">A</ListItem>
        <ListItem key="b">B</ListItem>
      </List>,
    );
    [a, b] = screen.getAllByRole('row') as [HTMLElement, HTMLElement];
    expect(a).toHaveAttribute('data-disabled');
    expect(b).toHaveAttribute('data-disabled');
  });
});

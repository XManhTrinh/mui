import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../../test/axe';
import { Tab, Tabs, type TabsProps } from './Tabs';

const Icon = ({ id }: { id: string }) => <svg data-testid={id} viewBox="0 0 24 24" />;

function Trip(props: Partial<TabsProps>) {
  return (
    <Tabs aria-label="Trip" {...props}>
      <Tab key="flights" title="Flights">
        Flight details
      </Tab>
      <Tab key="hotels" title="Hotels">
        Hotel details
      </Tab>
      <Tab key="cars" title="Cars">
        Car details
      </Tab>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('renders a tab list with the first tab selected and its panel', async () => {
    const { container } = render(<Trip />);
    const list = screen.getByRole('tablist', { name: 'Trip' });
    const tabs = within(list).getAllByRole('tab');
    expect(tabs).toHaveLength(3);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[0]).toHaveAttribute('data-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Flight details');
    expect(tabs[0]).toHaveAttribute('aria-controls', screen.getByRole('tabpanel').id);
    expect(list).toHaveClass('auto-cols-fr', 'bg-surface');
    expect(tabs[1]).toHaveClass(
      'h-[48px]',
      'text-title-small',
      'text-on-surface-variant',
      'data-selected:text-primary',
      'px-[16px]',
    );
    expect(tabs[1]).toHaveStyle({ gridColumnStart: '2' });
    expect(await axeViolations(container)).toEqual([]);
  });

  it('selects with a press and with the arrow keys', async () => {
    const onSelectionChange = vi.fn();
    render(<Trip onSelectionChange={onSelectionChange} />);
    await userEvent.click(screen.getByRole('tab', { name: 'Hotels' }));
    expect(onSelectionChange).toHaveBeenLastCalledWith('hotels');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Hotel details');
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Cars' })).toHaveFocus();
    expect(onSelectionChange).toHaveBeenLastCalledWith('cars');
    await userEvent.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'Flights' })).toHaveAttribute('aria-selected', 'true');
  });

  it('can be controlled and disable tabs', async () => {
    render(<Trip selectedKey="cars" disabledKeys={['hotels']} />);
    expect(screen.getByRole('tab', { name: 'Cars' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Hotels' })).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(screen.getByRole('tab', { name: 'Flights' }));
    expect(screen.getByRole('tab', { name: 'Cars' })).toHaveAttribute('aria-selected', 'true');
  });

  it('uses 64px tabs (the M3 token) for icons above labels and 48px for icons before them', () => {
    const { unmount } = render(
      <Tabs aria-label="Media">
        <Tab key="photos" title="Photos" icon={<Icon id="p" />} />
        <Tab key="videos" title="Videos" icon={<Icon id="v" />} />
      </Tabs>,
    );
    expect(screen.getByRole('tab', { name: 'Photos' })).toHaveClass(
      'h-[64px]',
      'flex-col',
      'justify-center',
      'gap-[2px]',
    );
    expect(screen.getByTestId('p').parentElement).toHaveAttribute('aria-hidden', 'true');
    unmount();
    render(
      <Tabs aria-label="Media" iconPlacement="start" variant="secondary">
        <Tab key="photos" title="Photos" icon={<Icon id="p" />} />
      </Tabs>,
    );
    expect(screen.getByRole('tab', { name: 'Photos' })).toHaveClass(
      'h-[48px]',
      'gap-[8px]',
      'data-selected:text-on-surface',
    );
  });

  it('omits the panel and aria-controls for navigation-only tabs', async () => {
    const { container } = render(
      <Tabs aria-label="Sections">
        <Tab key="a" title="Overview" />
        <Tab key="b" title="Specs" />
      </Tabs>,
    );
    expect(screen.queryByRole('tabpanel')).toBeNull();
    expect(screen.getByRole('tab', { name: 'Overview' })).not.toHaveAttribute('aria-controls');
    expect(await axeViolations(container)).toEqual([]);
  });

  it('scrolls when scrollable', () => {
    render(<Trip scrollable />);
    const list = screen.getByRole('tablist');
    expect(list).toHaveClass('auto-cols-max', 'ps-[52px]');
    expect(list.parentElement).toHaveClass('overflow-x-auto');
    expect(screen.getByRole('tab', { name: 'Flights' })).toHaveClass('min-w-[90px]');
  });

  it('puts className, style and data-* on the root', () => {
    render(<Trip className="w-80" style={{ marginTop: 4 }} data-testid="tabs" />);
    const root = screen.getByTestId('tabs');
    expect(root).toHaveClass('w-80', 'flex-col');
    expect(root).toHaveStyle({ marginTop: '4px' });
    expect(root).toContainElement(screen.getByRole('tablist'));
  });
});

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../../../test/axe';
import { setMediaQueries } from '../../../test/setup';
import { List, ListItem } from '../../components/list/List';
import { ListDetailLayout, type ListDetailLayoutProps } from './ListDetailLayout';

const EXPANDED = '(min-width: 840px)';

function Settings(props: Partial<ListDetailLayoutProps>) {
  return (
    <ListDetailLayout
      active="detail"
      listLabel="Settings"
      detailLabel="Profile"
      list={
        <List aria-label="Sections" selectedKeys={['profile']}>
          <ListItem key="profile" href="/settings/profile">
            Profile
          </ListItem>
          <ListItem key="account" href="/settings/account">
            Account
          </ListItem>
        </List>
      }
      detail={<h2>Profile</h2>}
      {...props}
    />
  );
}

const pane = (name: 'list' | 'detail') =>
  document.querySelector<HTMLElement>(`[data-pane="${name}"]`) as HTMLElement;

describe('ListDetailLayout', () => {
  it('renders labelled landmarks: a nav for the list and a section for the detail', () => {
    render(<Settings />);
    expect(screen.getByRole('navigation', { name: 'Settings' })).toBe(pane('list'));
    expect(screen.getByRole('region', { name: 'Profile' })).toBe(pane('detail'));
  });

  it('makes the list a section with listAs="section"', () => {
    render(<Settings listAs="section" />);
    expect(pane('list').tagName).toBe('SECTION');
    expect(screen.queryByRole('navigation')).toBeNull();
  });

  it('hides the inactive pane below 840px and shows both from there', () => {
    const { rerender } = render(<Settings active="detail" />);
    expect(pane('list')).toHaveClass('max-expanded:hidden');
    expect(pane('detail')).not.toHaveClass('max-expanded:hidden');
    rerender(<Settings active="list" />);
    expect(pane('detail')).toHaveClass('max-expanded:hidden');
    expect(pane('list')).not.toHaveClass('max-expanded:hidden');
  });

  it('uses M3 pane widths and spacer, with an override for the list width', () => {
    const { container } = render(<Settings />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass('flex', 'expanded:gap-6');
    expect(pane('list')).toHaveClass(
      'expanded:w-(--vk-list-detail-list-width,360px)',
      'large:w-(--vk-list-detail-list-width,412px)',
      'expanded:sticky',
    );
    expect(pane('detail')).toHaveClass('flex-1', 'min-w-0');
    render(<Settings listWidth="400px" stickyTop="64px" data-testid="custom" />);
    const custom = screen.getByTestId('custom');
    expect(custom.style.getPropertyValue('--vk-list-detail-list-width')).toBe('400px');
    expect(custom.style.getPropertyValue('--vk-list-detail-sticky-top')).toBe('64px');
  });

  it('shows the back slot only in single-pane mode', () => {
    render(<Settings back={<a href="/settings">Back</a>} />);
    const back = screen.getByRole('link', { name: 'Back' }).parentElement as HTMLElement;
    expect(back).toHaveClass('expanded:hidden');
    expect(pane('detail').firstElementChild).toBe(back);
  });

  it('colours both panes as containers with variant="filled"', () => {
    const { container } = render(<Settings variant="filled" />);
    expect(container.firstElementChild).toHaveAttribute('data-variant', 'filled');
    for (const name of ['list', 'detail'] as const) {
      expect(pane(name)).toHaveClass('bg-surface-container-low', 'rounded-corner-large');
    }
  });

  it('turns the transition on only after the first paint', async () => {
    const { container } = render(<Settings />);
    expect(container.firstElementChild).not.toHaveAttribute('data-animate');
    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect(container.firstElementChild).toHaveAttribute('data-animate', '');
    expect(pane('detail')).toHaveClass(
      'group-data-[animate]/list-detail:max-expanded:starting:translate-x-[30px]',
      'motion-safe:max-expanded:transition-[opacity,translate]',
    );
  });

  it('moves focus to the pane now showing when the open item changes in single-pane mode', async () => {
    const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));
    setMediaQueries({ [EXPANDED]: false });
    const { rerender } = render(<Settings active="list" detailKey="/settings" />);
    await nextFrame();
    expect(document.body).toHaveFocus();
    rerender(<Settings active="detail" detailKey="/settings/profile" />);
    await nextFrame();
    expect(pane('detail')).toHaveFocus();
    rerender(<Settings active="list" detailKey="/settings" />);
    await nextFrame();
    expect(pane('list')).toHaveFocus();
  });

  it('keeps focus where it is on expanded windows', async () => {
    setMediaQueries({ [EXPANDED]: true });
    const list = <a href="/settings/account">Account</a>;
    const { rerender } = render(<Settings list={list} active="list" detailKey="/settings" />);
    screen.getByRole('link', { name: 'Account' }).focus();
    rerender(<Settings list={list} active="detail" detailKey="/settings/account" />);
    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect(screen.getByRole('link', { name: 'Account' })).toHaveFocus();
  });

  it('lets className and classNames win', () => {
    const { container } = render(
      <Settings className="gap-2" classNames={{ list: 'w-80', detail: 'p-4' }} />,
    );
    expect(container.firstElementChild).toHaveClass('gap-2');
    expect(pane('list')).toHaveClass('w-80');
    expect(pane('detail')).toHaveClass('p-4');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Settings back={<a href="/settings">Back</a>} />);
    expect(await axeViolations(container)).toEqual([]);
  });
});

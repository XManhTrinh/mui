import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../../test/axe';
import { Avatar, avatarShapes } from './Avatar';
import { AvatarGroup } from './AvatarGroup';

const visual = (root: Element) => root.firstElementChild as HTMLElement;

describe('Avatar', () => {
  it('is an image named by alt, showing initials', () => {
    render(<Avatar name="Nguyễn Văn An" alt="Nguyễn Văn An" />);
    const avatar = screen.getByRole('img', { name: 'Nguyễn Văn An' });
    expect(avatar).toHaveAttribute('data-size', 'md');
    expect(avatar).toHaveClass('size-10', 'rounded-corner-full');
    expect(avatar).toHaveTextContent('NA');
  });

  it('adds presence and verified to the name, with overridable words', () => {
    render(
      <Avatar
        name="Lan"
        alt="Lan"
        presence="online"
        verified
        labels={{ online: 'đang hoạt động', verified: 'đã xác minh' }}
      />,
    );
    expect(screen.getByRole('img', { name: 'Lan, đang hoạt động, đã xác minh' })).toBeVisible();
  });

  it('takes its presence and verified colours from overridable variables', () => {
    const { container } = render(
      <div>
        <Avatar name="Lan" alt="Lan" presence="online" verified />
        <Avatar name="Minh" alt="Minh" presence="away" />
        <Avatar name="An" alt="An" presence="offline" />
      </div>,
    );
    const dot = (presence: string) =>
      container.querySelector(`[data-presence="${presence}"]`)?.children[1] as HTMLElement;
    expect(dot('online').className).toContain(
      'var(--vk-avatar-online,var(--md-sys-color-primary))',
    );
    expect(dot('away').className).toContain('var(--vk-avatar-away,var(--md-sys-color-tertiary))');
    expect(dot('offline').className).toContain(
      'var(--vk-avatar-offline,var(--md-sys-color-outline))',
    );
    const verified = container.querySelector('[data-presence="online"]')?.children[2];
    expect(verified?.className).toContain('var(--vk-avatar-verified,var(--md-sys-color-primary))');
    expect(verified?.className).toContain(
      'var(--vk-avatar-on-verified,var(--md-sys-color-on-primary))',
    );
  });

  it('is hidden from assistive technology when decorative', () => {
    const { container } = render(<Avatar name="Lan" decorative />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('falls back to a person icon, or the icon given', () => {
    const { container: person } = render(<Avatar alt="Someone" />);
    expect(person.querySelector('svg path')).not.toBeNull();
    render(<Avatar alt="A shop" icon={<span data-testid="shop-icon" />} />);
    expect(screen.getByTestId('shop-icon')).toBeInTheDocument();
  });

  it('renders the photo over the fallback, decorative and lazy', () => {
    const { container } = render(<Avatar name="Lan" alt="Lan" src="/lan.jpg" />);
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('src', '/lan.jpg');
    expect(img).toHaveAttribute('alt', '');
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(screen.getByText('L')).toBeInTheDocument();
  });

  it('marks the image and the avatar as failed so the fallback shows', () => {
    const { container } = render(<Avatar name="Lan" alt="Lan" src="/missing.jpg" />);
    const img = container.querySelector('img');
    if (!img) throw new Error('no image');
    fireEvent.error(img);
    expect(img).toHaveAttribute('data-status', 'error');
    expect(container.firstElementChild).toHaveAttribute('data-status', 'error');
    fireEvent.load(img);
    expect(img).toHaveAttribute('data-status', 'loaded');
  });

  it('takes a custom image element, made decorative', () => {
    const { container } = render(
      <Avatar
        name="Lan"
        alt="Lan"
        image={<img src="/custom.jpg" alt="Lan" className="custom" />}
      />,
    );
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('alt', '');
    expect(img).toHaveClass('custom', 'object-cover');
  });

  it('gives a name a stable container tone, and honours a fixed tone', () => {
    const tones = (name: string) =>
      visual(
        render(<Avatar name={name} alt={name} />).container.firstElementChild as Element,
      ).className.match(
        /bg-(primary|secondary|tertiary)-container|bg-surface-container-highest/,
      )?.[0];
    expect(tones('Lan')).toBe(tones('Lan'));
    const names = ['Lan', 'Minh', 'An', 'Bảo', 'Châu', 'Dũng', 'Hà', 'Khoa'];
    expect(new Set(names.map(tones)).size).toBeGreaterThan(1);
    const { container } = render(<Avatar name="Lan" alt="Lan" tone="tertiary" />);
    expect(visual(container.firstElementChild as Element)).toHaveClass(
      'bg-tertiary-container',
      'text-on-tertiary-container',
    );
  });

  it('sizes from xs (24px) to 2xl (96px), each with a type-scale role', () => {
    const { container } = render(<Avatar name="Lan" alt="Lan" size="xs" />);
    expect(container.firstElementChild).toHaveClass('size-6');
    expect(screen.getByText('L')).toHaveClass('text-label-small');
    const { container: large } = render(<Avatar name="Minh" alt="Minh" size="2xl" />);
    expect(large.firstElementChild).toHaveClass('size-24');
  });

  it('is a circle by default at every size', () => {
    const { container } = render(<Avatar name="Lan" alt="Lan" size="2xl" />);
    expect(container.firstElementChild).toHaveAttribute('data-shape', 'circle');
    expect(visual(container.firstElementChild as Element).style.maskImage).toBe('');
  });

  it('scales a rounded square with the shape scale', () => {
    const { container } = render(<Avatar name="Lan" alt="Lan" shape="rounded" />);
    expect(container.firstElementChild).toHaveClass('rounded-corner-medium');
  });

  it('masks any of the M3 Expressive shapes', () => {
    const { container } = render(<Avatar name="Lan" alt="Lan" size="xl" shape="Cookie12Sided" />);
    expect(container.firstElementChild).toHaveAttribute('data-shape', 'Cookie12Sided');
    expect(visual(container.firstElementChild as Element).style.maskImage).toMatch(
      /^url\("data:image\/svg\+xml,/,
    );
    expect(avatarShapes).toHaveLength(37);
  });

  it('raises the badges above the photo and overlapping neighbours', () => {
    const { container } = render(<Avatar name="Lan" alt="Lan" presence="online" verified />);
    const [, presence, verified] = [...(container.firstElementChild?.children ?? [])];
    expect(presence).toHaveClass('z-1');
    expect(verified).toHaveClass('z-1');
  });

  it('becomes a named link with a touch target', () => {
    render(<Avatar name="Lan" alt="Lan's profile" href="/u/lan" size="sm" />);
    const link = screen.getByRole('link', { name: "Lan's profile" });
    expect(link).toHaveAttribute('href', '/u/lan');
    expect(link).toHaveClass('focus-ring');
    expect(link.querySelector('[data-touch-target]')).not.toBeNull();
  });

  it('becomes a button that reports presses', async () => {
    const onPress = vi.fn();
    render(<Avatar name="Lan" alt="Open Lan" onPress={onPress} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open Lan' }));
    expect(onPress).toHaveBeenCalledOnce();
  });

  it('requires a name unless decorative, and always when interactive', () => {
    // @ts-expect-error alt or decorative is required
    render(<Avatar name="Lan" />);
    // @ts-expect-error a link needs alt
    render(<Avatar name="Lan" href="/u/lan" decorative />);
    expect(true).toBe(true);
  });

  it('lets consumer classes win', () => {
    const { container } = render(
      <Avatar name="Lan" alt="Lan" className="size-12" classNames={{ fallback: 'font-brand' }} />,
    );
    expect(container.firstElementChild).toHaveClass('size-12');
    expect(container.firstElementChild).not.toHaveClass('size-10');
    expect(screen.getByText('L')).toHaveClass('font-brand');
  });

  it('has no axe violations in its static, linked and badged forms', async () => {
    const { container } = render(
      <div>
        <Avatar name="Lan" alt="Lan" presence="away" verified />
        <Avatar name="Minh" alt="Minh's profile" href="/u/minh" />
        <Avatar name="An" decorative />
      </div>,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('AvatarGroup', () => {
  const people = ['Lan', 'Minh', 'An', 'Bảo', 'Châu'];

  it('is one named group whose static avatars are decorative', () => {
    render(
      <AvatarGroup label="Lan, Minh and 3 others">
        {people.map((name) => (
          <Avatar key={name} name={name} alt={name} />
        ))}
      </AvatarGroup>,
    );
    expect(screen.getByRole('group', { name: 'Lan, Minh and 3 others' })).toBeVisible();
    expect(screen.queryAllByRole('img')).toHaveLength(0);
  });

  it('shows max avatars and a +N for the rest, overlapping with a ring', () => {
    const { container } = render(
      <AvatarGroup label="Team" max={3} size="sm">
        {people.map((name) => (
          <Avatar key={name} name={name} decorative />
        ))}
      </AvatarGroup>,
    );
    const items = [...(container.firstElementChild?.children ?? [])];
    expect(items).toHaveLength(4);
    expect(items.at(-1)).toHaveTextContent('+2');
    for (const item of items) {
      expect(item).toHaveClass('size-8', 'not-first:-ms-2');
      expect(visual(item)).toHaveClass(
        'shadow-[0_0_0_2px_var(--vk-avatar-ring,var(--md-sys-color-surface))]',
      );
    }
  });

  it('makes +N a named button or link to the full list', async () => {
    const onOverflowPress = vi.fn();
    render(
      <AvatarGroup label="Team" max={2} onOverflowPress={onOverflowPress}>
        {people.map((name) => (
          <Avatar key={name} name={name} decorative />
        ))}
      </AvatarGroup>,
    );
    await userEvent.click(screen.getByRole('button', { name: '3 more' }));
    expect(onOverflowPress).toHaveBeenCalledOnce();

    render(
      <AvatarGroup label="Team" max={2} overflowHref="/team" overflowLabel={(n) => `+${n} người`}>
        {people.map((name) => (
          <Avatar key={name} name={name} decorative />
        ))}
      </AvatarGroup>,
    );
    expect(screen.getByRole('link', { name: '+3 người' })).toHaveAttribute('href', '/team');
  });

  it('keeps the names of linked avatars', () => {
    render(
      <AvatarGroup label="Team">
        <Avatar name="Lan" alt="Lan's profile" href="/u/lan" />
        <Avatar name="Minh" decorative />
      </AvatarGroup>,
    );
    expect(screen.getByRole('link', { name: "Lan's profile" })).toBeVisible();
  });

  it('spaces avatars without a ring when asked', () => {
    const { container } = render(
      <AvatarGroup label="Team" spacing="spaced">
        <Avatar name="Lan" decorative />
        <Avatar name="Minh" decorative />
      </AvatarGroup>,
    );
    expect(container.firstElementChild).toHaveClass('gap-1');
    expect(visual(container.firstElementChild?.firstElementChild as Element).className).not.toMatch(
      /shadow-\[0_0_0_2px/,
    );
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <AvatarGroup label="Lan, Minh and 3 others" max={2} overflowHref="/team">
        {people.map((name) => (
          <Avatar key={name} name={name} decorative />
        ))}
      </AvatarGroup>,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, AvatarGroup, type AvatarSize } from '@vkieu/mui/vk';
import { useState, type CSSProperties } from 'react';
import {
  LAYOUT_OVERRIDES,
  LAYOUT_OVERRIDE_NAMES,
  type LayoutOverrideName,
} from './layout-overrides';

/** A deterministic stand-in photo (an inline SVG), so screenshots never depend on the network. */
const PHOTO = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4b183"/><stop offset="1" stop-color="#8f5a3c"/></linearGradient></defs><rect width="96" height="96" fill="url(#g)"/><circle cx="48" cy="38" r="18" fill="#fde4cf"/><rect x="18" y="62" width="60" height="40" rx="30" fill="#fde4cf"/></svg>',
)}`;

/** Material Symbols `check`, the badge content in these stories. */
const CheckIcon = () => (
  <svg viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true">
    <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
  </svg>
);

const SIZES: AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
const PEOPLE = ['Nguyễn Văn An', 'Trần Thị Lan', 'Lê Minh', 'Phạm Bảo Châu', 'Đỗ Ứng', 'Hà Khoa'];

const meta = {
  title: 'VK/Avatar',
  component: Avatar,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every size with initials, a photo, and a rounded square, on surface. */
export const Sizes: Story = {
  args: { decorative: true },
  render: () => (
    <div className="flex flex-col gap-4 bg-surface p-4" data-testid="sizes">
      {[
        (size: AvatarSize) => <Avatar name="Nguyễn Văn An" alt="An" size={size} />,
        (size: AvatarSize) => <Avatar name="Trần Thị Lan" alt="Lan" src={PHOTO} size={size} />,
        (size: AvatarSize) => <Avatar shape="rounded" name="Phở Sài Gòn" alt="Phở Sài Gòn" size={size} />,
      ].map((row, index) => (
        <div key={index} className="flex items-end gap-4">
          {SIZES.map((size) => (
            <span key={size}>{row(size)}</span>
          ))}
        </div>
      ))}
    </div>
  ),
};

/** Tones from names, the fallback icons, badges and shapes. */
export const Variants: Story = {
  args: { decorative: true },
  render: () => (
    <div className="flex flex-col gap-4 bg-surface p-4" data-testid="variants">
      <div className="flex gap-3">
        {PEOPLE.map((name) => (
          <Avatar key={name} name={name} alt={name} />
        ))}
        <Avatar alt="Unknown person" />
        <Avatar shape="rounded" alt="Unknown" />
      </div>
      <div className="flex items-center gap-4">
        <Avatar name="Lan" alt="Lan" size="lg" presence="online" />
        <Avatar name="Minh" alt="Minh" size="lg" presence="away" />
        <Avatar name="An" alt="An" size="lg" presence="offline" />
        <Avatar
          shape="rounded"
          name="Phở Sài Gòn"
          alt="Phở Sài Gòn"
          size="lg"
          badge={<CheckIcon />}
          badgeLabel="verified"
        />
        <Avatar
          name="Lan"
          alt="Lan"
          src={PHOTO}
          size="lg"
          presence="online"
          badge={<CheckIcon />}
          badgeLabel="verified"
        />
        <Avatar
          name="Minh"
          alt="Minh"
          size="lg"
          presence="online"
          presencePlacement="top-start"
          badge="3"
          badgeLabel="3 unread"
          badgePlacement="bottom-end"
          data-testid="placed"
        />
      </div>
      <div className="flex items-center gap-4">
        <Avatar name="Lan" alt="Lan" size="xl" src={PHOTO} shape="Cookie12Sided" />
        <Avatar name="Phở Sài Gòn" alt="Phở Sài Gòn" size="xl" shape="Cookie4Sided" />
        <Avatar name="Minh" alt="Minh" size="xl" shape="Sunny" />
        <Avatar name="An" alt="An" size="xl" shape="circle" />
        <Avatar name="Bảo" alt="Bảo" size="xl" shape="rounded" />
      </div>
    </div>
  ),
};

/** Every auto slot set to one app colour (any CSS colour works). */
const GREEN_SLOTS = Object.fromEntries(
  Array.from({ length: 12 }, (_, index) => [
    [`--vk-avatar-tone-${index + 1}`, '#16a34a'],
    [`--vk-avatar-on-tone-${index + 1}`, '#ffffff'],
  ]).flat(),
) as CSSProperties;

/** Colours from the 12 auto slots, an app override of a slot, and a Tailwind class override. */
export const Tones: Story = {
  args: { decorative: true },
  render: () => (
    <div className="flex flex-col gap-4 bg-surface p-4" data-testid="tones">
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 24 }, (_, index) => (
          <Avatar key={index} name={`Person ${index}`} alt={`Person ${index}`} size="sm" />
        ))}
      </div>
      <div className="flex gap-3" style={GREEN_SLOTS}>
        <Avatar name="Person 7" alt="Slot override" data-testid="slot-override" />
        <Avatar
          name="Lan"
          alt="Class override"
          classNames={{ visual: 'bg-[#0ea5e9] text-[#ffffff]' }}
          data-testid="class-override"
        />
      </div>
    </div>
  ),
};

/** A broken photo falls back to the initials. */
export const BrokenImage: Story = {
  args: { decorative: true },
  render: () => (
    <div className="bg-surface p-4" data-testid="broken">
      <Avatar name="Trần Thị Lan" alt="Lan" src="/does-not-exist.png" size="lg" />
    </div>
  ),
};

/** Groups: overlapping with a +N, spaced, and +N as a button. */
export const Groups: Story = {
  args: { decorative: true },
  render: function Render() {
    const [opened, setOpened] = useState(0);
    return (
      <div className="flex flex-col gap-4 bg-surface p-4" data-testid="groups">
        <AvatarGroup label="An, Lan and 4 others" max={3} data-testid="group-overlap">
          {PEOPLE.map((name, index) => (
            <Avatar
              key={name}
              name={name}
              decorative
              {...(index === 0 && { presence: 'online' as const })}
              {...(index === 1 && { src: PHOTO })}
            />
          ))}
        </AvatarGroup>
        <AvatarGroup label="Team" size="sm" spacing="spaced">
          {PEOPLE.slice(0, 4).map((name) => (
            <Avatar key={name} name={name} decorative />
          ))}
        </AvatarGroup>
        <AvatarGroup
          label="Attendees"
          size="lg"
          max={2}
          onOverflowPress={() => setOpened((count) => count + 1)}
        >
          {PEOPLE.map((name) => (
            <Avatar key={name} name={name} decorative />
          ))}
        </AvatarGroup>
        <p className="text-body-medium text-on-surface-variant" data-testid="opened">
          Opened {opened}
        </p>
      </div>
    );
  },
};

/** Linked avatars: state layer, focus ring and touch target. */
export const Interactive: Story = {
  args: { decorative: true },
  render: function Render() {
    const [count, setCount] = useState(0);
    return (
      <div className="flex items-center gap-4 bg-surface p-4" data-testid="interactive">
        <Avatar name="Lan" alt="Lan's profile" size="xs" data-testid="xs" onPress={() => setCount((c) => c + 1)} />
        <Avatar name="Minh" alt="Minh's profile" href="#minh" />
        <Avatar name="An" alt="An's profile" size="xl" href="#an" />
        <span data-testid="count">Pressed {count}</span>
      </div>
    );
  },
};

/** Layout safety (architecture §10). */
export const LayoutOverride: StoryObj<{
  override: LayoutOverrideName;
  transformedAncestor: boolean;
}> = {
  args: { override: 'none', transformedAncestor: false },
  argTypes: { override: { control: 'select', options: LAYOUT_OVERRIDE_NAMES } },
  render: ({ override, transformedAncestor }) => (
    <div
      className={transformedAncestor ? 'translate-x-2' : undefined}
      style={{ minHeight: 200, width: 360 }}
    >
      <Avatar data-testid="target" name="Lan" alt="Lan" presence="online" className={LAYOUT_OVERRIDES[override]} />
    </div>
  ),
};

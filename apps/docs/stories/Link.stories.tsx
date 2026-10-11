import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from '@vkieu/mui/vk';
import { useState } from 'react';
import {
  LAYOUT_OVERRIDES,
  LAYOUT_OVERRIDE_NAMES,
  type LayoutOverrideName,
} from './layout-overrides';

const meta = {
  title: 'VK/Link',
  component: Link,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Inline in running text (the underline clears accents below the line), standalone, external. */
export const Variants: Story = {
  args: { href: '#', children: 'Link' },
  render: () => (
    <div data-testid="variants" className="flex w-[420px] flex-col gap-4 bg-surface p-4">
      <p className="text-body-large text-on-surface">
        By creating an account you agree to the{' '}
        <Link href="#terms" external labels={{ newTab: 'opens in a new tab' }}>
          Terms of service
        </Link>{' '}
        and <Link href="#privacy">Privacy policy</Link>.
      </p>
      <Link variant="standalone" size="large" href="#forgot">
        Forgot password?
      </Link>
      <Link variant="standalone" size="medium" href="#see-all">
        See all friends
      </Link>
      <Link variant="plain" tone="inherit" href="#lan" className="flex w-24 flex-col gap-1 text-on-surface">
        <span
          aria-hidden="true"
          className="flex aspect-square items-center justify-center rounded-corner-medium bg-tertiary-container text-headline-small text-on-tertiary-container"
        >
          NL
        </span>
        <span className="text-label-large group-data-hovered/link:underline">Nora Lindqvist</span>
      </Link>
      <p className="rounded-corner-medium bg-primary-container p-4 text-body-medium text-on-primary-container">
        On a coloured container, links take the text colour:{' '}
        <Link tone="inherit" href="#help">
          get help
        </Link>
        .
      </p>
    </div>
  ),
};

/** Layout safety (architecture §10). */
export const LayoutOverride: StoryObj<{
  override: LayoutOverrideName;
  transformedAncestor: boolean;
}> = {
  args: { override: 'none', transformedAncestor: false },
  argTypes: { override: { control: 'select', options: LAYOUT_OVERRIDE_NAMES } },
  render: function Render({ override, transformedAncestor }) {
    const [count, setCount] = useState(0);
    return (
      <div
        className={transformedAncestor ? 'translate-x-2' : undefined}
        style={{ minHeight: 120, width: 360 }}
      >
        <Link
          data-testid="target"
          variant="standalone"
          size="large"
          href="#target"
          onPress={() => setCount((value) => value + 1)}
          className={`block ${LAYOUT_OVERRIDES[override]}`}
        >
          Forgot password?
        </Link>
        <p data-testid="count">Pressed {count}</p>
      </div>
    );
  },
};

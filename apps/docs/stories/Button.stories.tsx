import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, type ButtonShape, type ButtonSize, type ButtonVariant } from '@vkieu/mui';
import { useState } from 'react';
import { AddIcon, ArrowIcon, SendIcon, StarIcon } from './icons';

const VARIANTS: ButtonVariant[] = ['elevated', 'filled', 'tonal', 'outlined', 'text'];
const SIZES: ButtonSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
const SHAPES: ButtonShape[] = ['round', 'square'];

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Button', variant: 'filled', size: 'sm', shape: 'round' },
  argTypes: {
    variant: { control: 'inline-radio', options: VARIANTS },
    size: { control: 'inline-radio', options: SIZES },
    shape: { control: 'inline-radio', options: SHAPES },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-wrap items-center gap-4">
    <span className="w-24 text-label-medium text-on-surface-variant">{label}</span>
    {children}
  </div>
);

/** Every variant: enabled, with an icon, as an unselected and selected toggle, and disabled. */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4" data-testid="variants">
      {VARIANTS.map((variant) => (
        <Row key={variant} label={variant}>
          <Button variant={variant}>Label</Button>
          <Button variant={variant} leadingIcon={<AddIcon />}>
            Create
          </Button>
          {variant !== 'text' && (
            <>
              <Button toggle variant={variant}>
                Toggle
              </Button>
              <Button toggle defaultSelected variant={variant}>
                Selected
              </Button>
            </>
          )}
          <Button variant={variant} disabled>
            Disabled
          </Button>
        </Row>
      ))}
    </div>
  ),
};

/** XS–XL in both shapes, with and without icons. */
export const SizesAndShapes: Story = {
  render: () => (
    <div className="flex flex-col gap-6" data-testid="sizes">
      {SHAPES.map((shape) => (
        <div key={shape} className="flex flex-wrap items-center gap-4">
          {SIZES.map((size) => (
            <Button key={size} size={size} shape={shape} leadingIcon={<SendIcon />}>
              {size.toUpperCase()}
            </Button>
          ))}
        </div>
      ))}
      <div className="flex flex-wrap items-center gap-4">
        {SIZES.map((size) => (
          <Button key={size} size={size} variant="outlined" trailingIcon={<ArrowIcon />}>
            Next
          </Button>
        ))}
      </div>
    </div>
  ),
};

/** Toggle buttons swap shape when selected: round → square, square → round. */
export const Toggle: Story = {
  render: function ToggleStory() {
    const [starred, setStarred] = useState(false);
    return (
      <div className="flex flex-wrap items-center gap-4">
        <Button
          toggle
          size="md"
          selected={starred}
          onSelectedChange={setStarred}
          leadingIcon={<StarIcon />}
        >
          {starred ? 'Starred' : 'Star'}
        </Button>
        <Button toggle size="md" shape="square" variant="tonal">
          Square toggle
        </Button>
        <Button toggle size="md" variant="outlined">
          Outlined toggle
        </Button>
      </div>
    );
  },
};

export const Link: Story = {
  args: { href: 'https://m3.material.io/components/buttons', variant: 'text', children: 'Spec' },
};

const OVERRIDES = {
  none: '',
  fixed: 'fixed right-4 bottom-4',
  absolute: 'absolute top-24 left-24',
  sticky: 'sticky top-0',
  static: 'static',
  overflowHidden: 'overflow-hidden',
  overflowVisible: 'overflow-visible',
  fullWidth: 'w-full',
  transform: 'translate-x-4 rotate-3',
} as const;

/**
 * Layout safety (architecture §10): the same button with a consumer layout class, inside
 * an optional transformed ancestor. It must look and behave the same in every case.
 */
export const LayoutOverride: StoryObj<{
  override: keyof typeof OVERRIDES;
  transformedAncestor: boolean;
}> = {
  args: { override: 'none', transformedAncestor: false },
  argTypes: { override: { control: 'select', options: Object.keys(OVERRIDES) } },
  render: function LayoutOverrideStory({ override, transformedAncestor }) {
    const [count, setCount] = useState(0);
    return (
      <div
        className={transformedAncestor ? 'translate-x-2' : undefined}
        data-testid="ancestor"
        style={{ minHeight: 200 }}
      >
        <p className="mb-4 text-body-medium" data-testid="count">
          Pressed {count}
        </p>
        <Button
          data-testid="target"
          className={OVERRIDES[override]}
          leadingIcon={<AddIcon />}
          onPress={() => setCount((c) => c + 1)}
        >
          Layout
        </Button>
      </div>
    );
  },
};

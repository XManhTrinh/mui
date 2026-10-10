import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag, TagGroup, TAG_SIZES, TAG_TONES, TAG_VARIANTS } from '@vkieu/mui/vk';
import { StarIcon } from './icons';
import {
  LAYOUT_OVERRIDES,
  LAYOUT_OVERRIDE_NAMES,
  type LayoutOverrideName,
} from './layout-overrides';

const meta = {
  title: 'VK/Tag',
  component: Tag,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every variant × tone. */
export const Grid: Story = {
  args: { children: 'Tag' },
  render: () => (
    <div data-testid="grid" className="flex flex-col gap-3 bg-surface p-4">
      {TAG_VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-wrap items-center gap-2">
          {TAG_TONES.map((tone) => (
            <Tag key={tone} variant={variant} tone={tone}>
              {tone}
            </Tag>
          ))}
        </div>
      ))}
    </div>
  ),
};

/** The three sizes in both shapes, with a dot and an icon. */
export const Sizes: Story = {
  args: { children: 'Tag' },
  render: () => (
    <div data-testid="sizes" className="flex flex-col gap-3 bg-surface p-4">
      {TAG_SIZES.map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-2">
          <Tag size={size}>Draft</Tag>
          <Tag size={size} shape="rounded" tone="primary">
            Full-time
          </Tag>
          <Tag size={size} tone="success" dot>
            Open now
          </Tag>
          <Tag size={size} tone="tertiary" icon={<StarIcon />}>
            Featured
          </Tag>
        </div>
      ))}
    </div>
  ),
};

/** Short forms, truncation and a group, as real pages use them. */
export const InUse: Story = {
  args: { children: 'Tag' },
  render: () => (
    <div data-testid="in-use" className="flex w-[320px] flex-col gap-3 bg-surface p-4">
      <p className="flex items-center gap-2 text-body-large text-on-surface">
        Button group
        <Tag size="sm" tone="tertiary" fullLabel="Expressive">
          M3E
        </Tag>
        <Tag size="sm" tone="primary" fullLabel="VK: not part of Material 3">
          VK
        </Tag>
      </p>
      <Tag variant="outlined" maxWidth="10rem">
        Vietnamese groceries and fresh herbs
      </Tag>
      <TagGroup aria-label="Listing status">
        <Tag variant="filled" tone="error">
          Sold
        </Tag>
        <Tag tone="warning" dot>
          Payment pending
        </Tag>
        <Tag tone="success">Verified</Tag>
      </TagGroup>
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
  render: ({ override, transformedAncestor }) => (
    <div
      className={transformedAncestor ? 'translate-x-2' : undefined}
      style={{ minHeight: 120, width: 360 }}
    >
      <Tag data-testid="target" tone="primary" dot className={LAYOUT_OVERRIDES[override]}>
        Open now
      </Tag>
    </div>
  ),
};

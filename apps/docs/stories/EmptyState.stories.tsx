import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@vkieu/mui';
import { EmptyState, type EmptyStateTone } from '@vkieu/mui/vk';
import {
  LAYOUT_OVERRIDES,
  LAYOUT_OVERRIDE_NAMES,
  type LayoutOverrideName,
} from './layout-overrides';
import { CloudOffIcon, FeedIcon, SearchOffIcon } from './icons';

const meta = {
  title: 'VK/EmptyState',
  component: EmptyState,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every variant beside each other: plain on the page, and in each card variant. */
export const Variants: Story = {
  args: { icon: <FeedIcon />, title: 'No posts yet' },
  render: () => (
    <div data-testid="variants" className="grid grid-cols-2 gap-4 bg-surface p-4">
      {(['plain', 'filled', 'elevated', 'outlined'] as const).map((variant) => (
        <EmptyState
          key={variant}
          variant={variant}
          icon={<FeedIcon />}
          title="No posts yet"
          description={`The ${variant} variant.`}
        />
      ))}
    </div>
  ),
};

/** The three sizes: in a list, in a section, and for a page area. */
export const Sizes: Story = {
  args: { icon: <SearchOffIcon />, title: 'No results' },
  render: () => (
    <div data-testid="sizes" className="flex flex-col gap-4 bg-surface p-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <EmptyState
          key={size}
          variant="outlined"
          size={size}
          icon={<SearchOffIcon />}
          title="No results for “phở”"
          description="Try another word, or check the spelling."
        />
      ))}
    </div>
  ),
};

/** Each tone's container and content roles, with an Expressive shape for one of them. */
export const Tones: Story = {
  args: { icon: <FeedIcon />, title: 'Tone' },
  render: () => (
    <div data-testid="tones" className="flex flex-wrap gap-4 bg-surface p-4">
      {(['primary', 'secondary', 'tertiary', 'neutral', 'error'] as EmptyStateTone[]).map(
        (tone) => (
          <EmptyState
            key={tone}
            size="sm"
            tone={tone}
            shape={tone === 'tertiary' ? 'Cookie9Sided' : 'circle'}
            icon={<FeedIcon />}
            title={tone}
          />
        ),
      )}
    </div>
  ),
};

/** A list that couldn't load, with a retry action. */
export const WithActions: Story = {
  args: { icon: <CloudOffIcon />, title: "Couldn't load this list" },
  render: () => (
    <div data-testid="actions" className="bg-surface p-4">
      <EmptyState
        variant="filled"
        tone="error"
        icon={<CloudOffIcon />}
        title="Couldn't load this list"
        description="Check your connection and try again."
        actions={
          <>
            <Button variant="tonal">Try again</Button>
            <Button variant="text">Go back</Button>
          </>
        }
      />
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
      style={{ minHeight: 320, width: 360 }}
    >
      <EmptyState
        data-testid="target"
        variant="filled"
        icon={<FeedIcon />}
        title="No posts yet"
        className={LAYOUT_OVERRIDES[override]}
      />
    </div>
  ),
};

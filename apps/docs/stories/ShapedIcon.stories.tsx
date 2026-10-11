import type { Meta, StoryObj } from '@storybook/react-vite';
import { ShapedIcon } from '@vkieu/mui/vk';
import { SearchIcon, SendIcon, StarIcon } from './icons';

const meta = {
  title: 'VK/ShapedIcon',
  component: ShapedIcon,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ShapedIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

const tones = ['primary', 'secondary', 'tertiary', 'neutral', 'error'] as const;
const sizes = ['sm', 'md', 'lg', 'xl'] as const;

/** Every tone and size, as a circle and as M3 Expressive shapes. */
export const Variants: Story = {
  args: { children: <StarIcon /> },
  render: () => (
    <div data-testid="variants" className="flex flex-col gap-4 bg-surface p-4">
      <div className="flex items-end gap-3">
        {sizes.map((size) => (
          <ShapedIcon key={size} size={size} tone="primary">
            <StarIcon />
          </ShapedIcon>
        ))}
      </div>
      <div className="flex items-end gap-3">
        {sizes.map((size) => (
          <ShapedIcon key={size} size={size} shape="Cookie9Sided" tone="primary">
            <StarIcon />
          </ShapedIcon>
        ))}
      </div>
      <div className="flex items-center gap-3">
        {tones.map((tone, index) => (
          <ShapedIcon
            key={tone}
            tone={tone}
            size="lg"
            shape={(['Flower', 'SoftBurst', 'Cookie12Sided', 'Clover4Leaf', 'Sunny'] as const)[index]}
          >
            {index % 2 === 0 ? <SearchIcon /> : <SendIcon />}
          </ShapedIcon>
        ))}
      </div>
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { PropsTable, type PropsTableRow } from '@vkieu/mui/vk';

const BUTTON_ROWS: PropsTableRow[] = [
  {
    name: 'variant',
    type: '"elevated" | "filled" | "tonal" | "outlined" | "text"',
    defaultValue: '"filled"',
    description: 'The visual style of the button.',
    required: false,
  },
  {
    name: 'size',
    type: '"xs" | "sm" | "md" | "lg" | "xl"',
    defaultValue: '"sm"',
    description: 'The size of the button and its touch target.',
    required: false,
  },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'The button label.',
    required: true,
  },
  {
    name: 'onPress',
    type: '(event: PressEvent) => void',
    description: 'Called when the button is pressed.',
    required: false,
  },
];

const meta = {
  title: 'VK/PropsTable',
  component: PropsTable,
  args: { caption: 'Button props', rows: BUTTON_ROWS },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PropsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-3xl" data-testid="props-table">
      <PropsTable {...args} />
    </div>
  ),
};

/** No rows: the head renders with an empty body. */
export const Empty: Story = {
  args: { caption: 'No props', rows: [] },
  render: (args) => (
    <div className="max-w-3xl" data-testid="props-table">
      <PropsTable {...args} />
    </div>
  ),
};

/** A long type string shows the horizontal scroll region on small screens. */
export const LongType: Story = {
  args: {
    caption: 'Overflow',
    rows: [
      {
        name: 'onSelectionChange',
        type: '(keys: Set<"day" | "week" | "month" | "quarter" | "year" | "decade">) => void',
        description: 'Called with the full set of selected keys whenever the selection changes.',
        required: false,
      },
    ],
  },
  render: (args) => (
    <div className="max-w-sm" data-testid="props-table">
      <PropsTable {...args} />
    </div>
  ),
};

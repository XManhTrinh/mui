import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@vkieu/mui';
import { SkipLink } from '@vkieu/mui/vk';

const meta = {
  title: 'VK/SkipLink',
  component: SkipLink,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SkipLink>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Press Tab: "Skip to content", then "Skip to search"; Enter moves focus past the bar. */
export const Page: Story = {
  args: { target: 'main', children: 'Skip to content' },
  render: () => (
    <div data-testid="page" className="min-h-[320px] bg-surface">
      <SkipLink target="main">Skip to content</SkipLink>
      <SkipLink target="search">Skip to search</SkipLink>
      <header className="flex items-center gap-2 bg-surface-container px-4 py-3">
        {['Home', 'Shops', 'Jobs', 'Homes'].map((item) => (
          <Button key={item} variant="text" size="sm">
            {item}
          </Button>
        ))}
        <input
          id="search"
          aria-label="Search"
          className="ms-auto h-10 rounded-full bg-surface-container-highest px-4 text-body-large text-on-surface"
        />
      </header>
      <main id="main" className="flex flex-col items-start gap-3 p-4 outline-none">
        <h1 className="text-headline-small text-on-surface">Today in Leeds</h1>
        <Button variant="tonal">Read more</Button>
      </main>
    </div>
  ),
};

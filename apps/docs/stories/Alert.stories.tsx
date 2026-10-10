import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@vkieu/mui';
import { Alert, type AlertTone } from '@vkieu/mui/vk';
import {
  LAYOUT_OVERRIDES,
  LAYOUT_OVERRIDE_NAMES,
  type LayoutOverrideName,
} from './layout-overrides';

const meta = {
  title: 'VK/Alert',
  component: Alert,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

const TONES: AlertTone[] = ['error', 'info', 'success', 'warning', 'neutral'];

/** Every tone, tonal and outlined. */
export const Tones: Story = {
  args: { children: 'Message' },
  render: () => (
    <div data-testid="tones" className="grid w-[880px] grid-cols-2 gap-3 bg-surface p-4">
      {TONES.flatMap((tone) =>
        (['tonal', 'outlined'] as const).map((variant) => (
          <Alert
            key={`${tone}-${variant}`}
            tone={tone}
            variant={variant}
            title={`${tone} · ${variant}`}
          >
            Something the person should know about this page.
          </Alert>
        )),
      )}
    </div>
  ),
};

/** Actions and a close button: beside the text when wide, under it when narrow. */
export const WithActions: Story = {
  args: { children: 'Message' },
  render: () => (
    <div data-testid="actions" className="flex w-full max-w-[720px] flex-col gap-3 bg-surface p-4">
      <Alert
        title="Your payment failed"
        actions={<Button variant="text">Update card</Button>}
        onClose={() => undefined}
      >
        Your card was declined.
      </Alert>
      <Alert tone="info" onClose={() => undefined}>
        You&apos;re offline. Changes will sync when you&apos;re back.
      </Alert>
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
      style={{ minHeight: 200, width: 360 }}
    >
      <Alert data-testid="target" className={LAYOUT_OVERRIDES[override]} icon={null}>
        That email and password don&apos;t match.
      </Alert>
    </div>
  ),
};

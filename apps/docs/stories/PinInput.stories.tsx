import type { Meta, StoryObj } from '@storybook/react-vite';
import { PinInput, type PinInputCorner, type PinInputSize } from '@vkieu/mui/vk';
import { useState } from 'react';
import {
  LAYOUT_OVERRIDES,
  LAYOUT_OVERRIDE_NAMES,
  type LayoutOverrideName,
} from './layout-overrides';

const SIZES: PinInputSize[] = ['small', 'medium', 'large'];
const CORNERS: PinInputCorner[] = ['none', 'extra-small', 'medium', 'large', 'full'];

const meta = {
  title: 'VK/PinInput',
  component: PinInput,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PinInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Both variants in every state: empty, partly filled, complete, invalid, disabled, masked. */
export const Variants: Story = {
  args: { label: 'Code' },
  render: () => (
    <div className="grid gap-6 bg-surface p-4 medium:grid-cols-2" data-testid="variants">
      {(['outlined', 'filled'] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-6">
          <PinInput variant={variant} label="Empty" groups={[3, 3]} supportingText="From your email" />
          <PinInput variant={variant} label="Partly filled" groups={[3, 3]} defaultValue="123" />
          <PinInput variant={variant} label="Complete" groups={[3, 3]} defaultValue="123456" />
          <PinInput
            variant={variant}
            label="Invalid"
            groups={[3, 3]}
            defaultValue="123456"
            invalid
            errorMessage="That code didn't work."
          />
          <PinInput variant={variant} label="Disabled" groups={[3, 3]} defaultValue="12" disabled />
          <PinInput variant={variant} label="PIN" length={4} mask defaultValue="12" otp={false} />
        </div>
      ))}
    </div>
  ),
};

/** The three sizes, each with a group separator. */
export const Sizes: Story = {
  args: { label: 'Code' },
  render: () => (
    <div className="flex flex-col gap-6 bg-surface p-4" data-testid="sizes">
      {SIZES.map((size) => (
        <PinInput key={size} label={size} size={size} groups={[3, 3]} defaultValue="1234" />
      ))}
    </div>
  ),
};

/** Every size at phone width (the canvas adds a 24px gutter, more than a phone's 16px). */
export const Phone: Story = {
  args: { label: 'Code' },
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className="flex flex-col gap-6 bg-surface" data-testid="phone">
      {SIZES.map((size) => (
        <PinInput key={size} label={size} size={size} groups={[3, 3]} defaultValue="1234" />
      ))}
    </div>
  ),
};

/** Corners from the M3 shape scale, outlined and filled. */
export const Corners: Story = {
  args: { label: 'Code' },
  render: () => (
    <div className="grid gap-6 bg-surface p-4 medium:grid-cols-2" data-testid="corners">
      {(['outlined', 'filled'] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-4">
          {CORNERS.map((corner) => (
            <PinInput
              key={corner}
              label={`${variant} · ${corner}`}
              variant={variant}
              corner={corner}
              length={4}
              defaultValue="12"
            />
          ))}
        </div>
      ))}
    </div>
  ),
};

/** Groupings and character types: digits, letters and numbers, and a custom pattern. */
export const Types: Story = {
  args: { label: 'Code' },
  render: () => (
    <div className="flex flex-col gap-6 bg-surface p-4" data-testid="types">
      <PinInput label="One group" defaultValue="123456" />
      <PinInput label="Pairs" groups={[2, 2, 2]} defaultValue="123456" />
      <PinInput label="Voucher" length={8} type="alphanumeric" groups={[4, 4]} defaultValue="VK2026AB" otp={false} />
      <PinInput
        label="No look-alikes"
        length={6}
        type="alphanumeric"
        pattern={/[2-9A-HJ-NP-Z]/}
        separator="·"
        groups={[3, 3]}
        otp={false}
      />
    </div>
  ),
};

/** Controlled, with onComplete: a wrong code shakes and clears, the right one succeeds. */
export const Interactive: Story = {
  args: { label: 'Code' },
  render: function Render() {
    const [code, setCode] = useState('');
    const [result, setResult] = useState<'idle' | 'wrong' | 'ok'>('idle');
    return (
      <div className="flex flex-col gap-4 bg-surface p-4" data-testid="interactive">
        <PinInput
          label="6-digit code"
          groups={[3, 3]}
          value={code}
          onChange={(next) => {
            setCode(next);
            setResult('idle');
          }}
          onComplete={(value) => {
            if (value === '123456') setResult('ok');
            else {
              setResult('wrong');
              setCode('');
            }
          }}
          invalid={result === 'wrong'}
          errorMessage="That code didn't work. Try 123456."
          supportingText="Try 123456"
        />
        <span data-testid="result">{result}</span>
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
      <PinInput
        data-testid="target"
        aria-label="Code"
        length={4}
        defaultValue="12"
        className={LAYOUT_OVERRIDES[override]}
      />
    </div>
  ),
};

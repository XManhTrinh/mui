import type { Meta, StoryObj } from '@storybook/react-vite';
import { PhoneField, type PhoneCountry } from '@vkieu/mui/vk';
import { useState } from 'react';
import {
  LAYOUT_OVERRIDES,
  LAYOUT_OVERRIDE_NAMES,
  type LayoutOverrideName,
} from './layout-overrides';

const PRIORITY: PhoneCountry[] = ['GB', 'US', 'AU', 'VN'];

/** Regional-indicator emoji, for the flag example only (an app's own icons fit too). */
const emojiFlag = (country: PhoneCountry) =>
  String.fromCodePoint(...[...country].map((letter) => 0x1f1a5 + letter.charCodeAt(0)));

const meta = {
  title: 'VK/PhoneField',
  component: PhoneField,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PhoneField>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Both variants: empty, filled, invalid and disabled. */
export const Variants: Story = {
  args: { label: 'Phone' },
  render: () => (
    <div className="grid gap-6 bg-surface p-4 medium:grid-cols-2" data-testid="variants">
      {(['outlined', 'filled'] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-6">
          <PhoneField
            variant={variant}
            label="Phone (optional)"
            defaultCountry="GB"
            supportingText="Never shown on your profile"
            locale="en"
          />
          <PhoneField variant={variant} label="Phone" defaultValue="+447400123456" locale="en" />
          <PhoneField
            variant={variant}
            label="Phone"
            defaultValue="+44740012"
            invalid
            errorMessage="Enter a valid phone number for the United Kingdom"
            locale="en"
          />
          <PhoneField variant={variant} label="Phone" defaultValue="+84912345678" disabled locale="en" />
        </div>
      ))}
    </div>
  ),
};

/** Country names follow the page language; here Vietnamese. */
export const Vietnamese: Story = {
  args: { label: 'Số điện thoại' },
  render: () => (
    <div className="flex flex-col gap-6 bg-surface p-4" data-testid="vietnamese">
      <PhoneField
        label="Số điện thoại (không bắt buộc)"
        defaultCountry="VN"
        priorityCountries={PRIORITY}
        locale="vi"
        labels={{
          country: 'Quốc gia',
          search: 'Tìm quốc gia',
          noResults: 'Không tìm thấy quốc gia',
          suggested: 'Quốc gia gợi ý',
          allCountries: 'Tất cả quốc gia',
          invalid: 'Nhập số điện thoại hợp lệ',
        }}
      />
    </div>
  ),
};

/** Flags are the app's choice: `renderFlag` adds them to the button and the list. */
export const Flags: Story = {
  args: { label: 'Phone' },
  render: () => (
    <div className="flex flex-col gap-6 bg-surface p-4" data-testid="flags">
      <PhoneField
        label="Phone"
        defaultCountry="VN"
        priorityCountries={PRIORITY}
        renderFlag={(country) => <span className="text-[20px] leading-none">{emojiFlag(country)}</span>}
        locale="en"
      />
    </div>
  ),
};

/** Controlled, with the E.164 value it reports. */
export const Interactive: Story = {
  args: { label: 'Phone' },
  render: function Render() {
    const [phone, setPhone] = useState('');
    const [country, setCountry] = useState<PhoneCountry>('GB');
    return (
      <div className="flex flex-col gap-4 bg-surface p-4" data-testid="interactive">
        <PhoneField
          label="Phone (optional)"
          defaultCountry="GB"
          priorityCountries={PRIORITY}
          value={phone}
          onChange={setPhone}
          onCountryChange={setCountry}
          locale="en"
        />
        <p className="text-body-medium text-on-surface-variant">
          Value: <output data-testid="value">{phone || '(empty)'}</output> · Country:{' '}
          <output data-testid="country">{country}</output>
        </p>
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
      <PhoneField
        data-testid="target"
        aria-label="Phone"
        defaultCountry="GB"
        locale="en"
        className={LAYOUT_OVERRIDES[override]}
      />
    </div>
  ),
};

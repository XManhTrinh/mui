import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select, SelectItem, SelectSection, type SelectKey } from '@vkieu/mui';
import { useState } from 'react';
import { SearchIcon, StarIcon } from './icons';
import {
  LAYOUT_OVERRIDES,
  LAYOUT_OVERRIDE_NAMES,
  type LayoutOverrideName,
} from './layout-overrides';

const meta = {
  title: 'Components/Select',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const sortOptions = [
  <SelectItem key="newest">Newest first</SelectItem>,
  <SelectItem key="low" description="Cheapest at the top">
    Price, low to high
  </SelectItem>,
  <SelectItem key="high">Price, high to low</SelectItem>,
  <SelectItem key="near">Nearest to you</SelectItem>,
];

/** Both variants: empty, a placeholder, chosen, a leading icon, invalid and disabled. */
export const Variants: Story = {
  render: () => (
    <div className="grid gap-6 bg-surface p-4 medium:grid-cols-2" data-testid="variants">
      {(['filled', 'outlined'] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-6">
          <Select variant={variant} label="Sort by" supportingText="How results are ordered">
            {sortOptions}
          </Select>
          <Select variant={variant} label="Sort by" placeholder="Choose an order">
            {sortOptions}
          </Select>
          <Select variant={variant} label="Sort by" defaultValue="low" leadingIcon={<SearchIcon />}>
            {sortOptions}
          </Select>
          <Select
            variant={variant}
            label="Sort by"
            required
            invalid
            errorMessage="Choose how to sort"
          >
            {sortOptions}
          </Select>
          <Select variant={variant} label="Sort by" defaultValue="newest" disabled>
            {sortOptions}
          </Select>
        </div>
      ))}
    </div>
  ),
};

/** The menu open under the field, with the chosen option checked. */
export const Open: Story = {
  render: () => (
    <div className="bg-surface p-4" style={{ minHeight: 360 }} data-testid="open">
      <Select label="Sort by" defaultValue="low" defaultOpen disabledKeys={['near']}>
        {sortOptions}
      </Select>
    </div>
  ),
};

/** Sections with headings, and options with icons. */
export const Sections: Story = {
  render: () => (
    <div className="bg-surface p-4" style={{ minHeight: 420 }} data-testid="sections">
      <Select label="Category" defaultOpen>
        <SelectSection title="Food">
          <SelectItem key="pho" leadingIcon={<StarIcon />}>
            Phở and noodles
          </SelectItem>
          <SelectItem key="banh-mi">Bánh mì</SelectItem>
        </SelectSection>
        <SelectSection title="Services">
          <SelectItem key="nails" trailing="128">
            Nails and beauty
          </SelectItem>
          <SelectItem key="tax" trailing="42">
            Tax and accounting
          </SelectItem>
        </SelectSection>
      </Select>
    </div>
  ),
};

/** Multiple selection: the field lists the chosen options, the menu stays open. */
export const Multiple: Story = {
  render: function Render() {
    const [value, setValue] = useState<SelectKey[]>(['pho', 'banh-mi', 'cafe']);
    return (
      <div className="flex flex-col gap-4 bg-surface p-4" data-testid="multiple">
        <Select
          label="Cuisines"
          selectionMode="multiple"
          value={value}
          onChange={setValue}
          maxSelections={4}
          supportingText="Up to four"
        >
          <SelectItem key="pho">Phở</SelectItem>
          <SelectItem key="banh-mi">Bánh mì</SelectItem>
          <SelectItem key="cafe">Cà phê</SelectItem>
          <SelectItem key="bun">Bún chả</SelectItem>
          <SelectItem key="com">Cơm tấm</SelectItem>
          <SelectItem key="che">Chè</SelectItem>
        </Select>
        <p className="text-body-medium text-on-surface-variant">
          Value: <output data-testid="value">{value.join(', ') || '(none)'}</output>
        </p>
      </div>
    );
  },
};

/** `presentation="sheet"`: the options in a bottom sheet (or `"auto"`: on phones only). */
export const Sheet: Story = {
  render: () => (
    <div className="bg-surface p-4" data-testid="sheet">
      <Select label="Sort by" presentation="auto" defaultValue="newest">
        {sortOptions}
      </Select>
    </div>
  ),
};

const COUNTRIES = [
  ['AU', 'Australia'],
  ['AT', 'Austria'],
  ['BE', 'Belgium'],
  ['CA', 'Canada'],
  ['CZ', 'Czechia'],
  ['DK', 'Denmark'],
  ['FI', 'Finland'],
  ['FR', 'France'],
  ['DE', 'Germany'],
  ['IE', 'Ireland'],
  ['IT', 'Italy'],
  ['JP', 'Japan'],
  ['NL', 'Netherlands'],
  ['NZ', 'New Zealand'],
  ['NO', 'Norway'],
  ['PL', 'Poland'],
  ['SG', 'Singapore'],
  ['KR', 'South Korea'],
  ['ES', 'Spain'],
  ['SE', 'Sweden'],
  ['TW', 'Taiwan'],
  ['TH', 'Thailand'],
  ['GB', 'United Kingdom'],
  ['US', 'United States'],
  ['VN', 'Việt Nam'],
].map(([code, name]) => ({ code: code!, name: name! }));

/**
 * `searchable`: a search at the top of the menu (or, with `presentation="auto"`, the sheet
 * on phones) filters a long list as you type.
 */
export const Searchable: Story = {
  render: function Render() {
    const [country, setCountry] = useState<SelectKey | null>(null);
    return (
      <div className="flex flex-col gap-4 bg-surface p-4" style={{ minHeight: 560 }} data-testid="searchable">
        <Select
          label="Country of residence"
          searchable
          presentation="auto"
          items={COUNTRIES}
          value={country}
          onChange={setCountry}
        >
          {(item) => <SelectItem key={item.code}>{item.name}</SelectItem>}
        </Select>
        <p className="text-body-medium text-on-surface-variant">
          Value: <output data-testid="value">{country ?? '(none)'}</output>
        </p>
      </div>
    );
  },
};

/** Vietnamese labels, as an app passes them. */
export const Vietnamese: Story = {
  render: () => (
    <div className="bg-surface p-4" data-testid="vietnamese">
      <Select
        label="Sắp xếp theo"
        placeholder="Chọn cách sắp xếp"
        labels={{ empty: 'Không có lựa chọn', loading: 'Đang tải', more: (count) => `+${count}` }}
      >
        <SelectItem key="newest">Mới nhất</SelectItem>
        <SelectItem key="low">Giá từ thấp đến cao</SelectItem>
        <SelectItem key="high">Giá từ cao đến thấp</SelectItem>
      </Select>
    </div>
  ),
};

/** Controlled, inside a form, with the value it reports. */
export const Interactive: Story = {
  render: function Render() {
    const [sort, setSort] = useState<SelectKey | null>('newest');
    return (
      <form className="flex flex-col gap-4 bg-surface p-4" data-testid="interactive">
        <Select label="Sort by" name="sort" value={sort} onChange={setSort}>
          {sortOptions}
        </Select>
        <p className="text-body-medium text-on-surface-variant">
          Value: <output data-testid="value">{sort ?? '(none)'}</output>
        </p>
      </form>
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
      style={{ minHeight: 320, width: 360 }}
    >
      <Select data-testid="target" label="Sort by" className={LAYOUT_OVERRIDES[override]}>
        {sortOptions}
      </Select>
    </div>
  ),
};

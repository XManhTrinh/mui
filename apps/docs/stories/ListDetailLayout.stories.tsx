import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton, List, ListItem } from '@vkieu/mui';
import { ListDetailLayout, type ListDetailLayoutVariant } from '@vkieu/mui/vk';
import { useState } from 'react';
import {
  LAYOUT_OVERRIDES,
  LAYOUT_OVERRIDE_NAMES,
  type LayoutOverrideName,
} from './layout-overrides';

const meta = {
  title: 'VK/ListDetailLayout',
  component: ListDetailLayout,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ListDetailLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

const ArrowBackIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  </svg>
);

const SECTIONS = [
  { key: 'profile', title: 'Profile', summary: 'Name, photos, bio and languages' },
  { key: 'account', title: 'Account', summary: '@mai.tran · m•••@gmail.com' },
  { key: 'preferences', title: 'Preferences', summary: 'English · System theme' },
  { key: 'privacy', title: 'Privacy', summary: 'Shown in search engines · 2 blocked' },
];

/**
 * Settings: pick a section to open it. Below 840px one pane shows at a time, with Back on
 * the section; from 840px the list sits beside the open section.
 */
function SettingsDemo({
  variant = 'plain',
  initial = 'list',
}: {
  variant?: ListDetailLayoutVariant;
  initial?: 'list' | 'detail';
}) {
  const [open, setOpen] = useState('profile');
  const [active, setActive] = useState<'list' | 'detail'>(initial);
  const section = SECTIONS.find((item) => item.key === open) ?? SECTIONS[0];

  return (
    <div data-testid="layout" className="min-h-[560px] bg-surface p-4 medium:p-6">
      <ListDetailLayout
        variant={variant}
        active={active}
        detailKey={`${active}-${open}`}
        listLabel="Settings"
        detailLabel={section?.title ?? ''}
        back={
          <IconButton
            aria-label="Back to settings"
            icon={<ArrowBackIcon />}
            onPress={() => setActive('list')}
          />
        }
        list={
          <List
            aria-label="Settings sections"
            selectionMode="single"
            selectedKeys={[open]}
            onSelectionChange={(keys) => {
              // Tapping the open item again deselects it; it still opens, and stays selected.
              const [key] = keys === 'all' ? [] : [...keys];
              setOpen(key === undefined ? open : String(key));
              setActive('detail');
            }}
          >
            {SECTIONS.map((item) => (
              <ListItem key={item.key} supportingText={item.summary}>
                {item.title}
              </ListItem>
            ))}
          </List>
        }
        detail={
          <div className="flex flex-col gap-3 p-4">
            <h2 className="text-headline-small text-on-surface">{section?.title}</h2>
            <p className="text-body-large text-on-surface-variant">{section?.summary}</p>
          </div>
        }
      />
    </div>
  );
}

/** The settings pattern on the page's surface (the default). Resize to see one or two panes. */
export const Settings: Story = {
  args: { active: 'list', list: null, detail: null, listLabel: '', detailLabel: '' },
  render: () => <SettingsDemo />,
};

/** An item open: below 840px the detail shows with Back. */
export const DetailOpen: Story = {
  args: Settings.args,
  render: () => <SettingsDemo initial="detail" />,
};

/** Each pane as a `surface-container-low` container. */
export const Filled: Story = {
  args: Settings.args,
  render: () => <SettingsDemo variant="filled" initial="detail" />,
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
      style={{ minHeight: 320, width: 960 }}
    >
      <ListDetailLayout
        data-testid="target"
        className={LAYOUT_OVERRIDES[override]}
        active="detail"
        listLabel="Settings"
        detailLabel="Profile"
        list={<p className="p-4 text-body-large text-on-surface">The list</p>}
        detail={<p className="p-4 text-body-large text-on-surface">The open item</p>}
      />
    </div>
  ),
};

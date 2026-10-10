import type { Meta, StoryObj } from '@storybook/react-vite';
import { List, ListItem, Switch, type ListVariant } from '@vkieu/mui';
import { useState } from 'react';
import { DeleteIcon, HomeIcon, SearchIcon, SendIcon, StarIcon } from './icons';
import {
  LAYOUT_OVERRIDES,
  LAYOUT_OVERRIDE_NAMES,
  type LayoutOverrideName,
} from './layout-overrides';

interface Args {
  variant: ListVariant;
}

const meta = {
  title: 'Components/List',
  args: { variant: 'segmented' },
  argTypes: { variant: { control: 'inline-radio', options: ['standard', 'segmented'] } },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

const Avatar = ({ letter }: { letter: string }) => (
  <span className="flex size-10 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
    {letter}
  </span>
);

/** One-, two- and three-line items with leading and trailing content. */
export const Static: Story = {
  render: ({ variant }) => (
    <div className="w-[360px] rounded-corner-extra-large bg-surface-container p-3" data-testid="static">
      <List aria-label="Contacts" variant={variant}>
        <ListItem key="a" leading={<HomeIcon />} trailing={<StarIcon />}>
          One line
        </ListItem>
        <ListItem
          key="b"
          leading={<Avatar letter="B" />}
          supportingText="Supporting text"
          trailing="9:41"
        >
          Two lines
        </ListItem>
        <ListItem
          key="c"
          leading={<Avatar letter="C" />}
          overline="Overline"
          supportingText="Supporting text"
        >
          Three lines
        </ListItem>
        <ListItem key="d">Text only</ListItem>
      </List>
    </div>
  ),
};

/** An interactive list: press or Enter acts, ↑ / ↓ move, ← / → reach the switch. */
export const Interactive: Story = {
  render: function InteractiveStory({ variant }) {
    const [last, setLast] = useState('');
    return (
      <div className="flex w-[360px] flex-col gap-3 rounded-corner-extra-large bg-surface-container p-3">
        <List
          aria-label="Mail"
          variant={variant}
          onAction={(key) => setLast(String(key))}
          data-testid="list"
        >
          <ListItem key="inbox" leading={<HomeIcon />} supportingText="3 new messages">
            Inbox
          </ListItem>
          <ListItem key="starred" leading={<StarIcon />}>
            Starred
          </ListItem>
          <ListItem
            key="sent"
            leading={<SendIcon />}
            trailing={<Switch aria-label="Notify for sent mail" />}
          >
            Sent
          </ListItem>
          <ListItem key="trash" leading={<DeleteIcon />}>
            Trash
          </ListItem>
        </List>
        <p className="px-2 text-body-medium" data-testid="last">
          Opened {last}
        </p>
      </div>
    );
  },
};

/** Multiple selection: selected items turn secondary-container with 16px corners. */
export const Selection: Story = {
  render: function SelectionStory({ variant }) {
    const [selected, setSelected] = useState<Set<string | number> | 'all'>(new Set(['work']));
    return (
      <div className="w-[360px] rounded-corner-extra-large bg-surface-container p-3" data-testid="selection">
        <List
          aria-label="Labels"
          variant={variant}
          selectionMode="multiple"
          selectedKeys={selected}
          onSelectionChange={setSelected}
        >
          {['work', 'home', 'travel'].map((key) => (
            <ListItem key={key} leading={<StarIcon />} supportingText={`${key} label`}>
              {key[0]!.toUpperCase() + key.slice(1)}
            </ListItem>
          ))}
        </List>
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
  render: function LayoutOverrideStory({ override, transformedAncestor }) {
    const [count, setCount] = useState(0);
    return (
      <div className={transformedAncestor ? 'translate-x-2' : undefined} style={{ minHeight: 200 }}>
        <p className="mb-4 text-body-medium" data-testid="count">
          Pressed {count}
        </p>
        <List
          aria-label="Actions"
          variant="segmented"
          data-testid="target"
          style={{ width: 360 }}
          className={LAYOUT_OVERRIDES[override]}
          onAction={() => setCount((c) => c + 1)}
        >
          <ListItem key="search" leading={<SearchIcon />}>
            Search
          </ListItem>
          <ListItem key="star" leading={<StarIcon />}>
            Star
          </ListItem>
        </List>
      </div>
    );
  },
};

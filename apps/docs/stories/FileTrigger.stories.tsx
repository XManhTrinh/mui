import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  MenuTrigger,
  Tooltip,
  TooltipTrigger,
} from '@vkieu/mui';
import { FileTrigger, useFileTrigger } from '@vkieu/mui/vk';
import { useState } from 'react';
import { EditIcon, MoreVertIcon } from './icons';

const meta = {
  title: 'VK/FileTrigger',
  component: FileTrigger,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FileTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Buttons, an icon button in a tooltip, and a menu item (useFileTrigger). */
export const Triggers: Story = {
  args: { onSelect: () => {}, children: null },
  render: function TriggersStory() {
    const [chosen, setChosen] = useState({ count: 0, names: '' });
    // Counted, so choosing the same file again shows as a new choice.
    const show = (files: File[]) =>
      setChosen(({ count }) => ({
        count: count + 1,
        names: files.map((file) => file.name).join(', '),
      }));
    const picker = useFileTrigger({ accept: ['image/*'], onSelect: show });
    return (
      <div data-testid="triggers" className="flex flex-col items-start gap-4 bg-surface p-4">
        <div className="flex items-center gap-3">
          <FileTrigger accept={['image/jpeg', 'image/png']} onSelect={show}>
            <Button variant="filled">Upload photo</Button>
          </FileTrigger>
          <TooltipTrigger>
            <FileTrigger accept={['image/*']} multiple onSelect={show}>
              <IconButton variant="tonal" icon={<EditIcon />} aria-label="Add photos" />
            </FileTrigger>
            <Tooltip>Add photos</Tooltip>
          </TooltipTrigger>
          <MenuTrigger>
            <IconButton icon={<MoreVertIcon />} aria-label="Cover photo" />
            <Menu aria-label="Cover photo" onAction={() => picker.open()}>
              <MenuItem key="upload">Upload photo</MenuItem>
            </Menu>
          </MenuTrigger>
          {picker.input}
        </div>
        <p data-testid="chosen" className="text-body-medium text-on-surface-variant">
          {chosen.count > 0 ? `${chosen.count} · ${chosen.names}` : 'Nothing chosen'}
        </p>
      </div>
    );
  },
};

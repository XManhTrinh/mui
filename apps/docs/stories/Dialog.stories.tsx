import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@vkieu/mui';
import { DeleteIcon } from './icons';

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A basic dialog with title, supporting text and two actions. */
export const Basic: Story = {
  render: () => (
    <DialogTrigger>
      <Button variant="tonal">Open dialog</Button>
      <Dialog data-testid="dialog">
        {({ close }) => (
          <>
            <DialogTitle>Discard draft?</DialogTitle>
            <DialogContent>Your changes to this message will be lost.</DialogContent>
            <DialogActions>
              <Button variant="text" onPress={close}>
                Cancel
              </Button>
              <Button variant="text" onPress={close}>
                Discard
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </DialogTrigger>
  ),
};

/** With an icon: the title is centred. */
export const WithIcon: Story = {
  render: () => (
    <DialogTrigger defaultOpen>
      <Button variant="tonal">Open dialog</Button>
      <Dialog icon={<DeleteIcon />} data-testid="dialog">
        {({ close }) => (
          <>
            <DialogTitle>Permanently delete?</DialogTitle>
            <DialogContent>
              Deleting the selected messages will also remove them from synced devices.
            </DialogContent>
            <DialogActions>
              <Button variant="text" onPress={close}>
                Cancel
              </Button>
              <Button variant="text" onPress={close}>
                Delete
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </DialogTrigger>
  ),
};

/** Long content scrolls inside the dialog; long actions stack with the confirm action on top. */
export const LongContent: Story = {
  render: () => (
    <DialogTrigger defaultOpen>
      <Button variant="tonal">Open dialog</Button>
      <Dialog data-testid="dialog">
        {({ close }) => (
          <>
            <DialogTitle>Terms of service</DialogTitle>
            <DialogContent data-testid="content">
              {Array.from({ length: 40 }, (_, i) => (
                <p key={i} className="pb-2">
                  Paragraph {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              ))}
            </DialogContent>
            <DialogActions>
              <Button variant="text" onPress={close}>
                Decline and close this window
              </Button>
              <Button variant="text" onPress={close}>
                Accept all the terms above
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </DialogTrigger>
  ),
};

/** An alert dialog is not dismissed by pressing outside. */
export const Alert: Story = {
  render: () => (
    <DialogTrigger>
      <Button>Reset settings</Button>
      <Dialog role="alertdialog" data-testid="dialog">
        {({ close }) => (
          <>
            <DialogTitle>Reset all settings?</DialogTitle>
            <DialogActions>
              <Button variant="text" onPress={close}>
                Cancel
              </Button>
              <Button variant="text" onPress={close}>
                Reset
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </DialogTrigger>
  ),
};

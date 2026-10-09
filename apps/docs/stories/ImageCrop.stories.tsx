import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@vkieu/mui';
import { ImageCropDialog, ImageCropper, type ImageCropResult } from '@vkieu/mui/vk';
import { useState } from 'react';

/** A deterministic 1600×1200 stand-in photo (an inline SVG), so screenshots never use the network. */
const PHOTO = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200" viewBox="0 0 1600 1200"><rect width="1600" height="1200" fill="#9cc9e8"/><circle cx="1240" cy="300" r="120" fill="#ffe7a3"/><path d="M0 900 L420 520 L760 860 L1080 600 L1600 980 L1600 1200 L0 1200 Z" fill="#5f8a6a"/><circle cx="800" cy="560" r="150" fill="#f1c7a2"/><rect x="620" y="740" width="360" height="460" rx="180" fill="#2f4858"/></svg>',
)}`;

const meta = {
  title: 'VK/ImageCrop',
  component: ImageCropper,
  parameters: { layout: 'padded' },
  args: { src: PHOTO },
} satisfies Meta<typeof ImageCropper>;

export default meta;
type Story = StoryObj<typeof meta>;

function Readout(props: React.ComponentProps<typeof ImageCropper>) {
  const [result, setResult] = useState<ImageCropResult | null>(null);
  return (
    <div className="flex w-[360px] max-w-full flex-col gap-3" data-testid="cropper">
      <ImageCropper {...props} onCropChange={setResult} />
      <output data-testid="crop" className="text-body-medium text-on-surface-variant">
        {result ? JSON.stringify(result.crop) : 'none'}
      </output>
    </div>
  );
}

/** Inline, square, with the round-avatar guide. */
export const Avatar: Story = {
  render: (args) => <Readout {...args} guide="circle" />,
};

/** A 4:5 frame, as for a post photo. */
export const Portrait: Story = {
  render: (args) => <Readout {...args} aspect={4 / 5} />,
};

/** A photo that can't be opened. */
export const Unreadable: Story = {
  render: (args) => <Readout {...args} src="data:image/png;base64,bm90IGFuIGltYWdl" />,
};

function DialogDemo({ busy = false }: { busy?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="tonal" onPress={() => setOpen(true)}>
        Change photo
      </Button>
      <ImageCropDialog
        open={open}
        onOpenChange={setOpen}
        src={PHOTO}
        guide="circle"
        busy={busy}
        progress={busy ? 0.4 : undefined}
        onConfirm={() => setOpen(false)}
      />
    </>
  );
}

/** The dialog: full screen on compact windows, basic on larger ones. */
export const Dialog: Story = {
  render: () => <DialogDemo />,
};

/** Uploading after confirm: progress shows and the dialog can't be dismissed. */
export const DialogBusy: Story = {
  render: () => <DialogDemo busy />,
};

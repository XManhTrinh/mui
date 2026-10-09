'use client';

import { useState } from 'react';
import { Button } from '../../components/button/Button';
import { Dialog, DialogActions, DialogContent, DialogHeader } from '../../components/dialog/Dialog';
import { LinearProgressIndicator } from '../../components/progress/ProgressIndicator';
import {
  ImageCropper,
  type ImageCropperClassNames,
  type ImageCropperLabels,
  type ImageCropResult,
} from './ImageCropper';
import { imageCropStyles } from './image-crop-styles';

export interface ImageCropDialogLabels extends ImageCropperLabels {
  /** The dialog's headline, e.g. "Adjust your photo". */
  title: string;
  /** The confirming action, e.g. "Save". */
  confirm: string;
  cancel: string;
  /** The full-screen dialog's close button. */
  close: string;
  /** Names the progress indicator while `busy`. */
  busy: string;
}

const DEFAULT_LABELS: Omit<ImageCropDialogLabels, keyof ImageCropperLabels> = {
  title: 'Adjust your photo',
  confirm: 'Save',
  cancel: 'Cancel',
  close: 'Close',
  busy: 'Uploading',
};

export interface ImageCropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The photo: an object URL of a picked file, or any image URL. */
  src: string;
  /** Called with the crop when the person confirms. Keep the dialog open while uploading (`busy`). */
  onConfirm: (result: ImageCropResult) => void;
  /** The frame's width divided by its height. @default 1 */
  aspect?: number;
  /** `circle` draws a dashed circle in the frame, showing what a round avatar shows. @default "none" */
  guide?: 'circle' | 'none';
  /** @default 4 */
  maxZoom?: number;
  /**
   * The app is saving after confirm: the actions are disabled, a progress indicator shows,
   * and the dialog can't be dismissed.
   */
  busy?: boolean;
  /** Upload progress from 0 to 1 while `busy`; indeterminate when left out. */
  progress?: number;
  labels?: Partial<ImageCropDialogLabels>;
  className?: string;
  classNames?: ImageCropperClassNames;
}

/**
 * Frames a photo before upload in a dialog: full screen on compact windows (with the M3
 * full-screen dialog's header) and a basic dialog on larger ones. Returns the crop in the
 * original photo's pixels; the app uploads the original file with it and crops on the
 * server, so nothing is re-encoded in the browser.
 *
 * Not an M3 component (`@vkieu/mui/vk`, docs/plans/image-crop-dialog.md).
 *
 * @example
 * <ImageCropDialog
 *   open={file !== null}
 *   onOpenChange={(open) => !open && setFile(null)}
 *   src={objectUrl}
 *   guide="circle"
 *   busy={uploading}
 *   onConfirm={({ crop }) => upload(file, crop)}
 * />
 */
export function ImageCropDialog({
  open,
  onOpenChange,
  src,
  onConfirm,
  aspect,
  guide,
  maxZoom,
  busy = false,
  progress,
  labels: labelsProp,
  className,
  classNames,
}: ImageCropDialogProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const [result, setResult] = useState<ImageCropResult | null>(null);
  const canConfirm = result !== null && !busy;
  const confirm = () => {
    if (result) onConfirm(result);
  };

  return (
    <Dialog
      open={open}
      // Closing mid-upload would leave the upload without a place to report to.
      onOpenChange={(next) => {
        if (next || !busy) onOpenChange(next);
      }}
      dismissable={!busy}
      keyboardDismissDisabled={busy}
      fullScreen="compact"
      className={className}
    >
      <DialogHeader
        closeLabel={labels.close}
        action={
          <Button variant="text" disabled={!canConfirm} onPress={confirm}>
            {labels.confirm}
          </Button>
        }
      >
        {labels.title}
      </DialogHeader>
      <DialogContent className={imageCropStyles().dialogContent()}>
        {busy && (
          <LinearProgressIndicator value={progress} aria-label={labels.busy} className="w-full" />
        )}
        <ImageCropper
          src={src}
          aspect={aspect}
          guide={guide}
          maxZoom={maxZoom}
          onCropChange={setResult}
          labels={labelsProp}
          classNames={classNames}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="text" disabled={busy} onPress={() => onOpenChange(false)}>
          {labels.cancel}
        </Button>
        <Button variant="text" disabled={!canConfirm} onPress={confirm}>
          {labels.confirm}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

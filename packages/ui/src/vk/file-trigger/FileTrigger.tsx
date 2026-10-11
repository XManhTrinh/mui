'use client';

import { useContext, type ReactElement, type ReactNode, type Ref } from 'react';
import { mergeProps, useObjectRef } from 'react-aria';
import { TriggerContext } from '../../primitives/TriggerContext';

export interface FileTriggerOptions {
  /** Called with the chosen files; never with an empty list. */
  onSelect: (files: File[]) => void;
  /** MIME types or extensions the picker offers, e.g. `['image/jpeg', '.pdf']`. */
  accept?: readonly string[];
  /** Lets the person choose several files. @default false */
  multiple?: boolean;
  /** On phones, opens the front (`user`) or back (`environment`) camera instead of the files. */
  capture?: 'user' | 'environment';
  /** Chooses a folder (and everything in it) instead of files, where the browser supports it. */
  directory?: boolean;
}

export interface FileTriggerResult {
  /** Opens the file picker. Call it from a press or key handler: browsers need a user action. */
  open: () => void;
  /** The hidden file input. Render it once, anywhere near the trigger. */
  input: ReactElement;
}

/**
 * The file picker for a trigger that can't be wrapped in {@link FileTrigger}, such as a menu
 * item's action: `open()` opens it and `input` is the hidden input that does the work.
 *
 * @example
 * const picker = useFileTrigger({ accept: ['image/*'], onSelect: (files) => upload(files[0]) });
 * <Menu onAction={(key) => key === 'upload' && picker.open()}>…</Menu>
 * {picker.input}
 */
export function useFileTrigger(
  { onSelect, accept, multiple = false, capture, directory = false }: FileTriggerOptions,
  inputRef?: Ref<HTMLInputElement>,
): FileTriggerResult {
  const ref = useObjectRef(inputRef);
  const input = (
    <input
      ref={ref}
      type="file"
      // Not shown and not in the tab order: the trigger is the control.
      hidden
      tabIndex={-1}
      aria-hidden="true"
      accept={accept?.join(',')}
      multiple={multiple}
      capture={capture}
      // A boolean attribute React doesn't know, so it's passed as an empty string.
      {...(directory && { webkitdirectory: '' })}
      onChange={(event) => {
        const files = Array.from(event.target.files ?? []);
        // Cleared, so choosing the same file again still reports it.
        event.target.value = '';
        if (files.length > 0) onSelect(files);
      }}
    />
  );
  return { open: () => ref.current?.click(), input };
}

export interface FileTriggerProps extends FileTriggerOptions {
  /** One library button (Button, IconButton, Fab…) or anything reading `TriggerContext`. */
  children: ReactNode;
  /** The hidden file input. */
  inputRef?: Ref<HTMLInputElement>;
}

/**
 * Makes the button inside it open the system file picker (or the camera on phones), as
 * mui's other triggers do for dialogs and menus. Put it inside a `TooltipTrigger` rather
 * than around one: it keeps the outer trigger's props. Disable the button to stop it.
 * **Not an M3 component** (a `vk` component, see
 * docs/plans/shaped-icon-skip-link-file-trigger.md).
 *
 * @example
 * <FileTrigger accept={['image/jpeg', 'image/png']} onSelect={(files) => crop(files[0])}>
 *   <IconButton icon={<CameraIcon />} aria-label="Change photo" />
 * </FileTrigger>
 */
export function FileTrigger({ children, inputRef, ...options }: FileTriggerProps) {
  const { open, input } = useFileTrigger(options, inputRef);
  const outer = useContext(TriggerContext);
  return (
    <>
      <TriggerContext value={mergeProps(outer ?? {}, { onPress: open })}>{children}</TriggerContext>
      {input}
    </>
  );
}

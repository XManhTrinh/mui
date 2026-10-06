'use client';

import { createContext, type DOMAttributes, type Ref } from 'react';
import type { PressEvent } from 'react-aria';

/** Props an overlay trigger (dialog, menu) gives the button that opens it. */
export interface TriggerContextValue extends DOMAttributes<HTMLElement> {
  onPress?: (event: PressEvent) => void;
  /** Menus open on press start. */
  onPressStart?: (event: PressEvent) => void;
  /** Menu triggers keep focus where it is on press (React Aria `useMenuTrigger`). */
  preventFocusOnPress?: boolean;
  'aria-haspopup'?: boolean | 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid' | 'true' | 'false';
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
  id?: string;
  /** The trigger element, e.g. for positioning a menu next to it. */
  ref?: Ref<HTMLElement>;
}

/**
 * Lets an overlay trigger wire up whichever button-like child opens it (Button,
 * IconButton, Fab, a pressable Card) without cloning elements: `ButtonBase` merges these
 * props into its own. Overlays reset it to `null` so buttons inside them are unaffected.
 */
export const TriggerContext = createContext<TriggerContextValue | null>(null);

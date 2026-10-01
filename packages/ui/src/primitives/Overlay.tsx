'use client';

import type { ReactNode } from 'react';
import { Overlay as AriaOverlay } from 'react-aria';
import { useThemeScope } from '../theme/context';
import { themeAttributes } from '../theme/state';

export interface OverlayProps {
  children: ReactNode;
  /** Element to portal into. @default document.body */
  portalContainer?: Element;
  /** Leave focus handling to the caller instead of restoring it on unmount. */
  disableFocusManagement?: boolean;
}

/**
 * Portals overlay content (dialogs, menus, sheets, tooltips) to `document.body`
 * while keeping the theme, mode, contrast and motion scheme of the place it was
 * rendered from, so overlays opened inside a `ThemeScope` still match it.
 * Dismissal, focus containment and scroll locking come from the React Aria overlay
 * hooks (`useModalOverlay`, `usePopover`, …) of the component using it.
 */
export function Overlay({ children, portalContainer, disableFocusManagement }: OverlayProps) {
  const scope = useThemeScope();
  return (
    <AriaOverlay portalContainer={portalContainer} disableFocusManagement={disableFocusManagement}>
      <div
        {...themeAttributes(scope)}
        data-overlay-scope=""
        style={{ display: 'contents', color: 'var(--md-sys-color-on-surface)' }}
      >
        {children}
      </div>
    </AriaOverlay>
  );
}

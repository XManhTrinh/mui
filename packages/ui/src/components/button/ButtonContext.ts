'use client';

import { createContext } from 'react';
import type { ButtonShape, ButtonSize, ButtonVariant } from './button-styles';

/** Props a parent (such as a button group) shares with its buttons. A button's own props win. */
export interface ButtonContextValue {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  disabled?: boolean;
}

export const ButtonContext = createContext<ButtonContextValue>({});

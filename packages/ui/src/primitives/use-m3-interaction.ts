'use client';

import { mergeProps, useFocusRing, useHover, usePress, type PressEvents } from 'react-aria';
import type { DOMAttributes, KeyboardEvent, PointerEvent, RefObject } from 'react';

export interface M3InteractionOptions extends PressEvents {
  isDisabled?: boolean;
  isSelected?: boolean;
  isDragged?: boolean;
  /**
   * Pressed state from another React Aria hook (e.g. `useButton`). When provided,
   * this hook does not attach its own press handling.
   */
  isPressed?: boolean;
  /** Treat focus inside the element as focus on the element (e.g. text fields). */
  within?: boolean;
  /** Whether the element is a text input; focus is then always visible. */
  isTextInput?: boolean;
  autoFocus?: boolean;
}

export interface M3InteractionState {
  isHovered: boolean;
  isPressed: boolean;
  isFocused: boolean;
  isFocusVisible: boolean;
}

/** `data-*` attributes read by the `state-layer` and `focus-ring` utilities. */
export interface M3InteractionDataAttributes {
  'data-hovered'?: true;
  'data-pressed'?: true;
  'data-focused'?: true;
  'data-focus-visible'?: true;
  'data-disabled'?: true;
  'data-selected'?: true;
  'data-dragged'?: true;
}

export interface M3InteractionResult {
  /** Event handlers to spread on the interactive element. */
  interactionProps: DOMAttributes<HTMLElement>;
  dataAttributes: M3InteractionDataAttributes;
  state: M3InteractionState;
}

const flag = (value: boolean | undefined): true | undefined => (value ? true : undefined);

/** Positions the ripple at the press point, sized to reach the farthest corner. */
function setRippleOrigin(element: HTMLElement, clientX?: number, clientY?: number) {
  const rect = element.getBoundingClientRect();
  const x = clientX === undefined ? rect.width / 2 : clientX - rect.left;
  const y = clientY === undefined ? rect.height / 2 : clientY - rect.top;
  const radius = Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y));
  element.style.setProperty('--m3-ripple-x', `${x}px`);
  element.style.setProperty('--m3-ripple-y', `${y}px`);
  element.style.setProperty('--m3-ripple-size', `${Math.ceil(radius)}px`);
}

/**
 * M3 interaction states for any element: hover, press, focus-visible, selected,
 * dragged and disabled, exposed as `data-*` attributes, plus the ripple origin.
 * Pair with the `state-layer` and `focus-ring` utilities, which paint the state
 * layer and ripple as background layers on the element itself (no child nodes).
 */
export function useM3Interaction(
  options: M3InteractionOptions,
  ref: RefObject<HTMLElement | null>,
): M3InteractionResult {
  const { isDisabled, isSelected, isDragged, within, isTextInput, autoFocus } = options;
  const hasExternalPress = options.isPressed !== undefined;

  const { pressProps, isPressed: isOwnPressed } = usePress({
    ...options,
    ref,
    isDisabled: isDisabled || hasExternalPress,
  });
  const { hoverProps, isHovered } = useHover({ isDisabled });
  const { focusProps, isFocused, isFocusVisible } = useFocusRing({
    within,
    isTextInput,
    autoFocus,
  });

  const isPressed = hasExternalPress ? Boolean(options.isPressed) : isOwnPressed;

  const rippleProps: DOMAttributes<HTMLElement> = {
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      if (!isDisabled) setRippleOrigin(event.currentTarget, event.clientX, event.clientY);
    },
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      if (!isDisabled && (event.key === 'Enter' || event.key === ' ')) {
        setRippleOrigin(event.currentTarget);
      }
    },
  };

  return {
    interactionProps: mergeProps(
      hasExternalPress ? {} : pressProps,
      hoverProps,
      focusProps,
      rippleProps,
    ),
    dataAttributes: {
      'data-hovered': flag(isHovered && !isDisabled),
      'data-pressed': flag(isPressed && !isDisabled),
      'data-focused': flag(isFocused),
      'data-focus-visible': flag(isFocusVisible),
      'data-disabled': flag(isDisabled),
      'data-selected': flag(isSelected),
      'data-dragged': flag(isDragged),
    },
    state: { isHovered, isPressed, isFocused, isFocusVisible },
  };
}

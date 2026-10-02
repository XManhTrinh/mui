'use client';

import { mergeProps, useFocusRing, useHover, usePress, type PressEvents } from 'react-aria';
import {
  useEffect,
  useState,
  type DOMAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type RefObject,
} from 'react';

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
  /** The ripple is showing: from press start until release, but at least 225ms. */
  'data-rippling'?: true;
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

/** Compose `RippleAnimation`: the radius grows (and the centre travels) over 225ms. */
export const RIPPLE_GROW_MS = 225;

/**
 * Starts a ripple at the press point (Compose `RippleAnimation`): it grows from 30% of the
 * element's longer side to half its diagonal plus 10px while its centre moves to the
 * middle. The new origin is flushed to style before `data-rippling` turns on, so the
 * transition starts from this press rather than the last one.
 */
function setRippleOrigin(element: HTMLElement, clientX?: number, clientY?: number) {
  const rect = element.getBoundingClientRect();
  const x = clientX === undefined ? rect.width / 2 : clientX - rect.left;
  const y = clientY === undefined ? rect.height / 2 : clientY - rect.top;
  element.style.setProperty('--m3-ripple-origin-x', `${x}px`);
  element.style.setProperty('--m3-ripple-origin-y', `${y}px`);
  element.style.setProperty('--m3-ripple-start', `${Math.max(rect.width, rect.height) * 0.3}px`);
  element.style.setProperty(
    '--m3-ripple-size',
    `${Math.ceil(Math.hypot(rect.width, rect.height) / 2 + 10)}px`,
  );
  getComputedStyle(element).getPropertyValue('--m3-ripple-x');
}

/**
 * Whether a ripple should be showing. Compose always finishes a ripple's 225ms growth
 * before fading it out, so a quick tap still reaches the edges: this stays true from press
 * start until release, but for at least 225ms.
 */
export function useRippleHold(isPressed: boolean): boolean {
  const [wasPressed, setWasPressed] = useState(isPressed);
  const [held, setHeld] = useState(false);
  const [presses, setPresses] = useState(0);
  // Adjust state while rendering when a press starts (no effect, no extra paint).
  if (isPressed !== wasPressed) {
    setWasPressed(isPressed);
    if (isPressed) {
      setHeld(true);
      setPresses((n) => n + 1);
    }
  }
  useEffect(() => {
    if (!held) return;
    const timer = setTimeout(() => setHeld(false), RIPPLE_GROW_MS);
    return () => clearTimeout(timer);
  }, [held, presses]);
  return isPressed || held;
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
  const isRippling = useRippleHold(isPressed && !isDisabled);

  const rippleProps: DOMAttributes<HTMLElement> = {
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      if (!isDisabled && event.button === 0) {
        setRippleOrigin(event.currentTarget, event.clientX, event.clientY);
      }
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
      'data-rippling': flag(isRippling),
      'data-focused': flag(isFocused),
      'data-focus-visible': flag(isFocusVisible),
      'data-disabled': flag(isDisabled),
      'data-selected': flag(isSelected),
      'data-dragged': flag(isDragged),
    },
    state: { isHovered, isPressed, isFocused, isFocusVisible },
  };
}

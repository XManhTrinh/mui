'use client';

import {
  createContext,
  useContext,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from 'react';
import {
  mergeProps,
  useButton,
  useLink,
  useObjectRef,
  useToggleButton,
  useToggleButtonGroupItem,
  type PressEvents,
} from 'react-aria';
import { useToggleState, type ToggleGroupState } from 'react-stately';
import { useM3Interaction } from './use-m3-interaction';

/**
 * Selection state of an enclosing toggle group (e.g. a connected `ButtonGroup`). Toggle
 * buttons with a `value` inside it are selected through the group instead of on their own.
 */
export const ToggleGroupStateContext = createContext<ToggleGroupState | null>(null);

type PressHandlers = Pick<
  PressEvents,
  'onPress' | 'onPressStart' | 'onPressEnd' | 'onPressChange' | 'onPressUp'
>;

export interface ButtonBaseRenderState {
  isSelected: boolean;
}

interface ButtonBaseCommonProps extends PressHandlers {
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Content, or a function of the selection state (e.g. to swap a toggle's icon). */
  children?: ReactNode | ((state: ButtonBaseRenderState) => ReactNode);
}

type OwnKeys = keyof ButtonBaseCommonProps | 'color';

export interface ButtonBaseActionProps
  extends ButtonBaseCommonProps, Omit<ComponentPropsWithoutRef<'button'>, OwnKeys> {
  ref?: Ref<HTMLButtonElement>;
  href?: undefined;
  toggle?: false;
}

export interface ButtonBaseLinkProps
  extends ButtonBaseCommonProps, Omit<ComponentPropsWithoutRef<'a'>, OwnKeys | 'href'> {
  ref?: Ref<HTMLAnchorElement>;
  /** Renders a link. Navigation goes through React Aria's `RouterProvider` when one is set. */
  href: string;
  toggle?: false;
}

export interface ButtonBaseToggleProps
  extends
    ButtonBaseCommonProps,
    Omit<ComponentPropsWithoutRef<'button'>, OwnKeys | 'aria-pressed' | 'onChange'> {
  ref?: Ref<HTMLButtonElement>;
  href?: undefined;
  /** Makes the button a toggle (`aria-pressed`). */
  toggle: true;
  /** Identifies the button in a selection group; required to take part in its selection. */
  value?: string;
  /** Controlled selection. Ignored inside a selection group. */
  selected?: boolean;
  /** Initial selection when uncontrolled. */
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
}

export type ButtonBaseProps = ButtonBaseActionProps | ButtonBaseLinkProps | ButtonBaseToggleProps;

function splitProps<T extends ButtonBaseCommonProps>(props: T) {
  const {
    disabled = false,
    className,
    style,
    children,
    onPress,
    onPressStart,
    onPressEnd,
    onPressChange,
    onPressUp,
    ...dom
  } = props;
  return {
    disabled,
    element: { className, style },
    children,
    press: { onPress, onPressStart, onPressEnd, onPressChange, onPressUp },
    dom,
  };
}

const render = (children: ButtonBaseCommonProps['children'], isSelected: boolean) =>
  typeof children === 'function' ? children({ isSelected }) : children;

function ActionBase({ ref, type = 'button', ...props }: ButtonBaseActionProps) {
  const { disabled, element, children, press, dom } = splitProps(props);
  const domRef = useObjectRef(ref);
  const { buttonProps, isPressed } = useButton(
    { ...press, type, isDisabled: disabled, elementType: 'button' },
    domRef,
  );
  const { interactionProps, dataAttributes } = useM3Interaction(
    { isDisabled: disabled, isPressed },
    domRef,
  );
  return (
    <button
      {...mergeProps(dom, buttonProps, interactionProps)}
      {...dataAttributes}
      {...element}
      ref={domRef}
    >
      {render(children, false)}
    </button>
  );
}

function LinkBase({ ref, href, ...props }: ButtonBaseLinkProps) {
  const { disabled, element, children, press, dom } = splitProps(props);
  const domRef = useObjectRef(ref);
  const { linkProps, isPressed } = useLink(
    { ...press, href, isDisabled: disabled, elementType: 'a' },
    domRef,
  );
  const { interactionProps, dataAttributes } = useM3Interaction(
    { isDisabled: disabled, isPressed },
    domRef,
  );
  return (
    <a
      {...mergeProps(dom, linkProps, interactionProps)}
      {...dataAttributes}
      {...element}
      href={disabled ? undefined : href}
      ref={domRef}
    >
      {render(children, false)}
    </a>
  );
}

function ToggleBase({
  ref,
  type = 'button',
  selected,
  defaultSelected,
  onSelectedChange,
  toggle,
  ...props
}: ButtonBaseToggleProps) {
  const { disabled, element, children, press, dom } = splitProps(props);
  const domRef = useObjectRef(ref);
  const options = {
    ...press,
    type,
    isDisabled: disabled,
    isSelected: selected,
    defaultSelected,
    onChange: onSelectedChange,
    elementType: 'button' as const,
  };
  const state = useToggleState(options);
  const { buttonProps, isPressed, isSelected } = useToggleButton(options, state, domRef);
  const { interactionProps, dataAttributes } = useM3Interaction(
    { isDisabled: disabled, isPressed, isSelected },
    domRef,
  );
  return (
    <button
      {...mergeProps(dom, buttonProps, interactionProps)}
      {...dataAttributes}
      {...element}
      ref={domRef}
    >
      {render(children, isSelected)}
    </button>
  );
}

function GroupItemBase({
  ref,
  type = 'button',
  value,
  state,
  ...props
}: Omit<ButtonBaseToggleProps, 'selected' | 'defaultSelected' | 'onSelectedChange' | 'toggle'> & {
  value: string;
  state: ToggleGroupState;
}) {
  const { disabled, element, children, press, dom } = splitProps(props);
  const domRef = useObjectRef(ref);
  const { buttonProps, isPressed, isSelected } = useToggleButtonGroupItem(
    { ...press, id: value, isDisabled: disabled, elementType: 'button' },
    state,
    domRef,
  );
  const { interactionProps, dataAttributes } = useM3Interaction(
    { isDisabled: disabled || state.isDisabled, isPressed, isSelected },
    domRef,
  );
  return (
    <button
      {...mergeProps(dom, buttonProps, interactionProps)}
      {...dataAttributes}
      {...element}
      type={type}
      value={value}
      ref={domRef}
    >
      {render(children, isSelected)}
    </button>
  );
}

/**
 * Unstyled button behaviour shared by every button-like component: a `<button>`, a
 * link (`href`) or a toggle (`toggle`), with React Aria press, focus and keyboard
 * handling, and the M3 interaction `data-*` attributes and ripple origin from
 * `useM3Interaction`. DOM props pass through; `className` and `style` go on the element.
 */
export function ButtonBase(props: ButtonBaseProps) {
  const groupState = useContext(ToggleGroupStateContext);
  if (props.href !== undefined) return <LinkBase {...props} />;
  if (props.toggle) {
    if (groupState && props.value !== undefined) {
      const { selected, defaultSelected, onSelectedChange, toggle, value, ...item } = props;
      if (
        process.env.NODE_ENV !== 'production' &&
        (selected !== undefined || defaultSelected !== undefined || onSelectedChange)
      ) {
        console.warn(
          `[@vkieu/mui] Toggle "${value}" is inside a selection group; use the group's selectedKeys instead of selected / onSelectedChange.`,
        );
      }
      return <GroupItemBase {...item} value={value} state={groupState} />;
    }
    return <ToggleBase {...props} />;
  }
  return <ActionBase {...props} />;
}

'use client';

import {
  useContext,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import {
  mergeProps,
  useButton,
  useLink,
  useObjectRef,
  useToggleButton,
  type PressEvents,
} from 'react-aria';
import { useToggleState } from 'react-stately';
import { TouchTarget } from '../../primitives/TouchTarget';
import { useM3Interaction } from '../../primitives/use-m3-interaction';
import { cn } from '../../utils/cn';
import {
  buttonStyles,
  type ButtonShape,
  type ButtonSize,
  type ButtonVariant,
} from './button-styles';
import { ButtonContext } from './ButtonContext';

export interface ButtonClassNames {
  root?: string;
  /** Inner wrapper around the icons and label. */
  content?: string;
  label?: string;
  icon?: string;
}

type PressHandlers = Pick<
  PressEvents,
  'onPress' | 'onPressStart' | 'onPressEnd' | 'onPressChange' | 'onPressUp'
>;

interface ButtonCommonProps extends PressHandlers {
  /** @default "filled" */
  variant?: ButtonVariant;
  /** @default "sm" */
  size?: ButtonSize;
  /** @default "round" */
  shape?: ButtonShape;
  /** Icon before the label, e.g. a Material Symbols SVG. Decorative; the label names the button. */
  leadingIcon?: ReactElement;
  /** Icon after the label. */
  trailingIcon?: ReactElement;
  disabled?: boolean;
  /** The visible label. Required: buttons without text are `IconButton`s. */
  children: Exclude<ReactNode, null | undefined | boolean>;
  /** Classes for the root element; consumer classes always win. */
  className?: string;
  /** Classes for each part. `classNames.root` is merged with `className`. */
  classNames?: ButtonClassNames;
  style?: CSSProperties;
}

type OwnKeys = keyof ButtonCommonProps | 'color';

export interface ButtonActionProps
  extends ButtonCommonProps, Omit<ComponentPropsWithoutRef<'button'>, OwnKeys> {
  ref?: Ref<HTMLButtonElement>;
  href?: undefined;
  toggle?: false;
}

export interface ButtonLinkProps
  extends ButtonCommonProps, Omit<ComponentPropsWithoutRef<'a'>, OwnKeys | 'href'> {
  ref?: Ref<HTMLAnchorElement>;
  /** Renders a link. Navigation goes through React Aria's `RouterProvider` when one is set. */
  href: string;
  toggle?: false;
}

export interface ButtonToggleProps
  extends
    Omit<ButtonCommonProps, 'variant'>,
    Omit<ComponentPropsWithoutRef<'button'>, OwnKeys | 'aria-pressed' | 'onChange'> {
  ref?: Ref<HTMLButtonElement>;
  href?: undefined;
  /** Makes the button a toggle (`aria-pressed`). Selection changes its colour and shape. */
  toggle: true;
  /** Text buttons have no toggle form. @default "filled" */
  variant?: Exclude<ButtonVariant, 'text'>;
  /** Controlled selection. */
  selected?: boolean;
  /** Initial selection when uncontrolled. */
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
}

export type ButtonProps = ButtonActionProps | ButtonLinkProps | ButtonToggleProps;

interface ResolvedStyle {
  variant: ButtonVariant;
  size: ButtonSize;
  shape: ButtonShape;
  disabled: boolean;
}

function useResolvedStyle(props: ButtonCommonProps, isToggle: boolean): ResolvedStyle {
  const context = useContext(ButtonContext);
  let variant = props.variant ?? context.variant ?? 'filled';
  if (isToggle && variant === 'text') {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[@vkieu/mui] Text buttons have no toggle form; using "filled".');
    }
    variant = 'filled';
  }
  return {
    variant,
    size: props.size ?? context.size ?? 'sm',
    shape: props.shape ?? context.shape ?? 'round',
    disabled: props.disabled ?? context.disabled ?? false,
  };
}

function ButtonContent({
  styles,
  size,
  leadingIcon,
  trailingIcon,
  classNames,
  children,
}: {
  styles: ReturnType<typeof buttonStyles>;
  size: ButtonSize;
  leadingIcon?: ReactElement;
  trailingIcon?: ReactElement;
  classNames?: ButtonClassNames;
  children: ReactNode;
}) {
  return (
    <span className={styles.content({ class: classNames?.content })}>
      {(size === 'xs' || size === 'sm') && <TouchTarget />}
      {leadingIcon && (
        <span aria-hidden="true" className={styles.icon({ class: classNames?.icon })}>
          {leadingIcon}
        </span>
      )}
      <span className={styles.label({ class: classNames?.label })}>{children}</span>
      {trailingIcon && (
        <span aria-hidden="true" className={styles.icon({ class: classNames?.icon })}>
          {trailingIcon}
        </span>
      )}
    </span>
  );
}

/** Splits our props from the DOM attributes that pass straight through. */
function splitProps<T extends ButtonCommonProps>(props: T) {
  const {
    variant,
    size,
    shape,
    disabled,
    leadingIcon,
    trailingIcon,
    children,
    className,
    classNames,
    style,
    onPress,
    onPressStart,
    onPressEnd,
    onPressChange,
    onPressUp,
    ...dom
  } = props;
  return {
    content: { leadingIcon, trailingIcon, children, classNames },
    className: cn(classNames?.root, className),
    style,
    press: { onPress, onPressStart, onPressEnd, onPressChange, onPressUp },
    dom,
  };
}

function ActionButton({ ref, type = 'button', ...props }: ButtonActionProps) {
  const style = useResolvedStyle(props, false);
  const { content, className, press, dom, ...rest } = splitProps(props);
  const domRef = useObjectRef(ref);
  const { buttonProps, isPressed } = useButton(
    { ...press, type, isDisabled: style.disabled, elementType: 'button' },
    domRef,
  );
  const { interactionProps, dataAttributes } = useM3Interaction(
    { isDisabled: style.disabled, isPressed },
    domRef,
  );
  const styles = buttonStyles({
    ...style,
    toggle: false,
    hasLeadingIcon: Boolean(content.leadingIcon),
  });
  return (
    <button
      {...mergeProps(dom, buttonProps, interactionProps)}
      {...dataAttributes}
      ref={domRef}
      style={rest.style}
      className={styles.root({ class: className })}
    >
      <ButtonContent styles={styles} size={style.size} {...content} />
    </button>
  );
}

function LinkButton({ ref, href, ...props }: ButtonLinkProps) {
  const style = useResolvedStyle(props, false);
  const { content, className, press, dom, ...rest } = splitProps(props);
  const domRef = useObjectRef(ref);
  const { linkProps, isPressed } = useLink(
    { ...press, href, isDisabled: style.disabled, elementType: 'a' },
    domRef,
  );
  const { interactionProps, dataAttributes } = useM3Interaction(
    { isDisabled: style.disabled, isPressed },
    domRef,
  );
  const styles = buttonStyles({
    ...style,
    toggle: false,
    hasLeadingIcon: Boolean(content.leadingIcon),
  });
  return (
    <a
      {...mergeProps(dom, linkProps, interactionProps)}
      {...dataAttributes}
      href={style.disabled ? undefined : href}
      ref={domRef}
      style={rest.style}
      className={styles.root({ class: className })}
    >
      <ButtonContent styles={styles} size={style.size} {...content} />
    </a>
  );
}

function ToggleButton({
  ref,
  type = 'button',
  selected,
  defaultSelected,
  onSelectedChange,
  toggle,
  ...props
}: ButtonToggleProps) {
  const style = useResolvedStyle(props, true);
  const { content, className, press, dom, ...rest } = splitProps(props);
  const domRef = useObjectRef(ref);
  const toggleOptions = {
    ...press,
    type,
    isDisabled: style.disabled,
    isSelected: selected,
    defaultSelected,
    onChange: onSelectedChange,
    elementType: 'button' as const,
  };
  const state = useToggleState(toggleOptions);
  const { buttonProps, isPressed, isSelected } = useToggleButton(toggleOptions, state, domRef);
  const { interactionProps, dataAttributes } = useM3Interaction(
    { isDisabled: style.disabled, isPressed, isSelected },
    domRef,
  );
  const styles = buttonStyles({
    ...style,
    toggle: true,
    hasLeadingIcon: Boolean(content.leadingIcon),
  });
  return (
    <button
      {...mergeProps(dom, buttonProps, interactionProps)}
      {...dataAttributes}
      ref={domRef}
      style={rest.style}
      className={styles.root({ class: className })}
    >
      <ButtonContent styles={styles} size={style.size} {...content} />
    </button>
  );
}

/**
 * M3 Expressive button: five variants, five sizes (XS–XL), round or square shape,
 * an optional toggle form, and a press morph that squares the corners while pressed.
 *
 * Renders a `<button>`, or an `<a>` when `href` is set. `className` and `style` go on
 * that element, and consumer classes always win.
 *
 * @example
 * <Button variant="tonal" size="md" leadingIcon={<EditIcon />} onPress={edit}>Edit</Button>
 * <Button toggle selected={starred} onSelectedChange={setStarred}>Starred</Button>
 * <Button href="/docs" variant="text">Docs</Button>
 */
export function Button(props: ButtonProps) {
  if (props.href !== undefined) return <LinkButton {...props} />;
  if (props.toggle) return <ToggleButton {...props} />;
  return <ActionButton {...props} />;
}

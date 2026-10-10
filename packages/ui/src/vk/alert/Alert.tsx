'use client';

import { useEffect, useRef, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { useObjectRef } from 'react-aria';
import { IconButton } from '../../components/icon-button/IconButton';
import { alertStyles, type AlertTone, type AlertVariant } from './alert-styles';

const icon = (d: string) => (
  <svg viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true" focusable="false">
    <path d={d} />
  </svg>
);

/** Material Symbols for each tone, and `close`. */
const TONE_ICONS: Readonly<Record<AlertTone, ReactNode>> = {
  error: icon(
    'M503.5-289.48q9.5-9.48 9.5-23.5t-9.48-23.52q-9.48-9.5-23.5-9.5t-23.52 9.48q-9.5 9.48-9.5 23.5t9.48 23.52q9.48 9.5 23.5 9.5t23.52-9.48ZM453-433h60v-253h-60v253Zm27.27 353q-82.74 0-155.5-31.5Q252-143 197.5-197.5t-86-127.34Q80-397.68 80-480.5t31.5-155.66Q143-709 197.5-763t127.34-85.5Q397.68-880 480.5-880t155.66 31.5Q709-817 763-763t85.5 127Q880-563 880-480.27q0 82.74-31.5 155.5Q817-252 763-197.68q-54 54.31-127 86Q563-80 480.27-80Zm.23-60Q622-140 721-239.5t99-241Q820-622 721.19-721T480-820q-141 0-240.5 98.81T140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z',
  ),
  info: icon(
    'M453-280h60v-240h-60v240Zm50.5-323.2q9.5-9.2 9.5-22.8 0-14.45-9.48-24.22-9.48-9.78-23.5-9.78t-23.52 9.78Q447-640.45 447-626q0 13.6 9.48 22.8 9.48 9.2 23.5 9.2t23.52-9.2ZM480.27-80q-82.74 0-155.5-31.5Q252-143 197.5-197.5t-86-127.34Q80-397.68 80-480.5t31.5-155.66Q143-709 197.5-763t127.34-85.5Q397.68-880 480.5-880t155.66 31.5Q709-817 763-763t85.5 127Q880-563 880-480.27q0 82.74-31.5 155.5Q817-252 763-197.68q-54 54.31-127 86Q563-80 480.27-80Zm.23-60Q622-140 721-239.5t99-241Q820-622 721.19-721T480-820q-141 0-240.5 98.81T140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z',
  ),
  success: icon(
    'm421-298 283-283-46-45-237 237-120-120-45 45 165 166Zm59 218q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z',
  ),
  warning: icon(
    'm40-120 440-760 440 760H40Zm104-60h672L480-760 144-180Zm361.5-65.68q8.5-8.67 8.5-21.5 0-12.82-8.68-21.32-8.67-8.5-21.5-8.5-12.82 0-21.32 8.68-8.5 8.67-8.5 21.5 0 12.82 8.68 21.32 8.67 8.5 21.5 8.5 12.82 0 21.32-8.68ZM454-348h60v-224h-60v224Zm26-122Z',
  ),
  neutral: icon(
    'M453-280h60v-240h-60v240Zm50.5-323.2q9.5-9.2 9.5-22.8 0-14.45-9.48-24.22-9.48-9.78-23.5-9.78t-23.52 9.78Q447-640.45 447-626q0 13.6 9.48 22.8 9.48 9.2 23.5 9.2t23.52-9.2ZM480.27-80q-82.74 0-155.5-31.5Q252-143 197.5-197.5t-86-127.34Q80-397.68 80-480.5t31.5-155.66Q143-709 197.5-763t127.34-85.5Q397.68-880 480.5-880t155.66 31.5Q709-817 763-763t85.5 127Q880-563 880-480.27q0 82.74-31.5 155.5Q817-252 763-197.68q-54 54.31-127 86Q563-80 480.27-80Zm.23-60Q622-140 721-239.5t99-241Q820-622 721.19-721T480-820q-141 0-240.5 98.81T140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z',
  ),
};

const CloseIcon = () =>
  icon(
    'm249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z',
  );

export interface AlertLabels {
  /** The close button's name. @default "Close" */
  close: string;
}

export interface AlertClassNames {
  root?: string;
  icon?: string;
  title?: string;
  message?: string;
  actions?: string;
  close?: string;
}

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'role'> {
  /** The message. */
  children: ReactNode;
  /** A short summary above the message. */
  title?: ReactNode;
  /** The title's element, when the alert heads a section. @default "p" */
  titleAs?: 'p' | 'h2' | 'h3' | 'h4';
  /** `error` (read at once, `role="alert"`) or a polite status. @default "error" */
  tone?: AlertTone;
  /** `tonal` (a container colour) or `outlined` (quieter). @default "tonal" */
  variant?: AlertVariant;
  /** Replaces the tone's icon; `null` shows none. */
  icon?: ReactNode;
  /** Up to two `Button`s, text or tonal. */
  actions?: ReactNode;
  /** Adds a close button; without it the alert can't be dismissed. */
  onClose?: () => void;
  /** Moves focus to the alert when it appears, for an error that blocks a form. @default false */
  focusOnMount?: boolean;
  labels?: Partial<AlertLabels>;
  classNames?: AlertClassNames;
  ref?: Ref<HTMLDivElement>;
}

/**
 * A message that stays until it's resolved: a form's error, a page's warning, a system
 * notice (docs/plans/alert.md). **Not an M3 component** (a `vk` component): M3 Expressive
 * has no persistent message. Use `Snackbar` for brief feedback that goes away, field error
 * text for one field, and `Dialog` with `role="alertdialog"` for a decision that blocks the
 * page (what Apple and Android call an alert).
 *
 * Reads `--vk-alert-container`, `-content`, `-outline`, `-icon` and `-corner`.
 *
 * @example
 * <Alert>That email and password don't match.</Alert>
 * <Alert tone="info" title="You're offline" onClose={hide}>Changes will sync when you're back.</Alert>
 */
export function Alert({
  children,
  title,
  titleAs: Title = 'p',
  tone = 'error',
  variant = 'tonal',
  icon: iconProp,
  actions,
  onClose,
  focusOnMount = false,
  labels,
  className,
  classNames,
  ref,
  ...rest
}: AlertProps) {
  const domRef = useObjectRef(ref);
  const focused = useRef(false);
  useEffect(() => {
    if (!focusOnMount || focused.current) return;
    focused.current = true;
    domRef.current?.focus();
  }, [focusOnMount, domRef]);

  const styles = alertStyles({ tone, variant, dismissible: onClose !== undefined });
  const shownIcon = iconProp === undefined ? TONE_ICONS[tone] : iconProp;

  return (
    <div
      {...rest}
      ref={domRef}
      role={tone === 'error' ? 'alert' : 'status'}
      {...(focusOnMount && { tabIndex: -1 })}
      data-tone={tone}
      data-variant={variant}
      className={styles.root({ class: [classNames?.root, className] })}
    >
      {shownIcon != null ? (
        <span aria-hidden="true" className={styles.icon({ class: classNames?.icon })}>
          {shownIcon}
        </span>
      ) : null}
      <div className={styles.body()}>
        <div className={styles.text()}>
          {title != null ? (
            <Title className={styles.title({ class: classNames?.title })}>{title}</Title>
          ) : null}
          <div className={styles.message({ class: classNames?.message })}>{children}</div>
        </div>
        {actions != null ? (
          <div className={styles.actions({ class: classNames?.actions })}>{actions}</div>
        ) : null}
      </div>
      {onClose ? (
        <IconButton
          size="sm"
          icon={<CloseIcon />}
          aria-label={labels?.close ?? 'Close'}
          onPress={onClose}
          className={styles.close({ class: classNames?.close })}
        />
      ) : null}
    </div>
  );
}

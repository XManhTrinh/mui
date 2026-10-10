'use client';

import type { ReactNode, Ref } from 'react';
import { ButtonBase, type ButtonBaseLinkProps } from '../../primitives/ButtonBase';
import { linkStyles, type LinkSize, type LinkTone, type LinkVariant } from './link-styles';

/** Material Symbols `open_in_new`. */
const OpenInNewIcon = () => (
  <svg viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h279v60H180v600h600v-279h60v279q0 24-18 42t-42 18H180Zm202-219-42-43 398-398H519v-60h321v321h-60v-218L382-339Z" />
  </svg>
);

export interface LinkLabels {
  /** Read after an external link's text. @default "opens in a new tab" */
  newTab: string;
}

export interface LinkClassNames {
  root?: string;
  icon?: string;
}

export interface LinkProps extends Omit<
  ButtonBaseLinkProps,
  'children' | 'className' | 'disabled' | 'toggle'
> {
  /** The link text. */
  children: ReactNode;
  /**
   * `inline` (underlined, for links in running text), `standalone` (underlined on hover, for a
   * link on its own line) or `plain` (never underlined or filled, for a logo or a photo tile;
   * its content can style itself from the link's state with `group-data-hovered/link:`).
   * @default "inline"
   */
  variant?: LinkVariant;
  /** `primary`, or `inherit` the surrounding text colour (on coloured containers). @default "primary" */
  tone?: LinkTone;
  /** `inherit` the surrounding type, or a label role for a link on its own. @default "inherit" */
  size?: LinkSize;
  /**
   * Opens in a new tab, with `rel="noopener noreferrer"`, an "open in new" icon and
   * `labels.newTab` for screen readers.
   */
  external?: boolean;
  labels?: Partial<LinkLabels>;
  className?: string;
  classNames?: LinkClassNames;
  ref?: Ref<HTMLAnchorElement>;
}

/**
 * A text link that looks and behaves the same everywhere (docs/plans/link.md). **Not an M3
 * component** (a `vk` component): M3 leaves text links to the platform. Routed through
 * React Aria's `RouterProvider` like every library link, with the M3 focus indicator.
 * Use `Button variant="text"` for a section's or dialog's action, and a `Card` or `ListItem`
 * with `href` when a whole card or row goes somewhere.
 *
 * Reads `--vk-link-color`, `--vk-link-underline-thickness` and `--vk-link-underline-offset`.
 *
 * @example
 * <p>I agree to the <Link href="/legal/terms" external>Terms of service</Link>.</p>
 * <Link variant="standalone" size="medium" href="/forgot-password">Forgot password?</Link>
 * <Link variant="plain" href="/" aria-label="Home"><Logo /></Link>
 */
export function Link({
  children,
  variant = 'inline',
  tone = 'primary',
  size = 'inherit',
  external = false,
  labels,
  className,
  classNames,
  target,
  rel,
  ...rest
}: LinkProps) {
  const styles = linkStyles({ variant, tone, size });
  const newTab = labels?.newTab ?? 'opens in a new tab';
  // `target="_blank"` gets the same care as `external`.
  const opensNewTab = external || target === '_blank';
  return (
    <ButtonBase
      {...rest}
      target={opensNewTab ? '_blank' : target}
      rel={opensNewTab ? 'noopener noreferrer' : rel}
      data-variant={variant}
      data-tone={tone}
      className={styles.root({ class: [classNames?.root, className] })}
    >
      {children}
      {opensNewTab ? (
        <>
          <span className={styles.icon({ class: classNames?.icon })}>
            <OpenInNewIcon />
          </span>
          <span className="sr-only">, {newTab}</span>
        </>
      ) : null}
    </ButtonBase>
  );
}

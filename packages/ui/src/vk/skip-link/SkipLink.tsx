'use client';

import type { CSSProperties, MouseEvent, ReactNode, Ref } from 'react';
import { mergeProps, useFocusRing } from 'react-aria';
import { splitDataAttributes } from '../../utils/split-data-attributes';
import { skipLinkStyles } from './skip-link-styles';

export interface SkipLinkProps {
  /** The id of the element to move to, e.g. the page's `main`. */
  target: string;
  /** The label: "Skip to content". */
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLAnchorElement>;
  /** `data-*` attributes go to the link. */
  [data: `data-${string}`]: string | number | boolean | undefined;
}

/** Elements that take focus without a `tabindex`. */
const FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex], [contenteditable]';

/**
 * "Skip to content" (WCAG 2.4.1, Bypass Blocks): put it first in the page. It stays off
 * screen until a keyboard user tabs onto it, then shows at the top; pressing it moves focus
 * to `target`, so the next Tab continues from there. Several in a row (content, search)
 * show one at a time. Without JavaScript it's a plain `#target` link. **Not an M3
 * component** (a `vk` component, see docs/plans/shaped-icon-skip-link-file-trigger.md).
 *
 * @example
 * <SkipLink target="main">Skip to content</SkipLink>
 * …
 * <main id="main">…</main>
 */
export function SkipLink({ target, children, className, style, ref, ...rest }: SkipLinkProps) {
  const { data } = splitDataAttributes(rest);
  const { focusProps, isFocusVisible } = useFocusRing();
  const skip = (event: MouseEvent<HTMLAnchorElement>) => {
    const destination = document.getElementById(target);
    if (!destination) return;
    // Focus, not only scroll: the next Tab starts inside the destination. The hash stays out
    // of the URL, so Back doesn't stop on it.
    event.preventDefault();
    if (!destination.matches(FOCUSABLE)) destination.setAttribute('tabindex', '-1');
    destination.focus();
  };
  return (
    <a
      {...mergeProps(data, focusProps)}
      ref={ref}
      href={`#${target}`}
      onClick={skip}
      data-focus-visible={isFocusVisible || undefined}
      style={style}
      className={skipLinkStyles().root({ class: className })}
    >
      {children}
    </a>
  );
}

'use client';

import { useEffect, useRef, type HTMLAttributes, type Ref } from 'react';
import { useObjectRef } from 'react-aria';
import { BREAKPOINTS } from '../../tokens/breakpoints';
import type { ListDetailLayoutActive } from './list-detail-layout-styles';

interface ListDetailFrameProps extends HTMLAttributes<HTMLDivElement> {
  active: ListDetailLayoutActive;
  focusKey: string | undefined;
  ref?: Ref<HTMLDivElement>;
}

/**
 * The client part of `ListDetailLayout`: its root element. After its first paint it turns on
 * the single-pane transition (`data-animate`, set on the element directly so React never
 * re-renders for it), so the first render never animates, with or without SSR. When
 * `focusKey` changes in single-pane mode, focus moves to the pane that's now showing, unless
 * it's already inside it, so keyboard and screen reader users land on the new content.
 * @internal
 */
export function ListDetailFrame({
  active,
  focusKey,
  ref,
  children,
  ...rest
}: ListDetailFrameProps) {
  const domRef = useObjectRef(ref);
  const previousKey = useRef(focusKey);

  useEffect(() => {
    const frame = requestAnimationFrame(() => domRef.current?.setAttribute('data-animate', ''));
    return () => cancelAnimationFrame(frame);
  }, [domRef]);

  useEffect(() => {
    if (previousKey.current === focusKey) return;
    previousKey.current = focusKey;
    const root = domRef.current;
    if (!root || window.matchMedia(`(min-width: ${BREAKPOINTS.expanded})`).matches) return;
    // A frame later, once the press that opened the item has finished: a press handler can
    // still blur the pressed (now hidden) item after this effect runs.
    const frame = requestAnimationFrame(() => {
      const pane = root.querySelector<HTMLElement>(`[data-pane="${active}"]`);
      if (pane && !pane.contains(document.activeElement)) pane.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [focusKey, active, domRef]);

  return (
    <div {...rest} ref={domRef}>
      {children}
    </div>
  );
}

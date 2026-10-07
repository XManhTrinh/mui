'use client';

import {
  cloneElement,
  type ImgHTMLAttributes,
  type ReactElement,
  type SyntheticEvent,
} from 'react';
import { cn } from '../../utils/cn';

/** Props the avatar sets on a custom image element. */
export type AvatarImageElementProps = Pick<
  ImgHTMLAttributes<HTMLImageElement>,
  'alt' | 'onLoad' | 'onError' | 'className'
>;

/** Marks the image and its avatar `loaded` or `error`; CSS shows the fallback on error. */
function mark(image: HTMLImageElement, status: 'loaded' | 'error') {
  image.dataset.status = status;
  const avatar = image.closest<HTMLElement>('[data-vk-avatar]');
  if (avatar) avatar.dataset.status = status;
}

/** Catches images that finished loading or failing before hydration. */
function markSettled(image: HTMLImageElement | null) {
  if (!image?.complete) return;
  mark(image, image.naturalWidth > 0 ? 'loaded' : 'error');
}

const handlers = {
  onLoad: (event: SyntheticEvent<HTMLImageElement>) => mark(event.currentTarget, 'loaded'),
  onError: (event: SyntheticEvent<HTMLImageElement>) => mark(event.currentTarget, 'error'),
};

export interface AvatarImageProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'alt' | 'children'
> {
  /** A custom image element (for example `next/image`) to render instead of an `<img>`. */
  element?: ReactElement<AvatarImageElementProps>;
}

/**
 * The avatar's photo. It is server-rendered over the fallback, so it shows as soon as it
 * loads, with or without JS; on an error it hides and the fallback shows. Status is written
 * to the DOM (`data-status`), not React state, so hydration never re-renders the avatar.
 * Internal to Avatar.
 */
export function AvatarImage({ element, className, ...props }: AvatarImageProps) {
  if (element) {
    // The avatar's root carries the name, so the image itself is decorative.
    return cloneElement(element, {
      alt: '',
      ...handlers,
      className: cn(className, element.props.className),
    });
  }
  return (
    <img
      alt=""
      loading="lazy"
      decoding="async"
      {...props}
      {...handlers}
      ref={markSettled}
      className={className}
    />
  );
}

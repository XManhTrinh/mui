import { tv, type VariantProps } from '../../utils/tv';

/*
 * EmptyState is a `vk` component, NOT an M3 component (architecture decision #22; plan in
 * docs/plans/empty-state.md). M3 describes empty states as a pattern only, so this is built
 * from M3 pieces: the type scale and spacing per `size`, container colour roles per `tone`,
 * and the shape scale or an Expressive shape for the icon container. With a card `variant`
 * the root is a public `Card`, which brings its own container colour and corners. It fades in
 * on the effects spring (opacity only, through `@starting-style`), with no JavaScript, and
 * not at all under reduced motion. Every class is written out in full so Tailwind finds it.
 */

/** Variant definitions for {@link EmptyState}; extend them to add variants. */
export const emptyStateStyles = tv({
  slots: {
    root: [
      'flex flex-col items-center text-center',
      'transition-opacity starting:opacity-0',
      'duration-(--md-sys-motion-spring-effects-default-duration)',
      'ease-(--md-sys-motion-spring-effects-default-easing)',
      'motion-reduce:transition-none',
    ],
    media: [
      'flex shrink-0 items-center justify-center',
      '[mask-repeat:no-repeat] [mask-size:100%_100%]',
      'forced-colors:text-[CanvasText]',
    ],
    icon: 'flex items-center justify-center [&>svg]:size-full',
    title: 'max-w-md text-on-surface',
    description: 'max-w-md text-on-surface-variant',
    actions: 'flex flex-wrap items-center justify-center gap-2',
  },
  variants: {
    size: {
      sm: {
        root: 'gap-2 px-4 py-4',
        media: 'size-10',
        icon: 'size-6',
        title: 'text-title-small',
        description: 'text-body-small',
        actions: 'pt-1',
      },
      md: {
        root: 'gap-3 px-6 py-12',
        media: 'size-14',
        icon: 'size-7',
        title: 'text-title-medium',
        description: 'text-body-medium',
        actions: 'pt-2',
      },
      lg: {
        root: 'gap-4 px-8 py-16',
        media: 'size-24',
        icon: 'size-12',
        title: 'text-headline-small',
        description: 'text-body-large',
        actions: 'pt-3',
      },
    },
    tone: {
      primary: { media: 'bg-primary-container text-on-primary-container' },
      secondary: { media: 'bg-secondary-container text-on-secondary-container' },
      tertiary: { media: 'bg-tertiary-container text-on-tertiary-container' },
      neutral: { media: 'bg-surface-container-highest text-on-surface-variant' },
      error: { media: 'bg-error-container text-on-error-container' },
    },
    shape: {
      circle: { media: 'rounded-full' },
      expressive: { media: '' },
    },
  },
  defaultVariants: { size: 'md', tone: 'secondary', shape: 'circle' },
});

export type EmptyStateStyleProps = VariantProps<typeof emptyStateStyles>;
export type EmptyStateSize = NonNullable<EmptyStateStyleProps['size']>;
export type EmptyStateTone = NonNullable<EmptyStateStyleProps['tone']>;

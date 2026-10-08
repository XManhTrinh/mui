import { tv, type VariantProps } from '../../utils/tv';

/*
 * PinInput (`@vkieu/mui/vk`, not an M3 component; docs/plans/pin-input.md). Each box is drawn
 * with the M3 text field tokens (Compose Filled/OutlinedTextFieldTokens, as in TextField):
 * outlined boxes have a 1px `outline` border, `on-surface` on hover and 2px `primary` when
 * active; filled boxes have a `surface-container-highest` container and a 1px
 * `on-surface-variant` active indicator that becomes 2px `primary`. Error uses `error`
 * (`on-error-container` on hover), and disabled uses the 12% / 38% / 4% `on-surface`
 * opacities. The 2px line is the border plus a 1px inset shadow, so nothing shifts.
 *
 * Each box carries one mutually exclusive `data-state` (the TextField `data-field-state`
 * values), so its colours never compete. Every class is written out in full so Tailwind
 * can find it.
 */

const effectsTransition =
  'transition-[border-color,box-shadow,background-color] [transition-duration:var(--md-sys-motion-spring-effects-fast-duration)] [transition-timing-function:var(--md-sys-motion-spring-effects-fast-easing)]';

/** Variant definitions for {@link PinInput}. */
export const pinInputStyles = tv({
  slots: {
    root: 'group/pin inline-flex max-w-full flex-col gap-[4px] align-top text-start',
    label:
      'text-body-medium text-on-surface-variant group-data-[focused]/pin:text-primary group-data-[invalid]/pin:text-error group-data-[disabled]/pin:text-on-surface/38',
    // The code reads left to right in every layout, and the row sits at the start edge.
    // The input and the boxes share one grid cell: the input covers the boxes without being
    // positioned, so consumer layout classes can't pull it out of place.
    field: 'grid max-w-full grid-cols-[minmax(0,max-content)] self-start',
    boxes:
      'col-start-1 row-start-1 flex max-w-full items-center group-data-[invalid]/pin:vk-pin-shake',
    box: [
      'flex min-w-[32px] shrink items-center justify-center overflow-hidden',
      'text-on-surface tabular-nums',
      effectsTransition,
      'data-[state=disabled]:text-on-surface/38',
      'forced-colors:border-[CanvasText] forced-colors:data-[state=focus]:border-[Highlight] forced-colors:data-[state=error-focus]:border-[Highlight]',
    ],
    character: 'block leading-none',
    mask: 'block size-[0.4em] rounded-corner-full bg-on-surface group-data-[disabled]/pin:bg-on-surface/38 forced-colors:bg-[CanvasText]',
    caret: 'vk-pin-caret block h-[1em] w-[2px] bg-primary group-data-[invalid]/pin:bg-error',
    separator:
      'flex shrink-0 items-center justify-center text-on-surface-variant group-data-[disabled]/pin:text-on-surface/38',
    // The real input covers the boxes, invisible, so taps, autofill and paste reach it.
    input: [
      'col-start-1 row-start-1 size-full min-w-0 cursor-text appearance-none border-0 bg-transparent p-0 opacity-0 outline-none',
      // 16px stops iOS from zooming in on focus.
      'text-[16px]',
      'disabled:cursor-default',
    ],
    supportingText: '',
  },
  variants: {
    variant: {
      outlined: {
        box: [
          'rounded-(--vk-pin-corner) border border-solid border-outline',
          'data-[state=hover]:border-on-surface',
          'data-[state=focus]:border-primary data-[state=focus]:shadow-[inset_0_0_0_1px_var(--md-sys-color-primary)]',
          'data-[state=error]:border-error',
          'data-[state=error-hover]:border-on-error-container',
          'data-[state=error-focus]:border-error data-[state=error-focus]:shadow-[inset_0_0_0_1px_var(--md-sys-color-error)]',
          'data-[state=disabled]:border-on-surface/12',
        ],
      },
      filled: {
        box: [
          'rounded-t-(--vk-pin-corner) border-0 border-b border-solid border-on-surface-variant bg-surface-container-highest',
          'data-[state=hover]:border-on-surface',
          'data-[state=focus]:border-primary data-[state=focus]:shadow-[inset_0_-1px_0_0_var(--md-sys-color-primary)]',
          'data-[state=error]:border-error',
          'data-[state=error-hover]:border-on-error-container',
          'data-[state=error-focus]:border-error data-[state=error-focus]:shadow-[inset_0_-1px_0_0_var(--md-sys-color-error)]',
          'data-[state=disabled]:border-on-surface/38 data-[state=disabled]:bg-on-surface/4',
        ],
      },
    },
    size: {
      small: {
        boxes: 'gap-[6px]',
        box: 'h-[48px] w-[40px] text-title-large',
        separator: 'w-[12px] text-title-large',
      },
      medium: {
        boxes: 'gap-[8px]',
        box: 'h-[56px] w-[48px] text-headline-small',
        separator: 'w-[16px] text-headline-small',
      },
      large: {
        boxes: 'gap-[8px]',
        box: 'h-[64px] w-[56px] text-headline-medium',
        separator: 'w-[16px] text-headline-medium',
      },
    },
    // The corner is a variable, so the filled variant can round only its top corners.
    corner: {
      none: { root: '[--vk-pin-corner:var(--md-sys-shape-corner-none)]' },
      'extra-small': { root: '[--vk-pin-corner:var(--md-sys-shape-corner-extra-small)]' },
      small: { root: '[--vk-pin-corner:var(--md-sys-shape-corner-small)]' },
      medium: { root: '[--vk-pin-corner:var(--md-sys-shape-corner-medium)]' },
      large: { root: '[--vk-pin-corner:var(--md-sys-shape-corner-large)]' },
      'large-increased': { root: '[--vk-pin-corner:var(--md-sys-shape-corner-large-increased)]' },
      'extra-large': { root: '[--vk-pin-corner:var(--md-sys-shape-corner-extra-large)]' },
      'extra-large-increased': {
        root: '[--vk-pin-corner:var(--md-sys-shape-corner-extra-large-increased)]',
      },
      'extra-extra-large': {
        root: '[--vk-pin-corner:var(--md-sys-shape-corner-extra-extra-large)]',
      },
      full: { root: '[--vk-pin-corner:var(--md-sys-shape-corner-full)]' },
    },
  },
  defaultVariants: {
    variant: 'outlined',
    size: 'medium',
    corner: 'extra-small',
  },
});

export type PinInputStyleProps = VariantProps<typeof pinInputStyles>;
export type PinInputVariant = NonNullable<PinInputStyleProps['variant']>;
export type PinInputSize = NonNullable<PinInputStyleProps['size']>;
export type PinInputCorner = NonNullable<PinInputStyleProps['corner']>;

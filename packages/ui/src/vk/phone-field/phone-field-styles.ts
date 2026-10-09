import type { TextFieldVariant } from '../../components/text-field/text-field-styles';
import { tv, type VariantProps } from '../../utils/tv';

/*
 * PhoneField (`@vkieu/mui/vk`, not an M3 component; docs/plans/phone-field.md). The number
 * is the library's TextField; the country field beside it is a searchable `Select` in the
 * same variant (the text field's tokens and states), whose list opens as the M3 menu on
 * larger windows and a bottom sheet on phones, with the M3 search bar's field at 48px.
 */

/** Variant definitions for {@link PhoneField}. */
export const phoneFieldStyles = tv({
  slots: {
    root: 'inline-flex w-[320px] max-w-full items-start gap-[8px] align-top',
    // As wide as its dialling code (and flag), not a text field's 280px.
    country: 'w-auto shrink-0',
    // The chosen country's code isn't cut short.
    countryValue: 'flex-none overflow-visible',
    flag: 'inline-flex size-[20px] items-center justify-center [&>*]:max-h-full [&>*]:max-w-full',
    // The dial code reads left to right in every layout.
    dial: 'tabular-nums [direction:ltr]',
    number: 'min-w-0 flex-1',
  },
  variants: {
    // The variant reaches the country field and the number, which style themselves.
    variant: { outlined: {}, filled: {} },
  },
  defaultVariants: { variant: 'outlined' },
});

export type PhoneFieldStyleProps = VariantProps<typeof phoneFieldStyles>;
export type PhoneFieldVariant = Extract<TextFieldVariant, 'outlined' | 'filled'>;

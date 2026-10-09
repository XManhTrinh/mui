# Plan: PhoneField (`@vkieu/mui/vk`)

Status: **approved by Mike and built on 2026-10-08** (no flags by default, with `renderFlag`; Mike, 2026-10-08)

## Goal

A phone number field with a country picker: people choose their country (or it's picked for them from a pasted or autofilled number), type their number in their own country's usual format, and the app gets one international E.164 value (`+447911123456`). VKIEU's sign-up is the first consumer (Mike, 2026-10-08: an optional phone with its country code); checkout, bookings, business profiles and any other app using the library need the same thing.

M3 has no phone field, and the library has no select or searchable picker to build one from in an app, so `PhoneField` is a **`vk` component** (architecture decision #22), built to the same bar as the M3 components: the text field's tokens and states, the M3 menu and bottom sheet for the picker, every theme, mode, contrast level and motion scheme.

## Name

`PhoneField`, matching `TextField`: it is a text field with a country picker, takes the same label, supporting-text and error props, and lives in a form. (Other libraries call it `PhoneInput`, `MuiTelInput` or `IntlTelInput`; `Field` follows this library's naming for labelled form fields.)

## When to use which

| Use | When |
|---|---|
| `PhoneField` | Any phone number a person enters: sign-up, profile, checkout, bookings, business contact details |
| `TextField` with `type="tel"` | Only when the country can never vary and no validation is wanted |

## Decisions

| # | Decision | Value |
|---|---|---|
| 1 | Where | `packages/ui/src/vk/phone-field/`, exported from `@vkieu/mui/vk` |
| 2 | Phone rules | **`libphonenumber-js`** `^1.13.14` (Google's phone data; approved by Mike, 2026-10-08; the newest release past the repo's minimum release age) as a dependency of `@vkieu/mui`, imported only by `PhoneField`, so apps that don't use it don't load it. Its `min` metadata (validation by country and length, formatting) keeps the cost small; a `validation="strict"` option is left for later if apps need mobile-versus-landline checks |
| 3 | Value | `value` / `onChange(value)` in **E.164** (`+447911123456`), or `''` when empty. `onCountryChange(country)` reports the chosen country (ISO 3166 alpha-2), since one dial code can cover several countries (`+1`). Controlled or uncontrolled, and it submits under `name` |
| 4 | Look | The number is the library's **`TextField`** (outlined or filled); the **country field sits beside it**, 56px with the same tokens and states, showing the dial code (`+44`) and a dropdown arrow, as on Google's own sign-up. (A country part inside the text field would collide with the floating label, whose position can't follow a variable-width code.) Label, supporting text, error, `required`, `disabled` and `readOnly` work as in `TextField` |
| 5 | Country picker | A searchable list: on medium and larger windows an M3 menu anchored to the button, on compact windows an M3 bottom sheet. A search field at the top filters by country name, ISO code or dial code ("viet", "VN", "84"); arrow keys move through the list and Enter picks. `priorityCountries` (e.g. VKIEU's launch markets) are listed first under a divider, then every country in alphabetical order. The search is the M3 search bar's field (`searchBarStyles`, 48px rather than the search bar's 56px so it doesn't dominate the 44px rows (Mike, 2026-10-09): full corners, `surface-container-high`, the inset focus ring for keyboard focus only) and the list is `Select` and `Autocomplete`'s option list, both 4px inside the panel (8px from the screen's edges in the sheet) |
| 6 | Country names | **`Intl.DisplayNames`** in the page's locale, so names come in English, Vietnamese or any language with no data shipped. Sorted with `Intl.Collator` for that locale |
| 7 | Flags | **None by default.** Emoji flags show as two letters on Windows, and flag images for 240 countries add weight every app pays for. A `renderFlag(country)` prop lets an app add its own flag icons. The button shows the dial code; its accessible name says the country ("Country: United Kingdom, +44") |
| 8 | Typing and paste | Formats as it's typed in the chosen country's style (`07911 123456`). Pasting or autofilling a number that starts with `+` or `00` switches the country to match. `autocomplete="tel"` (so browsers fill the full number), `inputMode="tel"` and the phone keypad |
| 9 | Default country | `defaultCountry` (e.g. VKIEU's visitor country). Without it, the first priority country, else none: the person picks one, or types a `+` number |
| 10 | Validation | `invalid` + `errorMessage` like `TextField`; `validate` is built in: a non-empty number that isn't valid for its country reports invalid, and `getPhoneProblem` (exported) lets servers check the same way |
| 11 | Right-to-left | The field follows the page, but the number and dial code read left to right, as in `PinInput` |
| 12 | Accessibility | The country button is a labelled button opening a labelled list (`aria-haspopup`); the number input is labelled by the field's label; errors are announced. Forced colours keep the field outline and the divider |
| 13 | Server rendering | Renders on the server with the default country and value, so there's no layout shift; the picker opens after hydration |
| 14 | API conventions | `variant`, `className`, `classNames` (`root`, `label`, `country`, `input`, `picker`, `supportingText`, `errorText`), `data-*` state attributes (`data-invalid`, `data-focused`, `data-country`), TSDoc that says it isn't an M3 component |
| 15 | Later, if needed | `validation="strict"` (full metadata, mobile versus landline), and a `countries` prop to limit the list |

## API

```tsx
import { PhoneField } from '@vkieu/mui/vk';

<PhoneField
  label="Phone (optional)"
  supportingText="For order and booking updates. Never shown on your profile."
  defaultCountry="GB"
  priorityCountries={['GB', 'US', 'AU', 'VN']}
  value={phone}
  onChange={setPhone}            // '+447911123456' or ''
  onCountryChange={setCountry}   // 'GB'
  invalid={Boolean(error)}
  errorMessage={error}
/>
```

## Files

```
packages/ui/src/vk/phone-field/
  PhoneField.tsx               the field, the country button and the number input
  CountryPicker.tsx            the searchable list (menu on medium+, bottom sheet on compact)
  phone-field-styles.ts        tailwind-variants slots
  countries.ts                 dial codes from libphonenumber-js, names from Intl.DisplayNames
  phone.ts                     parse, format and getPhoneProblem (shared with servers)
  *.test.ts(x)                 unit and interaction tests
apps/docs/stories/PhoneField.stories.tsx, apps/docs/e2e/phone-field.spec.ts
apps/site/                     page, playground, examples, catalog entry (Inputs) with search
                               keywords (phone, telephone, mobile, country code, tel), count
.changeset/                    minor: adds PhoneField to @vkieu/mui/vk
packages/ui/README.md          a line in the vk component list, if it has one
```

## Tests and checks

- **Unit:** E.164 output for typed, pasted and autofilled numbers in several countries (UK `07911 123456`, US `(415) 555-2671`, Vietnam `091 234 56 78`, Australia `0412 345 678`); `+` and `00` numbers switch the country; formatting as typed; `getPhoneProblem` for empty, invalid and valid; country names in English and Vietnamese; search by name, code and dial code; priority countries first.
- **Interaction:** keyboard-only picking (open, search, arrows, Enter, Escape), focus returns to the country button as for any dialog (WAI-ARIA), with the number next in tab order, controlled and uncontrolled, form submit and reset.
- **Axe** in every story, light and dark.
- **Visual regression** across the six themes × light/dark × contrast levels, both variants, the open picker (menu and bottom sheet), invalid and disabled, right-to-left and forced colours, at phone width.
- **Next.js:** server-rendered with a default country and value, hydrating without errors.
- **Size:** the docs site's bundle check confirms `libphonenumber-js` loads only on pages that use `PhoneField`.
- `pnpm typecheck`, `pnpm lint`, `pnpm test` and the Playwright checks pass.

## Questions for Mike

1. **Flags:** none by default, with a `renderFlag` prop for apps that want them (Mike, 2026-10-08).

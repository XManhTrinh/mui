# Plan: PinInput (`@vkieu/mui/vk`)

Status: **approved by Mike and built on 2026-10-08 (branch `feat/vk-pin-input`), waiting for review**

## Goal

A general-purpose input for short, fixed-length codes, shown as one box per character: email and SMS verification codes, password reset codes, two-factor codes, PINs, and invite, voucher or booking codes. VKIEU's auth is the first consumer (Mike, 2026-10-08: "each letter / number would be on its own nice input"), but the component is built for every use above (Mike, 2026-10-08: "build the component for wider usage ... multiple variants").

M3 has no code or PIN input; its text field is one box. So `PinInput` is a **`vk` component** (architecture decision #22). Each box is drawn with **the library's M3 text field tokens**: the same colour roles, outline and active indicator, shape, type scale, state opacities and Expressive spring motion as `TextField`, so it looks and behaves like part of M3 Expressive in all six themes, light and dark, all three contrast levels and both motion schemes. It uses semantic roles only, never raw colours.

## Name

`PinInput` is the most common name for this component across design systems: Chakra UI, Mantine, Ark UI and Zag all call it `PinInput`; shadcn/ui calls it `InputOTP`, Ant Design `Input.OTP` and Radix `OneTimePasswordField`. "OTP" names only one use, and "code" is vague, while "PIN input" is the recognised name for the pattern (boxes, one character each) whatever the code is for. The first draft of this plan called it `CodeField`; this replaces it.

## When to use which

| Use | When |
|---|---|
| `PinInput` | A fixed-length code, 3–12 characters, that the person reads from somewhere else or knows by heart: verification and reset codes, two-factor codes, PINs, short invite or voucher codes |
| `TextField` | Anything of variable or longer length: passwords, long recovery keys, card numbers, phone numbers |

## Decisions

| # | Decision | Value |
|---|---|---|
| 1 | Where | `packages/ui/src/vk/pin-input/`, exported from `@vkieu/mui/vk` |
| 2 | **One real input over the boxes** | A single `<input>` holds the whole value and sits invisibly over the row of boxes (in the same grid cell, so nothing is positioned); the boxes only draw it and are `aria-hidden`. This is the proven approach (the `input-otp` pattern that shadcn/ui uses, and the major sign-in pages) because it keeps everything native: **one-time-code autofill** on iOS and Android, password managers, **paste** of the whole code anywhere, undo, IME and dictation, and **one labelled field for screen readers** instead of six unlabeled boxes. Six separate inputs break autofill and paste and are noisy with screen readers. The input's text is 16px, so iOS doesn't zoom in on focus |
| 3 | `variant` | `outlined` (default) \| `filled`, the two M3 text field variants, with the same tokens as `TextField`: **outlined** has a 1dp `outline` border, `on-surface` on hover and a 2dp `primary` border on the active box when focused; **filled** has a `surface-container-highest` container with the top corners rounded and a 1dp `on-surface-variant` active indicator that becomes 2dp `primary` on the active box. Error uses `error` (and `on-error-container` on hover); disabled uses `on-surface` at the 12% (container) and 38% (content) state opacities. The states come from the same `data-field-state` machine as `TextField` |
| 4 | `size` | `small` (40 × 48dp, `title-large`), `medium` (48 × 56dp, `headline-small`, default) and `large` (56 × 64dp, `headline-medium`). The boxes are parts of one field, and a tap anywhere on them focuses it. At narrow widths every box shrinks evenly, never below 32px, so codes of up to six characters fit a 320px phone (16px gutters) in every size, with no horizontal scroll |
| 5 | `corner` | Any step of the M3 shape scale. The default is the text field's `extra-small`; Expressive designs can pick a rounder corner (`medium`, `large`, `full` for round boxes). `filled` boxes round only their top corners, above the active indicator, as the M3 filled text field does |
| 6 | `type` | `numeric` (default: `inputMode="numeric"` and the number pad), `alphanumeric` (upper-cased, `autocapitalize="characters"`) or `alphabetic`. A `pattern` (a RegExp for one character) covers anything else, e.g. codes without the easily confused `0`, `O`, `1` and `I` |
| 7 | `mask` | Secure entry for PINs: filled boxes show a dot (`on-surface`) instead of the character, and the input is `type="password"`, so the code is never read aloud |
| 8 | `otp` | `true` (default) sets `autocomplete="one-time-code"` so the phone offers the code from SMS or email; `false` for PINs and other codes |
| 9 | `length` and `groups` | `length` 3–12 (default 6). `groups` splits the boxes, e.g. `groups={[3, 3]}` gives `123–456` (Mike, 2026-10-08); `separator` sets the separator (default an en dash in `on-surface-variant`), and it's decorative (`aria-hidden`) |
| 10 | Typing | Each character fills the next box. Inside the code the active box's character is selected, so typing replaces it; Backspace deletes and later characters move up. Arrow keys, Home and End move between boxes; tapping a box puts the caret there; keyboard focus starts in the first empty box. Characters that don't fit `type` or `pattern` are ignored, and pasted text is cleaned first ("123 456", "123-456" and "Code: 123456" all become `123456`; full-width digits become ASCII). A paste of a whole code replaces the value |
| 11 | `onComplete` | Fires once when the last character is entered or pasted, so a screen can submit on its own (Mike, 2026-10-08: auto-submit). It doesn't fire again until the value changes |
| 12 | Caret | The active empty box shows a caret in `primary`, blinking; under reduced motion it stays visible without blinking |
| 13 | Motion | From the motion tokens: a new character scales and fades into its box on the **fast spatial** spring (Motion, from the active motion scheme); border and indicator colours change on the **fast effects** spring (as in `TextField`); `invalid` shakes the row once over the **default spatial** spring's duration. The pop and the shake are off under `prefers-reduced-motion: reduce` |
| 14 | Label and messages | The same API and shared parts (`FieldLabel`, `SupportingText`, `ErrorText`) as `TextField`: `label` (or `aria-label`), `supportingText`, `invalid`, `errorMessage`, `required`, `disabled`, `readOnly`, wired with `aria-describedby` and `aria-invalid`, so errors are announced. The label sits above the boxes, because a floating label has no room inside them |
| 15 | Forms | Controlled (`value`, `onChange`) or uncontrolled (`defaultValue`); submits under `name`; `autoFocus`, `inputRef`; resets with its form |
| 16 | Right-to-left | Codes read left to right everywhere, so the boxes are `dir="ltr"` even in right-to-left layouts, while the label and messages follow the page |
| 17 | Forced colours | Box borders use `CanvasText`, and the active box `Highlight`, so the boxes stay visible in Windows high-contrast mode |
| 18 | Server rendering | A client component that renders the boxes and the input on the server, so there's no layout shift when it hydrates |
| 19 | API conventions | `className` on the root, `classNames` (`root`, `label`, `boxes`, `box`, `separator`, `supportingText`, `errorText`), `data-*` state attributes (`data-invalid`, `data-complete`, `data-focused`, `data-variant`, `data-size`) and TSDoc that says it isn't an M3 component, like the other `vk` components |
| 20 | Later, if needed | Parts for fully custom layouts (flat named exports such as `PinInputSlot` and `PinInputSeparator`, per the composition rule) can be added later without breaking this API. They're left out of the first version because the props above cover every use listed in the goal |

## API

```tsx
import { PinInput } from '@vkieu/mui/vk';

// Email verification: auto-submits, groups of three.
<PinInput
  label="6-digit code"
  groups={[3, 3]}
  value={code}
  onChange={setCode}
  onComplete={verify}
  invalid={failed}
  errorMessage="That code didn't work. Check it, or send a new one."
  autoFocus
/>

// A 4-digit PIN: filled, masked, round boxes, no one-time-code autofill.
<PinInput label="PIN" length={4} variant="filled" corner="full" mask otp={false} />

// A voucher code: letters and numbers.
<PinInput label="Voucher code" length={8} type="alphanumeric" groups={[4, 4]} otp={false} />
```

- **Props:** `variant`, `size`, `corner`, `length`, `type`, `pattern`, `mask`, `otp`, `groups`, `separator`, `value`, `defaultValue`, `onChange(value)`, `onComplete(value)`, `label` | `aria-label` | `aria-labelledby` (one is required, by type), `supportingText`, `invalid`, `errorMessage`, `required`, `disabled`, `readOnly`, `name`, `autoFocus`, `inputRef`, `className`, `classNames`, `style`.

## Files

```
packages/ui/src/vk/pin-input/
  PinInput.tsx                 the input, the boxes and the messages
  pin-input-styles.ts          tailwind-variants slots (variant, size, corner, box states)
  sanitize-pin.ts              cleans typed and pasted text for each type and pattern
  sanitize-pin.test.ts
  pin-input-styles.test.ts
  PinInput.test.tsx            typing, Backspace, arrows, paste, mask, onComplete, ARIA, axe
apps/docs/stories/PinInput.stories.tsx
apps/site/                     component page with a playground (variant, size, corner, type,
                               mask, length, groups), examples, generated props table and
                               "when to use which"
.changeset/                    minor: adds PinInput to @vkieu/mui/vk
```

## Tests and checks

- **Unit (Vitest and Testing Library):** typing fills boxes in order; Backspace, arrows, Home and End; paste of "123 456", "123-456" and longer text; `type` and `pattern` filter characters; upper-casing for `alphanumeric`; `mask` hides characters but keeps the value; `onComplete` fires once; controlled and uncontrolled; form reset; the accessible name, description and `aria-invalid`; `className` and `classNames` win; each variant, size and corner maps to the right tokens.
- **Axe** in every story, light and dark.
- **Playwright (Chromium, the repo's browser project):** typing, paste, clicking a box, the wrong-code flow, the `one-time-code` and number-pad attributes, 16px input text, the steady caret under reduced motion, and the layout-safety override matrix.
- **Next.js:** a check in `apps/next-playground` that the boxes and value are server-rendered before hydration, and that it hydrates without errors.
- **Docs site:** a catalog entry (side nav under Inputs, the components listing and count), a page with a playground and examples, and search `keywords` ("OTP", "verification code", "2FA" …), with a search test.
- **Visual regression** across the six themes × light/dark × three contrast levels, for both variants and all sizes (empty, partly filled, focused, complete, invalid, disabled and masked), right-to-left and forced colours, and a phone-width story at 320px.
- `pnpm typecheck`, `pnpm lint`, `pnpm test` and the Playwright checks pass.

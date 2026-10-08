---
'@vkieu/mui': minor
---

Add `PhoneField` to `@vkieu/mui/vk`: a phone number field with a searchable country picker that formats numbers as they're typed and reports one E.164 value (`+447911123456`). The number is the library's `TextField`, in `outlined` or `filled`; the country field beside it uses the same tokens and opens a searchable list (a popover on medium and larger windows, a bottom sheet on compact ones) with priority countries first, names in the page's language from `Intl.DisplayNames`, and search by name, ISO code or dialling code. Pasted or autofilled `+…` numbers pick their country; shared dialling codes keep the chosen country. Flags are optional through `renderFlag`. Uses `libphonenumber-js` (Google's phone data), loaded only by this component. Also exports `phoneProblem`, `readPhone`, `formatPhone`, `phoneCountry`, `dialCode`, `countryOptions` and related types, so servers can check numbers the same way.

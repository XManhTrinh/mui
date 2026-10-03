---
'@vkieu/mui': minor
---

Add `DatePicker`, `DateRangePicker`, `TimePicker` and `PickerDialog`. The date pickers follow Compose: a header with the selected date, a six-week month grid with navigation, a year list and a text input mode built on React Aria's date segments, with ranges drawn on a band. The time picker has hour and minute selectors, an AM / PM selector and a clock dial (two rings for 24 hours) that switches to minutes after the hour, or typed fields in input mode. `PickerDialog` is the modal form of both. Values are `@internationalized/date` dates and times, now a dependency.

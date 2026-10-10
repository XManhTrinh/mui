---
'@vkieu/mui': minor
---

Every theme gains `success` and `warning` colour roles (`success`, `on-success`, `success-container`, `on-success-container`, and the same for `warning`), as CSS variables, Tailwind utilities and `cn()` merge groups. They're made the way Material Theme Builder makes custom colours: a green and an amber, harmonised toward the seed, with the error roles' tone rules, so they have error's contrast in every mode and at every contrast level. `createTheme`, `ThemeSeed` and the CLI take `customColors` (`--custom success=#hex`) and `harmonize: false` (`--no-harmonize`) for a brand's own status colours. Also exports `CUSTOM_COLORS`, `CUSTOM_COLOR_ROLES` and `DEFAULT_CUSTOM_COLORS`.

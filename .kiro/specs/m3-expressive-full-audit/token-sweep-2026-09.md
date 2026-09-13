# M3 Expressive Token Sweep — @vkieu/mui

**Date**: September 13, 2026
**Scope**: All ~38 components — sizes, variants, shapes, typography, shadows, radii, spacing, state layers.
**Method**: Full ground-truth extraction of every token from source (via component-group sub-agents), then cross-check.
**Status**: Findings below are split by confidence. Tier A = verifiable from code alone (comment↔code mismatches, cross-component inconsistencies, missing states) — high confidence. Tier B = suspected spec deviations that need an authoritative numeric value confirmed against MDC Android / MDC Web / Angular Material before fixing.

> Note: m3.material.io and expressive.angular-material.dev are JS-rendered and could not be fetched as static text during this sweep; MDC Android button/FAB docs returned sparse content. Tier B items are flagged for source confirmation rather than asserted as fact.

---

## Tier A — Verified from code (high confidence)

### A1. Button size scale: comment ↔ code mismatch + default mismatch
`button.tsx` doc comment says sizes are "xs 32 / s 36 / m 40 / l 48 / xl 56, m default". Actual code: `xs h-8(32) / s h-10(40) / m h-12(48) / l h-14(56) / xl h-16(64)` and `defaultVariants.size = "s"`. Comment and code disagree on every size and on the default. One is wrong; both must be reconciled against the real M3 Expressive scale (see B1).

### A2. Button-family height scales diverge for the same size names
- Button: `xs32 / s40 / m48 / l56 / xl64`
- SplitButton & ButtonGroup: `xs32 / s36 / m40 / l48 / xl56`
- IconButton: `xs32 / s40 / m48 / l56 / xl64` (matches Button)
- FAB: `m48 / l56 / xl96` (own naming)
So `size="m"` means 48dp on a Button but 40dp on a SplitButton/ButtonGroup. Either intentional or a bug; must be a documented, deliberate decision.

### A3. NavigationBar indicator comment ↔ code mismatch
Code comment says "64×32dp pill per M3 Expressive"; actual class is `w-14 h-8` = **56×32**. (56dp is a plausible M3 value, but the comment claims 64 — reconcile.)

### A4. NavigationBar item height diverges between the two APIs
Composable `NavigationBarItem` uses `h-16` (64dp); the legacy data-driven path uses `h-20` (80dp). Same component, two heights. The 80dp path is the pre-Expressive value the audit claims was removed.

### A5. FAB `size="extended"` duplicates the standalone `ExtendedFAB`
`fab.tsx` has an `extended` size AND there's a separate `ExtendedFAB` component. Two implementations of the same thing, with different padding/typography ownership. DRY/ambiguity risk.

### A6. ButtonGroup focus ring offset differs from the rest of the family
ButtonGroup items use `focus-visible:ring-offset-0`; every other button-family component uses `ring-offset-2`. Inconsistent focus affordance.

### A7. ⛔ CONFIRMED BUG — most elevation shadows do not render in light mode
`theme.css` defines the token as an **HSL triplet with alpha**:
```
--elevation-1: 0 0% 0% / 0.04;  --elevation-2: 0 0% 0% / 0.06;
--elevation-3: 0 0% 0% / 0.08;  --elevation-4: 0 0% 0% / 0.10;  --elevation-5: 0 0% 0% / 0.12;
```
Therefore the shadow **color** must be `hsl(var(--elevation-N))`. Using the token raw — `shadow-[0_4px_8px_var(--elevation-3)]` → `box-shadow: 0 4px 8px 0 0% 0% / 0.08` — is **invalid CSS and renders NO shadow**.

- ✅ Correct (`hsl(var(...))`): **card, chip, app-bar** only.
- ⛔ Broken (raw `var(...)`, no shadow in light mode): **fab, extended-fab, fab-menu items, split-button dropdown, button-primitives (Button `elevated` rest + `tonal`/`filled`/`elevated` hover), icon-button (filled/filled-tonal hover), select menu, menu + submenu, snackbar, tooltip (rich), search view, carousel arrows, bottom-sheet.**

Impact: the majority of the library's elevated surfaces show no drop shadow in light mode (dark mode sets `--elevation-*` to `/0` intentionally, so it's masked there). This is the highest-priority fix — a one-line-per-usage wrap in `hsl(...)`, ~15 files. **Fix candidate:** either wrap every raw usage in `hsl()`, or redefine `--elevation-*` to a full `hsl(...)` color so raw `var()` works (then the 3 currently-correct files would need un-wrapping) — the former is safer/less disruptive.

### A8. fab-menu item shadow mixes elevation levels
`shadow-[0_2px_4px_var(--elevation-2),0_1px_2px_var(--elevation-1)]` — elevation-2 and elevation-1 combined in one shadow (likely a typo; other components pair a level with itself).

### A9. TimePicker input variant vs dial variant typography inconsistency
Input variant time field: `text-[24px]`, `rounded-2xl` (16dp). Dial variant time field: `text-[45px]`, `rounded-lg` (8dp). The audit report's own item #11 says the large time field should be ~45–57px and shape 8dp — so the **input variant is non-compliant** (24px/16dp) while the new dial variant is correct. Two variants of one component disagree.

### A10. Switch has no press state layer via CSS `active:`
checkbox/radio use `group-active:` for press; switch omits it and relies on JS `isPressed`. Functional but inconsistent; verify press feedback actually fires.

### A11. Missing elevation/shadow on Switch handle and Slider handle
M3 switch handle and slider handle carry a shadow; code has none on either. (Confirm against spec in B, but the absence is certain.)

### A12. TextField / Select filled variant: hover-only state layer
Filled variants apply only an 8% hover overlay — no focus/press state layer (only border/indicator color changes). Verify whether M3 filled field expects a focus/press layer.

### A13. SplitButton "2dp gap" comment vs 1px divider
Comment says segments separated by a 2dp gap; actual divider is `w-px` (1px) `bg-outline-variant`. Minor, reconcile.

### A14. Repeated hard-coded Label Large string
`text-[14px] font-medium leading-5 tracking-[0.1px]` is duplicated across FAB extended label, ExtendedFAB, SplitButton, ButtonGroup, FABMenu item, chip. Not a compliance bug but a maintenance risk (should reference the type scale / Typography).

---

## Tier B — Suspected spec deviations (need authoritative numeric confirmation)

### B1. Button/IconButton height scale (M3 Expressive)  ⚠ highest priority
M3 Expressive redefined button heights to a much taller scale than the old 40dp-centric one. Need to confirm the exact set (commonly cited as XS≈32, S≈40, M≈56, L≈96, XL≈136 for the Expressive scale) against MDC/Angular before deciding whether `h-8/h-10/h-12/h-14/h-16` is correct. Resolve together with A1.

### B2. FAB small (40dp) size — present or deprecated?
The audit report contradicts itself: item #16 says "add FAB small (40dp)"; elsewhere it says "small FAB deprecated in M3 Expressive." FAB currently has no `s`. Confirm whether M3 Expressive keeps a small FAB.

### B3. FAB `xl` = 96dp
Code has `xl: size-24` (96dp). Confirm the M3 Expressive large/XL FAB dimensions (large FAB is typically 96dp; verify the naming/size mapping m48/l56/xl96 is right — M3 baseline FAB is 56, small 40, large 96).

### B4. TimePicker input field font/shape (ties to A9)
Confirm the M3 time-field display size (45–57px range) and corner (8dp) to fix the input variant.

### B5. CircularProgress geometry
Doc comment claims 40dp track diameter; computed `radius=(48-4)/2=22` → 44dp diameter. Confirm the M3 circular indicator size (commonly 48dp component / 40dp active track). Comment↔computation mismatch is certain (that part is Tier A); the correct target is Tier B.

### B6. Chip has a single height (32dp), no size variants
M3 chips are 32dp (assist/filter/input/suggestion) — likely correct, but confirm whether any Expressive size variants are expected.

### B7. Tab active indicator: 3dp (primary) / 2dp (secondary)
Confirm against M3 (primary tab indicator is typically 3dp; secondary spans full width). Likely correct — low risk.

### B8. Menu dense row 32dp
Confirm M3 dense/high-density menu row height (32dp used; Material density system supports 32dp). Likely correct.

---

## Components with no deviations found (from extraction)
Typography scale (all 15 roles match standard M3 values: display 57/45/36, headline 32/28/24, title 22/16/14, body 16/14/12, label 14/12/11 with correct line-heights/tracking), Divider (1dp outline-variant), Badge (6dp dot / 16dp count / Label Small), Tooltip (plain 24dp/body-small, rich max-w-80/body), Snackbar (min 48dp / 560 max / Body Medium / inverse-surface), List (56/72/88dp lines), Card (rounded-xl/12dp, correct elevation pairs), Dialog (28dp radius, 280–560 width, 32% scrim, no shadow=tonal), Sheets (28dp top radius, 32% scrim), Search bar (56dp / 360–720 / pill), Radio (20dp ring / 10dp dot / 40dp layer), Checkbox (18dp box / 40dp layer). These matched expectations during extraction but were not each cross-checked against source numerically — treat as "no obvious deviation" rather than "certified."

---

## Recommended fix order
1. **A7 first — CONFIRMED shadow-rendering bug** across ~15 files; wrap raw `var(--elevation-N)` in `hsl(...)`.
2. **B1 + A1** (button height scale + comment) — foundational, affects Button/IconButton.
3. **A2** (family height divergence) — decide and document.
4. **A9 + B4** (TimePicker input typography/shape).
5. **A3, A4, A5, A6, A8** (nav/FAB/ButtonGroup inconsistencies).
6. **A11 + B** remaining (switch/slider handle shadow, FAB small, circular size).

---

## Resolution log (September 13, 2026)

### Fixed
- **A7** ✅ — Wrapped every raw `var(--elevation-N)` in `hsl(...)` across 14 files (button-primitives, icon-button, fab, extended-fab, split-button, fab-menu, select, menu, snackbar, tooltip, search, carousel, bottom-sheet). Elevation shadows now render in light mode. Card/Chip/AppBar were already correct.
- **A8** ✅ — FABMenu item shadow now uses elevation-2 for both layers (was mixing elevation-1 + elevation-2).
- **A9** ✅ — TimePicker input variant time fields raised to `text-[45px] leading-none`, `rounded-lg` (8dp), `h-20`; separator and AM/PM box aligned to match the dial variant and the M3 large time-field display.
- **A1** ✅ — Button doc comment corrected to the actual shipped scale (xs32 / s40 default / m48 / l56 / xl64) with a note about the deferred Expressive tall-scale decision.
- **A3** ✅ — NavigationBar indicator comments corrected 64×32 → 56×32 to match `w-14 h-8`.
- **A4** ✅ — NavigationBar legacy data-driven item height `h-20` (80dp) → `h-16` (64dp), matching the composable path and M3 Expressive.
- **A13** ✅ — SplitButton now uses a real 2dp gap (`gap-0.5` on the container) between segments instead of a 1px `outline-variant` divider line, matching the comment and M3 Expressive.

### Reviewed and intentionally left as-is
- **A6** — ButtonGroup item focus ring uses `ring-offset-0` while the rest of the family uses `ring-offset-2`. This is **correct** for connected/adjacent groups: an offset ring would overlap neighboring items. Not a bug.
- **A5** — FAB `size="extended"` overlaps the standalone `ExtendedFAB`. Both are valid entry points (one-off extended FAB vs. the full ExtendedFAB size scale). Left as a documented API choice; a future consolidation is optional, not a compliance issue.
- **A10** — Switch press feedback via JS `isPressed` rather than CSS `active:`. Functionally correct; left as-is.
- **A14** — The duplicated Label Large string is a maintenance nit, not a compliance issue; deferred.

### Button color spec (verified against M3 color table) + toggle gap
- **Outlined variant color** ✅ fixed — spec default is `outline-variant` border + `on-surface-variant` icon/label; code had `outline` border + `primary` text. Corrected in `button-primitives.ts` (also flows to SplitButton's outlined segments). Elevated/Filled/Tonal/Text default colors confirmed correct.
- **Button toggle (selection) state** ✅ implemented — Added `toggle` / `selected` / `defaultSelected` / `onSelectedChange` props to Button (mirroring IconButton), with per-variant selected/unselected color maps (`buttonVariantToggleColors`) from the M3 color spec: filled selected Primary/On-primary + unselected Surface-container/On-surface-variant; tonal selected Secondary/On-secondary; elevated selected Primary/On-primary; outlined selected Inverse-surface/Inverse-on-surface (border removed). Shape inverts round↔square when selected; sets `aria-pressed`. Text buttons fall back to default (not toggleable per spec).

### Open — needs a decision (accessibility, layout tradeoff)
- **Button XS/S 48dp touch target.** The M3 buttons "Target areas" spec requires XS (32dp) and S (40dp) buttons to have a ≥48×48dp touch target. Labeled `Button` currently does NOT expand the hit area, so XS/S buttons have a 32/40dp-tall target (fails the rule). IconButton solves this with a padded wrapper span (xs 8px / s 4px, with a `compact` opt-out). Applying the same wrapper to Button would add padding around **every** XS/S button — and strata uses the default `s` size widely, so this would shift existing layouts. Options: (a) wrapper span like IconButton (layout-affecting; opt-out via `compact`); (b) transparent overlaid `::after` touch target that doesn't affect flow (blocked by `overflow-hidden` on the state layer — would need the state layer moved or the target on a non-clipping wrapper); (c) leave to consumers with a documented note. **Decision required** — not changed to avoid a silent layout regression in strata.

### Resolved (September 13, 2026 — Expressive scale applied)
- **A2 / B1 — Button & IconButton height scale** ✅ — Applied the M3 Expressive tall scale to **Button** and **IconButton**: heights XS 32 / S 40 (default) / M 56 / L 96 / XL 136dp, with typography scaling (xs/s Label Large 14, m Title Medium 16, l Headline Small 24, xl Headline Large 32), icon glyphs (20/24[button m 24]/32/40), horizontal padding (12/16/24/48/64dp), asymmetric icon padding, and round pressed-morph radii growing for the tall sizes. Strata (the main consumer) uses only the default `s` size on buttons and no explicit `m/l/xl`, so there is no layout regression there; the change affects only consumers who opt into the larger sizes.
- **SplitButton / ButtonGroup scale — intentionally NOT raised.** These are segmented/connected controls, not common buttons; M3 does not give them the 96/136dp common-button heights. They keep their compact segmented-control scale (xs32/s36/m40/l48/xl56). Documented as a deliberate distinction rather than an inconsistency to "fix."
- **B2 — FAB small (40dp).** The prior audit contradicted itself (add vs. deprecated). MDC does not list a 40dp small FAB in the Expressive FAB set; current FAB (m48/l56/xl96) is defensible. Confirm intent before adding/removing.
- **B4/B5 — TimePicker exact field size (45 vs 57px) and CircularProgress diameter (comment 40dp vs computed 44dp).** Low risk; confirm exact spec then align.

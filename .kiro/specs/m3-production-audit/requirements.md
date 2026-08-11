# Requirements Document

## Introduction

This document specifies the requirements for a comprehensive staff-engineer-level production audit of the `@vkieu/mui` Material Design 3 component library. The audit covers M3 spec compliance, accessibility (WCAG 2.1 AA), theming architecture, performance optimization, Next.js/React best practices, and code quality standards across all 40+ components. The goal is to identify and resolve all gaps between the current implementation and production-ready quality.

## Glossary

- **M3**: Material Design 3 — Google's latest design system specification
- **M3_Expressive**: The expressive variant of M3 with enhanced motion, shapes, and colors
- **Component_Library**: The `@vkieu/mui` package containing all React components in `mui/src`
- **Theme_System**: The CSS custom property architecture defined in `theme.css`
- **State_Layer**: Semi-transparent overlay on interactive elements (hover 8%, focus 10%, press 10%, drag 16%)
- **Touch_Target**: Minimum interactive area (48dp per M3 spec)
- **Shape_Morph**: M3 Expressive animation where border-radius changes on press
- **Design_Token**: Named CSS custom property representing a design decision (color, spacing, typography, etc.)
- **WCAG_2.1_AA**: Web Content Accessibility Guidelines 2.1 Level AA compliance standard
- **ARIA**: Accessible Rich Internet Applications specification for assistive technologies
- **Reduced_Motion**: User preference via `prefers-reduced-motion` media query
- **SSR**: Server-Side Rendering — rendering React on the server (Next.js)
- **Tree_Shaking**: Dead-code elimination where unused exports are removed from bundles
- **Barrel_Export**: Index file that re-exports from multiple modules
- **forwardRef**: React API for forwarding refs through components to DOM elements
- **dp**: Density-independent pixel, the unit used in M3 specifications

## Requirements

### Requirement 1: M3 Dimension Compliance

**User Story:** As a design system consumer, I want all components to match M3 official dimension specifications, so that the UI renders with pixel-perfect fidelity to the design system.

#### Acceptance Criteria

1. THE Component_Library SHALL render Button variants at heights of 32dp (xs), 36dp (s), 40dp (m), 48dp (l), and 56dp (xl) as defined in M3 Expressive specifications
2. THE Component_Library SHALL render IconButton containers at sizes of 32dp (xs), 40dp (s), 48dp (m), 56dp (l), and 64dp (xl)
3. WHEN a Checkbox is rendered, THE Component_Library SHALL display a visual container of 18×18dp with 2dp corner radius
4. WHEN a Radio button is rendered, THE Component_Library SHALL display an outer circle of 20dp diameter with 2dp border width
5. WHEN a Switch is rendered, THE Component_Library SHALL display a track of 52×32dp with a handle of 16dp (unselected), 24dp (selected/icon), or 28dp (pressed)
6. THE Component_Library SHALL render TextField containers at 56dp height with 4dp corner radius (outlined) or 4dp top-only radius (filled)
7. THE Component_Library SHALL render NavigationBar at 64dp height with active indicator pills of 64×32dp
8. THE Component_Library SHALL render Tabs containers at 48dp (text-only) or 64dp (icon+text) height with active indicators of 3dp (primary) or 2dp (secondary)
9. THE Component_Library SHALL render Dialog containers with minimum width 280dp, maximum width 560dp, and 28dp corner radius
10. THE Component_Library SHALL render Chip components at 32dp height with 8dp corner radius

### Requirement 2: M3 Spacing and Padding Compliance

**User Story:** As a design system consumer, I want all internal padding and spacing to match M3 specifications exactly, so that content alignment and density are correct.

#### Acceptance Criteria

1. THE Component_Library SHALL apply 24dp padding on all sides of basic Dialog content areas with 16dp title-to-body gap and 24dp body-to-actions gap
2. THE Component_Library SHALL apply 16dp left/right content padding in TextField components
3. THE Component_Library SHALL apply 16dp left/right padding in Card content areas
4. THE Component_Library SHALL apply 8dp gap between action buttons in Dialog footers
5. THE Component_Library SHALL apply 12dp left/right padding and 48dp item height in Menu components
6. THE Component_Library SHALL apply 16dp label left padding in List items with appropriate leading/trailing element spacing
7. THE Component_Library SHALL apply asymmetric padding in Button components when icons are present (reduced padding on icon side)
8. WHEN a Slider is rendered, THE Component_Library SHALL display a track of 16dp height with fully rounded (8dp) radius

### Requirement 3: M3 Shape and Corner Radius Compliance

**User Story:** As a design system consumer, I want all components to use correct M3 shape tokens for corner radii, so that the visual language is consistent.

#### Acceptance Criteria

1. THE Theme_System SHALL define shape tokens: full (9999px), xl (28px), lg (16px), md (12px), sm (8px) matching M3 shape scale
2. THE Component_Library SHALL apply 28dp corner radius to Dialog, BottomSheet (top corners), and Card (as shape-xl)
3. THE Component_Library SHALL apply 16dp corner radius to FAB medium (rounded shape) and Button large/xl (square shape)
4. THE Component_Library SHALL apply 12dp corner radius to Card, Menu, and Chip components
5. THE Component_Library SHALL apply full-round (pill) shape to Button round variants, Search bar, and NavigationBar active indicators
6. WHEN Shape_Morph is triggered on press, THE Component_Library SHALL reduce border-radius by approximately 20-30% using M3 Expressive morph values

### Requirement 4: M3 Elevation and Shadow Compliance

**User Story:** As a design system consumer, I want elevation levels to produce correct visual shadows per M3 spec, so that depth hierarchy is communicated properly.

#### Acceptance Criteria

1. THE Theme_System SHALL define elevation opacity tokens: Level 1 (4%), Level 2 (6%), Level 3 (8%), Level 4 (10%), Level 5 (12%)
2. THE Component_Library SHALL render FAB at Level 3 elevation at rest and Level 4 on hover
3. THE Component_Library SHALL render elevated Card at Level 1 elevation with enhanced shadow on hover
4. THE Component_Library SHALL render Dialog at Level 4 elevation (or above)
5. THE Component_Library SHALL render Menu at Level 3 elevation
6. THE Component_Library SHALL render Snackbar at Level 3 elevation
7. WHEN a component is disabled, THE Component_Library SHALL remove all elevation shadows

### Requirement 5: M3 Color Token Compliance

**User Story:** As a design system consumer, I want all components to reference correct M3 color roles, so that theming works consistently across light and dark modes.

#### Acceptance Criteria

1. THE Theme_System SHALL define all M3 color roles: primary, on-primary, primary-container, on-primary-container, secondary (same pattern), tertiary (same pattern), surface variants (surface, on-surface, surface-variant, on-surface-variant, surface-container-low/default/high/highest), error (error, on-error), outline, outline-variant, inverse-surface, inverse-on-surface, inverse-primary
2. THE Component_Library SHALL use primary fill with on-primary text for filled Button and filled IconButton
3. THE Component_Library SHALL use secondary-container fill with on-secondary-container text for tonal Button, NavigationBar active indicator, and FAB primary variant
4. THE Component_Library SHALL use surface-container-high background for Dialog and DatePicker containers
5. THE Component_Library SHALL use inverse-surface background with inverse-on-surface text for Snackbar and plain Tooltip
6. THE Component_Library SHALL use error color for Badge background, TextField error state indicators, and error text
7. WHEN dark mode class is applied to the root element, THE Theme_System SHALL switch all color tokens to their dark-mode values

### Requirement 6: M3 State Layer Compliance

**User Story:** As a design system consumer, I want interactive elements to display correct state layer opacities, so that interaction feedback matches M3 specifications.

#### Acceptance Criteria

1. THE Component_Library SHALL apply 8% opacity state layer on hover for all interactive components
2. THE Component_Library SHALL apply 10% opacity state layer on focus for all interactive components
3. THE Component_Library SHALL apply 10% opacity state layer on press for all interactive components
4. THE Component_Library SHALL apply 16% opacity state layer on drag for draggable components
5. THE Component_Library SHALL use the component's on-color for state layers (e.g., on-primary for filled buttons, on-surface for standard buttons)
6. WHEN a component is in selected state (Checkbox, Radio, Switch, NavigationBar item), THE Component_Library SHALL use the primary (or container) color for state layers instead of on-surface
7. THE Component_Library SHALL implement state layers using ::before pseudo-elements or equivalent non-interactive overlay technique

### Requirement 7: M3 Typography Compliance

**User Story:** As a design system consumer, I want all text elements to use correct M3 type scale tokens, so that typographic hierarchy is maintained.

#### Acceptance Criteria

1. THE Component_Library SHALL render Button labels in Label Large (14px, weight 500, line-height 20px, letter-spacing 0.1px)
2. THE Component_Library SHALL render Dialog titles in Headline Small (24px, weight 400, line-height 32px)
3. THE Component_Library SHALL render Dialog body in Body Medium (14px, weight 400, line-height 20px)
4. THE Component_Library SHALL render NavigationBar labels in Label Medium (12px, weight 500, line-height 16px, letter-spacing 0.5px)
5. THE Component_Library SHALL render TextField input text in Body Large (16px, weight 400, line-height 24px, letter-spacing 0.5px)
6. THE Component_Library SHALL render TextField floating label in Body Small when resting (12px, weight 400, line-height 16px, letter-spacing 0.4px)
7. THE Component_Library SHALL render Chip labels in Label Large (14px, weight 500, line-height 20px, letter-spacing 0.1px)
8. THE Component_Library SHALL render all 15 Typography component variants matching the M3 type scale exactly (display/headline/title/body/label × large/medium/small)

### Requirement 8: M3 Touch Target Compliance

**User Story:** As a design system consumer, I want all interactive elements to meet minimum touch target requirements, so that the interface is usable on touch devices.

#### Acceptance Criteria

1. THE Component_Library SHALL provide minimum 48dp touch targets for all interactive elements
2. WHEN IconButton is rendered at xs (32dp) or s (40dp) size, THE Component_Library SHALL wrap it with a touch-target expander to reach 48dp
3. THE Component_Library SHALL provide 48dp minimum height for List items in interactive mode
4. THE Component_Library SHALL render Checkbox and Radio with 48dp touch target (via 48dp button container)
5. THE Component_Library SHALL render Switch with 48dp touch target (via 48dp button container)
6. THE Component_Library SHALL render Slider with 48dp vertical touch area for the track handle

### Requirement 9: M3 Animation and Motion Compliance

**User Story:** As a design system consumer, I want animations to use M3 standard easing and duration values, so that motion feels native to the design system.

#### Acceptance Criteria

1. THE Component_Library SHALL use M3 standard easing curve `cubic-bezier(0.2, 0, 0, 1)` for enter/emphasis animations
2. THE Component_Library SHALL use M3 standard decelerate curve `cubic-bezier(0, 0, 0, 1)` for exit animations where applicable
3. THE Component_Library SHALL use 200ms duration for standard state transitions (indicator slide, dialog enter)
4. THE Component_Library SHALL use 100ms duration for shape morph on press (border-radius changes)
5. THE Component_Library SHALL use 150ms duration for menu/tooltip enter animations and overlay scrim
6. THE Component_Library SHALL animate only GPU-accelerated properties (transform, opacity) for 60fps performance
7. THE Component_Library SHALL animate NavigationBar active indicator and Tab active indicator with slide transitions (200ms, M3 standard easing)

### Requirement 10: WCAG 2.1 AA — ARIA Roles and Properties

**User Story:** As a user with a screen reader, I want all components to expose correct ARIA semantics, so that I can understand and operate the interface.

#### Acceptance Criteria

1. THE Component_Library SHALL assign `role="checkbox"` with `aria-checked` (true/false/mixed) to Checkbox components
2. THE Component_Library SHALL assign `role="radio"` with `aria-checked` to Radio components and `role="radiogroup"` to RadioGroup
3. THE Component_Library SHALL assign `role="switch"` with `aria-checked` to Switch components
4. THE Component_Library SHALL assign `role="tab"` with `aria-selected` to Tab and NavigationBar items, and `role="tablist"` to their containers
5. THE Component_Library SHALL assign `role="tabpanel"` to TabContent components
6. THE Component_Library SHALL assign `role="progressbar"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow` to determinate progress indicators
7. THE Component_Library SHALL assign `role="dialog"` with `aria-modal` to modal Dialog and modal Sheet components
8. THE Component_Library SHALL assign `role="menu"` to FABMenu overlay and `role="menuitem"` to FABMenu items
9. THE Component_Library SHALL assign `role="tooltip"` with `aria-describedby` linkage to Tooltip components
10. THE Component_Library SHALL assign `role="separator"` with `aria-orientation` to Divider components
11. THE Component_Library SHALL assign `aria-disabled` to all disabled interactive components
12. THE Component_Library SHALL assign `aria-label` or `aria-labelledby` to all interactive components that lack visible text labels

### Requirement 11: WCAG 2.1 AA — Keyboard Navigation

**User Story:** As a keyboard-only user, I want to operate all interactive components using standard keyboard patterns, so that I can navigate without a pointing device.

#### Acceptance Criteria

1. THE Component_Library SHALL support Tab key navigation between all focusable components in DOM order
2. WHEN a Dialog or modal Sheet is open, THE Component_Library SHALL trap keyboard focus within the modal (Tab cycles within, Escape closes)
3. THE Component_Library SHALL support ArrowLeft/ArrowRight navigation within ButtonGroup, TabList, and NavigationBar items
4. THE Component_Library SHALL support Home/End keys to jump to first/last item within grouped controls (ButtonGroup, RadioGroup)
5. THE Component_Library SHALL support Enter/Space to activate buttons, toggle switches, select checkboxes, and select radio buttons
6. THE Component_Library SHALL support Escape to close Dialog, Menu, BottomSheet, SideSheet, and Tooltip
7. WHEN FABMenu is open, THE Component_Library SHALL support ArrowUp/ArrowDown navigation between menu items
8. THE Component_Library SHALL support ArrowLeft/ArrowRight keys in Carousel to scroll content

### Requirement 12: WCAG 2.1 AA — Focus Management

**User Story:** As a keyboard user, I want clear focus indicators and logical focus flow, so that I always know where I am in the interface.

#### Acceptance Criteria

1. THE Component_Library SHALL display a visible focus ring (2px primary color) on all interactive elements when focused via keyboard
2. WHEN a Dialog or Sheet opens, THE Component_Library SHALL move focus to the first focusable element within
3. WHEN a Dialog or Sheet closes, THE Component_Library SHALL return focus to the element that triggered it
4. THE Component_Library SHALL maintain logical tab order that follows visual layout
5. THE Component_Library SHALL not trap focus in non-modal components (standard BottomSheet, standard SideSheet)
6. WHEN a Menu is dismissed, THE Component_Library SHALL return focus to the trigger element

### Requirement 13: WCAG 2.1 AA — Reduced Motion Support

**User Story:** As a user who is sensitive to motion, I want animations to be disabled when I set prefers-reduced-motion, so that I can use the interface comfortably.

#### Acceptance Criteria

1. WHEN the user has `prefers-reduced-motion: reduce` set, THE Theme_System SHALL set all animation durations to near-zero (0.01ms)
2. WHEN the user has `prefers-reduced-motion: reduce` set, THE Theme_System SHALL set all transition durations to near-zero (0.01ms)
3. WHEN the user has `prefers-reduced-motion: reduce` set, THE Theme_System SHALL disable scroll-behavior smooth scrolling
4. THE Component_Library SHALL detect reduced motion preference in JavaScript-driven animations (Framer Motion) and disable or minimize them

### Requirement 14: Theme Token Architecture

**User Story:** As a developer consuming the library, I want a complete and well-structured CSS custom property system, so that I can customize the design system without modifying source code.

#### Acceptance Criteria

1. THE Theme_System SHALL define all color tokens as HSL components (e.g., `--primary: 214 89% 52%`) enabling alpha composition via `hsl(var(--primary)/opacity)`
2. THE Theme_System SHALL define separate light and dark theme token sets, activated by `.dark` class on root element
3. THE Theme_System SHALL define shape scale tokens (full, xl, lg, md, sm) as CSS custom properties
4. THE Theme_System SHALL define elevation tokens (levels 1-5) as shadow opacity values
5. THE Theme_System SHALL define state layer opacity tokens (hover, focus, press) as CSS custom properties
6. THE Theme_System SHALL propagate surface background color via `--m3-surface-bg` for components that need it (TextField label background)
7. THE Theme_System SHALL provide a single-file import (`@import "@vkieu/mui/theme.css"`) that delivers all tokens, keyframes, and utility classes
8. THE Theme_System SHALL map CSS variable tokens to Tailwind v4 color utilities via `@theme` block

### Requirement 15: Performance — React Optimization

**User Story:** As a developer, I want the component library to minimize unnecessary re-renders and maintain stable references, so that application performance remains optimal at scale.

#### Acceptance Criteria

1. THE Component_Library SHALL wrap callback functions passed to context providers with `React.useCallback` to prevent child re-renders
2. THE Component_Library SHALL wrap context value objects with `React.useMemo` to maintain referential stability
3. THE Component_Library SHALL use `React.forwardRef` on all components that render DOM elements to support ref forwarding
4. THE Component_Library SHALL avoid inline object/array creation in render paths that would cause child re-renders
5. THE Component_Library SHALL memoize expensive computations (e.g., stop position arrays in Slider, calendar grid in DatePicker) with `React.useMemo`
6. IF a component creates event listeners on `document` or `window`, THEN THE Component_Library SHALL clean them up in useEffect return functions

### Requirement 16: Performance — Bundle and Animation

**User Story:** As a developer, I want the library to be tree-shakeable and animations GPU-accelerated, so that the runtime footprint is minimal and motion is smooth.

#### Acceptance Criteria

1. THE Component_Library SHALL provide individual sub-path exports (`./buttons`, `./navigation`, `./sheets`, `./indicators`) for granular imports
2. THE Component_Library SHALL export named exports (no default exports) to enable tree-shaking by bundlers
3. THE Component_Library SHALL animate only `transform` and `opacity` properties for GPU acceleration (except color transitions for state layers)
4. THE Component_Library SHALL use CSS keyframe animations (via theme.css) for progress indicator loops rather than JavaScript-driven animation frames
5. THE Component_Library SHALL use `will-change` or GPU-accelerated properties for frequently animated elements (progress indicators, sheet transitions)

### Requirement 17: Next.js and React Best Practices

**User Story:** As a Next.js developer, I want the library to work seamlessly with App Router (Server Components), so that I can use components without hydration errors.

#### Acceptance Criteria

1. THE Component_Library SHALL include `"use client"` directive at the top of all interactive component files that use hooks or browser APIs
2. THE Component_Library SHALL set `displayName` on all `React.forwardRef` components for React DevTools debugging
3. THE Component_Library SHALL use `React.forwardRef` on all components that render a DOM element to enable parent ref access
4. THE Component_Library SHALL not access `window` or `document` during the render phase (only inside useEffect or event handlers)
5. THE Component_Library SHALL provide TypeScript strict types with no implicit `any` types in public APIs
6. THE Component_Library SHALL clean up all side effects (event listeners, timers, observers) in useEffect cleanup functions
7. THE Component_Library SHALL use controlled/uncontrolled patterns (value + onChange vs defaultValue) consistently across all form components

### Requirement 18: Code Quality — Consistency and Documentation

**User Story:** As a staff engineer reviewing the library, I want consistent patterns and complete documentation across all components, so that the codebase is maintainable and onboarding is efficient.

#### Acceptance Criteria

1. THE Component_Library SHALL include JSDoc comments with M3 spec links and key measurements on all component files
2. THE Component_Library SHALL follow a consistent file structure: "use client" → imports → JSDoc → types → variants (CVA) → component → displayName → exports
3. THE Component_Library SHALL use consistent naming conventions: PascalCase for components, camelCase for props, kebab-case for files
4. THE Component_Library SHALL export all public TypeScript interfaces alongside their components
5. THE Component_Library SHALL use the compound component pattern (Object.assign with sub-components) consistently for complex components
6. THE Component_Library SHALL provide both composable (sub-component children) and data-driven (props) APIs for complex components, with dual-API detection
7. THE Component_Library SHALL use consistent state management patterns: isControlled check → internal state → derived current value → handlers

### Requirement 19: M3 Specific Component Gaps

**User Story:** As a design system consumer, I want all components to implement their complete M3 anatomy without missing sub-components or states, so that I have full M3 fidelity.

#### Acceptance Criteria

1. WHEN a DatePicker is rendered, THE Component_Library SHALL support year selection mode in addition to month navigation
2. WHEN a TimePicker is rendered, THE Component_Library SHALL provide both dial (clock face) and input modes per M3 spec
3. WHEN a Carousel is rendered, THE Component_Library SHALL support hero, uncontained, and full-screen layout variants with correct leading/trailing padding
4. THE Component_Library SHALL implement disabled states at 38% opacity for all interactive components
5. THE Component_Library SHALL implement proper Snackbar queue management showing one at a time with correct auto-dismiss timers (6s default, persistent for action snackbars)
6. IF an error occurs in a TextField, THEN THE Component_Library SHALL display error state with error color on indicator, label, and supporting text
7. THE Component_Library SHALL implement hover pause behavior for Snackbar auto-dismiss timers

### Requirement 20: Audit Findings Documentation

**User Story:** As a staff engineer, I want a comprehensive audit report documenting all findings with severity levels, so that remediation can be prioritized.

#### Acceptance Criteria

1. THE Audit SHALL categorize each finding as Critical (blocks production), Major (degrades experience), or Minor (polish item)
2. THE Audit SHALL provide specific file paths, line numbers, and code snippets for each finding
3. THE Audit SHALL reference the exact M3 specification URL or WCAG success criterion for each compliance gap
4. THE Audit SHALL provide a remediation recommendation for each finding
5. THE Audit SHALL produce a summary scorecard per component (pass/fail per audit category)
6. THE Audit SHALL document all instances where components deviate from M3 official spec with justification for acceptable deviations (e.g., M3 Expressive modifications)

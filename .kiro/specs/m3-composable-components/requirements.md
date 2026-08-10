# Requirements Document

## Introduction

This document defines the requirements for auditing and refactoring MUI components in `mui/src` to use composable compound component patterns where appropriate, following Material Design 3 (M3) official guidelines and best practices. Not every component should become compound — simple, atomic components that work well as data-driven (prop-based) remain unchanged. The decision for each component is informed by M3's official anatomy specifications, the number of distinct content slots, and the degree of compositional flexibility users need.

**Guiding Principles from M3:**
- M3 components with clearly defined anatomical slots (leading, headline, trailing, content, actions) benefit from composable patterns that let consumers control slot content.
- Simple atomic controls (checkbox, radio, switch, slider, badge, icon, divider, progress indicators) have fixed internal structures and work best as prop-driven.
- Components with multiple optional sections that users need to arrange freely (app-bar, card, dialog, toolbar, list, navigation, sheets) are ideal candidates for compound patterns.
- The existing `NavigationRail` compound implementation (using `Object.assign` with `.Header`, `.Content`, `.Footer`, `.Item` sub-components and React Context) serves as the reference pattern.

## Glossary

- **Compound_Component**: A React component pattern using a parent container and named sub-components (e.g., `Card.Header`, `Card.Content`) that share state via React Context, allowing flexible composition of complex UI structures.
- **Data_Driven_Component**: A React component configured primarily through props, suitable for atomic controls with fixed internal structure.
- **Slot**: A named region within an M3 component anatomy where content can be placed (e.g., leading, trailing, headline, actions).
- **Sub_Component**: A named child component exported as a static property on the parent (e.g., `AppBar.Leading`, `AppBar.Headline`).
- **Reference_Pattern**: The existing `NavigationRail` implementation used as the architectural template for compound refactoring.
- **M3_Anatomy**: The official Material Design 3 component specification that defines the structural slots and regions of a component.
- **Composable_API**: An API that accepts children as React nodes placed in named slots rather than data arrays or primitive props.

## Requirements

### Requirement 1: Component Audit Classification

**User Story:** As a developer, I want each MUI component classified as either "compound" or "data-driven" based on M3 anatomy, so that I know which components to refactor and which to leave unchanged.

#### Acceptance Criteria

1. THE Audit SHALL classify the following components as **compound** (refactor targets):
   - `AppBar` — M3 anatomy defines leading, headline, and trailing action slots
   - `Card` — M3 anatomy defines header, media, content, and actions sections (ALREADY compound — verify/enhance)
   - `Dialog` — M3 anatomy defines title, content, actions, icon slots (ALREADY compound via Radix — verify/enhance)
   - `Toolbar` — M3 anatomy defines leading, headline, and actions slots (ALREADY compound — verify/enhance)
   - `List` / `ListItem` — M3 anatomy defines leading, content (headline/supporting), and trailing slots (ALREADY compound — verify/enhance)
   - `NavigationBar` — M3 anatomy defines item containers with icon, label, and badge slots
   - `NavigationRail` — Already implemented as compound (reference pattern, no changes needed)
   - `BottomSheet` — M3 anatomy defines drag-handle, header, content, and actions sections
   - `SideSheet` — M3 anatomy defines header, close, content, and actions sections
   - `Snackbar` — M3 anatomy defines message, action, and close slots (ALREADY compound via Provider — verify/enhance)
   - `Search` — M3 anatomy defines leading icon, input, trailing icon, and suggestion content slots
   - `Tabs` — Already compound (verify/enhance)
   - `Menu` — Already compound via Radix (verify/enhance)
   - `SplitButton` — M3 anatomy defines leading segment and trailing menu-trigger segment
   - `ButtonGroup` — Already compound (verify/enhance)
   - `FABMenu` — M3 anatomy defines trigger FAB and menu item list

2. THE Audit SHALL classify the following components as **data-driven** (no structural refactor):
   - `Badge` — Atomic indicator with fixed structure (dot or count over children)
   - `Button` — Atomic action control with icon/label props, no composable slots needed
   - `Carousel` / `CarouselItem` — Already uses children composition adequately
   - `Checkbox` — Atomic selection control with fixed internal structure
   - `Chip` — Atomic selection/action element with leading/trailing icon props
   - `CircularProgress` — Atomic indicator with no user-composable internal structure
   - `LinearProgress` — Atomic indicator with no user-composable internal structure
   - `LoadingIndicator` — Thin wrapper around CircularProgress
   - `DatePicker` — Self-contained complex widget with fixed internal calendar grid structure
   - `TimePicker` — Self-contained complex widget with fixed internal time input structure
   - `Divider` — Atomic separator element
   - `ExtendedFAB` — Atomic button with icon+label, no composable regions needed
   - `FAB` — Atomic floating action button
   - `Icon` — Atomic display element
   - `IconButton` — Atomic button control
   - `Radio` / `RadioGroup` — Atomic selection control (RadioGroup already composes children)
   - `Slider` — Atomic input control with fixed track/thumb structure
   - `Switch` — Atomic toggle control with fixed track/handle structure
   - `TextField` — Self-contained input with M3 anatomy handled internally (label animation, fieldset notch)
   - `Tooltip` — Atomic overlay with fixed trigger/content structure
   - `Typography` — Atomic text rendering element

3. WHEN a component is already partially compound, THE Audit SHALL identify gaps between the current API and full M3 anatomy compliance.

### Requirement 2: Compound Component Architecture Pattern

**User Story:** As a developer, I want a consistent compound component pattern across all refactored components, so that the library has a predictable, learnable API.

#### Acceptance Criteria

1. THE Refactored_Components SHALL use the `Object.assign` pattern to attach Sub_Components as static properties on the parent component (matching the NavigationRail Reference_Pattern).
2. THE Refactored_Components SHALL use React Context to share state between parent and Sub_Components where inter-component communication is needed.
3. THE Refactored_Components SHALL export each Sub_Component individually for tree-shaking, in addition to the compound namespace export.
4. THE Refactored_Components SHALL provide a `useComponentName()` hook for accessing shared context (e.g., `useNavigationRail()`, `useAppBar()`).
5. THE Refactored_Components SHALL accept `className` and `children` props on every Sub_Component for maximum composability.
6. THE Refactored_Components SHALL preserve all existing prop-based functionality during refactoring (backward-compatible where feasible, or clear migration path).
7. THE Refactored_Components SHALL use `React.forwardRef` on Sub_Components that render DOM elements to support ref forwarding.

### Requirement 3: AppBar Compound Refactoring

**User Story:** As a developer, I want the AppBar to use composable slots for leading, headline, and trailing content, so that I can freely compose complex app bar layouts without being constrained by prop-based slots.

#### Acceptance Criteria

1. THE AppBar SHALL expose `AppBar.Leading`, `AppBar.Headline`, and `AppBar.Trailing` Sub_Components for slot-based composition.
2. THE AppBar SHALL accept an `elevated` prop on the root to toggle scroll elevation styling.
3. THE AppBar SHALL accept a `centered` prop on the root to center-align the headline.
4. WHEN no Sub_Components are provided as children, THE AppBar SHALL render children as flexible content in the headline area (fallback behavior).
5. THE AppBar.Headline SHALL accept an optional `subtitle` prop or allow nested content for multi-line headers.
6. THE AppBar SHALL maintain the current M3 spec compliance: 64dp height, surface background, proper spacing.

### Requirement 4: NavigationBar Compound Refactoring

**User Story:** As a developer, I want the NavigationBar to use composable items instead of a data array, so that I can add custom content, badges, and routing integration to individual navigation items.

#### Acceptance Criteria

1. THE NavigationBar SHALL expose `NavigationBar.Item` as a Sub_Component for composable item rendering.
2. THE NavigationBar.Item SHALL accept `icon`, `activeIcon`, `label`, and `badge` props for M3-compliant rendering.
3. THE NavigationBar SHALL manage active state via `value` / `defaultValue` / `onValueChange` props on the root container.
4. WHEN `NavigationBar.Item` is wrapped in a routing component (e.g., `<Link>`), THE NavigationBar SHALL not interfere with navigation behavior.
5. THE NavigationBar SHALL maintain the M3 spec: full-width, 64dp height, 3-5 items, active indicator pill animation.

### Requirement 5: BottomSheet Compound Refactoring

**User Story:** As a developer, I want the BottomSheet to use composable sections for drag handle, header, content, and actions, so that I can build diverse sheet layouts.

#### Acceptance Criteria

1. THE BottomSheet SHALL expose `BottomSheet.Handle`, `BottomSheet.Header`, `BottomSheet.Content`, and `BottomSheet.Actions` Sub_Components.
2. THE BottomSheet root SHALL manage `open` / `onOpenChange` state and `variant` (standard/modal).
3. WHEN the `BottomSheet.Handle` Sub_Component is included, THE BottomSheet SHALL render the M3 drag handle (32×4dp pill).
4. THE BottomSheet SHALL maintain focus trapping for modal variant and Escape key dismissal.
5. THE BottomSheet SHALL maintain the M3 spec: 28dp top corners, surface-container-low background, scrim for modal.

### Requirement 6: SideSheet Compound Refactoring

**User Story:** As a developer, I want the SideSheet to use composable sections for header, content, and actions, so that I can customize the sheet layout for different use cases.

#### Acceptance Criteria

1. THE SideSheet SHALL expose `SideSheet.Header`, `SideSheet.Content`, and `SideSheet.Actions` Sub_Components.
2. THE SideSheet root SHALL accept `open`, `onOpenChange`, `variant` (standard/modal), and `side` (left/right) props.
3. THE SideSheet.Header SHALL optionally render a close button and headline text.
4. THE SideSheet SHALL maintain focus trapping for modal variant and Escape key dismissal.
5. THE SideSheet SHALL maintain the M3 spec: max-width 400dp, slide animation, scrim for modal.

### Requirement 7: Search Compound Refactoring

**User Story:** As a developer, I want the Search component to use composable slots for leading/trailing icons and suggestion content, so that I can integrate custom actions and dropdown results.

#### Acceptance Criteria

1. THE Search SHALL expose `Search.LeadingIcon`, `Search.TrailingIcon`, and `Search.Input` Sub_Components for flexible slot composition.
2. THE Search root SHALL manage focus state, controlled/uncontrolled value, and pass these to Sub_Components via context.
3. WHEN used without Sub_Components, THE Search SHALL fall back to the current prop-based API for backward compatibility.
4. THE Search SHALL maintain the M3 spec: 56dp height, pill shape, surface-container-high background.

### Requirement 8: Snackbar Enhancement

**User Story:** As a developer, I want the Snackbar system to continue working as a provider-based pattern (which is already composable), ensuring the imperative `show()` API remains the primary interface.

#### Acceptance Criteria

1. THE SnackbarProvider SHALL remain the primary composable pattern (context + imperative `show()` hook).
2. THE Snackbar message rendering SHALL maintain M3 spec: inverse-surface background, action button, close icon, auto-dismiss timers.
3. IF enhancements are needed, THE SnackbarProvider SHALL support custom render functions for message content.

### Requirement 9: Existing Compound Components Verification

**User Story:** As a developer, I want existing compound components (Card, Dialog, Toolbar, Tabs, Menu, ButtonGroup, List) verified against M3 anatomy to ensure completeness.

#### Acceptance Criteria

1. THE Card compound API (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter) SHALL be verified as complete per M3 card anatomy.
2. THE Dialog compound API (Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription) SHALL be verified as complete per M3 dialog anatomy.
3. THE Toolbar compound API (Toolbar, ToolbarLeading, ToolbarHeadline, ToolbarActions) SHALL be verified as complete per M3 toolbar anatomy.
4. THE Tabs compound API (Tabs, TabList, Tab, TabContent) SHALL be verified as complete per M3 tabs anatomy.
5. THE Menu compound API (Menu, MenuItem, MenuDivider) SHALL be verified as complete per M3 menu anatomy.
6. THE ButtonGroup compound API (ButtonGroup, ButtonGroupItem) SHALL be verified as complete per M3 segmented button anatomy.
7. THE List compound API (List, ListItem) SHALL be verified as complete per M3 list anatomy.
8. WHEN gaps are identified in existing compound components, THE Audit SHALL document the missing Sub_Components or props needed.

### Requirement 10: FABMenu Enhancement

**User Story:** As a developer, I want the FABMenu to optionally support composable item patterns alongside the current data-driven API, so that I can render custom item content.

#### Acceptance Criteria

1. THE FABMenu SHALL maintain its current data-driven `items` array API as the default interface.
2. WHERE composable flexibility is needed, THE FABMenu SHALL optionally accept `FABMenu.Item` Sub_Components as children instead of the `items` prop.
3. THE FABMenu SHALL not break existing usage when the composable API is added.

### Requirement 11: SplitButton Composable Enhancement

**User Story:** As a developer, I want the SplitButton to expose its leading and trailing segments as composable Sub_Components, so that I can customize each segment's content.

#### Acceptance Criteria

1. THE SplitButton SHALL expose `SplitButton.Leading` and `SplitButton.Trailing` Sub_Components for composable segment content.
2. THE SplitButton SHALL maintain the current prop-based API as the default (backward-compatible).
3. WHERE Sub_Components are used, THE SplitButton SHALL render custom content within each segment while maintaining M3 visual structure (2dp gap, corner morph, state layers).

### Requirement 12: Backward Compatibility

**User Story:** As a developer, I want compound refactoring to maintain backward compatibility with existing prop-based APIs where possible, so that migration is incremental.

#### Acceptance Criteria

1. WHEN a component is refactored from data-driven to compound, THE Component SHALL support both the old prop-based API and the new composable API during a transition period.
2. IF backward compatibility is not feasible for a specific component, THE Migration_Guide SHALL document the breaking changes and provide code examples for migration.
3. THE Refactored_Components SHALL not change the public TypeScript interface types in a way that breaks existing consumers without a documented migration path.

### Requirement 13: Accessibility Preservation

**User Story:** As a developer, I want compound refactoring to preserve all existing accessibility features (ARIA roles, keyboard navigation, focus management), so that the refactored components remain WCAG compliant.

#### Acceptance Criteria

1. THE Refactored_Components SHALL maintain all existing ARIA roles, states, and properties after refactoring.
2. THE Refactored_Components SHALL maintain keyboard navigation behavior (Tab, Arrow keys, Escape, Enter/Space) after refactoring.
3. THE Refactored_Components SHALL maintain focus trapping in modal components (Dialog, modal BottomSheet, modal SideSheet) after refactoring.
4. IF a Sub_Component renders an interactive element, THE Sub_Component SHALL forward `aria-label` and other accessibility props to the DOM element.

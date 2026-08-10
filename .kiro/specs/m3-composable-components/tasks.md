# Implementation Plan: M3 Composable Components

## Overview

This plan implements compound component patterns for 5 components (AppBar, NavigationBar, BottomSheet, SideSheet, Search), adds optional composable enhancements to 2 components (FABMenu, SplitButton), and verifies 7 existing compound components plus Snackbar. All refactors follow the NavigationRail reference pattern: `Object.assign` namespace exports, React Context for shared state, `forwardRef` on DOM-rendering sub-components, and dual-API detection for backward compatibility.

## Tasks

- [x] 1. Refactor AppBar to compound component
  - [x] 1.1 Create AppBarContext, sub-components (AppBarLeading, AppBarHeadline, AppBarTrailing), and attach via Object.assign
    - Define `AppBarContextValue` interface with `elevated` and `centered`
    - Create `AppBarContext` with `React.createContext`
    - Create `useAppBar()` hook that throws if used outside provider
    - Implement `AppBarLeading` (forwardRef, className, children, 48dp touch target wrapper)
    - Implement `AppBarHeadline` (forwardRef, subtitle prop, className, children, flex-1)
    - Implement `AppBarTrailing` (forwardRef, className, children, trailing actions wrapper)
    - Implement dual-API detection: if children include sub-components, render composable layout; otherwise use legacy prop-based layout (leadingIcon, headline, subtitle, trailingIcons)
    - Attach sub-components via `Object.assign(AppBar, { Leading: AppBarLeading, Headline: AppBarHeadline, Trailing: AppBarTrailing })`
    - Export individual sub-components and hook alongside compound namespace
    - Update `mui/src/index.ts` exports to include new sub-components and hook
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ]* 1.2 Write property test for AppBar sub-component namespace integrity
    - **Property 1: Sub-component namespace integrity**
    - **Validates: Requirements 2.1, 3.1**

  - [ ]* 1.3 Write property test for AppBar context isolation
    - **Property 2: Context isolation**
    - **Validates: Requirements 2.2, 2.4**

  - [ ]* 1.4 Write property test for AppBar backward compatibility
    - **Property 6: Backward compatibility preservation**
    - **Validates: Requirements 2.6, 3.4**

- [x] 2. Refactor NavigationBar to compound component
  - [x] 2.1 Create NavigationBarContext, NavigationBar.Item sub-component, and attach via Object.assign
    - Define `NavigationBarContextValue` interface with `activeValue` and `onSelect`
    - Create `NavigationBarContext` with `React.createContext`
    - Create `useNavigationBar()` hook that throws if used outside provider
    - Implement `NavigationBarItem` (forwardRef, value, icon, activeIcon, label, badge props, renders indicator pill, icon, badge, label)
    - Implement dual-API detection: if `items` array prop is provided, use legacy data-driven path; if children are `NavigationBar.Item` elements, use composable path
    - Implement controlled/uncontrolled state (`value`, `defaultValue`, `onValueChange`) on the root
    - Attach via `Object.assign(NavigationBar, { Item: NavigationBarItem })`
    - Export individual sub-components, hook, and updated type interfaces
    - Update `mui/src/navigation/index.ts` and `mui/src/index.ts` exports
    - _Requirements: 2.1, 2.2, 2.4, 2.5, 2.6, 2.7, 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]* 2.2 Write property test for NavigationBar controlled/uncontrolled state management
    - **Property 5: Controlled/uncontrolled state management**
    - **Validates: Requirements 4.3**

  - [ ]* 2.3 Write property test for NavigationBar backward compatibility
    - **Property 6: Backward compatibility preservation**
    - **Validates: Requirements 2.6, 4.5**

- [x] 3. Refactor BottomSheet to compound component
  - [x] 3.1 Create BottomSheetContext, sub-components (Handle, Header, Content, Actions), and attach via Object.assign
    - Define `BottomSheetContextValue` interface with `open`, `onOpenChange`, `variant`
    - Create `BottomSheetContext` with `React.createContext`
    - Create `useBottomSheet()` hook that throws if used outside provider
    - Implement `BottomSheetHandle` (forwardRef, renders M3 drag handle 32×4dp pill)
    - Implement `BottomSheetHeader` (forwardRef, className, children)
    - Implement `BottomSheetContent` (forwardRef, className, children, scrollable area)
    - Implement `BottomSheetActions` (forwardRef, className, children, bottom action bar)
    - Implement dual-API detection: if children include sub-components, render composable layout; otherwise render legacy layout (showDragHandle + children in content)
    - Preserve existing animation, focus trap, and Escape key behavior
    - Attach via `Object.assign(BottomSheet, { Handle, Header, Content, Actions })`
    - Export individual sub-components and hook
    - Update `mui/src/sheets/index.ts` and `mui/src/index.ts` exports
    - _Requirements: 2.1, 2.2, 2.4, 2.5, 2.6, 2.7, 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]* 3.2 Write property test for BottomSheet slot ordering preservation
    - **Property 4: Slot ordering preservation**
    - **Validates: Requirements 5.1**

  - [ ]* 3.3 Write property test for BottomSheet ARIA attribute preservation
    - **Property 7: ARIA attribute preservation**
    - **Validates: Requirements 13.1, 13.3**

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Refactor SideSheet to compound component
  - [x] 5.1 Create SideSheetContext, sub-components (Header, Content, Actions), and attach via Object.assign
    - Define `SideSheetContextValue` interface with `open`, `onOpenChange`, `variant`, `side`
    - Create `SideSheetContext` with `React.createContext`
    - Create `useSideSheet()` hook that throws if used outside provider
    - Implement `SideSheetHeader` (forwardRef, headline prop, showClose prop, className, children, renders close button + headline)
    - Implement `SideSheetContent` (forwardRef, className, children, scrollable area)
    - Implement `SideSheetActions` (forwardRef, className, children, 72dp bottom action bar)
    - Implement dual-API detection: if children include sub-components, render composable layout; otherwise use legacy props (headline, showClose, actions)
    - Preserve existing animation, focus trap, and Escape key behavior
    - Attach via `Object.assign(SideSheet, { Header, Content, Actions })`
    - Export individual sub-components and hook
    - Update `mui/src/sheets/index.ts` and `mui/src/index.ts` exports
    - _Requirements: 2.1, 2.2, 2.4, 2.5, 2.6, 2.7, 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 5.2 Write property test for SideSheet sub-component API contract
    - **Property 3: Sub-component API contract**
    - **Validates: Requirements 2.5, 2.7, 13.4**

  - [ ]* 5.3 Write property test for SideSheet backward compatibility
    - **Property 6: Backward compatibility preservation**
    - **Validates: Requirements 2.6, 6.5**

- [x] 6. Refactor Search to compound component
  - [x] 6.1 Create SearchContext, sub-components (LeadingIcon, Input, TrailingIcon), and attach via Object.assign
    - Define `SearchContextValue` interface with `value`, `onValueChange`, `isFocused`, `setFocused`, `disabled`
    - Create `SearchContext` with `React.createContext`
    - Create `useSearch()` hook that throws if used outside provider
    - Implement `SearchLeadingIcon` (forwardRef, className, children, 48dp target wrapper)
    - Implement `SearchInput` (forwardRef, placeholder, disabled, aria-label, className — consumes context for value/onChange/focus)
    - Implement `SearchTrailingIcon` (forwardRef, className, children, 48dp target wrapper)
    - Implement dual-API detection: if children include sub-components, render composable layout; otherwise use legacy props (leadingIcon, trailingIcon, placeholder)
    - Implement controlled/uncontrolled value state on root (`value`, `defaultValue`, `onValueChange`)
    - Attach via `Object.assign(Search, { LeadingIcon, Input, TrailingIcon })`
    - Export individual sub-components and hook
    - Update `mui/src/index.ts` exports
    - _Requirements: 2.1, 2.2, 2.4, 2.5, 2.6, 2.7, 7.1, 7.2, 7.3, 7.4_

  - [ ]* 6.2 Write property test for Search controlled/uncontrolled state management
    - **Property 5: Controlled/uncontrolled state management**
    - **Validates: Requirements 7.2**

  - [ ]* 6.3 Write property test for Search backward compatibility
    - **Property 6: Backward compatibility preservation**
    - **Validates: Requirements 2.6, 7.3**

- [x] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Enhance FABMenu with optional composable API
  - [x] 8.1 Add FABMenu.Item sub-component and dual-API detection
    - Implement `FABMenuItem` sub-component (forwardRef, icon, label, onClick, aria-label, className)
    - Implement dual-API detection: if `items` prop is provided, use data-driven path; if children include `FABMenu.Item`, use composable path
    - Add console warning when both `items` prop and FABMenu.Item children are provided (items takes precedence)
    - Attach via `Object.assign(FABMenu, { Item: FABMenuItemComponent })`
    - Export new sub-component type
    - Update `mui/src/buttons/index.ts` and `mui/src/index.ts` exports
    - Preserve all existing animation, focus management, and accessibility behavior
    - _Requirements: 2.1, 2.5, 10.1, 10.2, 10.3_

  - [ ]* 8.2 Write unit tests for FABMenu dual-API behavior
    - Test items prop still works unchanged
    - Test composable FABMenu.Item children render correctly
    - Test console warning when both APIs used
    - _Requirements: 10.1, 10.2, 10.3_

- [x] 9. Enhance SplitButton with optional composable leading segment
  - [x] 9.1 Add SplitButton.Leading sub-component and dual-API detection
    - Implement `SplitButtonLeading` sub-component (forwardRef, onClick, disabled, aria-label, className, children)
    - Implement dual-API detection: if children include `SplitButton.Leading`, render custom content in the leading segment; otherwise use legacy props (icon, label, onLeadingClick)
    - Maintain M3 visual structure: 2dp gap, corner radius morph on hover, state layers
    - Attach via `Object.assign(SplitButton, { Leading: SplitButtonLeading })`
    - Export new sub-component type
    - Update `mui/src/buttons/index.ts` and `mui/src/index.ts` exports
    - _Requirements: 2.1, 2.5, 11.1, 11.2, 11.3_

  - [ ]* 9.2 Write unit tests for SplitButton composable leading segment
    - Test prop-based API unchanged
    - Test composable Leading renders custom content
    - Test corner morph and state layers preserved
    - _Requirements: 11.1, 11.2, 11.3_

- [x] 10. Verify existing compound components and document findings
  - [x] 10.1 Verify Card, Dialog, Toolbar, Tabs, Menu, ButtonGroup, List, and Snackbar compound APIs
    - Verify Card: CardHeader, CardTitle, CardDescription, CardContent, CardFooter all present and correctly typed
    - Verify Dialog: DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose, DialogTrigger all present
    - Verify Toolbar: ToolbarLeading, ToolbarHeadline, ToolbarActions all present and correctly typed
    - Verify Tabs: Tabs, TabList, Tab, TabContent all present with context
    - Verify Menu: Menu, MenuItem, MenuDivider all present with Radix integration
    - Verify ButtonGroup: ButtonGroup, ButtonGroupItem with context and keyboard navigation
    - Verify List: List, ListItem with comprehensive prop-based anatomy (acceptable per design)
    - Verify Snackbar: SnackbarProvider with imperative show() hook
    - Add inline JSDoc comments where any gaps or recommendations are found
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 8.1, 8.2_

  - [ ]* 10.2 Write property test for existing compound components namespace integrity
    - **Property 1: Sub-component namespace integrity**
    - Verify all existing compound components have correct static sub-component properties
    - **Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7**

- [x] 11. Update barrel exports and type declarations
  - [x] 11.1 Update all barrel index files to export new sub-components, hooks, and type interfaces
    - Update `mui/src/index.ts` with all new exports (AppBar sub-components, NavigationBar sub-components, BottomSheet sub-components, SideSheet sub-components, Search sub-components, FABMenu.Item, SplitButton.Leading)
    - Update `mui/src/navigation/index.ts` with NavigationBar sub-component exports
    - Update `mui/src/sheets/index.ts` with BottomSheet and SideSheet sub-component exports
    - Update `mui/src/buttons/index.ts` with FABMenu.Item and SplitButton.Leading exports
    - Ensure all new TypeScript interfaces are exported (AppBarContextValue, NavigationBarContextValue, BottomSheetContextValue, SideSheetContextValue, SearchContextValue, and all sub-component prop types)
    - _Requirements: 2.3, 12.3_

- [x] 12. Final checkpoint - Ensure all tests pass and TypeScript compiles
  - Ensure all tests pass, ask the user if questions arise.
  - Run TypeScript compilation to verify no type errors
  - Verify no existing exports have been removed or renamed (backward compatibility)

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- The NavigationRail in `mui/src/navigation/navigation-rail.tsx` is the reference implementation — all new compound components should match its architecture
- All modifications are in-place within existing files (no new file creation except tests)
- Dual-API detection ensures zero breaking changes for existing consumers

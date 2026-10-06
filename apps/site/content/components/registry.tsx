import type { ComponentType } from 'react';
import { BadgeBody } from './badge';
import { ButtonBody } from './button';
import { ButtonGroupBody } from './button-group';
import { CardBody } from './card';
import { CarouselBody } from './carousel';
import { CheckboxBody } from './checkbox';
import { ChipsBody } from './chips';
import { DatePickerBody } from './date-picker';
import { DialogBody } from './dialog';
import { DividerBody } from './divider';
import { FabBody } from './fab';
import { FabMenuBody } from './fab-menu';
import { IconButtonBody } from './icon-button';
import { ListBody } from './list';
import { LoadingIndicatorBody } from './loading-indicator';
import { MenuBody } from './menu';
import { NavigationBarBody } from './navigation-bar';
import { NavigationRailBody } from './navigation-rail';
import { PickerDialogBody } from './picker-dialog';
import { PrimitivesBody } from './primitives';
import { ProgressBody } from './progress';
import { RadioGroupBody } from './radio-group';
import { SearchBody } from './search';
import { SheetsBody } from './sheets';
import { SliderBody } from './slider';
import { SnackbarBody } from './snackbar';
import { SplitButtonBody } from './split-button';
import { SwitchBody } from './switch';
import { TabsBody } from './tabs';
import { TextFieldBody } from './text-field';
import { TimePickerBody } from './time-picker';
import { ToolbarsBody } from './toolbars';
import { TooltipBody } from './tooltip';
import { TopAppBarBody } from './top-app-bar';

/** The groups the component gallery is organised into, in display order. */
export type ComponentGroup =
  | 'Actions'
  | 'Inputs & selection'
  | 'Containment & overlays'
  | 'Navigation'
  | 'Feedback & pickers'
  | 'Primitives';

export interface ComponentPageMeta {
  /** URL slug under `/components/`. */
  slug: string;
  title: string;
  group: ComponentGroup;
  /** One-line summary shown in the gallery and the page header. */
  summary: string;
  /**
   * Generated-props `displayName`s whose JSON the template renders as a `PropsTable`.
   * The template skips any whose JSON is absent (`readComponentPropsSafe`).
   */
  propsComponents: string[];
  /** The per-component page body: sections (a) purpose, (b) examples, (d) a11y, (e) Compose. */
  Body: ComponentType;
}

/**
 * `classNames` slot names per component `displayName`, listed from each `*ClassNames` type
 * in `packages/ui/src` (they are not in the generated props JSON). Components that export
 * no `*ClassNames` (e.g. `ButtonGroup`) are omitted and show no slot list.
 */
export const COMPONENT_SLOTS: Record<string, string[]> = {
  Button: ['root', 'content', 'label', 'icon'],
  IconButton: ['root', 'content', 'icon'],
  SplitButton: ['root', 'leading', 'content', 'label', 'icon', 'trailing', 'menuIcon'],
  Fab: ['root', 'icon'],
  ExtendedFab: ['root', 'content', 'icon', 'label', 'text'],
  FabMenu: ['root', 'anchor', 'button', 'icon', 'list'],
  FabMenuItem: ['root', 'content', 'icon'],
  TextField: [
    'root',
    'container',
    'label',
    'input',
    'leadingIcon',
    'trailingIcon',
    'prefix',
    'suffix',
    'supportingText',
    'errorText',
    'counter',
  ],
  Checkbox: ['root', 'control', 'label', 'box'],
  RadioGroup: ['root', 'label', 'options', 'supportingText', 'errorText'],
  Radio: ['root', 'control', 'label', 'ring', 'dot'],
  Switch: ['root', 'control', 'label', 'thumb', 'icon'],
  Slider: ['root', 'track', 'thumb', 'label'],
  RangeSlider: ['root', 'track', 'thumb', 'label'],
  AssistChip: ['root', 'content', 'leading', 'label', 'trailing'],
  SuggestionChip: ['root', 'content', 'leading', 'label', 'trailing'],
  FilterChip: ['root', 'content', 'leading', 'label', 'trailing'],
  InputChip: ['root', 'content', 'leading', 'label', 'trailing', 'primary', 'avatar', 'remove'],
  // Containment & overlays. Card, Badge and Divider export no `*ClassNames`, so they are omitted.
  Dialog: ['scrim', 'panel', 'icon'],
  Menu: ['group', 'item'],
  Tooltip: ['root', 'caret'],
  RichTooltip: ['root', 'title', 'text', 'actions', 'caret'],
  BottomSheet: ['scrim', 'panel', 'handle', 'content'],
  SideSheet: ['scrim', 'panel', 'header', 'title', 'content'],
  List: ['root', 'item', 'leading', 'text', 'overline', 'headline', 'supporting', 'trailing'],
  Carousel: ['root', 'scroller', 'item', 'mask'],
  BadgedBox: ['root', 'anchor'],
  // Navigation. The rail/bar items both use `NavItemClassNames`; `Tab` exports no `*ClassNames`.
  NavigationRail: ['root', 'header', 'items', 'sheet', 'scrim'],
  NavigationRailItem: ['root', 'pill', 'indicator', 'icon', 'label'],
  NavigationBar: ['root', 'item'],
  NavigationBarItem: ['root', 'pill', 'indicator', 'icon', 'label'],
  Tabs: ['root', 'list', 'tab', 'indicator', 'panel'],
  TopAppBar: ['root', 'row', 'navigation', 'title', 'actions', 'expandedRow'],
  SearchBar: ['root', 'field', 'input', 'leading', 'trailing', 'scrim', 'view', 'content'],
  SearchAppBar: ['root', 'navigation', 'search', 'actions'],
  DockedToolbar: ['root'],
  FloatingToolbar: ['root', 'items', 'leading', 'trailing', 'surface', 'fab'],
  ToolbarFab: ['root', 'icon'],
  // Feedback & pickers. `SnackbarHost` exposes no `*ClassNames` (only `className`), so it is
  // omitted. The pickers share `DatePickerClassNames` across DatePicker/DateRangePicker.
  Snackbar: ['root', 'message', 'actions', 'action', 'dismiss'],
  LinearProgressIndicator: ['root', 'track', 'indicator', 'stop'],
  CircularProgressIndicator: ['root', 'track', 'indicator'],
  LoadingIndicator: ['root', 'indicator'],
  DatePicker: ['root', 'header', 'body'],
  DateRangePicker: ['root', 'header', 'body'],
  TimePicker: ['root', 'dial'],
  PickerDialog: ['scrim', 'panel', 'actions'],
};

/** Every component page, in display order. Batches append their entries here. */
export const COMPONENT_PAGES: ComponentPageMeta[] = [
  {
    slug: 'button',
    title: 'Button',
    group: 'Actions',
    summary: 'Five variants and five sizes for text actions, with a toggle form and a press morph.',
    propsComponents: ['Button'],
    Body: ButtonBody,
  },
  {
    slug: 'icon-button',
    title: 'Icon button',
    group: 'Actions',
    summary: 'A compact icon-only action; requires an accessible name.',
    propsComponents: ['IconButton'],
    Body: IconButtonBody,
  },
  {
    slug: 'button-group',
    title: 'Button group',
    group: 'Actions',
    summary: 'Groups buttons as a unit; the connected variant replaces segmented buttons.',
    propsComponents: ['ButtonGroup'],
    Body: ButtonGroupBody,
  },
  {
    slug: 'split-button',
    title: 'Split button',
    group: 'Actions',
    summary: 'A primary action beside a trailing button that opens a menu of related actions.',
    propsComponents: ['SplitButton'],
    Body: SplitButtonBody,
  },
  {
    slug: 'fab',
    title: 'FAB',
    group: 'Actions',
    summary: "A screen's single most important action, as an icon or an extended label.",
    propsComponents: ['Fab', 'ExtendedFab'],
    Body: FabBody,
  },
  {
    slug: 'fab-menu',
    title: 'FAB menu',
    group: 'Actions',
    summary: 'A FAB that opens a stack of related actions above it.',
    propsComponents: ['FabMenu', 'FabMenuItem'],
    Body: FabMenuBody,
  },
  {
    slug: 'text-field',
    title: 'Text field',
    group: 'Inputs & selection',
    summary:
      'Filled or outlined text input with a floating label, icons, affixes, counter and multiline.',
    propsComponents: ['TextField'],
    Body: TextFieldBody,
  },
  {
    slug: 'checkbox',
    title: 'Checkbox',
    group: 'Inputs & selection',
    summary: 'Selects any number of options, with checked, unchecked and indeterminate states.',
    propsComponents: ['Checkbox'],
    Body: CheckboxBody,
  },
  {
    slug: 'radio-group',
    title: 'Radio group',
    group: 'Inputs & selection',
    summary: 'A set of radio buttons for picking exactly one option; a Radio needs a RadioGroup.',
    propsComponents: ['RadioGroup', 'Radio'],
    Body: RadioGroupBody,
  },
  {
    slug: 'switch',
    title: 'Switch',
    group: 'Inputs & selection',
    summary: 'Toggles a single setting on or off, with optional icons in the thumb.',
    propsComponents: ['Switch'],
    Body: SwitchBody,
  },
  {
    slug: 'slider',
    title: 'Slider',
    group: 'Inputs & selection',
    summary: 'Chooses a value or a range on a continuous or stepped scale, in five sizes.',
    propsComponents: ['Slider', 'RangeSlider'],
    Body: SliderBody,
  },
  {
    slug: 'chips',
    title: 'Chips',
    group: 'Inputs & selection',
    summary: 'Assist, suggestion, filter and input chips for compact actions and entries.',
    propsComponents: ['AssistChip', 'SuggestionChip', 'FilterChip', 'InputChip'],
    Body: ChipsBody,
  },
  {
    slug: 'card',
    title: 'Card',
    group: 'Containment & overlays',
    summary: 'A container for related content in three forms: static, pressable or a link.',
    propsComponents: ['Card'],
    Body: CardBody,
  },
  {
    slug: 'dialog',
    title: 'Dialog',
    group: 'Containment & overlays',
    summary:
      'A modal surface for a focused task or a decision, with flat title, content and actions.',
    propsComponents: ['Dialog', 'DialogTrigger', 'DialogTitle', 'DialogContent', 'DialogActions'],
    Body: DialogBody,
  },
  {
    slug: 'menu',
    title: 'Menu',
    group: 'Containment & overlays',
    summary:
      'A temporary list of choices anchored to a trigger, with groups, selection and typeahead.',
    propsComponents: ['Menu', 'MenuItem', 'MenuGroup', 'MenuTrigger'],
    Body: MenuBody,
  },
  {
    slug: 'tooltip',
    title: 'Tooltip',
    group: 'Containment & overlays',
    summary: 'A plain label on hover or focus, or a rich tooltip with a subhead and an action.',
    propsComponents: ['Tooltip', 'RichTooltip', 'TooltipTrigger', 'RichTooltipTrigger'],
    Body: TooltipBody,
  },
  {
    slug: 'sheets',
    title: 'Sheets',
    group: 'Containment & overlays',
    summary: 'Bottom and side sheets for supplementary content, modal or standing in the layout.',
    propsComponents: ['BottomSheet', 'SideSheet', 'SheetTrigger'],
    Body: SheetsBody,
  },
  {
    slug: 'list',
    title: 'List',
    group: 'Containment & overlays',
    summary: 'Rows with headline, overline, supporting text and leading or trailing content.',
    propsComponents: ['List', 'ListItem'],
    Body: ListBody,
  },
  {
    slug: 'carousel',
    title: 'Carousel',
    group: 'Containment & overlays',
    summary:
      'A scrollable row of items that resize along keylines: multi-browse, uncontained or hero.',
    propsComponents: ['Carousel'],
    Body: CarouselBody,
  },
  {
    slug: 'badge',
    title: 'Badge',
    group: 'Containment & overlays',
    summary: 'A small dot or a short count or label, placed on an anchor with BadgedBox.',
    propsComponents: ['Badge', 'BadgedBox'],
    Body: BadgeBody,
  },
  {
    slug: 'divider',
    title: 'Divider',
    group: 'Containment & overlays',
    summary: 'A thin line that separates content, horizontal or vertical, with optional insets.',
    propsComponents: ['Divider'],
    Body: DividerBody,
  },
  {
    slug: 'navigation-rail',
    title: 'Navigation rail',
    group: 'Navigation',
    summary:
      'Top-level destinations along the start edge, collapsed or expanded, in medium windows.',
    propsComponents: ['NavigationRail', 'NavigationRailItem'],
    Body: NavigationRailBody,
  },
  {
    slug: 'navigation-bar',
    title: 'Navigation bar',
    group: 'Navigation',
    summary: '3–5 destinations along the bottom of compact and medium windows, stacked or inline.',
    propsComponents: ['NavigationBar', 'NavigationBarItem'],
    Body: NavigationBarBody,
  },
  {
    slug: 'tabs',
    title: 'Tabs',
    group: 'Navigation',
    summary:
      'Primary and secondary tab rows with a sliding indicator, scrollable when they overflow.',
    propsComponents: ['Tabs', 'Tab'],
    Body: TabsBody,
  },
  {
    slug: 'top-app-bar',
    title: 'Top app bar',
    group: 'Navigation',
    summary: 'A header with the screen title and actions, in three sizes, with scroll behaviour.',
    propsComponents: ['TopAppBar'],
    Body: TopAppBarBody,
  },
  {
    slug: 'search',
    title: 'Search',
    group: 'Navigation',
    summary:
      'A search bar that expands into a docked or full-screen view, and an app bar with search.',
    propsComponents: ['SearchBar', 'SearchAppBar'],
    Body: SearchBody,
  },
  {
    slug: 'toolbars',
    title: 'Toolbars',
    group: 'Navigation',
    summary:
      'Docked and floating toolbars of related actions, with an optional FAB and scroll collapse.',
    propsComponents: ['DockedToolbar', 'FloatingToolbar', 'ToolbarFab'],
    Body: ToolbarsBody,
  },
  {
    slug: 'snackbar',
    title: 'Snackbar',
    group: 'Feedback & pickers',
    summary: 'A brief message with an optional action and dismiss, queued through a host.',
    propsComponents: ['Snackbar', 'SnackbarHost'],
    Body: SnackbarBody,
  },
  {
    slug: 'progress',
    title: 'Progress indicators',
    group: 'Feedback & pickers',
    summary: 'Linear and circular indicators, determinate or indeterminate, flat or wavy.',
    propsComponents: ['LinearProgressIndicator', 'CircularProgressIndicator'],
    Body: ProgressBody,
  },
  {
    slug: 'loading-indicator',
    title: 'Loading indicator',
    group: 'Feedback & pickers',
    summary: 'An Expressive shape that morphs while it rotates; replaces the spinning circle.',
    propsComponents: ['LoadingIndicator'],
    Body: LoadingIndicatorBody,
  },
  {
    slug: 'date-picker',
    title: 'Date picker',
    group: 'Feedback & pickers',
    summary: 'Pick a single date or a range on a month grid or by typing, with a year list.',
    propsComponents: ['DatePicker', 'DateRangePicker'],
    Body: DatePickerBody,
  },
  {
    slug: 'time-picker',
    title: 'Time picker',
    group: 'Feedback & pickers',
    summary: 'Pick an hour and minute on a clock dial or by typing, 12- or 24-hour.',
    propsComponents: ['TimePicker'],
    Body: TimePickerBody,
  },
  {
    slug: 'picker-dialog',
    title: 'Picker dialog',
    group: 'Feedback & pickers',
    summary:
      'The modal form of a date or time picker, with confirm, dismiss and mode-toggle slots.',
    propsComponents: ['PickerDialog'],
    Body: PickerDialogBody,
  },
  {
    slug: 'primitives',
    title: 'Primitives',
    group: 'Primitives',
    summary:
      'The internal building blocks M3 components are made from, exported for custom controls.',
    propsComponents: [],
    Body: PrimitivesBody,
  },
];

/** The registry keyed by slug, for the dynamic route to resolve a page. */
export const COMPONENT_PAGE_MAP: Record<string, ComponentPageMeta> = Object.fromEntries(
  COMPONENT_PAGES.map((page) => [page.slug, page]),
);

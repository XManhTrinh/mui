import type { ComponentType } from 'react';
import { AutocompleteBody } from './autocomplete';
import { AvatarBody } from './avatar';
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
import { PhoneFieldBody } from './phone-field';
import { SelectBody } from './select';
import { PickerDialogBody } from './picker-dialog';
import { PinInputBody } from './pin-input';
import { PrimitivesBody } from './primitives';
import { ProgressBody } from './progress';
import { RadioGroupBody } from './radio-group';
import { SearchBody } from './search';
import { SheetsBody } from './sheets';
import { SkeletonBody } from './skeleton';
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
import { COMPONENT_META, type ComponentMeta } from './catalog';

// Re-export the pure catalog surface so existing server imports keep resolving via registry.
export type {
  ComponentGroup,
  ComponentMeta,
  ComponentSpecs,
  RailGroup,
  RailGroupId,
} from './catalog';
export {
  CATEGORY_COUNT,
  COMPONENT_META,
  COMPONENT_META_MAP,
  COMPONENT_PAGE_COUNT,
  GALLERY_RAIL_GROUPS,
  RAIL_GROUPS,
  RAIL_GROUP_MAP,
  pagesInRailGroup,
} from './catalog';

/** A fully-wired component page: catalog metadata plus its rendered body. */
export interface ComponentPageMeta extends ComponentMeta {
  /** The per-component page body: sections (a) purpose, (b) examples, (d) a11y, (e) Compose. */
  Body: ComponentType;
}

/** The page body for each slug, kept separate from the pure catalog so clients can import it. */
const BODIES: Record<string, ComponentType> = {
  button: ButtonBody,
  'icon-button': IconButtonBody,
  'button-group': ButtonGroupBody,
  'split-button': SplitButtonBody,
  fab: FabBody,
  'fab-menu': FabMenuBody,
  'text-field': TextFieldBody,
  'pin-input': PinInputBody,
  'phone-field': PhoneFieldBody,
  select: SelectBody,
  autocomplete: AutocompleteBody,
  checkbox: CheckboxBody,
  'radio-group': RadioGroupBody,
  switch: SwitchBody,
  slider: SliderBody,
  chips: ChipsBody,
  card: CardBody,
  dialog: DialogBody,
  menu: MenuBody,
  tooltip: TooltipBody,
  sheets: SheetsBody,
  list: ListBody,
  carousel: CarouselBody,
  badge: BadgeBody,
  avatar: AvatarBody,
  divider: DividerBody,
  'navigation-rail': NavigationRailBody,
  'navigation-bar': NavigationBarBody,
  tabs: TabsBody,
  'top-app-bar': TopAppBarBody,
  search: SearchBody,
  toolbars: ToolbarsBody,
  snackbar: SnackbarBody,
  progress: ProgressBody,
  'loading-indicator': LoadingIndicatorBody,
  skeleton: SkeletonBody,
  'date-picker': DatePickerBody,
  'time-picker': TimePickerBody,
  'picker-dialog': PickerDialogBody,
  primitives: PrimitivesBody,
};

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
  PinInput: ['root', 'label', 'boxes', 'box', 'separator', 'supportingText', 'errorText'],
  PhoneField: ['root', 'country', 'input', 'picker', 'supportingText', 'errorText'],
  Select: [
    'root',
    'container',
    'label',
    'field',
    'value',
    'leadingIcon',
    'trailingIcon',
    'list',
    'item',
    'supportingText',
    'errorText',
  ],
  Autocomplete: [
    'root',
    'container',
    'label',
    'field',
    'input',
    'chip',
    'leadingIcon',
    'trailingIcon',
    'list',
    'item',
    'supportingText',
    'errorText',
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

/** Every component page, in display order: catalog metadata wired to its page body. */
export const COMPONENT_PAGES: ComponentPageMeta[] = COMPONENT_META.map((meta) => {
  const Body = BODIES[meta.slug];
  if (!Body) throw new Error(`No page body registered for component slug "${meta.slug}"`);
  return { ...meta, Body };
});

/** The registry keyed by slug, for the dynamic route to resolve a page. */
export const COMPONENT_PAGE_MAP: Record<string, ComponentPageMeta> = Object.fromEntries(
  COMPONENT_PAGES.map((page) => [page.slug, page]),
);

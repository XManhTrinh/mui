"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { Icon } from "../icon";
import { Badge } from "../badge";

export interface NavigationRailItem {
  value: string;
  icon: string;
  activeIcon?: string;
  label: string;
  badge?: "dot" | number;
}

export interface NavigationRailSection {
  label: string;
  icon: string;
  links: { value: string; label: string; href?: string }[];
}

export interface NavigationRailProps {
  variant?: "collapsed" | "expanded";
  items?: NavigationRailItem[];
  sections?: NavigationRailSection[];
  activeValue?: string;
  onValueChange?: (value: string) => void;
  header?: React.ReactNode;
  showLabels?: boolean;
  className?: string;
  /** Whether the rail supports collapsing/expanding via a toggle button */
  collapsible?: boolean;
  /** Controlled expanded state (use with collapsible) */
  expanded?: boolean;
  /** Callback when expanded state changes */
  onExpandedChange?: (expanded: boolean) => void;
  /** Render function for sub-items (useful for wrapping in Link components) */
  renderLink?: (props: {
    value: string;
    label: string;
    href?: string;
    isActive: boolean;
    children: React.ReactNode;
    className: string;
  }) => React.ReactNode;
}

/**
 * Material Design 3 Navigation Rail (M3 Expressive)
 *
 * @see https://m3.material.io/components/navigation-rail/specs
 *
 * Specs:
 * - Container width: 96dp (collapsed), 360dp (expanded)
 * - Container elevation: level 3 shadow
 * - Item min height (collapsed): 64dp
 * - Item spacing: 4dp between items
 * - Active indicator (collapsed): 56×32dp pill
 * - Active indicator (expanded): 56dp height, 20dp horizontal margin, 16dp padding
 * - Top padding: 44dp (gap for FAB/menu button header)
 * - Label collapsed: Title Small (12px, 500)
 * - Label expanded: Label Large (14px, 500)
 * - Transition: cubic-bezier(0.2,0,0,1) expand, cubic-bezier(0.4,0,1,1) collapse
 * - State layers: 8% hover, 10% focus, 10% press
 *
 * Sections (expanded variant only):
 * - Collapsible category headers with icon, label, and chevron
 * - Sub-items within each category shown when expanded
 * - Auto-expands the section containing the active item
 * - Dividers between sections supported
 */
export function NavigationRail({
  variant = "collapsed",
  items,
  sections,
  activeValue,
  onValueChange,
  header,
  showLabels = true,
  className,
  collapsible = false,
  expanded: controlledExpanded,
  onExpandedChange,
  renderLink,
}: NavigationRailProps) {
  const effectiveItems = items ?? [];
  const [internalValue, setInternalValue] = React.useState(effectiveItems[0]?.value ?? "");
  const [internalExpanded, setInternalExpanded] = React.useState(variant === "expanded");
  const active = activeValue ?? internalValue;

  // When sections are provided, derive collapsed items from section headers
  const collapsedItems: NavigationRailItem[] = React.useMemo(() => {
    if (effectiveItems.length > 0) return effectiveItems;
    if (!sections) return [];
    return sections.map((section) => ({
      value: section.links[0]?.value ?? section.label,
      icon: section.icon,
      label: section.label,
    }));
  }, [effectiveItems, sections]);

  // Determine expanded state from controlled or internal
  const isExpanded = collapsible
    ? (controlledExpanded ?? internalExpanded)
    : variant === "expanded";

  const handleChange = (value: string) => {
    // If sections are provided and rail is collapsed, expand on click
    if (sections && !isExpanded && collapsible) {
      const next = true;
      if (controlledExpanded === undefined) {
        setInternalExpanded(next);
      }
      onExpandedChange?.(next);
      return;
    }
    if (!activeValue) setInternalValue(value);
    onValueChange?.(value);
  };

  const toggleExpanded = () => {
    const next = !isExpanded;
    if (controlledExpanded === undefined) {
      setInternalExpanded(next);
    }
    onExpandedChange?.(next);
  };

  // Determine if we have sections to show
  const hasSections = !!sections && sections.length > 0;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-surface-container shadow-[0_4px_8px_var(--elevation-3),0_1px_3px_var(--elevation-3)]",
        "transition-[width] duration-300 ease-[cubic-bezier(0.2,0,0,1)] overflow-hidden",
        isExpanded ? "w-90" : "w-24",
        className
      )}
      aria-label="Main navigation"
    >
      {/* Header — burger menu toggle (centered in collapsed, left-aligned in expanded) */}
      {collapsible && (
        <div className={cn(
          "flex w-full shrink-0 pt-3 pb-2",
          isExpanded ? "items-start px-3" : "items-center justify-center"
        )}>
          <button
            onClick={toggleExpanded}
            className="relative flex items-center justify-center w-12 h-12 shrink-0 rounded-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary overflow-hidden before:absolute before:inset-0 before:rounded-full before:bg-current before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-[0.08] active:before:opacity-[0.10]"
            aria-label={isExpanded ? "Collapse navigation" : "Expand navigation"}
          >
            <Icon name="menu" size={24} className="relative z-10 text-surface-variant-foreground" />
          </button>
          {isExpanded && header}
        </div>
      )}
      {!collapsible && header && (
        <div className="flex items-center justify-center w-full h-11 shrink-0 mt-2">
          {header}
        </div>
      )}

      {/* Content — single render path for sections, conditional for items-only */}
      {hasSections ? (
        <nav className="flex-1 flex flex-col w-full overflow-y-auto overflow-x-hidden py-3 px-3" aria-label="Navigation rail">
          {sections!.map((section) => (
            <MorphingSectionItem
              key={section.label}
              section={section}
              activeValue={active}
              railExpanded={isExpanded}
              onSelect={handleChange}
              renderLink={renderLink}
            />
          ))}
        </nav>
      ) : (
        <nav className="flex-1 flex flex-col w-full overflow-y-auto pt-1" aria-label="Navigation rail">
          <ul
            className="flex flex-col gap-1 items-center"
            role="tablist"
            aria-orientation="vertical"
          >
            {collapsedItems.map((item) => {
              let isActive = active === item.value;
              if (!isActive && sections) {
                const section = sections.find((s) => s.links[0]?.value === item.value);
                if (section) {
                  isActive = section.links.some((link) => link.value === active);
                }
              }

              return (
                <CollapsedRailItem
                  key={item.value}
                  item={item}
                  isActive={isActive}
                  showLabel={showLabels}
                  onSelect={handleChange}
                />
              );
            })}
          </ul>
        </nav>
      )}
    </aside>
  );
}

/**
 * Single-render-path section item that morphs between expanded and collapsed states
 * via CSS transitions. No conditional rendering — the same DOM elements exist in both states.
 */
function MorphingSectionItem({
  section,
  activeValue,
  railExpanded,
  onSelect,
  renderLink,
}: {
  section: NavigationRailSection;
  activeValue: string;
  railExpanded: boolean;
  onSelect: (value: string) => void;
  renderLink?: NavigationRailProps["renderLink"];
}) {
  const hasActiveChild = section.links.some((link) => link.value === activeValue);

  const [sectionOpen, setSectionOpen] = React.useState(hasActiveChild);

  // Auto-expand when active item changes into this section
  React.useEffect(() => {
    if (hasActiveChild) {
      setSectionOpen(true);
    }
  }, [hasActiveChild]);

  const handleHeaderClick = () => {
    if (railExpanded) {
      setSectionOpen((prev) => !prev);
    } else {
      // In collapsed state, clicking a section item triggers expand
      onSelect(section.links[0]?.value ?? section.label);
    }
  };

  return (
    <div className="mb-1">
      {/* Section header — morphs between horizontal (expanded) and vertical (collapsed) */}
      <button
        onClick={handleHeaderClick}
        className={cn(
          "group relative flex transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary",
          railExpanded
            ? "flex-row items-center gap-3 px-4 h-14 w-full rounded-full"
            : "flex-col items-center justify-center gap-1 w-18 min-h-16 mx-auto rounded-2xl"
        )}
        aria-expanded={railExpanded ? sectionOpen : undefined}
      >
        {/* State layer */}
        <span
          className={cn(
            "absolute inset-0 transition-colors duration-200",
            railExpanded ? "rounded-full" : "rounded-2xl",
            "group-hover:bg-[hsl(var(--on-surface)/0.08)] group-focus-visible:bg-[hsl(var(--on-surface)/0.10)]"
          )}
        />

        {/* Active indicator for collapsed state — 56×32dp pill behind icon */}
        <span
          className={cn(
            "absolute transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] rounded-full bg-secondary-container origin-center",
            railExpanded
              ? "inset-0 scale-x-0 opacity-0"
              : hasActiveChild
                ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-4.5 w-14 h-8 scale-x-100 opacity-100"
                : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-4.5 w-14 h-8 scale-x-0 opacity-0"
          )}
        />

        {/* Icon */}
        <Icon
          name={section.icon}
          size={24}
          filled={hasActiveChild}
          className={cn(
            "relative z-10 shrink-0 transition-colors duration-200",
            hasActiveChild
              ? railExpanded ? "text-primary" : "text-secondary-container-foreground"
              : "text-surface-variant-foreground"
          )}
        />

        {/* Expanded label — fades/clips away when collapsed */}
        <span
          className={cn(
            "relative z-10 flex-1 text-left truncate text-[14px] leading-5 font-medium tracking-[0.1px] transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] whitespace-nowrap",
            railExpanded
              ? "opacity-100 max-w-full"
              : "opacity-0 max-w-0 overflow-hidden h-0",
            hasActiveChild ? "text-primary" : "text-surface-variant-foreground"
          )}
        >
          {section.label}
        </span>

        {/* Collapsed label — appears below icon when collapsed */}
        <span
          className={cn(
            "relative z-10 text-[12px] leading-4 font-medium tracking-[0.5px] truncate max-w-full text-center transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
            railExpanded
              ? "opacity-0 h-0 overflow-hidden absolute"
              : "opacity-100",
            hasActiveChild ? "text-secondary" : "text-surface-variant-foreground"
          )}
        >
          {section.label}
        </span>

        {/* Chevron — only visible in expanded state */}
        <Icon
          name="expand_more"
          size={20}
          className={cn(
            "relative z-10 text-surface-variant-foreground transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
            railExpanded
              ? "opacity-100 w-5 h-5"
              : "opacity-0 w-0 h-0 overflow-hidden",
            railExpanded && sectionOpen ? "rotate-180" : ""
          )}
        />
      </button>

      {/* Sub-items — grid animate closed when rail collapses OR section is closed */}
      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
          railExpanded && sectionOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden min-h-0">
          <div className="py-1">
            {section.links.map((link) => {
              const isActive = link.value === activeValue;

              const itemClassName = cn(
                "group/item relative flex items-center pl-14 pr-4 h-12 rounded-full text-[14px] leading-5 font-medium tracking-[0.1px] transition-colors duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary",
                "text-surface-variant-foreground"
              );

              const itemChildren = (
                <>
                  {/* Active indicator — scale from center */}
                  <span
                    className={cn(
                      "absolute inset-0 rounded-full bg-secondary-container transition-transform duration-200 ease-[cubic-bezier(0.2,0,0,1)] origin-center",
                      isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                    )}
                  />
                  {/* State layer */}
                  <span className="absolute inset-0 rounded-full transition-colors duration-200 group-hover/item:bg-[hsl(var(--on-surface)/0.08)] group-focus-visible/item:bg-[hsl(var(--on-surface)/0.10)]" />
                  {/* Label */}
                  <span
                    className={cn(
                      "relative z-10",
                      isActive ? "text-secondary-container-foreground" : ""
                    )}
                  >
                    {link.label}
                  </span>
                </>
              );

              // If renderLink is provided, use it for custom link rendering
              if (renderLink) {
                return (
                  <React.Fragment key={link.value}>
                    {renderLink({
                      value: link.value,
                      label: link.label,
                      href: link.href,
                      isActive,
                      children: itemChildren,
                      className: itemClassName,
                    })}
                  </React.Fragment>
                );
              }

              return (
                <button
                  key={link.value}
                  onClick={() => onSelect(link.value)}
                  className={itemClassName}
                >
                  {itemChildren}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Collapsed rail item: vertical icon + optional label, 56×32dp indicator */
function CollapsedRailItem({
  item,
  isActive,
  showLabel,
  onSelect,
}: {
  item: NavigationRailItem;
  isActive: boolean;
  showLabel: boolean;
  onSelect: (value: string) => void;
}) {
  const iconContent = (
    <Icon
      name={isActive ? (item.activeIcon ?? item.icon) : item.icon}
      size={24}
      filled={isActive}
      className={cn(
        "relative z-10 transition-colors duration-200",
        isActive
          ? "text-secondary-container-foreground"
          : "text-surface-variant-foreground"
      )}
    />
  );

  return (
    <li>
      <button
        role="tab"
        aria-selected={isActive}
        aria-label={item.label}
        onClick={() => onSelect(item.value)}
        className="group relative flex flex-col items-center justify-center gap-1 w-24 min-h-16 py-1 outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
      >
        {/* Indicator container with state layer via ::after */}
        <div
          className="relative flex items-center justify-center w-14 h-8"
        >
          {/* Active indicator pill — animates from center outward */}
          <div
            className={cn(
              "absolute inset-0 rounded-full bg-secondary-container transition-transform duration-200 ease-[cubic-bezier(0.2,0,0,1)] origin-center",
              isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
            )}
          />
          {/* State layer via ::after */}
          <div
            className={cn(
              "absolute inset-0 z-10 rounded-full transition-colors duration-200",
              isActive
                ? "group-hover:bg-[hsl(var(--on-secondary-container)/0.08)] group-focus-visible:bg-[hsl(var(--on-secondary-container)/0.10)] group-active:bg-[hsl(var(--on-secondary-container)/0.10)]"
                : "group-hover:bg-[hsl(var(--on-surface-variant)/0.08)] group-focus-visible:bg-[hsl(var(--on-surface-variant)/0.10)] group-active:bg-[hsl(var(--on-surface-variant)/0.10)]"
            )}
          />
          {/* Icon with optional badge */}
          {item.badge !== undefined ? (
            <Badge
              variant={item.badge === "dot" ? "dot" : "count"}
              count={item.badge === "dot" ? undefined : item.badge}
              visible
            >
              {iconContent}
            </Badge>
          ) : (
            iconContent
          )}
        </div>

        {/* Label */}
        {showLabel && (
          <span
            className={cn(
              "text-[12px] leading-4 font-medium tracking-[0.5px] transition-colors duration-200 truncate max-w-full",
              isActive
                ? "text-secondary"
                : "text-surface-variant-foreground"
            )}
          >
            {item.label}
          </span>
        )}
      </button>
    </li>
  );
}

/** Expanded rail item: horizontal icon + label, full-width indicator with 56dp height */
function ExpandedRailItem({
  item,
  isActive,
  onSelect,
}: {
  item: NavigationRailItem;
  isActive: boolean;
  onSelect: (value: string) => void;
}) {
  const iconContent = (
    <Icon
      name={isActive ? (item.activeIcon ?? item.icon) : item.icon}
      size={24}
      filled={isActive}
      className="relative z-10 shrink-0"
    />
  );

  return (
    <li>
      <button
        role="tab"
        aria-selected={isActive}
        aria-label={item.label}
        onClick={() => onSelect(item.value)}
        className={cn(
          "group relative flex items-center gap-3 w-full h-14 rounded-full mx-5 px-4 outline-none cursor-pointer transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary",
          isActive
            ? "bg-secondary-container text-secondary-container-foreground font-medium"
            : "text-surface-variant-foreground"
        )}
        style={{ width: "calc(100% - 40px)" }}
      >
        {/* State layer */}
        <div
          className={cn(
            "absolute inset-0 rounded-full transition-colors duration-200",
            isActive
              ? "group-hover:bg-[hsl(var(--on-secondary-container)/0.08)] group-focus-visible:bg-[hsl(var(--on-secondary-container)/0.10)] group-active:bg-[hsl(var(--on-secondary-container)/0.10)]"
              : "group-hover:bg-[hsl(var(--on-surface-variant)/0.08)] group-focus-visible:bg-[hsl(var(--on-surface-variant)/0.10)] group-active:bg-[hsl(var(--on-surface-variant)/0.10)]"
          )}
        />

        {/* Icon with optional badge */}
        {item.badge !== undefined ? (
          <Badge
            variant={item.badge === "dot" ? "dot" : "count"}
            count={item.badge === "dot" ? undefined : item.badge}
            visible
          >
            {iconContent}
          </Badge>
        ) : (
          iconContent
        )}

        {/* Label */}
        <span className="relative z-10 text-[14px] leading-5 font-medium tracking-[0.1px] truncate">
          {item.label}
        </span>
      </button>
    </li>
  );
}

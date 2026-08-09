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

  // Determine expanded state from controlled or internal
  const isExpanded = collapsible
    ? (controlledExpanded ?? internalExpanded)
    : variant === "expanded";

  const handleChange = (value: string) => {
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

  // If sections are provided and rail is expanded, render sectioned layout
  if (sections && isExpanded) {
    return (
      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-surface-container shadow-[0_4px_8px_var(--elevation-3),0_1px_3px_var(--elevation-3)]",
          "w-90 transition-[width] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
          className
        )}
        aria-label="Main navigation"
      >
        {/* Header — burger menu toggle */}
        <div className="flex items-center w-full shrink-0 px-3 pt-3 pb-2">
          <button
            onClick={toggleExpanded}
            className="relative flex items-center justify-center w-12 h-12 rounded-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary overflow-hidden before:absolute before:inset-0 before:rounded-full before:bg-current before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-[0.08] active:before:opacity-[0.10]"
            aria-label={isExpanded ? "Collapse navigation" : "Expand navigation"}
          >
            <Icon name="menu" size={24} className="relative z-10 text-surface-variant-foreground" />
          </button>
          {header}
        </div>

        {/* Sectioned navigation */}
        <nav className="flex-1 flex flex-col w-full overflow-y-auto py-3 px-3" aria-label="Navigation rail">
          {sections.map((section) => (
            <SectionItem
              key={section.label}
              section={section}
              activeValue={active}
              onSelect={handleChange}
              renderLink={renderLink}
            />
          ))}
        </nav>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 z-40 flex flex-col items-center bg-surface-container shadow-[0_4px_8px_var(--elevation-3),0_1px_3px_var(--elevation-3)]",
        "transition-[width] duration-300",
        isExpanded
          ? "w-90 ease-[cubic-bezier(0.2,0,0,1)]"
          : "w-24 ease-in",
        className
      )}
      aria-label="Main navigation"
    >
      {/* Header — burger menu toggle */}
      <div className="flex items-center justify-center w-full shrink-0 pt-3 pb-2">
        {collapsible && (
          <button
            onClick={toggleExpanded}
            className="relative flex items-center justify-center w-12 h-12 rounded-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary overflow-hidden before:absolute before:inset-0 before:rounded-full before:bg-current before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-[0.08] active:before:opacity-[0.10]"
            aria-label="Expand navigation"
          >
            <Icon name="menu" size={24} className="relative z-10 text-surface-variant-foreground" />
          </button>
        )}
        {!collapsible && header}
      </div>

      {/* Navigation items */}
      <nav className="flex-1 flex flex-col w-full overflow-y-auto pt-1" aria-label="Navigation rail">
        <ul
          className={cn(
            "flex flex-col gap-1",
            isExpanded ? "px-3" : "items-center"
          )}
          role="tablist"
          aria-orientation="vertical"
        >
          {effectiveItems.map((item) => {
            const isActive = active === item.value;

            if (!isExpanded) {
              return (
                <CollapsedRailItem
                  key={item.value}
                  item={item}
                  isActive={isActive}
                  showLabel={showLabels}
                  onSelect={handleChange}
                />
              );
            }

            return (
              <ExpandedRailItem
                key={item.value}
                item={item}
                isActive={isActive}
                onSelect={handleChange}
              />
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

/** Collapsible section for the expanded rail variant */
function SectionItem({
  section,
  activeValue,
  onSelect,
  renderLink,
}: {
  section: NavigationRailSection;
  activeValue: string;
  onSelect: (value: string) => void;
  renderLink?: NavigationRailProps["renderLink"];
}) {
  const hasActiveChild = section.links.some((link) => link.value === activeValue);

  const [isExpanded, setIsExpanded] = React.useState(hasActiveChild);

  // Auto-expand when active item changes into this section
  React.useEffect(() => {
    if (hasActiveChild) {
      setIsExpanded(true);
    }
  }, [hasActiveChild]);

  return (
    <div className="mb-1">
      {/* Section header — 56dp height */}
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className={cn(
          "group relative w-full flex items-center gap-3 px-4 h-14 rounded-full text-[14px] leading-5 font-medium tracking-[0.1px] transition-colors duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary",
          hasActiveChild
            ? "text-primary"
            : "text-surface-variant-foreground"
        )}
        aria-expanded={isExpanded}
      >
        {/* State layer */}
        <span className="absolute inset-0 rounded-full transition-colors duration-200 group-hover:bg-[hsl(var(--on-surface)/0.08)] group-focus-visible:bg-[hsl(var(--on-surface)/0.10)]" />

        <Icon
          name={section.icon}
          size={24}
          filled={hasActiveChild}
          className={cn(
            "relative z-10 shrink-0",
            hasActiveChild ? "text-primary" : "text-surface-variant-foreground"
          )}
        />
        <span className="relative z-10 flex-1 text-left truncate">{section.label}</span>
        <Icon
          name="expand_more"
          size={20}
          className={cn(
            "relative z-10 text-surface-variant-foreground transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
            isExpanded ? "rotate-180" : ""
          )}
        />
      </button>

      {/* Sub-items — collapsible with grid-rows animation */}
      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
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

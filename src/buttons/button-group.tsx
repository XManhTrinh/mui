"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { Icon } from "../icon";

/**
 * @m3-audit VERIFIED — ButtonGroup and ButtonGroupItem present with context and keyboard navigation.
 * Uses ButtonGroupContext for shared state (variant, selectionMode, selected, size, shape).
 * ButtonGroupPositionContext provides per-item position for corner radius calculation.
 * Keyboard navigation: ArrowLeft/Right, Home/End. ARIA roles: radio/checkbox with aria-checked.
 * Complete per M3 segmented button spec. No gaps found.
 */

// ---------- Context ----------

type ButtonGroupContextValue = {
  variant: "standard" | "connected";
  selectionMode: "single" | "multiple" | "selection-required";
  selected: string[];
  size: "xs" | "s" | "m" | "l" | "xl";
  shape: "round" | "square";
  equalWidth: boolean;
  onSelect: (value: string) => void;
}

type ButtonGroupPositionContextValue = {
  index: number;
  count: number;
}

const ButtonGroupContext =
  React.createContext<ButtonGroupContextValue | null>(null);

const ButtonGroupPositionContext =
  React.createContext<ButtonGroupPositionContextValue | null>(null);

function useButtonGroup() {
  const context = React.useContext(ButtonGroupContext);
  if (!context) {
    throw new Error("ButtonGroupItem must be used within a ButtonGroup");
  }
  return context;
}

function useButtonGroupPosition() {
  const context = React.useContext(ButtonGroupPositionContext);
  if (!context) {
    throw new Error("ButtonGroupItem must be used within a ButtonGroup");
  }
  return context;
}

// ---------- ButtonGroup ----------

export type ButtonGroupProps = {
  /** Variant: standard (spaced) or connected (joined) */
  variant?: "standard" | "connected";
  /** Selection mode */
  selectionMode?: "single" | "multiple" | "selection-required";
  /** Controlled value(s) */
  value?: string | string[];
  /** Uncontrolled default value(s) */
  defaultValue?: string | string[];
  /** Callback on selection change */
  onValueChange?: (value: string | string[]) => void;
  /** Size */
  size?: "xs" | "s" | "m" | "l" | "xl";
  /** Shape of the buttons */
  shape?: "round" | "square";
  /** Equal-width items */
  equalWidth?: boolean;
  /** Children (ButtonGroupItem elements) */
  children: React.ReactNode;
  /** Additional classes */
  className?: string;
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      variant = "connected",
      selectionMode = "single",
      value,
      defaultValue,
      onValueChange,
      size = "m",
      shape = "round",
      equalWidth = false,
      children,
      className,
    },
    ref
  ) => {
    // Normalize to array
    const normalizeValue = (v: string | string[] | undefined): string[] => {
      if (v === undefined) return [];
      return Array.isArray(v) ? v : [v];
    };

    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState<string[]>(() =>
      normalizeValue(defaultValue)
    );

    const selected = isControlled ? normalizeValue(value) : internalValue;

    const containerRef = React.useRef<HTMLDivElement | null>(null);

    const onSelect = React.useCallback(
      (itemValue: string) => {
        let newSelected: string[];

        if (selectionMode === "single") {
          newSelected = [itemValue];
        } else if (selectionMode === "selection-required") {
          // Cannot deselect if it's the only selected item
          if (selected.includes(itemValue) && selected.length === 1) {
            return; // No change — must keep at least one selected
          }
          newSelected = [itemValue];
        } else {
          // Multiple mode: toggle
          if (selected.includes(itemValue)) {
            newSelected = selected.filter((v) => v !== itemValue);
          } else {
            newSelected = [...selected, itemValue];
          }
        }

        if (!isControlled) {
          setInternalValue(newSelected);
        }

        if (onValueChange) {
          if (selectionMode === "multiple") {
            onValueChange(newSelected);
          } else {
            onValueChange(newSelected[0] ?? "");
          }
        }
      },
      [selectionMode, selected, isControlled, onValueChange]
    );

    // Keyboard navigation
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const container = containerRef.current;
        if (!container) return;

        const buttons = Array.from(
          container.querySelectorAll<HTMLButtonElement>(
            '[role="radio"]:not([aria-disabled="true"]), [role="checkbox"]:not([aria-disabled="true"])'
          )
        );

        const currentIndex = buttons.indexOf(
          document.activeElement as HTMLButtonElement
        );
        if (currentIndex === -1) return;

        let nextIndex: number | null = null;

        switch (e.key) {
          case "ArrowRight":
            e.preventDefault();
            nextIndex =
              currentIndex + 1 < buttons.length ? currentIndex + 1 : 0;
            break;
          case "ArrowLeft":
            e.preventDefault();
            nextIndex =
              currentIndex - 1 >= 0
                ? currentIndex - 1
                : buttons.length - 1;
            break;
          case "Home":
            e.preventDefault();
            nextIndex = 0;
            break;
          case "End":
            e.preventDefault();
            nextIndex = buttons.length - 1;
            break;
          default:
            return;
        }

        if (nextIndex !== null && buttons[nextIndex]) {
          buttons[nextIndex].focus();
        }
      },
      []
    );

    const contextValue = React.useMemo(
      (): ButtonGroupContextValue => ({
        variant,
        selectionMode,
        selected,
        size,
        shape,
        equalWidth,
        onSelect,
      }),
      [variant, selectionMode, selected, size, shape, equalWidth, onSelect]
    );

    // Merge refs
    const mergedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    // Count valid children for position context
    const validChildren = React.Children.toArray(children).filter(
      React.isValidElement
    );
    const count = validChildren.length;

    // Standard variant gap per size
    const standardGapMap = {
      xs: "gap-4.5",
      s: "gap-3",
      m: "gap-2",
      l: "gap-2",
      xl: "gap-2",
    } as const;

    const containerGap = variant === "standard" ? standardGapMap[size] : "";

    return (
      <ButtonGroupContext.Provider value={contextValue}>
        <div
          ref={mergedRef}
          role="group"
          className={cn("inline-flex", containerGap, className)}
          onKeyDown={handleKeyDown}
        >
          {validChildren.map((child, index) => (
            <ButtonGroupPositionContext.Provider
              key={
                (child as React.ReactElement<{ value?: string }>).props.value ??
                index
              }
              value={{ index, count }}
            >
              {child}
            </ButtonGroupPositionContext.Provider>
          ))}
        </div>
      </ButtonGroupContext.Provider>
    );
  }
);
ButtonGroup.displayName = "ButtonGroup";

// ---------- ButtonGroupItem ----------

export type ButtonGroupItemProps = {
  /** Unique value identifier */
  value: string;
  /** Icon name (Material Symbols) */
  icon?: string;
  /** Text label */
  label?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Additional classes */
  className?: string;
}

/**
 * Inner corner radii per size (from M3 Expressive spec)
 * Connected variant: XS: 4dp, S: 8dp, M: 8dp, L: 16dp, XL: 20dp
 */
const innerRadiusValues = {
  xs: 4,
  s: 8,
  m: 8,
  l: 16,
  xl: 20,
} as const;

/** Size heights matching M3 Expressive button heights: 32/36/40/48/56dp */
const sizeHeightMap = {
  xs: "h-8",
  s: "h-9",
  m: "h-10",
  l: "h-12",
  xl: "h-14",
} as const;

/** Minimum width for accessibility (XS and S need 48dp min) */
const minWidthMap = {
  xs: "min-w-12",
  s: "min-w-12",
  m: "",
  l: "",
  xl: "",
} as const;

/**
 * Build border-radius CSS for connected variant items based on position and shape.
 * Returns inline style object for precise radius control.
 */
function getConnectedRadiusStyle(
  index: number,
  count: number,
  size: "xs" | "s" | "m" | "l" | "xl",
  shape: "round" | "square"
): React.CSSProperties {
  const innerRadius = innerRadiusValues[size];
  const outerRadius = shape === "round" ? 9999 : innerRadius;

  const isFirst = index === 0;
  const isLast = index === count - 1;
  const isOnly = count === 1;

  if (isOnly) {
    return { borderRadius: outerRadius };
  }

  if (isFirst) {
    // Top-left, bottom-left = outer; top-right, bottom-right = inner
    return {
      borderTopLeftRadius: outerRadius,
      borderBottomLeftRadius: outerRadius,
      borderTopRightRadius: innerRadius,
      borderBottomRightRadius: innerRadius,
    };
  }

  if (isLast) {
    // Top-left, bottom-left = inner; top-right, bottom-right = outer
    return {
      borderTopLeftRadius: innerRadius,
      borderBottomLeftRadius: innerRadius,
      borderTopRightRadius: outerRadius,
      borderBottomRightRadius: outerRadius,
    };
  }

  // Middle items: all inner
  return { borderRadius: innerRadius };
}

/**
 * Build border-radius CSS for standard variant items.
 * Each item is standalone with full round or square shape.
 */
function getStandardRadiusStyle(
  shape: "round" | "square",
  size: "xs" | "s" | "m" | "l" | "xl"
): React.CSSProperties {
  if (shape === "round") {
    return { borderRadius: 9999 };
  }
  // Square: uses same inner corner values as connected
  return { borderRadius: innerRadiusValues[size] };
}

/**
 * Pressed radius for connected variant — reduces outer corners to inner size.
 * M3 Expressive: on press, outer corners morph smaller (spring shape morph).
 */
function getConnectedPressedRadiusStyle(
  index: number,
  count: number,
  size: "xs" | "s" | "m" | "l" | "xl"
): React.CSSProperties {
  const innerRadius = innerRadiusValues[size];
  // On press, outer corners reduce to match inner radius (shape contracts)
  const pressedOuterRadius = Math.max(innerRadius, 12); // Morph to at least 12dp

  const isFirst = index === 0;
  const isLast = index === count - 1;
  const isOnly = count === 1;

  if (isOnly) {
    return { borderRadius: pressedOuterRadius };
  }

  if (isFirst) {
    return {
      borderTopLeftRadius: pressedOuterRadius,
      borderBottomLeftRadius: pressedOuterRadius,
      borderTopRightRadius: innerRadius,
      borderBottomRightRadius: innerRadius,
    };
  }

  if (isLast) {
    return {
      borderTopLeftRadius: innerRadius,
      borderBottomLeftRadius: innerRadius,
      borderTopRightRadius: pressedOuterRadius,
      borderBottomRightRadius: pressedOuterRadius,
    };
  }

  // Middle items: all inner (no change on press)
  return { borderRadius: innerRadius };
}

/**
 * Pressed radius for standard variant — reduces pill shape to rounded-xl equivalent.
 * M3 Expressive: on press, outer corners morph smaller (spring shape morph).
 */
function getStandardPressedRadiusStyle(
  shape: "round" | "square",
  size: "xs" | "s" | "m" | "l" | "xl"
): React.CSSProperties {
  if (shape === "round") {
    // Round: pill → 16dp (rounded-xl) on press, matching Button's active:rounded-xl
    return { borderRadius: 16 };
  }
  // Square: reduce slightly
  const innerRadius = innerRadiusValues[size];
  return { borderRadius: Math.max(innerRadius - 4, 4) };
}

const ButtonGroupItem = React.forwardRef<HTMLButtonElement, ButtonGroupItemProps>(
  ({ value, icon, label, disabled = false, className }, ref) => {
    const ctx = useButtonGroup();
    const position = useButtonGroupPosition();
    const isSelected = ctx.selected.includes(value);

    const { index, count } = position;
    const isFirst = index === 0;

    // Compute border radius based on variant
    const radiusStyle =
      ctx.variant === "connected"
        ? getConnectedRadiusStyle(index, count, ctx.size, ctx.shape)
        : getStandardRadiusStyle(ctx.shape, ctx.size);

    // Pressed (morph) radius — reduces outer corners on press (M3 Expressive spring shape morph)
    const pressedRadiusStyle =
      ctx.variant === "connected"
        ? getConnectedPressedRadiusStyle(index, count, ctx.size)
        : getStandardPressedRadiusStyle(ctx.shape, ctx.size);

    // Connected variant: overlap borders so adjacent items share a single divider line (M3 segmented button)
    const gapClass =
      ctx.variant === "connected" && !isFirst ? "-ml-px" : "";

    // Z-index for connected variant: ensure selected/focused items render above overlapping borders
    const zClass =
      ctx.variant === "connected"
        ? isSelected
          ? "z-10"
          : "hover:z-10 focus-visible:z-10"
        : "";

    // Width class
    const widthClass = ctx.equalWidth ? "flex-1" : "";

    // Selection visuals
    const selectionClass = isSelected
      ? "bg-secondary-container text-secondary-container-foreground"
      : ctx.variant === "connected"
        ? "bg-transparent text-surface-foreground"
        : "bg-surface-container-low text-surface-foreground";

    // Border for connected variant — M3 uses outline-variant for segment dividers
    const borderClass =
      ctx.variant === "connected" ? "border border-outline-variant" : "";

    // Disabled
    const disabledClass = disabled
      ? "opacity-[0.38] pointer-events-none cursor-not-allowed"
      : "";

    // ARIA role
    const role =
      ctx.selectionMode === "multiple" ? "checkbox" : "radio";

    const handleClick = () => {
      if (!disabled) {
        ctx.onSelect(value);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (!disabled) {
          ctx.onSelect(value);
        }
      }
    };

    // Shape morph on press — applies reduced radius on pointerdown, restores on pointerup
    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
      const el = e.currentTarget;
      Object.assign(el.style, pressedRadiusStyle);
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
      const el = e.currentTarget;
      Object.assign(el.style, radiusStyle);
    };

    const handlePointerLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
      const el = e.currentTarget;
      Object.assign(el.style, radiusStyle);
    };

    return (
      <button
        ref={ref}
        type="button"
        role={role}
        aria-checked={isSelected}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        style={radiusStyle}
        className={cn(
          // Base layout
          "relative inline-flex items-center justify-center gap-2 px-4",
          "cursor-pointer select-none",
          // Typography: Label Large
          "text-[14px] font-medium leading-5 tracking-[0.1px]",
          // Transition: matches standard Button — includes border-radius for M3 Expressive spring shape morph
          "transition-[border-radius,box-shadow] duration-100 ease-out",
          // State layer via ::before pseudo-element
          "overflow-hidden",
          "before:absolute before:inset-0 before:rounded-[inherit]",
          "before:bg-current before:opacity-0",
          "before:transition-opacity before:duration-200 before:pointer-events-none",
          // State layer opacities (M3: 8% hover, 10% focus, 10% press)
          "hover:before:opacity-[0.08]",
          "focus-visible:before:opacity-[0.10]",
          "active:before:opacity-[0.10]",
          // Focus ring
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0",
          // Size
          sizeHeightMap[ctx.size],
          // Min width for accessibility
          minWidthMap[ctx.size],
          // Variant-specific styling
          borderClass,
          gapClass,
          zClass,
          widthClass,
          selectionClass,
          disabledClass,
          className
        )}
      >
        {/* Checkmark icon for selected state */}
        {isSelected && <Icon name="check" size={20} />}
        {/* Leading icon (only shown when not selected — checkmark replaces it) */}
        {icon && !isSelected && <Icon name={icon} size={20} />}
        {/* Label */}
        {label && <span>{label}</span>}
      </button>
    );
  }
);
ButtonGroupItem.displayName = "ButtonGroupItem";

export { ButtonGroup, ButtonGroupItem };

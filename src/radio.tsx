"use client";

import * as React from "react";

import { cn } from "./lib/utils";

/**
 * Material Design 3 Radio Button
 *
 * M3 Specs (m3.material.io/components/radio-button/specs):
 * - Icon size: 20dp
 * - State layer: 40dp
 * - Target size: 48dp
 * - Colors:
 *   - Selected: primary (outer ring + inner dot)
 *   - Unselected: on-surface-variant (outer ring only)
 *   - Disabled: on-surface at 38%
 *   - State layer: primary (selected), on-surface (unselected)
 * - Animation: 100ms, cubic-bezier(0.2, 0, 0, 1)
 */

export type RadioProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  name?: string;
  value?: string;
  className?: string;
  "aria-label"?: string;
  /**
   * Tab-order index. Managed by RadioGroup (roving tabindex); usually not set
   * directly. Defaults to browser behavior when used standalone.
   */
  tabIndex?: number;
}

const Radio = React.forwardRef<HTMLButtonElement, RadioProps>(
  (
    {
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      disabled = false,
      id,
      name,
      value,
      className,
      "aria-label": ariaLabel,
      tabIndex,
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
    const isControlled = controlledChecked !== undefined;
    const isChecked = isControlled ? controlledChecked : internalChecked;

    const handleClick = () => {
      if (disabled) return;
      if (!isChecked) {
        if (!isControlled) setInternalChecked(true);
        onCheckedChange?.(true);
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={isChecked}
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        id={id}
        disabled={disabled}
        tabIndex={tabIndex}
        onClick={handleClick}
        className={cn(
          "group relative inline-flex items-center justify-center align-middle size-12 select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
          className
        )}
      >
        {/* Hidden native input for form submission */}
        {name && (
          <input
            type="radio"
            name={name}
            value={value}
            checked={isChecked}
            readOnly
            hidden
            aria-hidden="true"
            tabIndex={-1}
          />
        )}

        {/* State layer — 40dp circle */}
        <span
          className={cn(
            "absolute size-10 rounded-full transition-colors duration-200 pointer-events-none",
            !disabled && !isChecked && "group-hover:bg-[hsl(var(--on-surface)/0.08)] group-focus-visible:bg-[hsl(var(--on-surface)/0.10)] group-active:bg-[hsl(var(--on-surface)/0.10)]",
            !disabled && isChecked && "group-hover:bg-[hsl(var(--primary)/0.08)] group-focus-visible:bg-[hsl(var(--primary)/0.10)] group-active:bg-[hsl(var(--primary)/0.10)]"
          )}
        />

        {/* Outer circle — 20dp, 2dp border */}
        <span
          className={cn(
            "relative z-10 flex items-center justify-center size-5 rounded-full border-2",
            "transition-colors duration-100 ease-[cubic-bezier(0.2,0,0,1)]",
            // Selected
            isChecked && !disabled && "border-primary",
            // Unselected
            !isChecked && !disabled && "border-[hsl(var(--on-surface-variant))]",
            // Disabled
            disabled && "border-[hsl(var(--on-surface)/0.38)]"
          )}
        >
          {/* Inner dot — 10dp, scales in/out on selection */}
          <span
            className={cn(
              "size-2.5 rounded-full",
              "transition-transform duration-100 ease-[cubic-bezier(0.2,0,0,1)]",
              isChecked && !disabled && "bg-primary scale-100",
              isChecked && disabled && "bg-[hsl(var(--on-surface)/0.38)] scale-100",
              !isChecked && "scale-0 bg-primary"
            )}
          />
        </span>
      </button>
    );
  }
);
Radio.displayName = "Radio";

export type RadioGroupProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  name?: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
  children: React.ReactNode;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onValueChange,
      disabled = false,
      name,
      orientation = "vertical",
      className,
      children,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;
    const groupRef = React.useRef<HTMLDivElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const group = groupRef.current;
      if (!group) return;

      const radios = Array.from(
        group.querySelectorAll<HTMLButtonElement>('[role="radio"]:not([disabled])')
      );
      if (radios.length === 0) return;

      const currentIndex = radios.findIndex(
        (r) => r === document.activeElement
      );

      let nextIndex: number | null = null;

      const isHorizontal = orientation === "horizontal";
      const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";
      const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";

      switch (e.key) {
        case nextKey:
          nextIndex = currentIndex < radios.length - 1 ? currentIndex + 1 : 0;
          break;
        case prevKey:
          nextIndex = currentIndex > 0 ? currentIndex - 1 : radios.length - 1;
          break;
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = radios.length - 1;
          break;
        default:
          return;
      }

      if (nextIndex !== null) {
        e.preventDefault();
        radios[nextIndex].focus();
        radios[nextIndex].click();
      }
    };

    return (
      <div
        ref={(node) => {
          (groupRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        role="radiogroup"
        aria-orientation={orientation}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex",
          orientation === "vertical" ? "flex-col" : "flex-row gap-2",
          className
        )}
      >
        {(() => {
          // Recursively walk the children tree to find and enhance Radio
          // elements wherever they appear — even when wrapped in <label>,
          // <div>, or other layout elements.
          const flatRadios: { value?: string; disabled?: boolean; index: number }[] = [];
          let counter = 0;

          const collectRadios = (nodes: React.ReactNode) => {
            React.Children.forEach(nodes, (child) => {
              if (React.isValidElement<RadioProps>(child) && (child.type as { displayName?: string })?.displayName === "Radio") {
                flatRadios.push({
                  value: child.props.value,
                  disabled: disabled || child.props.disabled,
                  index: counter++,
                });
              } else if (React.isValidElement(child) && (child.props as { children?: React.ReactNode }).children) {
                collectRadios((child.props as { children?: React.ReactNode }).children);
              }
            });
          };
          collectRadios(children);

          const hasChecked = flatRadios.some(
            (r) => r.value !== undefined && r.value === currentValue
          );
          const firstEnabledIndex = flatRadios.find((r) => !r.disabled)?.index ?? -1;

          let radioCounter = 0;

          const enhanceChildren = (nodes: React.ReactNode): React.ReactNode => {
            return React.Children.map(nodes, (child) => {
              if (!React.isValidElement(child)) return child;

              // Direct Radio match
              if ((child.type as { displayName?: string })?.displayName === "Radio") {
                const idx = radioCounter++;
                const radioProps = child.props as RadioProps;
                const childValue = radioProps.value;
                const isChecked = childValue !== undefined && childValue === currentValue;
                const isTabbable = hasChecked ? isChecked : idx === firstEnabledIndex;

                return React.cloneElement(child as React.ReactElement<RadioProps>, {
                  name,
                  disabled: disabled || radioProps.disabled,
                  checked: childValue !== undefined ? isChecked : undefined,
                  tabIndex: isTabbable ? 0 : -1,
                  onCheckedChange: (checked: boolean) => {
                    if (checked && childValue) {
                      if (!isControlled) setInternalValue(childValue);
                      onValueChange?.(childValue);
                    }
                    radioProps.onCheckedChange?.(checked);
                  },
                } as Partial<RadioProps>);
              }

              // Wrapper element — recurse into its children
              const wrapperProps = child.props as { children?: React.ReactNode };
              if (wrapperProps.children) {
                return React.cloneElement(child as React.ReactElement<{ children?: React.ReactNode }>, {
                  ...wrapperProps,
                  children: enhanceChildren(wrapperProps.children),
                });
              }

              return child;
            });
          };

          return enhanceChildren(children);
        })()}
      </div>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

export { Radio, RadioGroup };

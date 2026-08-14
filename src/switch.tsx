"use client";

import * as React from "react";

import { cn } from "./lib/utils";
import { Icon } from "./icon";

/**
 * Material Design 3 Switch
 *
 * M3 Specs (m3.material.io/components/switch/specs):
 * - Track: 52dp × 32dp, 2dp outline, shape full (pill)
 * - Handle (unselected): 16dp × 16dp
 * - Handle (with icon): 24dp × 24dp
 * - Handle (selected): 24dp × 24dp
 * - Handle (pressed): 28dp × 28dp
 * - State layer: 40dp, shape full
 * - Target size: 48dp
 * - Icon size: 16dp
 * - Colors:
 *   Track (unselected): surface-container-highest bg, outline border
 *   Track (selected): primary bg, no border
 *   Handle (unselected): outline
 *   Handle (selected): on-primary
 *   Handle (pressed unselected): on-surface-variant
 *   Handle (pressed selected): primary-container
 *   Icon (unselected): surface-container-highest
 *   Icon (selected): on-primary-container
 *   State layer (unselected): on-surface
 *   State layer (selected): primary
 *   Disabled track: surface-variant bg, on-surface 12% border
 *   Disabled handle: on-surface 38%
 * - States: 8% hover, 10% focus, 10% press
 * - Animation: 200ms M3 standard easing, handle grows on press
 */

export type SwitchProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  showIcons?: boolean;
  id?: string;
  name?: string;
  className?: string;
  "aria-label"?: string;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      disabled = false,
      showIcons = false,
      id,
      name,
      className,
      "aria-label": ariaLabel,
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
    const [isPressed, setIsPressed] = React.useState(false);
    const isControlled = controlledChecked !== undefined;
    const isChecked = isControlled ? controlledChecked : internalChecked;

    const handleClick = () => {
      if (disabled) return;
      const next = !isChecked;
      if (!isControlled) setInternalChecked(next);
      onCheckedChange?.(next);
    };

    const handlePointerDown = () => {
      if (!disabled) setIsPressed(true);
    };

    const handlePointerUp = () => {
      setIsPressed(false);
    };

    React.useEffect(() => {
      if (isPressed) {
        const handleGlobalUp = () => setIsPressed(false);
        document.addEventListener("pointerup", handleGlobalUp);
        document.addEventListener("pointercancel", handleGlobalUp);
        return () => {
          document.removeEventListener("pointerup", handleGlobalUp);
          document.removeEventListener("pointercancel", handleGlobalUp);
        };
      }
    }, [isPressed]);

    // Determine handle size: pressed = 28dp, checked or has icon = 24dp, else 16dp
    const hasIcon = showIcons;
    const handleSize = isPressed
      ? 28
      : isChecked || hasIcon
        ? 24
        : 16;

    // Handle position: center vertically, slide horizontally
    // Track inner width = 52 - 4 (padding) = 48 usable
    // Unselected: handle starts at left with some padding
    // Selected: handle ends at right
    const handleLeft = isChecked
      ? 52 - handleSize - 4 // 4dp from right edge
      : 4; // 4dp from left edge (when 16dp) or adjusted

    // For unselected without icon: handle is 16dp, positioned at ~8dp from left
    // For unselected with icon: handle is 24dp, positioned at 4dp from left
    const computedLeft = isChecked
      ? 52 - handleSize - 4
      : hasIcon || isPressed
        ? 4
        : 8;

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        id={id}
        aria-checked={isChecked}
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className={cn(
          "group relative inline-flex items-center justify-center w-12 h-12 select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
          className
        )}
      >
        {/* Hidden input for form submission */}
        {name && (
          <input
            type="checkbox"
            name={name}
            checked={isChecked}
            readOnly
            hidden
            aria-hidden="true"
            tabIndex={-1}
          />
        )}

        {/* Track — 52×32dp pill shape */}
        <span
          className={cn(
            "relative w-13 h-8 rounded-full transition-colors duration-200",
            // Selected
            isChecked && !disabled && "bg-primary",
            // Unselected
            !isChecked && !disabled && "bg-surface-container-highest border-2 border-outline",
            // Disabled selected
            isChecked && disabled && "bg-[hsl(var(--on-surface)/0.12)]",
            // Disabled unselected
            !isChecked && disabled && "bg-surface-variant border-2 border-[hsl(var(--on-surface)/0.12)]"
          )}
        >
          {/* State layer — 40dp circle on handle position */}
          <span
            className={cn(
              "absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full transition-colors duration-200 pointer-events-none",
              !disabled && !isChecked && "group-hover:bg-[hsl(var(--on-surface)/0.08)] group-focus-visible:bg-[hsl(var(--on-surface)/0.10)]",
              !disabled && isChecked && "group-hover:bg-[hsl(var(--primary)/0.08)] group-focus-visible:bg-[hsl(var(--primary)/0.10)]",
              isPressed && !isChecked && !disabled && "bg-[hsl(var(--on-surface)/0.10)]",
              isPressed && isChecked && !disabled && "bg-[hsl(var(--primary)/0.10)]"
            )}
            style={{
              left: `${computedLeft + handleSize / 2 - 20}px`,
            }}
          />

          {/* Handle (thumb) */}
          <span
            className={cn(
              "absolute top-1/2 -translate-y-1/2 rounded-full flex items-center justify-center",
              "transition-[left,width,height,background-color] duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
              // Selected colors
              isChecked && !disabled && (isPressed ? "bg-primary-container" : "bg-[hsl(var(--on-primary))]"),
              // Unselected colors
              !isChecked && !disabled && (isPressed ? "bg-[hsl(var(--on-surface-variant))]" : "bg-outline"),
              // Disabled
              disabled && "bg-[hsl(var(--on-surface)/0.38)]"
            )}
            style={{
              width: `${handleSize}px`,
              height: `${handleSize}px`,
              left: `${computedLeft}px`,
            }}
          >
            {/* Icons */}
            {showIcons && isChecked && (
              <Icon
                name="check"
                size={18}
                className="text-[hsl(var(--on-primary-container))] text-[16px]!"
              />
            )}
            {showIcons && !isChecked && (
              <Icon
                name="close"
                size={18}
                className="text-surface-container-highest text-[16px]!"
              />
            )}
          </span>
        </span>
      </button>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };

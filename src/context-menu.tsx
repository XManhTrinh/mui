/**
 * Material Design 3 — Context Menu (right-click triggered)
 *
 * ⚠️  GAP: This component is NOT yet implemented. Install @radix-ui/react-context-menu
 *    to proceed with implementation.
 *
 * M3 Specs (must match Menu component — m3.material.io/components/menus/specs):
 * - Container: min-width 112dp (min-w-28), max-width 280dp (max-w-70)
 * - Shape: corner-extra-small 4dp (rounded-sm)
 * - Background: surface-container (bg-surface-container)
 * - Elevation: Level 2 shadow (shadow with --elevation-2)
 * - Vertical padding: 8dp (py-2)
 *
 * Menu Item specs:
 * - Height: 48dp (h-12)
 * - Horizontal padding: 12dp (px-3)
 * - Typography: Body Large (16px/24px/400/0.5px tracking)
 * - Leading/trailing icon: 24dp, on-surface-variant color
 * - State layer: on-surface at 8% hover, 10% press
 *
 * Divider specs:
 * - Height: 1dp (h-px), outline-variant color, 8dp vertical margin (my-2)
 *
 * Animation:
 * - Enter: fade + scale 150ms ease-out (m3-animate-menu)
 * - Exit: fade 75ms linear (m3-animate-menu)
 *
 * Planned API (mirrors Menu/DropdownMenu pattern):
 *   - ContextMenu — root (wraps trigger element + menu content)
 *   - ContextMenuItem — same styling as MenuItem (h-12, px-3, Body Large)
 *   - ContextMenuDivider — same as MenuDivider (h-px, my-2, bg-outline-variant)
 *   - ContextMenuHeader — same as MenuHeader (Label Medium typography)
 *   - ContextMenuSub — submenu wrapper
 *   - ContextMenuSubTrigger — submenu trigger item
 *   - ContextMenuSubContent — submenu content panel
 *
 * Install with: npm install @radix-ui/react-context-menu
 *
 * Implementation note: When implemented, the container shadow MUST use Level 2
 * elevation: shadow-[0_3px_6px_var(--elevation-2),0_1px_2px_var(--elevation-2)]
 * NOT Level 3 (which was the previous incorrect value in Menu).
 */

// TODO: Implement ContextMenu component — @radix-ui/react-context-menu is not yet installed.
// The implementation should mirror menu.tsx using ContextMenuPrimitive from Radix,
// with identical container classes (min-w-28, max-w-70, rounded-sm, bg-surface-container,
// py-2, Level 2 elevation shadow, m3-animate-menu) and item classes (h-12, px-3,
// Body Large typography, state layers).

export {};

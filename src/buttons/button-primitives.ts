/**
 * Shared button primitives for @vkieu/mui
 *
 * These are the M3 "material" concerns that every button-family component
 * shares: interaction affordances, the ::before state layer, focus ring,
 * shape-morph transition, disabled treatment, and the per-variant color +
 * hover-elevation mapping.
 *
 * Button, SplitButton (and any future button-family component) compose these
 * so the state-layer opacities, focus ring, and variant colors stay defined in
 * exactly one place. Geometry (height, padding, border-radius, typography size)
 * is intentionally NOT included here — each component owns its own geometry.
 */

/**
 * Base interaction + state-layer classes shared by all button-family surfaces.
 *
 * Includes: cursor/select, shape-morph transition, focus ring, the ::before
 * state-layer element with M3 opacities (8% hover, 10% focus, 10% press), and
 * icon pointer/shrink defaults. Requires the host element to establish its own
 * border-radius (the state layer inherits it via `before:rounded-[inherit]`).
 */
export const buttonBase = [
  // Cursor & interaction
  "cursor-pointer select-none",
  // Transition: M3 Expressive shape morph (visible on press and release)
  "transition-[border-radius,box-shadow] duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
  // Focus ring
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
  // State layer via ::before pseudo-element
  "overflow-hidden",
  "before:absolute before:inset-0 before:rounded-[inherit]",
  "before:bg-current before:opacity-0",
  "before:transition-opacity before:duration-200 before:pointer-events-none",
  // State layer opacities (M3: 8% hover, 10% focus, 10% press)
  "hover:before:opacity-[0.08]",
  "focus-visible:before:opacity-[0.10]",
  "active:before:opacity-[0.10]",
  // Icon sizing defaults
  "[&_svg]:pointer-events-none [&_svg]:shrink-0",
].join(" ");

/**
 * Per-variant color classes: background, foreground, border, and resting
 * elevation. Matches the M3 common button variants.
 */
export const buttonVariantColors = {
  filled: "bg-primary text-primary-foreground",
  outlined:
    "bg-transparent border border-outline text-primary disabled:border-[hsl(var(--on-surface)/0.12)]",
  text: "bg-transparent text-primary",
  elevated:
    "bg-surface-container-low text-primary shadow-[0_1px_3px_hsl(var(--elevation-1))] disabled:shadow-none",
  tonal: "bg-secondary-container text-secondary-container-foreground",
} as const;

/**
 * Per-variant hover elevation. Split out from color so components that never
 * elevate (e.g. text) or need custom hover behavior can opt in/out.
 */
export const buttonVariantHoverElevation = {
  filled: "hover:shadow-[0_1px_3px_hsl(var(--elevation-1))] disabled:shadow-none",
  outlined: "",
  text: "",
  elevated: "hover:shadow-[0_3px_6px_hsl(var(--elevation-2))] disabled:shadow-none",
  tonal: "hover:shadow-[0_1px_3px_hsl(var(--elevation-1))]",
} as const;

export type ButtonVariant = keyof typeof buttonVariantColors;

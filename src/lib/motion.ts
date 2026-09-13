/**
 * M3 Expressive Motion Constants
 *
 * Centralized motion tokens for use by all components in the library.
 * Values sourced from:
 *   - material-components-android/docs/theming/Motion.md
 *   - m3.material.io/styles/motion/easing-and-duration
 *
 * Components should import from here instead of defining their own constants.
 * CSS equivalents are defined in theme.css as custom properties (--motion-*).
 */

// ─── Duration (seconds, for use with motion/react) ────────────────────────────

export const duration = {
  short1: 0.05,
  short2: 0.1,
  short3: 0.15,
  short4: 0.2,
  medium1: 0.25,
  medium2: 0.3,
  medium3: 0.35,
  medium4: 0.4,
  long1: 0.45,
  long2: 0.5,
  long3: 0.55,
  long4: 0.6,
} as const;

// ─── Easing Curves (cubic-bezier arrays, for use with motion/react) ───────────

export const easing = {
  /** Utility motion — elements that begin and end on screen */
  standard: [0.2, 0, 0, 1] as const,
  /** Utility motion — elements entering the screen */
  standardDecelerate: [0, 0, 0, 1] as const,
  /** Utility motion — elements exiting the screen */
  standardAccelerate: [0.3, 0, 1, 1] as const,
  /** Stylized M3 Expressive motion — elements entering the screen */
  emphasizedDecelerate: [0.05, 0.7, 0.1, 1] as const,
  /** Stylized M3 Expressive motion — elements exiting the screen */
  emphasizedAccelerate: [0.3, 0, 0.8, 0.15] as const,
  /** Non-stylized motion */
  linear: [0, 0, 1, 1] as const,
} as const;

// ─── Spring Presets (for use with motion/react type: "spring") ────────────────
//
// Choose by size of the animated element / distance covered:
//   fast    — small components (switches, buttons, tooltips)
//   default — medium components (bottom sheets, nav drawers, cards)
//   slow    — full-screen transitions
//
// Choose by property type:
//   spatial — position, size, shape (allows overshoot)
//   effects — color, opacity (critically damped, no overshoot)

export const spring = {
  fastSpatial: { stiffness: 1400, damping: 0.9 },
  fastEffects: { stiffness: 3800, damping: 1 },
  defaultSpatial: { stiffness: 700, damping: 0.9 },
  defaultEffects: { stiffness: 1600, damping: 1 },
  slowSpatial: { stiffness: 300, damping: 0.9 },
  slowEffects: { stiffness: 800, damping: 1 },
} as const;

// ─── Common Animation Presets ─────────────────────────────────────────────────
//
// Ready-to-use transition configs for the most common M3 patterns.
// Use with motion/react: <motion.div transition={transition.enterEmphasized} />

export const transition = {
  /** M3 Expressive enter — emphasized decelerate, short3 (150ms) */
  enterEmphasized: {
    duration: duration.short3,
    ease: [...easing.emphasizedDecelerate],
  },
  /** M3 Expressive exit — emphasized accelerate, short1 (75ms exit) */
  exitEmphasized: {
    duration: duration.short1,
    ease: [...easing.emphasizedAccelerate],
  },
  /** M3 standard enter — standard decelerate, short3 (150ms) */
  enterStandard: {
    duration: duration.short3,
    ease: [...easing.standard],
  },
  /** M3 standard exit — standard accelerate, short2 (100ms) */
  exitStandard: {
    duration: duration.short2,
    ease: [...easing.standardAccelerate],
  },
  /** Shape morph — standard easing, short4 (200ms) */
  shapeMorph: {
    duration: duration.short4,
    ease: [...easing.standard],
  },
  /** Elevation change — standard easing, short4 (200ms) */
  elevation: {
    duration: duration.short4,
    ease: [...easing.standard],
  },
  /** Reduced motion — instant */
  none: {
    duration: 0,
  },
} as const;

// ─── Scale factor for tooltip / fade animations ──────────────────────────────

export const SCALE_INITIAL = 0.8;

import { cn } from "./lib/utils";

export interface IconProps {
  /** Material Symbols icon name (e.g., "dashboard", "person", "settings") */
  name: string;
  /** Size in pixels. Defaults to 24 (M3 standard) */
  size?: 18 | 20 | 24 | 40 | 48;
  /** Additional classes */
  className?: string;
  /** Whether the icon is filled (default: false for outlined style) */
  filled?: boolean;
  /** Font weight for the icon (default: 400) */
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  /** Grade for emphasis: -25 (reduce), 0 (normal), 200 (high emphasis) */
  grade?: -25 | 0 | 200;
}

/**
 * Material Symbols icon component (M3 spec).
 * Uses the Material Symbols Rounded font variant (M3 default).
 *
 * Supports all Material Symbols variable font axes:
 * - FILL: 0 (outlined) or 1 (filled)
 * - wght: 100–700 (weight)
 * - GRAD: -25, 0, or 200 (grade/emphasis)
 * - opsz: optical size, auto-matched to icon size
 *
 * @see https://fonts.google.com/icons for available icon names
 */
export function Icon({
  name,
  size = 24,
  className,
  filled = false,
  weight = 400,
  grade = 0,
}: IconProps) {
  return (
    <span
      className={cn("material-symbols-rounded select-none", className)}
      style={{
        fontSize: `${size}px`,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${size}`,
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

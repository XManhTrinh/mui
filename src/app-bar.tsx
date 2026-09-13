"use client";

import * as React from "react";
import { cn } from "./lib/utils";

// ─── Context ──────────────────────────────────────────────────────────────────

export type AppBarVariant = "small" | "medium" | "large";

export type AppBarContextValue = {
  elevated: boolean;
  centered: boolean;
  variant: AppBarVariant;
  /** 0 = fully expanded, 1 = fully collapsed. Only meaningful for medium/large. */
  collapseFraction: number;
};

const AppBarContext = React.createContext<AppBarContextValue | null>(null);

/**
 * Hook to access AppBar context from within sub-components.
 * Throws if used outside an AppBar provider.
 */
export function useAppBar(): AppBarContextValue {
  const context = React.useContext(AppBarContext);
  if (!context) {
    throw new Error("useAppBar must be used within AppBar");
  }
  return context;
}

// ─── Constants ────────────────────────────────────────────────────────────────

/** Small app bar = 64dp (always). Also the collapsed height for medium/large. */
const SMALL_HEIGHT = 64;

/**
 * M3 Expressive expanded heights (dp), sourced from MDC Android + Compose material3.
 *
 * Medium flexible:
 *   - Without subtitle: 112dp
 *   - With subtitle:    136dp
 *
 * Large flexible:
 *   - Without subtitle: 152dp
 *   - With subtitle:    176dp
 */
const MEDIUM_EXPANDED_HEIGHT = 112;
const MEDIUM_EXPANDED_HEIGHT_SUBTITLE = 136;
const LARGE_EXPANDED_HEIGHT = 152;
const LARGE_EXPANDED_HEIGHT_SUBTITLE = 176;

// ─── Sub-Components ───────────────────────────────────────────────────────────

// --- AppBarLeading ---

export type AppBarLeadingProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

/**
 * AppBar leading icon slot — 48dp touch target wrapper.
 */
const AppBarLeading = React.forwardRef<HTMLDivElement, AppBarLeadingProps>(
  ({ className, children, ...props }, ref) => {
    if (!children) return null;
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center w-12 h-12 shrink-0 [&_svg]:size-6",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
AppBarLeading.displayName = "AppBarLeading";

// --- AppBarHeadline ---

export type AppBarHeadlineProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Optional subtitle text displayed below the headline */
  subtitle?: string;
  children?: React.ReactNode;
};

/**
 * AppBar headline slot — flex-1, title + optional subtitle.
 *
 * When used inside a `medium` or `large` variant AppBar, the headline
 * automatically adapts its typography based on `collapseFraction`:
 *   - Expanded: larger headline in the bottom row
 *   - Collapsed: Title Large (22px) in the top row (same as small variant)
 *
 * Consumers can also render AppBarHeadline directly for the small variant
 * or use it in the legacy prop API — it degrades gracefully.
 */
const AppBarHeadline = React.forwardRef<HTMLDivElement, AppBarHeadlineProps>(
  ({ className, subtitle, children, ...props }, ref) => {
    const { centered } = useAppBar();

    return (
      <div
        ref={ref}
        className={cn("flex-1 min-w-0 px-4", centered && "text-center", className)}
        {...props}
      >
        {typeof children === "string" ? (
          <h1 className="text-[22px] leading-7 font-normal text-surface-foreground truncate">
            {children}
          </h1>
        ) : (
          children
        )}
        {subtitle && (
          <p className="text-[12px] leading-4 font-medium tracking-[0.5px] text-surface-variant-foreground truncate">
            {subtitle}
          </p>
        )}
      </div>
    );
  }
);
AppBarHeadline.displayName = "AppBarHeadline";

// --- AppBarTrailing ---

export type AppBarTrailingProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

/**
 * AppBar trailing actions slot — wraps trailing icon buttons.
 */
const AppBarTrailing = React.forwardRef<HTMLDivElement, AppBarTrailingProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center shrink-0 [&_svg]:size-6", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
AppBarTrailing.displayName = "AppBarTrailing";

// ─── Dual-API Detection ──────────────────────────────────────────────────────

const COMPOUND_DISPLAY_NAMES = new Set([
  "AppBarLeading",
  "AppBarHeadline",
  "AppBarTrailing",
]);

function hasCompoundChildren(children: React.ReactNode): boolean {
  return React.Children.toArray(children).some(
    (child) =>
      React.isValidElement(child) &&
      typeof child.type !== "string" &&
      COMPOUND_DISPLAY_NAMES.has(
        (child.type as { displayName?: string }).displayName ?? ""
      )
  );
}

// ─── Typography helpers ───────────────────────────────────────────────────────

/**
 * M3 Expressive typography specs for app bar titles:
 *
 * Small (and collapsed state):
 *   Title Large — 22px / 28px / 400 weight
 *
 * Medium flexible expanded:
 *   Headline Small — 24px / 32px / 400 weight
 *
 * Large flexible expanded:
 *   Headline Medium — 28px / 36px / 400 weight
 *
 * Subtitles:
 *   Medium expanded subtitle: Title Large — 22px / 28px / 400 weight
 *   Large expanded subtitle:  Headline Small — 24px / 32px / 400 weight
 *   Collapsed subtitle:       Body Medium — 14px / 20px / 400 weight / 0.25px tracking
 */

/** Returns interpolated font size between two values. */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Clamp a value between min and max. */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// ─── Flexible App Bar (medium / large) ────────────────────────────────────────

type FlexibleAppBarInternalProps = {
  variant: "medium" | "large";
  leadingIcon?: React.ReactNode;
  headline?: React.ReactNode;
  subtitle?: string;
  trailingIcons?: React.ReactNode;
  elevated: boolean;
  centered: boolean;
  collapseFraction: number;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

/**
 * Internal flexible app bar renderer for medium/large variants.
 *
 * Layout:
 *   - Expanded: two rows
 *       Row 1 (64dp): [leading] ─── [trailing actions]
 *       Row 2 (variable): [headline + subtitle] with expanded typography
 *
 *   - Collapsed: single row (same as small variant)
 *       [leading] [headline + subtitle] [trailing actions]
 *
 *   - In between: height interpolates, headline cross-fades between
 *     expanded bottom row and collapsed inline positions.
 *
 * M3 Expressive colors:
 *   - Flat (collapseFraction < 1): surface
 *   - Scrolled (collapseFraction ≥ 1 or elevated): surface-container + elevation-1 shadow
 */
const FlexibleAppBarContent = React.forwardRef<
  HTMLElement,
  FlexibleAppBarInternalProps & React.HTMLAttributes<HTMLElement>
>(
  (
    {
      variant,
      leadingIcon,
      headline,
      subtitle,
      trailingIcons,
      elevated,
      centered,
      collapseFraction,
      className,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const fraction = clamp(collapseFraction, 0, 1);
    const hasSubtitle = Boolean(subtitle);
    const isComposable = hasCompoundChildren(children);

    // ── Heights ────────────────────────────────────────────────────────────
    const expandedHeight =
      variant === "medium"
        ? hasSubtitle
          ? MEDIUM_EXPANDED_HEIGHT_SUBTITLE
          : MEDIUM_EXPANDED_HEIGHT
        : hasSubtitle
          ? LARGE_EXPANDED_HEIGHT_SUBTITLE
          : LARGE_EXPANDED_HEIGHT;

    const currentHeight = lerp(expandedHeight, SMALL_HEIGHT, fraction);

    // ── Typography sizing (title) ──────────────────────────────────────────
    // Expanded title size → collapsed (Title Large 22px)
    const expandedTitleSize = variant === "medium" ? 24 : 28;
    const expandedTitleLineHeight = variant === "medium" ? 32 : 36;
    const collapsedTitleSize = 22;
    const collapsedTitleLineHeight = 28;

    const titleFontSize = lerp(expandedTitleSize, collapsedTitleSize, fraction);
    const titleLineHeight = lerp(expandedTitleLineHeight, collapsedTitleLineHeight, fraction);

    // ── Typography sizing (subtitle) ───────────────────────────────────────
    // Medium subtitle expanded: Title Large 22/28, Large subtitle expanded: Headline Small 24/32
    // Both collapse to Body Medium: 14/20 with 0.25px tracking
    const expandedSubtitleSize = variant === "medium" ? 22 : 24;
    const expandedSubtitleLineHeight = variant === "medium" ? 28 : 32;
    const collapsedSubtitleSize = 14;
    const collapsedSubtitleLineHeight = 20;

    const subtitleFontSize = lerp(expandedSubtitleSize, collapsedSubtitleSize, fraction);
    const subtitleLineHeight = lerp(
      expandedSubtitleLineHeight,
      collapsedSubtitleLineHeight,
      fraction
    );
    // Tracking interpolates from 0 to 0.25px
    const subtitleTracking = lerp(0, 0.25, fraction);

    // ── Expanded bottom row opacity (fades out as it collapses) ───────────
    const expandedOpacity = 1 - fraction;
    // ── Collapsed inline opacity (fades in as it collapses) ───────────────
    const collapsedOpacity = fraction;

    // ── Determine if we should show the scrolled (elevated) state ──────────
    const isScrolled = elevated || fraction > 0;

    // ── For composable API, extract children parts ─────────────────────────
    let composableLeading: React.ReactNode = null;
    let composableTrailing: React.ReactNode = null;
    let composableHeadline: React.ReactNode = null;

    if (isComposable) {
      React.Children.forEach(children, (child) => {
        if (!React.isValidElement(child) || typeof child.type === "string") return;
        const dn = (child.type as { displayName?: string }).displayName;
        if (dn === "AppBarLeading") composableLeading = child;
        else if (dn === "AppBarTrailing") composableTrailing = child;
        else if (dn === "AppBarHeadline") composableHeadline = child;
      });
    }

    // ── Resolve content slots ──────────────────────────────────────────────
    const resolvedLeading = isComposable ? composableLeading : leadingIcon;
    const resolvedTrailing = isComposable ? composableTrailing : trailingIcons;

    // For composable API, headline comes from AppBarHeadline children
    // For prop API, headline and subtitle come from props
    const resolvedHeadline = isComposable
      ? composableHeadline
        ? (composableHeadline as React.ReactElement<AppBarHeadlineProps>).props.children
        : null
      : headline;
    const resolvedSubtitle = isComposable
      ? composableHeadline
        ? (composableHeadline as React.ReactElement<AppBarHeadlineProps>).props.subtitle
        : undefined
      : subtitle;

    const headlineText =
      typeof resolvedHeadline === "string" ? resolvedHeadline : null;

    return (
      <header
        ref={ref}
        role="banner"
        className={cn(
          "overflow-hidden transition-[background-color,box-shadow] duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
          "bg-surface",
          isScrolled && "bg-surface-container shadow-[0_1px_3px_hsl(var(--elevation-2)),0_4px_8px_hsl(var(--elevation-2))]",
          className
        )}
        style={{
          height: `${currentHeight / 16}rem`,
          ...style,
        }}
        {...props}
      >
        {/* ── Row 1: navigation + trailing (always visible, 64dp) ──────── */}
        <div className="flex items-center h-16 px-1">
          {/* Leading */}
          {resolvedLeading && !isComposable && (
            <div className="flex items-center justify-center w-12 h-12 shrink-0 [&_svg]:size-6">
              {resolvedLeading}
            </div>
          )}
          {isComposable && resolvedLeading}

          {/* ── Collapsed inline headline (fades in) ───────────────────── */}
          <div
            className={cn(
              "flex-1 min-w-0 px-4 flex flex-col justify-center",
              centered && "text-center"
            )}
            style={{ opacity: collapsedOpacity }}
            aria-hidden={fraction < 0.5}
          >
            {headlineText ? (
              <h1
                className="font-normal text-surface-foreground truncate"
                style={{
                  fontSize: `${collapsedTitleSize}px`,
                  lineHeight: `${collapsedTitleLineHeight}px`,
                }}
              >
                {headlineText}
              </h1>
            ) : fraction > 0 && resolvedHeadline ? (
              <div className="truncate">{resolvedHeadline}</div>
            ) : null}
            {resolvedSubtitle && fraction > 0.5 && (
              <p
                className="font-normal text-surface-variant-foreground truncate"
                style={{
                  fontSize: `${collapsedSubtitleSize}px`,
                  lineHeight: `${collapsedSubtitleLineHeight}px`,
                  letterSpacing: "0.25px",
                }}
              >
                {resolvedSubtitle}
              </p>
            )}
          </div>

          {/* Trailing */}
          {resolvedTrailing && !isComposable && (
            <div className="flex items-center shrink-0 [&_svg]:size-6">
              {resolvedTrailing}
            </div>
          )}
          {isComposable && resolvedTrailing}
        </div>

        {/* ── Row 2: expanded headline area (fades out) ────────────────── */}
        <div
          className={cn(
            "px-4 pb-4",
            centered && "text-center"
          )}
          style={{ opacity: expandedOpacity }}
          aria-hidden={fraction >= 0.5}
        >
          {headlineText ? (
            <h1
              className="font-normal text-surface-foreground"
              style={{
                fontSize: `${titleFontSize}px`,
                lineHeight: `${titleLineHeight}px`,
              }}
            >
              {headlineText}
            </h1>
          ) : resolvedHeadline ? (
            <div>{resolvedHeadline}</div>
          ) : null}
          {resolvedSubtitle && (
            <p
              className="font-normal text-surface-variant-foreground mt-0.5"
              style={{
                fontSize: `${subtitleFontSize}px`,
                lineHeight: `${subtitleLineHeight}px`,
                letterSpacing: `${subtitleTracking}px`,
              }}
            >
              {resolvedSubtitle}
            </p>
          )}
        </div>
      </header>
    );
  }
);
FlexibleAppBarContent.displayName = "FlexibleAppBarContent";

// ─── App Bar (M3 Top App Bar) ─────────────────────────────────────────────────

export type AppBarProps = React.HTMLAttributes<HTMLElement> & {
  /**
   * App bar variant.
   *
   * - `"small"` (default) — fixed 64dp height, single row
   * - `"medium"` — collapsing, expanded 112dp (136dp with subtitle), Headline Small title
   * - `"large"` — collapsing, expanded 152dp (176dp with subtitle), Headline Medium title
   *
   * M3 Expressive renames: "medium flexible" → `"medium"`, "large flexible" → `"large"`.
   * The old non-flexible medium/large are deprecated in M3 Expressive.
   */
  variant?: AppBarVariant;
  /** Leading content (navigation icon button) — prop API */
  leadingIcon?: React.ReactNode;
  /** Headline text or element — prop API */
  headline?: React.ReactNode;
  /** Subtitle text — prop API */
  subtitle?: string;
  /** Trailing action elements (icon buttons) — prop API */
  trailingIcons?: React.ReactNode;
  /** Whether the bar has scroll elevation */
  elevated?: boolean;
  /** Center-aligned headline */
  centered?: boolean;
  /**
   * Collapse fraction for medium/large variants.
   *
   * - `0` = fully expanded (shows large headline in bottom row)
   * - `1` = fully collapsed (same as small variant)
   *
   * Consumer is responsible for computing this from scroll position.
   * Ignored for the `"small"` variant.
   *
   * @example
   * ```tsx
   * const fraction = Math.min(scrollY / 88, 1);
   * <AppBar variant="medium" collapseFraction={fraction} headline="Title" />
   * ```
   */
  collapseFraction?: number;
};

/**
 * Material Design 3 Expressive Top App Bar.
 *
 * Three variants:
 *
 * **Small** (default) — 64dp, single row with inline title.
 * **Medium flexible** — collapses from 112dp (136dp with subtitle) to 64dp.
 *   Expanded title: Headline Small (24/32). Collapsed: Title Large (22/28).
 * **Large flexible** — collapses from 152dp (176dp with subtitle) to 64dp.
 *   Expanded title: Headline Medium (28/36). Collapsed: Title Large (22/28).
 *
 * Supports both a composable compound API and a legacy prop-based API.
 *
 * @example Composable medium flexible
 * ```tsx
 * <AppBar variant="medium" collapseFraction={fraction} elevated={isScrolled}>
 *   <AppBar.Leading>
 *     <IconButton icon="arrow_back" aria-label="Back" />
 *   </AppBar.Leading>
 *   <AppBar.Headline subtitle="Section">Page Title</AppBar.Headline>
 *   <AppBar.Trailing>
 *     <IconButton icon="more_vert" aria-label="More" />
 *   </AppBar.Trailing>
 * </AppBar>
 * ```
 *
 * @example Prop-based large flexible
 * ```tsx
 * <AppBar
 *   variant="large"
 *   collapseFraction={fraction}
 *   leadingIcon={<IconButton icon="menu" aria-label="Menu" />}
 *   headline="Page Title"
 *   subtitle="Subtitle"
 *   trailingIcons={<IconButton icon="search" aria-label="Search" />}
 *   elevated={isScrolled}
 * />
 * ```
 *
 * Specs (m3.material.io/components/top-app-bar/specs):
 * - Small container height: 64dp
 * - Medium flexible expanded: 112dp (without subtitle), 136dp (with subtitle)
 * - Large flexible expanded: 152dp (without subtitle), 176dp (with subtitle)
 * - Collapsed height (all): 64dp
 * - Leading icon: 48dp touch target, 24dp icon
 * - Trailing icons: 48dp touch targets, 24dp icons
 * - Horizontal padding: 4dp to edge for icon touch targets
 * - Headline left padding: 16dp
 * - Flat: bg surface, no shadow
 * - On scroll (elevated): bg surface-container, subtle elevation
 */
const AppBarRoot = React.forwardRef<HTMLElement, AppBarProps>(
  (
    {
      className,
      variant = "small",
      leadingIcon,
      headline,
      subtitle,
      trailingIcons,
      elevated = false,
      centered = false,
      collapseFraction = 0,
      children,
      ...props
    },
    ref
  ) => {
    const contextValue = React.useMemo<AppBarContextValue>(
      () => ({ elevated, centered, variant, collapseFraction }),
      [elevated, centered, variant, collapseFraction]
    );

    // ── Medium / Large flexible variants ─────────────────────────────────
    if (variant === "medium" || variant === "large") {
      return (
        <AppBarContext.Provider value={contextValue}>
          <FlexibleAppBarContent
            ref={ref}
            variant={variant}
            leadingIcon={leadingIcon}
            headline={headline}
            subtitle={subtitle}
            trailingIcons={trailingIcons}
            elevated={elevated}
            centered={centered}
            collapseFraction={collapseFraction}
            className={className}
            {...props}
          >
            {children}
          </FlexibleAppBarContent>
        </AppBarContext.Provider>
      );
    }

    // ── Small variant (original behavior) ────────────────────────────────
    const isComposable = hasCompoundChildren(children);

    return (
      <AppBarContext.Provider value={contextValue}>
        <header
          ref={ref}
          role="banner"
          className={cn(
            "flex items-center h-16 px-1 transition-[background-color,box-shadow] duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
            "bg-surface",
            elevated &&
              "bg-surface-container shadow-[0_1px_3px_hsl(var(--elevation-2)),0_4px_8px_hsl(var(--elevation-2))]",
            className
          )}
          {...props}
        >
          {isComposable ? (
            children
          ) : (
            <>
              {/* Leading icon slot — 48dp touch target, 24dp icons */}
              {leadingIcon && (
                <div className="flex items-center justify-center w-12 h-12 shrink-0 [&_svg]:size-6">
                  {leadingIcon}
                </div>
              )}

              {/* Headline + subtitle */}
              {headline && (
                <div
                  className={cn(
                    "flex-1 min-w-0 px-4",
                    centered && "text-center"
                  )}
                >
                  {typeof headline === "string" ? (
                    <h1 className="text-[22px] leading-7 font-normal text-surface-foreground truncate">
                      {headline}
                    </h1>
                  ) : (
                    headline
                  )}
                  {subtitle && (
                    <p className="text-[12px] leading-4 font-medium tracking-[0.5px] text-surface-variant-foreground truncate">
                      {subtitle}
                    </p>
                  )}
                </div>
              )}

              {/* Fallback: children as flexible content when no headline */}
              {!headline && children && (
                <div className="flex-1 min-w-0 px-4 flex items-center">
                  {children}
                </div>
              )}

              {/* Trailing actions slot — 24dp icons */}
              {trailingIcons && (
                <div className="flex items-center shrink-0 [&_svg]:size-6">
                  {trailingIcons}
                </div>
              )}
            </>
          )}
        </header>
      </AppBarContext.Provider>
    );
  }
);
AppBarRoot.displayName = "AppBar";

// ─── Compound Component Export ────────────────────────────────────────────────

export const AppBar = Object.assign(AppBarRoot, {
  Leading: AppBarLeading,
  Headline: AppBarHeadline,
  Trailing: AppBarTrailing,
});

// ─── useAppBarCollapse hook ───────────────────────────────────────────────────

export type UseAppBarCollapseOptions = {
  /** App bar variant — determines the expanded height. */
  variant: "medium" | "large";
  /** Whether the app bar has a subtitle (affects expanded height). */
  hasSubtitle?: boolean;
};

export type UseAppBarCollapseReturn = {
  /** Current collapse fraction (0 = expanded, 1 = collapsed). */
  collapseFraction: number;
  /** Whether the content has been scrolled (for elevation). */
  isScrolled: boolean;
  /** Ref to attach to the scrollable container. */
  scrollRef: React.RefObject<HTMLElement | null>;
  /** Scroll event handler — attach to `onScroll` on the scrollable container. */
  onScroll: (e: React.UIEvent<HTMLElement>) => void;
};

/**
 * Convenience hook that computes `collapseFraction` from a scroll container.
 *
 * Attach `scrollRef` or `onScroll` to the scrollable element below the AppBar.
 * The hook returns `collapseFraction` and `isScrolled` for the AppBar props.
 *
 * @example
 * ```tsx
 * const { collapseFraction, isScrolled, onScroll } = useAppBarCollapse({
 *   variant: "medium",
 *   hasSubtitle: true,
 * });
 *
 * <AppBar variant="medium" collapseFraction={collapseFraction} elevated={isScrolled} headline="Title" subtitle="Sub" />
 * <div className="overflow-auto flex-1" onScroll={onScroll}>
 *   {content}
 * </div>
 * ```
 */
export function useAppBarCollapse({
  variant,
  hasSubtitle = false,
}: UseAppBarCollapseOptions): UseAppBarCollapseReturn {
  const [collapseFraction, setCollapseFraction] = React.useState(0);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const scrollRef = React.useRef<HTMLElement | null>(null);

  const expandedHeight =
    variant === "medium"
      ? hasSubtitle
        ? MEDIUM_EXPANDED_HEIGHT_SUBTITLE
        : MEDIUM_EXPANDED_HEIGHT
      : hasSubtitle
        ? LARGE_EXPANDED_HEIGHT_SUBTITLE
        : LARGE_EXPANDED_HEIGHT;

  // The scroll distance over which the bar fully collapses
  const collapseDistance = expandedHeight - SMALL_HEIGHT;

  const onScroll = React.useCallback(
    (e: React.UIEvent<HTMLElement>) => {
      const scrollTop = (e.target as HTMLElement).scrollTop;
      const fraction = clamp(scrollTop / collapseDistance, 0, 1);
      setCollapseFraction(fraction);
      setIsScrolled(scrollTop > 0);
    },
    [collapseDistance]
  );

  return { collapseFraction, isScrolled, scrollRef, onScroll };
}

// ─── PageBar (content-area section header) ────────────────────────────────────

export type PageBarProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Page-level section header for page titles + action buttons.
 * Not a global navigation bar — used within page content regions.
 *
 * M3 equivalent: Section header / content region header.
 * Height: 56px minimum, items vertically centered.
 */
const PageBar = React.forwardRef<HTMLDivElement, PageBarProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center min-h-14 gap-4", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
PageBar.displayName = "PageBar";

export { AppBarLeading, AppBarHeadline, AppBarTrailing, PageBar };

"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion } from "motion/react";

import { cn } from "./lib/utils";
import { Icon } from "./icon";

// ─── Internal context to communicate icon presence to children ─────────────────

const DialogIconContext = React.createContext<boolean>(false);

// ─── Overflow detection hook ──────────────────────────────────────────────────

/**
 * Detects whether a scrollable element's content overflows its visible area.
 * Uses ResizeObserver when available; falls back to showing dividers when
 * content exceeds a static height threshold (300px).
 */
function useOverflowDetection<T extends HTMLElement>(): {
  ref: React.RefObject<T | null>;
  isOverflowing: boolean;
} {
  const ref = React.useRef<T | null>(null);
  const [isOverflowing, setIsOverflowing] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const checkOverflow = () => {
      setIsOverflowing(element.scrollHeight > element.clientHeight);
    };

    // Check if ResizeObserver is supported
    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(() => {
        checkOverflow();
      });
      observer.observe(element);
      // Also observe children for content size changes
      for (const child of Array.from(element.children)) {
        observer.observe(child);
      }
      // Initial check
      checkOverflow();
      return () => observer.disconnect();
    } else {
      // Fallback: always show dividers if content exceeds a static threshold
      const fallbackCheck = () => {
        setIsOverflowing(element.scrollHeight > 300);
      };
      fallbackCheck();
      // Re-check on window resize
      window.addEventListener("resize", fallbackCheck);
      return () => window.removeEventListener("resize", fallbackCheck);
    }
  }, []);

  return { ref, isOverflowing };
}

/**
 * Material Design 3 Dialog
 *
 * @see https://m3.material.io/components/dialogs/specs
 *
 * Basic dialog:
 * - Container: surface-container-high, corner-extra-large (28px) radius
 * - Min 280dp, Max 560dp
 * - Section-specific padding (headline, content, actions)
 * - Title-to-body: 16dp gap
 * - Body-to-actions: 24dp gap
 * - Button gap: 8dp
 * - With icon: center-aligned
 * - Without icon: start-aligned
 * - Tonal elevation only (no drop shadow)
 *
 * Full-screen dialog:
 * - Container: 0dp radius, surface-container-high, no shadow
 * - Header: 56dp, close icon 24dp, Title Large typography
 * - Spring-based slide animation (stiffness ~300, damping ~25)
 * - Content padding: 24dp top/left/right, overflow-y scrolling
 * - Desktop fallback: centered dialog with corner-extra-large (28px) radius
 *
 * @m3-audit VERIFIED — DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription,
 * DialogClose, DialogTrigger all present. Uses Radix Dialog primitives. Complete per M3 anatomy.
 */

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

// ─── Scrim ────────────────────────────────────────────────────────────────────

/**
 * M3 Expressive scrim with spring-based physics motion via motion/react.
 * Open: spring fade-in (stiffness: 300, damping: 30, ~150ms settling)
 * Close: CSS spring-approximated fade-out (stiffness: 400, damping: 35, ~100ms settling)
 * CSS fallback for no-JS: transition: opacity 150ms ease-out
 */
const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay ref={ref} asChild {...props}>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className={cn(
        "fixed inset-0 z-50 bg-[hsl(var(--on-surface)/0.32)]",
        "pointer-events-auto",
        // CSS spring-approximated close animation (triggered by Radix data-state="closed")
        "m3-animate-overlay-spring-close",
        className
      )}
    />
  </DialogPrimitive.Overlay>
));
DialogOverlay.displayName = "DialogOverlay";

// ─── Content ──────────────────────────────────────────────────────────────────

/**
 * Spring parameters for M3 Expressive physics motion.
 * Full-screen dialog slide: stiffness ~300, damping ~25
 */
const M3_SPRING_FULLSCREEN = { stiffness: 300, damping: 25, mass: 1 };

const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    /** Full-screen on mobile (0dp radius, header + bottom bar) */
    fullScreen?: boolean;
    /** Hero icon above title (centers layout) */
    icon?: string;
    /** Show close X button (default: only on fullScreen) */
    showClose?: boolean;
    /** Alert dialog mode — prevents dismissal except via action buttons */
    alert?: boolean;
  }
>(({ className, children, fullScreen, icon, showClose, alert, ...props }, ref) => {
  const hasIcon = !!icon;
  const {
    onEscapeKeyDown,
    onPointerDownOutside,
    onInteractOutside,
    onOpenAutoFocus,
    ...restProps
  } = props;

  // Detect reduced motion for spring animations
  const [reducedMotion, setReducedMotion] = React.useState(false);
  React.useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Common alert event handlers
  const alertHandlers = {
    onEscapeKeyDown: (e: any) => {
      if (alert) e.preventDefault();
      onEscapeKeyDown?.(e);
    },
    onPointerDownOutside: (e: any) => {
      if (alert) e.preventDefault();
      onPointerDownOutside?.(e);
    },
    onInteractOutside: (e: any) => {
      if (alert) e.preventDefault();
      onInteractOutside?.(e);
    },
    onOpenAutoFocus: (e: any) => {
      if (alert) {
        e.preventDefault();
        // Move focus to the first focusable button in the dialog footer
        const content = e.currentTarget as HTMLElement;
        const footer = content.querySelector("[data-dialog-footer]");
        if (footer) {
          const firstButton = footer.querySelector<HTMLElement>(
            'button, [role="button"], a[href]'
          );
          if (firstButton) {
            firstButton.focus();
            return;
          }
        }
        // Fallback: find any button in the dialog
        const anyButton = content.querySelector<HTMLElement>(
          'button, [role="button"]'
        );
        anyButton?.focus();
      }
      onOpenAutoFocus?.(e);
    },
  };

  // ── Overflow detection for scrollable content (must be called unconditionally) ──
  const { ref: scrollRef, isOverflowing } = useOverflowDetection<HTMLDivElement>();

  // ── Full-screen variant: spring-based slide animation ──
  if (fullScreen) {
    return (
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          ref={ref}
          role={alert ? "alertdialog" : undefined}
          asChild
          {...alertHandlers}
          {...restProps}
        >
          <motion.div
            initial={reducedMotion ? false : { y: "100%" }}
            animate={{ y: 0 }}
            exit={reducedMotion ? undefined : { y: "100%" }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { type: "spring", ...M3_SPRING_FULLSCREEN }
            }
            className={cn(
              "fixed z-50",
              // ── Mobile: full viewport, 0dp radius, no shadow ──
              "inset-0 rounded-none flex flex-col",
              "bg-surface-container-high shadow-none",
              // ── Desktop (sm+): centered dialog fallback ──
              "sm:inset-auto sm:left-[50%] sm:top-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%]",
              "sm:w-full sm:min-w-70 sm:max-w-140 sm:max-h-[90vh]",
              "sm:rounded-[var(--corner-extra-large,28px)]",
              className
            )}
          >
            {/* ── Full-screen header: 56dp, close icon (24dp), Title Large ── */}
            <div className="flex items-center h-14 px-4 shrink-0 sm:hidden">
              <DialogPrimitive.Close className="flex items-center justify-center w-10 h-10 rounded-full cursor-pointer hover:bg-[hsl(var(--on-surface)/0.08)] transition-colors mr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <Icon name="close" size={24} className="text-on-surface" />
              </DialogPrimitive.Close>
            </div>

            {/* ── Content area: scrollable with proper padding ── */}
            <div className="flex-1 overflow-y-auto px-6 pt-6 sm:pt-0">
              {children}
            </div>
          </motion.div>
        </DialogPrimitive.Content>
      </DialogPortal>
    );
  }

  // ── Separate children into header, footer, and body content ──
  const childArray = React.Children.toArray(children);
  let headerElement: React.ReactNode = null;
  let footerElement: React.ReactNode = null;
  const bodyElements: React.ReactNode[] = [];

  childArray.forEach((child) => {
    if (React.isValidElement(child)) {
      const displayName =
        (child.type as any)?.displayName || (child.type as any)?.name || "";
      if (displayName === "DialogHeader") {
        headerElement = child;
      } else if (displayName === "DialogFooter") {
        footerElement = child;
      } else {
        bodyElements.push(child);
      }
    } else {
      bodyElements.push(child);
    }
  });

  // ── Basic / Icon variant ──
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        role={alert ? "alertdialog" : undefined}
        {...alertHandlers}
        className={cn(
          "fixed z-50",
          "duration-200",
          "left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]",
          "w-[calc(100%-2rem)] sm:w-full",
          "min-w-[280px] max-w-[560px]",
          "max-h-[90vh]",
          "flex flex-col",
          "rounded-[var(--corner-extra-large,28px)] bg-surface-container-high shadow-none",
          "m3-animate-dialog",
          className
        )}
        {...restProps}
      >
        <DialogIconContext.Provider value={hasIcon}>
          {/* ── Hero icon (basic with icon) ── */}
          {hasIcon && (
            <div className="flex justify-center pt-[6px] px-6 pb-4 shrink-0">
              <Icon name={icon} size={24} className="text-secondary" />
            </div>
          )}

          {/* ── Header section (fixed, not scrollable) ── */}
          {headerElement && (
            <div className="shrink-0">
              {headerElement}
            </div>
          )}

          {/* ── Top divider (visible when content overflows) ── */}
          {isOverflowing && (
            <div className="shrink-0 border-b border-outline-variant" />
          )}

          {/* ── Scrollable content area ── */}
          <div
            ref={scrollRef}
            className={cn(
              "min-h-0 flex-1 overflow-y-auto",
              bodyElements.length > 0 && "px-6"
            )}
          >
            {bodyElements.length > 0 ? bodyElements : (!headerElement && !footerElement) && children}
          </div>

          {/* ── Bottom divider (visible when content overflows) ── */}
          {isOverflowing && (
            <div className="shrink-0 border-t border-outline-variant" />
          )}

          {/* ── Footer section (fixed, not scrollable) ── */}
          {footerElement && (
            <div className="shrink-0">
              {footerElement}
            </div>
          )}

          {/* ── Close button (opt-in for basic) ── */}
          {showClose && (
            <DialogPrimitive.Close className="absolute right-4 top-4 flex items-center justify-center w-10 h-10 rounded-full text-surface-variant-foreground cursor-pointer hover:bg-[hsl(var(--on-surface)/0.08)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <Icon name="close" size={20} />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </DialogIconContext.Provider>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = "DialogContent";

// ─── Header (title + description) ────────────────────────────────────────────

const DialogHeader = ({
  className,
  centered,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { centered?: boolean }) => {
  const hasIcon = React.useContext(DialogIconContext);
  const isCentered = centered ?? hasIcon;

  return (
    <div
      className={cn(
        "flex flex-col px-6 pb-[13px]",
        // When icon is present, the 16dp gap is handled by the icon's pb-4;
        // when no icon, apply the M3 headline section top padding
        !hasIcon && "pt-[6px]",
        isCentered && "items-center text-center",
        className
      )}
      {...props}
    />
  );
};
DialogHeader.displayName = "DialogHeader";

// ─── Footer (action buttons) ─────────────────────────────────────────────────

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-dialog-footer=""
    className={cn("flex justify-end gap-2 pt-4 px-6 pb-6", className)}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

// ─── Title: Headline Small (24px/32px) ───────────────────────────────────────

const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-[24px] leading-8 font-normal text-surface-foreground", className)}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

// ─── Description: Body Medium (14px/20px) ────────────────────────────────────

const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("pt-5 text-[14px] leading-5 font-normal tracking-[0.25px] text-surface-variant-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};

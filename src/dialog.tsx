"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "./lib/utils";
import { Icon } from "./icon";

/**
 * Material Design 3 Dialog
 *
 * @see https://m3.material.io/components/dialogs/specs
 *
 * Basic dialog:
 * - Container: surface-container-high, 28dp radius
 * - Min 280dp, Max 560dp
 * - Padding: 24dp all sides
 * - Title-to-body: 16dp gap
 * - Body-to-actions: 24dp gap
 * - Button gap: 8dp
 * - With icon: center-aligned
 * - Without icon: start-aligned
 *
 * Full-screen dialog:
 * - Container: 0dp radius, surface-container-high
 * - Header: 56dp, close icon 24dp, start-aligned headline
 * - Bottom action bar: 56dp
 * - Content padding: 24dp top/left/right
 * - Element gap: 8dp
 */

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

// ─── Scrim ────────────────────────────────────────────────────────────────────

const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-[hsl(var(--on-surface)/0.32)]",
      "m3-animate-overlay",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

// ─── Content ──────────────────────────────────────────────────────────────────

const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    /** Full-screen on mobile (0dp radius, header + bottom bar) */
    fullScreen?: boolean;
    /** Hero icon above title (centers layout) */
    icon?: string;
    /** Show close X button (default: only on fullScreen) */
    showClose?: boolean;
  }
>(({ className, children, fullScreen, icon, showClose, ...props }, ref) => {
  const hasIcon = !!icon;

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50",
          "duration-200",

          // ── Full-screen ──
          fullScreen && [
            "inset-0 rounded-none flex flex-col",
            "bg-surface-container-high",
            "m3-animate-dialog-fullscreen",
            // Desktop: fall back to centered dialog
            "sm:inset-auto sm:left-[50%] sm:top-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%]",
            "sm:w-full sm:max-w-140 sm:max-h-[90vh] sm:rounded-3xl",
          ],

          // ── Basic / Icon ──
          !fullScreen && [
            "left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]",
            "w-[calc(100%-2rem)] sm:w-full",
            "min-w-70 max-w-140",
            "rounded-3xl bg-surface-container-high p-6",
            "shadow-[0_6px_12px_var(--elevation-4),0_2px_4px_var(--elevation-4)]",
            "m3-animate-dialog",
          ],

          className
        )}
        {...props}
      >
        {/* ── Full-screen header: 56dp, close icon, start-aligned ── */}
        {fullScreen && (
          <div className="flex items-center h-14 px-6 shrink-0 border-b border-outline-variant sm:hidden">
            <DialogPrimitive.Close className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-foreground/[0.08] transition-colors -ml-2 mr-3">
              <Icon name="close" size={24} className="text-foreground" />
            </DialogPrimitive.Close>
          </div>
        )}

        {/* ── Hero icon (basic with icon) ── */}
        {hasIcon && !fullScreen && (
          <div className="flex justify-center mb-4">
            <Icon name={icon} size={24} className="text-secondary" />
          </div>
        )}

        {/* ── Children (content area) ── */}
        {fullScreen ? (
          <div className="flex-1 overflow-y-auto px-6 pt-6 pb-6 sm:p-0">
            {children}
          </div>
        ) : (
          children
        )}

        {/* ── Full-screen bottom action bar: 56dp ── */}
        {fullScreen && (
          <div className="flex items-center justify-end h-14 px-6 shrink-0 border-t border-outline-variant sm:hidden" />
        )}

        {/* ── Close button (opt-in for basic, auto for fullscreen desktop) ── */}
        {showClose && !fullScreen && (
          <DialogPrimitive.Close className="absolute right-4 top-4 flex items-center justify-center w-10 h-10 rounded-full text-surface-variant-foreground hover:bg-surface-foreground/[0.08] transition-colors focus:outline-none focus:ring-2 focus:ring-primary">
            <Icon name="close" size={20} />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
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
}: React.HTMLAttributes<HTMLDivElement> & { centered?: boolean }) => (
  <div
    className={cn(
      "flex flex-col gap-4",
      centered && "items-center text-center",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

// ─── Footer (action buttons) ─────────────────────────────────────────────────

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex justify-end gap-2 pt-6", className)}
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
    className={cn("text-[24px] leading-8 font-normal text-foreground", className)}
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
    className={cn("text-[14px] leading-5 text-surface-variant-foreground", className)}
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

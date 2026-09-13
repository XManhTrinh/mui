"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion } from "motion/react";

import { cn } from "../lib/utils";
import { Icon } from "../icon";
import { IconButton } from "../buttons/icon-button";
import { Button } from "../buttons/button";
import { spring } from "../lib/motion";

// ─── Types ──────────────────────────────────────────────────────────────────

export type DateRange = {
  /** Range start (inclusive) */
  start: Date | null;
  /** Range end (inclusive) */
  end: Date | null;
};

export type DatePickerProps = {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  min?: Date;
  max?: Date;
  disabled?: boolean;
  className?: string;
};

// ─── Date utilities ──────────────────────────────────────────────────────────

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/** Strip time; returns a date at local midnight. */
function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isDateDisabled(date: Date, min?: Date, max?: Date): boolean {
  if (min && date < startOfDay(min)) return true;
  if (max && date > startOfDay(max)) return true;
  return false;
}

/** Is `date` strictly between start and end (exclusive of endpoints)? */
function isInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const t = startOfDay(date).getTime();
  return t > startOfDay(start).getTime() && t < startOfDay(end).getTime();
}

/** Short headline like "Mon, Aug 17". */
function formatHeadline(date: Date | null): string {
  if (!date) return "";
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// ─── Calendar cell model ──────────────────────────────────────────────────────

type CalendarCell = {
  day: number;
  month: "prev" | "current" | "next";
  date: Date;
};

function buildCells(viewYear: number, viewMonth: number): CalendarCell[] {
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const prevMonthDays = getDaysInMonth(viewYear, viewMonth - 1);
  const cells: CalendarCell[] = [];

  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const m = viewMonth === 0 ? 11 : viewMonth - 1;
    const y = viewMonth === 0 ? viewYear - 1 : viewYear;
    cells.push({ day, month: "prev", date: new Date(y, m, day) });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ day, month: "current", date: new Date(viewYear, viewMonth, day) });
  }

  // Next month leading days to fill remaining cells (up to 42 = 6 rows)
  const remaining = 42 - cells.length;
  for (let day = 1; day <= remaining; day++) {
    const m = viewMonth === 11 ? 0 : viewMonth + 1;
    const y = viewMonth === 11 ? viewYear + 1 : viewYear;
    cells.push({ day, month: "next", date: new Date(y, m, day) });
  }

  return cells;
}

// ─── Shared calendar view ─────────────────────────────────────────────────────

type CalendarViewProps = {
  /** Selection mode */
  mode: "single" | "range";
  /** Single-date selection (mode="single") */
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  /** Range selection (mode="range") */
  rangeValue?: DateRange;
  onRangeChange?: (range: DateRange) => void;
  min?: Date;
  max?: Date;
  disabled?: boolean;
  className?: string;
};

/**
 * The month grid + year selector. Shared by the docked DatePicker and the
 * modal DatePickerModal. Handles both single and range selection.
 */
function CalendarView({
  mode,
  value,
  onChange,
  rangeValue,
  onRangeChange,
  min,
  max,
  disabled = false,
  className,
}: CalendarViewProps) {
  const today = new Date();

  // Initial view derives from the current selection or today.
  const initialDate =
    (mode === "range" ? rangeValue?.start : value) ?? today;

  const [viewYear, setViewYear] = React.useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = React.useState(initialDate.getMonth());
  const [viewMode, setViewMode] = React.useState<"calendar" | "year">("calendar");
  // Hovered date while completing a range (for preview highlighting)
  const [hoverDate, setHoverDate] = React.useState<Date | null>(null);

  // Navigate the calendar to the selected date's month when it changes
  // externally (e.g. a controlled value updated outside the picker).
  const selectedDate = mode === "range" ? rangeValue?.start ?? null : value ?? null;
  const selectedTime = selectedDate ? selectedDate.getTime() : null;
  React.useEffect(() => {
    if (selectedTime === null) return;
    const d = new Date(selectedTime);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }, [selectedTime]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  // ── Swipe between months ────────────────────────────────────────
  const swipeStart = React.useRef<{ x: number; y: number } | null>(null);

  const handleSwipeStart = (e: React.PointerEvent) => {
    swipeStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleSwipeEnd = (e: React.PointerEvent) => {
    if (!swipeStart.current) return;
    const dx = e.clientX - swipeStart.current.x;
    const dy = e.clientY - swipeStart.current.y;
    swipeStart.current = null;
    // Only count horizontal swipes (dx > 50px, mostly horizontal)
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) handleNextMonth();
      else handlePrevMonth();
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleYearSelect = (year: number) => {
    setViewYear(year);
    setViewMode("calendar");
  };

  const handleSelect = (date: Date) => {
    if (disabled || isDateDisabled(date, min, max)) return;

    if (mode === "single") {
      onChange?.(date);
      return;
    }

    // Range mode
    const { start, end } = rangeValue ?? { start: null, end: null };
    if (!start || (start && end)) {
      // Begin a new range
      onRangeChange?.({ start: date, end: null });
    } else {
      // Complete the range; order the two endpoints
      if (date.getTime() < start.getTime()) {
        onRangeChange?.({ start: date, end: start });
      } else {
        onRangeChange?.({ start, end: date });
      }
      setHoverDate(null);
    }
  };

  // Year range for the year picker (±12 years from current view)
  const years: number[] = [];
  for (let y = viewYear - 12; y <= viewYear + 12; y++) years.push(y);

  const cells = buildCells(viewYear, viewMonth);

  // For range preview: the effective end is the hovered date when only start is set.
  const rangeStart = mode === "range" ? rangeValue?.start ?? null : null;
  const rangeEnd =
    mode === "range"
      ? rangeValue?.end ?? (rangeValue?.start && hoverDate ? hoverDate : null)
      : null;
  // Order endpoints so the band renders correctly during preview.
  const [bandStart, bandEnd] =
    rangeStart && rangeEnd && rangeEnd.getTime() < rangeStart.getTime()
      ? [rangeEnd, rangeStart]
      : [rangeStart, rangeEnd];

  const isEndpoint = (date: Date): boolean => {
    if (mode === "single") return value ? isSameDay(date, value) : false;
    return (
      (!!rangeValue?.start && isSameDay(date, rangeValue.start)) ||
      (!!rangeValue?.end && isSameDay(date, rangeValue.end))
    );
  };

  return (
    <div
      className={cn(
        "w-80 px-4 py-3",
        disabled && "opacity-[0.38] pointer-events-none cursor-not-allowed",
        className
      )}
    >
      {/* Header with month/year and navigation */}
      <div className="flex h-12 items-center justify-between">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setViewMode(viewMode === "year" ? "calendar" : "year")}
          aria-label="Select year"
          className="inline-flex items-center gap-1 text-[14px] font-medium leading-5 text-surface-foreground cursor-pointer hover:text-primary transition-colors duration-100"
        >
          {MONTH_NAMES[viewMonth]} {viewYear}
          <Icon name={viewMode === "year" ? "arrow_drop_up" : "arrow_drop_down"} size={18} />
        </button>
        {viewMode === "calendar" && (
          <div className="flex items-center gap-1">
            <IconButton
              variant="standard"
              size="xs"
              shape="round"
              aria-label="Previous month"
              onClick={handlePrevMonth}
            >
              <Icon name="chevron_left" size={20} />
            </IconButton>
            <IconButton
              variant="standard"
              size="xs"
              shape="round"
              aria-label="Next month"
              onClick={handleNextMonth}
            >
              <Icon name="chevron_right" size={20} />
            </IconButton>
          </div>
        )}
      </div>

      {viewMode === "year" ? (
        /* Year selection grid */
        <div className="grid grid-cols-3 gap-1 py-2 max-h-70 overflow-y-auto">
          {years.map((year) => {
            const isCurrentYear = year === viewYear;
            const isTodayYear = year === today.getFullYear();
            return (
              <button
                key={year}
                type="button"
                disabled={disabled}
                onClick={() => handleYearSelect(year)}
                className={cn(
                  "flex h-10 items-center justify-center rounded-full text-[14px] font-normal cursor-pointer",
                  "transition-colors duration-100 outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isCurrentYear && "bg-primary text-primary-foreground",
                  !isCurrentYear && isTodayYear && "text-primary border border-primary",
                  !isCurrentYear &&
                    !isTodayYear &&
                    "text-surface-foreground hover:bg-[hsl(var(--on-surface)/0.08)]"
                )}
                aria-selected={isCurrentYear}
              >
                {year}
              </button>
            );
          })}
        </div>
      ) : (
        <>
          {/* Weekday labels */}
          <div className="grid h-8 grid-cols-7 items-center">
            {WEEKDAYS.map((day, i) => (
              <span
                key={i}
                className="text-center text-[12px] font-medium text-surface-variant-foreground"
              >
                {day}
              </span>
            ))}
          </div>

          {/* Date grid */}
          <div
            className="grid grid-cols-7 touch-pan-y"
            onPointerDown={handleSwipeStart}
            onPointerUp={handleSwipeEnd}
          >
            {cells.map((cell, i) => {
              const selected = isEndpoint(cell.date);
              const isTodayDate = isToday(cell.date);
              const isOutside = cell.month !== "current";
              const cellDisabled = isDateDisabled(cell.date, min, max);
              const inBand = mode === "range" && isInRange(cell.date, bandStart, bandEnd);

              // An endpoint that has a counterpart on the other side gets a half
              // band extending inward, so the connecting band reads continuously.
              const isBandStartEndpoint =
                mode === "range" &&
                !!bandStart &&
                !!bandEnd &&
                !isSameDay(bandStart, bandEnd) &&
                isSameDay(cell.date, bandStart) &&
                !isOutside;
              const isBandEndEndpoint =
                mode === "range" &&
                !!bandStart &&
                !!bandEnd &&
                !isSameDay(bandStart, bandEnd) &&
                isSameDay(cell.date, bandEnd) &&
                !isOutside;

              return (
                <div
                  key={i}
                  className={cn(
                    "relative flex h-10 items-center justify-center",
                    // In-range band: secondary-container behind the cell
                    inBand && "bg-secondary-container"
                  )}
                >
                  {/* Half band on endpoints so the range connects visually */}
                  {(isBandStartEndpoint || isBandEndEndpoint) && (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-y-0 w-1/2 bg-secondary-container",
                        // start endpoint's band extends toward the end side; vice versa
                        isBandStartEndpoint ? "inset-e-0" : "inset-s-0"
                      )}
                    />
                  )}
                  <button
                    type="button"
                    disabled={cellDisabled || disabled}
                    onClick={() => {
                      if (!isOutside) {
                        handleSelect(cell.date);
                      } else if (cell.month === "prev") {
                        handlePrevMonth();
                      } else {
                        handleNextMonth();
                      }
                    }}
                    onMouseEnter={() => {
                      if (mode === "range" && rangeValue?.start && !rangeValue?.end) {
                        setHoverDate(cell.date);
                      }
                    }}
                    className={cn(
                      "relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-[14px] font-normal cursor-pointer",
                      "transition-colors duration-100 outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      // Base states
                      !selected &&
                        !isOutside &&
                        !inBand &&
                        "text-surface-foreground hover:bg-[hsl(var(--on-surface)/0.08)] focus-visible:bg-[hsl(var(--on-surface)/0.10)] active:bg-[hsl(var(--on-surface)/0.10)]",
                      // In-range (not endpoint): on-secondary-container text over the band
                      inBand &&
                        !selected &&
                        "text-secondary-container-foreground hover:bg-[hsl(var(--on-secondary-container)/0.08)]",
                      // Outside month
                      isOutside && "text-surface-variant-foreground/50",
                      // Today (not selected)
                      isTodayDate && !selected && "text-primary border border-primary",
                      // Selected endpoint
                      selected && "bg-primary text-primary-foreground hover:bg-primary/90",
                      // Disabled
                      cellDisabled && "opacity-[0.38] pointer-events-none cursor-not-allowed"
                    )}
                    aria-label={cell.date.toLocaleDateString()}
                    aria-selected={selected}
                    aria-current={isTodayDate ? "date" : undefined}
                  >
                    {cell.day}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ─── DatePicker (docked / inline, single date) ────────────────────────────────

/**
 * Material Design 3 docked date picker — an inline calendar for selecting a
 * single date. For a modal experience or range selection, use DatePickerModal.
 *
 * @see https://m3.material.io/components/date-pickers/specs
 */
export function DatePicker({ value, onChange, min, max, disabled = false, className }: DatePickerProps) {
  return (
    <div className={cn("rounded-[28px] bg-surface-container-high", className)}>
      <CalendarView
        mode="single"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        disabled={disabled}
      />
    </div>
  );
}
DatePicker.displayName = "DatePicker";

// ─── DatePickerModal (modal, single or range) ─────────────────────────────────

export type DatePickerModalProps = {
  /** Controlled open state */
  open: boolean;
  /** Open state change callback */
  onOpenChange: (open: boolean) => void;
  /** Selection mode (default: "single") */
  mode?: "single" | "range";
  /** Single-date value (mode="single") */
  value?: Date | null;
  /** Range value (mode="range") */
  rangeValue?: DateRange;
  /** Confirm callback — fired when OK is pressed with the current selection */
  onConfirm?: (selection: Date | null | DateRange) => void;
  min?: Date;
  max?: Date;
  /** Header supporting text (default: "Select date" / "Select range") */
  supportingText?: string;
  /** Confirm button label (default: "OK") */
  confirmLabel?: string;
  /** Cancel button label (default: "Cancel") */
  cancelLabel?: string;
  className?: string;
};

/**
 * Material Design 3 modal date picker. Presents the calendar in a modal dialog
 * with a header (supporting text + selected-date headline) and Cancel/OK
 * actions. Supports single-date and date-range selection.
 *
 * Selection is staged internally and only committed via onConfirm when OK is
 * pressed, so Cancel discards in-progress edits.
 *
 * @see https://m3.material.io/components/date-pickers/specs
 */
export function DatePickerModal({
  open,
  onOpenChange,
  mode = "single",
  value,
  rangeValue,
  onConfirm,
  min,
  max,
  supportingText,
  confirmLabel = "OK",
  cancelLabel = "Cancel",
  className,
}: DatePickerModalProps) {
  // Stage the selection locally; commit on OK, discard on Cancel.
  const [draftDate, setDraftDate] = React.useState<Date | null>(value ?? null);
  const [draftRange, setDraftRange] = React.useState<DateRange>(
    rangeValue ?? { start: null, end: null }
  );

  // Re-sync the draft whenever the dialog (re)opens.
  React.useEffect(() => {
    if (open) {
      setDraftDate(value ?? null);
      setDraftRange(rangeValue ?? { start: null, end: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const [reducedMotion, setReducedMotion] = React.useState(false);
  React.useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const resolvedSupporting =
    supportingText ?? (mode === "range" ? "Select range" : "Select date");

  const headline =
    mode === "range"
      ? draftRange.start
        ? draftRange.end
          ? `${formatHeadline(draftRange.start)} – ${formatHeadline(draftRange.end)}`
          : formatHeadline(draftRange.start)
        : "Start date"
      : draftDate
        ? formatHeadline(draftDate)
        : "Select date";

  // OK is enabled once the selection is complete.
  const canConfirm =
    mode === "range" ? !!(draftRange.start && draftRange.end) : draftDate != null;

  const handleConfirm = () => {
    onConfirm?.(mode === "range" ? draftRange : draftDate);
    onOpenChange(false);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "spring", ...spring.defaultEffects }}
            className="fixed inset-0 z-50 bg-[hsl(var(--on-surface)/0.32)] m3-animate-overlay-spring-close"
          />
        </DialogPrimitive.Overlay>
        <DialogPrimitive.Content asChild aria-label={resolvedSupporting}>
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0, scale: 0.9 }}
            transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 30, mass: 1 }}
            className={cn(
              "fixed z-50 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]",
              "flex flex-col overflow-hidden rounded-[28px] bg-surface-container-high shadow-none",
              "max-h-[90vh]",
              className
            )}
          >
            {/* Header: supporting text + selected-date headline */}
            <div className="flex flex-col gap-1 px-6 pt-4 pb-3">
              <span className="text-[12px] font-medium leading-4 tracking-[0.5px] text-surface-variant-foreground">
                {resolvedSupporting}
              </span>
              <DialogPrimitive.Title className="text-[32px] leading-10 font-normal text-surface-foreground">
                {headline}
              </DialogPrimitive.Title>
            </div>

            <div className="h-px shrink-0 bg-outline-variant" aria-hidden="true" />

            {/* Calendar */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              <CalendarView
                mode={mode}
                value={draftDate}
                onChange={setDraftDate}
                rangeValue={draftRange}
                onRangeChange={setDraftRange}
                min={min}
                max={max}
              />
            </div>

            {/* Actions: Cancel / OK (text buttons per M3) */}
            <div className="flex justify-end gap-2 px-6 pb-4 pt-2">
              <Button variant="text" onClick={() => onOpenChange(false)}>
                {cancelLabel}
              </Button>
              <Button variant="text" disabled={!canConfirm} onClick={handleConfirm}>
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
DatePickerModal.displayName = "DatePickerModal";

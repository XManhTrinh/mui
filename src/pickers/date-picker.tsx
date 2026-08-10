"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { Icon } from "../icon";
import { IconButton } from "../buttons/icon-button";

export interface DatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  min?: Date;
  max?: Date;
  disabled?: boolean;
  className?: string;
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

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

function isDateDisabled(date: Date, min?: Date, max?: Date): boolean {
  if (min && date < new Date(min.getFullYear(), min.getMonth(), min.getDate())) {
    return true;
  }
  if (max && date > new Date(max.getFullYear(), max.getMonth(), max.getDate())) {
    return true;
  }
  return false;
}

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

export function DatePicker({
  value,
  onChange,
  min,
  max,
  disabled = false,
  className,
}: DatePickerProps) {
  const today = new Date();
  const initialDate = value ?? today;

  const [viewYear, setViewYear] = React.useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = React.useState(initialDate.getMonth());
  const [mode, setMode] = React.useState<"calendar" | "year">("calendar");

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  // Previous month days to fill the first row
  const prevMonthDays = getDaysInMonth(viewYear, viewMonth - 1);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleDateClick = (day: number) => {
    if (disabled) return;
    const selected = new Date(viewYear, viewMonth, day);
    if (isDateDisabled(selected, min, max)) return;
    onChange?.(selected);
  };

  const handleYearSelect = (year: number) => {
    setViewYear(year);
    setMode("calendar");
  };

  // Generate year range for year picker (±12 years from current view)
  const yearRangeStart = viewYear - 12;
  const yearRangeEnd = viewYear + 12;
  const years: number[] = [];
  for (let y = yearRangeStart; y <= yearRangeEnd; y++) {
    years.push(y);
  }

  // Build calendar grid
  const cells: Array<{
    day: number;
    month: "prev" | "current" | "next";
    date: Date;
  }> = [];

  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const m = viewMonth === 0 ? 11 : viewMonth - 1;
    const y = viewMonth === 0 ? viewYear - 1 : viewYear;
    cells.push({ day, month: "prev", date: new Date(y, m, day) });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({
      day,
      month: "current",
      date: new Date(viewYear, viewMonth, day),
    });
  }

  // Next month leading days to fill remaining cells (up to 42 = 6 rows)
  const remaining = 42 - cells.length;
  for (let day = 1; day <= remaining; day++) {
    const m = viewMonth === 11 ? 0 : viewMonth + 1;
    const y = viewMonth === 11 ? viewYear + 1 : viewYear;
    cells.push({ day, month: "next", date: new Date(y, m, day) });
  }

  return (
    <div
      className={cn(
        "w-[320px] rounded-[28px] bg-surface-container-high px-4 py-3",
        disabled && "opacity-[0.38] pointer-events-none cursor-not-allowed",
        className
      )}
    >
      {/* Header with month/year and navigation */}
      <div className="flex h-12 items-center justify-between">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setMode(mode === "year" ? "calendar" : "year")}
          aria-label="Select year"
          className="inline-flex items-center gap-1 text-[14px] font-medium leading-5 text-surface-foreground cursor-pointer hover:text-primary transition-colors duration-100"
        >
          {MONTH_NAMES[viewMonth]} {viewYear}
          <Icon
            name={mode === "year" ? "arrow_drop_up" : "arrow_drop_down"}
            size={18}
          />
        </button>
        {mode === "calendar" && (
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

      {mode === "year" ? (
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
                  isCurrentYear &&
                    "bg-primary text-primary-foreground",
                  !isCurrentYear &&
                    isTodayYear &&
                    "text-primary border border-primary",
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
          <div className="grid grid-cols-7">
            {cells.map((cell, i) => {
              const isSelected = value ? isSameDay(cell.date, value) : false;
              const isTodayDate = isToday(cell.date);
              const isOutside = cell.month !== "current";
              const isDisabled = isDateDisabled(cell.date, min, max);

              return (
                <button
                  key={i}
                  type="button"
                  disabled={isDisabled || disabled}
                  onClick={() => {
                    if (!isOutside) {
                      handleDateClick(cell.day);
                    } else if (cell.month === "prev") {
                      handlePrevMonth();
                    } else {
                      handleNextMonth();
                    }
                  }}
                  className={cn(
                    "relative flex h-10 w-10 items-center justify-center rounded-full text-[14px] font-normal cursor-pointer",
                    "transition-colors duration-100 outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    // Base states
                    !isSelected &&
                      !isOutside &&
                      "text-surface-foreground hover:bg-[hsl(var(--on-surface)/0.08)] focus-visible:bg-[hsl(var(--on-surface)/0.10)] active:bg-[hsl(var(--on-surface)/0.10)]",
                    // Outside month
                    isOutside && "text-surface-variant-foreground/50",
                    // Today (not selected)
                    isTodayDate &&
                      !isSelected &&
                      "text-primary border border-primary",
                    // Selected
                    isSelected &&
                      "bg-primary text-primary-foreground hover:bg-primary/90",
                    // Disabled
                    isDisabled && "opacity-[0.38] pointer-events-none cursor-not-allowed"
                  )}
                  aria-label={cell.date.toLocaleDateString()}
                  aria-selected={isSelected}
                  aria-current={isTodayDate ? "date" : undefined}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

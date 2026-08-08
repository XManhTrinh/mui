"use client";

import * as React from "react";
import { cn } from "../lib/utils";

export interface TimePickerProps {
  value?: { hours: number; minutes: number } | null;
  onChange?: (time: { hours: number; minutes: number } | null) => void;
  format?: "12h" | "24h";
  disabled?: boolean;
  className?: string;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function TimePicker({
  value,
  onChange,
  format = "12h",
  disabled = false,
  className,
}: TimePickerProps) {
  const is12h = format === "12h";

  // Determine period from value
  const getPeriod = (): "AM" | "PM" => {
    if (!value) return "AM";
    return value.hours >= 12 ? "PM" : "AM";
  };

  const [period, setPeriod] = React.useState<"AM" | "PM">(getPeriod);

  // Get display hours based on format
  const getDisplayHours = (): string => {
    if (!value) return "";
    if (is12h) {
      const h = value.hours % 12;
      return String(h === 0 ? 12 : h).padStart(2, "0");
    }
    return String(value.hours).padStart(2, "0");
  };

  const getDisplayMinutes = (): string => {
    if (!value) return "";
    return String(value.minutes).padStart(2, "0");
  };

  const [hourInput, setHourInput] = React.useState(getDisplayHours);
  const [minuteInput, setMinuteInput] = React.useState(getDisplayMinutes);

  // Sync internal state when value changes externally
  React.useEffect(() => {
    setHourInput(getDisplayHours());
    setMinuteInput(getDisplayMinutes());
    setPeriod(getPeriod());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.hours, value?.minutes]);

  const emitChange = (hours: number, minutes: number, p: "AM" | "PM") => {
    let h = hours;
    if (is12h) {
      // Convert 12h display to 24h
      if (p === "AM") {
        h = hours === 12 ? 0 : hours;
      } else {
        h = hours === 12 ? 12 : hours + 12;
      }
    }
    onChange?.({ hours: h, minutes });
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw.length > 2) return;
    setHourInput(raw);
  };

  const handleHourBlur = () => {
    const num = parseInt(hourInput, 10);
    if (isNaN(num)) {
      setHourInput(getDisplayHours());
      return;
    }
    const maxHour = is12h ? 12 : 23;
    const minHour = is12h ? 1 : 0;
    const clamped = clamp(num, minHour, maxHour);
    setHourInput(String(clamped).padStart(2, "0"));

    const mins = parseInt(minuteInput, 10) || 0;
    emitChange(clamped, mins, period);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw.length > 2) return;
    setMinuteInput(raw);
  };

  const handleMinuteBlur = () => {
    const num = parseInt(minuteInput, 10);
    if (isNaN(num)) {
      setMinuteInput(getDisplayMinutes());
      return;
    }
    const clamped = clamp(num, 0, 59);
    setMinuteInput(String(clamped).padStart(2, "0"));

    const hrs = parseInt(hourInput, 10) || (is12h ? 12 : 0);
    emitChange(hrs, clamped, period);
  };

  const handlePeriodChange = (p: "AM" | "PM") => {
    setPeriod(p);
    const hrs = parseInt(hourInput, 10) || (is12h ? 12 : 0);
    const mins = parseInt(minuteInput, 10) || 0;
    emitChange(hrs, mins, p);
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0 rounded-[28px] bg-surface-container-high p-6",
        disabled && "opacity-[0.38] pointer-events-none",
        className
      )}
    >
      {/* Hour input */}
      <div className="flex flex-col items-center">
        <span className="mb-1 text-[12px] font-medium text-surface-variant-foreground">
          Hour
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={hourInput}
          onChange={handleHourChange}
          onBlur={handleHourBlur}
          disabled={disabled}
          aria-label="Hour"
          className={cn(
            "h-[72px] w-[96px] rounded-[16px] bg-surface-container-highest text-center text-[24px] font-normal text-surface-foreground",
            "outline-none focus:ring-2 focus:ring-primary",
            "transition-colors duration-100"
          )}
        />
      </div>

      {/* Separator */}
      <span className="mx-1 mt-5 text-[16px] font-medium text-surface-foreground">
        :
      </span>

      {/* Minute input */}
      <div className="flex flex-col items-center">
        <span className="mb-1 text-[12px] font-medium text-surface-variant-foreground">
          Minute
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={minuteInput}
          onChange={handleMinuteChange}
          onBlur={handleMinuteBlur}
          disabled={disabled}
          aria-label="Minute"
          className={cn(
            "h-[72px] w-[96px] rounded-[16px] bg-surface-container-highest text-center text-[24px] font-normal text-surface-foreground",
            "outline-none focus:ring-2 focus:ring-primary",
            "transition-colors duration-100"
          )}
        />
      </div>

      {/* AM/PM selector (12h only) */}
      {is12h && (
        <div className="ml-3 mt-5 flex h-[72px] w-[52px] flex-col overflow-hidden rounded-[16px] border border-outline">
          <button
            type="button"
            disabled={disabled}
            onClick={() => handlePeriodChange("AM")}
            aria-label="AM"
            aria-pressed={period === "AM"}
            className={cn(
              "flex h-[36px] flex-1 items-center justify-center text-[14px] font-medium transition-colors duration-100",
              period === "AM"
                ? "bg-tertiary-container text-tertiary-container-foreground"
                : "bg-transparent text-surface-variant-foreground hover:bg-surface-variant-foreground/[0.08]"
            )}
          >
            AM
          </button>
          <div className="h-px bg-outline" />
          <button
            type="button"
            disabled={disabled}
            onClick={() => handlePeriodChange("PM")}
            aria-label="PM"
            aria-pressed={period === "PM"}
            className={cn(
              "flex h-[36px] flex-1 items-center justify-center text-[14px] font-medium transition-colors duration-100",
              period === "PM"
                ? "bg-tertiary-container text-tertiary-container-foreground"
                : "bg-transparent text-surface-variant-foreground hover:bg-surface-variant-foreground/[0.08]"
            )}
          >
            PM
          </button>
        </div>
      )}
    </div>
  );
}

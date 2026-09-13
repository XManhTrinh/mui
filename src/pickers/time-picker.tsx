"use client";

import * as React from "react";
import { cn } from "../lib/utils";

export type TimeValue = { hours: number; minutes: number };

export type TimePickerProps = {
  value?: TimeValue | null;
  onChange?: (time: TimeValue | null) => void;
  format?: "12h" | "24h";
  /** Layout variant: "input" (text fields, default) or "dial" (analog clock) */
  variant?: "input" | "dial";
  disabled?: boolean;
  className?: string;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function TimePicker(props: TimePickerProps) {
  if (props.variant === "dial") {
    return <TimePickerDial {...props} />;
  }
  return <TimePickerInput {...props} />;
}
TimePicker.displayName = "TimePicker";

// ─── Input variant (text fields) ──────────────────────────────────────────────

function TimePickerInput({
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
        disabled && "opacity-[0.38] pointer-events-none cursor-not-allowed",
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
            "h-18 w-24 rounded-2xl bg-surface-container-highest text-center text-[24px] font-normal text-surface-foreground cursor-text",
            "outline-none focus-visible:ring-2 focus-visible:ring-primary",
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
            "h-18 w-24 rounded-2xl bg-surface-container-highest text-center text-[24px] font-normal text-surface-foreground cursor-text",
            "outline-none focus-visible:ring-2 focus-visible:ring-primary",
            "transition-colors duration-100"
          )}
        />
      </div>

      {/* AM/PM selector (12h only) */}
      {is12h && (
        <div className="ms-3 mt-5 flex h-18 w-13 flex-col overflow-hidden rounded-2xl border border-outline">
          <button
            type="button"
            disabled={disabled}
            onClick={() => handlePeriodChange("AM")}
            aria-label="AM"
            aria-pressed={period === "AM"}
            className={cn(
              "flex h-9 flex-1 items-center justify-center text-[14px] font-medium transition-colors duration-100 cursor-pointer",
              period === "AM"
                ? "bg-tertiary-container text-tertiary-container-foreground"
                : "bg-transparent text-surface-variant-foreground hover:bg-[hsl(var(--on-surface-variant)/0.08)]"
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
              "flex h-9 flex-1 items-center justify-center text-[14px] font-medium transition-colors duration-100 cursor-pointer",
              period === "PM"
                ? "bg-tertiary-container text-tertiary-container-foreground"
                : "bg-transparent text-surface-variant-foreground hover:bg-[hsl(var(--on-surface-variant)/0.08)]"
            )}
          >
            PM
          </button>
        </div>
      )}
    </div>
  );
}
TimePickerInput.displayName = "TimePickerInput";

// ─── Dial variant (analog clock) ──────────────────────────────────────────────

const DIAL_SIZE = 256; // dp — M3 clock dial diameter
const DIAL_CENTER = DIAL_SIZE / 2;
const OUTER_RADIUS = 100; // outer number ring radius
const INNER_RADIUS = 64; // inner ring radius (24h hours 13–00 / 00)
const NUMBER_SIZE = 40; // tap target / label circle size

type DialUnit = "hours" | "minutes";

/** Convert a clock position (unit index) to x/y offset from center. */
function polar(index: number, count: number, radius: number): { x: number; y: number } {
  // 12 o'clock is index 0 at the top; clockwise.
  const angle = (index / count) * 2 * Math.PI - Math.PI / 2;
  return { x: DIAL_CENTER + radius * Math.cos(angle), y: DIAL_CENTER + radius * Math.sin(angle) };
}

/** Angle (radians, 0 = top, clockwise) from a pointer position relative to center. */
function angleFromPoint(x: number, y: number): number {
  const dx = x - DIAL_CENTER;
  const dy = y - DIAL_CENTER;
  let a = Math.atan2(dy, dx) + Math.PI / 2; // rotate so 0 = top
  if (a < 0) a += 2 * Math.PI;
  return a;
}

function TimePickerDial({
  value,
  onChange,
  format = "12h",
  disabled = false,
  className,
}: TimePickerProps) {
  const is12h = format === "12h";

  const [unit, setUnit] = React.useState<DialUnit>("hours");
  const [period, setPeriod] = React.useState<"AM" | "PM">(
    value ? (value.hours >= 12 ? "PM" : "AM") : "AM"
  );
  const dialRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (value) setPeriod(value.hours >= 12 ? "PM" : "AM");
  }, [value]);

  const hours = value?.hours ?? (is12h ? 12 : 0);
  const minutes = value?.minutes ?? 0;

  // 12h display hour (1–12); 24h uses 0–23.
  const displayHour = is12h ? ((hours % 12) === 0 ? 12 : hours % 12) : hours;

  const emit = (h24: number, m: number) => {
    onChange?.({ hours: clamp(h24, 0, 23), minutes: clamp(m, 0, 59) });
  };

  /** Convert a 12h display hour + period to 24h. */
  const to24 = (displayH: number, p: "AM" | "PM"): number => {
    if (!is12h) return displayH;
    if (p === "AM") return displayH === 12 ? 0 : displayH;
    return displayH === 12 ? 12 : displayH + 12;
  };

  const setHour = (displayH: number, p: "AM" | "PM" = period) => {
    emit(to24(displayH, p), minutes);
  };

  const setMinute = (m: number) => {
    emit(hours, m);
  };

  const handlePeriod = (p: "AM" | "PM") => {
    setPeriod(p);
    setHour(displayHour, p);
  };

  // Resolve a pointer event to the nearest hour/minute and commit it.
  const commitFromPointer = React.useCallback(
    (clientX: number, clientY: number) => {
      const el = dialRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const a = angleFromPoint(x, y);

      if (unit === "minutes") {
        const m = Math.round(a / (2 * Math.PI) * 60) % 60;
        setMinute(m);
      } else if (is12h) {
        const idx = Math.round(a / (2 * Math.PI) * 12) % 12;
        setHour(idx === 0 ? 12 : idx);
      } else {
        // 24h: choose inner vs outer ring by distance from center
        const dist = Math.hypot(x - DIAL_CENTER, y - DIAL_CENTER);
        const idx = Math.round(a / (2 * Math.PI) * 12) % 12;
        const isInner = dist < (OUTER_RADIUS + INNER_RADIUS) / 2;
        if (isInner) {
          // inner ring = 13..23, 00 (12 o'clock inner = 00)
          setHour(idx === 0 ? 0 : idx + 12);
        } else {
          // outer ring = 12, 1..11 (12 o'clock outer = 12)
          setHour(idx === 0 ? 12 : idx);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [unit, is12h, hours, minutes, period]
  );

  const draggingRef = React.useRef(false);
  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    draggingRef.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    commitFromPointer(e.clientX, e.clientY);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    commitFromPointer(e.clientX, e.clientY);
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    // After choosing an hour, advance to minutes (M3 behavior).
    if (unit === "hours") setUnit("minutes");
  };

  // ── Selector geometry ──
  // Which ring/index the hand points to.
  let selIndex: number;
  let selRadius = OUTER_RADIUS;
  let selCount = is12h ? 12 : 12;
  if (unit === "minutes") {
    selIndex = minutes % 60;
    selCount = 60;
  } else if (is12h) {
    selIndex = displayHour % 12;
  } else {
    // 24h: 0 and 13–23 on inner ring, 12 and 1–11 on outer
    if (hours === 0) {
      selIndex = 0;
      selRadius = INNER_RADIUS;
    } else if (hours > 12) {
      selIndex = hours - 12;
      selRadius = INNER_RADIUS;
    } else {
      selIndex = hours % 12;
      selRadius = OUTER_RADIUS;
    }
  }
  const selPoint = polar(selIndex, selCount, selRadius);

  // ── Number labels ──
  const outerNumbers = is12h
    ? Array.from({ length: 12 }, (_, i) => ({ label: i === 0 ? 12 : i, hour: i === 0 ? 12 : i }))
    : Array.from({ length: 12 }, (_, i) => ({ label: i === 0 ? 12 : i, hour: i === 0 ? 12 : i }));
  const innerNumbers = !is12h
    ? Array.from({ length: 12 }, (_, i) => ({ label: i === 0 ? "00" : String(i + 12), hour: i === 0 ? 0 : i + 12 }))
    : [];

  const timeFieldCx = (active: boolean) =>
    cn(
      "flex h-20 w-24 items-center justify-center rounded-lg text-[45px] leading-none font-normal cursor-pointer transition-colors duration-100",
      "outline-none focus-visible:ring-2 focus-visible:ring-primary",
      active
        ? "bg-primary-container text-primary-container-foreground"
        : "bg-surface-container-highest text-surface-foreground hover:bg-[hsl(var(--on-surface)/0.04)]"
    );

  const fmt = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      className={cn(
        "inline-flex flex-col items-center gap-8 rounded-[28px] bg-surface-container-high p-6",
        disabled && "opacity-[0.38] pointer-events-none cursor-not-allowed",
        className
      )}
    >
      {/* Time fields — tap to choose which unit the dial edits */}
      <div className="flex items-start gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setUnit("hours")}
          aria-label="Set hour"
          aria-pressed={unit === "hours"}
          className={timeFieldCx(unit === "hours")}
        >
          {value ? fmt(displayHour) : "--"}
        </button>
        <span className="mt-5 text-[45px] leading-none font-normal text-surface-foreground">:</span>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setUnit("minutes")}
          aria-label="Set minutes"
          aria-pressed={unit === "minutes"}
          className={timeFieldCx(unit === "minutes")}
        >
          {value ? fmt(minutes) : "--"}
        </button>

        {is12h && (
          <div className="ms-3 flex h-20 w-13 flex-col overflow-hidden rounded-lg border border-outline">
            {(["AM", "PM"] as const).map((p, idx) => (
              <React.Fragment key={p}>
                {idx === 1 && <div className="h-px bg-outline" />}
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => handlePeriod(p)}
                  aria-label={p}
                  aria-pressed={period === p}
                  className={cn(
                    "flex flex-1 items-center justify-center text-[14px] font-medium transition-colors duration-100 cursor-pointer",
                    period === p
                      ? "bg-tertiary-container text-tertiary-container-foreground"
                      : "bg-transparent text-surface-variant-foreground hover:bg-[hsl(var(--on-surface-variant)/0.08)]"
                  )}
                >
                  {p}
                </button>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Clock dial */}
      <div
        ref={dialRef}
        role="slider"
        aria-label={unit === "hours" ? "Select hour" : "Select minutes"}
        aria-valuenow={unit === "hours" ? displayHour : minutes}
        aria-valuemin={unit === "hours" ? (is12h ? 1 : 0) : 0}
        aria-valuemax={unit === "hours" ? (is12h ? 12 : 23) : 59}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative touch-none select-none rounded-full bg-surface-variant"
        style={{ width: DIAL_SIZE, height: DIAL_SIZE }}
      >
        {/* Center dot */}
        <span
          className="absolute z-20 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
          style={{ left: DIAL_CENTER, top: DIAL_CENTER }}
          aria-hidden="true"
        />

        {/* Selector hand */}
        <span
          className="absolute z-10 h-0.5 origin-left bg-primary"
          style={{
            left: DIAL_CENTER,
            top: DIAL_CENTER,
            width: selRadius,
            transform: `rotate(${(Math.atan2(selPoint.y - DIAL_CENTER, selPoint.x - DIAL_CENTER) * 180) / Math.PI}deg)`,
          }}
          aria-hidden="true"
        />

        {/* Selector dot (filled circle at the end of the hand) */}
        <span
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
          style={{ left: selPoint.x, top: selPoint.y, width: NUMBER_SIZE, height: NUMBER_SIZE }}
          aria-hidden="true"
        />

        {/* Outer ring numbers */}
        {(unit === "minutes"
          ? Array.from({ length: 12 }, (_, i) => ({ label: fmt((i * 5) % 60), value: (i * 5) % 60 }))
          : outerNumbers.map((n) => ({ label: String(n.label), value: n.hour }))
        ).map((n, i) => {
          const pt = polar(i, 12, OUTER_RADIUS);
          const isSel =
            unit === "minutes"
              ? (n as { value: number }).value === minutes
              : selRadius === OUTER_RADIUS && selIndex === i;
          return (
            <span
              key={`o-${i}`}
              className={cn(
                "absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[14px]",
                isSel ? "text-primary-foreground" : "text-surface-foreground"
              )}
              style={{ left: pt.x, top: pt.y, width: NUMBER_SIZE, height: NUMBER_SIZE }}
              aria-hidden="true"
            >
              {n.label}
            </span>
          );
        })}

        {/* Inner ring numbers (24h hours) */}
        {innerNumbers.map((n, i) => {
          const pt = polar(i, 12, INNER_RADIUS);
          const isSel = selRadius === INNER_RADIUS && selIndex === i;
          return (
            <span
              key={`i-${i}`}
              className={cn(
                "absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[12px]",
                isSel ? "text-primary-foreground" : "text-surface-variant-foreground"
              )}
              style={{ left: pt.x, top: pt.y, width: NUMBER_SIZE - 4, height: NUMBER_SIZE - 4 }}
              aria-hidden="true"
            >
              {n.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
TimePickerDial.displayName = "TimePickerDial";

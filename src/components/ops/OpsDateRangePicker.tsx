"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { OpsSelect } from "@/components/ops/OpsSelect";
import { CalendarIcon } from "@/components/ops/OpsIcons";

type DateRangeValue = {
  from: string;
  to: string;
};

type OpsDateRangePickerProps = {
  from: string;
  to: string;
  onApply: (range: DateRangeValue) => void;
  placeholder?: string;
};

const MONTHS = [
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

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

type PresetKey =
  | "customised"
  | "today"
  | "last-3-days"
  | "last-7-days"
  | "last-30-days"
  | "last-3-months"
  | "last-6-months"
  | "last-1-year"
  | "all-time";

const PRESETS: { key: PresetKey; label: string }[] = [
  { key: "customised", label: "Customised" },
  { key: "today", label: "Today" },
  { key: "last-3-days", label: "Last 3 Days" },
  { key: "last-7-days", label: "Last 7 Days" },
  { key: "last-30-days", label: "Last 30 Days" },
  { key: "last-3-months", label: "Last 3 Months" },
  { key: "last-6-months", label: "Last 6 Months" },
  { key: "last-1-year", label: "Last 1 Year" },
  { key: "all-time", label: "All Time" },
];

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatLongDate(key: string): string {
  if (!key) return "";
  const d = parseDateKey(key);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatShortDate(key: string): string {
  if (!key) return "";
  const d = parseDateKey(key);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function addMonths(year: number, month: number, delta: number) {
  const d = new Date(year, month + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}

export function OpsDateRangePicker({
  from,
  to,
  onApply,
  placeholder = "Select date range",
}: OpsDateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [activePreset, setActivePreset] = useState<PresetKey>("customised");
  const [draftFrom, setDraftFrom] = useState(from);
  const [draftTo, setDraftTo] = useState(to);
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number } | null>(
    null
  );

  const now = new Date();
  const [leftView, setLeftView] = useState(() => ({
    year: now.getFullYear(),
    month: now.getMonth(),
  }));
  const [rightView, setRightView] = useState(() =>
    addMonths(now.getFullYear(), now.getMonth(), 1)
  );

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const yearOptions = useMemo(() => {
    const baseYear = new Date().getFullYear();
    const list = [];
    for (let y = baseYear - 5; y <= baseYear + 3; y++) {
      list.push({ value: String(y), label: String(y) });
    }
    return list;
  }, []);

  const monthOptions = useMemo(
    () => MONTHS.map((m, idx) => ({ value: String(idx), label: m })),
    []
  );

  function openPopover() {
    setDraftFrom(from);
    setDraftTo(to);

    if (from) {
      const fd = parseDateKey(from);
      const td = to ? parseDateKey(to) : addMonths(fd.getFullYear(), fd.getMonth(), 1);
      setLeftView({ year: fd.getFullYear(), month: fd.getMonth() });
      if (
        td instanceof Date &&
        (td.getFullYear() !== fd.getFullYear() || td.getMonth() !== fd.getMonth())
      ) {
        setRightView({ year: td.getFullYear(), month: td.getMonth() });
      } else {
        setRightView(addMonths(fd.getFullYear(), fd.getMonth(), 1));
      }
    } else {
      const today = new Date();
      setLeftView({ year: today.getFullYear(), month: today.getMonth() });
      setRightView(addMonths(today.getFullYear(), today.getMonth(), 1));
    }
    setOpen((prev) => !prev);
  }

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;

    const updatePosition = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const isNarrow = window.innerWidth <= 760;
      const popWidth = isNarrow
        ? window.innerWidth - 16
        : Math.min(730, window.innerWidth - 24);
      const left = isNarrow
        ? 8
        : Math.max(
            12,
            Math.min(rect.right - popWidth, window.innerWidth - popWidth - 12)
          );
      const top = isNarrow
        ? Math.max(8, Math.min(rect.bottom + 6, window.innerHeight - 360))
        : Math.min(rect.bottom + 6, Math.max(12, window.innerHeight - 420));
      setPopoverPos({ top, left });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (
        popoverRef.current?.contains(target) ||
        triggerRef.current?.contains(target) ||
        target.closest(".ops-dropdown-menu")
      ) {
        return;
      }
      setOpen(false);
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  function selectPreset(preset: PresetKey) {
    setActivePreset(preset);
    if (preset === "customised") return;
    if (preset === "all-time") {
      setDraftFrom("");
      setDraftTo("");
      return;
    }

    const end = new Date();
    const start = new Date(end);

    switch (preset) {
      case "today":
        break;
      case "last-3-days":
        start.setDate(end.getDate() - 2);
        break;
      case "last-7-days":
        start.setDate(end.getDate() - 6);
        break;
      case "last-30-days":
        start.setDate(end.getDate() - 29);
        break;
      case "last-3-months":
        start.setMonth(end.getMonth() - 3);
        break;
      case "last-6-months":
        start.setMonth(end.getMonth() - 6);
        break;
      case "last-1-year":
        start.setFullYear(end.getFullYear() - 1);
        break;
    }

    const fromKey = toDateKey(start);
    const toKey = toDateKey(end);
    setDraftFrom(fromKey);
    setDraftTo(toKey);
    setLeftView({ year: start.getFullYear(), month: start.getMonth() });
    if (
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth()
    ) {
      setRightView(addMonths(start.getFullYear(), start.getMonth(), 1));
    } else {
      setRightView({ year: end.getFullYear(), month: end.getMonth() });
    }
  }

  function handleDayClick(dayKey: string) {
    setActivePreset("customised");
    if (!draftFrom || (draftFrom && draftTo)) {
      setDraftFrom(dayKey);
      setDraftTo("");
    } else if (dayKey < draftFrom) {
      setDraftTo(draftFrom);
      setDraftFrom(dayKey);
    } else {
      setDraftTo(dayKey);
    }
  }

  function handleClear() {
    setDraftFrom("");
    setDraftTo("");
    setActivePreset("customised");
    onApply({ from: "", to: "" });
    setOpen(false);
  }

  function handleApply() {
    if (activePreset === "all-time") {
      onApply({ from: "", to: "" });
    } else if (draftFrom && !draftTo) {
      onApply({ from: draftFrom, to: draftFrom });
    } else {
      onApply({ from: draftFrom, to: draftTo });
    }
    setOpen(false);
  }

  function renderMonthGrid(year: number, month: number) {
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (number | null)[] = [
      ...Array.from({ length: firstWeekday }, () => null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    return (
      <div>
        <div className="ops-dr-weekdays">
          {WEEKDAYS.map((w, idx) => (
            <span key={`${w}-${idx}`}>{w}</span>
          ))}
        </div>
        <div className="ops-dr-days">
          {cells.map((day, idx) => {
            if (!day) return <span key={`empty-${idx}`} className="ops-dr-empty" />;
            const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(
              day
            ).padStart(2, "0")}`;
            const isStart = draftFrom === key;
            const isEnd = draftTo === key;
            const isSelected = isStart || isEnd;
            const isInRange =
              Boolean(draftFrom && draftTo) && key > draftFrom && key < draftTo;

            return (
              <button
                key={key}
                type="button"
                className={`ops-dr-day${isSelected ? " selected" : ""}${
                  isInRange ? " in-range" : ""
                }`}
                onClick={() => handleDayClick(key)}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const triggerText =
    from && to
      ? `${formatShortDate(from)} – ${formatShortDate(to)}`
      : from
      ? formatShortDate(from)
      : "";

  const rangePreview =
    activePreset === "all-time"
      ? "All Time (showing all records)"
      : draftFrom && draftTo
      ? `${formatLongDate(draftFrom)} – ${formatLongDate(draftTo)}`
      : draftFrom
      ? `${formatLongDate(draftFrom)} – Select end date`
      : "Select start and end dates";

  return (
    <div className="ops-dr-wrap">
      <button
        ref={triggerRef}
        type="button"
        className={`ops-dr-trigger${open ? " open" : ""}`}
        onClick={openPopover}
        aria-expanded={open}
      >
        <span className={triggerText ? "" : "ops-dr-placeholder"}>
          {triggerText || placeholder}
        </span>
        <CalendarIcon />
      </button>

      {open && popoverPos && (
        <div
          ref={popoverRef}
          className="ops-dr-popover"
          style={{ top: popoverPos.top, left: popoverPos.left }}
        >
          <aside className="ops-dr-presets">
            {PRESETS.map((preset) => (
              <button
                key={preset.key}
                type="button"
                className={`ops-dr-preset-btn${
                  activePreset === preset.key ? " active" : ""
                }`}
                onClick={() => selectPreset(preset.key)}
              >
                <span>{preset.label}</span>
                {preset.key === "customised" && <span>»</span>}
              </button>
            ))}
          </aside>

          <div className="ops-dr-body">
            <div className="ops-dr-topbar">
              <div className="ops-dr-range-box">{rangePreview}</div>

              <button
                type="button"
                className="ops-dr-clear-link"
                onClick={handleClear}
              >
                Clear filters
              </button>

              <div className="ops-dr-actions">
                <button
                  type="button"
                  className="ops-btn ops-btn-secondary ops-btn-sm"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="ops-btn ops-btn-sm"
                  disabled={!draftFrom && activePreset !== "all-time"}
                  onClick={handleApply}
                >
                  Apply
                </button>
              </div>
            </div>

            <div className="ops-dr-calendars">
              <div>
                <div className="ops-dr-cal-label">From</div>
                <div className="ops-dr-cal-controls">
                  <OpsSelect
                    ariaLabel="From month"
                    size="sm"
                    fullWidth
                    value={String(leftView.month)}
                    onChange={(val) =>
                      setLeftView((prev) => ({ ...prev, month: Number(val) }))
                    }
                    options={monthOptions}
                  />
                  <OpsSelect
                    ariaLabel="From year"
                    size="sm"
                    fullWidth
                    value={String(leftView.year)}
                    onChange={(val) =>
                      setLeftView((prev) => ({ ...prev, year: Number(val) }))
                    }
                    options={yearOptions}
                  />
                </div>
                {renderMonthGrid(leftView.year, leftView.month)}
              </div>

              <div>
                <div className="ops-dr-cal-label">To</div>
                <div className="ops-dr-cal-controls">
                  <OpsSelect
                    ariaLabel="To month"
                    size="sm"
                    fullWidth
                    value={String(rightView.month)}
                    onChange={(val) =>
                      setRightView((prev) => ({ ...prev, month: Number(val) }))
                    }
                    options={monthOptions}
                  />
                  <OpsSelect
                    ariaLabel="To year"
                    size="sm"
                    fullWidth
                    value={String(rightView.year)}
                    onChange={(val) =>
                      setRightView((prev) => ({ ...prev, year: Number(val) }))
                    }
                    options={yearOptions}
                  />
                </div>
                {renderMonthGrid(rightView.year, rightView.month)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

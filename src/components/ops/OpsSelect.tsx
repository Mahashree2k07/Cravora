"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

export type OpsSelectOption = {
  value: string;
  label: string;
};

type OpsSelectProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: OpsSelectOption[];
  ariaLabel: string;
  size?: "sm" | "md";
  minWidth?: number;
  fullWidth?: boolean;
};

export function OpsSelect({
  id,
  value,
  onChange,
  options,
  ariaLabel,
  size = "md",
  minWidth,
  fullWidth = false,
}: OpsSelectProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const [menuPos, setMenuPos] = useState<{
    top: number;
    left: number;
    width: number;
    maxWidth: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const selected = options.find((opt) => opt.value === value);

  const updateMenuPosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const menuHeight = Math.min(240, options.length * 36 + 12);
    const top =
      spaceBelow < menuHeight && rect.top > menuHeight
        ? Math.max(8, rect.top - menuHeight)
        : rect.bottom + 5;
    const maxWidth = Math.max(120, window.innerWidth - 16);
    const effectiveWidth = Math.min(Math.max(rect.width, 135), maxWidth);

    setMenuPos({
      top,
      left: Math.max(
        8,
        Math.min(rect.left, window.innerWidth - effectiveWidth - 8)
      ),
      width: rect.width,
      maxWidth,
    });
  };

  useLayoutEffect(() => {
    if (!open) return;
    updateMenuPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, options.length]);

  useEffect(() => {
    if (!open || !menuPos || !menuRef.current) return;
    const selectedEl = menuRef.current.querySelector<HTMLElement>(
      '[aria-selected="true"]'
    );
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: "center" });
    }
  }, [open, menuPos]);

  useEffect(() => {
    if (!open) return;

    function handleOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        containerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }

    function handleScroll(event: Event) {
      if (
        menuRef.current &&
        event.target instanceof Node &&
        menuRef.current.contains(event.target)
      ) {
        return;
      }
      updateMenuPosition();
    }

    function handleResize() {
      updateMenuPosition();
    }

    document.addEventListener("mousedown", handleOutside);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, options.length]);

  function handleToggle() {
    const idx = Math.max(
      0,
      options.findIndex((opt) => opt.value === value)
    );
    setHighlighted(idx);
    setOpen((prev) => !prev);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
      } else {
        setHighlighted((prev) => Math.min(prev + 1, options.length - 1));
      }
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
      } else {
        setHighlighted((prev) => Math.max(prev - 1, 0));
      }
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open && options[highlighted]) {
        onChange(options[highlighted].value);
        setOpen(false);
      } else {
        handleToggle();
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className="ops-dropdown"
      style={{
        width: fullWidth ? "100%" : undefined,
        minWidth: minWidth ? `${minWidth}px` : undefined,
      }}
    >
      <button
        id={id}
        ref={triggerRef}
        type="button"
        className={`ops-dropdown-trigger${size === "sm" ? " sm" : ""}${
          open ? " open" : ""
        }`}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
          {selected?.label ?? value}
        </span>
        <span className="ops-dropdown-arrow" aria-hidden="true">
          ▾
        </span>
      </button>

      {open && menuPos && (
        <div
          ref={menuRef}
          className="ops-dropdown-menu"
          role="listbox"
          style={{
            top: menuPos.top,
            left: menuPos.left,
            minWidth: Math.min(Math.max(menuPos.width, 135), menuPos.maxWidth),
            maxWidth: menuPos.maxWidth,
          }}
        >
          {options.map((opt, idx) => {
            const isSelected = opt.value === value;
            const isHighlighted = idx === highlighted;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`ops-dropdown-option${
                  isSelected ? " selected" : ""
                }${isHighlighted ? " highlighted" : ""}`}
                onMouseEnter={() => setHighlighted(idx)}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}


"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CustomDropdown.module.css";

type DropdownOption = {
  value: string;
  label: string;
};

type CustomDropdownProps = {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  ariaLabel: string;
  className?: string;
  name?: string;
  required?: boolean;
};

export default function CustomDropdown({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  ariaLabel,
  className = "",
  name,
  required = false,
}: CustomDropdownProps) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  function selectOption(option: DropdownOption) {
    onChange(option.value);
    setOpen(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setHighlightedIndex((current) =>
        Math.min(current + 1, options.length - 1)
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setHighlightedIndex((current) => Math.max(current - 1, 0));
    }

    if (event.key === "Enter" || event.key === " ") {
      if (open && options[highlightedIndex]) {
        event.preventDefault();
        selectOption(options[highlightedIndex]);
      } else {
        event.preventDefault();
        setOpen(true);
      }
    }
  }

  return (
    <div
      ref={dropdownRef}
      className={`${styles.dropdown} ${className}`}
    >
      {name && (
        <input
          type="hidden"
          name={name}
          value={value}
          required={required}
        />
      )}

      <button
        type="button"
        className={styles.trigger}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          setOpen((current) => !current);
          setHighlightedIndex(
            Math.max(0, options.findIndex((option) => option.value === value))
          );
        }}
        onKeyDown={handleKeyDown}
      >
        <span className={!selectedOption ? styles.placeholder : ""}>
          {selectedOption?.label || placeholder}
        </span>

        <span className={`${styles.arrow} ${open ? styles.arrowOpen : ""}`}>
          ▾
        </span>
      </button>

      {open && (
        <div className={styles.menu} role="listbox" aria-label={ariaLabel}>
          {options.map((option, index) => (
            <button
              type="button"
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              className={`${styles.option} ${
                index === highlightedIndex ? styles.highlighted : ""
              }`}
              onMouseEnter={() => setHighlightedIndex(index)}
              onClick={() => selectOption(option)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

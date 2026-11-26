"use client";

import { useEffect } from "react";

type OpsConfirmModalProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  hideCancel?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function OpsConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  hideCancel = false,
  busy = false,
  onConfirm,
  onClose,
}: OpsConfirmModalProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !busy) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, busy, onClose]);

  if (!open) return null;

  return (
    <div
      className="ops-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ops-popup-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !busy) {
          onClose();
        }
      }}
    >
      <div className="ops-modal" style={{ maxWidth: 420, padding: 22 }}>
        <div className="ops-modal-header" style={{ marginBottom: 12 }}>
          <h2 id="ops-popup-title" style={{ fontSize: 18 }}>
            {title}
          </h2>
          <button
            type="button"
            className="ops-modal-close"
            aria-label="Close popup"
            disabled={busy}
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <p
          style={{
            margin: "0 0 22px",
            color: "#766D63",
            fontSize: 13.5,
            lineHeight: 1.65,
            whiteSpace: "pre-line",
          }}
        >
          {message}
        </p>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          {!hideCancel && (
            <button
              type="button"
              className="ops-btn ops-btn-secondary"
              disabled={busy}
              onClick={onClose}
            >
              {cancelLabel}
            </button>
          )}
          <button
            type="button"
            className={`ops-btn${variant === "danger" ? " ops-btn-danger" : ""}`}
            disabled={busy}
            onClick={onConfirm}
          >
            {busy ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

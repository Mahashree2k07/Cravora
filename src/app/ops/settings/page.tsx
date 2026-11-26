"use client";

import { useEffect, useMemo, useState } from "react";
import { OpsShell } from "@/components/ops/OpsShell";
import { OpsSelect } from "@/components/ops/OpsSelect";
import { TrashIcon } from "@/components/ops/OpsIcons";
import {
  DEFAULT_DINING_DURATIONS,
  DEFAULT_SEATING_PREFERENCES,
  EMAIL_DOT_COM_REGEX,
  PHONE_10_REGEX,
  build12HourTimeOptions,
  sanitizePhoneInput,
} from "@/lib/public-settings";

type OptionListEditorProps = {
  items: string[];
  onChange: (next: string[]) => void;
  draft: string;
  onDraftChange: (value: string) => void;
  placeholder: string;
  itemLabel: string;
};

function OptionListEditor({
  items,
  onChange,
  draft,
  onDraftChange,
  placeholder,
  itemLabel,
}: OptionListEditorProps) {
  function addItem() {
    const clean = draft.trim();
    if (!clean) return;
    if (items.some((i) => i.toLowerCase() === clean.toLowerCase())) {
      onDraftChange("");
      return;
    }
    onChange([...items, clean]);
    onDraftChange("");
  }

  return (
    <div className="ops-option-editor">
      {items.map((opt, idx) => (
        <div key={idx} className="ops-option-row">
          <input
            type="text"
            className="ops-input"
            aria-label={`${itemLabel} ${idx + 1}`}
            value={opt}
            onChange={(e) => {
              const next = [...items];
              next[idx] = e.target.value;
              onChange(next);
            }}
            required
          />
          <button
            type="button"
            className="ops-icon-btn danger"
            title={
              items.length <= 1
                ? `At least one ${itemLabel.toLowerCase()} is required`
                : `Remove ${opt || itemLabel}`
            }
            aria-label={`Remove ${opt || itemLabel}`}
            disabled={items.length <= 1}
            onClick={() => onChange(items.filter((_, i) => i !== idx))}
          >
            <TrashIcon />
          </button>
        </div>
      ))}

      <div className="ops-option-add">
        <input
          type="text"
          className="ops-input"
          placeholder={placeholder}
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem();
            }
          }}
        />
        <button
          type="button"
          className="ops-btn ops-btn-secondary ops-btn-sm"
          disabled={!draft.trim()}
          onClick={addItem}
        >
          + Add
        </button>
      </div>
    </div>
  );
}

export default function OpsSettingsPage() {
  const [restaurantEmail, setRestaurantEmail] = useState("");
  const [restaurantPhone, setRestaurantPhone] = useState("");
  const [restaurantAddress, setRestaurantAddress] = useState("");
  const [lunchStart, setLunchStart] = useState("12:00");
  const [lunchEnd, setLunchEnd] = useState("15:00");
  const [dinnerStart, setDinnerStart] = useState("19:00");
  const [dinnerEnd, setDinnerEnd] = useState("22:00");
  const [acceptOnlineOrders, setAcceptOnlineOrders] = useState(true);
  const [acceptDiningReservations, setAcceptDiningReservations] =
    useState(true);
  const [diningDurations, setDiningDurations] = useState<string[]>(
    DEFAULT_DINING_DURATIONS
  );
  const [seatingPreferences, setSeatingPreferences] = useState<string[]>(
    DEFAULT_SEATING_PREFERENCES
  );
  const [newDuration, setNewDuration] = useState("");
  const [newSeating, setNewSeating] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const timeOptions = useMemo(
    () =>
      build12HourTimeOptions(15, [
        lunchStart,
        lunchEnd,
        dinnerStart,
        dinnerEnd,
      ]),
    [lunchStart, lunchEnd, dinnerStart, dinnerEnd]
  );

  useEffect(() => {
    fetch("/api/ops/settings")
      .then(async (res) => {
        if (!res.ok) throw new Error("Unable to load settings.");
        return res.json();
      })
      .then((data) => {
        if (data.settings) {
          setRestaurantEmail(data.settings.restaurantEmail ?? "");
          setRestaurantPhone(
            sanitizePhoneInput(String(data.settings.restaurantPhone ?? ""))
          );
          setRestaurantAddress(data.settings.restaurantAddress ?? "");
          setLunchStart(data.settings.lunchStart ?? "12:00");
          setLunchEnd(data.settings.lunchEnd ?? "15:00");
          setDinnerStart(data.settings.dinnerStart ?? "19:00");
          setDinnerEnd(data.settings.dinnerEnd ?? "22:00");
          setAcceptOnlineOrders(Boolean(data.settings.acceptOnlineOrders));
          setAcceptDiningReservations(
            Boolean(data.settings.acceptDiningReservations)
          );
          if (
            Array.isArray(data.settings.diningDurations) &&
            data.settings.diningDurations.length > 0
          ) {
            setDiningDurations(data.settings.diningDurations);
          }
          if (
            Array.isArray(data.settings.seatingPreferences) &&
            data.settings.seatingPreferences.length > 0
          ) {
            setSeatingPreferences(data.settings.seatingPreferences);
          }
        }
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load.")
      )
      .finally(() => setLoading(false));
  }, []);

  async function saveAllSettings() {
    setMessage("");
    setError("");

    if (
      !restaurantEmail.trim() ||
      !restaurantPhone.trim() ||
      !restaurantAddress.trim()
    ) {
      setError("Please fill all required Restaurant Information fields.");
      return;
    }

    if (!EMAIL_DOT_COM_REGEX.test(restaurantEmail.trim())) {
      setError("Please enter a valid email address with @ and .com.");
      return;
    }

    if (!PHONE_10_REGEX.test(restaurantPhone.trim())) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    if (!lunchStart || !lunchEnd || !dinnerStart || !dinnerEnd) {
      setError("Please fill all required Operating Hours fields.");
      return;
    }

    const cleanedDurations = diningDurations.map((v) => v.trim()).filter(Boolean);
    const cleanedSeating = seatingPreferences
      .map((v) => v.trim())
      .filter(Boolean);

    if (
      cleanedDurations.length === 0 ||
      cleanedDurations.length !== diningDurations.length
    ) {
      setError("Please ensure all Expected Dining Duration options are non-empty.");
      return;
    }

    if (
      cleanedSeating.length === 0 ||
      cleanedSeating.length !== seatingPreferences.length
    ) {
      setError("Please ensure all Seating Preference options are non-empty.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/ops/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantEmail: restaurantEmail.trim(),
          restaurantPhone: restaurantPhone.trim(),
          restaurantAddress: restaurantAddress.trim(),
          lunchStart,
          lunchEnd,
          dinnerStart,
          dinnerEnd,
          acceptOnlineOrders,
          acceptDiningReservations,
          diningDurations: cleanedDurations,
          seatingPreferences: cleanedSeating,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unable to save settings.");
      setDiningDurations(cleanedDurations);
      setSeatingPreferences(cleanedSeating);
      setMessage("All settings saved and synced across Cravora.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <OpsShell
      title="Settings"
      subtitle="Manage restaurant contact details, dining hours, ordering controls, and customer dropdown options."
      headerRight={
        <button
          type="button"
          className="ops-btn"
          disabled={loading || saving}
          onClick={saveAllSettings}
        >
          {saving ? "Saving..." : "Save All Settings"}
        </button>
      }
    >
      {error && <div className="ops-alert error">{error}</div>}
      {message && <div className="ops-alert success">{message}</div>}

      {loading ? (
        <div className="ops-panel">Loading settings...</div>
      ) : (
        <div className="ops-settings-grid">
          <section className="ops-panel ops-settings-card">
            <div className="ops-settings-card-head">
              <div>
                <h2>Restaurant Information</h2>
                <p>Public email, phone number, and street address.</p>
              </div>
              <span className="ops-reflect-badge">Footers &amp; Contact</span>
            </div>

            <div className="ops-form-grid">
              <div className="ops-field">
                <label htmlFor="s-email">
                  Email Address<span className="ops-required-star">*</span>
                </label>
                <input
                  id="s-email"
                  type="email"
                  className="ops-input"
                  placeholder="e.g. hello@cravora.com"
                  pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[cC][oO][mM]"
                  title="Please enter a valid email address ending in .com."
                  value={restaurantEmail}
                  onChange={(e) => setRestaurantEmail(e.target.value)}
                  required
                />
              </div>
              <div className="ops-field">
                <label htmlFor="s-phone">
                  Phone Number<span className="ops-required-star">*</span>
                </label>
                <input
                  id="s-phone"
                  type="tel"
                  inputMode="numeric"
                  minLength={10}
                  maxLength={10}
                  pattern="[0-9]{10}"
                  placeholder="10-digit mobile number"
                  title="Please enter exactly 10 digits."
                  className="ops-input"
                  value={restaurantPhone}
                  onChange={(e) =>
                    setRestaurantPhone(sanitizePhoneInput(e.target.value))
                  }
                  required
                />
              </div>
              <div className="ops-field full">
                <label htmlFor="s-addr">
                  Restaurant Address<span className="ops-required-star">*</span>
                </label>
                <input
                  id="s-addr"
                  className="ops-input"
                  value={restaurantAddress}
                  onChange={(e) => setRestaurantAddress(e.target.value)}
                  required
                />
              </div>
            </div>
          </section>

          <section className="ops-panel ops-settings-card">
            <div className="ops-settings-card-head">
              <div>
                <h2>Operating Hours</h2>
                <p>Lunch &amp; dinner service timings and time dropdown slots.</p>
              </div>
              <span className="ops-reflect-badge">
                Footers, Dining &amp; Checkout
              </span>
            </div>

            <div className="ops-form-grid">
              <div className="ops-field">
                <label htmlFor="s-ls">
                  Lunch Opening<span className="ops-required-star">*</span>
                </label>
                <OpsSelect
                  id="s-ls"
                  ariaLabel="Lunch Opening"
                  fullWidth
                  value={lunchStart}
                  onChange={setLunchStart}
                  options={timeOptions}
                />
              </div>
              <div className="ops-field">
                <label htmlFor="s-le">
                  Lunch Closing<span className="ops-required-star">*</span>
                </label>
                <OpsSelect
                  id="s-le"
                  ariaLabel="Lunch Closing"
                  fullWidth
                  value={lunchEnd}
                  onChange={setLunchEnd}
                  options={timeOptions}
                />
              </div>
              <div className="ops-field">
                <label htmlFor="s-ds">
                  Dinner Opening<span className="ops-required-star">*</span>
                </label>
                <OpsSelect
                  id="s-ds"
                  ariaLabel="Dinner Opening"
                  fullWidth
                  value={dinnerStart}
                  onChange={setDinnerStart}
                  options={timeOptions}
                />
              </div>
              <div className="ops-field">
                <label htmlFor="s-de">
                  Dinner Closing<span className="ops-required-star">*</span>
                </label>
                <OpsSelect
                  id="s-de"
                  ariaLabel="Dinner Closing"
                  fullWidth
                  value={dinnerEnd}
                  onChange={setDinnerEnd}
                  options={timeOptions}
                />
              </div>
            </div>
          </section>

          <section className="ops-panel ops-settings-card ops-settings-card-full">
            <div className="ops-settings-card-head">
              <div>
                <h2>Order &amp; Reservation Availability</h2>
                <p>Pause or open customer ordering and table bookings.</p>
              </div>
              <span className="ops-reflect-badge">
                Order &amp; Dining Live
              </span>
            </div>

            <div className="ops-availability-grid">
              <div className="ops-detail-row">
                <div>
                  <strong>Accept Online Orders</strong>
                  <span className="ops-cell-sub">
                    Shows paused banner on Order &amp; blocks checkout submission
                  </span>
                </div>
                <label className="ops-toggle">
                  <input
                    type="checkbox"
                    checked={acceptOnlineOrders}
                    onChange={(e) => setAcceptOnlineOrders(e.target.checked)}
                  />
                  <span className="ops-toggle-slider" />
                </label>
              </div>
              <div className="ops-detail-row">
                <div>
                  <strong>Accept Dining Reservations</strong>
                  <span className="ops-cell-sub">
                    Shows paused notice on Dining &amp; disables booking form
                  </span>
                </div>
                <label className="ops-toggle">
                  <input
                    type="checkbox"
                    checked={acceptDiningReservations}
                    onChange={(e) =>
                      setAcceptDiningReservations(e.target.checked)
                    }
                  />
                  <span className="ops-toggle-slider" />
                </label>
              </div>
            </div>
          </section>

          <section className="ops-panel ops-settings-card">
            <div className="ops-settings-card-head">
              <div>
                <h2>Expected Dining Duration Options</h2>
                <p>
                  Edit, add, or remove durations shown on Dining &amp;
                  Reservations.
                </p>
              </div>
              <span className="ops-reflect-badge">
                Dining &amp; Reservations
              </span>
            </div>

            <OptionListEditor
              items={diningDurations}
              onChange={setDiningDurations}
              draft={newDuration}
              onDraftChange={setNewDuration}
              placeholder="e.g. 2 hours 30 minutes"
              itemLabel="Dining Duration"
            />
          </section>

          <section className="ops-panel ops-settings-card">
            <div className="ops-settings-card-head">
              <div>
                <h2>Seating Preference Options</h2>
                <p>
                  Edit, add, or remove seating choices shown on Dining &amp;
                  Reservations.
                </p>
              </div>
              <span className="ops-reflect-badge">
                Dining &amp; Reservations
              </span>
            </div>

            <OptionListEditor
              items={seatingPreferences}
              onChange={setSeatingPreferences}
              draft={newSeating}
              onDraftChange={setNewSeating}
              placeholder="e.g. Rooftop, Window seat"
              itemLabel="Seating Preference"
            />
          </section>
        </div>
      )}
    </OpsShell>
  );
}

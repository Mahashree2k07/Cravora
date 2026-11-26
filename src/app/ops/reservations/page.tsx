"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { OpsShell } from "@/components/ops/OpsShell";
import { OpsSelect } from "@/components/ops/OpsSelect";
import { OpsDateRangePicker } from "@/components/ops/OpsDateRangePicker";
import { PencilIcon } from "@/components/ops/OpsIcons";
import {
  DEFAULT_DINING_DURATIONS,
  DEFAULT_SEATING_PREFERENCES,
  EMAIL_DOT_COM_REGEX,
  PHONE_10_REGEX,
  build12HourTimeOptions,
  sanitizePhoneInput,
} from "@/lib/public-settings";
import {
  SortableHeader,
  nextSortState,
  sortRows,
  type SortState,
} from "@/components/ops/OpsTableSort";

type ReservationRow = {
  id: string;
  bookingNumber: string;
  guestName: string;
  phone: string;
  email: string | null;
  reservationDate: string;
  reservationTime: string;
  guests: number;
  duration: string;
  seatingPreference: string;
  specialRequest: string | null;
  status: string;
  cancellationReason?: string | null;
};

const RESERVATION_CANCEL_REASONS = [
  "Restaurant closed",
  "All tables fully booked",
  "Private event / maintenance",
  "Guest requested cancellation",
];

type ReservationStats = {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
};

export default function OpsReservationsPage() {
  const [reservations, setReservations] = useState<ReservationRow[]>([]);
  const [stats, setStats] = useState<ReservationStats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sort, setSort] = useState<
    SortState<"id" | "guest" | "date" | "time" | "guests" | "seating" | "status">
  >(null);
  const [loading, setLoading] = useState(true);

  const sortedReservations = useMemo(
    () =>
      sortRows(reservations, sort, {
        id: (r) => r.bookingNumber,
        guest: (r) => r.guestName,
        date: (r) => new Date(r.reservationDate).getTime(),
        time: (r) => new Date(r.reservationTime).getTime(),
        guests: (r) => r.guests,
        seating: (r) => r.seatingPreference,
        status: (r) => r.status,
      }),
    [reservations, sort]
  );
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:30");
  const [guests, setGuests] = useState("2");
  const [seatingOptionsList, setSeatingOptionsList] = useState<string[]>(
    DEFAULT_SEATING_PREFERENCES
  );
  const [durationOptionsList, setDurationOptionsList] = useState<string[]>(
    DEFAULT_DINING_DURATIONS
  );
  const [seatingPreference, setSeatingPreference] = useState(
    DEFAULT_SEATING_PREFERENCES[0]
  );
  const [duration, setDuration] = useState(DEFAULT_DINING_DURATIONS[2]);
  const [specialRequest, setSpecialRequest] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (
          Array.isArray(data?.seatingPreferences) &&
          data.seatingPreferences.length > 0
        ) {
          setSeatingOptionsList(data.seatingPreferences);
        }
        if (
          Array.isArray(data?.diningDurations) &&
          data.diningDurations.length > 0
        ) {
          setDurationOptionsList(data.diningDurations);
        }
      })
      .catch(() => {});
  }, []);
  const [cancelTarget, setCancelTarget] = useState<ReservationRow | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const loadReservations = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (fromDate) params.set("from", fromDate);
      if (toDate) params.set("to", toDate);

      const res = await fetch(`/api/ops/reservations?${params.toString()}`);
      if (!res.ok) throw new Error("Unable to load reservations.");
      const data = await res.json();
      setReservations(data.reservations ?? []);
      if (data.stats) setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load failed.");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, fromDate, toDate]);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  async function updateStatus(
    id: string,
    nextStatus: string,
    reason?: string
  ): Promise<boolean> {
    setError("");
    setMessage("");
    try {
      const res = await fetch(`/api/ops/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: nextStatus,
          ...(nextStatus === "cancelled"
            ? { cancellationReason: reason }
            : { cancellationReason: null }),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Unable to update reservation status.");
      }
      setMessage("Reservation status updated.");
      await loadReservations();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
      return false;
    }
  }

  function handleStatusSelection(row: ReservationRow, nextStatus: string) {
    if (nextStatus === "cancelled") {
      setCancelTarget(row);
      setCancelReason(row.cancellationReason ?? "");
      return;
    }
    updateStatus(row.id, nextStatus);
  }

  async function confirmCancelReservation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cancelTarget || !cancelReason.trim()) return;
    setCancelling(true);
    const ok = await updateStatus(
      cancelTarget.id,
      "cancelled",
      cancelReason.trim()
    );
    setCancelling(false);
    if (ok) {
      setCancelTarget(null);
      setCancelReason("");
    }
  }

  function openCreateReservation() {
    setEditingId(null);
    setGuestName("");
    setPhone("");
    setEmail("");
    setDate("");
    setTime("19:30");
    setGuests("2");
    setSeatingPreference(seatingOptionsList[0] ?? DEFAULT_SEATING_PREFERENCES[0]);
    setDuration(durationOptionsList[0] ?? DEFAULT_DINING_DURATIONS[0]);
    setSpecialRequest("");
    setModalOpen(true);
  }

  function openEditReservation(row: ReservationRow) {
    setEditingId(row.id);
    setGuestName(row.guestName);
    setPhone(row.phone);
    setEmail(row.email ?? "");
    setDate(row.reservationDate.slice(0, 10));
    const tDate = new Date(row.reservationTime);
    const hh = String(tDate.getUTCHours()).padStart(2, "0");
    const mm = String(tDate.getUTCMinutes()).padStart(2, "0");
    setTime(`${hh}:${mm}`);
    setGuests(String(row.guests));
    setSeatingPreference(row.seatingPreference);
    setDuration(row.duration);
    setSpecialRequest(row.specialRequest ?? "");
    setModalOpen(true);
  }

  async function handleSaveReservation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!PHONE_10_REGEX.test(phone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (email.trim() && !EMAIL_DOT_COM_REGEX.test(email.trim())) {
      setError("Please enter a valid email address ending in .com.");
      return;
    }

    try {
      const payload = {
        guestName,
        phone,
        email,
        date,
        time,
        guests: Number(guests),
        duration,
        seatingPreference,
        specialRequest,
        ...(editingId ? {} : { status: "confirmed" }),
      };

      const res = await fetch(
        editingId
          ? `/api/ops/reservations/${editingId}`
          : "/api/ops/reservations",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.message ||
            (editingId
              ? "Unable to update reservation."
              : "Unable to create booking.")
        );
      }

      setModalOpen(false);
      setEditingId(null);
      setGuestName("");
      setPhone("");
      setEmail("");
      setSpecialRequest("");
      setMessage(editingId ? "Reservation updated." : "Reservation added.");
      await loadReservations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    }
  }

  return (
    <OpsShell
      title="Reservations"
      subtitle="Manage and track customer dining reservations."
    >
      {error && <div className="ops-alert error">{error}</div>}
      {message && <div className="ops-alert success">{message}</div>}

      <section className="ops-stats-grid">
        <div className="ops-stat-card">
          <p>Total Reservations</p>
          <h2>{stats.total}</h2>
          <span>All reservations</span>
        </div>
        <div className="ops-stat-card">
          <p>Pending</p>
          <h2>{stats.pending}</h2>
          <span>Awaiting confirmation</span>
        </div>
        <div className="ops-stat-card">
          <p>Confirmed</p>
          <h2>{stats.confirmed}</h2>
          <span>Successfully confirmed</span>
        </div>
        <div className="ops-stat-card">
          <p>Cancelled</p>
          <h2>{stats.cancelled}</h2>
          <span>Cancelled reservations</span>
        </div>
      </section>

      <section className="ops-panel">
        <div className="ops-panel-top">
          <div className="ops-panel-heading">
            <h2>All Reservations</h2>
            <p>View and manage customer bookings.</p>
          </div>

          <div className="ops-toolbar">
            <input
              type="text"
              className="ops-input"
              placeholder="Search customer or booking ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <OpsSelect
              ariaLabel="Filter reservations by status"
              value={statusFilter}
              onChange={setStatusFilter}
              minWidth={140}
              options={[
                { value: "all", label: "All Statuses" },
                { value: "pending", label: "Pending" },
                { value: "confirmed", label: "Confirmed" },
                { value: "completed", label: "Completed" },
                { value: "cancelled", label: "Cancelled" },
              ]}
            />
            <OpsDateRangePicker
              from={fromDate}
              to={toDate}
              placeholder="Filter by date"
              onApply={({ from, to }) => {
                setFromDate(from);
                setToDate(to);
              }}
            />
            <button
              type="button"
              className="ops-btn"
              onClick={openCreateReservation}
            >
              + Add Reservation
            </button>
          </div>
        </div>

        <div className="ops-table-wrap">
          <table className="ops-table">
            <thead>
              <tr>
                <th>
                  <SortableHeader
                    label="Booking ID"
                    sortKey="id"
                    sort={sort}
                    onSort={(k) => setSort((s) => nextSortState(s, k))}
                  />
                </th>
                <th>
                  <SortableHeader
                    label="Guest"
                    sortKey="guest"
                    sort={sort}
                    onSort={(k) => setSort((s) => nextSortState(s, k))}
                  />
                </th>
                <th>
                  <SortableHeader
                    label="Date"
                    sortKey="date"
                    sort={sort}
                    onSort={(k) => setSort((s) => nextSortState(s, k))}
                  />
                </th>
                <th>
                  <SortableHeader
                    label="Time"
                    sortKey="time"
                    sort={sort}
                    onSort={(k) => setSort((s) => nextSortState(s, k))}
                  />
                </th>
                <th>
                  <SortableHeader
                    label="Guests"
                    sortKey="guests"
                    sort={sort}
                    onSort={(k) => setSort((s) => nextSortState(s, k))}
                  />
                </th>
                <th>
                  <SortableHeader
                    label="Seating"
                    sortKey="seating"
                    sort={sort}
                    onSort={(k) => setSort((s) => nextSortState(s, k))}
                  />
                </th>
                <th>
                  <SortableHeader
                    label="Status"
                    sortKey="status"
                    sort={sort}
                    onSort={(k) => setSort((s) => nextSortState(s, k))}
                  />
                </th>
                <th>Update Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9}>Loading reservations...</td>
                </tr>
              ) : sortedReservations.length === 0 ? (
                <tr>
                  <td colSpan={9}>No reservations found.</td>
                </tr>
              ) : (
                sortedReservations.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <strong>{r.bookingNumber}</strong>
                    </td>
                    <td>
                      <strong>{r.guestName}</strong>
                      <span className="ops-cell-sub">
                        {r.phone}
                        {r.email ? ` • ${r.email}` : ""}
                      </span>
                    </td>
                    <td>
                      {new Date(r.reservationDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      {new Date(r.reservationTime).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        timeZone: "UTC",
                      })}
                    </td>
                    <td>{r.guests}</td>
                    <td>{r.seatingPreference}</td>
                    <td>
                      <span className={`ops-badge ${r.status}`}>{r.status}</span>
                      {r.status === "cancelled" && r.cancellationReason && (
                        <span
                          className="ops-cell-sub"
                          style={{
                            maxWidth: 210,
                            whiteSpace: "normal",
                          }}
                        >
                          Reason: {r.cancellationReason}
                        </span>
                      )}
                    </td>
                    <td>
                      <OpsSelect
                        ariaLabel={`Update status for ${r.bookingNumber}`}
                        size="sm"
                        minWidth={120}
                        value={r.status}
                        onChange={(val) => handleStatusSelection(r, val)}
                        options={[
                          { value: "pending", label: "Pending" },
                          { value: "confirmed", label: "Confirmed" },
                          { value: "completed", label: "Completed" },
                          { value: "cancelled", label: "Cancelled" },
                        ]}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="ops-icon-btn"
                        title={`Edit ${r.bookingNumber}`}
                        aria-label={`Edit ${r.bookingNumber}`}
                        onClick={() => openEditReservation(r)}
                      >
                        <PencilIcon />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {modalOpen && (
        <div className="ops-modal-backdrop">
          <div className="ops-modal">
            <div className="ops-modal-header">
              <h2>{editingId ? "Edit Reservation" : "Add Reservation"}</h2>
              <button
                type="button"
                className="ops-btn ops-btn-secondary ops-btn-sm"
                onClick={() => setModalOpen(false)}
              >
                Close
              </button>
            </div>
            <form onSubmit={handleSaveReservation} className="ops-form-grid">
              <div className="ops-field">
                <label>
                  Guest Name<span className="ops-required-star">*</span>
                </label>
                <input
                  className="ops-input"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                />
              </div>
              <div className="ops-field">
                <label>
                  Phone (10 digits)<span className="ops-required-star">*</span>
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  className="ops-input"
                  placeholder="10-digit mobile number"
                  minLength={10}
                  maxLength={10}
                  pattern="[0-9]{10}"
                  title="Please enter exactly 10 digits."
                  value={phone}
                  onChange={(e) => setPhone(sanitizePhoneInput(e.target.value))}
                  required
                />
              </div>
              <div className="ops-field">
                <label>Email</label>
                <input
                  type="email"
                  className="ops-input"
                  placeholder="e.g. name@gmail.com"
                  pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[cC][oO][mM]"
                  title="Please enter a valid email address ending in .com."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="ops-field">
                <label>
                  Guests<span className="ops-required-star">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  className="ops-input"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  required
                />
              </div>
              <div className="ops-field">
                <label>
                  Date<span className="ops-required-star">*</span>
                </label>
                <input
                  type="date"
                  className="ops-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="ops-field">
                <label>
                  Time<span className="ops-required-star">*</span>
                </label>
                <OpsSelect
                  ariaLabel="Reservation Time"
                  fullWidth
                  value={time}
                  onChange={setTime}
                  options={build12HourTimeOptions(15, time ? [time] : [])}
                />
              </div>
              <div className="ops-field">
                <label>
                  Seating Preference<span className="ops-required-star">*</span>
                </label>
                <OpsSelect
                  ariaLabel="Seating Preference"
                  fullWidth
                  value={seatingPreference}
                  onChange={setSeatingPreference}
                  options={Array.from(
                    new Set(
                      seatingPreference
                        ? [seatingPreference, ...seatingOptionsList]
                        : seatingOptionsList
                    )
                  ).map((opt) => ({ value: opt, label: opt }))}
                />
              </div>
              <div className="ops-field">
                <label>
                  Duration<span className="ops-required-star">*</span>
                </label>
                <OpsSelect
                  ariaLabel="Dining Duration"
                  fullWidth
                  value={duration}
                  onChange={setDuration}
                  options={Array.from(
                    new Set(
                      duration
                        ? [duration, ...durationOptionsList]
                        : durationOptionsList
                    )
                  ).map((opt) => ({ value: opt, label: opt }))}
                />
              </div>
              <div className="ops-field full">
                <label>Special Request</label>
                <textarea
                  className="ops-textarea"
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                />
              </div>
              <div
                className="ops-field full"
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  gap: 10,
                }}
              >
                <button
                  type="button"
                  className="ops-btn ops-btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="ops-btn">
                  {editingId ? "Save Changes" : "Create Reservation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {cancelTarget && (
        <div className="ops-modal-backdrop">
          <div className="ops-modal" style={{ maxWidth: 480 }}>
            <div className="ops-modal-header">
              <h2>Cancel Reservation {cancelTarget.bookingNumber}</h2>
              <button
                type="button"
                className="ops-modal-close"
                aria-label="Close modal"
                onClick={() => setCancelTarget(null)}
              >
                &times;
              </button>
            </div>
            <form
              onSubmit={confirmCancelReservation}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              <div className="ops-field">
                <label htmlFor="ops-res-cancel-reason">
                  Cancellation Reason
                  <span className="ops-required-star">*</span>
                </label>
                <textarea
                  id="ops-res-cancel-reason"
                  className="ops-textarea"
                  rows={3}
                  placeholder="Write why this reservation is cancelled (e.g. Restaurant closed, no tables available)..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  required
                />
                <div className="ops-tag-chips" style={{ marginTop: 6 }}>
                  {RESERVATION_CANCEL_REASONS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      className={`ops-tag-chip${
                        cancelReason === preset ? " selected" : ""
                      }`}
                      onClick={() => setCancelReason(preset)}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                }}
              >
                <button
                  type="button"
                  className="ops-btn ops-btn-secondary"
                  disabled={cancelling}
                  onClick={() => setCancelTarget(null)}
                >
                  Keep Reservation
                </button>
                <button
                  type="submit"
                  className="ops-btn ops-btn-danger"
                  disabled={cancelling || !cancelReason.trim()}
                >
                  {cancelling ? "Cancelling..." : "Confirm Cancellation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </OpsShell>
  );
}

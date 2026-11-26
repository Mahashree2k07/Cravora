"use client";

import { useEffect, useMemo, useState } from "react";
import { OpsShell } from "@/components/ops/OpsShell";
import { OpsDateRangePicker } from "@/components/ops/OpsDateRangePicker";
import { EyeIcon } from "@/components/ops/OpsIcons";
import {
  SortableHeader,
  nextSortState,
  sortRows,
  type SortState,
} from "@/components/ops/OpsTableSort";

type CustomerRow = {
  key: string;
  name: string;
  email: string | null;
  phone: string;
  totalOrders: number;
  totalSpentInr: number;
  totalSpentUsd: number;
  reservationCount: number;
  firstSeen: string;
  lastSeen: string;
  recentOrderNumbers: string[];
};

export default function OpsCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [stats, setStats] = useState({ total: 0, newThisMonth: 0, returning: 0 });
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sort, setSort] = useState<
    SortState<"customer" | "phone" | "orders" | "reservations" | "spent" | "firstSeen">
  >(null);
  const [selected, setSelected] = useState<CustomerRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/ops/customers")
      .then(async (res) => {
        if (!res.ok) throw new Error("Unable to load customers.");
        return res.json();
      })
      .then((data) => {
        setCustomers(data.customers ?? []);
        if (data.stats) setStats(data.stats);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load.")
      )
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    const list = customers.filter((c) => {
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        (c.email ?? "").toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q);

      const firstKey = c.firstSeen.slice(0, 10);
      const matchesFrom = !fromDate || firstKey >= fromDate;
      const matchesTo = !toDate || firstKey <= toDate;

      return matchesSearch && matchesFrom && matchesTo;
    });

    return sortRows(list, sort, {
      customer: (c) => c.name,
      phone: (c) => c.phone,
      orders: (c) => c.totalOrders,
      reservations: (c) => c.reservationCount,
      spent: (c) => c.totalSpentInr,
      firstSeen: (c) => new Date(c.firstSeen).getTime(),
    });
  }, [customers, search, fromDate, toDate, sort]);

  return (
    <OpsShell
      title="Customers"
      subtitle="View and manage your customer directory and activity."
    >
      {error && <div className="ops-alert error">{error}</div>}

      <section className="ops-stats-grid ops-stats-grid-3">
        <div className="ops-stat-card">
          <p>Total Customers</p>
          <h2>{stats.total}</h2>
          <span>All active customers</span>
        </div>
        <div className="ops-stat-card">
          <p>New Customers</p>
          <h2>{stats.newThisMonth}</h2>
          <span>Joined this month</span>
        </div>
        <div className="ops-stat-card">
          <p>Returning Customers</p>
          <h2>{stats.returning}</h2>
          <span>Repeat orders or bookings</span>
        </div>
      </section>

      <section className="ops-panel">
        <div className="ops-panel-top">
          <div className="ops-panel-heading">
            <h2>All Customers</h2>
            <p>Customer directory aggregated from orders and reservations.</p>
          </div>

          <div className="ops-toolbar">
            <input
              type="text"
              className="ops-input"
              placeholder="Search name, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <OpsDateRangePicker
              from={fromDate}
              to={toDate}
              placeholder="All Registration Dates"
              onApply={({ from, to }) => {
                setFromDate(from);
                setToDate(to);
              }}
            />
          </div>
        </div>

        <div className="ops-table-wrap">
          <table className="ops-table">
            <thead>
              <tr>
                <th>
                  <SortableHeader
                    label="Customer"
                    sortKey="customer"
                    sort={sort}
                    onSort={(k) => setSort((s) => nextSortState(s, k))}
                  />
                </th>
                <th>
                  <SortableHeader
                    label="Phone"
                    sortKey="phone"
                    sort={sort}
                    onSort={(k) => setSort((s) => nextSortState(s, k))}
                  />
                </th>
                <th>
                  <SortableHeader
                    label="Orders"
                    sortKey="orders"
                    sort={sort}
                    onSort={(k) => setSort((s) => nextSortState(s, k))}
                  />
                </th>
                <th>
                  <SortableHeader
                    label="Reservations"
                    sortKey="reservations"
                    sort={sort}
                    onSort={(k) => setSort((s) => nextSortState(s, k))}
                  />
                </th>
                <th>
                  <SortableHeader
                    label="Total Spent"
                    sortKey="spent"
                    sort={sort}
                    onSort={(k) => setSort((s) => nextSortState(s, k))}
                  />
                </th>
                <th>
                  <SortableHeader
                    label="First Seen"
                    sortKey="firstSeen"
                    sort={sort}
                    onSort={(k) => setSort((s) => nextSortState(s, k))}
                  />
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7}>Loading customers...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7}>No customers found.</td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.key}>
                    <td>
                      <strong>{c.name}</strong>
                      {c.email && <span className="ops-cell-sub">{c.email}</span>}
                    </td>
                    <td>{c.phone}</td>
                    <td>{c.totalOrders}</td>
                    <td>{c.reservationCount}</td>
                    <td>₹{c.totalSpentInr.toLocaleString("en-IN")}</td>
                    <td>
                      {new Date(c.firstSeen).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="ops-icon-btn"
                        title={`View ${c.name}`}
                        aria-label={`View ${c.name}`}
                        onClick={() => setSelected(c)}
                      >
                        <EyeIcon />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selected && (
        <div className="ops-modal-backdrop">
          <div className="ops-modal">
            <div className="ops-modal-header">
              <h2>{selected.name}</h2>
              <button
                type="button"
                className="ops-btn ops-btn-secondary ops-btn-sm"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
            <div className="ops-detail-row">
              <span>Email</span>
              <strong>{selected.email || "Not provided"}</strong>
            </div>
            <div className="ops-detail-row">
              <span>Phone</span>
              <strong>{selected.phone}</strong>
            </div>
            <div className="ops-detail-row">
              <span>Total Orders</span>
              <strong>{selected.totalOrders}</strong>
            </div>
            <div className="ops-detail-row">
              <span>Dining Reservations</span>
              <strong>{selected.reservationCount}</strong>
            </div>
            <div className="ops-detail-row">
              <span>Total Spent (INR / USD)</span>
              <strong>
                ₹{selected.totalSpentInr.toLocaleString("en-IN")} / $
                {selected.totalSpentUsd.toFixed(2)}
              </strong>
            </div>
            <div className="ops-detail-row">
              <span>Recent Order IDs</span>
              <strong>
                {selected.recentOrderNumbers.length > 0
                  ? selected.recentOrderNumbers.join(", ")
                  : "None"}
              </strong>
            </div>
          </div>
        </div>
      )}
    </OpsShell>
  );
}

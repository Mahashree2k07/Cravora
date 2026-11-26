"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { OpsShell } from "@/components/ops/OpsShell";
import { OpsSelect } from "@/components/ops/OpsSelect";
import { OpsDateRangePicker } from "@/components/ops/OpsDateRangePicker";
import { EyeIcon } from "@/components/ops/OpsIcons";
import {
  SortableHeader,
  nextSortState,
  sortRows,
  type SortState,
} from "@/components/ops/OpsTableSort";

type OrderRow = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string | null;
  pickupDate: string;
  pickupTime: string;
  total: number;
  currency: string;
  status: string;
  cancellationReason?: string | null;
  itemCount: number;
  createdAt: string;
};

type OrderStats = {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
};

export default function OpsOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [stats, setStats] = useState<OrderStats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sort, setSort] = useState<
    SortState<"id" | "customer" | "date" | "items" | "amount" | "time" | "status">
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sortedOrders = useMemo(
    () =>
      sortRows(orders, sort, {
        id: (o) => o.orderNumber,
        customer: (o) => o.customerName,
        date: (o) => new Date(o.createdAt).getTime(),
        items: (o) => o.itemCount,
        amount: (o) => o.total,
        time: (o) => new Date(o.pickupTime).getTime(),
        status: (o) => o.status,
      }),
    [orders, sort]
  );

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (status !== "all") params.set("status", status);
      if (fromDate) params.set("from", fromDate);
      if (toDate) params.set("to", toDate);

      const res = await fetch(`/api/ops/orders?${params.toString()}`);
      if (!res.ok) throw new Error("Unable to load orders.");
      const data = await res.json();
      setOrders(data.orders ?? []);
      if (data.stats) setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, [search, status, fromDate, toDate]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <OpsShell title="Orders" subtitle="Manage and track all customer orders.">
      {error && <div className="ops-alert error">{error}</div>}

      <section className="ops-stats-grid">
        <div className="ops-stat-card">
          <p>Total Orders</p>
          <h2>{stats.total}</h2>
          <span>All orders received</span>
        </div>
        <div className="ops-stat-card">
          <p>Pending</p>
          <h2>{stats.pending}</h2>
          <span>Awaiting confirmation</span>
        </div>
        <div className="ops-stat-card">
          <p>In Progress</p>
          <h2>{stats.inProgress}</h2>
          <span>Confirmed and preparing</span>
        </div>
        <div className="ops-stat-card">
          <p>Completed</p>
          <h2>{stats.completed}</h2>
          <span>Successfully fulfilled</span>
        </div>
      </section>

      <section className="ops-panel">
        <div className="ops-panel-top">
          <div className="ops-panel-heading">
            <h2>All Orders</h2>
            <p>View and manage customer orders.</p>
          </div>

          <div className="ops-toolbar">
            <input
              type="text"
              className="ops-input"
              placeholder="Search order ID or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <OpsSelect
              ariaLabel="Filter orders by status"
              value={status}
              onChange={setStatus}
              minWidth={155}
              options={[
                { value: "all", label: "All Statuses" },
                { value: "pending", label: "Pending" },
                { value: "confirmed", label: "Confirmed" },
                { value: "preparing", label: "Preparing" },
                { value: "ready_for_pickup", label: "Ready for Pickup" },
                { value: "completed", label: "Completed" },
                { value: "cancelled", label: "Cancelled" },
              ]}
            />

            <OpsDateRangePicker
              from={fromDate}
              to={toDate}
              placeholder="Filter by order date"
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
                    label="Order ID"
                    sortKey="id"
                    sort={sort}
                    onSort={(k) => setSort((s) => nextSortState(s, k))}
                  />
                </th>
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
                    label="Order Date"
                    sortKey="date"
                    sort={sort}
                    onSort={(k) => setSort((s) => nextSortState(s, k))}
                  />
                </th>
                <th>
                  <SortableHeader
                    label="Items"
                    sortKey="items"
                    sort={sort}
                    onSort={(k) => setSort((s) => nextSortState(s, k))}
                  />
                </th>
                <th>
                  <SortableHeader
                    label="Amount"
                    sortKey="amount"
                    sort={sort}
                    onSort={(k) => setSort((s) => nextSortState(s, k))}
                  />
                </th>
                <th>
                  <SortableHeader
                    label="Pickup Time"
                    sortKey="time"
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8}>Loading orders...</td>
                </tr>
              ) : sortedOrders.length === 0 ? (
                <tr>
                  <td colSpan={8}>No orders match your filters.</td>
                </tr>
              ) : (
                sortedOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.orderNumber}</strong>
                    </td>
                    <td>
                      <strong>{order.customerName}</strong>
                      {order.customerEmail && (
                        <span className="ops-cell-sub">
                          {order.customerEmail}
                        </span>
                      )}
                    </td>
                    <td>
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td>{order.itemCount} Items</td>
                    <td>
                      {order.currency === "USD" ? "$" : "₹"}
                      {order.total.toLocaleString("en-IN")}
                    </td>
                    <td>
                      {new Date(order.pickupTime).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        timeZone: "UTC",
                      })}
                    </td>
                    <td>
                      <span className={`ops-badge ${order.status}`}>
                        {order.status.replace(/_/g, " ")}
                      </span>
                      {order.status === "cancelled" &&
                        order.cancellationReason && (
                          <span
                            className="ops-cell-sub"
                            style={{
                              maxWidth: 210,
                              whiteSpace: "normal",
                            }}
                          >
                            Reason: {order.cancellationReason}
                          </span>
                        )}
                    </td>
                    <td>
                      <Link
                        href={`/ops/orders/${order.id}`}
                        className="ops-icon-btn"
                        title="View Order"
                        aria-label={`View order ${order.orderNumber}`}
                      >
                        <EyeIcon />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </OpsShell>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { OpsShell } from "@/components/ops/OpsShell";
import {
  SortableHeader,
  nextSortState,
  sortRows,
  type SortState,
} from "@/components/ops/OpsTableSort";

type DashboardData = {
  stats: {
    totalOrders: number;
    pendingOrders: number;
    todaysReservations: number;
    todaysRevenueInr: number;
    todaysRevenueUsd: number;
  };
  recentOrders: {
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    currency: string;
    status: string;
    itemCount: number;
  }[];
  upcomingReservations: {
    id: string;
    bookingNumber: string;
    guestName: string;
    guests: number;
    reservationDate: string;
    reservationTime: string;
    status: string;
  }[];
};

function formatCurrency(amount: number, currency: string) {
  const symbol = currency === "USD" ? "$" : "₹";
  return `${symbol}${amount.toLocaleString("en-IN")}`;
}

export default function OpsDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [sort, setSort] = useState<
    SortState<"orderNumber" | "customerName" | "total" | "status">
  >(null);
  const [error, setError] = useState("");

  const sortedRecentOrders = useMemo(
    () =>
      sortRows(data?.recentOrders ?? [], sort, {
        orderNumber: (o) => o.orderNumber,
        customerName: (o) => o.customerName,
        total: (o) => o.total,
        status: (o) => o.status,
      }),
    [data?.recentOrders, sort]
  );

  useEffect(() => {
    fetch("/api/ops/dashboard")
      .then(async (res) => {
        if (!res.ok) throw new Error("Unable to load dashboard.");
        return res.json();
      })
      .then(setData)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load.")
      );
  }, []);

  return (
    <OpsShell
      title="Dashboard"
      subtitle="Welcome back! Here's what's happening today."
    >
      {error && <div className="ops-alert error">{error}</div>}

      <section className="ops-stats-grid">
        <Link href="/ops/orders" className="ops-stat-card">
          <p>Total Orders</p>
          <h2>{data?.stats.totalOrders ?? "—"}</h2>
          <span>Orders received</span>
        </Link>

        <Link href="/ops/orders" className="ops-stat-card">
          <p>Pending Orders</p>
          <h2>{data?.stats.pendingOrders ?? "—"}</h2>
          <span>Awaiting confirmation</span>
        </Link>

        <Link href="/ops/reservations" className="ops-stat-card">
          <p>Reservations</p>
          <h2>{data?.stats.todaysReservations ?? "—"}</h2>
          <span>Today&apos;s reservations</span>
        </Link>

        <Link href="/ops/reports" className="ops-stat-card">
          <p>Today&apos;s Revenue</p>
          <h2>
            {data ? formatCurrency(data.stats.todaysRevenueInr, "INR") : "—"}
          </h2>
          <span>Revenue generated today</span>
        </Link>
      </section>

      <section className="ops-grid-2">
        <div className="ops-panel">
          <div className="ops-panel-top">
            <div className="ops-panel-heading">
              <h2>Recent Orders</h2>
              <p>Latest pickup orders placed by customers</p>
            </div>
            <Link href="/ops/orders" className="ops-btn ops-btn-secondary ops-btn-sm">
              View All
            </Link>
          </div>

          <div className="ops-table-wrap">
            <table className="ops-table" style={{ minWidth: 420 }}>
              <thead>
                <tr>
                  <th>
                    <SortableHeader
                      label="Order ID"
                      sortKey="orderNumber"
                      sort={sort}
                      onSort={(k) => setSort((s) => nextSortState(s, k))}
                    />
                  </th>
                  <th>
                    <SortableHeader
                      label="Customer"
                      sortKey="customerName"
                      sort={sort}
                      onSort={(k) => setSort((s) => nextSortState(s, k))}
                    />
                  </th>
                  <th>
                    <SortableHeader
                      label="Amount"
                      sortKey="total"
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
                </tr>
              </thead>
              <tbody>
                {!data || sortedRecentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4}>No orders yet.</td>
                  </tr>
                ) : (
                  sortedRecentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <Link
                          href={`/ops/orders/${order.id}`}
                          style={{ color: "#A45B3C", fontWeight: 600 }}
                        >
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td>{order.customerName}</td>
                      <td>{formatCurrency(order.total, order.currency)}</td>
                      <td>
                        <span className={`ops-badge ${order.status}`}>
                          {order.status.replace(/_/g, " ")}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ops-panel">
          <div className="ops-panel-top">
            <div className="ops-panel-heading">
              <h2>Upcoming Reservations</h2>
              <p>Next scheduled dining bookings</p>
            </div>
            <Link
              href="/ops/reservations"
              className="ops-btn ops-btn-secondary ops-btn-sm"
            >
              View All
            </Link>
          </div>

          {!data || data.upcomingReservations.length === 0 ? (
            <p style={{ fontSize: 13, color: "#766D63" }}>
              No upcoming reservations found.
            </p>
          ) : (
            data.upcomingReservations.map((res) => (
              <div key={res.id} className="ops-detail-row">
                <div>
                  <strong>{res.guestName}</strong>
                  <span className="ops-cell-sub">
                    {res.guests} Guests •{" "}
                    {new Date(res.reservationDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </div>
                <span className={`ops-badge ${res.status}`}>{res.status}</span>
              </div>
            ))
          )}
        </div>
      </section>
    </OpsShell>
  );
}

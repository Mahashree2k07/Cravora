"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { OpsShell } from "@/components/ops/OpsShell";
import { OpsDateRangePicker } from "@/components/ops/OpsDateRangePicker";
import {
  SortableHeader,
  nextSortState,
  sortRows,
  type SortState,
} from "@/components/ops/OpsTableSort";

type ReportsData = {
  summary: {
    revenueInr: number;
    revenueUsd: number;
    totalOrders: number;
    averageOrderInr: number;
    totalCustomers: number;
  };
  statusCounts: {
    completed: number;
    preparing: number;
    pending: number;
    cancelled: number;
  };
  chartSeries: { label: string; amount: number }[];
  topItems: { name: string; quantity: number; revenue: number }[];
};

export default function OpsReportsPage() {
  const [data, setData] = useState<ReportsData | null>(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sort, setSort] = useState<
    SortState<"name" | "quantity" | "revenue">
  >(null);
  const [error, setError] = useState("");

  const sortedTopItems = useMemo(
    () =>
      sortRows(data?.topItems ?? [], sort, {
        name: (i) => i.name,
        quantity: (i) => i.quantity,
        revenue: (i) => i.revenue,
      }),
    [data?.topItems, sort]
  );

  const loadReports = useCallback(async () => {
    setError("");
    try {
      const params = new URLSearchParams();
      if (fromDate) params.set("from", fromDate);
      if (toDate) params.set("to", toDate);

      const res = await fetch(`/api/ops/reports?${params.toString()}`);
      if (!res.ok) throw new Error("Unable to load reports.");
      setData(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reports.");
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const maxBar = Math.max(
    1,
    ...(data?.chartSeries.map((c) => c.amount) ?? [1])
  );

  return (
    <OpsShell
      title="Reports & Analytics"
      subtitle="Track your restaurant's performance and business insights."
      headerRight={
        <OpsDateRangePicker
          from={fromDate}
          to={toDate}
          placeholder="Select report date range"
          onApply={({ from, to }) => {
            setFromDate(from);
            setToDate(to);
          }}
        />
      }
    >
      {error && <div className="ops-alert error">{error}</div>}

      <section className="ops-stats-grid">
        <div className="ops-stat-card">
          <p>Total Revenue</p>
          <h2>
            {data
              ? `₹${data.summary.revenueInr.toLocaleString("en-IN")}`
              : "—"}
          </h2>
          <span>Excludes cancelled orders</span>
        </div>
        <div className="ops-stat-card">
          <p>Total Orders</p>
          <h2>{data?.summary.totalOrders ?? "—"}</h2>
          <span>Across selected period</span>
        </div>
        <div className="ops-stat-card">
          <p>Average Order Value</p>
          <h2>
            {data
              ? `₹${data.summary.averageOrderInr.toLocaleString("en-IN")}`
              : "—"}
          </h2>
          <span>INR orders average</span>
        </div>
        <div className="ops-stat-card">
          <p>Total Customers</p>
          <h2>{data?.summary.totalCustomers ?? "—"}</h2>
          <span>Unique ordering customers</span>
        </div>
      </section>

      <section className="ops-grid-2">
        <div className="ops-panel">
          <div className="ops-panel-top">
            <div className="ops-panel-heading">
              <h2>Revenue Overview</h2>
              <p>Revenue generated across period quartiles</p>
            </div>
          </div>
          <div className="ops-chart-bars">
            {(data?.chartSeries ?? []).map((bar) => (
              <div key={bar.label} className="ops-chart-col">
                <span style={{ fontSize: 11, color: "#766D63" }}>
                  ₹{bar.amount.toLocaleString("en-IN")}
                </span>
                <div
                  className="ops-chart-bar"
                  style={{
                    height: `${Math.max(8, Math.round((bar.amount / maxBar) * 140))}px`,
                  }}
                />
                <span style={{ fontSize: 11, color: "#766D63" }}>
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="ops-panel">
          <div className="ops-panel-heading" style={{ marginBottom: 14 }}>
            <h2>Order Status Breakdown</h2>
            <p>Overview of order completion</p>
          </div>
          <div className="ops-detail-row">
            <span>Completed</span>
            <strong>{data?.statusCounts.completed ?? 0}</strong>
          </div>
          <div className="ops-detail-row">
            <span>Preparing / Confirmed</span>
            <strong>{data?.statusCounts.preparing ?? 0}</strong>
          </div>
          <div className="ops-detail-row">
            <span>Pending</span>
            <strong>{data?.statusCounts.pending ?? 0}</strong>
          </div>
          <div className="ops-detail-row">
            <span>Cancelled</span>
            <strong>{data?.statusCounts.cancelled ?? 0}</strong>
          </div>
        </div>
      </section>

      <section className="ops-panel">
        <div className="ops-panel-heading" style={{ marginBottom: 14 }}>
          <h2>Top-Selling Menu Items</h2>
          <p>Most ordered dishes in the selected range</p>
        </div>

        <div className="ops-table-wrap">
          <table className="ops-table" style={{ minWidth: 420 }}>
            <thead>
              <tr>
                <th>
                  <SortableHeader
                    label="Dish Name"
                    sortKey="name"
                    sort={sort}
                    onSort={(k) => setSort((s) => nextSortState(s, k))}
                  />
                </th>
                <th>
                  <SortableHeader
                    label="Quantity Sold"
                    sortKey="quantity"
                    sort={sort}
                    onSort={(k) => setSort((s) => nextSortState(s, k))}
                  />
                </th>
                <th>
                  <SortableHeader
                    label="Revenue"
                    sortKey="revenue"
                    sort={sort}
                    onSort={(k) => setSort((s) => nextSortState(s, k))}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {!data || sortedTopItems.length === 0 ? (
                <tr>
                  <td colSpan={3}>No order item data yet.</td>
                </tr>
              ) : (
                sortedTopItems.map((item) => (
                  <tr key={item.name}>
                    <td>
                      <strong>{item.name}</strong>
                    </td>
                    <td>{item.quantity}</td>
                    <td>₹{item.revenue.toLocaleString("en-IN")}</td>
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

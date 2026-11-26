"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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

type EnquiryRow = {
  id: string;
  enquiryNumber: string;
  customerName: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
};

export default function OpsEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<EnquiryRow[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sort, setSort] = useState<
    SortState<"id" | "customer" | "subject" | "date" | "status">
  >(null);
  const [selected, setSelected] = useState<EnquiryRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sortedEnquiries = useMemo(
    () =>
      sortRows(enquiries, sort, {
        id: (e) => e.enquiryNumber,
        customer: (e) => e.customerName,
        subject: (e) => e.subject,
        date: (e) => new Date(e.createdAt).getTime(),
        status: (e) => e.status,
      }),
    [enquiries, sort]
  );

  const loadEnquiries = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (fromDate) params.set("from", fromDate);
      if (toDate) params.set("to", toDate);

      const res = await fetch(`/api/ops/enquiries?${params.toString()}`);
      if (!res.ok) throw new Error("Unable to load enquiries.");
      const data = await res.json();
      setEnquiries(data.enquiries ?? []);
      if (data.stats) setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, fromDate, toDate]);

  useEffect(() => {
    loadEnquiries();
  }, [loadEnquiries]);

  async function updateStatus(id: string, nextStatus: string) {
    setError("");
    try {
      const res = await fetch(`/api/ops/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error("Unable to update enquiry status.");
      if (selected && selected.id === id) {
        setSelected({ ...selected, status: nextStatus });
      }
      await loadEnquiries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    }
  }

  return (
    <OpsShell
      title="Enquiries"
      subtitle="Manage customer questions, feedback and partnership requests."
    >
      {error && <div className="ops-alert error">{error}</div>}

      <section className="ops-stats-grid">
        <div className="ops-stat-card">
          <p>Total Enquiries</p>
          <h2>{stats.total}</h2>
          <span>All customer enquiries</span>
        </div>
        <div className="ops-stat-card">
          <p>New</p>
          <h2>{stats.new}</h2>
          <span>Awaiting review</span>
        </div>
        <div className="ops-stat-card">
          <p>In Progress</p>
          <h2>{stats.inProgress}</h2>
          <span>Currently being handled</span>
        </div>
        <div className="ops-stat-card">
          <p>Resolved</p>
          <h2>{stats.resolved}</h2>
          <span>Successfully completed</span>
        </div>
      </section>

      <section className="ops-panel">
        <div className="ops-panel-top">
          <div className="ops-panel-heading">
            <h2>All Enquiries</h2>
            <p>Review and respond to customer enquiries.</p>
          </div>

          <div className="ops-toolbar">
            <input
              type="text"
              className="ops-input"
              placeholder="Search customer, email, subject or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <OpsSelect
              ariaLabel="Filter by status"
              value={statusFilter}
              onChange={setStatusFilter}
              minWidth={135}
              options={[
                { value: "all", label: "All Statuses" },
                { value: "new", label: "New" },
                { value: "in_progress", label: "In Progress" },
                { value: "resolved", label: "Resolved" },
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
          </div>
        </div>

        <div className="ops-table-wrap">
          <table className="ops-table">
            <thead>
              <tr>
                <th>
                  <SortableHeader
                    label="Enquiry ID"
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
                    label="Subject"
                    sortKey="subject"
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
                  <td colSpan={6}>Loading enquiries...</td>
                </tr>
              ) : sortedEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={6}>No enquiries found.</td>
                </tr>
              ) : (
                sortedEnquiries.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <strong>{e.enquiryNumber}</strong>
                    </td>
                    <td>
                      <strong>{e.customerName}</strong>
                      <span className="ops-cell-sub">{e.email}</span>
                    </td>
                    <td>
                      {e.subject.includes("-")
                        ? e.subject.replace(/-/g, " ")
                        : e.subject}
                    </td>
                    <td>
                      {new Date(e.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <span className={`ops-badge ${e.status}`}>
                        {e.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="ops-icon-btn"
                        title={`View enquiry ${e.enquiryNumber}`}
                        aria-label={`View enquiry ${e.enquiryNumber}`}
                        onClick={() => setSelected(e)}
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
              <h2>{selected.enquiryNumber}</h2>
              <button
                type="button"
                className="ops-btn ops-btn-secondary ops-btn-sm"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
            <div className="ops-detail-row">
              <span>Customer</span>
              <strong>{selected.customerName}</strong>
            </div>
            <div className="ops-detail-row">
              <span>Email</span>
              <strong>{selected.email}</strong>
            </div>
            <div className="ops-detail-row">
              <span>Subject</span>
              <strong style={{ textTransform: "capitalize" }}>
                {selected.subject.replace(/-/g, " ")}
              </strong>
            </div>
            <div style={{ margin: "14px 0" }}>
              <span
                style={{ display: "block", fontSize: 12, color: "#766D63", marginBottom: 6 }}
              >
                Message
              </span>
              <div
                style={{
                  padding: 12,
                  background: "#FCFBF8",
                  border: "1px solid #E5DED2",
                  borderRadius: 8,
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                {selected.message}
              </div>
            </div>
            <div className="ops-field">
              <label>Update Status</label>
              <OpsSelect
                ariaLabel="Update Enquiry Status"
                fullWidth
                value={selected.status}
                onChange={(val) => updateStatus(selected.id, val)}
                options={[
                  { value: "new", label: "New" },
                  { value: "in_progress", label: "In Progress" },
                  { value: "resolved", label: "Resolved" },
                ]}
              />
            </div>
          </div>
        </div>
      )}
    </OpsShell>
  );
}

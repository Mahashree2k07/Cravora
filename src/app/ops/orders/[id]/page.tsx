"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { OpsShell } from "@/components/ops/OpsShell";
import { OpsSelect } from "@/components/ops/OpsSelect";

const ORDER_CANCEL_REASONS = [
  "Restaurant closed",
  "Items currently unavailable",
  "Kitchen at full capacity",
  "Customer requested cancellation",
];

type OrderDetail = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  pickupDate: string;
  pickupTime: string;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  status: string;
  cancellationReason: string | null;
  createdAt: string;
  items: {
    id: string;
    itemName: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }[];
};

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "ready_for_pickup", label: "Ready for Pickup" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function OpsOrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [statusValue, setStatusValue] = useState("pending");
  const [cancelReason, setCancelReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [modalCancelReason, setModalCancelReason] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/ops/orders/${params.id}`);
        if (!res.ok) throw new Error("Order not found.");
        const data = await res.json();
        setOrder(data.order);
        setStatusValue(data.order.status);
        setCancelReason(data.order.cancellationReason ?? "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  async function updateStatus(nextStatus: string, reason?: string) {
    if (!order) return;
    const trimmedReason = (reason ?? cancelReason).trim();
    if (nextStatus === "cancelled" && !trimmedReason) {
      setError("Please enter a cancellation reason so the customer knows why.");
      return false;
    }

    setSaving(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch(`/api/ops/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: nextStatus,
          cancellationReason: nextStatus === "cancelled" ? trimmedReason : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed.");
      setOrder({
        ...order,
        status: nextStatus,
        cancellationReason: nextStatus === "cancelled" ? trimmedReason : null,
      });
      setStatusValue(nextStatus);
      setCancelReason(nextStatus === "cancelled" ? trimmedReason : "");
      setMessage("Order status updated.");
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleModalCancel(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const ok = await updateStatus("cancelled", modalCancelReason);
    if (ok) {
      setConfirmCancelOpen(false);
      setModalCancelReason("");
    }
  }

  const symbol = order?.currency === "USD" ? "$" : "₹";

  return (
    <OpsShell
      title="Order Details"
      subtitle="View and manage customer order fulfillment."
    >
      <div style={{ marginBottom: 14 }}>
        <Link href="/ops/orders" className="ops-btn ops-btn-secondary ops-btn-sm">
          ← Back to Orders
        </Link>
      </div>

      {error && <div className="ops-alert error">{error}</div>}
      {message && <div className="ops-alert success">{message}</div>}

      {loading || !order ? (
        <div className="ops-panel">
          {loading ? "Loading order details..." : "Order not available."}
        </div>
      ) : (
        <>
          <section
            className="ops-panel"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <span style={{ fontSize: 11, color: "#766D63" }}>ORDER ID</span>
              <h2 style={{ margin: "4px 0" }}>{order.orderNumber}</h2>
              <p style={{ margin: 0, fontSize: 12, color: "#766D63" }}>
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <span className={`ops-badge ${order.status}`}>
              {order.status.replace(/_/g, " ")}
            </span>
          </section>

          {order.status === "cancelled" && order.cancellationReason && (
            <div className="ops-alert error">
              <strong>Cancellation Reason Shown to Customer:</strong>{" "}
              {order.cancellationReason}
            </div>
          )}

          <section className="ops-grid-2">
            <div>
              <div className="ops-panel">
                <h3 style={{ marginTop: 0 }}>Customer Information</h3>
                <div className="ops-detail-row">
                  <span>Customer Name</span>
                  <strong>{order.customerName}</strong>
                </div>
                <div className="ops-detail-row">
                  <span>Email Address</span>
                  <strong>{order.customerEmail || "Not provided"}</strong>
                </div>
                <div className="ops-detail-row">
                  <span>Phone Number</span>
                  <strong>{order.customerPhone}</strong>
                </div>
              </div>

              <div className="ops-panel">
                <h3 style={{ marginTop: 0 }}>Ordered Items</h3>
                {order.items.map((item) => (
                  <div key={item.id} className="ops-detail-row">
                    <div>
                      <strong>{item.itemName}</strong>
                      <span className="ops-cell-sub">
                        {item.quantity} × {symbol}
                        {item.unitPrice.toFixed(2)}
                      </span>
                    </div>
                    <strong>
                      {symbol}
                      {item.lineTotal.toFixed(2)}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="ops-panel">
                <h3 style={{ marginTop: 0 }}>Pickup Information</h3>
                <div className="ops-detail-row">
                  <span>Pickup Date</span>
                  <strong>
                    {new Date(order.pickupDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </strong>
                </div>
                <div className="ops-detail-row">
                  <span>Pickup Time</span>
                  <strong>
                    {new Date(order.pickupTime).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      timeZone: "UTC",
                    })}
                  </strong>
                </div>
              </div>
            </div>

            <div>
              <div className="ops-panel">
                <h3 style={{ marginTop: 0 }}>Order Summary</h3>
                <div className="ops-detail-row">
                  <span>Items Count</span>
                  <strong>
                    {order.items.reduce((s, i) => s + i.quantity, 0)} Items
                  </strong>
                </div>
                <div className="ops-detail-row">
                  <span>Subtotal</span>
                  <strong>
                    {symbol}
                    {order.subtotal.toFixed(2)}
                  </strong>
                </div>
                <div className="ops-detail-row">
                  <span>Total Amount</span>
                  <strong>
                    {symbol}
                    {order.total.toFixed(2)}
                  </strong>
                </div>
              </div>

              <div className="ops-panel">
                <h3 style={{ marginTop: 0 }}>Update Order Status</h3>
                <div className="ops-field" style={{ marginBottom: 12 }}>
                  <label htmlFor="ops-order-status">Current Order Status</label>
                  <OpsSelect
                    id="ops-order-status"
                    ariaLabel="Current Order Status"
                    fullWidth
                    value={statusValue}
                    onChange={setStatusValue}
                    options={STATUS_OPTIONS}
                  />
                </div>
                {statusValue === "cancelled" && (
                  <div className="ops-field" style={{ marginBottom: 12 }}>
                    <label htmlFor="ops-cancel-reason">
                      Cancellation Reason
                      <span className="ops-required-star">*</span>
                    </label>
                    <textarea
                      id="ops-cancel-reason"
                      className="ops-textarea"
                      rows={3}
                      placeholder="Explain why this order is being cancelled (e.g. Restaurant closed, item unavailable)..."
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      required
                    />
                    <div className="ops-tag-chips" style={{ marginTop: 6 }}>
                      {ORDER_CANCEL_REASONS.map((preset) => (
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
                )}
                <button
                  type="button"
                  className="ops-btn"
                  style={{ width: "100%" }}
                  disabled={
                    saving ||
                    (statusValue === "cancelled" && !cancelReason.trim())
                  }
                  onClick={() => updateStatus(statusValue)}
                >
                  {saving ? "Updating..." : "Update Status"}
                </button>
              </div>

              {order.status !== "cancelled" && (
                <div className="ops-panel">
                  <h3 style={{ marginTop: 0 }}>Order Actions</h3>
                  <button
                    type="button"
                    className="ops-btn ops-btn-danger"
                    style={{ width: "100%" }}
                    disabled={saving}
                    onClick={() => {
                      setModalCancelReason(cancelReason);
                      setConfirmCancelOpen(true);
                    }}
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {confirmCancelOpen && order && (
        <div className="ops-modal-backdrop">
          <div className="ops-modal" style={{ maxWidth: 480 }}>
            <div className="ops-modal-header">
              <h2>Cancel Order {order.orderNumber}</h2>
              <button
                type="button"
                className="ops-modal-close"
                aria-label="Close modal"
                onClick={() => setConfirmCancelOpen(false)}
              >
                &times;
              </button>
            </div>
            <form
              onSubmit={handleModalCancel}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              <div className="ops-field">
                <label htmlFor="ops-modal-cancel-reason">
                  Reason for Cancellation
                  <span className="ops-required-star">*</span>
                </label>
                <textarea
                  id="ops-modal-cancel-reason"
                  className="ops-textarea"
                  rows={3}
                  placeholder="Write a clear message for the customer (e.g. Shop closed today, ingredients out of stock)..."
                  value={modalCancelReason}
                  onChange={(e) => setModalCancelReason(e.target.value)}
                  required
                />
                <div className="ops-tag-chips" style={{ marginTop: 6 }}>
                  {ORDER_CANCEL_REASONS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      className={`ops-tag-chip${
                        modalCancelReason === preset ? " selected" : ""
                      }`}
                      onClick={() => setModalCancelReason(preset)}
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
                  disabled={saving}
                  onClick={() => setConfirmCancelOpen(false)}
                >
                  Keep Order
                </button>
                <button
                  type="submit"
                  className="ops-btn ops-btn-danger"
                  disabled={saving || !modalCancelReason.trim()}
                >
                  {saving ? "Cancelling..." : "Confirm Cancellation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </OpsShell>
  );
}

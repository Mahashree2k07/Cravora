
"use client";

import { Fragment, useMemo, useState, type FormEvent } from "react";
import styles from "./my-activity.module.css";

type OrderItem = {
  id: string;
  itemName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

type Order = {
  id: string;
  orderNumber: string;
  date: string;
  pickupDate: string;
  pickupTime: string;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  status: string;
  items: OrderItem[];
};

type Reservation = {
  id: string;
  bookingNumber: string;
  guestName: string;
  reservationDate: string;
  reservationTime: string;
  guests: number;
  duration: string;
  seatingPreference: string;
  specialRequest: string | null;
  status: string;
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatTime = (value: string) => {
  const time = new Date(value).toISOString().slice(11, 16);
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${suffix}`;
};

const formatMoney = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency || "INR",
    maximumFractionDigits: 2,
  }).format(amount);

const displayStatus = (status: string) =>
  status.toLowerCase() === "pending" ? "Processing" : status;

const statusClass = (status: string) => {
  const value = status.toLowerCase();

  if (value === "completed") return styles.completed;
  if (value === "cancelled") return styles.cancelled;

  return styles.processing;
};

export default function MyActivityPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const [activeTab, setActiveTab] = useState<"orders" | "reservations">("orders");

  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reservationsLoaded, setReservationsLoaded] = useState(false);

  // Order search and filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Reservation search and filter
  const [reservationSearch, setReservationSearch] = useState("");
  const [reservationStatusFilter, setReservationStatusFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const pageSize = 5;

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = order.orderNumber
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const normalized = order.status.toLowerCase();

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "processing" &&
          (normalized === "processing" || normalized === "pending")) ||
        normalized === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  // Filter reservations
  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const query = reservationSearch.trim().toLowerCase();

      const matchesSearch =
        reservation.bookingNumber.toLowerCase().includes(query) ||
        reservation.guestName.toLowerCase().includes(query) ||
        reservation.seatingPreference.toLowerCase().includes(query) ||
        formatDate(reservation.reservationDate).toLowerCase().includes(query) ||
        formatTime(reservation.reservationTime).toLowerCase().includes(query);

      const normalized = reservation.status.toLowerCase();

      const matchesStatus =
        reservationStatusFilter === "all" ||
        (reservationStatusFilter === "processing" &&
          (normalized === "processing" || normalized === "pending")) ||
        normalized === reservationStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reservations, reservationSearch, reservationStatusFilter]);

  // Order pagination
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));

  const visibleOrders = filteredOrders.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Send verification code
  async function sendCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/orders/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to send code.");
      }

      setOtpSent(true);
      setMessage(data.message);
      setMessageType("success");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to send code."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  // Verify code and load orders and reservations
  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/orders/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification failed.");
      }

      const [ordersResponse, reservationsResponse] = await Promise.all([
        fetch("/api/orders/my-orders"),
        fetch("/api/dining-reservations/my-reservations"),
      ]);

      const ordersData = await ordersResponse.json();
      const reservationsData = await reservationsResponse.json();

      if (!ordersResponse.ok) {
        throw new Error(ordersData.message || "Unable to load your orders.");
      }

      if (!reservationsResponse.ok) {
        throw new Error(
          reservationsData.message || "Unable to load your reservations."
        );
      }

      setOrders(ordersData.orders || []);
      setReservations(reservationsData.reservations || []);
      setReservationsLoaded(true);
      setVerified(true);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Verification failed."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  // Log out
  async function logout() {
    setLoading(true);

    try {
      await fetch("/api/orders/logout", { method: "POST" });
    } finally {
      setEmail("");
      setOtp("");
      setOtpSent(false);
      setVerified(false);
      setOrders([]);
      setReservations([]);
      setReservationsLoaded(false);
      setSearch("");
      setStatusFilter("all");
      setReservationSearch("");
      setReservationStatusFilter("all");
      setPage(1);
      setExpandedOrder(null);
      setMessage("");
      setLoading(false);
    }
  }

  return (
    <>
      {/* Header */}
      <header className="site-header">
        <div className="container header-inner">
          <a href="/" className="logo">
            cravora<span>.</span>
          </a>

          <nav className="main-nav">
            <a href="/">Home</a>
            <a href="/dining">Dining</a>
            <a href="/order">Order Online</a>
            <a href="/my-activity" className="active" aria-current="page">
              My Activity
            </a>
            <a href="/about">Our Story</a>
            <a href="/contact">Contact</a>
          </nav>

          <div className="header-actions">
            <a href="/order" className="btn btn-primary">
              Order Now
            </a>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.heading}>
            <h1>My Activity</h1>
            <p>Manage your Cravora orders and dining reservations.</p>
          </div>

          {!verified ? (
            <section className={styles.authCard}>
              <h2>Access Your Orders</h2>

              <p>
                Enter the email address you used when placing your order or
                dining reservation. We&apos;ll send you a verification code.
              </p>

              <form onSubmit={sendCode}>
                <label htmlFor="activity-email">Email Address</label>

                <input
                  id="activity-email"
                  type="email"
                  placeholder="Enter your email address"
                  maxLength={255}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  disabled={loading || otpSent}
                />

                <button
                  className={styles.primaryButton}
                  disabled={loading || otpSent}
                >
                  {loading
                    ? "Sending..."
                    : otpSent
                      ? "Code Sent"
                      : "Send Verification Code"}
                </button>
              </form>

              {otpSent && (
                <form onSubmit={verifyCode} className={styles.otpForm}>
                  <label htmlFor="activity-otp">
                    Six-Digit Verification Code
                  </label>

                  <input
                    id="activity-otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="Enter verification code"
                    maxLength={6}
                    pattern="[0-9]{6}"
                    value={otp}
                    onChange={(event) =>
                      setOtp(event.target.value.replace(/\D/g, ""))
                    }
                    required
                  />

                  <button
                    className={styles.primaryButton}
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify and View Orders"}
                  </button>

                  <button
                    type="button"
                    className={styles.resendButton}
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                      setMessage("");
                    }}
                  >
                    Change email address
                  </button>
                </form>
              )}

              {message && (
                <p
                  className={`${styles.message} ${
                    messageType === "error" ? styles.error : styles.success
                  }`}
                >
                  {message}
                </p>
              )}
            </section>
          ) : (
            <section className={styles.activitySection}>
              {/* Tabs */}
              <div className={styles.tabs}>
                <button
                  className={activeTab === "orders" ? styles.activeTab : ""}
                  onClick={() => setActiveTab("orders")}
                >
                  My Orders
                </button>

                <button
                  className={
                    activeTab === "reservations" ? styles.activeTab : ""
                  }
                  onClick={() => setActiveTab("reservations")}
                >
                  My Reservations
                </button>
              </div>

              {/* Orders */}
              {activeTab === "orders" ? (
                <div>
                  <h2 className={styles.sectionTitle}>
                    Your Order History
                  </h2>

                  <div className={styles.toolbar}>
                    <input
                      type="search"
                      placeholder="Search by order ID..."
                      aria-label="Search orders"
                      value={search}
                      onChange={(event) => {
                        setSearch(event.target.value);
                        setPage(1);
                      }}
                    />

                    <select
                      aria-label="Filter orders by status"
                      value={statusFilter}
                      onChange={(event) => {
                        setStatusFilter(event.target.value);
                        setPage(1);
                      }}
                    >
                      <option value="all">All Orders</option>
                      <option value="completed">Completed</option>
                      <option value="processing">Processing</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {visibleOrders.length === 0 ? (
                    <div className={styles.empty}>
                      <h3>Order History</h3>

                      <p>
                        {orders.length === 0
                          ? "Your orders will appear here once you place an order."
                          : "No orders match your search or selected filter."}
                      </p>
                    </div>
                  ) : (
                    <div className={styles.tableWrap}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Details</th>
                          </tr>
                        </thead>

                        <tbody>
                          {visibleOrders.map((order) => (
                            <Fragment key={order.id}>
                              <tr>
                                <td className={styles.orderId}>
                                  {order.orderNumber}
                                </td>

                                <td>{formatDate(order.date)}</td>

                                <td>
                                  {order.items.reduce(
                                    (sum, item) => sum + item.quantity,
                                    0
                                  )}
                                </td>

                                <td>
                                  {formatMoney(order.total, order.currency)}
                                </td>

                                <td>
                                  <span
                                    className={`${styles.status} ${statusClass(
                                      order.status
                                    )}`}
                                  >
                                    {displayStatus(order.status)}
                                  </span>
                                </td>

                                <td>
                                  <button
                                    className={styles.viewButton}
                                    aria-label={`View details for ${order.orderNumber}`}
                                    aria-expanded={expandedOrder === order.id}
                                    onClick={() =>
                                      setExpandedOrder(
                                        expandedOrder === order.id
                                          ? null
                                          : order.id
                                      )
                                    }
                                  >
                                    {expandedOrder === order.id
                                      ? "Close"
                                      : "View"}
                                  </button>
                                </td>
                              </tr>

                              {expandedOrder === order.id && (
                                <tr className={styles.detailsRow}>
                                  <td colSpan={6}>
                                    <div className={styles.detailItems}>
                                      {order.items.map((item) => (
                                        <div
                                          key={item.id}
                                          className={styles.detailItem}
                                        >
                                          <span>
                                            {item.itemName} × {item.quantity}
                                          </span>

                                          <span>
                                            {formatMoney(
                                              item.lineTotal,
                                              order.currency
                                            )}
                                          </span>
                                        </div>
                                      ))}
                                    </div>

                                    <div className={styles.detailTotal}>
                                      <span>Total</span>
                                      <span>
                                        {formatMoney(
                                          order.total,
                                          order.currency
                                        )}
                                      </span>
                                    </div>

                                    <p className={styles.pickup}>
                                      Pickup: {formatDate(order.pickupDate)} at{" "}
                                      {formatTime(order.pickupTime)}
                                    </p>
                                  </td>
                                </tr>
                              )}
                            </Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Pagination */}
                  {filteredOrders.length > 0 && (
                    <div className={styles.pagination}>
                      <span>
                        Showing {(page - 1) * pageSize + 1}–
                        {Math.min(page * pageSize, filteredOrders.length)} of{" "}
                        {filteredOrders.length} orders
                      </span>

                      <div>
                        <button
                          disabled={page === 1}
                          onClick={() => setPage((value) => value - 1)}
                        >
                          Previous
                        </button>

                        <span className={styles.pageNumber}>
                          {page} / {totalPages}
                        </span>

                        <button
                          disabled={page === totalPages}
                          onClick={() => setPage((value) => value + 1)}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Reservations */
                <div>
                  <h2 className={styles.sectionTitle}>
                    Your Dining Reservations
                  </h2>

                  <div className={styles.toolbar}>
                    <input
                      type="search"
                      placeholder="Search by booking ID, guest name..."
                      aria-label="Search reservations"
                      value={reservationSearch}
                      onChange={(event) =>
                        setReservationSearch(event.target.value)
                      }
                    />

                    <select
                      aria-label="Filter reservations by status"
                      value={reservationStatusFilter}
                      onChange={(event) =>
                        setReservationStatusFilter(event.target.value)
                      }
                    >
                      <option value="all">All Reservations</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {!reservationsLoaded ||
                  filteredReservations.length === 0 ? (
                    <div className={styles.empty}>
                      <h3>Reservation History</h3>

                      <p>
                        {reservations.length === 0
                          ? "Your dining reservations will appear here."
                          : "No reservations match your search or selected filter."}
                      </p>
                    </div>
                  ) : (
                    <div className={styles.tableWrap}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Booking ID</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Guests</th>
                            <th>Seating</th>
                            <th>Status</th>
                          </tr>
                        </thead>

                        <tbody>
                          {filteredReservations.map((reservation) => (
                            <tr key={reservation.id}>
                              <td className={styles.orderId}>
                                {reservation.bookingNumber}
                              </td>

                              <td>
                                {formatDate(reservation.reservationDate)}
                              </td>

                              <td>
                                {formatTime(reservation.reservationTime)}
                              </td>

                              <td>{reservation.guests}</td>

                              <td>{reservation.seatingPreference}</td>

                              <td>
                                <span
                                  className={`${styles.status} ${statusClass(
                                    reservation.status
                                  )}`}
                                >
                                  {displayStatus(reservation.status)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Log out */}
              <button
                className={styles.logoutButton}
                onClick={logout}
                disabled={loading}
              >
                Log Out
              </button>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <a href="/" className="logo">
              cravora<span>.</span>
            </a>

            <p>
              Good food. Better living. Creating experiences that bring people
              together, one meal at a time.
            </p>
          </div>

          <div className="footer-column">
            <h4>Explore</h4>
            <a href="/dining">Dining</a>
            <a href="/order">Order Online</a>
            <a href="/my-activity" className="active" aria-current="page">
              My Activity
            </a>
          </div>

          <div className="footer-column">
            <h4>Information</h4>
            <a href="/about">Our Story</a>
            <a href="/contact">Contact</a>
          </div>
        </div>

        <div className="container footer-bottom">
          <p>&copy; 2026 Cravora. All rights reserved.</p>
          <p>Good Food. Great Moments.</p>
        </div>
      </footer>
    </>
  );
}

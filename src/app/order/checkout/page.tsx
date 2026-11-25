
"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

const CART_KEY = "cravora_wireframe_cart";
const CURRENCY_KEY = "cravora_wireframe_currency";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currency, setCurrency] = useState("INR");
  const [loaded, setLoaded] = useState(false);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [pickupDetails, setPickupDetails] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [pickupDate, setPickupDate] = useState("");

  // Custom calendar states
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const calendarRef = useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside or pressing Escape
  useEffect(() => {
    if (!calendarOpen) return;

    function handleCalendarOutsideClick(event: PointerEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setCalendarOpen(false);
      }
    }

    function handleCalendarEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setCalendarOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleCalendarOutsideClick);
    document.addEventListener("keydown", handleCalendarEscape);

    return () => {
      document.removeEventListener("pointerdown", handleCalendarOutsideClick);
      document.removeEventListener("keydown", handleCalendarEscape);
    };
  }, [calendarOpen]);

  // Pickup time states
  const [pickupTime, setPickupTime] = useState("");
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);

  const timePickerRef = useRef<HTMLDivElement>(null);

  // Close time dropdown when clicking outside or pressing Escape
  useEffect(() => {
    if (!timeDropdownOpen) return;

    function handleOutsideClick(event: PointerEvent) {
      if (
        timePickerRef.current &&
        !timePickerRef.current.contains(event.target as Node)
      ) {
        setTimeDropdownOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setTimeDropdownOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [timeDropdownOpen]);

  const symbol = currency === "INR" ? "₹" : "$";

  // Load cart and currency
  useEffect(() => {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem(CART_KEY) || "[]"
      );

      setCart(Array.isArray(savedCart) ? savedCart : []);

      const savedCurrency =
        localStorage.getItem(CURRENCY_KEY) || "INR";

      setCurrency(savedCurrency === "USD" ? "USD" : "INR");
    } catch {
      setCart([]);
    }

    setLoaded(true);
  }, []);

  // Prevent background scrolling while checkout is open
  useEffect(() => {
    if (success) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [success]);

  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Today's date in YYYY-MM-DD format
  const today = new Date();

  const minimumDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  // Calendar day generation
  const calendarDays = Array.from(
    {
      length:
        new Date(
          calendarMonth.getFullYear(),
          calendarMonth.getMonth() + 1,
          0
        ).getDate() +
        new Date(
          calendarMonth.getFullYear(),
          calendarMonth.getMonth(),
          1
        ).getDay(),
    },
    (_, index) => {
      const firstDay = new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth(),
        1
      ).getDay();

      return index < firstDay ? null : index - firstDay + 1;
    }
  );

  const calendarMonthLabel = calendarMonth.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  function formatPrice(price: number) {
    return `${symbol}${Number(price).toFixed(2)}`;
  }

  function formatTimeLabel(time: string) {
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  // Lunch and dinner pickup slots
  const pickupSlots = [
    ...Array.from({ length: 12 }, (_, i) => {
      const totalMinutes = 12 * 60 + i * 15;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    }),

    ...Array.from({ length: 12 }, (_, i) => {
      const totalMinutes = 19 * 60 + i * 15;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    }),
  ];

  function validatePickupTime(time: string) {
    const [hours, minutes] = time.split(":").map(Number);
    const value = hours * 60 + minutes;

    return (
      (value >= 12 * 60 && value < 15 * 60) ||
      (value >= 19 * 60 && value < 22 * 60)
    );
  }

  function formatPickupDate(date: string) {
    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  }

  // Validate pickup details and continue to review
  function handleContinue() {
    setError("");

    if (customerName.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (!/^\d{10}$/.test(customerPhone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!pickupDate || pickupDate < minimumDate) {
      setError("Please select today or a future pickup date.");
      return;
    }

    if (!pickupTime || !validatePickupTime(pickupTime)) {
      setError("Please select a valid pickup time.");
      return;
    }

    const now = new Date();

    const currentTime =
      `${String(now.getHours()).padStart(2, "0")}:` +
      `${String(now.getMinutes()).padStart(2, "0")}`;

    if (pickupDate === minimumDate && pickupTime <= currentTime) {
      setError("Please select a future pickup time.");
      return;
    }

    setStep(2);
  }

  // Submit order
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (cart.length === 0) {
      setError("Your cart is empty. Please add items first.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone,
          customerEmail: customerEmail.trim(),
          pickupDate,
          pickupTime,
          specialInstructions: "",
          currency,
          items: cart.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Unable to place your order."
        );
      }

      const generatedId =
        data.order?.orderNumber ||
        data.order?.order_number ||
        data.orderNumber ||
        data.order?.id ||
        "Confirmed";

      setOrderId(generatedId);

      setPickupDetails(
        `Pickup scheduled for ${formatPickupDate(
          pickupDate
        )} at ${formatTimeLabel(pickupTime)}.`
      );

      localStorage.removeItem(CART_KEY);
      setCart([]);
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!loaded) {
    return <main className="checkout-page">Loading checkout...</main>;
  }

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <a href="/" className="logo">
            cravora<span>.</span>
          </a>

          <nav className="main-nav">
            <a href="/dining">Dining</a>
            <a href="/order">Order Online</a>
            <a href="/my-activity">My Activity</a>
            <a href="/about">Our Story</a>
            <a href="/contact">Contact</a>
          </nav>

          <div className="header-actions">
            <a href="/order/cart" className="btn btn-primary">
              Cart ({cartCount})
            </a>
          </div>
        </div>
      </header>

      <main className="checkout-page">
        <div className="checkout-modal-overlay">
          <section
            className="checkout-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-title"
          >
            {/* CHECKOUT HEADER */}
            <div className="checkout-modal-header">
              <div>
                <p className="checkout-eyebrow">CRAVORA CHECKOUT</p>
                <h2 id="checkout-title">Complete Your Order</h2>
              </div>

              <button
                type="button"
                className="checkout-close"
                aria-label="Close checkout"
                onClick={() => {
                  window.location.href = "/order/cart";
                }}
              >
                ×
              </button>
            </div>

            {/* CHECKOUT PROGRESS */}
            <div className="checkout-progress">
              <div
                className={`checkout-progress-step ${step === 1 ? "active" : ""}`}
              >
                <span>1</span>
                <small>Pickup Details</small>
              </div>

              <div className="checkout-progress-line" />

              <div
                className={`checkout-progress-step ${step === 2 ? "active" : ""}`}
              >
                <span>2</span>
                <small>Review Order</small>
              </div>
            </div>

            {/* STEP 1: PICKUP DETAILS */}
            {step === 1 && (
              <section id="checkout-step-1">
                <h3>Customer Information</h3>

                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleContinue();
                  }}
                >
                  <div className="checkout-form-grid">
                    <div className="checkout-field">
                      <label htmlFor="customer-name">
                        Full Name <span className="required-star">*</span>
                      </label>

                      <input
                        type="text"
                        id="customer-name"
                        placeholder="Enter your full name"
                        value={customerName}
                        onChange={(e) =>
                          setCustomerName(
                            e.target.value.replace(/[^A-Za-z ]/g, "")
                          )
                        }
                        required
                      />
                    </div>

                    <div className="checkout-field">
                      <label htmlFor="customer-phone">
                        Mobile Number <span className="required-star">*</span>
                      </label>

                      <input
                        type="tel"
                        id="customer-phone"
                        placeholder="10-digit mobile number"
                        value={customerPhone}
                        onChange={(e) =>
                          setCustomerPhone(
                            e.target.value.replace(/\D/g, "").slice(0, 10)
                          )
                        }
                        maxLength={10}
                        inputMode="numeric"
                        required
                      />
                    </div>

                    <div className="checkout-field">
                      <label htmlFor="customer-email">
                        Email Address <span className="required-star">*</span>
                      </label>

                      <input
                        type="email"
                        id="customer-email"
                        placeholder="name@gmail.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="checkout-modal-divider" />

                  <h3>Pickup Information</h3>

                  <div className="pickup-notice-compact">
                    <strong>Pickup Order</strong>
                    <span>
                      Collect your order directly from our restaurant.
                    </span>
                  </div>

                  <div className="checkout-form-grid">
                    {/* PICKUP DATE */}
                    <div className="checkout-field">
                      <label htmlFor="pickup-date">
                        Pickup Date <span className="required-star">*</span>
                      </label>

                      <div
                        className="custom-date-picker"
                        ref={calendarRef}
                      >
                        <button
                          type="button"
                          id="pickup-date"
                          className="custom-date-trigger"
                          onClick={() => {
                            if (!calendarOpen) {
                              const selected = pickupDate
                                ? new Date(`${pickupDate}T00:00:00`)
                                : new Date();

                              setCalendarMonth(
                                new Date(
                                  selected.getFullYear(),
                                  selected.getMonth(),
                                  1
                                )
                              );
                            }

                            setCalendarOpen(!calendarOpen);
                          }}
                          aria-expanded={calendarOpen}
                          aria-haspopup="dialog"
                        >
                          <span>
                            {pickupDate
                              ? formatPickupDate(pickupDate)
                              : "Select pickup date"}
                          </span>

                          <span
                            className="custom-date-icon"
                            aria-hidden="true"
                          >
                            ▦
                          </span>
                        </button>

                        {calendarOpen && (
                          <div
                            className="custom-calendar"
                            role="dialog"
                            aria-label="Choose pickup date"
                          >
                            <div className="calendar-header">
                              <button
                                type="button"
                                className="calendar-nav"
                                aria-label="Previous month"
                                disabled={
                                  calendarMonth.getFullYear() ===
                                    today.getFullYear() &&
                                  calendarMonth.getMonth() ===
                                    today.getMonth()
                                }
                                onClick={() =>
                                  setCalendarMonth(
                                    new Date(
                                      calendarMonth.getFullYear(),
                                      calendarMonth.getMonth() - 1,
                                      1
                                    )
                                  )
                                }
                              >
                                ‹
                              </button>

                              <strong>{calendarMonthLabel}</strong>

                              <button
                                type="button"
                                className="calendar-nav"
                                aria-label="Next month"
                                onClick={() =>
                                  setCalendarMonth(
                                    new Date(
                                      calendarMonth.getFullYear(),
                                      calendarMonth.getMonth() + 1,
                                      1
                                    )
                                  )
                                }
                              >
                                ›
                              </button>
                            </div>

                            <div className="calendar-grid">
                              {[
                                "Sun",
                                "Mon",
                                "Tue",
                                "Wed",
                                "Thu",
                                "Fri",
                                "Sat",
                              ].map((day) => (
                                <span
                                  className="calendar-weekday"
                                  key={day}
                                >
                                  {day}
                                </span>
                              ))}

                              {calendarDays.map((day, index) => {
                                if (day === null) {
                                  return (
                                    <span
                                      className="calendar-empty"
                                      key={`empty-${index}`}
                                    />
                                  );
                                }

                                const dateValue = [
                                  calendarMonth.getFullYear(),
                                  String(
                                    calendarMonth.getMonth() + 1
                                  ).padStart(2, "0"),
                                  String(day).padStart(2, "0"),
                                ].join("-");

                                const isSelected =
                                  pickupDate === dateValue;

                                const isToday =
                                  minimumDate === dateValue;

                                const isPast =
                                  dateValue < minimumDate;

                                return (
                                  <button
                                    type="button"
                                    key={dateValue}
                                    className={[
                                      "calendar-day",
                                      isSelected ? "selected" : "",
                                      isToday ? "today" : "",
                                    ].join(" ")}
                                    disabled={isPast}
                                    aria-pressed={isSelected}
                                    onClick={() => {
                                      setPickupDate(dateValue);
                                      setCalendarOpen(false);
                                    }}
                                  >
                                    {day}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* PICKUP TIME */}
                    <div className="checkout-field">
                      <label htmlFor="pickup-time">
                        Pickup Time <span className="required-star">*</span>
                      </label>

                      <div
                        className="custom-time-picker"
                        ref={timePickerRef}
                      >
                        <button
                          type="button"
                          id="pickup-time"
                          className={`custom-time-trigger ${
                            timeDropdownOpen ? "open" : ""
                          }`}
                          onClick={() =>
                            setTimeDropdownOpen(!timeDropdownOpen)
                          }
                          aria-expanded={timeDropdownOpen}
                          aria-haspopup="listbox"
                        >
                          <span>
                            {pickupTime
                              ? formatTimeLabel(pickupTime)
                              : "Select pickup time"}
                          </span>

                          <span
                            className={`custom-time-arrow ${
                              timeDropdownOpen ? "arrow-up" : ""
                            }`}
                            aria-hidden="true"
                          />
                        </button>

                        {timeDropdownOpen && (
                          <div
                            className="custom-time-options"
                            role="listbox"
                          >
                            <div className="time-group-label">
                              LUNCH
                            </div>

                            {pickupSlots.slice(0, 12).map((time) => (
                              <button
                                type="button"
                                key={time}
                                className={`time-option ${
                                  pickupTime === time ? "selected" : ""
                                }`}
                                onClick={() => {
                                  setPickupTime(time);
                                  setTimeDropdownOpen(false);
                                }}
                                role="option"
                                aria-selected={pickupTime === time}
                              >
                                {formatTimeLabel(time)}
                              </button>
                            ))}

                            <div className="time-group-label">
                              DINNER
                            </div>

                            {pickupSlots.slice(12).map((time) => (
                              <button
                                type="button"
                                key={time}
                                className={`time-option ${
                                  pickupTime === time ? "selected" : ""
                                }`}
                                onClick={() => {
                                  setPickupTime(time);
                                  setTimeDropdownOpen(false);
                                }}
                                role="option"
                                aria-selected={pickupTime === time}
                              >
                                {formatTimeLabel(time)}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {error && (
                    <p className="checkout-error" role="alert">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary checkout-next-btn"
                  >
                    Continue to Review →
                  </button>
                </form>
              </section>
            )}

            {/* STEP 2: ORDER SUMMARY */}
            {step === 2 && (
              <section id="checkout-step-2">
                <div className="checkout-bill-heading">
                  <div>
                    <p className="checkout-eyebrow">ORDER SUMMARY</p>
                    <h2>Review Your Bill</h2>
                  </div>

                  <a href="/order/cart">Edit Cart</a>
                </div>

                <form onSubmit={handleSubmit}>
                  <div id="checkout-bill-items">
                    {cart.map((item, index) => (
                      <div className="checkout-bill-item" key={item.id}>
                        <span>
                          {String(index + 1).padStart(2, "0")}.
                        </span>

                        <div className="checkout-bill-item-info">
                          <strong>{item.name}</strong>
                          <span>
                            {item.quantity} × {formatPrice(item.price)}
                          </span>
                        </div>

                        <strong>
                          {formatPrice(item.price * item.quantity)}
                        </strong>
                      </div>
                    ))}
                  </div>

                  <div className="checkout-bill-calculations">
                    <div className="bill-calculation-row">
                      <span>Subtotal</span>
                      <strong>{formatPrice(subtotal)}</strong>
                    </div>

                    <div className="bill-calculation-row">
                      <span>Taxes</span>
                      <strong>{formatPrice(0)}</strong>
                    </div>

                    <div className="bill-calculation-row bill-total-row">
                      <span>Total Amount</span>
                      <strong>{formatPrice(subtotal)}</strong>
                    </div>
                  </div>

                  <p className="checkout-bill-note">
                    Please verify all items and quantities before placing
                    your order.
                  </p>

                  {error && (
                    <p className="checkout-error" role="alert">
                      {error}
                    </p>
                  )}

                  <div className="checkout-review-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setError("");
                        setStep(1);
                      }}
                    >
                      ← Back
                    </button>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitting || cart.length === 0}
                    >
                      {submitting
                        ? "Placing Order..."
                        : "Place Order"}
                    </button>
                  </div>
                </form>
              </section>
            )}
          </section>
        </div>
      </main>

      {/* ORDER SUCCESS POPUP */}
      <div
        className="order-success-overlay"
        id="order-success-overlay"
        hidden={!success}
      >
        <div className="order-success-popup">
          <div className="success-tick">✓</div>

          <p className="checkout-eyebrow">CRAVORA</p>

          <h2>Order Placed Successfully!</h2>

          <p className="success-message">
            Thank you for choosing Cravora. Your order has been confirmed.
          </p>

          <div className="success-order-number">
            <span>YOUR ORDER ID</span>
            <strong>{orderId}</strong>
          </div>

          <p className="success-pickup-details">
            {pickupDetails}
          </p>

          <a href="/order" className="btn btn-primary">
            Continue Exploring
          </a>
        </div>
      </div>

      <footer className="site-footer">
        <div className="container">
          <a href="/" className="logo">
            cravora<span>.</span>
          </a>

          <p>Good food. Great moments.</p>
        </div>
      </footer>
    </>
  );
}

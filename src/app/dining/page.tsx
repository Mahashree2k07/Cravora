
"use client";

import { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
const lunchTimes = [
  ["12:00", "12:00 PM"],
  ["12:30", "12:30 PM"],
  ["13:00", "1:00 PM"],
  ["13:30", "1:30 PM"],
  ["14:00", "2:00 PM"],
  ["14:30", "2:30 PM"],
];

const dinnerTimes = [
  ["19:00", "7:00 PM"],
  ["19:30", "7:30 PM"],
  ["20:00", "8:00 PM"],
  ["20:30", "8:30 PM"],
  ["21:00", "9:00 PM"],
  ["21:30", "9:30 PM"],
];

type DropdownOption = {
  value: string;
  label: string;
};

type CustomDropdownProps = {
  id: string;
  value: string;
  placeholder: string;
  options: DropdownOption[];
  isOpen: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
  onClose: () => void;
};

function CustomDropdown({
  id,
  value,
  placeholder,
  options,
  isOpen,
  onToggle,
  onChange,
  onClose,
}: CustomDropdownProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        onCloseRef.current();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseRef.current();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const selectedOption = options.find(
    (option) => option.value === value
  );

  return (
    <div
      className={`custom-select ${isOpen ? "open" : ""}`}
      ref={wrapperRef}
    >
      <button
        type="button"
        id={`${id}-trigger`}
        className="custom-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${id}-menu`}
        onClick={onToggle}
      >
        <span>{selectedOption?.label || placeholder}</span>
      </button>

      <div
        className="custom-select-menu"
        id={`${id}-menu`}
        role="listbox"
        aria-label={placeholder}
      >
         {options.map((option) => (
  <div
    key={option.value}
    className={`custom-select-option ${
      value === option.value ? "selected" : ""
    }`}
    role="option"
    aria-selected={value === option.value}
    onMouseDown={(event) => {
      event.preventDefault();
      onChange(option.value);
      console.log("Selected dropdown value:", option.value);
      onClose();
    }}
  >
    {option.label}
  </div>
))}
          
      </div>
    </div>
  );
}

export default function DiningPage() {
  const today = new Date();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("");
  const [duration, setDuration] = useState("");
  const [seating, setSeating] = useState("");
  const [time, setTime] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState<Record<string, string> | null>(null);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown((current) =>
      current === dropdown ? null : dropdown
    );
  };

  useEffect(() => {
    const closeCalendar = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (!target.closest(".custom-date-picker")) {
        setCalendarOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", closeCalendar);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeCalendar);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const formatDate = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const isPastDate = (day: number) => {
    const selected = new Date(year, month, day);

    const current = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    return selected < current;
  };

  const displayDate = (value: string) => {
    if (!value) return "";

    return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const changeMonth = (direction: number) => {
    const next = new Date(year, month + direction, 1);

    if (
      next.getFullYear() < today.getFullYear() ||
      (next.getFullYear() === today.getFullYear() &&
        next.getMonth() < today.getMonth())
    ) {
      return;
    }

    setMonth(next.getMonth());
    setYear(next.getFullYear());
  };

  const selectDate = (day: number) => {
    setDate(formatDate(day));
    setCalendarOpen(false);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");

    if (!/^[A-Za-z ]{2,50}$/.test(name.trim())) {
      setError("Please enter your name using letters and spaces only.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter exactly 10 digits for your mobile number.");
      return;
    }

    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.com$/.test(email)) {
      setError("Please enter a valid email address ending in .com.");
      return;
    }

    if (!date || !guests || !duration || !seating || !time) {
      setError("Please complete all required reservation details.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/dining-reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guestName: name.trim(),
          phone,
          email,
          date,
          guests: Number(guests),
          duration,
          seatingPreference: seating,
          time,
          specialRequest,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to save your reservation."
        );
      }

      setBooking(result.booking);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save your reservation. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setBooking(null);
    setName("");
    setPhone("");
    setEmail("");
    setDate("");
    setGuests("");
    setDuration("");
    setSeating("");
    setTime("");
    setSpecialRequest("");
    setError("");
    setOpenDropdown(null);
  };
  
const downloadBookingConfirmation = () => {
  if (!booking) return;

  const doc = new jsPDF();

  
  // Cravora logo
  doc.setFillColor(245, 241, 233);
  doc.rect(0, 0, 210, 48, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);

  const logoText = "cravora";
  const logoWidth = doc.getTextWidth(logoText);
  const dotWidth = doc.getTextWidth(".");
  const logoStart = (210 - logoWidth - dotWidth) / 2;

  doc.setTextColor(37, 39, 31);
  doc.text(logoText, logoStart, 23);

  doc.setTextColor(164, 91, 60);
  doc.text(".", logoStart + logoWidth, 23);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(164, 91, 60);
  doc.text("RESERVATION CONFIRMATION", 105, 34, {
    align: "center",
  });
 

  // Success message
  doc.setTextColor(57, 118, 83);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text("Reservation Confirmed!", 105, 65, {
    align: "center",
  });

  doc.setTextColor(80, 80, 80);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("We look forward to welcoming you!", 105, 73, {
    align: "center",
  });

  // Booking ID
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(20, 84, 170, 29, 3, 3, "F");

  doc.setTextColor(118, 109, 99);
  doc.setFontSize(9);
  doc.text("YOUR BOOKING ID", 30, 94);

  doc.setTextColor(164, 91, 60);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(booking.bookingNumber, 30, 105);

  // Booking details
  doc.setTextColor(37, 39, 31);
  doc.setFontSize(13);
  doc.text("BOOKING DETAILS", 20, 128);

  const details = [
    ["Guest Name", booking.guestName],
    ["Phone Number", booking.phone],
    ["Email", booking.email || "Not provided"],
    ["Date", displayDate(booking.date)],
    ["Time", booking.time],
    ["Number of Guests", String(booking.guests)],
    ["Duration", booking.duration],
    ["Seating Preference", booking.seatingPreference],
    ["Special Request", booking.specialRequest || "None"],
  ];

  let y = 140;

  details.forEach(([label, value]) => {
    doc.setDrawColor(220, 201, 179);
    doc.line(20, y + 4, 190, y + 4);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(118, 109, 99);
    doc.text(label, 22, y);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 39, 31);

    const lines = doc.splitTextToSize(value, 95);
    doc.text(lines, 188, y, { align: "right" });

    y += Math.max(11, lines.length * 6);
  });

  // Footer
  doc.setTextColor(164, 91, 60);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Thank you for choosing Cravora!", 105, y + 18, {
    align: "center",
  });

  doc.setTextColor(118, 109, 99);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Please save your booking ID for future reference.", 105, y + 25, {
    align: "center",
  });

  doc.save(`Cravora-Booking-${booking.bookingNumber}.pdf`);
};
  

  const durationOptions: DropdownOption[] = [
    { value: "30 minutes", label: "30 minutes" },
    { value: "45 minutes", label: "45 minutes" },
    { value: "1 hour", label: "1 hour" },
    { value: "1 hour 30 minutes", label: "1 hour 30 minutes" },
    { value: "2 hours", label: "2 hours" },
    { value: "More than 2 hours", label: "More than 2 hours" },
  ];

  const seatingOptions: DropdownOption[] = [
    { value: "Indoor seating", label: "Indoor seating" },
    { value: "Outdoor seating", label: "Outdoor seating" },
    { value: "No preference", label: "No preference" },
  ];

  const timeOptions: DropdownOption[] = [
    ...lunchTimes.map(([value, label]) => ({
      value,
      label: `Lunch – ${label}`,
    })),
    ...dinnerTimes.map(([value, label]) => ({
      value,
      label: `Dinner – ${label}`,
    })),
  ];

  return (
    <>
      {/* HEADER */}
      <header className="site-header">
        <div className="container header-inner">
          <a href="/" className="logo">
            cravora<span>.</span>
          </a>

          <nav className="main-nav">
            <a href="/">Home</a>
            <a href="/dining" className="active">Dining</a>
            <a href="/order">Order Online</a>
            <a href="/my-activity">My Activity</a>
            <a href="/about">Our Story</a>
            <a href="/contact">Contact</a>
          </nav>

          <div className="header-actions">
            <a href="#reservation" className="btn btn-primary">
              Reserve a Table
            </a>
          </div>
        </div>
      </header>

      {/* RESERVATION SECTION */}
      <section className="reservation-section" id="reservation">
        <div className="container">
          <div className="reservation-heading">
            <p className="eyebrow">PLAN YOUR VISIT</p>
            <h2>Reserve Your Table</h2>
          </div>

          <div className="reservation-layout">
            {/* RESERVATION FORM */}
            <div className="reservation-form-card">
              <form id="reservation-form" onSubmit={handleSubmit}>
                {/* NAME AND MOBILE */}
                <div className="reservation-form-grid">
                  <div className="reservation-field">
                    <label htmlFor="guest-name">
                      Full Name <span className="required-star">*</span>
                    </label>

                    <input
                      type="text"
                      id="guest-name"
                      name="guestName"
                      placeholder="Enter your full name"
                      minLength={2}
                      maxLength={50}
                      pattern="[A-Za-z ]{2,50}"
                      title="Please enter your name using letters and spaces only."
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="reservation-field">
                    <label htmlFor="phone">
                      Mobile Number <span className="required-star">*</span>
                    </label>

                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="Enter 10-digit mobile number"
                      minLength={10}
                      maxLength={10}
                      pattern="[0-9]{10}"
                      inputMode="numeric"
                      title="Please enter exactly 10 digits."
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) =>
                        setPhone(
                          e.target.value.replace(/\D/g, "").slice(0, 10)
                        )
                      }
                      required
                    />
                  </div>
                </div>

                {/* EMAIL, DATE AND GUESTS */}
                <div className="reservation-form-grid three-columns">
                  <div className="reservation-field">
                    <label htmlFor="email">
                      Email Address <span className="required-star">*</span>
                    </label>

                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="e.g., name@gmail.com"
                      maxLength={100}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="reservation-field">
                    <label htmlFor="booking-date">
                      Reservation Date <span className="required-star">*</span>
                    </label>

                    <div className="custom-date-picker">
                      <input
                        type="text"
                        id="booking-date"
                        name="date"
                        placeholder="Select reservation date"
                        value={displayDate(date)}
                        onClick={() => setCalendarOpen(!calendarOpen)}
                        readOnly
                        required
                      />

                      <div
                        className="calendar-popup"
                        id="calendar-popup"
                        hidden={!calendarOpen}
                      >
                        <div className="calendar-header">
                          <button
                            type="button"
                            id="calendar-prev"
                            onClick={() => changeMonth(-1)}
                            disabled={
                              year === today.getFullYear() &&
                              month === today.getMonth()
                            }
                          >
                            &#8249;
                          </button>

                          <span id="calendar-month-year">
                            {new Date(year, month).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </span>

                          <button
                            type="button"
                            id="calendar-next"
                            onClick={() => changeMonth(1)}
                          >
                            &#8250;
                          </button>
                        </div>

                        <div className="calendar-weekdays">
                          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                            (day) => (
                              <span key={day}>{day}</span>
                            )
                          )}
                        </div>

                        <div className="calendar-days" id="calendar-days">
                          {Array.from({ length: firstDay }).map(
                            (_, index) => (
                              <span key={`empty-${index}`} />
                            )
                          )}

                          {Array.from({ length: daysInMonth }).map(
                            (_, index) => {
                              const day = index + 1;
                              const value = formatDate(day);

                              return (
                                <button
                                  type="button"
                                  key={day}
                                  disabled={isPastDate(day)}
                                  className={[
                                    value === date ? "selected" : "",
                                    today.getDate() === day &&
                                    today.getMonth() === month &&
                                    today.getFullYear() === year
                                      ? "today"
                                      : "",
                                  ].join(" ")}
                                  onClick={() => selectDate(day)}
                                >
                                  {day}
                                </button>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="reservation-field">
                    <label htmlFor="guests">
                      Number of Guests <span className="required-star">*</span>
                    </label>

                    <input
                      type="number"
                      id="guests"
                      name="guests"
                      placeholder="Number of guests"
                      min={1}
                      max={50}
                      step={1}
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* DURATION, SEATING AND RESERVATION TIME */}
                <div className="reservation-form-grid three-columns">
                  <div className="reservation-field">
                    <label htmlFor="duration-trigger">
                      Expected Dining Duration{" "}
                      <span className="required-star">*</span>
                    </label>

                    <CustomDropdown
                      id="duration"
                      value={duration}
                      placeholder="Select duration"
                      options={durationOptions}
                      isOpen={openDropdown === "duration"}
                      onToggle={() => toggleDropdown("duration")}
                      onChange={setDuration}
                      onClose={closeDropdown}
                    />
                  </div>

                  <div className="reservation-field">
                    <label htmlFor="seating-trigger">
                      Seating Preference{" "}
                      <span className="required-star">*</span>
                    </label>

                    <CustomDropdown
                      id="seating"
                      value={seating}
                      placeholder="Select seating"
                      options={seatingOptions}
                      isOpen={openDropdown === "seating"}
                      onToggle={() => toggleDropdown("seating")}
                      onChange={setSeating}
                      onClose={closeDropdown}
                    />
                  </div>

                  <div className="reservation-field">
                    <label htmlFor="time-trigger">
                      Preferred Reservation Time{" "}
                      <span className="required-star">*</span>
                    </label>

                    <CustomDropdown
                      id="time"
                      value={time}
                      placeholder="Select your preferred time"
                      options={timeOptions}
                      isOpen={openDropdown === "time"}
                      onToggle={() => toggleDropdown("time")}
                      onChange={setTime}
                      onClose={closeDropdown}
                    />
                  </div>
                </div>

                {/* SPECIAL REQUESTS */}
                <div className="reservation-field full-width">
                  <label htmlFor="special-request">
                    Special Requests (Optional)
                  </label>

                  <textarea
                    id="special-request"
                    name="specialRequest"
                    rows={3}
                    placeholder="Any special arrangements or requests?"
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                  />
                </div>

                {error && (
                  <p className="reservation-error" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="btn btn-primary reservation-submit"
                  disabled={loading}
                >
                  {loading ? "Confirming..." : "Confirm Reservation"}
                </button>
              </form>
            </div>

            {/* RESERVATION INFORMATION */}
            <aside className="reservation-info">
              {/* DINING EXPERIENCE CARD */}
              <div className="reservation-info-card">
                <h3>Your Dining Experience</h3>

                <p>
                  Make your visit more convenient by reserving
                  your table in advance.
                </p>

                <div className="reservation-info-item">
                  <span className="info-icon">01</span>
                  <div>
                    <strong>Choose your slot</strong>
                    <p>Select a suitable date and dining time.</p>
                  </div>
                </div>

                <div className="reservation-info-item">
                  <span className="info-icon">02</span>
                  <div>
                    <strong>Share your preferences</strong>
                    <p>
                      Tell us your guest count and expected dining duration.
                    </p>
                  </div>
                </div>

                <div className="reservation-info-item">
                  <span className="info-icon">03</span>
                  <div>
                    <strong>Receive your booking ID</strong>
                    <p>Keep your ID ready for your restaurant visit.</p>
                  </div>
                </div>
              </div>

              {/* DINING HOURS CARD */}
              <div className="reservation-hours-card">
                <h3>Dining Hours</h3>

                <div className="dining-hours-grid">
                  <div className="dining-hour-item">
                    <span>Lunch</span>
                    <strong>12:00 PM - 3:00 PM</strong>
                  </div>

                  <div className="dining-hour-item">
                    <span>Dinner</span>
                    <strong>7:00 PM - 10:00 PM</strong>
                  </div>
                </div>

                <p>
                  Choose your preferred arrival time during dining hours.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* BOOKING CONFIRMATION */}
      {booking && (
        <section
          id="booking-confirmation"
          className="booking-confirmation"
        >
          <div className="container">
           
<div
  className="booking-confirmation-card"
  id="booking-confirmation-content"
>
  <div className="booking-success-icon">✓</div>

  <h2>Reservation Confirmed!</h2>
  <p>
    Your table has been successfully reserved. We look forward
    to welcoming you!
  </p>

  <div className="booking-id">
    <span>YOUR BOOKING ID</span>
    <strong>{booking.bookingNumber}</strong>
  </div>

  <div className="booking-details">
    <div className="booking-detail-row">
      <span>Guest Name</span>
      <strong>{booking.guestName}</strong>
    </div>

    <div className="booking-detail-row">
      <span>Phone Number</span>
      <strong>{booking.phone}</strong>
    </div>

    {booking.email && (
      <div className="booking-detail-row">
        <span>Email</span>
        <strong>{booking.email}</strong>
      </div>
    )}

    <div className="booking-detail-row">
      <span>Date</span>
      <strong>{displayDate(booking.date)}</strong>
    </div>

    <div className="booking-detail-row">
      <span>Time</span>
      <strong>{booking.time}</strong>
    </div>

    <div className="booking-detail-row">
      <span>Number of Guests</span>
      <strong>{booking.guests}</strong>
    </div>

    <div className="booking-detail-row">
      <span>Duration</span>
      <strong>{booking.duration}</strong>
    </div>

    <div className="booking-detail-row">
      <span>Seating Preference</span>
      <strong>{booking.seatingPreference}</strong>
    </div>

    {booking.specialRequest && (
      <div className="booking-detail-row">
        <span>Special Request</span>
        <strong>{booking.specialRequest}</strong>
      </div>
    )}
  </div>

  <div className="booking-instruction">
    Please save your booking ID for future reference.
    You may present it when you arrive at the restaurant.
  </div>

  <button
  type="button"
  className="btn btn-primary"
  onClick={downloadBookingConfirmation}
>
  Download Booking Confirmation
</button> 

  <button
    type="button"
    className="btn btn-secondary"
    onClick={resetForm}
  >
    Make Another Reservation
  </button>
</div>
          </div> 
        </section>
      )}

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <a href="/" className="logo">
              cravora<span>.</span>
            </a>

            <p>
              Good food. Better living. Creating experiences
              that bring people together, one meal at a time.
            </p>
          </div>

          <div className="footer-column">
            <h4>Explore</h4>
            <a href="/dining">Dining</a>
            <a href="/order">Order Online</a>
          </div>

          <div className="footer-column">
            <h4>Information</h4>
            <a href="/about">Our Story</a>
            <a href="/contact">Contact</a>
          </div>
        </div>

        <div className="container footer-bottom">
          <p>© 2026 Cravora. All rights reserved.</p>
          <p>Good Food. Great Moments.</p>
        </div>
      </footer>
    </>
  );
}


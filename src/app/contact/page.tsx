
"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import styles from "./contact.module.css";
import { SiteFooter } from "@/components/SiteFooter";
import { usePublicSettings } from "@/components/PublicSettingsProvider";
import { EMAIL_DOT_COM_REGEX, formatTime12h } from "@/lib/public-settings";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [enquiryNumber, setEnquiryNumber] = useState("");
  const [toastMounted, setToastMounted] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [error, setError] = useState("");
  const [subject, setSubject] = useState("");
  const settings = usePublicSettings();
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearToastTimers() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }

  useEffect(() => {
    return () => clearToastTimers();
  }, []);

  function showSuccessToast(id: string) {
    clearToastTimers();
    setEnquiryNumber(id);
    setToastMounted(true);
    setToastVisible(false);

    timersRef.current.push(
      setTimeout(() => setToastVisible(true), 20),
      setTimeout(() => setToastVisible(false), 4000),
      setTimeout(() => setToastMounted(false), 4400)
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!subject.trim()) {
      setError("Please enter a subject.");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const cleanEmail = String(formData.get("email") || "").trim();

    if (!EMAIL_DOT_COM_REGEX.test(cleanEmail)) {
      setError("Please enter a valid email address ending in .com.");
      return;
    }

    const enquiryDetails = {
      name: String(formData.get("name") || "").trim(),
      email: cleanEmail,
      subject: subject.trim(),
      message: String(formData.get("message") || "").trim(),
      website: String(formData.get("website") || "").trim(),
    };

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enquiryDetails),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to send your message.");
      }

      showSuccessToast(result.enquiry?.enquiry_number || "Received");

      form.reset();
      setSubject("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

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
            <a href="/dining">Dining</a>
            <a href="/order">Order Online</a>
            <a href="/my-activity">My Activity</a>
            <a href="/about">Our Story</a>
            <a href="/contact" className="active">Contact</a>
          </nav>

          <div className="header-actions">
            <a href="/order" className="btn btn-primary">Order Now</a>
          </div>
        </div>
      </header>

      <main className={styles.contactPage}>
        {/* CONTACT INTRODUCTION */}
        <section className={styles.contactHero}>
          <div className="container">
            <p className={styles.eyebrow}>WE&apos;RE HERE TO HELP</p>
            <h1>Let&apos;s Talk</h1>
            <p>
              Have a question, need help with an order, or want to
              partner with Cravora? We&apos;d love to hear from you.
            </p>
          </div>
        </section>

        {/* CONTACT INFORMATION AND FORM */}
        <section className={styles.contactMain}>
          <div className={styles.contactLayout}>
            {/* LEFT COLUMN */}
            <div className={styles.infoColumn}>
              <article className={styles.infoCard}>
                <h2>Customer Support</h2>
                <p>
                  Need assistance with an order, payment, or your account?
                  Send us a message and share the details so our team can
                  help you.
                </p>
              </article>

              <article className={styles.infoCard}>
                <h2>Restaurant Partners</h2>
                <p>
                  Are you a restaurant looking to reach more customers?
                  Connect with Cravora and explore the opportunity to
                  showcase your restaurant on our platform.
                </p>
              </article>

              <article className={styles.infoCard}>
                <h2>Cravora</h2>
                <h3>Good food. One place to find it.</h3>
                <p>
                  From discovering restaurants to placing your next order,
                  Cravora brings your food ordering experience together
                  in one place.
                </p>

                <div className={styles.contactMetaList}>
                  <div className={styles.contactMetaRow}>
                    <span>Address</span>
                    <strong>{settings.restaurantAddress}</strong>
                  </div>
                  <div className={styles.contactMetaRow}>
                    <span>Phone</span>
                    <a
                      href={`tel:${settings.restaurantPhone.replace(/\s+/g, "")}`}
                    >
                      {settings.restaurantPhone}
                    </a>
                  </div>
                  <div className={styles.contactMetaRow}>
                    <span>Email</span>
                    <a href={`mailto:${settings.restaurantEmail}`}>
                      {settings.restaurantEmail}
                    </a>
                  </div>
                  <div className={styles.contactMetaRow}>
                    <span>Hours</span>
                    <strong>
                      Lunch {formatTime12h(settings.lunchStart)} –{" "}
                      {formatTime12h(settings.lunchEnd)} &middot; Dinner{" "}
                      {formatTime12h(settings.dinnerStart)} –{" "}
                      {formatTime12h(settings.dinnerEnd)}
                    </strong>
                  </div>
                </div>
              </article>
            </div>

            {/* RIGHT COLUMN */}
            <div className={styles.formColumn}>
              <div className={styles.formHeading}>
                <p className={styles.eyebrow}>GET IN TOUCH</p>
                <h2>Send a Message</h2>
                <p>
                  Fill out the form below and our team will get back to you.
                </p>
              </div>

              <form className={styles.contactForm} onSubmit={handleSubmit}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="full-name">
                      Full Name<span className={styles.requiredStar}>*</span>
                    </label>
                    <input
                      type="text"
                      id="full-name"
                      name="name"
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email">
                      Email Address<span className={styles.requiredStar}>*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="e.g., name@gmail.com"
                      pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[cC][oO][mM]"
                      title="Please enter a valid email address ending in .com."
                      required
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="subject">
                      Subject<span className={styles.requiredStar}>*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      placeholder="Enter your subject"
                      minLength={2}
                      maxLength={50}
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="message">
                      Message<span className={styles.requiredStar}>*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Tell us how we can help..."
                      required
                    />
                  </div>
                </div>

                {/* HIDDEN SPAM PROTECTION */}
                <div className={styles.formWebsite} aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {error && (
                  <div className={styles.errorMessage} role="alert">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {toastMounted && (
        <div
          className={`contact-toast${toastVisible ? " show" : ""}`}
          role="status"
          aria-live="polite"
        >
          <span className="toast-icon">✓</span>
          <div>
            <strong>Message sent successfully!</strong>
            <p>Thank you for contacting Cravora.</p>
            <p>Enquiry ID: {enquiryNumber}</p>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <SiteFooter activePath="/contact" />
    </>
  );
}

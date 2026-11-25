
"use client";

import { useState, type FormEvent } from "react";
import styles from "./contact.module.css";
import CustomDropdown from "@/components/CustomDropdown";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [subject, setSubject] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!subject) {
  setError("Please select a subject.");
  setSuccess("");
  return;
}

    const form = event.currentTarget;
    const formData = new FormData(form);

    const enquiryDetails = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      subject: subject,
      message: String(formData.get("message") || "").trim(),
      website: String(formData.get("website") || "").trim(),
    };

    setLoading(true);
    setSuccess("");
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

      setSuccess(
        `Message sent successfully! Thank you for contacting Cravora. Enquiry ID: ${result.enquiry?.enquiry_number || "Received"}`
      );

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
            <p className={styles.eyebrow}>WE'RE HERE TO HELP</p>
            <h1>Let's Talk</h1>
            <p>
              Have a question, need help with an order, or want to
              partner with Cravora? We'd love to hear from you.
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
                      required
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="subject">
                      Subject
                     <span className={styles.requiredStar}>*</span>
                    </label>
                    
                    <CustomDropdown
  value={subject}
  onChange={setSubject}
  placeholder="Select a subject"
  ariaLabel="Select enquiry subject"
  options={[
    { value: "customer-support", label: "Customer Support" },
    { value: "restaurant-partnership", label: "Restaurant Partnership" },
    { value: "general-enquiry", label: "General Enquiry" },
  ]}
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

                {success && (
                  <div className={styles.successMessage} role="status">
                    <strong>✓ {success}</strong>
                  </div>
                )}

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

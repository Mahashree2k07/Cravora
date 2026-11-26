"use client";

import { formatTime12h } from "@/lib/public-settings";
import { usePublicSettings } from "@/components/PublicSettingsProvider";

type SiteFooterProps = {
  activePath?: string;
};

export function SiteFooter({ activePath }: SiteFooterProps) {
  const settings = usePublicSettings();

  return (
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

          <p className="footer-hours">
            <strong>Hours:</strong> Lunch{" "}
            {formatTime12h(settings.lunchStart)} –{" "}
            {formatTime12h(settings.lunchEnd)} &middot; Dinner{" "}
            {formatTime12h(settings.dinnerStart)} –{" "}
            {formatTime12h(settings.dinnerEnd)}
          </p>
        </div>

        <div className="footer-column">
          <h4>Explore</h4>
          <a
            href="/dining"
            className={activePath === "/dining" ? "active" : undefined}
          >
            Dining
          </a>
          <a
            href="/order"
            className={activePath === "/order" ? "active" : undefined}
          >
            Order Online
          </a>
          <a
            href="/my-activity"
            className={activePath === "/my-activity" ? "active" : undefined}
            aria-current={activePath === "/my-activity" ? "page" : undefined}
          >
            My Activity
          </a>
        </div>

        <div className="footer-column">
          <h4>Information</h4>
          <a
            href="/about"
            className={activePath === "/about" ? "active" : undefined}
          >
            Our Story
          </a>
          <a
            href="/contact"
            className={activePath === "/contact" ? "active" : undefined}
          >
            Contact
          </a>
        </div>

        <div className="footer-column">
          <h4>Visit &amp; Contact</h4>
          <p className="footer-contact-line">{settings.restaurantAddress}</p>
          <a href={`tel:${settings.restaurantPhone.replace(/\s+/g, "")}`}>
            {settings.restaurantPhone}
          </a>
          <a href={`mailto:${settings.restaurantEmail}`}>
            {settings.restaurantEmail}
          </a>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>&copy; 2026 Cravora. All rights reserved.</p>
        <p>Good Food. Great Moments.</p>
      </div>
    </footer>
  );
}

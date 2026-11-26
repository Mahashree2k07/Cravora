"use client";

import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/dining", label: "Dining" },
  { href: "/order", label: "Order Online" },
  { href: "/my-activity", label: "My Activity" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
] as const;

type SiteHeaderProps = {
  activePath: "/" | "/dining" | "/order" | "/my-activity" | "/about" | "/contact";
  actionHref?: string;
  actionLabel?: string;
  cartCount?: number;
};

export function SiteHeader({
  activePath,
  actionHref = "/order",
  actionLabel = "Order Now",
  cartCount,
}: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    function handleOutside(event: MouseEvent) {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  return (
    <header ref={headerRef} className="site-header">
      <div className="container header-inner">
        <a href="/" className="logo">
          cravora<span>.</span>
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          {NAV_LINKS.map((item) => {
            const isActive = item.href === activePath;
            return (
              <a
                key={item.href}
                href={item.href}
                className={isActive ? "active" : undefined}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="header-actions">
          {cartCount !== undefined ? (
            <a href="/order/cart" className="btn btn-primary header-cta-btn">
              Cart <span>({cartCount})</span>
            </a>
          ) : (
            <a href={actionHref} className="btn btn-primary header-cta-btn">
              {actionLabel}
            </a>
          )}

          <button
            type="button"
            className="mobile-menu-toggle"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-site-nav"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {menuOpen ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-site-nav"
          className="mobile-nav-drawer"
          aria-label="Mobile navigation"
        >
          <div className="container mobile-nav-links">
            {NAV_LINKS.map((item) => {
              const isActive = item.href === activePath;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={isActive ? "active" : undefined}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}

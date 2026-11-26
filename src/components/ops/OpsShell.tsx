"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type OpsUser = {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
};

type OpsShellProps = {
  title: string;
  subtitle: string;
  headerRight?: ReactNode;
  children: ReactNode;
};

const NAV_ITEMS = [
  { href: "/ops", label: "Dashboard" },
  { href: "/ops/orders", label: "Orders" },
  { href: "/ops/menu", label: "Menu Management" },
  { href: "/ops/filter-settings", label: "Customer Filter Settings" },
  { href: "/ops/reservations", label: "Reservations" },
  { href: "/ops/customers", label: "Customers" },
  { href: "/ops/enquiries", label: "Enquiries" },
  { href: "/ops/reports", label: "Reports & Analytics" },
  { href: "/ops/settings", label: "Settings" },
];

export function OpsShell({
  title,
  subtitle,
  headerRight,
  children,
}: OpsShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<OpsUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  useEffect(() => {
    let cancelled = false;

    async function verifySession() {
      try {
        const res = await fetch("/api/ops/auth/me");
        if (res.status === 401) {
          router.replace("/ops/login");
          return;
        }
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setUser(data.user ?? null);
        }
      } catch {
        // Let individual pages show API errors if offline
      } finally {
        if (!cancelled) setChecking(false);
      }
    }

    verifySession();

    function handleProfileUpdate() {
      verifySession();
    }
    window.addEventListener("cravora-ops-profile-updated", handleProfileUpdate);

    return () => {
      cancelled = true;
      window.removeEventListener(
        "cravora-ops-profile-updated",
        handleProfileUpdate
      );
    };
  }, [router]);

  async function handleLogout() {
    await fetch("/api/ops/auth/logout", { method: "POST" });
    router.replace("/ops/login");
  }

  return (
    <div className="ops-layout">
      {menuOpen && (
        <div
          className="ops-sidebar-backdrop"
          aria-hidden="true"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside className={`ops-sidebar${menuOpen ? " open" : ""}`}>
        <div className="ops-brand-row">
          <div className="ops-brand">
            <h2>Cravora</h2>
            <p>Operations</p>
          </div>
          <button
            type="button"
            className="ops-mobile-close-btn"
            aria-label="Close navigation menu"
            onClick={() => setMenuOpen(false)}
          >
            &times;
          </button>
        </div>

        <nav className="ops-nav">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/ops"
                ? pathname === "/ops"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`ops-nav-link${isActive ? " active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ops-sidebar-bottom">
          <Link
            href="/"
            className="ops-nav-link"
            onClick={() => setMenuOpen(false)}
          >
            Customer Site
          </Link>
          <button
            type="button"
            className="ops-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="ops-main">
        <header className="ops-header">
          <div className="ops-header-title-row">
            <button
              type="button"
              className="ops-mobile-menu-btn"
              aria-label="Open operations menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            </button>
            <div>
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>
          </div>

          <div className="ops-header-actions">
            {headerRight}
            <div className="ops-admin-profile">
              <div className="ops-admin-avatar">
                {(user?.name || "A").charAt(0).toUpperCase()}
              </div>
              <div>
                <h3>{user?.name || "Administrator"}</h3>
                <span>{user?.role || "Admin"}</span>
              </div>
            </div>
          </div>
        </header>

        {checking ? (
          <div className="ops-panel">Verifying operations session...</div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}

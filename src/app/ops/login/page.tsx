"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon } from "@/components/ops/OpsIcons";

export default function OpsLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/ops/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to sign in.");
        return;
      }

      router.replace("/ops");
    } catch {
      setError("Network error while signing in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="ops-login-page">
      <section className="ops-login-card">
        <div className="ops-login-brand">
          <h1>Cravora</h1>
          <p>OPERATIONS PORTAL</p>
        </div>

        <div style={{ marginBottom: 22 }}>
          <h2 style={{ margin: "0 0 6px", fontSize: 22 }}>Welcome Back</h2>
          <p style={{ margin: 0, color: "#766D63", fontSize: 13 }}>
            Sign in to access your operations dashboard.
          </p>
        </div>

        {error && <div className="ops-alert error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="ops-field" style={{ marginBottom: 16 }}>
            <label htmlFor="ops-identifier">
              Username or Email<span className="ops-required-star">*</span>
            </label>
            <input
              id="ops-identifier"
              className="ops-input"
              style={{ height: 44 }}
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter your username or email"
              autoComplete="username"
              required
            />
          </div>

          <div className="ops-field" style={{ marginBottom: 22 }}>
            <label htmlFor="ops-password">
              Password<span className="ops-required-star">*</span>
            </label>
            <div style={{ position: "relative", display: "flex" }}>
              <input
                id="ops-password"
                className="ops-input"
                style={{ height: 44, width: "100%", paddingRight: 44 }}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="ops-password-toggle"
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="ops-btn"
            style={{ width: "100%", height: 44, fontSize: 13 }}
            disabled={submitting}
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </section>
    </main>
  );
}

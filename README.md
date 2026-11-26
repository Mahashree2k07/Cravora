# Cravora — Full-Stack Restaurant Ordering & Operations Platform

Unified Next.js 14 (App Router) + TypeScript + Prisma + PostgreSQL application combining the **Customer Storefront** and the **Operations Portal**.

## Features

### Customer Storefront
- `/` — Home page
- `/order` — Menu browsing with search, currency switch (`INR` / `USD`), course/cuisine/spice/mood/dietary filters
- `/order/cart` — Cart review and quantity controls
- `/order/checkout` — Pickup date/time scheduling & order submission (`POST /api/orders`, server-side pricing)
- `/dining` — Table reservation booking (`POST /api/dining-reservations`)
- `/my-activity` — Email OTP verification (`Resend` + HMAC-signed cookie) to view past orders & reservations
- `/about`, `/contact` — Story & enquiry form (`POST /api/contact`)

### Operations Portal (`/ops`)
- `/ops/login` — Staff authentication (`POST /api/ops/auth/login`, scrypt password hashing + signed HttpOnly cookie)
- `/ops` — Dashboard metrics, recent orders, upcoming reservations
- `/ops/orders` & `/ops/orders/[id]` — Order filtering, details, status updates (`pending` → `confirmed` → `preparing` → `ready_for_pickup` → `completed` / `cancelled`)
- `/ops/menu` — Create, edit, delete, and toggle menu item availability
- `/ops/filter-settings` — Configure customer-facing filter categories & visibility
- `/ops/reservations` — View, create, and update dining reservation statuses
- `/ops/customers` — Aggregated customer directory from orders & reservations
- `/ops/enquiries` — Review and update contact enquiry statuses
- `/ops/reports` — Revenue overview, order status breakdown, and top-selling items
- `/ops/settings` — Restaurant contact info, operating hours, and live order/reservation toggles

## Local Setup

```bash
pnpm install
cp .env.example .env          # configure DATABASE_URL, secrets, and RESEND_API_KEY
docker compose up -d          # starts PostgreSQL on localhost:5435
pnpm db:generate
pnpm db:migrate
pnpm db:seed                  # creates default admin user, settings, and menu items
pnpm dev                      # http://localhost:3000
```

Default admin seed credentials can be configured via `OPS_ADMIN_USERNAME`, `OPS_ADMIN_EMAIL`, and `OPS_ADMIN_PASSWORD` in `.env` before running `pnpm db:seed`.

-- AlterTable
ALTER TABLE "menu_items"
ADD COLUMN "is_available" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "display_order" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "staff_users" (
    "id" UUID NOT NULL,
    "username" VARCHAR(80) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "role" VARCHAR(40) NOT NULL DEFAULT 'admin',
    "password_hash" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "staff_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurant_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "restaurant_email" VARCHAR(255) NOT NULL DEFAULT 'hello@cravora.com',
    "restaurant_phone" VARCHAR(40) NOT NULL DEFAULT '+91 98765 43210',
    "restaurant_address" TEXT NOT NULL DEFAULT '42 Spice Courtyard, Bengaluru',
    "lunch_start" VARCHAR(10) NOT NULL DEFAULT '12:00',
    "lunch_end" VARCHAR(10) NOT NULL DEFAULT '15:00',
    "dinner_start" VARCHAR(10) NOT NULL DEFAULT '19:00',
    "dinner_end" VARCHAR(10) NOT NULL DEFAULT '22:00',
    "accept_online_orders" BOOLEAN NOT NULL DEFAULT true,
    "accept_dining_reservations" BOOLEAN NOT NULL DEFAULT true,
    "customer_filter_config" JSONB,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "restaurant_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "staff_users_username_key" ON "staff_users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "staff_users_email_key" ON "staff_users"("email");

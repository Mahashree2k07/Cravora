-- CreateTable
CREATE TABLE "courses" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuisine_regions" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "cuisine_regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_items" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "course_id" INTEGER,
    "cuisine_region_id" INTEGER,
    "spice_level" INTEGER,
    "retail_price_inr" DECIMAL(10,2),
    "retail_price_usd" DECIMAL(10,2),
    "is_signature" BOOLEAN NOT NULL DEFAULT false,
    "image_url" TEXT,

    CONSTRAINT "menu_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mood_tags" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "mood_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dietary_tags" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "dietary_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "allergens" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "allergens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_item_moods" (
    "menu_item_id" UUID NOT NULL,
    "mood_tag_id" INTEGER NOT NULL,

    CONSTRAINT "menu_item_moods_pkey" PRIMARY KEY ("menu_item_id","mood_tag_id")
);

-- CreateTable
CREATE TABLE "menu_item_dietary" (
    "menu_item_id" UUID NOT NULL,
    "dietary_tag_id" INTEGER NOT NULL,

    CONSTRAINT "menu_item_dietary_pkey" PRIMARY KEY ("menu_item_id","dietary_tag_id")
);

-- CreateTable
CREATE TABLE "menu_item_allergens" (
    "menu_item_id" UUID NOT NULL,
    "allergen_id" INTEGER NOT NULL,

    CONSTRAINT "menu_item_allergens_pkey" PRIMARY KEY ("menu_item_id","allergen_id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL,
    "order_number" VARCHAR(50) NOT NULL,
    "customer_name" VARCHAR(150) NOT NULL,
    "customer_phone" VARCHAR(20) NOT NULL,
    "customer_email" VARCHAR(255),
    "pickup_date" DATE NOT NULL,
    "pickup_time" TIME(0) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "tax" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" BIGSERIAL NOT NULL,
    "order_id" UUID NOT NULL,
    "menu_item_id" UUID,
    "item_name" VARCHAR(150) NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "line_total" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dining_reservations" (
    "id" UUID NOT NULL,
    "booking_number" VARCHAR(50) NOT NULL,
    "guest_name" VARCHAR(150) NOT NULL,
    "phone" VARCHAR(10) NOT NULL,
    "email" VARCHAR(255),
    "reservation_date" DATE NOT NULL,
    "reservation_time" TIME(0) NOT NULL,
    "guests" INTEGER NOT NULL,
    "duration" VARCHAR(30) NOT NULL,
    "seating_preference" VARCHAR(50) NOT NULL,
    "special_request" TEXT,
    "status" VARCHAR(30) NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dining_reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_enquiries" (
    "id" UUID NOT NULL,
    "enquiry_number" VARCHAR(50) NOT NULL,
    "customer_name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "subject" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'new',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_enquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_otp_challenges" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "otp_hash" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_otp_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_otp_sessions" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_otp_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "courses_name_key" ON "courses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "cuisine_regions_name_key" ON "cuisine_regions"("name");

-- CreateIndex
CREATE INDEX "menu_items_course_id_idx" ON "menu_items"("course_id");

-- CreateIndex
CREATE INDEX "menu_items_cuisine_region_id_idx" ON "menu_items"("cuisine_region_id");

-- CreateIndex
CREATE UNIQUE INDEX "mood_tags_name_key" ON "mood_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "dietary_tags_name_key" ON "dietary_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "allergens_name_key" ON "allergens"("name");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_number_key" ON "orders"("order_number");

-- CreateIndex
CREATE INDEX "orders_created_at_idx" ON "orders"("created_at");

-- CreateIndex
CREATE INDEX "orders_customer_phone_idx" ON "orders"("customer_phone");

-- CreateIndex
CREATE INDEX "order_items_order_id_idx" ON "order_items"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "dining_reservations_booking_number_key" ON "dining_reservations"("booking_number");

-- CreateIndex
CREATE INDEX "dining_reservations_reservation_date_idx" ON "dining_reservations"("reservation_date");

-- CreateIndex
CREATE INDEX "dining_reservations_phone_idx" ON "dining_reservations"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "contact_enquiries_enquiry_number_key" ON "contact_enquiries"("enquiry_number");

-- CreateIndex
CREATE INDEX "contact_enquiries_email_idx" ON "contact_enquiries"("email");

-- CreateIndex
CREATE INDEX "contact_enquiries_created_at_idx" ON "contact_enquiries"("created_at");

-- CreateIndex
CREATE INDEX "email_otp_challenges_email_idx" ON "email_otp_challenges"("email");

-- CreateIndex
CREATE INDEX "email_otp_challenges_expires_at_idx" ON "email_otp_challenges"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "email_otp_sessions_token_hash_key" ON "email_otp_sessions"("token_hash");

-- CreateIndex
CREATE INDEX "email_otp_sessions_email_idx" ON "email_otp_sessions"("email");

-- CreateIndex
CREATE INDEX "email_otp_sessions_expires_at_idx" ON "email_otp_sessions"("expires_at");

-- AddForeignKey
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_cuisine_region_id_fkey" FOREIGN KEY ("cuisine_region_id") REFERENCES "cuisine_regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_item_moods" ADD CONSTRAINT "menu_item_moods_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "menu_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_item_moods" ADD CONSTRAINT "menu_item_moods_mood_tag_id_fkey" FOREIGN KEY ("mood_tag_id") REFERENCES "mood_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_item_dietary" ADD CONSTRAINT "menu_item_dietary_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "menu_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_item_dietary" ADD CONSTRAINT "menu_item_dietary_dietary_tag_id_fkey" FOREIGN KEY ("dietary_tag_id") REFERENCES "dietary_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_item_allergens" ADD CONSTRAINT "menu_item_allergens_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "menu_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_item_allergens" ADD CONSTRAINT "menu_item_allergens_allergen_id_fkey" FOREIGN KEY ("allergen_id") REFERENCES "allergens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "menu_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

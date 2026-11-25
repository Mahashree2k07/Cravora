/*
  Warnings:

  - You are about to alter the column `subject` on the `contact_enquiries` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `otp_hash` on the `email_otp_challenges` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(64)`.
  - You are about to alter the column `token_hash` on the `email_otp_sessions` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(64)`.

*/
-- AlterTable
ALTER TABLE "contact_enquiries" ALTER COLUMN "subject" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "dining_reservations" ALTER COLUMN "duration" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "email_otp_challenges" ALTER COLUMN "otp_hash" SET DATA TYPE VARCHAR(64);

-- AlterTable
ALTER TABLE "email_otp_sessions" ALTER COLUMN "token_hash" SET DATA TYPE VARCHAR(64);

-- AlterTable
ALTER TABLE "menu_items" ALTER COLUMN "name" SET DATA TYPE VARCHAR(200);

-- AlterTable
ALTER TABLE "order_items" ALTER COLUMN "item_name" SET DATA TYPE VARCHAR(200);

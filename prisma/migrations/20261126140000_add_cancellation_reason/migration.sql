-- AlterTable
ALTER TABLE "orders"
ADD COLUMN "cancellation_reason" TEXT;

-- AlterTable
ALTER TABLE "dining_reservations"
ADD COLUMN "cancellation_reason" TEXT;

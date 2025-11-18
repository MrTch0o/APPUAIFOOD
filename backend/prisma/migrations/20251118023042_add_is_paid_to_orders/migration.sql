-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "is_paid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "payment_verified_at" TIMESTAMP(3);

/*
  Warnings:

  - The values [valid,expired,denied] on the enum `ScanStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `qr_code` on the `Visitor` table. All the data in the column will be lost.
  - You are about to drop the column `scanned` on the `Visitor` table. All the data in the column will be lost.
  - You are about to drop the `Security` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[qr_code_id]` on the table `Visitor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `qr_code_id` to the `QrScanLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Qr_code` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purpose` to the `Visitor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qr_code_id` to the `Visitor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Visitor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `validUntil` to the `Visitor` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VisitorStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
BEGIN;
CREATE TYPE "ScanStatus_new" AS ENUM ('VALID', 'EXPIRED', 'DENIED');
ALTER TABLE "QrScanLog" ALTER COLUMN "status" TYPE "ScanStatus_new" USING ("status"::text::"ScanStatus_new");
ALTER TYPE "ScanStatus" RENAME TO "ScanStatus_old";
ALTER TYPE "ScanStatus_new" RENAME TO "ScanStatus";
DROP TYPE "ScanStatus_old";
COMMIT;

-- DropIndex
DROP INDEX "Visitor_qr_code_key";

-- AlterTable
ALTER TABLE "QrScanLog" ADD COLUMN     "location" TEXT,
ADD COLUMN     "qr_code_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Qr_code" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Visitor" DROP COLUMN "qr_code",
DROP COLUMN "scanned",
ADD COLUMN     "purpose" TEXT NOT NULL,
ADD COLUMN     "qr_code_id" INTEGER NOT NULL,
ADD COLUMN     "status" "VisitorStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "validUntil" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Security";

-- CreateIndex
CREATE INDEX "QrScanLog_userId_idx" ON "QrScanLog"("userId");

-- CreateIndex
CREATE INDEX "QrScanLog_scannedById_idx" ON "QrScanLog"("scannedById");

-- CreateIndex
CREATE INDEX "QrScanLog_qr_code_id_idx" ON "QrScanLog"("qr_code_id");

-- CreateIndex
CREATE INDEX "Qr_code_user_id_idx" ON "Qr_code"("user_id");

-- CreateIndex
CREATE INDEX "Qr_code_code_idx" ON "Qr_code"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Visitor_qr_code_id_key" ON "Visitor"("qr_code_id");

-- CreateIndex
CREATE INDEX "Visitor_resident_id_idx" ON "Visitor"("resident_id");

-- AddForeignKey
ALTER TABLE "Visitor" ADD CONSTRAINT "Visitor_qr_code_id_fkey" FOREIGN KEY ("qr_code_id") REFERENCES "Qr_code"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QrScanLog" ADD CONSTRAINT "QrScanLog_qr_code_id_fkey" FOREIGN KEY ("qr_code_id") REFERENCES "Qr_code"("id") ON DELETE CASCADE ON UPDATE CASCADE;

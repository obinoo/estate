-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('RESIDENT', 'SECURITY', 'VISITOR');

-- CreateEnum
CREATE TYPE "ScanStatus" AS ENUM ('valid', 'expired', 'denied');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "house_no" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'RESIDENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visitor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resident_id" INTEGER NOT NULL,
    "qr_code" TEXT NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "scanned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Security" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Security_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Qr_code" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Qr_code_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QrScanLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "scannedById" INTEGER,
    "scan_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ScanStatus" NOT NULL,
    "entry_granted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "QrScanLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Visitor_email_key" ON "Visitor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Visitor_qr_code_key" ON "Visitor"("qr_code");

-- CreateIndex
CREATE UNIQUE INDEX "Security_email_key" ON "Security"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Qr_code_code_key" ON "Qr_code"("code");

-- AddForeignKey
ALTER TABLE "Visitor" ADD CONSTRAINT "Visitor_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Qr_code" ADD CONSTRAINT "Qr_code_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QrScanLog" ADD CONSTRAINT "QrScanLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QrScanLog" ADD CONSTRAINT "QrScanLog_scannedById_fkey" FOREIGN KEY ("scannedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

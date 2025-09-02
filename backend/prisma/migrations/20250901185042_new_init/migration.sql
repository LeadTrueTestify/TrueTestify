/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `AnalyticsEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ApiKey` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AudioAsset` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BillingAccount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Integration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Invoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Membership` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tenant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UsageRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VideoAsset` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Widget` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."AnalyticsEvent" DROP CONSTRAINT "AnalyticsEvent_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ApiKey" DROP CONSTRAINT "ApiKey_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ApiKey" DROP CONSTRAINT "ApiKey_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AudioAsset" DROP CONSTRAINT "AudioAsset_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."BillingAccount" DROP CONSTRAINT "BillingAccount_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Integration" DROP CONSTRAINT "Integration_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Invoice" DROP CONSTRAINT "Invoice_billingAccountId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Membership" DROP CONSTRAINT "Membership_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Membership" DROP CONSTRAINT "Membership_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_audioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_videoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_widgetId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Subscription" DROP CONSTRAINT "Subscription_billingAccountId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UsageRecord" DROP CONSTRAINT "UsageRecord_billingAccountId_fkey";

-- DropForeignKey
ALTER TABLE "public"."VideoAsset" DROP CONSTRAINT "VideoAsset_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Widget" DROP CONSTRAINT "Widget_tenantId_fkey";

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "passwordHash",
ADD COLUMN     "password" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "public"."AnalyticsEvent";

-- DropTable
DROP TABLE "public"."ApiKey";

-- DropTable
DROP TABLE "public"."AudioAsset";

-- DropTable
DROP TABLE "public"."BillingAccount";

-- DropTable
DROP TABLE "public"."Integration";

-- DropTable
DROP TABLE "public"."Invoice";

-- DropTable
DROP TABLE "public"."Membership";

-- DropTable
DROP TABLE "public"."Review";

-- DropTable
DROP TABLE "public"."Subscription";

-- DropTable
DROP TABLE "public"."Tenant";

-- DropTable
DROP TABLE "public"."UsageRecord";

-- DropTable
DROP TABLE "public"."VideoAsset";

-- DropTable
DROP TABLE "public"."Widget";

-- DropEnum
DROP TYPE "public"."BillingState";

-- DropEnum
DROP TYPE "public"."IntegrationKind";

-- DropEnum
DROP TYPE "public"."ReviewStatus";

-- DropEnum
DROP TYPE "public"."Role";

-- DropEnum
DROP TYPE "public"."WidgetLayout";

-- CreateTable
CREATE TABLE "public"."Business" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "brandColor" TEXT,
    "website" TEXT,
    "contactEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BusinessUser" (
    "id" SERIAL NOT NULL,
    "businessId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'owner',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Business_slug_key" ON "public"."Business"("slug");

-- CreateIndex
CREATE INDEX "ix_businesses_slug" ON "public"."Business"("slug");

-- CreateIndex
CREATE INDEX "ix_businesses_id" ON "public"."Business"("id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_businesses_slug" ON "public"."Business"("slug");

-- CreateIndex
CREATE INDEX "ix_business_users_business_id" ON "public"."BusinessUser"("businessId");

-- CreateIndex
CREATE INDEX "ix_business_users_user_id" ON "public"."BusinessUser"("userId");

-- CreateIndex
CREATE INDEX "ix_business_users_business_id_role" ON "public"."BusinessUser"("businessId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessUser_businessId_userId_key" ON "public"."BusinessUser"("businessId", "userId");

-- CreateIndex
CREATE INDEX "ix_users_email" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."BusinessUser" ADD CONSTRAINT "BusinessUser_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "public"."Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BusinessUser" ADD CONSTRAINT "BusinessUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

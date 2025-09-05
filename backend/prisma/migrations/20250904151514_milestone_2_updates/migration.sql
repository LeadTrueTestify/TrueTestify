/*
  Warnings:

  - The primary key for the `BusinessUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `audioUrl` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `mediaAssetId` on the `TranscodeJob` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[businessId,userId]` on the table `BusinessUser` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `BusinessUser` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Made the column `reviewId` on table `MediaAsset` required. This step will fail if there are existing NULL values in that column.
  - Made the column `assetType` on table `MediaAsset` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sizeBytes` on table `MediaAsset` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `inputAssetId` to the `TranscodeJob` table without a default value. This is not possible if the table is not empty.
  - Added the required column `target` to the `TranscodeJob` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_businessId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TranscodeJob" DROP CONSTRAINT "TranscodeJob_mediaAssetId_fkey";

-- AlterTable
ALTER TABLE "public"."BusinessUser" DROP CONSTRAINT "BusinessUser_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'owner',
ADD CONSTRAINT "BusinessUser_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."MediaAsset" ALTER COLUMN "reviewId" SET NOT NULL,
ALTER COLUMN "assetType" SET NOT NULL,
ALTER COLUMN "sizeBytes" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Review" DROP COLUMN "audioUrl",
DROP COLUMN "videoUrl",
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "reviewerContactJson" JSONB,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "bodyText" DROP NOT NULL,
ALTER COLUMN "rating" DROP NOT NULL,
ALTER COLUMN "reviewerName" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'pending',
ALTER COLUMN "submittedAt" DROP NOT NULL,
ALTER COLUMN "submittedAt" DROP DEFAULT,
ALTER COLUMN "source" SET DEFAULT 'website';

-- AlterTable
ALTER TABLE "public"."TranscodeJob" DROP COLUMN "mediaAssetId",
ADD COLUMN     "error" TEXT,
ADD COLUMN     "inputAssetId" TEXT NOT NULL,
ADD COLUMN     "target" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "BusinessUser_businessId_idx" ON "public"."BusinessUser"("businessId");

-- CreateIndex
CREATE INDEX "BusinessUser_userId_idx" ON "public"."BusinessUser"("userId");

-- CreateIndex
CREATE INDEX "BusinessUser_businessId_userId_idx" ON "public"."BusinessUser"("businessId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessUser_businessId_userId_key" ON "public"."BusinessUser"("businessId", "userId");

-- CreateIndex
CREATE INDEX "ix_media_assets_business_id_review_id" ON "public"."MediaAsset"("businessId", "reviewId");

-- CreateIndex
CREATE INDEX "MediaAsset_businessId_idx" ON "public"."MediaAsset"("businessId");

-- CreateIndex
CREATE INDEX "ix_reviews_business_id_status" ON "public"."Review"("businessId", "status");

-- CreateIndex
CREATE INDEX "ix_reviews_business_id_submitted_at" ON "public"."Review"("businessId", "submittedAt");

-- CreateIndex
CREATE INDEX "ix_transcode_jobs_business_id_review_id" ON "public"."TranscodeJob"("businessId", "reviewId");

-- CreateIndex
CREATE INDEX "TranscodeJob_businessId_idx" ON "public"."TranscodeJob"("businessId");

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "public"."Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TranscodeJob" ADD CONSTRAINT "TranscodeJob_inputAssetId_fkey" FOREIGN KEY ("inputAssetId") REFERENCES "public"."MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

UPDATE "BusinessUser" SET "id" = gen_random_uuid() WHERE "id" IS NULL;
UPDATE "MediaAsset" SET "sizeBytes" = 0 WHERE "sizeBytes" IS NULL;
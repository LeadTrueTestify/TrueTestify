/*
  Warnings:

  - You are about to drop the column `consentChecked` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Review` table. All the data in the column will be lost.
  - Made the column `title` on table `Review` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bodyText` on table `Review` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rating` on table `Review` required. This step will fail if there are existing NULL values in that column.
  - Made the column `reviewerName` on table `Review` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."MediaAsset" DROP CONSTRAINT "MediaAsset_reviewId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_businessId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TranscodeJob" DROP CONSTRAINT "TranscodeJob_reviewId_fkey";

-- AlterTable
ALTER TABLE "public"."Review" DROP COLUMN "consentChecked",
DROP COLUMN "createdAt",
DROP COLUMN "source",
DROP COLUMN "updatedAt",
ADD COLUMN     "audioUrl" TEXT,
ADD COLUMN     "videoUrl" TEXT,
ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "bodyText" SET NOT NULL,
ALTER COLUMN "rating" SET NOT NULL,
ALTER COLUMN "reviewerName" SET NOT NULL,
ALTER COLUMN "status" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "Review_businessId_idx" ON "public"."Review"("businessId");

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "public"."Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

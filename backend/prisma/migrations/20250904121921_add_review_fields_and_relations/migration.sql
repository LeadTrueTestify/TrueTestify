/*
  Warnings:

  - Added the required column `updatedAt` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Review" ADD COLUMN     "consentChecked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."MediaAsset" ADD CONSTRAINT "MediaAsset_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "public"."Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TranscodeJob" ADD CONSTRAINT "TranscodeJob_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "public"."Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

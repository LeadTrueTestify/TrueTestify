-- AlterTable
ALTER TABLE "public"."Business" ALTER COLUMN "slug" SET DATA TYPE CITEXT;

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "email" SET DATA TYPE CITEXT;

-- CreateTable
CREATE TABLE "public"."Review" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "title" TEXT,
    "bodyText" TEXT,
    "rating" INTEGER,
    "reviewerName" TEXT,
    "reviewerContactJson" JSONB,
    "consentChecked" BOOLEAN NOT NULL DEFAULT false,
    "source" TEXT,
    "submittedAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MediaAsset" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "assetType" TEXT NOT NULL,
    "s3Key" TEXT NOT NULL,
    "durationSec" INTEGER,
    "sizeBytes" INTEGER NOT NULL,
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TranscodeJob" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "inputAssetId" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TranscodeJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ix_reviews_business_id_status" ON "public"."Review"("businessId", "status");

-- CreateIndex
CREATE INDEX "ix_reviews_business_id_submitted_at" ON "public"."Review"("businessId", "submittedAt");

-- CreateIndex
CREATE INDEX "ix_reviews_business_id_id" ON "public"."Review"("businessId", "id");

-- CreateIndex
CREATE INDEX "ix_media_assets_business_id_review_id" ON "public"."MediaAsset"("businessId", "reviewId");

-- CreateIndex
CREATE INDEX "ix_media_assets_business_id_id" ON "public"."MediaAsset"("businessId", "id");

-- CreateIndex
CREATE INDEX "ix_transcode_jobs_business_id_review_id" ON "public"."TranscodeJob"("businessId", "reviewId");

-- CreateIndex
CREATE INDEX "ix_transcode_jobs_business_id_id" ON "public"."TranscodeJob"("businessId", "id");

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "public"."Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MediaAsset" ADD CONSTRAINT "MediaAsset_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "public"."Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MediaAsset" ADD CONSTRAINT "MediaAsset_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "public"."Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TranscodeJob" ADD CONSTRAINT "TranscodeJob_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "public"."Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TranscodeJob" ADD CONSTRAINT "TranscodeJob_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "public"."Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TranscodeJob" ADD CONSTRAINT "TranscodeJob_inputAssetId_fkey" FOREIGN KEY ("inputAssetId") REFERENCES "public"."MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

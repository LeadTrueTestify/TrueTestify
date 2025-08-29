-- AlterTable
ALTER TABLE "public"."Review" ADD COLUMN     "viewsCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."Widget" ADD COLUMN     "viewsCount" INTEGER NOT NULL DEFAULT 0;

/*
  Warnings:

  - The primary key for the `Business` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `BusinessUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."BusinessUser" DROP CONSTRAINT "BusinessUser_businessId_fkey";

-- DropForeignKey
ALTER TABLE "public"."BusinessUser" DROP CONSTRAINT "BusinessUser_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Business" DROP CONSTRAINT "Business_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Business_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Business_id_seq";

-- AlterTable
ALTER TABLE "public"."BusinessUser" DROP CONSTRAINT "BusinessUser_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "businessId" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "BusinessUser_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "BusinessUser_id_seq";

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AddForeignKey
ALTER TABLE "public"."BusinessUser" ADD CONSTRAINT "BusinessUser_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "public"."Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BusinessUser" ADD CONSTRAINT "BusinessUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

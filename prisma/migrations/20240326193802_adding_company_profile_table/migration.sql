/*
  Warnings:

  - Changed the type of `lastUpdatedAt` on the `PersonProfile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "PersonProfile" DROP COLUMN "lastUpdatedAt",
ADD COLUMN     "lastUpdatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "CompanyProfile" (
    "linkedInUrl" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "sizeFrom" INTEGER NOT NULL,
    "sizeTo" INTEGER NOT NULL,
    "size" INTEGER NOT NULL,
    "industry" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "foundedYear" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "tagLine" TEXT NOT NULL,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyProfile_pkey" PRIMARY KEY ("linkedInUrl")
);

-- CreateIndex
CREATE INDEX "CompanyProfile_website_idx" ON "CompanyProfile"("website");

/*
  Warnings:

  - You are about to drop the `PersonExperiences` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PersonExperiences" DROP CONSTRAINT "PersonExperiences_personProfileId_fkey";

-- DropTable
DROP TABLE "PersonExperiences";

-- CreateTable
CREATE TABLE "PersonExperience" (
    "id" TEXT NOT NULL,
    "personProfileId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyLinkedInUrl" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "jobDescription" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyProfile" (
    "id" TEXT NOT NULL,
    "linkedInUrl" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "sizeFrom" INTEGER NOT NULL,
    "sizeTo" INTEGER NOT NULL,
    "industry" TEXT NOT NULL,
    "foundedYear" INTEGER NOT NULL,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyProfileCategory" (
    "id" TEXT NOT NULL,
    "companyProfileId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyProfileCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyProfile_linkedInUrl_key" ON "CompanyProfile"("linkedInUrl");

-- CreateIndex
CREATE INDEX "CompanyProfile_website_idx" ON "CompanyProfile"("website");

-- CreateIndex
CREATE INDEX "CompanyProfile_linkedInUrl_idx" ON "CompanyProfile"("linkedInUrl");

-- CreateIndex
CREATE INDEX "CompanyProfileCategory_categoryId_idx" ON "CompanyProfileCategory"("categoryId");

-- CreateIndex
CREATE INDEX "CompanyProfileCategory_companyProfileId_idx" ON "CompanyProfileCategory"("companyProfileId");

-- CreateIndex
CREATE INDEX "Category_name_idx" ON "Category"("name");

-- AddForeignKey
ALTER TABLE "PersonExperience" ADD CONSTRAINT "PersonExperience_personProfileId_fkey" FOREIGN KEY ("personProfileId") REFERENCES "PersonProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyProfileCategory" ADD CONSTRAINT "CompanyProfileCategory_companyProfileId_fkey" FOREIGN KEY ("companyProfileId") REFERENCES "CompanyProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyProfileCategory" ADD CONSTRAINT "CompanyProfileCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - The primary key for the `CompanyProfileCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `CompanyProfileCategory` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "CompanyProfileCategory_categoryId_idx";

-- DropIndex
DROP INDEX "CompanyProfileCategory_companyProfileId_idx";

-- AlterTable
ALTER TABLE "CompanyProfileCategory" DROP CONSTRAINT "CompanyProfileCategory_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "CompanyProfileCategory_pkey" PRIMARY KEY ("companyProfileId", "categoryId");

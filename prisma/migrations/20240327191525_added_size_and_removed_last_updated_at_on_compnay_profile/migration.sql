/*
  Warnings:

  - You are about to drop the column `lastUpdatedAt` on the `CompanyProfile` table. All the data in the column will be lost.
  - Added the required column `size` to the `CompanyProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CompanyProfile" DROP COLUMN "lastUpdatedAt",
ADD COLUMN     "size" INTEGER NOT NULL;

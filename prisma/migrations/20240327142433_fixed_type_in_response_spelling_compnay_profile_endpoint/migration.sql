/*
  Warnings:

  - You are about to drop the column `respone` on the `CompanyProfileEndpoint` table. All the data in the column will be lost.
  - Added the required column `response` to the `CompanyProfileEndpoint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CompanyProfileEndpoint" DROP COLUMN "respone",
ADD COLUMN     "response" JSONB NOT NULL;

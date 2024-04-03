/*
  Warnings:

  - Made the column `companyLinkedInUrl` on table `PersonExperience` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PersonExperience" ALTER COLUMN "companyLinkedInUrl" SET NOT NULL;

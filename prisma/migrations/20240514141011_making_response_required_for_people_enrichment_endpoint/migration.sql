/*
  Warnings:

  - Made the column `response` on table `PeopleEnrichmentEndpoint` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PeopleEnrichmentEndpoint" ALTER COLUMN "response" SET NOT NULL;

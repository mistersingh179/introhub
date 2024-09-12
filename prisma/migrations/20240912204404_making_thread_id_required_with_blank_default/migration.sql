/*
  Warnings:

  - Made the column `threadId` on table `Introduction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Introduction" ALTER COLUMN "threadId" SET NOT NULL,
ALTER COLUMN "threadId" SET DEFAULT '';

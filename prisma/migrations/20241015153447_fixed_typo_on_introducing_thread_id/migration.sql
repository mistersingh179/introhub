/*
  Warnings:

  - You are about to drop the column `introducingEmailThreadcId` on the `Introduction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Introduction" DROP COLUMN "introducingEmailThreadcId",
ADD COLUMN     "introducingEmailThreadId" TEXT;

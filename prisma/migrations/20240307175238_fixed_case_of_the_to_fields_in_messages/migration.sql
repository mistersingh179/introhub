/*
  Warnings:

  - You are about to drop the column `ToAddress` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `ToName` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "ToAddress",
DROP COLUMN "ToName",
ADD COLUMN     "toAddress" TEXT,
ADD COLUMN     "toName" TEXT;

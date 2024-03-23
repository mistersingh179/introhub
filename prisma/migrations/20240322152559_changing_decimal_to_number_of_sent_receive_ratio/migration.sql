/*
  Warnings:

  - You are about to alter the column `sentReceivedRatio` on the `Contact` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Contact" ALTER COLUMN "sentReceivedRatio" SET DATA TYPE INTEGER;

-- CreateIndex
CREATE INDEX "Introduction_createdAt_idx" ON "Introduction"("createdAt");

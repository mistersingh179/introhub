/*
  Warnings:

  - You are about to drop the column `bcc` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `cc` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `from` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `to` on the `Message` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Message_from_idx";

-- DropIndex
DROP INDEX "Message_receivedAt_idx";

-- DropIndex
DROP INDEX "Message_threadId_idx";

-- DropIndex
DROP INDEX "Message_userId_idx";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "bcc",
DROP COLUMN "cc",
DROP COLUMN "from",
DROP COLUMN "to",
ADD COLUMN     "fromAddress" TEXT,
ADD COLUMN     "fromName" TEXT,
ADD COLUMN     "replyToAddress" TEXT,
ADD COLUMN     "replyToName" TEXT;

-- CreateIndex
CREATE INDEX "Message_userId_createdAt_idx" ON "Message"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Message_userId_threadId_idx" ON "Message"("userId", "threadId");

-- CreateIndex
CREATE INDEX "Message_userId_receivedAt_idx" ON "Message"("userId", "receivedAt");

-- CreateIndex
CREATE INDEX "Message_fromAddress_idx" ON "Message"("fromAddress");

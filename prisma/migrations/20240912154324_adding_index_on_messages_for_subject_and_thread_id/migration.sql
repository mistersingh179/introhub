-- AlterTable
ALTER TABLE "User" ALTER COLUMN "agreedToAutoProspecting" SET DEFAULT false;

-- CreateIndex
CREATE INDEX "Message_threadId_idx" ON "Message"("threadId");

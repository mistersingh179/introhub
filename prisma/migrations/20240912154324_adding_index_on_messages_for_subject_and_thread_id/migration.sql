-- AlterTable
ALTER TABLE "User" ALTER COLUMN "agreedToAutoProspecting" SET DEFAULT false;

-- CreateIndex
CREATE INDEX "Message_subject_idx" ON "Message"("subject");

-- CreateIndex
CREATE INDEX "Message_threadId_idx" ON "Message"("threadId");

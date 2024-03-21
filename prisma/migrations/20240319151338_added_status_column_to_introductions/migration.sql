-- AlterTable
ALTER TABLE "Introduction" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'draft';

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

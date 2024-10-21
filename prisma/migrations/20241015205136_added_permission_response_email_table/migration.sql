-- CreateTable
CREATE TABLE "PermissionResponseEmail" (
    "id" TEXT NOT NULL,
    "introductionId" TEXT NOT NULL,
    "fromEmail" TEXT NOT NULL,
    "toEmail" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "bodyText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PermissionResponseEmail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PermissionResponseEmail_introductionId_idx" ON "PermissionResponseEmail"("introductionId");

-- AddForeignKey
ALTER TABLE "PermissionResponseEmail" ADD CONSTRAINT "PermissionResponseEmail_introductionId_fkey" FOREIGN KEY ("introductionId") REFERENCES "Introduction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

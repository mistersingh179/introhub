-- CreateTable
CREATE TABLE "Introduction" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "facilitatorId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Introduction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Introduction_requesterId_idx" ON "Introduction"("requesterId");

-- CreateIndex
CREATE INDEX "Introduction_facilitatorId_idx" ON "Introduction"("facilitatorId");

-- CreateIndex
CREATE INDEX "Introduction_contactId_idx" ON "Introduction"("contactId");

-- AddForeignKey
ALTER TABLE "Introduction" ADD CONSTRAINT "Introduction_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Introduction" ADD CONSTRAINT "Introduction_facilitatorId_fkey" FOREIGN KEY ("facilitatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Introduction" ADD CONSTRAINT "Introduction_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

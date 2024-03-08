-- DropIndex
DROP INDEX "Message_userId_createdAt_idx";

-- DropIndex
DROP INDEX "Message_userId_receivedAt_idx";

-- DropIndex
DROP INDEX "Message_userId_threadId_idx";

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "sendCount" INTEGER NOT NULL,
    "receivedCount" INTEGER NOT NULL,
    "sendReceiveRatio" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Contact_userId_idx" ON "Contact"("userId");

-- CreateIndex
CREATE INDEX "Contact_email_idx" ON "Contact"("email");

-- CreateIndex
CREATE INDEX "Contact_sendCount_idx" ON "Contact"("sendCount");

-- CreateIndex
CREATE INDEX "Contact_receivedCount_idx" ON "Contact"("receivedCount");

-- CreateIndex
CREATE INDEX "Contact_sendReceiveRatio_idx" ON "Contact"("sendReceiveRatio");

-- CreateIndex
CREATE INDEX "Message_userId_idx" ON "Message"("userId");

-- CreateIndex
CREATE INDEX "Message_receivedAt_idx" ON "Message"("receivedAt");

-- CreateIndex
CREATE INDEX "Message_toAddress_idx" ON "Message"("toAddress");

-- CreateIndex
CREATE INDEX "Message_fromAddress_toAddress_idx" ON "Message"("fromAddress", "toAddress");

-- CreateIndex
CREATE INDEX "Message_deliveredTo_fromAddress_idx" ON "Message"("deliveredTo", "fromAddress");

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "Competition" (
    "id" TEXT NOT NULL,
    "initiatorId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Competition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Competition_initiatorId_idx" ON "Competition"("initiatorId");

-- CreateIndex
CREATE INDEX "Competition_receiverId_idx" ON "Competition"("receiverId");

-- CreateIndex
CREATE UNIQUE INDEX "Competition_initiatorId_receiverId_key" ON "Competition"("initiatorId", "receiverId");

-- CreateIndex
CREATE UNIQUE INDEX "Competition_receiverId_initiatorId_key" ON "Competition"("receiverId", "initiatorId");

-- AddForeignKey
ALTER TABLE "Competition" ADD CONSTRAINT "Competition_initiatorId_fkey" FOREIGN KEY ("initiatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competition" ADD CONSTRAINT "Competition_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

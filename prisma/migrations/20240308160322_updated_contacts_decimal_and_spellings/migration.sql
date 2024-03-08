/*
  Warnings:

  - You are about to drop the column `sendCount` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `sendReceiveRatio` on the `Contact` table. All the data in the column will be lost.
  - Added the required column `sentCount` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sentReceivedRatio` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Contact_sendCount_idx";

-- DropIndex
DROP INDEX "Contact_sendReceiveRatio_idx";

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "sendCount",
DROP COLUMN "sendReceiveRatio",
ADD COLUMN     "sentCount" INTEGER NOT NULL,
ADD COLUMN     "sentReceivedRatio" DECIMAL(10,2) NOT NULL;

-- CreateIndex
CREATE INDEX "Contact_sentCount_idx" ON "Contact"("sentCount");

-- CreateIndex
CREATE INDEX "Contact_sentReceivedRatio_idx" ON "Contact"("sentReceivedRatio");

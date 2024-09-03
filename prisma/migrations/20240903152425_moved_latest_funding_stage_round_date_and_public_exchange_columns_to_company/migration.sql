/*
  Warnings:

  - You are about to drop the column `latestFundingRoundDate` on the `PersonProfile` table. All the data in the column will be lost.
  - You are about to drop the column `latestFundingStage` on the `PersonProfile` table. All the data in the column will be lost.
  - You are about to drop the column `publiclyTradedExchange` on the `PersonProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CompanyProfile" ADD COLUMN     "latestFundingRoundDate" TIMESTAMP(3),
ADD COLUMN     "latestFundingStage" TEXT,
ADD COLUMN     "publiclyTradedExchange" TEXT;

-- AlterTable
ALTER TABLE "PersonProfile" DROP COLUMN "latestFundingRoundDate",
DROP COLUMN "latestFundingStage",
DROP COLUMN "publiclyTradedExchange";

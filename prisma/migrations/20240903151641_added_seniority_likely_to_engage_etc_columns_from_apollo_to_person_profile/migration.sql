-- AlterTable
ALTER TABLE "PersonProfile" ADD COLUMN     "isLikelyToEngage" BOOLEAN,
ADD COLUMN     "latestFundingRoundDate" TIMESTAMP(3),
ADD COLUMN     "latestFundingStage" TEXT,
ADD COLUMN     "publiclyTradedExchange" TEXT,
ADD COLUMN     "seniority" TEXT;

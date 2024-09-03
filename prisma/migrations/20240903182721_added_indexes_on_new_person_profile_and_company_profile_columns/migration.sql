-- CreateIndex
CREATE INDEX "CompanyProfile_size_idx" ON "CompanyProfile"("size");

-- CreateIndex
CREATE INDEX "CompanyProfile_foundedYear_idx" ON "CompanyProfile"("foundedYear");

-- CreateIndex
CREATE INDEX "CompanyProfile_latestFundingRoundDate_idx" ON "CompanyProfile"("latestFundingRoundDate");

-- CreateIndex
CREATE INDEX "CompanyProfile_latestFundingStage_idx" ON "CompanyProfile"("latestFundingStage");

-- CreateIndex
CREATE INDEX "CompanyProfile_publiclyTradedExchange_idx" ON "CompanyProfile"("publiclyTradedExchange");

-- CreateIndex
CREATE INDEX "PersonExperience_companyName_idx" ON "PersonExperience"("companyName");

-- CreateIndex
CREATE INDEX "PersonProfile_seniority_idx" ON "PersonProfile"("seniority");

-- CreateIndex
CREATE INDEX "PersonProfile_isLikelyToEngage_idx" ON "PersonProfile"("isLikelyToEngage");

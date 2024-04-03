-- CreateIndex
CREATE INDEX "CompanyProfile_industry_idx" ON "CompanyProfile"("industry");

-- CreateIndex
CREATE INDEX "PersonExperience_personProfileId_idx" ON "PersonExperience"("personProfileId");

-- CreateIndex
CREATE INDEX "PersonExperience_jobTitle_idx" ON "PersonExperience"("jobTitle");

-- CreateIndex
CREATE INDEX "PersonProfile_city_idx" ON "PersonProfile"("city");

-- CreateIndex
CREATE INDEX "PersonProfile_state_idx" ON "PersonProfile"("state");

-- CreateIndex
CREATE INDEX "PersonProfile_email_idx" ON "PersonProfile"("email");

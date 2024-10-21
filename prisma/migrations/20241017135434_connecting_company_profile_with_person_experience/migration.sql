-- CreateIndex
CREATE INDEX "PersonExperience_companyLinkedInUrl_idx" ON "PersonExperience"("companyLinkedInUrl");

-- AddForeignKey
ALTER TABLE "PersonExperience" ADD CONSTRAINT "PersonExperience_companyLinkedInUrl_fkey" FOREIGN KEY ("companyLinkedInUrl") REFERENCES "CompanyProfile"("linkedInUrl") ON DELETE CASCADE ON UPDATE CASCADE;

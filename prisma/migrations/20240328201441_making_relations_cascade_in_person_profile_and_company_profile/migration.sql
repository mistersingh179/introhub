-- DropForeignKey
ALTER TABLE "CompanyProfileCategory" DROP CONSTRAINT "CompanyProfileCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "CompanyProfileCategory" DROP CONSTRAINT "CompanyProfileCategory_companyProfileId_fkey";

-- DropForeignKey
ALTER TABLE "PersonExperience" DROP CONSTRAINT "PersonExperience_personProfileId_fkey";

-- AddForeignKey
ALTER TABLE "PersonExperience" ADD CONSTRAINT "PersonExperience_personProfileId_fkey" FOREIGN KEY ("personProfileId") REFERENCES "PersonProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyProfileCategory" ADD CONSTRAINT "CompanyProfileCategory_companyProfileId_fkey" FOREIGN KEY ("companyProfileId") REFERENCES "CompanyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyProfileCategory" ADD CONSTRAINT "CompanyProfileCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

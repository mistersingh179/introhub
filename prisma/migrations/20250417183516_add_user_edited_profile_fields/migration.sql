-- Add fields to PersonProfile
ALTER TABLE "PersonProfile" ADD COLUMN "userEditedFullName" TEXT;
ALTER TABLE "PersonProfile" ADD COLUMN "userEditedLinkedInUrl" TEXT;
ALTER TABLE "PersonProfile" ADD COLUMN "userEditedHeadline" TEXT;
ALTER TABLE "PersonProfile" ADD COLUMN "userEditedCity" TEXT;
ALTER TABLE "PersonProfile" ADD COLUMN "userEditedCountry" TEXT;
ALTER TABLE "PersonProfile" ADD COLUMN "userEditedState" TEXT;
ALTER TABLE "PersonProfile" ADD COLUMN "userEditedSeniority" TEXT;
ALTER TABLE "PersonProfile" ADD COLUMN "isUserEdited" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "PersonProfile" ADD COLUMN "lastUserEditAt" TIMESTAMP(3);

-- Add fields to PersonExperience
ALTER TABLE "PersonExperience" ADD COLUMN "userEditedCompanyName" TEXT;
ALTER TABLE "PersonExperience" ADD COLUMN "userEditedCompanyLinkedInUrl" TEXT;
ALTER TABLE "PersonExperience" ADD COLUMN "userEditedJobTitle" TEXT;
ALTER TABLE "PersonExperience" ADD COLUMN "userEditedJobDescription" TEXT;
ALTER TABLE "PersonExperience" ADD COLUMN "isUserEdited" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "PersonExperience" ADD COLUMN "lastUserEditAt" TIMESTAMP(3); 
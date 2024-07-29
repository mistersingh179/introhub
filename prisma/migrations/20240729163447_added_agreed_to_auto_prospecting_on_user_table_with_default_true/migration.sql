-- AlterTable
ALTER TABLE "User"
    ADD COLUMN "agreedToAutoProspecting" BOOLEAN NOT NULL DEFAULT true;

-- set all existing users to have false for agreed to auto prospecting
UPDATE "User"
set "agreedToAutoProspecting" = false;
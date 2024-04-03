-- CreateTable
CREATE TABLE "PersonProfile" (
    "email" TEXT NOT NULL,
    "linkedInUrl" TEXT NOT NULL,
    "companyLinkedInUrl" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "jobDescription" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "lastUpdatedAt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonProfile_pkey" PRIMARY KEY ("email")
);

-- CreateIndex
CREATE UNIQUE INDEX "PersonProfile_linkedInUrl_key" ON "PersonProfile"("linkedInUrl");

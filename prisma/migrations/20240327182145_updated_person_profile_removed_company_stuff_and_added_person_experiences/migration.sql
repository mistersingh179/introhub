/*
  Warnings:

  - The primary key for the `PersonProfile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `companyLinkedInUrl` on the `PersonProfile` table. All the data in the column will be lost.
  - You are about to drop the column `companyName` on the `PersonProfile` table. All the data in the column will be lost.
  - You are about to drop the column `headline` on the `PersonProfile` table. All the data in the column will be lost.
  - You are about to drop the column `jobDescription` on the `PersonProfile` table. All the data in the column will be lost.
  - You are about to drop the column `jobTitle` on the `PersonProfile` table. All the data in the column will be lost.
  - You are about to drop the column `occupation` on the `PersonProfile` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `PersonProfile` table. All the data in the column will be lost.
  - You are about to drop the `CompanyProfile` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `PersonProfile` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `PersonProfile` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "PersonProfile" DROP CONSTRAINT "PersonProfile_pkey",
DROP COLUMN "companyLinkedInUrl",
DROP COLUMN "companyName",
DROP COLUMN "headline",
DROP COLUMN "jobDescription",
DROP COLUMN "jobTitle",
DROP COLUMN "occupation",
DROP COLUMN "summary",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "PersonProfile_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "CompanyProfile";

-- CreateTable
CREATE TABLE "PersonExperiences" (
    "id" TEXT NOT NULL,
    "personProfileId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyLinkedInUrl" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "jobDescription" TEXT NOT NULL,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonExperiences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PersonProfile_email_key" ON "PersonProfile"("email");

-- AddForeignKey
ALTER TABLE "PersonExperiences" ADD CONSTRAINT "PersonExperiences_personProfileId_fkey" FOREIGN KEY ("personProfileId") REFERENCES "PersonProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

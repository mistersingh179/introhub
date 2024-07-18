/*
  Warnings:

  - Added the required column `forwardableBlurb` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "forwardableBlurb" TEXT NOT NULL;

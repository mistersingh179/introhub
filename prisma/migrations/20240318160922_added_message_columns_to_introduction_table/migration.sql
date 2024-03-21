/*
  Warnings:

  - Added the required column `messageForContact` to the `Introduction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `messageForFaciliator` to the `Introduction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Introduction" ADD COLUMN     "messageForContact" TEXT NOT NULL,
ADD COLUMN     "messageForFaciliator" TEXT NOT NULL;
